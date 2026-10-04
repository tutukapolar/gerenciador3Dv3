# Configuração da IA com Groq

O projeto usa a Groq para o Gerador de Anúncios e para o Assistente IA.

## 1. Secret do Supabase

No Supabase, abra **Edge Functions → Secrets** e configure:

```text
GROQ_API_KEY=sua_chave_groq
```

A chave não deve ser colocada em `src/`, no React ou em `VITE_*`. Edge Functions leem secrets com `Deno.env.get("GROQ_API_KEY")`.

## 2. Edge Functions

O projeto contém:

- `ai-assistant` — Assistente IA com ações de navegação/configuração/calculadora.
- `generate-listing` — Gerador de anúncios com copy comercial e dados extras do produto.

Depois de atualizar os arquivos, faça o deploy das duas funções.

```bash
supabase functions deploy ai-assistant
supabase functions deploy generate-listing
```

## 3. Modelo

As duas funções usam `openai/gpt-oss-20b` pela API da Groq.

O Gerador de Anúncios usa raciocínio `medium`, temperatura `0.6` e valida o JSON recebido antes de devolver o resultado ao frontend.

## 4. Frontend

O React chama as funções usando `supabase.functions.invoke(...)`. A chave da Groq nunca é enviada ao navegador.
