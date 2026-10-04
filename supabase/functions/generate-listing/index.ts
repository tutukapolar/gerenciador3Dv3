import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const apiKey =
      Deno.env.get("GROQ_API_KEY") ||
      Deno.env.get("GROQ-API-KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            "Chave GROQ_API_KEY não encontrada nos Secrets do Supabase.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const body = await req.json().catch(() => ({}));

    const productName = String(body.productName || "Produto 3D");
    const material = String(body.material || "");
    const preco = String(body.preco || "0.00");
    const pesoG = String(body.pesoG || "");
    const cor = String(body.cor || "");
    const alturaCm = String(body.alturaCm || "");
    const larguraCm = String(body.larguraCm || "");
    const profundidadeCm = String(body.profundidadeCm || "");
    const acabamento = String(body.acabamento || "");
    const publicoAlvo = String(body.publicoAlvo || "");
    const uso = String(body.uso || "");
    const diferencial = String(body.diferencial || "");
    const prazoEnvio = String(body.prazoEnvio || "");
    const tom = String(body.tom || "persuasivo");
    const plataforma = String(body.plataforma || "shopee");

    const informacoes = `
PRODUTO:
${productName}

MATERIAL:
${material || "Não informado"}

PREÇO:
R$ ${preco || "Não informado"}

PESO:
${pesoG || "Não informado"}

COR:
${cor || "Não informado"}

ALTURA:
${alturaCm || "Não informado"}

LARGURA:
${larguraCm || "Não informado"}

PROFUNDIDADE:
${profundidadeCm || "Não informado"}

ACABAMENTO:
${acabamento || "Não informado"}

PÚBLICO-ALVO:
${publicoAlvo || "Não informado"}

USO:
${uso || "Não informado"}

DIFERENCIAL:
${diferencial || "Não informado"}

PRAZO DE ENVIO:
${prazoEnvio || "Não informado"}

TOM:
${tom}

PLATAFORMA:
${plataforma}
`;

    const prompt = `
Você é um copywriter profissional especializado em e-commerce brasileiro,
marketplaces e produtos de impressão 3D.

Crie um anúncio comercial de alta qualidade usando EXCLUSIVAMENTE as informações
reais fornecidas pelo vendedor abaixo.

${informacoes}

REGRAS ABSOLUTAS DE VERACIDADE:
- As informações fornecidas são a fonte da verdade.
- Nunca invente dimensões, peso, cor, material, acabamento, acessórios,
  garantia, prazo, resistência, certificações, licenças, funcionalidades,
  quantidade, avaliações ou número de vendas.
- Se um campo estiver como "Não informado", não mencione essa informação.
- Não diga que um personagem/produto é oficial, licenciado ou original se isso
  não foi informado.
- Você pode criar linguagem persuasiva e benefícios comerciais coerentes,
  mas não transforme suposições em especificações técnicas.

OBJETIVO:
Faça o anúncio chamar atenção, explicar rapidamente o produto, destacar os
seus diferenciais e incentivar a compra. O texto deve parecer escrito por um
vendedor profissional, não por um chatbot.

TÍTULO:
- Máximo de 60 caracteres.
- Coloque as palavras mais importantes no início.
- Inclua o tipo/nome do produto.
- Use "Impressão 3D" quando fizer sentido.
- Não coloque o preço.
- Evite palavras vazias como "incrível", "imperdível", "sensacional" e
  "o melhor do mercado".

DESCRIÇÃO:
Crie entre 150 e 250 palavras, com parágrafos curtos para celular.
Use esta estrutura:
1. ABERTURA: uma frase forte e natural apresentando o produto.
2. DESTAQUES: 3 a 5 bullets começando com "•", usando apenas características
   e benefícios coerentes com os dados reais.
3. SOBRE O PRODUTO: explique naturalmente o que o cliente está comprando.
4. DETALHES: informe apenas material, peso, dimensões, cor, acabamento e
   outros dados realmente fornecidos.
5. IDEAL PARA: indique possíveis usos ou público apenas quando isso for
   coerente com os dados fornecidos.
6. CHAMADA PARA AÇÃO: finalize com uma chamada curta e comercial.

Adapte a linguagem para a plataforma ${plataforma} e o tom ${tom}.
Use emojis com moderação quando combinarem com a plataforma.
Não use hashtags dentro da descrição.

TAGS:
Crie exatamente 8 tags curtas e relevantes, misturando nome do produto,
categoria, impressão 3D, nicho, público e intenção de compra. Não invente
características técnicas.

QUALIDADE:
Elimine repetições, frases genéricas, exageros e texto robótico.
Priorize clareza, desejo de compra, leitura rápida e palavras-chave úteis.

RETORNE SOMENTE JSON VÁLIDO, SEM MARKDOWN E SEM TEXTO FORA DO JSON:
{
  "titulo": "Título do anúncio",
  "descricao": "Descrição completa",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"]
}
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",

          messages: [
            {
              role: "system",
              content:
                "Você é um gerador profissional de anúncios. Responda somente com o JSON solicitado.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],

          reasoning_effort: "low",
          temperature: 0.6,
          max_completion_tokens: 4096,

          stream: false,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error:
            data?.error?.message ||
            "Erro retornado pela API da Groq.",
          groq: data,
        }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    let message = data?.choices?.[0]?.message;
    let textResult = message?.content;

    // Em alguns casos o GPT-OSS pode consumir a primeira resposta em reasoning
    // e não devolver content. Fazemos uma segunda tentativa curta, sem expor
    // reasoning ao usuário, para manter a geração robusta.
    if (!textResult) {
      const retryResponse = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            messages: [
              {
                role: "system",
                content:
                  "Você é um gerador profissional de anúncios. Responda somente com JSON válido no formato solicitado.",
              },
              { role: "user", content: prompt },
            ],
            reasoning_effort: "low",
            temperature: 0.5,
            max_completion_tokens: 4096,
            stream: false,
          }),
        }
      );

      const retryData = await retryResponse.json();
      if (retryResponse.ok) {
        message = retryData?.choices?.[0]?.message;
        textResult = message?.content;
      }
    }

    if (!textResult) {
      return new Response(
        JSON.stringify({
          error: "A Groq não retornou conteúdo para o anúncio.",
          diagnostic: {
            model: data?.model,
            finish_reason: data?.choices?.[0]?.finish_reason,
            message_keys: message ? Object.keys(message) : [],
          },
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let cleanText = String(textResult).trim();

    // Remove possíveis blocos Markdown
    cleanText = cleanText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let resultado;

    try {
      resultado = JSON.parse(cleanText);
    } catch {
      return new Response(
        JSON.stringify({
          error: "A Groq respondeu, mas o conteúdo não é JSON válido.",
          raw: cleanText,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (
      typeof resultado?.titulo !== "string" ||
      typeof resultado?.descricao !== "string" ||
      !Array.isArray(resultado?.tags)
    ) {
      return new Response(
        JSON.stringify({
          error:
            "A Groq respondeu JSON, mas fora do formato esperado.",
          raw: resultado,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    resultado.tags = resultado.tags
      .filter((tag) => typeof tag === "string")
      .slice(0, 10);

    return new Response(
      JSON.stringify({
        text: JSON.stringify(resultado),
        model: data?.model || "openai/gpt-oss-20b",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("generate-listing error:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Erro interno no servidor.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});