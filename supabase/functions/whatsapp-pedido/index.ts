import { createClient } from 'npm:@supabase/supabase-js@2';

// Invoque exclusivamente pelo Database Webhook ou por rotina protegida.
// No deploy: --no-verify-jwt. Autenticação independente pelo segredo do webhook.
Deno.serve(async (req) => {
  const reply = (message: string, status = 200) => new Response(JSON.stringify({ message }), {
    status, headers: { 'content-type': 'application/json' },
  });
  if (req.method !== 'POST') return reply('Método não permitido', 405);
  const secret = Deno.env.get('WHATSAPP_WEBHOOK_SECRET');
  if (!secret || secret.length < 32 || req.headers.get('x-webhook-secret') !== secret) return reply('Não autorizado', 401);

  const payload = await req.json().catch(() => null);
  // O webhook do Supabase envia record.id; a rotina também aceita pedido_id.
  const id = payload?.record?.pedido_id || payload?.pedido_id;
  if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(id)) return reply('ID inválido', 400);
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return reply('Supabase não configurado', 500);
  const db = createClient(url, key, { auth: { persistSession: false } });
  const {data: fila} = await db.from('loja_whatsapp_notificacoes').select('status').eq('pedido_id',id).maybeSingle();
  if (!fila || !['pendente','erro'].includes(fila.status)) return reply('Já processado ou indisponível');
  const {data: reserved, error: reserveErr} = await db.rpc('reservar_notificacao_whatsapp',{p_pedido_id:id});
  if (reserveErr) return reply('Falha ao reservar',500);
  if (!reserved) return reply('Já reservado');
  const falha = async (message: string, status = 'erro') => {
    await db.from('loja_whatsapp_notificacoes').update({status,erro:message.slice(0,300),updated_at:new Date().toISOString()}).eq('pedido_id',id);
    return reply(message, 200); // Sem reenfileiramento infinito pelo webhook
  };
  try {
    const {data: pedido,error: orderErr} = await db.from('loja_pedidos').select('id,user_id,cliente_nome,itens,total,endereco_entrega').eq('id',id).single();
    if (orderErr || !pedido) return falha('Pedido não encontrado');
    const {data: loja} = await db.from('lojas_3d').select('nome,whatsapp').eq('user_id',pedido.user_id).single();
    if (!loja?.whatsapp) return falha('WhatsApp não configurado na loja','desativado');
    const token = Deno.env.get('META_WHATSAPP_TOKEN');
    const phoneId = Deno.env.get('META_WHATSAPP_PHONE_NUMBER_ID');
    const template = Deno.env.get('META_WHATSAPP_TEMPLATE') || 'novo_pedido_negocio3d';
    const lang = Deno.env.get('META_WHATSAPP_TEMPLATE_LANG') || 'pt_BR';
    const version = Deno.env.get('META_GRAPH_API_VERSION') || 'v23.0';
    if (!token || !phoneId) return falha('Integração Meta não configurada','desativado');
    const to = loja.whatsapp.replace(/\D/g,'');
    if (!/^\d{10,15}$/.test(to)) return falha('WhatsApp da loja inválido');
    const items = Array.isArray(pedido.itens) ? pedido.itens : [];
    const descricao = items.map((x: {nome?:string, quantidade?:number}) => `${x.nome||'Produto'} (${x.quantidade||1}x)`).join(', ').slice(0,450);
    const values = [String(pedido.id).slice(0,8), String(pedido.cliente_nome).slice(0,100), descricao || 'Itens no painel', Number(pedido.total).toFixed(2).replace('.',','), String(pedido.endereco_entrega||'Consultar no painel').slice(0,450)];
    const response = await fetch(`https://graph.facebook.com/${encodeURIComponent(version)}/${encodeURIComponent(phoneId)}/messages`,{
      method:'POST', headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},
      body: JSON.stringify({messaging_product:'whatsapp',to,type:'template',template:{name:template,language:{code:lang},components:[{type:'body',parameters:values.map(text=>({type:'text',text}))}]}}),
    });
    const result = await response.json().catch(()=>({}));
    if (!response.ok) return falha(`Meta HTTP ${response.status}: ${String(result?.error?.message||'Erro de envio').slice(0,170)}`);
    await db.from('loja_whatsapp_notificacoes').update({status:'enviado',erro:null,meta_message_id:result?.messages?.[0]?.id||null,updated_at:new Date().toISOString()}).eq('pedido_id',id);
    return reply('Mensagem aceita pela Meta');
  } catch (error) {
    return falha(`Erro na Edge Function: ${String(error).slice(0,170)}`);
  }
});
