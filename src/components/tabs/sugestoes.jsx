import React from 'react';
import { useApp } from '../../context/AppContext';
import FeedbackForm from '../FeedbackForm';
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

export default function SugestoesTab() {
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
        {abaAtiva === 'sugestoes' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <FeedbackForm />

            {/* PAINEL EXCLUSIVO DO ADMIN PARA VER AS SUGESTÕES RECEBIDAS */}
            {isAdmin ? (
              <div className="bg-slate-800 p-6 rounded-xl border border-indigo-500/50 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-white">Painel de Sugestões Recebidas (Exclusivo Admin)</h3>
                  </div>
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-bold">
                    {feedbacksAdminList.length} mensagens
                  </span>
                </div>

                {feedbacksAdminList.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    Nenhuma sugestão ou feedback recebido ainda.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {feedbacksAdminList.map(item => (
                      <div key={item.id} className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-indigo-400 uppercase tracking-wider">
                            [{item.tipo || 'Sugestão'}]
                          </span>
                          <span className="text-slate-500">
                            De: {item.email || 'Anônimo'}
                          </span>
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed">{item.mensagem}</p>
                        {item.created_at && (
                          <span className="text-[10px] text-slate-500 block text-right">
                            {new Date(item.created_at).toLocaleString('pt-BR')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center text-xs text-slate-400">
                🔒 O histórico de feedbacks enviados é privado e acessível apenas pelos administradores da plataforma.
              </div>
            )}
          </div>
        )}

    </>
  );
}
