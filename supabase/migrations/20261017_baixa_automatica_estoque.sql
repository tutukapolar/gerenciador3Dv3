-- Aplicar após migrações v8 e v9. Faça backup previamente.
alter table public.produtos add column if not exists materiais_receita jsonb not null default '[]'::jsonb;
create table if not exists public.producao_baixas (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id),
 encomenda_id text not null, tipo text not null check(tipo in ('filamento','insumo')),
 material_id text not null, quantidade numeric not null check(quantidade>0),
 created_at timestamptz not null default now(),unique(encomenda_id,tipo,material_id)
);
alter table public.producao_baixas enable row level security;
create policy "producao_baixas_owner_read" on public.producao_baixas for select to authenticated using(user_id=auth.uid());
-- Executada exclusivamente por funções que também criam a encomenda na mesma transação.
create or replace function public._debitar_receita_produto(p_user uuid,p_produto_id text,p_qtd integer,p_encomenda text)
returns void language plpgsql security definer set search_path=public as $$
declare v_receita jsonb; v_item jsonb; v_tipo text; v_id text; v_qty numeric; v_saldo numeric;
begin
 if p_qtd<=0 or p_qtd>999 then raise exception 'Quantidade inválida'; end if;
 select materiais_receita into v_receita from public.produtos where id::text=p_produto_id and user_id=p_user;
 if not found then raise exception 'Produto do catálogo não encontrado'; end if;
 if jsonb_typeof(v_receita)<>'array' or jsonb_array_length(v_receita)=0 then raise exception 'Configure a ficha de materiais do produto antes de aceitar encomendas'; end if;
 -- Agrega materiais iguais da ficha e bloqueia cada saldo via UPDATE condicional.
 for v_tipo,v_id,v_qty in
  select item->>'tipo',item->>'id',sum((item->>'quantidade')::numeric)*p_qtd
  from jsonb_array_elements(v_receita) item
  group by item->>'tipo',item->>'id' order by 1,2
 loop
  if v_qty is null or v_qty<=0 or v_qty>10000000 then raise exception 'Quantidade inválida na ficha de materiais'; end if;
  if v_tipo='filamento' then
   update public.estoque_filamentos set peso_atual_g=peso_atual_g-v_qty
    where id::text=v_id and user_id=p_user and peso_atual_g>=v_qty returning peso_atual_g into v_saldo;
  elsif v_tipo='insumo' then
   update public.insumos_3d set quantidade=quantidade-v_qty
    where id::text=v_id and user_id=p_user and quantidade>=v_qty returning quantidade into v_saldo;
  else raise exception 'Tipo de material inválido'; end if;
  if not found then raise exception 'Estoque insuficiente ou material inexistente: % (%)',v_id,v_tipo; end if;
  insert into public.producao_baixas(user_id,encomenda_id,tipo,material_id,quantidade)
   values(p_user,p_encomenda,v_tipo,v_id,v_qty)
   on conflict(encomenda_id,tipo,material_id) do update set quantidade=public.producao_baixas.quantidade+excluded.quantidade;
  if v_tipo='insumo' then
   insert into public.insumos_movimentos(user_id,insumo_id,quantidade,motivo)
   values(p_user,v_id::uuid,v_qty,'encomenda '||left(p_encomenda,60));
  end if;
 end loop;
end $$;
revoke all on function public._debitar_receita_produto(uuid,text,integer,text) from public,anon,authenticated;

-- Aprovação de loja: cria encomenda e debita todos os itens atomicamente.
create or replace function public.aceitar_pedido_loja(p_pedido_id uuid)
returns void language plpgsql security definer set search_path=public as $$
declare v_pedido public.loja_pedidos%rowtype; v_item jsonb; v_nome text; v_qtd integer; v_enc_id text;
begin
 if auth.uid() is null then raise exception 'Login necessário'; end if;
 select * into v_pedido from public.loja_pedidos where id=p_pedido_id and user_id=auth.uid() for update;
 if not found then raise exception 'Pedido inexistente'; end if;
 if v_pedido.status<>'novo' then raise exception 'Pedido já processado'; end if;
 select string_agg(value->>'nome',', ') into v_nome from jsonb_array_elements(v_pedido.itens);
 select coalesce(sum((value->>'quantidade')::integer),0) into v_qtd from jsonb_array_elements(v_pedido.itens);
 insert into public.encomendas(user_id,cliente,contato,endereco,produto_nome,quantidade,valor_total,status,data,loja_pedido_id)
 values(v_pedido.user_id,v_pedido.cliente_nome,v_pedido.cliente_whatsapp,coalesce(v_pedido.endereco_entrega,''),v_nome,v_qtd,v_pedido.total,'Pendente',to_char(now(),'DD/MM/YYYY'),v_pedido.id)
 returning id::text into v_enc_id;
 for v_item in select value from jsonb_array_elements(v_pedido.itens) loop
  perform public._debitar_receita_produto(v_pedido.user_id,v_item->>'produto_id',(v_item->>'quantidade')::integer,v_enc_id);
 end loop;
 update public.loja_pedidos set status='aceito' where id=p_pedido_id;
end $$;
revoke all on function public.aceitar_pedido_loja(uuid) from public;
grant execute on function public.aceitar_pedido_loja(uuid) to authenticated;

-- Criação manual: usa o preço informado no painel, mas material do produto real.
create or replace function public.criar_encomenda_com_estoque(
 p_produto_id text,p_cliente text,p_contato text,p_endereco text,p_quantidade integer,
 p_valor_total numeric,p_status text default 'Pendente',p_impressora_id text default null)
returns public.encomendas language plpgsql security definer set search_path=public as $$
declare v_prod record; v_enc public.encomendas%rowtype;
begin
 if auth.uid() is null then raise exception 'Login necessário'; end if;
 if trim(coalesce(p_cliente,''))='' or p_quantidade not between 1 and 999 or p_valor_total<0 or p_valor_total is null then raise exception 'Dados inválidos'; end if;
 select id,nome into v_prod from public.produtos where user_id=auth.uid() and id::text=p_produto_id;
 if not found then raise exception 'Selecione um produto cadastrado'; end if;
 insert into public.encomendas(user_id,cliente,contato,endereco,produto_nome,quantidade,valor_total,status,impressora_id,data)
 values(auth.uid(),p_cliente,p_contato,p_endereco,v_prod.nome,p_quantidade,p_valor_total,
 coalesce(p_status,'Pendente'),nullif(p_impressora_id,'')::bigint,to_char(now(),'DD/MM/YYYY')) returning * into v_enc;
 perform public._debitar_receita_produto(auth.uid(),p_produto_id,p_quantidade,v_enc.id::text);
 return v_enc;
end $$;
revoke all on function public.criar_encomenda_com_estoque(text,text,text,text,integer,numeric,text,text) from public;
grant execute on function public.criar_encomenda_com_estoque(text,text,text,text,integer,numeric,text,text) to authenticated;
