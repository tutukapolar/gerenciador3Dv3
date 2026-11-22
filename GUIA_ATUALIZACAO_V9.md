# Negócio 3D v9 — aprovação de pedidos e endereço de entrega

## Implantação
1. Faça backup do projeto e do banco antes de atualizar.
2. Se ainda não executou a migração v8, execute primeiro `supabase/migrations/20261017_loja_imagens_insumos.sql` no SQL Editor do Supabase.
3. Execute a nova migração `supabase/migrations/20261017_aprovacao_pedidos_entrega.sql` no SQL Editor do **mesmo projeto Supabase**.
4. Atualize o código, abra a pasta `negocio-3d`, execute `npm install` e `npm run dev`.
5. Publique um produto na Loja, abra o link público em outra janela, envie um pedido com endereço e veja-o como pendente na aba Loja.
6. Clique em **Aceitar pedido**: a função do banco cria a encomenda e altera o status em uma transação. Entre na aba **Encomendas** para visualizar.

## Regras
- Novos pedidos ficam como `novo` e precisam de aceite explícito.
- No formulário público, endereço é obrigatório e frete é informado como **a combinar** (não entra no subtotal dos produtos).
- Ao aceitar, o pedido cria uma encomenda no status `Pendente`. Para pedidos com vários produtos, a descrição resume os itens e a quantidade representa a soma das unidades; os itens completos continuam no histórico da Loja.
- A migração adiciona um identificador único de origem em `encomendas` para impedir associações duplicadas.
- Pedidos registrados antes da atualização podem não conter endereço.
- Mensagens do WhatsApp dependem do cliente enviá-las manualmente; notificações automáticas não estão configuradas.

## Atenção
A compilação e uma integração real com Supabase precisam ser testadas localmente antes do deploy. Se a estrutura da sua tabela `encomendas` exigir campos adicionais ou tipos específicos, adapte a função `aceitar_pedido_loja` à estrutura do seu banco.
