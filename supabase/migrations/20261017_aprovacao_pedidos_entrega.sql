-- Execute APÓS 20261017_loja_imagens_insumos.sql.
-- O frete é acordado separadamente, não compõe o valor dos produtos.
alter table public.loja_pedidos add column if not exists endereco_entrega text;
alter table public.encomendas add column if not exists loja_pedido_id uuid unique references public.loja_pedidos(id) on delete set null;

-- Atualiza a assinatura da função de criação de pedido com endereço obrigatório.
-- DROP remove a função anterior (mesma assinatura lógica, parâmetro adicional).
drop function if exists public.criar_pedido_loja(text,text,text,jsonb);
create function public.criar_pedido_loja(p_slug text,p_cliente_nome text,p_cliente_whatsapp text,p_itens jsonb,p_endereco_entrega text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_user uuid; v_item jsonb; v_prod record; v_quant integer; v_total numeric := 0; v_itens jsonb := '[]'::jsonb; v_id uuid;
begin
 select user_id into v_user from public.lojas_3d where slug=p_slug;
 if v_user is null then raise exception 'Loja inexistente'; end if;
 if length(trim(coalesce(p_cliente_nome,''))) not between 2 and 100 or length(trim(coalesce(p_cliente_whatsapp,''))) not between 8 and 20 then raise exception 'Dados do cliente inválidos'; end if;
 if length(trim(coalesce(p_endereco_entrega,''))) not between 10 and 500 then raise exception 'Informe o endereço completo de entrega'; end if;
 if jsonb_typeof(p_itens) <> 'array' or jsonb_array_length(p_itens) not between 1 and 30 then raise exception 'Itens inválidos'; end if;
 for v_item in select value from jsonb_array_elements(p_itens) loop
   if jsonb_typeof(v_item) <> 'object' or coalesce(v_item->>'quantidade','') !~ '^[0-9]{1,2}$' then raise exception 'Quantidade inválida'; end if;
   v_quant := (v_item->>'quantidade')::integer;
   if v_quant < 1 or v_quant > 99 then raise exception 'Quantidade inválida'; end if;
   select p.id,p.nome,p.preco_sugerido into v_prod from public.produtos p join public.loja_produtos lp on lp.produto_id=p.id::text and lp.user_id=p.user_id
   where p.id::text=v_item->>'produto_id' and p.user_id=v_user and lp.ativo=true;
   if not found or v_prod.preco_sugerido is null or v_prod.preco_sugerido < 0 then raise exception 'Produto indisponível'; end if;
   v_total := v_total + v_quant * v_prod.preco_sugerido;
   v_itens := v_itens || jsonb_build_array(jsonb_build_object('produto_id',v_prod.id,'nome',v_prod.nome,'quantidade',v_quant,'preco_unitario',v_prod.preco_sugerido));
 end loop;
 insert into public.loja_pedidos(user_id,cliente_nome,cliente_whatsapp,endereco_entrega,itens,total)
 values(v_user,trim(p_cliente_nome),trim(p_cliente_whatsapp),trim(p_endereco_entrega),v_itens,v_total) returning id into v_id;
 return jsonb_build_object('id',v_id,'total',v_total);
end $$;
revoke all on function public.criar_pedido_loja(text,text,text,jsonb,text) from public;
grant execute on function public.criar_pedido_loja(text,text,text,jsonb,text) to anon,authenticated;

-- Operação atômica: bloqueia o pedido, cria encomenda e marca como aceito.
create or replace function public.aceitar_pedido_loja(p_pedido_id uuid)
returns void language plpgsql security definer set search_path=public as $$
declare v_pedido public.loja_pedidos%rowtype; v_primeiro jsonb; v_nome text; v_qtd integer;
begin
 if auth.uid() is null then raise exception 'Faça login para aceitar o pedido'; end if;
 select * into v_pedido from public.loja_pedidos where id=p_pedido_id and user_id=auth.uid() for update;
 if not found then raise exception 'Pedido não encontrado'; end if;
 if v_pedido.status <> 'novo' then raise exception 'Este pedido já foi processado'; end if;
 select value into v_primeiro from jsonb_array_elements(v_pedido.itens) limit 1;
 v_nome := case when jsonb_array_length(v_pedido.itens)>1 then
    (v_primeiro->>'nome') || ' + ' || (jsonb_array_length(v_pedido.itens)-1)::text || ' outro(s) item(ns)'
    else v_primeiro->>'nome' end;
 select coalesce(sum((value->>'quantidade')::integer),0) into v_qtd from jsonb_array_elements(v_pedido.itens);
 insert into public.encomendas(user_id,cliente,contato,endereco,produto_nome,quantidade,valor_total,status,data,loja_pedido_id)
 values(v_pedido.user_id,v_pedido.cliente_nome,v_pedido.cliente_whatsapp,coalesce(v_pedido.endereco_entrega,'Endereço não informado'),v_nome,v_qtd,v_pedido.total,'Pendente',to_char(now(),'DD/MM/YYYY'),v_pedido.id);
 update public.loja_pedidos set status='aceito' where id=v_pedido.id;
end $$;
revoke all on function public.aceitar_pedido_loja(uuid) from public;
grant execute on function public.aceitar_pedido_loja(uuid) to authenticated;
