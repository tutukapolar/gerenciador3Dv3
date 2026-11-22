import InsumosTab from './tabs/insumos';
import LojaTab from './tabs/loja';
import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calculator, 
  Package, 
  ShoppingCart, 
  ListOrdered, 
  Trash2,
  Plus, 
  Box,
  TrendingUp,
  Clock,
  DollarSign,
  Link as LinkIcon,
  Phone,
  MapPin,
  Truck,
  PieChart,
  TrendingDown,
  Layers,
  AlertTriangle,
  Megaphone,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  LogOut,
  Shield,
  Printer,
  Cpu,
  CreditCard,
  CheckCircle2,
  Droplet,
  Star,
  Lock,
  MessageSquare,
  Bug,
  Send,
  ThumbsUp,
  Wand2,
  QrCode,
  Settings, Store, Wrench, ArrowLeft, ArrowRight, SlidersHorizontal
} from 'lucide-react';
import DashboardTab from './tabs/dashboard';
import MaquinasTab from './tabs/maquinas';
import CalculadoraTab from './tabs/calculadora';
import EstoqueTab from './tabs/estoque';
import ProdutosTab from './tabs/produtos';
import AnunciosTab from './tabs/anuncios';
import EncomendasTab from './tabs/encomendas';
import SugestoesTab from './tabs/sugestoes';
import PlanosTab from './tabs/planos';
import OnboardingWizard from './OnboardingWizard';
import Toast from './Toast';
import AIAssistant from './AIAssistant';
import ConfiguracoesTab from './tabs/configuracoes';
import AdminTab from './tabs/admin';
import PromocoesTab from './tabs/promocoes';

export default function DashboardLayout() {
  const { abaAtiva, setAbaAtiva, userPlan, isAdmin, supabase, configuracoes } = useApp();

  const storageKey = `negocio3d-tabs-${supabase?.auth ? 'preferences' : 'local'}`;
  const [tabPrefs, setTabPrefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('negocio3d-tabs-preferences')) || { order: [], favorites: [] }; }
    catch { return { order: [], favorites: [] }; }
  });
  useEffect(() => { try { localStorage.setItem('negocio3d-tabs-preferences', JSON.stringify(tabPrefs)); } catch {} }, [tabPrefs]);
  const allTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'maquinas', label: 'Máquinas', icon: Printer },
    { id: 'calculadora', label: 'Calculadora', icon: Calculator },
    { id: 'estoque', label: 'Estoque', icon: Package },
    { id: 'insumos', label: 'Insumos', icon: Wrench },
    { id: 'produtos', label: 'Produtos', icon: ShoppingCart },
    { id: 'loja', label: 'Minha Loja', icon: Store },
    { id: 'anuncios', label: 'Anúncios', icon: Megaphone },
    { id: 'encomendas', label: 'Encomendas', icon: ListOrdered },
    { id: 'sugestoes', label: isAdmin ? 'Sugestões (Admin)' : 'Sugestões', icon: MessageSquare },
    { id: 'planos', label: 'Planos SaaS', icon: CreditCard },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
    ...(isAdmin ? [{ id: 'admin', label: 'Administração', icon: Shield }, { id: 'promocoes', label: 'Promoções', icon: CreditCard }] : [])
  ];
  const orderedTabs = [...allTabs].sort((a, b) => {
    const ia = tabPrefs.order.indexOf(a.id), ib = tabPrefs.order.indexOf(b.id);
    return (ia < 0 ? allTabs.length + allTabs.indexOf(a) : ia) - (ib < 0 ? allTabs.length + allTabs.indexOf(b) : ib);
  });
  const favoriteTabs = orderedTabs.filter(t => tabPrefs.favorites.includes(t.id));
  const toggleFavorite = id => setTabPrefs(p => ({ ...p, favorites: p.favorites.includes(id) ? p.favorites.filter(x => x !== id) : [...p.favorites, id] }));
  const moveTab = (id, direction) => setTabPrefs(p => {
    const order = [...orderedTabs.map(t => t.id)]; const index = order.indexOf(id); const next = index + direction;
    if (next < 0 || next >= order.length) return p;
    [order[index], order[next]] = [order[next], order[index]];
    return { ...p, order };
  });
  const isLight = configuracoes?.interface?.tema === 'light';
  const compact = configuracoes?.interface?.densidade === 'compact';
  const accentHex = configuracoes?.interface?.accentHex || ({ indigo: '#4f46e5', cyan: '#0891b2', violet: '#7c3aed', emerald: '#059669' }[configuracoes?.interface?.accent] || '#4f46e5');
  const accentClass = 'bg-indigo-600';
  const themeStyle = { '--app-accent': accentHex };

  return (
    <div className={`app-theme ${isLight ? 'theme-light' : 'theme-dark'} min-h-screen flex flex-col font-sans ${isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-900 text-slate-100'}`} style={themeStyle}>
      <header className={`${isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'} border-b p-4 sticky top-0 z-10 flex justify-between items-center`}>
        <div className="max-w-6xl mx-auto flex items-center gap-2 cursor-pointer" onClick={() => setAbaAtiva('dashboard')}>
          <Box className="w-7 h-7 text-indigo-400" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            3D Print Manager <span className="text-xs uppercase bg-indigo-600 px-2 py-0.5 rounded text-white ml-2">{userPlan}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <nav className="flex gap-1.5 overflow-x-auto">
            {orderedTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAbaAtiva(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                    abaAtiva === tab.id
                      ? `${accentClass} text-white`
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
          

          <button onClick={() => supabase.auth.signOut()} className="flex items-center space-x-1 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-lg text-sm transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {favoriteTabs.length > 0 && <div className="max-w-6xl w-full mx-auto px-4 pt-3 flex flex-wrap items-center gap-2"><span className="text-xs opacity-70">Favoritos:</span>{favoriteTabs.map(t => <button key={t.id} onClick={() => setAbaAtiva(t.id)} className={`text-xs px-3 py-1 rounded-full border ${abaAtiva===t.id ? 'border-indigo-400 bg-indigo-600 text-white' : 'border-slate-500 bg-slate-800 text-white'}`}>★ {t.label}</button>)}</div>}
      <main className={`flex-1 max-w-6xl w-full mx-auto ${compact ? 'p-3 sm:p-4' : 'p-4 sm:p-6'}`}>
        
        <DashboardTab />
        <MaquinasTab />
        <CalculadoraTab />
        <EstoqueTab />
        <InsumosTab />
        <ProdutosTab />
        <LojaTab />
        <AnunciosTab />
        <EncomendasTab />
        <SugestoesTab />
        <PlanosTab />
        <ConfiguracoesTab orderedTabs={orderedTabs} tabPrefs={tabPrefs} toggleFavorite={toggleFavorite} moveTab={moveTab} resetTabs={() => setTabPrefs({ order: [], favorites: [] })} />
        {isAdmin && <AdminTab />}
        {isAdmin && abaAtiva === 'promocoes' && <PromocoesTab />}
      </main>

      <Toast />
      <OnboardingWizard />
      {configuracoes?.assistente?.ativo && <AIAssistant />}
    </div>
  );
}
