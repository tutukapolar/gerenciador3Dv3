# Correções — Assistente IA e Gerador de Anúncios

## O que foi corrigido

- Corrigido o estado `detalhesAnuncio` no `AppContext`, permitindo editar os campos da aba Anúncios sem o erro `setDetalhesAnuncio is not a function`.
- Corrigido o CORS das Edge Functions `ai-assistant` e `generate-listing` para responder corretamente ao preflight `OPTIONS` do navegador.
- O CORS agora aceita os headers usados pelo Supabase JS e pelos mecanismos de tracing (`authorization`, `x-client-info`, `apikey`, `content-type`, `traceparent`, `tracestate`, `baggage`).
- Mantida a chave Groq somente no Secret da Edge Function.

## Depois de substituir o projeto

No terminal, dentro da pasta do projeto:

```bash
npm install
npm run dev
```

## Muito importante: redeploy das Edge Functions

As alterações de CORS só entram no Supabase depois do redeploy:

```bash
supabase functions deploy ai-assistant
supabase functions deploy generate-listing
```

Confirme também que o Secret existe no projeto Supabase:

```text
GROQ_API_KEY
```

Não coloque a chave Groq no frontend ou no `.env` do Vite.

## Teste

1. Abra a aba **Anúncios**.
2. Clique nos campos de Material, Cor, Altura etc. e digite normalmente.
3. Abra o **Assistente IA**.
4. Envie `Como funciona a calculadora?`.
5. Se o navegador ainda mostrar CORS depois do redeploy, abra o Network e confira se a requisição `OPTIONS` para `ai-assistant` retorna `204`.

O navegador pode mostrar um erro genérico de CORS quando uma Edge Function falha no gateway; nesse caso, verifique também os Logs da função no Supabase.
