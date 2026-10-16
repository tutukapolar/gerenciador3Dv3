-- Execute depois de 20261014_admin_panel.sql.
create extension if not exists pgcrypto;
create table if not exists public.trial_invites (
 id uuid primary key default gen_random_uuid(), token text unique,
 target_user_id uuid references auth.users(id) on delete cascade,
 trial_days integer not null check(trial_days between 1 and 365),
 offer_price numeric(10,2) not null check(offer_price >= 0),
 offer_months integer not null check(offer_months between 1 and 24),
 max_uses integer not null default 1 check(max_uses between 1 and 10000),
 used_count integer not null default 0,
 expires_at timestamptz,
 created_at timestamptz not null default now(),
 created_by uuid references auth.users(id),
 check ((token is null) <> (target_user_id is null))
);
create table if not exists public.trial_grants (
 id uuid primary key default gen_random_uuid(), invite_id uuid not null references public.trial_invites(id),
 user_id uuid not null references auth.users(id) on delete cascade,
 starts_at timestamptz, ends_at timestamptz,
 offer_price numeric(10,2) not null, offer_months integer not null,
 offer_expires_at timestamptz,
 notified_at timestamptz,
 created_at timestamptz not null default now(),
 unique(invite_id,user_id)
);
create unique index if not exists trial_grants_one_per_user on public.trial_grants(user_id);
alter table public.trial_invites enable row level security;
alter table public.trial_grants enable row level security;
revoke all on public.trial_invites, public.trial_grants from anon, authenticated;
create or replace function public.admin_create_trial(p_user_id uuid, p_days int, p_price numeric, p_months int, p_max_uses int default 1, p_expires_at timestamptz default null)
returns text language plpgsql security definer set search_path = '' as $$
declare v_token text; v_id uuid;
begin
 if not public.is_site_admin() then raise exception 'Acesso negado'; end if;
 if p_days not between 1 and 365 or p_months not between 1 and 24 or p_price < 0 or p_price is null or p_max_uses not between 1 and 10000 then raise exception 'Parâmetros inválidos'; end if;
 if p_user_id is not null and not exists(select 1 from auth.users where id=p_user_id) then raise exception 'Usuário não encontrado'; end if;
 if p_user_id is not null and exists(select 1 from public.trial_grants where user_id=p_user_id) then raise exception 'Usuário já recebeu teste'; end if;
 if p_user_id is null then v_token := replace(gen_random_uuid()::text,'-','') || replace(gen_random_uuid()::text,'-',''); end if;
 insert into public.trial_invites(token,target_user_id,trial_days,offer_price,offer_months,max_uses,expires_at,created_by)
 values(v_token,p_user_id,p_days,p_price,p_months,case when p_user_id is not null then 1 else p_max_uses end,p_expires_at,auth.uid()) returning id into v_id;
 if p_user_id is not null then
   insert into public.trial_grants(invite_id,user_id,offer_price,offer_months)
   values(v_id,p_user_id,p_price,p_months);
 end if;
 return coalesce(v_token,'ENVIADO');
end $$;
create or replace function public.redeem_trial(p_token text default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_inv public.trial_invites%rowtype; v_grant public.trial_grants%rowtype; v_prof public.profiles%rowtype;
begin
 if auth.uid() is null then raise exception 'Faça login para resgatar'; end if;
 if p_token is not null then
  select * into v_inv from public.trial_invites where token=p_token for update;
  if not found or (v_inv.expires_at is not null and v_inv.expires_at<=now()) or v_inv.used_count>=v_inv.max_uses then raise exception 'Convite inválido, expirado ou esgotado'; end if;
  if exists(select 1 from public.trial_grants where user_id=auth.uid()) then raise exception 'Teste já concedido a esta conta'; end if;
  insert into public.trial_grants(invite_id,user_id,offer_price,offer_months)
  values(v_inv.id,auth.uid(),v_inv.offer_price,v_inv.offer_months) returning * into v_grant;
  update public.trial_invites set used_count=used_count+1 where id=v_inv.id;
 else
  select * into v_grant from public.trial_grants where user_id=auth.uid() and starts_at is null for update;
  if not found then raise exception 'Nenhum teste pendente'; end if;
  select * into v_inv from public.trial_invites where id=v_grant.invite_id;
 end if;
 select * into v_prof from public.profiles where id=auth.uid() for update;
 if v_prof.plano='pro' and (v_prof.data_expiracao is null or v_prof.data_expiracao>now()) then raise exception 'Conta já possui PRO ativo'; end if;
 update public.trial_grants set starts_at=now(), ends_at=now()+make_interval(days=>v_inv.trial_days),
 offer_expires_at=now()+make_interval(days=>v_inv.trial_days+30), notified_at=now()
 where id=v_grant.id returning * into v_grant;
 insert into public.profiles(id,plano,data_expiracao) values(auth.uid(),'pro',v_grant.ends_at)
 on conflict(id) do update set plano='pro',data_expiracao=excluded.data_expiracao;
 return jsonb_build_object('ends_at',v_grant.ends_at,'offer_price',v_grant.offer_price,'offer_months',v_grant.offer_months);
end $$;
create or replace function public.my_trial_status()
returns jsonb language sql stable security definer set search_path = '' as $$
 select coalesce((select jsonb_build_object('pending',g.starts_at is null,'ends_at',g.ends_at,
 'offer_price',g.offer_price,'offer_months',g.offer_months,'offer_expires_at',g.offer_expires_at)
 from public.trial_grants g where g.user_id=auth.uid() limit 1),'{}'::jsonb)
$$;
revoke all on function public.admin_create_trial(uuid,int,numeric,int,int,timestamptz), public.redeem_trial(text), public.my_trial_status() from public;
grant execute on function public.admin_create_trial(uuid,int,numeric,int,int,timestamptz), public.redeem_trial(text), public.my_trial_status() to authenticated;
-- IMPORTANTE: A oferta individual deve ser validada no backend do PIX antes de cobrar.
-- Esta migração NÃO modifica a cobrança nem autoriza desconto no frontend.
