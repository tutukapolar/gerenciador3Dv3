-- V11: Execute depois de todas as migrações da versão v10.
-- A integração WhatsApp é opcional; pedidos continuam funcionando sem ela.
create table if not exists public.loja_whatsapp_notificacoes (
  pedido_id uuid primary key references public.loja_pedidos(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pendente' check(status in ('pendente','enviando','enviado','erro','desativado')),
  tentativas int not null default 0,
  erro text,
  meta_message_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.loja_whatsapp_notificacoes enable row level security;
revoke all on public.loja_whatsapp_notificacoes from anon,authenticated;
grant select on public.loja_whatsapp_notificacoes to authenticated;
drop policy if exists loja_whatsapp_notificacoes_owner on public.loja_whatsapp_notificacoes;
create policy loja_whatsapp_notificacoes_owner on public.loja_whatsapp_notificacoes for select to authenticated using(user_id=auth.uid());

-- O cliente nunca pode manipular a fila: ela é criada no servidor ao inserir o pedido.
create or replace function public.criar_notificacao_pedido_loja()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.loja_whatsapp_notificacoes(pedido_id,user_id)
  values(new.id,new.user_id) on conflict(pedido_id) do nothing;
  return new;
end $$;
drop trigger if exists trg_criar_notificacao_pedido_loja on public.loja_pedidos;
create trigger trg_criar_notificacao_pedido_loja after insert on public.loja_pedidos
for each row execute function public.criar_notificacao_pedido_loja();

-- Chamada apenas pelo service_role da Edge Function. A atualização condicional
-- reduz notificações duplicadas em chamadas concorrentes.
create or replace function public.reservar_notificacao_whatsapp(p_pedido_id uuid)
returns boolean language plpgsql security definer set search_path=public as $$
begin
  if auth.role() <> 'service_role' then raise exception 'Acesso negado'; end if;
  update public.loja_whatsapp_notificacoes set status='enviando', tentativas=tentativas+1,erro=null,updated_at=now()
  where pedido_id=p_pedido_id and status in ('pendente','erro') and tentativas<4;
  return found;
end $$;
revoke all on function public.reservar_notificacao_whatsapp(uuid) from public,anon,authenticated;
grant execute on function public.reservar_notificacao_whatsapp(uuid) to service_role;

-- Reprocessamento manual de falhas (o dono pode solicitar apenas dos próprios pedidos).
create or replace function public.reenfileirar_notificacao_whatsapp(p_pedido_id uuid)
returns void language plpgsql security definer set search_path=public as $$
begin
  if auth.uid() is null then raise exception 'Faça login'; end if;
  update public.loja_whatsapp_notificacoes set status='pendente',tentativas=0,erro=null,updated_at=now()
  where pedido_id=p_pedido_id and user_id=auth.uid() and status='erro';
  if not found then raise exception 'Notificação não encontrada ou não está com erro'; end if;
end $$;
revoke all on function public.reenfileirar_notificacao_whatsapp(uuid) from public,anon;
grant execute on function public.reenfileirar_notificacao_whatsapp(uuid) to authenticated;
