import React from 'react';
import { Gift, ArrowRight, X, BookOpen } from 'lucide-react';

const sections = [
  ['Painel', 'Veja o resumo da produção, indicadores e seus atalhos.', 'dashboard'],
  ['Máquinas', 'Cadastre suas impressoras e configure os custos de funcionamento.', 'maquinas'],
  ['Filamentos e insumos', 'Registre materiais, preços e quantidades para acompanhar o estoque.', 'estoque'],
  ['Calculadora', 'Informe material, tempo e custos para estimar o preço de venda.', 'calculadora'],
  ['Produtos', 'Organize seu catálogo de peças e seus preços.', 'produtos'],
  ['Loja', 'Publique produtos e acompanhe os pedidos recebidos.', 'loja'],
  ['Encomendas', 'Acompanhe o andamento dos trabalhos e suas entregas.', 'encomendas'],
  ['Anúncios', 'Prepare descrições para divulgar seus produtos.', 'anuncios'],
  ['Configurações', 'Personalize os valores padrão, aparência e organização das abas.', 'configuracoes'],
  ['Planos', 'Compare os recursos gratuitos e PRO disponíveis.', 'planos'],
];
export default function NewUserExperience({ supabase, userId, onActivated, setAbaAtiva, onboardingOpen }) {
 const [trial, setTrial] = React.useState(null);
 const [guide, setGuide] = React.useState(false);
 const [step, setStep] = React.useState(0);
 React.useEffect(() => {
  if (!userId) return;
  let active = true;
  // O servidor decide quem é novo, se o teste já foi usado e a expiração.
  supabase.rpc('claim_new_user_trial').then(({data,error}) => {
    if (!active) return;
    if (error) { console.warn('Teste automático indisponível:', error.message); return; }
    if (data?.eligible) { setTrial(data); onActivated?.(); }
  });
  return () => { active = false; };
 }, [userId, supabase]);
 React.useEffect(() => {
  if (!userId || onboardingOpen || trial) return;
  if (localStorage.getItem(`negocio3d:tour:${userId}`) !== 'done') setGuide(true);
 }, [userId, onboardingOpen, trial]);
 const finish = () => { localStorage.setItem(`negocio3d:tour:${userId}`,'done'); setGuide(false); };
 if (trial) return <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 p-4">
   <div className="w-full max-w-md rounded-2xl border border-indigo-500 bg-slate-900 p-6 text-white shadow-2xl">
     <Gift className="mb-3 text-indigo-400" size={32}/><h2 className="text-2xl font-bold">Seu PRO grátis está ativo!</h2>
     <p className="mt-3 text-slate-300">Você ganhou 3 dias para experimentar o PRO, sem cobrança automática.</p>
     <p className="mt-2 text-sm text-indigo-300">Válido até {new Date(trial.ends_at).toLocaleString('pt-BR')}.</p>
     <button className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold" onClick={()=>setTrial(null)}>Conhecer o sistema</button>
   </div></div>;
 if (!guide || onboardingOpen) return null;
 const [title,description,tab] = sections[step];
 return <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 p-4">
  <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl">
    <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-indigo-300"><BookOpen size={20}/> Guia do Negócio 3D</div><button onClick={finish} aria-label="Fechar tutorial"><X size={20}/></button></div>
    <p className="mt-4 text-xs text-slate-400">Funcionalidade {step+1} de {sections.length}</p>
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700"><div className="h-full bg-indigo-500" style={{width:`${(step+1)/sections.length*100}%`}}/></div>
    <h2 className="mt-6 text-2xl font-bold">{title}</h2><p className="mt-3 text-slate-300">{description}</p>
    <div className="mt-6 flex flex-wrap justify-between gap-2"><button onClick={()=>{setAbaAtiva(tab);}} className="rounded-lg border border-slate-600 px-3 py-2 text-sm">Abrir esta aba</button>
      <div className="flex gap-2"><button onClick={finish} className="rounded-lg px-3 py-2 text-slate-400">Pular</button>
      <button onClick={()=>step===sections.length-1?finish():setStep(step+1)} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-semibold">{step===sections.length-1?'Concluir':'Próximo'} <ArrowRight size={16}/></button></div></div>
  </div></div>;
}
