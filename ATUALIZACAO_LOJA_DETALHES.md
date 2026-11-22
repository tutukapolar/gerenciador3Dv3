# Atualização da loja: detalhes, descrição e preço de venda

Esta atualização adiciona:

- abertura de uma janela de detalhes ao clicar na imagem ou no nome do produto na vitrine pública;
- exibição da imagem completa, sem corte, junto da descrição e do preço;
- campos na área **Minha loja virtual** para editar a descrição e definir um preço de venda próprio, inclusive centavos;
- uso do preço de venda personalizado nos carrinhos e pedidos. Se o preço personalizado ficar vazio, a loja usa o preço sugerido do cadastro do produto;
- cálculo do pedido no banco de dados, consultando o preço configurado pelo lojista (o navegador não define o preço final).

## Ativação no Supabase

Depois de atualizar os arquivos do projeto, abra o **SQL Editor** do Supabase e execute o conteúdo do arquivo:

`supabase/migrations/20261122_loja_detalhes_preco.sql`

Execute essa migração depois das migrações anteriores da loja, especialmente `20261017_loja_imagens_insumos.sql` e `20261017_aprovacao_pedidos_entrega.sql`.

Depois, publique o frontend normalmente. Na aba **Loja**, edite a descrição e o preço de cada produto e clique em **Salvar descrição e preço**. Para aparecer na vitrine pública, clique também em **Publicar na loja**.
