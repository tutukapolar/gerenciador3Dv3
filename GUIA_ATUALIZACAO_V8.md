# Negócio 3D — atualização v8 (prévia funcional)

## Preparação
1. Faça backup do projeto e do banco Supabase antes de alterar qualquer coisa.
2. Abra o painel do Supabase do seu projeto, **SQL Editor**, e execute o arquivo `supabase/migrations/20261017_loja_imagens_insumos.sql` integralmente. **Execute apenas uma vez** (as políticas do Storage são criadas com nomes fixos).
3. No terminal, dentro da pasta do projeto, use `npm install` e `npm run dev`.
4. Teste usando uma conta de teste: estoque, imagens, insumos, loja, pedidos e visibilidade entre usuários. Só depois faça o deploy.

## Novas abas
- **Calculadora:** botão para adicionar ou remover filamentos, miniatura do material selecionado, insumos por peça e inclusão do custo dos insumos no preço. O cálculo não altera o saldo do estoque.
- **Estoque:** imagens dos filamentos no Supabase Storage.
- **Produtos:** imagens dos produtos existentes.
- **Insumos:** cadastro, saldo, preço unitário e consumo com baixa atômica no banco.
- **Minha Loja:** nome, link exclusivo, WhatsApp, publicação de produtos e acompanhamento de pedidos.
- **Vitrine pública:** em `https://SEU-DOMINIO/#/loja/slug-da-loja`; permite selecionar quantidades, preencher contato, registrar pedido no servidor e abrir WhatsApp com mensagem pronta.

## Restrições desta versão
- **WhatsApp:** a mensagem é aberta para envio manual do cliente. Notificação automática ao vendedor exigiria uma API oficial integrada ao backend.
- **Imagens:** cadastro por produto/filamento existente; na calculadora aparece a foto do filamento. A foto do produto é adicionada no catálogo após salvar o produto.
- **Insumos:** a calculadora inclui custos; a baixa de consumo ocorre na aba Insumos, não ao salvar um orçamento. Não há baixa automática associada a pedidos.
- **Loja:** não há pagamento online, cálculo de frete ou integração automática com o estoque. O pedido fica registrado na tabela `loja_pedidos`.
- **Segurança:** o preço do pedido é calculado no banco a partir de produtos publicados, não do valor enviado pelo navegador. As imagens ficam em um bucket público para permitir sua exibição na loja. Evite imagens com dados pessoais.
- **Infraestrutura:** a migração ainda precisa ser executada no seu Supabase e as permissões devem ser verificadas com contas de teste. Esta distribuição não altera o banco automaticamente.

## Importante
Este ZIP **não contém `.env`, `.git`, `.git-backup`, nem `supabase/.temp`**, para evitar compartilhar segredos e configurações do computador. Preserve as variáveis locais da sua cópia original em segurança. Não envie tokens e service-role keys ao GitHub.
