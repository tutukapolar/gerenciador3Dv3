-- Negócio 3D v8. Execute no SQL Editor do Supabase.
alter table public.estoque_filamentos add column if not exists imagem_url text;
alter table public.produtos add column if not exists imagem_url text;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('loja-imagens','loja-imagens',true,4194304,array['image/png','image/jpeg','image/webp'])
on conflict (id) do update set public=true,file_size_limit=4194304,allowed_mime_types=array['image/png','image/jpeg','image/webp'];
create policy "loja_imagens_upload_owner" on storage.objects for insert to authenticated with check(bucket_id='loja-imagens' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "loja_imagens_delete_owner" on storage.objects for delete to authenticated using(bucket_id='loja-imagens' and (storage.foldername(name))[1] = auth.uid()::text);

create table if not exists public.lojas_3d (
 user_id uuid primary key references auth.users(id) on delete cascade,
 slug text not null unique check(slug ~ '^[a-z0-9-]{3,45}$'),
 nome text not null check(char_length(nome) between 1 and 90),
 descricao text default '',
 whatsapp text default '',
 created_at timestamptz not null default now()
);
create table if not exists public.loja_produtos (
 user_id uuid not null references auth.users(id) on delete cascade,
 produto_id text not null,
 ativo boolean not null default false,
 primary key(user_id,produto_id)
);
-- IDs como texto acomodam IDs bigint e UUID na tabela de produtos.
create table if not exists public.loja_pedidos (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 cliente_nome text not null,
 cliente_whatsapp text not null,
 itens jsonb not null,
 total numeric(12,2) not null,
 status text not null default 'novo' check(status in ('novo','aceito','em_producao','pronto','entregue','cancelado')),
 created_at timestamptz not null default now()
);
create table if not exists public.insumos_3d (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 nome text not null,
 unidade text not null default 'un',
 quantidade numeric not null default 0 check(quantidade>=0),
 custo_unitario numeric not null default 0 check(custo_unitario>=0),
 created_at timestamptz not null default now()
);
create table if not exists public.insumos_movimentos (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 insumo_id uuid not null references public.insumos_3d(id) on delete cascade,
 quantidade numeric not null check(quantidade>0),
 motivo text not null default 'consumo',
 created_at timestamptz not null default now()
);

alter table public.lojas_3d enable row level security;
alter table public.loja_produtos enable row level security;
alter table public.loja_pedidos enable row level security;
alter table public.insumos_3d enable row level security;
alter table public.insumos_movimentos enable row level security;
create policy "lojas_owner" on public.lojas_3d for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "loja_produtos_owner" on public.loja_produtos for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "loja_pedidos_read_owner" on public.loja_pedidos for select to authenticated using(user_id=auth.uid());
create policy "loja_pedidos_update_owner" on public.loja_pedidos for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "insumos_owner" on public.insumos_3d for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "insumos_movimentos_owner" on public.insumos_movimentos for select to authenticated using(user_id=auth.uid());

-- Vitrine pública: não expõe e-mails, estoque, dados privados ou preços de custo.
create or replace function public.catalogo_loja_publica(p_slug text) returns jsonb
language sql security definer set search_path = public as $$
 select jsonb_build_object(
  'loja',jsonb_build_object('nome',l.nome,'descricao',l.descricao,'whatsapp',l.whatsapp),
  'produtos',coalesce((select jsonb_agg(jsonb_build_object('id',p.id,'nome',p.nome,'preco',p.preco_sugerido,'imagem_url',p.imagem_url))
    from public.loja_produtos lp join public.produtos p on p.id::text=lp.produto_id and p.user_id=lp.user_id
    where lp.user_id=l.user_id and lp.ativo=true), '[]'::jsonb))
 from public.lojas_3d l where l.slug=p_slug limit 1;
$$;
revoke all on function public.catalogo_loja_publica(text) from public;
grant execute on function public.catalogo_loja_publica(text) to anon,authenticated;

-- Pedido criado somente pela função: o servidor reconsulta e calcula os preços.
create or replace function public.criar_pedido_loja(p_slug text,p_cliente_nome text,p_cliente_whatsapp text,p_itens jsonb)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_user uuid; v_item jsonb; v_prod record; v_quant integer; v_total numeric := 0; v_itens jsonb := '[]'::jsonb; v_id uuid;
begin
 select user_id into v_user from public.lojas_3d where slug=p_slug;
 if v_user is null then raise exception 'Loja inexistente'; end if;
 if length(trim(coalesce(p_cliente_nome,''))) not between 2 and 100 or length(trim(coalesce(p_cliente_whatsapp,''))) not between 8 and 20 then raise exception 'Dados do cliente inválidos'; end if;
 if jsonb_typeof(p_itens) <> 'array' or jsonb_array_length(p_itens) not between 1 and 30 then raise exception 'Itens inválidos'; end if;
 for v_item in select value from jsonb_array_elements(p_itens) loop
   if coalesce(v_item->>'quantidade','') !~ '^[0-9]{1,2}$' then raise exception 'Quantidade inválida'; end if;
   v_quant := (v_item->>'quantidade')::integer;
   if v_quant < 1 or v_quant > 99 then raise exception 'Quantidade inválida'; end if;
   select p.id,p.nome,p.preco_sugerido into v_prod from public.produtos p join public.loja_produtos lp on lp.produto_id=p.id::text and lp.user_id=p.user_id
   where p.id::text=v_item->>'produto_id' and p.user_id=v_user and lp.ativo=true;
   if not found or v_prod.preco_sugerido is null or v_prod.preco_sugerido < 0 then raise exception 'Produto indisponível'; end if;
   v_total := v_total + v_quant * v_prod.preco_sugerido;
   v_itens := v_itens || jsonb_build_array(jsonb_build_object('produto_id',v_prod.id,'nome',v_prod.nome,'quantidade',v_quant,'preco_unitario',v_prod.preco_sugerido));
 end loop;
 insert into public.loja_pedidos(user_id,cliente_nome,cliente_whatsapp,itens,total) values(v_user,trim(p_cliente_nome),trim(p_cliente_whatsapp),v_itens,v_total) returning id into v_id;
 return jsonb_build_object('id',v_id,'total',v_total);
end $$;
revoke all on function public.criar_pedido_loja(text,text,text,jsonb) from public;
grant execute on function public.criar_pedido_loja(text,text,text,jsonb) to anon,authenticated;

-- Baixa atômica para evitar estoque negativo e manipulação de outros usuários.
create or replace function public.consumir_insumo(p_insumo_id uuid,p_quantidade numeric,p_motivo text default 'consumo')
returns numeric language plpgsql security definer set search_path=public as $$
declare v_restante numeric;
begin
 if p_quantidade is null or p_quantidade<=0 then raise exception 'Quantidade deve ser positiva'; end if;
 update public.insumos_3d set quantidade=quantidade-p_quantidade where id=p_insumo_id and user_id=auth.uid() and quantidade>=p_quantidade returning quantidade into v_restante;
 if not found then raise exception 'Insumo inexistente ou saldo insuficiente'; end if;
 insert into public.insumos_movimentos(user_id,insumo_id,quantidade,motivo) values(auth.uid(),p_insumo_id,p_quantidade,left(coalesce(p_motivo,'consumo'),100));
 return v_restante;
end $$;
revoke all on function public.consumir_insumo(uuid,numeric,text) from public;
grant execute on function public.consumir_insumo(uuid,numeric,text) to authenticated;
