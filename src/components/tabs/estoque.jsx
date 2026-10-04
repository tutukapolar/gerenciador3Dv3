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

export default function EstoqueTab() {
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
        {abaAtiva === 'estoque' && (() => {
          const limiteGratuito = userPlan === 'gratuito';
          const noLimite = limiteGratuito && filamentos.length >= 5;
          const campoEstoque = 'w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/70';
          return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Estoque de materiais</h2>
                <p className="text-sm text-slate-400 mt-1">Cadastre filamentos e resinas com preço, cor e peso restante — os mesmos dados usados na calculadora.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full">
                  {filamentos.length} {filamentos.length === 1 ? 'material' : 'materiais'}
                </span>
                {limiteGratuito && (
                  <span className={`text-xs border px-2.5 py-1 rounded-full font-semibold ${noLimite ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                    Plano Gratuito: {filamentos.length}/5
                  </span>
                )}
              </div>
            </div>

            <form onSubmit={adicionarFilamento} className="bg-slate-800 p-5 sm:p-6 rounded-xl border border-slate-700 space-y-4" aria-labelledby="estoque-form-titulo">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-slate-700 pb-3">
                <div>
                  <h3 id="estoque-form-titulo" className="text-lg font-bold text-slate-200">Novo material</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Nome e preço por kg são obrigatórios.</p>
                </div>
              </div>

              {estoqueFeedback.texto && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`text-sm rounded-lg px-3 py-2.5 border ${
                    estoqueFeedback.tipo === 'ok'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {estoqueFeedback.texto}
                </div>
              )}

              {noLimite && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-3">
                  <p className="text-sm text-amber-200">Você atingiu o limite de 5 materiais do plano gratuito.</p>
                  <button type="button" onClick={() => setAbaAtiva('planos')} className="self-start sm:self-auto bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
                    Ver Plano Pro
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="estoque-nome" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Nome *</label>
                  <input id="estoque-nome" type="text" autoComplete="off" placeholder="Ex: PLA Preto Fosco" required value={novoFilamento.nome} onChange={e => setNovoFilamento({...novoFilamento, nome: e.target.value})} className={campoEstoque} />
                </div>
                <div>
                  <label htmlFor="estoque-marca" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Marca</label>
                  <input id="estoque-marca" type="text" autoComplete="off" placeholder="Ex: eSUN" value={novoFilamento.marca} onChange={e => setNovoFilamento({...novoFilamento, marca: e.target.value})} className={campoEstoque} />
                </div>
                <div>
                  <label htmlFor="estoque-cor" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Cor</label>
                  <input id="estoque-cor" type="text" autoComplete="off" placeholder="Ex: Preto" value={novoFilamento.cor} onChange={e => setNovoFilamento({...novoFilamento, cor: e.target.value})} className={campoEstoque} />
                </div>
                <div>
                  <label htmlFor="estoque-tipo" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Tipo</label>
                  <select id="estoque-tipo" value={novoFilamento.tipo} onChange={e => setNovoFilamento({...novoFilamento, tipo: e.target.value})} className={campoEstoque}>
                    <option value="PLA">PLA</option>
                    <option value="PETG">PETG</option>
                    <option value="ABS">ABS</option>
                    <option value="ASA">ASA</option>
                    <option value="TPU">TPU</option>
                    <option value="Resina">Resina (SLA)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="estoque-preco" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Preço / kg (R$) *</label>
                  <input id="estoque-preco" type="number" inputMode="decimal" min="0" step="0.01" placeholder="120.00" required value={novoFilamento.precoKg} onChange={e => setNovoFilamento({...novoFilamento, precoKg: e.target.value})} className={campoEstoque} />
                </div>
                <div>
                  <label htmlFor="estoque-peso" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Peso disponível (g)</label>
                  <input id="estoque-peso" type="number" inputMode="numeric" min="1" step="1" placeholder="1000" value={novoFilamento.pesoTotalG} onChange={e => setNovoFilamento({...novoFilamento, pesoTotalG: e.target.value})} className={campoEstoque} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={noLimite}
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-6 rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" /> Adicionar ao estoque
                </button>
                <p className="text-xs text-slate-500">O material fica disponível imediatamente na calculadora de precificação.</p>
              </div>
            </form>

            <div className="bg-slate-800 p-5 sm:p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-bold text-slate-200 mb-4">Materiais cadastrados</h3>
              {filamentos.length === 0 ? (
                <div className="flex flex-col items-center text-center py-12 px-4 rounded-xl border border-dashed border-slate-600 bg-slate-900/40">
                  <Package className="w-10 h-10 text-slate-500 mb-3" aria-hidden="true" />
                  <p className="text-slate-200 font-semibold">Nenhum material no estoque</p>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm">Cadastre o primeiro filamento ou resina acima para calcular custos reais na aba Calculadora.</p>
                </div>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filamentos.map(f => {
                    const peso = Number(f.peso_atual_g ?? 1000);
                    const bobinaRef = 1000;
                    const percentual = Math.max(0, Math.min(100, (peso / bobinaRef) * 100));
                    const estoqueBaixo = peso > 0 && peso < 200;
                    const esgotado = peso <= 0;
                    const confirmando = filamentoExcluindoId === f.id;
                    return (
                      <li key={f.id} className={`bg-slate-900 p-4 rounded-xl border flex flex-col gap-3 ${estoqueBaixo || esgotado ? 'border-amber-500/40' : 'border-slate-700'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <span
                              className="mt-0.5 w-8 h-8 rounded-full border border-white/10 shrink-0 shadow-inner"
                              style={{ backgroundColor: corMaterialSwatch(f.cor) }}
                              aria-hidden="true"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-100 truncate">{f.nome}</h4>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {f.marca || 'Marca genérica'} · {f.cor || 'Cor padrão'}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 shrink-0">
                            {f.tipo || 'PLA'}
                          </span>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                            <span>{esgotado ? 'Esgotado' : estoqueBaixo ? 'Estoque baixo' : 'Disponível'}</span>
                            <span className={`font-bold ${esgotado ? 'text-rose-400' : estoqueBaixo ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {peso}g
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={bobinaRef} aria-valuenow={peso} aria-label={`Peso restante de ${f.nome}`}>
                            <div
                              className={`h-full rounded-full ${esgotado ? 'bg-rose-500' : estoqueBaixo ? 'bg-amber-400' : 'bg-emerald-500'}`}
                              style={{ width: `${percentual}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                          <p className="text-sm text-slate-300">
                            <span className="text-slate-500 text-xs">Preço</span>{' '}
                            <span className="font-semibold">R$ {Number(f.preco_kg || 0).toFixed(2)}</span>
                            <span className="text-xs text-slate-500">/kg</span>
                          </p>
                          {confirmando ? (
                            <div className="flex items-center gap-2" role="group" aria-label={`Confirmar exclusão de ${f.nome}`}>
                              <button
                                type="button"
                                onClick={() => excluirFilamento(f.id)}
                                className="text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1.5 rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                              >
                                Excluir
                              </button>
                              <button
                                type="button"
                                onClick={() => setFilamentoExcluindoId(null)}
                                className="text-xs font-medium text-slate-300 hover:text-white px-2 py-1.5 rounded-lg hover:bg-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => { setFilamentoExcluindoId(f.id); setEstoqueFeedback({ tipo: '', texto: '' }); }}
                              className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-2 rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                              aria-label={`Remover ${f.nome} do estoque`}
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
          );
        })()}

    </>
  );
}
