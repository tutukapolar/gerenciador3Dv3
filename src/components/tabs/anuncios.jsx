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

export default function AnunciosTab() {
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
    detalhesAnuncio,
    setDetalhesAnuncio,
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
     {abaAtiva === 'anuncios' && (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className="text-lg font-bold text-slate-200">Gerador de Anúncios com IA</h2>
            
            {produtoAnuncio && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleGerarAnuncioIA}
                  disabled={gerandoIA}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm transition font-medium shadow-md shadow-purple-600/30 disabled:opacity-50"
                >
                  <Wand2 className={`w-4 h-4 ${gerandoIA ? 'animate-spin' : ''}`} />
                  {gerandoIA ? 'Gerando Anúncio...' : 'Gerar Anúncio com IA'}
                </button>

                <button 
                  onClick={() => {
                    const textoParaCopiar = textoAnuncioGerado || obterTextoPadraoAnuncio();
                    navigator.clipboard.writeText(textoParaCopiar);
                    setCopiado(true);
                    setTimeout(() => setCopiado(false), 2000);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiado ? 'Copiado!' : 'Copiar Anúncio'}
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Produto</label>
              <select 
                value={produtoAnuncioId} 
                onChange={e => { setProdutoAnuncioId(e.target.value); setTextoAnuncioGerado(''); }} 
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200"
              >
                <option value="">Selecione um produto salvo...</option>
                {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Tom de Voz</label>
              <select 
                value={tomAnuncio} 
                onChange={e => setTomAnuncio(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200"
              >
                <option value="persuasivo">🔥 Persuasivo / Vendas</option>
                <option value="tecnico">📐 Técnico / Detalhado</option>
                <option value="descontraido">😊 Descontraído / Jovem</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Plataforma</label>
              <select 
                value={plataformaAnuncio} 
                onChange={e => setPlataformaAnuncio(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200"
              >
                <option value="shopee">Shopee (Foco em cupom/frete)</option>
                <option value="mercadolivre">Mercado Livre (Foco em qualidade/especificações)</option>
                <option value="instagram">Instagram / TikTok (Legenda + hashtags)</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-200">Informações extras do produto</h3>
              <p className="text-xs text-slate-400 mt-1">
                Todos os campos são opcionais. Quanto mais dados reais você informar, melhor será a copy gerada pela IA.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                ['material', 'Material', 'Ex.: PLA'],
                ['cor', 'Cor', 'Ex.: Amarelo'],
                ['acabamento', 'Acabamento', 'Ex.: Acabamento padrão'],
                ['alturaCm', 'Altura', 'Ex.: 8 cm'],
                ['larguraCm', 'Largura', 'Ex.: 5 cm'],
                ['profundidadeCm', 'Profundidade', 'Ex.: 4 cm'],
                ['publicoAlvo', 'Público-alvo', 'Ex.: Colecionadores'],
                ['uso', 'Uso', 'Ex.: Coleção e decoração'],
                ['prazoEnvio', 'Prazo de envio', 'Ex.: Até 3 dias úteis']
              ].map(([key, label, placeholder]) => (
                <div key={key}>
                  <label className="text-xs text-slate-400 block mb-1">{label}</label>
                  <input
                    value={detalhesAnuncio?.[key] || ''}
                    onChange={e => setDetalhesAnuncio(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200 placeholder:text-slate-500"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Diferencial do produto</label>
              <textarea
                rows={3}
                value={detalhesAnuncio?.diferencial || ''}
                onChange={e => setDetalhesAnuncio(prev => ({ ...prev, diferencial: e.target.value }))}
                placeholder="Ex.: Peça compacta, feita sob encomenda e pensada para colecionadores."
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200 placeholder:text-slate-500"
              />
            </div>
          </div>
          
          {produtoAnuncio && (
            <textarea 
              rows={14} 
              onChange={e => setTextoAnuncioGerado(e.target.value)}
              value={textoAnuncioGerado || obterTextoPadraoAnuncio()} 
              className="w-full bg-slate-900 border border-slate-700 rounded p-4 text-sm text-slate-300 font-mono focus:border-indigo-500 focus:outline-none" 
            />
          )}
        </div>
      )}

    </>
  );
}
