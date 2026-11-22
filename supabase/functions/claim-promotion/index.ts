import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info", "Access-Control-Allow-Methods": "POST, OPTIONS", "Content-Type": "application/json" };
const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: cors });
async function sha256(s: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join(""); }
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json(405, { error: "Método não permitido" });
  const url = Deno.env.get("SUPABASE_URL")!; const anon = Deno.env.get("SUPABASE_ANON_KEY")!; const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const auth = req.headers.get("Authorization"); if (!auth) return json(401, { error: "Faça login para continuar." });
  const userClient = createClient(url, anon, { global: { headers: { Authorization: auth } } });
  const { data: { user }, error: userErr } = await userClient.auth.getUser();
  if (userErr || !user) return json(401, { error: "Sessão inválida." });
  let body: { promotion_id?: string }; try { body = await req.json(); } catch { return json(400, { error: "JSON inválido." }); }
  if (!body.promotion_id) return json(400, { error: "promotion_id obrigatório." });
  const admin = createClient(url, service);
  const { data: promo, error: pe } = await admin.from("promotions").select("*").eq("id", body.promotion_id).maybeSingle();
  if (pe || !promo || !promo.active) return json(404, { error: "Promoção indisponível." });
  const now = Date.now(); if (new Date(promo.starts_at).getTime() > now || (promo.ends_at && new Date(promo.ends_at).getTime() < now)) return json(409, { error: "Promoção fora do período válido." });
  if (promo.eligible_new_users) {
    const created = new Date(user.created_at).getTime();
    if (Date.now() - created > 7 * 24 * 60 * 60 * 1000) return json(403, { error: "Oferta exclusiva para contas criadas nos últimos 7 dias." });
  }
  const { count } = await admin.from("promotion_redemptions").select("id", { count: "exact", head: true }).eq("promotion_id", promo.id).neq("status", "cancelled");
  if (promo.max_redemptions > 0 && (count ?? 0) >= promo.max_redemptions) return json(409, { error: "Esta promoção atingiu o limite de resgates." });
  const ip = (req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown").split(",")[0].trim();
  const salt = Deno.env.get("PROMOTION_IP_HASH_SECRET"); const ipHash = (ip !== "unknown" && salt) ? await sha256(`${salt}:${ip}`) : null;
  const { data: existing } = await admin.from("promotion_redemptions").select("id,status,price,duration_months").eq("promotion_id", promo.id).eq("user_id", user.id).maybeSingle();
  if (existing && existing.status !== "cancelled") return json(200, { redemption_id: existing.id, price: existing.price, duration_months: existing.duration_months, status: existing.status, reused: true });
  // IP é apenas um sinal antifraude, não uma identidade: redes móveis compartilham e alteram IPs.
  const { data: row, error: insertErr } = await admin.from("promotion_redemptions").insert({ promotion_id: promo.id, user_id: user.id, ip_hash: ipHash, price: promo.promo_price, duration_months: promo.duration_months, status: "reserved" }).select("id,price,duration_months,status").single();
  if (insertErr) return json(500, { error: "Não foi possível reservar a oferta. Tente novamente." });
  return json(200, { redemption_id: row.id, price: row.price, duration_months: row.duration_months, status: row.status });
});
