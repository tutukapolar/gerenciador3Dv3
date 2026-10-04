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

export default function PlanosTab() {
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
        {abaAtiva === 'planos' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-extrabold text-white">Upgrade de Assinatura SaaS</h2>
              <p className="text-slate-400 text-sm">Escalabilidade total e recursos sem limites para sua Print Farm.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card das Vantagens PRO */}
              <div className="bg-slate-800 p-6 rounded-2xl border border-indigo-500/40 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h3 className="text-xl font-bold text-white">Plano PRO Completo</h3>
                    <span className="bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                      Upgrade Imediato
                    </span>
                  </div>

                  <div className="text-3xl font-black text-indigo-400">
                    R$ {VALOR_PRO.toFixed(2).replace('.', ',')} <span className="text-xs text-slate-500 font-normal">/ mês</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Frota de Impressoras Ilimitada</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Produtos e Estoque Ilimitados</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Módulo SLA (Resina e Pós-processamento)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Precificação Shopee, Mercado Livre e TikTok</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Gerador Inteligente de Anúncios com IA</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Simulador de mão de obra e setup</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Manutenção por horas rodadas com alertas</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Orçamento profissional em PDF e WhatsApp</li>
                  </ul>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 text-xs text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-200">Como funciona o ativamento?</p>
                  <p>Após realizar a transferência PIX, envie o comprovante clicando no botão do WhatsApp ao lado para liberarmos seu acesso PRO na hora.</p>
                </div>
              </div>

              {/* PASSO 1: CARD DE PAGAMENTO PIX ESTÁTICO DENTRO DO APP */}
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-5 text-center flex flex-col items-center justify-between">
                <div className="space-y-1 w-full">
                  <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                    <QrCode className="w-5 h-5 text-emerald-400" /> Pagamento via PIX (Sem Taxas)
                  </h3>
                  <p className="text-xs text-slate-400">Escaneie o QR Code abaixo com seu aplicativo do banco</p>
                </div>

                <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200 inline-block">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code PIX para Assinatura PRO" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>

                <div className="w-full space-y-3">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between text-xs">
                    <span className="text-slate-400 truncate max-w-[200px] text-left">{payloadPix}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(payloadPix);
                        setCopiadoPix(true);
                        setTimeout(() => setCopiadoPix(false), 2000);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded text-[11px] flex items-center gap-1 shrink-0 transition"
                    >
                      {copiadoPix ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiadoPix ? 'Copiado!' : 'Copiar PIX'}
                    </button>
                  </div>

                  <a
                    href={`https://wa.me/${SEU_NUMERO_WHATSAPP}?text=${encodeURIComponent(`Olá! Realizei o pagamento do Plano PRO do 3D Print Manager no valor de R$ ${VALOR_PRO.toFixed(2)} para o e-mail:${session?.user?.email}. Segue o comprovante em anexo:`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <Phone className="w-4 h-4" /> Enviar Comprovante no WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

    </>
  );
}
