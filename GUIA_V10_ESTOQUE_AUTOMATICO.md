# Negócio 3D v10 — Baixa automática

1. Faça backup do banco e da pasta da versão atual.
2. Execute no Supabase SQL Editor as migrações da v8, da v9 e por último `supabase/migrations/20261017_baixa_automatica_estoque.sql` (sem repetir migrações já aplicadas).
3. Em **Produtos**, abra **Ficha de materiais por unidade**, informe quantos gramas de cada filamento e quantas unidades/ml/g de cada insumo são usados para UMA peça. Salve. Produtos gerados pela calculadora FDM já recebem ficha, mas confirme as quantidades antes da primeira venda. Produtos anteriores devem ser configurados manualmente.
4. Ao aceitar um pedido da loja, todos os produtos do pedido têm seus materiais descontados. Na criação manual da encomenda, selecione um produto do catálogo. Produtos sem ficha são bloqueados para evitar baixas incorretas.
5. Teste localmente (`npm install` e `npm run dev`) com estoque e produtos de teste. Exemplo: 2 peças com 35 g de PLA e 1 ímã por peça => -70 g PLA e -2 ímãs.
6. Se o saldo for insuficiente, a encomenda e todos os descontos são desfeitos na mesma transação. Editar ou mudar status não desconta novamente. Recusar pedido não altera estoque.

## Atenção
- A baixa ocorre na criação/aceitação da encomenda, não ao marcar como imprimindo.
- Excluir ou cancelar a encomenda **não devolve automaticamente materiais ao estoque**: reponha após confirmar o que já foi utilizado. Implementação de estorno controlado é uma melhoria futura.
- Pedidos mistos com produtos repetindo o mesmo material geram descontos agregados no histórico.
- Para produtos de resina, cadastre os insumos da ficha manualmente; não há controle automático de resina por volume no estoque de filamentos.
- `materiais_receita` armazena quantidades **por unidade** (não o total do lote).
- Revise o SQL se `impressora_id` do seu banco não for bigint.
- Não foi possível concluir o build neste ambiente (instalação de dependências excedeu o tempo disponível). Não publique sem testar.
