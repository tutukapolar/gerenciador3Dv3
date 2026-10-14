import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, RefreshCw, Save, Search, ShieldCheck, Users, CreditCard, Settings2, AlertTriangle } from 'lucide-react';

const DEFAULT_PLANS = {
  gratuito: { nome: 'Gratuito', preco: 0, max_impressoras: 1, max_filamentos: 5, max_produtos: 3, recursos: ['Calculadora básica', 'Estoque limitado', 'Dashboard'] },
  pro: { nome: 'PRO', preco: 19.9, max_impressoras: -1, max_filamentos: -1, max_produtos: -1, recursos: ['Tudo do Gratuito', 'Impressoras ilimitadas', 'Precificação para marketplaces', 'Gerador de anúncios com IA', 'Recursos avançados'] }
};

export default function AdminTab() {
  const { isAdmin, supabase, showToast, abaAtiva, session, setVALOR_PRO } = useApp();
  const [section, setSection] = useState('overview');
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ users: 0, pro: 0, free: 0, events: 0 });

  const callRpc = async (name, args = {}) => {
    const { data, error } = await supabase.rpc(name, args);
    if (error) throw error;
    return data;
  };

  const load = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const [userData, logData, planData] = await Promise.all([
        callRpc('admin_list_users'), callRpc('admin_list_activity', { p_limit: 100 }), callRpc('admin_get_settings')
      ]);
      const normalizedUsers = Array.isArray(userData) ? userData : [];
      const normalizedLogs = Array.isArray(logData) ? logData : [];
      setUsers(normalizedUsers);
      setLogs(normalizedLogs);
      const storedPlans = planData?.plans;
      if (storedPlans && typeof storedPlans === 'object') setPlans({ gratuito: { ...DEFAULT_PLANS.gratuito, ...storedPlans.gratuito }, pro: { ...DEFAULT_PLANS.pro, ...storedPlans.pro } });
      setStats({ users: normalizedUsers.length, pro: normalizedUsers.filter(u => u.plano === 'pro').length, free: normalizedUsers.filter(u => (u.plano || 'gratuito') !== 'pro').length, events: normalizedLogs.length });
    } catch (err) {
      console.error('Erro ao carregar painel administrativo:', err);
      showToast(`Não foi possível carregar o painel. Execute o SQL de instalação no Supabase. ${err.message || ''}`, 'error');
    } finally { setLoading(false); }
  }, [isAdmin, supabase, showToast]);

  useEffect(() => { if (abaAtiva === 'admin') load(); }, [abaAtiva, load]);
  if (abaAtiva !== 'admin') return null;
  if (!isAdmin) return <div className="rounded-2xl border border-rose-500/30 bg-slate-800 p-6 text-rose-300">Acesso restrito à administração.</div>;

  const updateUserPlan = async (user, plano) => {
    if (user.id === session?.user?.id && plano !== 'pro') {
      if (!confirm('Você está alterando o plano da sua própria conta. Continuar?')) return;
    }
    try {
      await callRpc('admin_update_user_plan', { p_user_id: user.id, p_plan: plano });
      showToast(`Plano de ${user.email} atualizado para ${plano}.`, 'success');
      await load();
    } catch (err) { showToast(`Falha ao alterar plano: ${err.message}`, 'error'); }
  };

  const savePlans = async () => {
    setSaving(true);
    try {
      await callRpc('admin_save_settings', { p_settings: { plans } });
      if (typeof setVALOR_PRO === 'function') setVALOR_PRO(Number(plans.pro.preco) || 0);
      showToast('Configurações dos planos salvas no Supabase.', 'success');
      await load();
    } catch (err) { showToast(`Falha ao salvar: ${err.message}`, 'error'); }
    finally { setSaving(false); }
  };

  const updatePlan = (key, field, value) => setPlans(prev => ({ ...prev, [key]: { ...prev[key], [field]: field === 'preco' || field.startsWith('max_') ? Number(value) : value } }));
  const visibleUsers = users.filter(u => `${u.email || ''} ${u.plano || ''}`.toLowerCase().includes(query.toLowerCase()));
  const money = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return <section className="space-y-5 max-w-6xl mx-auto">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-indigo-400"><ShieldCheck size={22}/><span className="text-xs uppercase tracking-widest font-bold">Área protegida</span></div><h2 className="text-2xl font-black mt-1">Administração</h2><p className="text-sm text-slate-400 mt-1">Gerencie usuários, planos e acompanhe eventos registrados pelo sistema.</p></div><button onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-slate-700 hover:bg-slate-600 px-3 py-2 text-sm"><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/> Atualizar</button></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[{label:'Usuários cadastrados',value:stats.users,icon:Users},{label:'Assinantes PRO',value:stats.pro,icon:CreditCard},{label:'Plano gratuito',value:stats.free,icon:Users},{label:'Eventos recentes',value:stats.events,icon:Activity}].map(item => { const Icon=item.icon; return <div key={item.label} className="rounded-xl border border-slate-700 bg-slate-800 p-4"><div className="flex justify-between text-slate-400 text-xs gap-2"><span>{item.label}</span><Icon size={17}/></div><div className="text-2xl font-extrabold mt-2">{item.value}</div></div>; })}</div>
    <div className="flex gap-2 overflow-x-auto pb-1">{[{id:'overview',label:'Usuários',icon:Users},{id:'plans',label:'Planos e preços',icon:CreditCard},{id:'activity',label:'Atividades',icon:Activity}].map(t=>{const Icon=t.icon;return <button key={t.id} onClick={()=>setSection(t.id)} className={`whitespace-nowrap inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${section===t.id?'bg-indigo-600 text-white':'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}><Icon size={16}/>{t.label}</button>})}</div>
    {section === 'overview' && <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4 space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-bold">Contas de usuários</h3><div className="relative w-full sm:w-72"><Search size={16} className="absolute left-3 top-3 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por e-mail ou plano" className="w-full rounded-lg border border-slate-600 bg-slate-900 pl-9 pr-3 py-2 text-sm"/></div></div><div className="overflow-x-auto"><table className="w-full text-sm min-w-[620px]"><thead><tr className="text-left text-slate-400 border-b border-slate-700"><th className="p-3">E-mail</th><th className="p-3">Plano</th><th className="p-3">Cadastro</th><th className="p-3">Alterar plano</th></tr></thead><tbody>{visibleUsers.map(u=><tr key={u.id} className="border-b border-slate-700/70"><td className="p-3">{u.email || 'Sem e-mail'}{u.id===session?.user?.id && <span className="ml-2 text-xs text-indigo-300">Você</span>}</td><td className="p-3"><span className="rounded-full bg-slate-700 px-2 py-1 text-xs">{u.plano || 'gratuito'}</span></td><td className="p-3 text-slate-400">{u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '—'}</td><td className="p-3"><select value={u.plano || 'gratuito'} onChange={e=>updateUserPlan(u,e.target.value)} className="rounded-lg border border-slate-600 bg-slate-900 p-2" aria-label={`Plano de ${u.email}`}><option value="gratuito">Gratuito</option><option value="pro">PRO</option></select></td></tr>)}</tbody></table>{!visibleUsers.length && <p className="p-5 text-center text-slate-400">Nenhum usuário encontrado.</p>}</div><p className="text-xs text-slate-500">A troca de plano atualiza o registro no Supabase. Cobranças PIX não são processadas automaticamente por esta tela.</p></div>}
    {section === 'plans' && <div className="grid lg:grid-cols-2 gap-4">{Object.entries(plans).map(([key,plan])=><div key={key} className="rounded-2xl border border-slate-700 bg-slate-800 p-5 space-y-4"><div className="flex items-center justify-between"><h3 className="text-lg font-bold">Plano {plan.nome}</h3><span className="text-xs uppercase text-slate-400">{key}</span></div><label className="block text-sm text-slate-300">Nome do plano<input value={plan.nome} onChange={e=>updatePlan(key,'nome',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 p-2"/></label><label className="block text-sm text-slate-300">Preço mensal (R$)<input type="number" min="0" step="0.01" value={plan.preco} onChange={e=>updatePlan(key,'preco',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 p-2"/></label><div className="grid grid-cols-3 gap-2">{[['max_impressoras','Impressoras'],['max_filamentos','Filamentos'],['max_produtos','Produtos']].map(([field,label])=><label key={field} className="text-xs text-slate-400">{label}<input type="number" min="-1" value={plan[field]} onChange={e=>updatePlan(key,field,e.target.value)} className="mt-1 w-full min-w-0 rounded-lg border border-slate-600 bg-slate-900 p-2 text-sm"/></label>)}</div><label className="block text-sm text-slate-300">Recursos (um por linha)<textarea rows={5} value={(plan.recursos||[]).join('\n')} onChange={e=>updatePlan(key,'recursos',e.target.value.split('\n').map(s=>s.trim()).filter(Boolean))} className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 p-2"/></label><p className="text-xs text-slate-500">-1 significa ilimitado. Preços e limites salvos aqui ficam disponíveis na configuração administrativa; revise as regras de acesso do app antes de considerar os limites como proteção de segurança.</p></div>)}<div className="lg:col-span-2 flex justify-end"><button onClick={savePlans} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 font-bold disabled:opacity-60"><Save size={16}/>{saving?'Salvando…':'Salvar planos'}</button></div></div>}
    {section === 'activity' && <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4"><div className="flex items-center gap-2 mb-3"><Settings2 size={18}/><h3 className="font-bold">Registro de atividades</h3></div><div className="flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-sm text-amber-200 mb-4"><AlertTriangle size={18} className="shrink-0 mt-0.5"/><p>O painel mostra eventos que forem registrados na tabela. Ele não monitora automaticamente cada clique ou conteúdo digitado. O registro inicial pode incluir login e alterações administrativas; mais eventos podem ser adicionados nas ações do app.</p></div>{logs.length ? <div className="space-y-2">{logs.map((log,i)=><div key={log.id||i} className="rounded-lg border border-slate-700 p-3 flex flex-wrap justify-between gap-2"><div><div className="font-medium">{log.event_type || log.action || 'Evento'}</div><div className="text-xs text-slate-400">{log.user_email || log.user_id || 'Sistema'} {log.details ? `· ${typeof log.details==='string'?log.details:JSON.stringify(log.details)}`:''}</div></div><time className="text-xs text-slate-500">{log.created_at ? new Date(log.created_at).toLocaleString('pt-BR') : ''}</time></div>)}</div>:<p className="text-sm text-slate-400">Nenhum evento registrado ainda.</p>}</div>}
  </section>;
}
