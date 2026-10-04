import React from 'react';
import { useApp } from '../../context/AppContext';
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

export default function DashboardTab() {
  const {
    session,
    setSession,
    loading,
    setLoading,
    abaAtiva,
    setAbaAtiva,
    userPlan,
    setUserPlan,
    authMode,
    setAuthMode,
    email,
    setEmail,
    password,
    setPassword,
    authError,
    setAuthError,
    authSuccess,
    setAuthSuccess,
    avaliacoesList,
    setAvaliacoesList,
    novaAvaliacao,
    setNovaAvaliacao,
    formFeedback,
    setFormFeedback,
    feedbackSucesso,
    setFeedbackSucesso,
    feedbacksAdminList,
    setFeedbacksAdminList,
    impressoras,
    setImpressoras,
    novaImpressora,
    setNovaImpressora,
    filamentos,
    setFilamentos,
    novoFilamento,
    setNovoFilamento,
    estoqueFeedback,
    setEstoqueFeedback,
    filamentoExcluindoId,
    setFilamentoExcluindoId,
    tipoTecnologia,
    setTipoTecnologia,
    linkMakerworld,
    setLinkMakerworld,
    filamentosProjeto,
    setFilamentosProjeto,
    resinaProjeto,
    setResinaProjeto,
    calcData,
    setCalcData,
    resultadoCalculo,
    setResultadoCalculo,
    produtos,
    setProdutos,
    encomendas,
    setEncomendas,
    novaEncomenda,
    setNovaEncomenda,
    produtoAnuncioId,
    setProdutoAnuncioId,
    copiado,
    setCopiado,
    copiadoPix,
    setCopiadoPix,
    gerandoIA,
    setGerandoIA,
    textoAnuncioGerado,
    setTextoAnuncioGerado,
    tomAnuncio,
    setTomAnuncio,
    plataformaAnuncio,
    setPlataformaAnuncio,
    carregarAvaliacoes,
    carregarFeedbacksAdmin,
    carregarDados,
    handleAuth,
    enviarAvaliacao,
    enviarFeedback,
    importarDadosLink,
    adicionarImpressora,
    excluirImpressora,
    corMaterialSwatch,
    adicionarFilamento,
    excluirFilamento,
    calcularPreco,
    salvarComoProduto,
    excluirProduto,
    adicionarEncomenda,
    atualizarStatusEncomenda,
    excluirEncomenda,
    handleGerarAnuncioIA,
    obterTextoPadraoAnuncio,
    CHAVE_PIX,
    NOME_RECEBEDOR,
    CIDADE_RECEBEDOR,
    VALOR_PRO,
    SEU_NUMERO_WHATSAPP,
    payloadPix,
    qrCodeUrl,
    faturamentoTotal,
    produtoAnuncio,
    isAdmin,
    supabase
  } = useApp();

  return (
    <>
        {abaAtiva === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Faturamento Total
                </span>
                <p className="text-2xl font-extrabold text-emerald-400 mt-1">R$ {faturamentoTotal.toFixed(2)}</p>
              </div>
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Printer className="w-4 h-4 text-cyan-400" /> Impressoras na Fazenda
                </span>
                <p className="text-2xl font-extrabold text-cyan-400 mt-1">{impressoras.length} Máquinas {userPlan === 'gratuito' && '(Limite 1)'}</p>
              </div>
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400 block">Assinatura Atual</span>
                  <p className="text-xl font-bold text-indigo-400 mt-1 capitalize">Plano {userPlan}</p>
                </div>
                {userPlan === 'gratuito' && (
                  <button onClick={() => setAbaAtiva('planos')} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-2 rounded-lg font-bold">
                    Fazer Upgrade Pro
                  </button>
                )}
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" /> Status da Print Farm
              </h2>
              {impressoras.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhuma impressora registrada. Vá à aba "Máquinas" para adicionar sua frota.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {impressoras.map(imp => {
                    const isOcupada = imp.status === 'ocupada';
                    return (
                      <div key={imp.id} className={`p-4 rounded-xl border ${isOcupada ? 'bg-amber-950/20 border-amber-500/40' : 'bg-emerald-950/20 border-emerald-500/40'} flex flex-col justify-between space-y-2`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-slate-100">{imp.nome}</h3>
                            <p className="text-xs text-slate-400">{imp.modelo} ({imp.tipo})</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded font-bold ${isOcupada ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {isOcupada ? 'Imprimindo' : 'Livre'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

    </>
  );
}
