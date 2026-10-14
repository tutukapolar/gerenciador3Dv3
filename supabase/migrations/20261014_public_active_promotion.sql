-- Preço público da promoção ativa para exibição na landing page e na aba Planos.
-- A função só expõe campos comerciais públicos; não expõe resgates nem dados de usuários.
create or replace function public.get_public_active_promotion()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id', p.id,
    'name', p.name,
    'active', p.active,
    'normal_price', p.normal_price,
    'promo_price', p.promo_price,
    'duration_months', p.duration_months,
    'eligible_new_users', p.eligible_new_users,
    'starts_at', p.starts_at,
    'ends_at', p.ends_at
  )
  from public.promotions p
  where p.active = true
    and (p.starts_at is null or p.starts_at <= now())
    and (p.ends_at is null or p.ends_at > now())
    and (p.max_redemptions = 0 or (
      select count(*) from public.promotion_redemptions r
      where r.promotion_id = p.id and r.status in ('reserved','paid')
    ) < p.max_redemptions)
  order by p.created_at desc
  limit 1;
$$;
revoke all on function public.get_public_active_promotion() from public;
grant execute on function public.get_public_active_promotion() to anon, authenticated;
