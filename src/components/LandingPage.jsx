import React from 'react';
import { useApp } from '../context/AppContext';
import FeedbackForm from './FeedbackForm';
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
  QrCode
} from 'lucide-react';

export default function LandingPage() {
  const {
    authMode, setAuthMode, authError, setAuthError, authSuccess, setAuthSuccess,
    email, setEmail, password, setPassword, handleAuth,
    avaliacoesList, novaAvaliacao, setNovaAvaliacao, enviarAvaliacao
  } = useApp();

  return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Box className="w-7 h-7 text-indigo-500" />
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                3D Print Manager
              </span>
              <span className="text-[10px] uppercase font-bold bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                PRO
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a href="#planos" className="text-sm text-slate-400 hover:text-white transition hidden sm:inline">Planos</a>
              <a href="#avaliacoes" className="text-sm text-slate-400 hover:text-white transition hidden sm:inline">Avaliações</a>
              <a href="#sugestoes" className="text-sm text-slate-400 hover:text-white transition hidden sm:inline">Sugestões</a>
              <button 
                onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-medium transition"
              >
                Entrar
              </button>
              <button 
                onClick={() => { setAuthMode('signUp'); setAuthError(''); setAuthSuccess(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold transition shadow-lg shadow-indigo-600/30"
              >
                Criar Conta
              </button>
            </div>
          </div>
        </header>

        <section className="max-w-6xl mx-auto px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-full text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4" /> Gestão Inteligente para Print Farms
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Precifique e gerencie sua produção 3D com <span className="text-indigo-400">lucro real</span>.
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Calculadora completa para <strong>FDM e Resina (SLA)</strong>, gestão de frota de impressoras, automação de anúncios para Shopee/Mercado Livre e controle de encomendas em um só lugar.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-slate-300">
              <div>
                <span className="block text-2xl font-bold text-white">+100%</span>
                <span className="text-xs text-slate-500">Precisão nos custos</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">Shopee/ML</span>
                <span className="text-xs text-slate-500">Taxas atualizadas</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">FDM & SLA</span>
                <span className="text-xs text-slate-500">Suporte a Resina</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>
              
              <div>
                <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-950 p-1 mb-6">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                    className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${authMode === 'login' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    Entrar
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signUp'); setAuthError(''); setAuthSuccess(''); }}
                    className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${authMode === 'signUp' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    Criar Conta
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-white text-center mb-1">
                  {authMode === 'signUp' ? 'Crie sua conta grátis' : 'Entre no seu sistema'}
                </h2>
                <p className="text-slate-400 text-center text-xs mb-6">
                  {authMode === 'signUp' ? 'Você já começa com o onboarding para configurar sua operação.' : 'Acesse sua operação de impressão 3D em poucos segundos.'}
                </p>

                {authError && <div className="bg-rose-500/10 border border-rose-500/40 text-rose-400 p-3 rounded-lg text-xs mb-4 text-center">{authError}</div>}
                {authSuccess && <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 p-3 rounded-lg text-xs mb-4 text-center">{authSuccess}</div>}

                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">E-mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="seu@email.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 mt-1 transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Senha</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Mínimo de 6 caracteres"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 mt-1 transition text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-3.5 rounded-lg transition text-sm shadow-lg shadow-indigo-600/20 mt-2"
                  >
                    {authMode === 'signUp' ? 'Criar Conta Gratuita' : 'Entrar no Sistema'}
                  </button>
                </form>

                <p className="text-center text-[11px] text-slate-500 mt-5">
                  {authMode === 'signUp' ? 'Após o cadastro, você será guiado pelos 3 primeiros passos.' : 'Ainda não tem conta? Clique em “Criar Conta” acima.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- SEÇÃO DE PLANOS --- */}
        <section id="planos" className="py-16 max-w-6xl mx-auto px-4 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Planos simples e transparentes</h2>
            <p className="text-slate-400 text-sm">Escolha o plano ideal para o tamanho da sua operação.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Plano Gratuito</h3>
                <div className="text-3xl font-black text-white">R$ 0 <span className="text-xs text-slate-500 font-normal">/ mês</span></div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1 Impressora cadastrada</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Até 3 produtos no catálogo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Até 5 filamentos no estoque</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Calculadora de Custo Real (PIX/Direto)</li>
                  <li className="flex items-center gap-2 text-slate-500"><Lock className="w-4 h-4" /> Marketplaces (Shopee/ML/TikTok Bloqueados)</li>
                  <li className="flex items-center gap-2 text-slate-500"><Lock className="w-4 h-4" /> Módulo de Resina (SLA Bloqueado)</li>
                </ul>
              </div>
              <button 
                onClick={() => { setAuthMode('signUp'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg text-xs transition"
              >
                Começar Grátis
              </button>
            </div>

            <div className="bg-slate-900 border-2 border-indigo-500 p-8 rounded-2xl flex flex-col justify-between space-y-6 relative shadow-2xl shadow-indigo-500/10">
              <div className="absolute -top-3.5 right-6 bg-indigo-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Recomendado
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Plano PRO (SaaS)</h3>
                <div className="text-3xl font-black text-indigo-400">R$ 19,90 <span className="text-xs text-slate-500 font-normal">/ mês</span></div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Impressoras e Frota <strong>Ilimitadas</strong></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Produtos e Estoque <strong>Ilimitados</strong></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Calculadora Completa (Shopee, ML, TikTok)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> <strong>Módulo SLA Completo</strong> (Resina e IPA)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Gerador de Anúncios Formatados</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Simulador de mão de obra e setup</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Gestão de manutenção por horas rodadas</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Orçamentos em PDF e WhatsApp</li>
                </ul>
              </div>
              <button 
                onClick={() => { setAuthMode('signUp'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg text-xs transition shadow-lg shadow-indigo-600/30"
              >
                Assinar Plano PRO
              </button>
            </div>
          </div>
        </section>

        {/* --- SEÇÃO DE AVALIAÇÕES (LANDING PAGE - PÚBLICA) --- */}
        <section id="avaliacoes" className="py-16 bg-slate-900/50 border-y border-slate-800">
          <div className="max-w-6xl mx-auto px-4 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
                <Star className="w-7 h-7 text-yellow-400 fill-yellow-400" /> Avaliações dos Nossos Usuários
              </h2>
              <p className="text-slate-400 text-sm">
                Veja o que os criadores e donos de Print Farm estão achando da nossa plataforma.
              </p>
            </div>

            {/* Formulário para Enviar Avaliação Pública */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-2xl mx-auto space-y-4 shadow-xl">
              <h3 className="text-lg font-bold text-white text-center">Deixe sua Avaliação Pública</h3>
              <form onSubmit={enviarAvaliacao} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Seu Nome / Empresa</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ex: João da Silva (3D Print)" 
                      value={novaAvaliacao.nome} 
                      onChange={e => setNovaAvaliacao({ ...novaAvaliacao, nome: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white mt-1 focus:outline-none focus:border-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Sua Nota</label>
                    <select 
                      value={novaAvaliacao.nota} 
                      onChange={e => setNovaAvaliacao({ ...novaAvaliacao, nota: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-yellow-400 mt-1 focus:outline-none focus:border-indigo-500 font-bold"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 / 5 - Excelente)</option>
                      <option value="4">⭐⭐⭐⭐ (4 / 5 - Muito Bom)</option>
                      <option value="3">⭐⭐⭐ (3 / 5 - Bom)</option>
                      <option value="2">⭐⭐ (2 / 5 - Regular)</option>
                      <option value="1">⭐ (1 / 5 - Ruim)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Seu Comentário</label>
                  <textarea 
                    required 
                    rows={3} 
                    placeholder="Conte como o sistema te ajudou a gerenciar sua produção 3D..." 
                    value={novaAvaliacao.comentario} 
                    onChange={e => setNovaAvaliacao({ ...novaAvaliacao, comentario: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white mt-1 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-3 rounded-lg text-xs transition shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-2"
                >
                  <Star className="w-4 h-4 fill-slate-950" /> Publicar Avaliação
                </button>
              </form>
            </div>

            {/* Lista de Avaliações Públicas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {avaliacoesList.length === 0 ? (
                <div className="col-span-full text-center py-8 text-slate-500 text-sm">
                  Nenhuma avaliação publicada ainda. Seja o primeiro a avaliar!
                </div>
              ) : (
                avaliacoesList.map(item => (
                  <div key={item.id || Math.random()} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-sm">{item.nome}</span>
                        <span className="text-xs text-yellow-400 font-bold">
                          {'★'.repeat(item.nota || 5)}{'☆'.repeat(5 - (item.nota || 5))}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs italic leading-relaxed">"{item.comentario}"</p>
                    </div>
                    {item.data && (
                      <span className="text-[10px] text-slate-500 text-right block border-t border-slate-800/80 pt-2">
                        {item.data}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* --- SEÇÃO DE SUGESTÕES DA LANDING PAGE --- */}
        <section id="sugestoes" className="py-16 max-w-4xl mx-auto px-4 w-full">
          <FeedbackForm />
        </section>

        <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
          <p>© 2026 3D Print Manager. Todos os direitos reservados.</p>
        </footer>
      </div>
  );
}
