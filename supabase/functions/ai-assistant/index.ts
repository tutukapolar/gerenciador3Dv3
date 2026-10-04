// Mantém o mesmo provedor usado pela geração de anúncios.
// A chave fica somente nos Secrets da Edge Function.
const MODEL = "openai/gpt-oss-20b";

const SYSTEM = `
Você é o assistente oficial do 3D Print Manager, um SaaS brasileiro para gestão de impressão 3D.
Responda sempre em português do Brasil, de forma clara, curta e prática.
Você recebe o estado atual do sistema no campo CONTEXTO.
Você pode explicar telas, analisar os dados fornecidos e sugerir/solicitar ações.
NUNCA invente dados que não estejam no contexto.

Sua resposta DEVE ser SOMENTE um JSON válido, sem markdown, neste formato:
{
  "text": "resposta para o usuário",
  "actions": []
}

As ações permitidas são SOMENTE:
1) {"type":"navigate","tab":"dashboard|maquinas|calculadora|estoque|produtos|anuncios|encomendas|sugestoes|planos|configuracoes"}
2) {"type":"update_setting","path":"CAMINHO_PERMITIDO","value":VALOR}
3) {"type":"prepare_calculator","data":{"campo":"valor"}}

Caminhos de configuração permitidos:
calculadora.custoEnergiaKwh
calculadora.potenciaImpressoraW
calculadora.margemErroPct
calculadora.valorHoraMaoDeObra
calculadora.custoEmbalagem
calculadora.lucroDesejadoPct
calculadora.precoResinaLitro
manutencao.fep
manutencao.bico
manutencao.lubrificacao
notificacoes.manutencao
notificacoes.estoqueBaixo
notificacoes.onboarding
notificacoes.toasts
assistente.ativo
assistente.confirmarAcoes

Para preparar a calculadora, use somente campos que já existem nela, como:
nomeItem, telefoneCliente, tempoHoras, quantidadePecas, margemErroPct,
custoEnergiaKwh, potenciaImpressoraW, valorHoraMaoDeObra, tempoSetupMin,
tempoPreAquecimentoMin, tempoFatiamentoMin, tempoRemocaoSuportesMin,
tempoLixamentoMin, tempoLavagemUvMin, custoEmbalagem, lucroDesejadoPct.

Não crie ações de banco de dados, não tente executar SQL e não invente tipos de ação.
Se o usuário pedir para cadastrar uma impressora, filamento ou produto e não houver uma ação permitida para isso, explique que essa função precisa ser implementada no sistema e ofereça abrir a tela correspondente.
`;

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createSupabaseContext } from "npm:@supabase/server@1";

const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return Response.json({ ok: true }, { headers: corsHeaders });
  }

  try {
    // O gateway não faz mais o JWT automaticamente para esta função,
    // então validamos o usuário aqui. Isso mantém o endpoint protegido
    // e permite que o preflight CORS seja respondido normalmente.
    const { error: authError } = await createSupabaseContext(req, { auth: "user" });
    if (authError) {
      return jsonResponse({ error: "Não autorizado.", code: authError.code }, authError.status);
    }
    const apiKey = Deno.env.get("GROQ_API_KEY") || Deno.env.get("GROQ-API-KEY");
    if (!apiKey) {
      return jsonResponse({
        error: "GROQ_API_KEY não está configurada nos Secrets do Supabase."
      }, 500);
    }

    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const context = body.context || {};
    const allowMutations = body.allowMutations !== false;

    const transcript = messages.slice(-14).map((m: any) =>
      `${m.role === "user" ? "USUÁRIO" : "ASSISTENTE"}: ${String(m.text || "")}`
    ).join("\n");

    const mutationRule = allowMutations
      ? "Ações de alteração permitidas podem ser retornadas normalmente."
      : "NÃO retorne ações que alterem configurações. Pode retornar apenas navegação e prepare_calculator.";

    const prompt = `${SYSTEM}\n\n${mutationRule}\n\nCONTEXTO:\n${JSON.stringify(context, null, 2)}\n\nCONVERSA:\n${transcript}\n\nGere agora o JSON solicitado.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        reasoning_effort: "medium",
        reasoning_format: "hidden",
        temperature: 0.4,
        max_completion_tokens: 2048,
        response_format: { type: "json_object" },
        stream: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return jsonResponse({
        error: data?.error?.message || "Erro retornado pela API Groq."
      }, response.status);
    }

    const raw = data?.choices?.[0]?.message?.content || "";

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { text: raw || "Não consegui gerar uma resposta agora.", actions: [] };
    }

    if (!Array.isArray(parsed.actions)) parsed.actions = [];
    if (typeof parsed.text !== "string") parsed.text = "Pronto.";

    const allowedTabs = new Set([
      "dashboard", "maquinas", "calculadora", "estoque", "produtos",
      "anuncios", "encomendas", "sugestoes", "planos", "configuracoes"
    ]);
    const allowedSettings = new Set([
      "calculadora.custoEnergiaKwh", "calculadora.potenciaImpressoraW",
      "calculadora.margemErroPct", "calculadora.valorHoraMaoDeObra",
      "calculadora.custoEmbalagem", "calculadora.lucroDesejadoPct",
      "calculadora.precoResinaLitro", "manutencao.fep", "manutencao.bico",
      "manutencao.lubrificacao", "notificacoes.manutencao",
      "notificacoes.estoqueBaixo", "notificacoes.onboarding",
      "notificacoes.toasts", "assistente.ativo", "assistente.confirmarAcoes"
    ]);

    parsed.actions = parsed.actions.filter((a: any) => {
      if (!a || typeof a.type !== "string") return false;
      if (a.type === "navigate") return allowedTabs.has(a.tab);
      if (a.type === "update_setting") return allowMutations && allowedSettings.has(a.path);
      if (a.type === "prepare_calculator") return a.data && typeof a.data === "object";
      return false;
    });

    return jsonResponse({
      text: parsed.text,
      actions: parsed.actions,
      model: MODEL,
    });
  } catch (error) {
    console.error("ai-assistant error:", error);
    return jsonResponse({
      error: error instanceof Error ? error.message : "Erro interno no assistente Groq."
    }, 500);
  }
});
