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

export default function EncomendasTab() {
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
        {abaAtiva === 'encomendas' && (
          <div className="space-y-6">
            <form onSubmit={adicionarEncomenda} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
              <h2 className="text-lg font-bold text-slate-200 border-b border-slate-700 pb-2">Registrar Nova Encomenda</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Nome do Cliente *" required value={novaEncomenda.cliente} onChange={e => setNovaEncomenda({...novaEncomenda, cliente: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-2.5 text-sm" />
                <input type="text" placeholder="Telefone / Contato" value={novaEncomenda.contato} onChange={e => setNovaEncomenda({...novaEncomenda, contato: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-2.5 text-sm" />
              </div>

              <input type="text" placeholder="Endereço Completo de Entrega" value={novaEncomenda.endereco} onChange={e => setNovaEncomenda({...novaEncomenda, endereco: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select value={novaEncomenda.produtoId} onChange={e => { const prod = produtos.find(p => p.id.toString() === e.target.value); if (prod) { setNovaEncomenda({...novaEncomenda, produtoId: prod.id, produtoNome: prod.nome, valorProduto: prod.preco_sugerido}); } else { setNovaEncomenda({...novaEncomenda, produtoId: '', produtoNome: '', valorProduto: ''}); } }} className="bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200">
                  <option value="">Produto Avulso (Digitar Manualmente)...</option>
                  {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
                <input type="text" placeholder="Nome do Produto / Peça *" required value={novaEncomenda.produtoNome} onChange={e => setNovaEncomenda({...novaEncomenda, produtoNome: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-2.5 text-sm" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <input type="number" min="1" placeholder="Qtd" value={novaEncomenda.quantidade} onChange={e => setNovaEncomenda({...novaEncomenda, quantidade: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-2.5 text-sm" />
                <input type="number" step="0.01" placeholder="Valor Unitário (R$)" required value={novaEncomenda.valorProduto} onChange={e => setNovaEncomenda({...novaEncomenda, valorProduto: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-2.5 text-sm" />
                <input type="number" step="0.01" placeholder="Taxa Entrega (R$)" value={novaEncomenda.taxaEntrega} onChange={e => setNovaEncomenda({...novaEncomenda, taxaEntrega: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-2.5 text-sm" />
                
                <select value={novaEncomenda.status} onChange={e => setNovaEncomenda({...novaEncomenda, status: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200">
                  <option value="Pendente">Pendente</option>
                  <option value="Imprimindo">Imprimindo</option>
                  <option value="Concluído">Concluído</option>
                </select>

                <select value={novaEncomenda.impressoraId} onChange={e => setNovaEncomenda({...novaEncomenda, impressoraId: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200">
                  <option value="">Alocar Máquina...</option>
                  {impressoras.filter(i => i.status === 'livre').map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
                </select>
              </div>

              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-6 rounded-lg transition w-full">
                Salvar Encomenda
              </button>
            </form>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h2 className="text-lg font-bold text-slate-200 mb-4">Lista de Encomendas</h2>
              <div className="space-y-3">
                {encomendas.length === 0 ? (
                  <p className="text-slate-500 text-sm">Nenhuma encomenda registrada.</p>
                ) : (
                  encomendas.map(enc => {
                    const impressoraVinculada = impressoras.find(i => i.id === parseInt(enc.impressora_id));
                    return (
                      <div key={enc.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h3 className="font-bold text-slate-200">{enc.produto_nome} - Cliente: {enc.cliente}</h3>
                          <p className="text-xs text-slate-400 mt-1">
                            Qtd: {enc.quantidade} | Total: R$ {parseFloat(enc.valor_total || 0).toFixed(2)}
                            {impressoraVinculada && (
                              <span className="ml-2 text-indigo-400 font-semibold">| Máquina: {impressoraVinculada.nome}</span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <select 
                            value={enc.status} 
                            onChange={(e) => atualizarStatusEncomenda(enc.id, e.target.value, enc.impressora_id)}
                            className="bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                          >
                            <option value="Pendente">Pendente</option>
                            <option value="Imprimindo">Imprimindo</option>
                            <option value="Concluído">Concluído</option>
                          </select>

                          <button onClick={() => excluirEncomenda(enc.id, enc.impressora_id)} className="text-rose-400 hover:text-rose-300 p-1">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

    </>
  );
}
