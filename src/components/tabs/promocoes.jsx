import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BadgePercent, RefreshCw, Save } from 'lucide-react';

const blank = { name: 'Boas-vindas PRO', active: true, eligible_new_users: true, normal_price: '19.90', promo_price: '9.90', duration_months: 3, max_redemptions: 100, starts_at: '', ends_at: '' };
export default function PromocoesTab() {
  const { isAdmin, supabase, showToast } = useApp();
  const [items, setItems] = useState([]); const [form, setForm] = useState(blank); const [editing, setEditing] = useState(null); const [busy, setBusy] = useState(false); const [redemptions, setRedemptions] = useState([]);
  async function load() {
    setBusy(true);
    const { data, error } = await supabase.from('promotions').select('*').order('created_at', { ascending: false });
    if (error) showToast?.('Não foi possível carregar promoções. Execute a migração SQL e confira as permissões.', 'error'); else setItems(data || []);
    const { data: rd } = await supabase.from('promotion_redemptions').select('id,promotion_id,user_id,price,duration_months,status,created_at').order('created_at', { ascending: false }).limit(100);
    setRedemptions(rd || []); setBusy(false);
  }
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);
  if (!isAdmin) return null;
  const change = (key, value) => setForm(f => ({ ...f, [key]: value }));
  async function save(e) {
    e.preventDefault();
    if (!form.name.trim() || Number(form.promo_price) < 0 || Number(form.normal_price) < Number(form.promo_price) || Number(form.duration_months) < 1 || Number(form.max_redemptions) < 0) { showToast?.('Confira os preços, a duração e o limite.', 'error'); return; }
    setBusy(true);
    const payload = { name: form.name.trim(), active: !!form.active, eligible_new_users: !!form.eligible_new_users, normal_price: Number(form.normal_price), promo_price: Number(form.promo_price), duration_months: Number(form.duration_months), max_redemptions: Number(form.max_redemptions), starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : new Date().toISOString(), ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null };
    const result = editing ? await supabase.from('promotions').update(payload).eq('id', editing) : await supabase.from('promotions').insert(payload);
    if (result.error) showToast?.('Falha ao salvar. Confira a migração e o e-mail administrador no SQL.', 'error'); else { showToast?.('Promoção salva.', 'success'); setForm(blank); setEditing(null); await load(); }
    setBusy(false);
  }
  function edit(p) { setEditing(p.id); setForm({ ...p, normal_price: String(p.normal_price), promo_price: String(p.promo_price), starts_at: p.starts_at ? p.starts_at.slice(0,16) : '', ends_at: p.ends_at ? p.ends_at.slice(0,16) : '' }); }
  return <section className="space-y-6">
    <div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold flex items-center gap-2"><BadgePercent/> Promoções</h2><p className="text-sm opacity-70">Ofertas para novos usuários e acompanhamento de resgates.</p></div><button onClick={load} className="rounded-lg border px-3 py-2 flex gap-2 items-center"><RefreshCw size={16}/> Atualizar</button></div>
    <form onSubmit={save} className="rounded-xl border p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <label className="space-y-1"><span>Nome da promoção</span><input className="w-full rounded-lg border bg-transparent p-2" value={form.name} onChange={e=>change('name',e.target.value)} required/></label>
      <label className="space-y-1"><span>Preço normal (R$)</span><input type="number" min="0" step="0.01" className="w-full rounded-lg border bg-transparent p-2" value={form.normal_price} onChange={e=>change('normal_price',e.target.value)} required/></label>
      <label className="space-y-1"><span>Preço promocional (R$)</span><input type="number" min="0" step="0.01" className="w-full rounded-lg border bg-transparent p-2" value={form.promo_price} onChange={e=>change('promo_price',e.target.value)} required/></label>
      <label className="space-y-1"><span>Duração (meses)</span><input type="number" min="1" max="24" className="w-full rounded-lg border bg-transparent p-2" value={form.duration_months} onChange={e=>change('duration_months',Number(e.target.value))} required/></label>
      <label className="space-y-1"><span>Limite de resgates (0 = ilimitado)</span><input type="number" min="0" className="w-full rounded-lg border bg-transparent p-2" value={form.max_redemptions} onChange={e=>change('max_redemptions',Number(e.target.value))} required/></label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={e=>change('active',e.target.checked)}/> Promoção ativa</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={form.eligible_new_users} onChange={e=>change('eligible_new_users',e.target.checked)}/> Apenas contas com até 7 dias</label>
      <div className="sm:col-span-2 flex gap-2"><button disabled={busy} className="rounded-lg bg-indigo-600 text-white px-4 py-2 flex gap-2 items-center"><Save size={16}/>{editing?'Salvar alterações':'Criar promoção'}</button><button type="button" onClick={()=>{setForm(blank);setEditing(null)}} className="rounded-lg border px-4 py-2">Limpar</button></div>
    </form>
    <div className="grid gap-3">{items.map(p=><article key={p.id} className="rounded-xl border p-4 flex flex-wrap items-center justify-between gap-3"><div><strong>{p.name}</strong><p className="text-sm opacity-70">R$ {Number(p.promo_price).toFixed(2)} por {p.duration_months} mês(es) · {redemptions.filter(r=>r.promotion_id===p.id && r.status!=='cancelled').length}/{p.max_redemptions||'∞'} resgates · {p.active?'Ativa':'Pausada'}</p></div><button onClick={()=>edit(p)} className="rounded-lg border px-3 py-2">Editar</button></article>)}</div>
    <p className="text-sm opacity-70">A função claim-promotion valida a elegibilidade e calcula o preço no servidor. Um resgate reservado não comprova pagamento nem ativa o PRO; conecte a confirmação ao seu provedor de pagamento antes de cobrar clientes.</p>
  </section>;
}
