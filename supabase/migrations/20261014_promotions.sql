-- Negocio 3D: promoções administráveis
-- Execute no SQL Editor do Supabase depois de conferir o e-mail de administrador.
create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  active boolean not null default false,
  eligible_new_users boolean not null default true,
  normal_price numeric(10,2) not null default 19.90 check (normal_price >= 0),
  promo_price numeric(10,2) not null default 9.90 check (promo_price >= 0 and promo_price <= normal_price),
  duration_months integer not null default 3 check (duration_months between 1 and 24),
  max_redemptions integer not null default 100 check (max_redemptions >= 0),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.promotion_redemptions (
  id uuid primary key default gen_random_uuid(),
  promotion_id uuid not null references public.promotions(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  ip_hash text,
  price numeric(10,2) not null,
  duration_months integer not null,
  status text not null default 'reserved' check (status in ('reserved','paid','cancelled')),
  created_at timestamptz not null default now(),
  unique (promotion_id, user_id)
);
alter table public.promotions enable row level security;
alter table public.promotion_redemptions enable row level security;
-- Administração por e-mail. Troque pelo e-mail real da sua conta antes de executar.
create policy "admin manages promotions" on public.promotions for all to authenticated
using ((auth.jwt()->>'email') = 'ytty8229@gmail.com')
with check ((auth.jwt()->>'email') = 'ytty8229@gmail.com');
create policy "admin reads redemptions" on public.promotion_redemptions for select to authenticated
using ((auth.jwt()->>'email') = 'ytty8229@gmail.com');
create policy "users read own redemption" on public.promotion_redemptions for select to authenticated
using (user_id = auth.uid());
insert into public.promotions(name,active,eligible_new_users,normal_price,promo_price,duration_months,max_redemptions,starts_at)
select 'Boas-vindas PRO', true, true, 19.90, 9.90, 3, 100, now()
where not exists (select 1 from public.promotions where name = 'Boas-vindas PRO');
