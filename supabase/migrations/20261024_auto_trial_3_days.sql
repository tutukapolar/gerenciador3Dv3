-- Executar uma única vez no Supabase SQL Editor.
-- Apenas contas criadas após a ativação desta migração podem obter o teste automático.
create table if not exists public.auto_trial_settings (
 id integer primary key check(id = 1),
 enabled_at timestamptz not null default now()
);
insert into public.auto_trial_settings(id) values (1) on conflict(id) do nothing;
create table if not exists public.auto_trial_claims (
 user_id uuid primary key references auth.users(id) on delete cascade,
 started_at timestamptz not null,
 ends_at timestamptz not null
);
alter table public.auto_trial_settings enable row level security;
alter table public.auto_trial_claims enable row level security;
revoke all on public.auto_trial_settings, public.auto_trial_claims from anon, authenticated;
create or replace function public.claim_new_user_trial()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_user uuid := auth.uid(); v_created timestamptz; v_launch timestamptz; v_plan text; v_expires timestamptz; v_end timestamptz;
begin
 if v_user is null then raise exception 'Autenticação necessária'; end if;
 select created_at into v_created from auth.users where id = v_user;
 select enabled_at into v_launch from public.auto_trial_settings where id = 1;
 if v_created is null or v_launch is null or v_created < v_launch then
   return jsonb_build_object('eligible',false,'reason','not_new');
 end if;
 if exists(select 1 from public.auto_trial_claims where user_id=v_user) or
    exists(select 1 from public.trial_grants where user_id=v_user) then
   return jsonb_build_object('eligible',false,'reason','already_used');
 end if;
 -- Bloqueia teste gratuito se já houver PRO ou período PRO previamente registrado.
 select plano,data_expiracao into v_plan,v_expires from public.profiles where id=v_user for update;
 if v_plan='pro' or v_expires is not null then
   return jsonb_build_object('eligible',false,'reason','already_pro');
 end if;
 v_end := now() + interval '3 days';
 insert into public.auto_trial_claims(user_id,started_at,ends_at) values(v_user,now(),v_end)
 on conflict(user_id) do nothing;
 if not found then return jsonb_build_object('eligible',false,'reason','already_used'); end if;
 insert into public.profiles(id,plano,data_expiracao) values(v_user,'pro',v_end)
 on conflict(id) do update set plano='pro',data_expiracao=excluded.data_expiracao;
 return jsonb_build_object('eligible',true,'ends_at',v_end);
end $$;
revoke all on function public.claim_new_user_trial() from public;
grant execute on function public.claim_new_user_trial() to authenticated;
notify pgrst, 'reload schema';
