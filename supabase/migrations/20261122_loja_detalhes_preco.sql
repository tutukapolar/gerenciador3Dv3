-- Execute no SQL Editor do Supabase APÓS as migrações da loja existentes.
-- Permite preço de venda independente do preço sugerido e descrição específica da vitrine.
alter table public.loja_produtos
  add column if not exists descricao text not null default '',
  add column if not exists preco_venda numeric(12,2);

alter table public.loja_produtos
  drop constraint if exists loja_produtos_preco_venda_check;
alter table public.loja_produtos
  add constraint loja_produtos_preco_venda_check
  check (preco_venda is null or (preco_venda >= 0 and preco_venda <= 99999999));

-- Catálogo público: expõe somente informações comerciais dos produtos publicados.
create or replace function public.catalogo_loja_publica(p_slug text) returns jsonb
language sql security definer set search_path = public as $$
 select jsonb_build_object(
  'loja',jsonb_build_object('nome',l.nome,'descricao',l.descricao,'whatsapp',l.whatsapp),
  'produtos',coalesce((
    select jsonb_agg(jsonb_build_object(
      'id',p.id,
      'nome',p.nome,
      'preco',coalesce(lp.preco_venda,p.preco_sugerido),
      'descricao',coalesce(lp.descricao,''),
      'imagem_url',p.imagem_url
    ) order by p.nome)
    from public.loja_produtos lp
    join public.produtos p on p.id::text=lp.produto_id and p.user_id=lp.user_id
    where lp.user_id=l.user_id and lp.ativo=true
  ), '[]'::jsonb))
 from public.lojas_3d l where l.slug=p_slug limit 1;
$$;
revoke all on function public.catalogo_loja_publica(text) from public;
grant execute on function public.catalogo_loja_publica(text) to anon,authenticated;

-- O preço é sempre consultado no banco; o cliente não consegue enviar ou alterar o valor do pedido.
create or replace function public.criar_pedido_loja(
  p_slug text,
  p_cliente_nome text,
  p_cliente_whatsapp text,
  p_itens jsonb,
  p_endereco_entrega text
) returns jsonb
language plpgsql security definer set search_path=public as $$
declare
  v_user uuid;
  v_item jsonb;
  v_prod record;
  v_quant integer;
  v_preco numeric(12,2);
  v_total numeric(12,2) := 0;
  v_itens jsonb := '[]'::jsonb;
  v_id uuid;
begin
  select user_id into v_user from public.lojas_3d where slug=p_slug;
  if v_user is null then raise exception 'Loja inexistente'; end if;
  if length(trim(coalesce(p_cliente_nome,''))) not between 2 and 100
     or length(trim(coalesce(p_cliente_whatsapp,''))) not between 8 and 20 then
    raise exception 'Dados do cliente inválidos';
  end if;
  if length(trim(coalesce(p_endereco_entrega,''))) not between 10 and 500 then
    raise exception 'Informe o endereço completo de entrega';
  end if;
  if jsonb_typeof(p_itens) <> 'array' or jsonb_array_length(p_itens) not between 1 and 30 then
    raise exception 'Itens inválidos';
  end if;

  for v_item in select value from jsonb_array_elements(p_itens) loop
    if jsonb_typeof(v_item) <> 'object' or coalesce(v_item->>'quantidade','') !~ '^[0-9]{1,2}$' then
      raise exception 'Quantidade inválida';
    end if;
    v_quant := (v_item->>'quantidade')::integer;
    if v_quant < 1 or v_quant > 99 then raise exception 'Quantidade inválida'; end if;

    select p.id,p.nome,coalesce(lp.preco_venda,p.preco_sugerido) as preco
      into v_prod
      from public.produtos p
      join public.loja_produtos lp on lp.produto_id=p.id::text and lp.user_id=p.user_id
     where p.id::text=v_item->>'produto_id'
       and p.user_id=v_user
       and lp.ativo=true;

    if not found or v_prod.preco is null or v_prod.preco < 0 then
      raise exception 'Produto indisponível';
    end if;
    v_preco := v_prod.preco;
    v_total := v_total + v_quant * v_preco;
    v_itens := v_itens || jsonb_build_array(jsonb_build_object(
      'produto_id',v_prod.id,
      'nome',v_prod.nome,
      'quantidade',v_quant,
      'preco_unitario',v_preco
    ));
  end loop;

  insert into public.loja_pedidos(user_id,cliente_nome,cliente_whatsapp,endereco_entrega,itens,total)
  values(v_user,trim(p_cliente_nome),trim(p_cliente_whatsapp),trim(p_endereco_entrega),v_itens,v_total)
  returning id into v_id;
  return jsonb_build_object('id',v_id,'total',v_total);
end;
$$;
revoke all on function public.criar_pedido_loja(text,text,text,jsonb,text) from public;
grant execute on function public.criar_pedido_loja(text,text,text,jsonb,text) to anon,authenticated;
