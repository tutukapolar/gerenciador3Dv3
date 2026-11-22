# Negócio 3D v11 — avisos automáticos pela WhatsApp Business Platform

## Antes de começar

Execute primeiro as migrações v8, v9, v10 caso ainda não tenham sido aplicadas. Faça backup do Supabase e do projeto. O arquivo `.env` não foi incluído no ZIP por segurança. Preserve suas variáveis Vite originais no seu ambiente local; **nunca coloque token da Meta nem service_role no frontend/GitHub**.

A integração oficial requer WhatsApp Business Platform da Meta, número remetente habilitado, autorização para enviar mensagens ao número de destino, e template aprovado para comunicações iniciadas pela empresa. A conta da Meta pode ter cobrança, limites e restrições; não é garantido que qualquer número pessoal consiga receber automaticamente avisos sem as condições exigidas pela Meta.

## 1. Banco

No Supabase > SQL Editor, execute `supabase/migrations/20261017_notificacoes_whatsapp_v11.sql`. A migração cria uma fila de notificação vinculada a cada pedido, RLS para que somente o proprietário veja o status e uma função de reserva que evita chamadas concorrentes para a mesma notificação.

## 2. Template Meta

Crie e envie para aprovação um modelo de mensagem da categoria apropriada, por exemplo `novo_pedido_negocio3d` em `pt_BR` com EXATAMENTE cinco parâmetros **de texto** no corpo, nesta ordem:

```
Novo pedido #{{1}}.
Cliente: {{2}}
Itens: {{3}}
Valor dos produtos: R$ {{4}}
Endereço informado: {{5}}
Frete a combinar. Abra a aba Loja do Negócio 3D para aceitar o pedido.
```

Aprovação e classificação dependem da Meta. Os dados de endereço do cliente são enviados somente ao número destinatário configurado na loja: obtenha os consentimentos apropriados e trate esses dados de forma responsável. Em produção, use a versão Graph API suportada no momento do deploy. O valor `v23.0` é apenas um padrão alterável por secret.

## 3. Secrets e deploy

No Dashboard Supabase > Edge Functions > Secrets, configure:

- `META_WHATSAPP_TOKEN`: token de acesso do sistema com permissão de envio.
- `META_WHATSAPP_PHONE_NUMBER_ID`: ID do **número REMETENTE** da API da Meta (não é o número de destino).
- `META_WHATSAPP_TEMPLATE`: nome do template aprovado (ex.: `novo_pedido_negocio3d`).
- `META_WHATSAPP_TEMPLATE_LANG`: `pt_BR`.
- `META_GRAPH_API_VERSION`: versão da Graph API suportada pela Meta.
- `WHATSAPP_WEBHOOK_SECRET`: segredo aleatório de no mínimo 32 caracteres; gere localmente e armazene em segurança.

`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são disponibilizadas no ambiente Supabase Edge Functions; confirme a configuração da sua instância. Não compartilhe os valores dos segredos em conversas.

Na pasta do projeto, com Supabase CLI configurado e vinculado ao projeto:

```
supabase functions deploy whatsapp-pedido --no-verify-jwt
```

**IMPORTANTE:** o `--no-verify-jwt` é necessário para receber o webhook; a função rejeita chamadas sem header secreto `x-webhook-secret`. Não disponibilize esse header no cliente.

## 4. Criar webhook no Supabase

Em Database > Webhooks > Create webhook:

- Nome: `aviso_novo_pedido_whatsapp`.
- Tabela: `public.loja_whatsapp_notificacoes`.
- Eventos: **INSERT e UPDATE** (INSERT envia; UPDATE com status `pendente` permite uma nova tentativa manual).
- Tipo HTTP: POST.
- URL: `https://SEU_PROJECT_REF.supabase.co/functions/v1/whatsapp-pedido` (substitua pelo Project Ref do seu Supabase).
- Cabeçalho: `x-webhook-secret`: mesmo valor de `WHATSAPP_WEBHOOK_SECRET`.
- Cabeçalho: `Content-Type: application/json`.

Não envie o webhook diretamente ao endpoint da Meta. Não use header de autorização com a chave `service_role` no banco.

Se o Dashboard não permitir webhooks de UPDATE, a opção “Tentar novamente” apenas deixa o pedido pendente; é necessário configurar o evento UPDATE ou acionar a função por um job confiável.

## 5. Testar

1. Em Minha Loja, informe o número de **destino** no formato internacional, como `55` + DDD + número (somente dígitos). O remetente da Meta é separado e definido pelo `META_WHATSAPP_PHONE_NUMBER_ID`.
2. Faça uma compra teste na vitrine pública. O navegador não abre mais o WhatsApp; o pedido é salvo no Supabase.
3. Confira `public.loja_whatsapp_notificacoes` no Table Editor e os logs da Edge Function.
4. Verifique o recebimento no WhatsApp autorizado e o status na aba Loja. `enviado` significa **aceito pela Meta**, não necessariamente entregue. Confirmação de entrega exigiria Webhooks de status da Meta, ainda não implementados.
5. Confirme que aceitar o pedido continua criando a encomenda e descontando o estoque normalmente.

### Solução de problemas

- `pendente`: webhook ausente, desabilitado ou sem disparo. Confira o Database Webhook e os logs de chamadas.
- `desativado`: configuração da Meta incompleta ou número de destino vazio; após corrigir, será necessário reprocessar a notificação manualmente pelo banco/operador autorizado.
- `erro`: aparece a mensagem resumida no painel; há botão de reenfileirar (depende do evento UPDATE configurado).
- `enviando`: uma execução começou. Em falhas abruptas esse status pode exigir intervenção de suporte; não reenvie às cegas, pois o WhatsApp pode ter recebido a mensagem.
- Template recusado ou parâmetros divergentes: revise nome, idioma e o corpo aprovado no Meta Business Manager.

## Observações importantes

- O aviso é enviado pelo **número empresarial remetente da plataforma** para o WhatsApp cadastrado em cada loja; não sai do WhatsApp do cliente.
- Uma mesma configuração de conta Meta cobre todos os lojistas do SaaS; caso queira que cada lojista use seu próprio remetente, será necessária uma integração multi-tenant adicional.
- Webhook e API são assíncronos: o pedido fica salvo mesmo que a notificação falhe.
- Sem testar com credenciais reais da Meta, não é possível garantir a entrega.
- O status `enviado` representa aceitação do endpoint, não confirmação de leitura, e o mecanismo minimiza mas não elimina duplicidade em situações excepcionais de falha de rede após aceite pela Meta.
- Não inclui pagamento, envio automático ao comprador, nem confirmação de entrega da API.
