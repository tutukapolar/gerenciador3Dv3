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

export default function ProdutosTab() {
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
        {abaAtiva === 'produtos' && (
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-200">Catálogo de Produtos ({produtos.length} salvos)</h2>
              {userPlan === 'gratuito' && (
                <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-semibold">
                  Plano Gratuito: {produtos.length}/3 Produtos
                </span>
              )}
            </div>
            {produtos.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">
                Nenhum produto cadastrado.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {produtos.map(p => (
                  <div key={p.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-bold text-slate-100">{p.nome}</h3>
                      <p className="text-xs text-slate-400">Custo: R$ {p.custo_total}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                      <span className="text-emerald-400 font-bold text-base">R$ {p.preco_sugerido}</span>
                      <button
                        type="button"
                        onClick={() => excluirProduto(p.id)}
                        className="text-rose-400"
                        aria-label={`Excluir ${p.nome}`}
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

    </>
  );
}
