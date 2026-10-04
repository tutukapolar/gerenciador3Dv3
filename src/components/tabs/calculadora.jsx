import React from 'react';
import { useApp } from '../../context/AppContext';
import { abrirOrcamentoParaImpressao, abrirWhatsAppOrcamento } from '../../utils/orcamento';
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

export default function CalculadoraTab() {
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
    supabase,
    showToast
  } = useApp();

  return (
    <>
        {abaAtiva === 'calculadora' && (
          <div className="space-y-6">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setTipoTecnologia('FDM')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${tipoTecnologia === 'FDM' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}>
                  Modo FDM (Filamento)
                </button>
                <button type="button" onClick={() => { if (userPlan === 'gratuito') { showToast('O Módulo de Resina (SLA) é exclusivo do Plano PRO.', 'warning'); setAbaAtiva('planos'); } else { setTipoTecnologia('Resina'); } }} className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1.5 ${tipoTecnologia === 'Resina' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}>
                  <Droplet className="w-4 h-4 text-cyan-400" /> Modo Resina (SLA) {userPlan === 'gratuito' && '🔒'}
                </button>
              </div>
              <div className="flex-1 flex gap-2 w-full sm:w-auto">
                <input type="url" placeholder="Link MakerWorld / Printables (.3mf)" value={linkMakerworld} onChange={e => setLinkMakerworld(e.target.value)} className="w-full sm:w-64 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500" />
                <button onClick={importarDadosLink} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap">
                  Scraping Link
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <form onSubmit={calcularPreco} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
                <h2 className="text-lg font-bold text-slate-200 border-b border-slate-700 pb-2">
                  Parâmetros de Impressão ({tipoTecnologia})
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Nome do Item / Modelo</label>
                    <input type="text" required placeholder="Ex: Miniatura RPG ou Peça Técnica" value={calcData.nomeItem} onChange={e => setCalcData({...calcData, nomeItem: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">WhatsApp do cliente <span className="text-slate-600">(opcional, PRO)</span></label>
                    <input type="tel" placeholder="Ex: 5512999999999" value={calcData.telefoneCliente} onChange={e => setCalcData({...calcData, telefoneCliente: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:border-indigo-500 focus:outline-none" />
                  </div>
                </div>

                {tipoTecnologia === 'FDM' ? (
                  <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <label className="text-xs font-bold text-indigo-400">Filamentos do Projeto</label>
                    {filamentosProjeto.map((fp, index) => (
                      <div key={fp.idTemp} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-8">
                          <select value={fp.filamentoId} onChange={e => { const updated = [...filamentosProjeto]; updated[index].filamentoId = e.target.value; setFilamentosProjeto(updated); }} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-200">
                            <option value="">Selecione o Filamento...</option>
                            {filamentos.map(f => <option key={f.id} value={f.id}>{f.nome} ({f.tipo} - {f.cor})</option>)}
                          </select>
                        </div>
                        <div className="col-span-4">
                          <input type="number" placeholder="Peso (g)" value={fp.pesoGramas} onChange={e => { const updated = [...filamentosProjeto]; updated[index].pesoGramas = e.target.value; setFilamentosProjeto(updated); }} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-cyan-500/30">
                    <label className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                      <Droplet className="w-4 h-4" /> Variáveis de Resina & Pós-Processamento
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-slate-400">Volume (ml)</label>
                        <input type="number" placeholder="Ex: 35" value={resinaProjeto.volumeMl} onChange={e => setResinaProjeto({...resinaProjeto, volumeMl: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Preço Resina (R$/L)</label>
                        <input type="number" value={resinaProjeto.precoLitro} onChange={e => setResinaProjeto({...resinaProjeto, precoLitro: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-slate-400">Cura UV (min)</label>
                        <input type="number" value={resinaProjeto.tempoUvMin} onChange={e => setResinaProjeto({...resinaProjeto, tempoUvMin: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Desgaste FEP/h</label>
                        <input type="number" step="0.05" value={resinaProjeto.desgasteFepHora} onChange={e => setResinaProjeto({...resinaProjeto, desgasteFepHora: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Perda IPA (ml)</label>
                        <input type="number" value={resinaProjeto.volumeIpaMl} onChange={e => setResinaProjeto({...resinaProjeto, volumeIpaMl: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Quantidade de Peças</label>
                    <input type="number" min="1" value={calcData.quantidadePecas} onChange={e => setCalcData({...calcData, quantidadePecas: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Tempo Unitário (Horas)</label>
                    <input type="number" step="0.1" value={calcData.tempoHoras} onChange={e => setCalcData({...calcData, tempoHoras: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Energia (R$/kWh)</label>
                    <input type="number" step="0.01" value={calcData.custoEnergiaKwh} onChange={e => setCalcData({...calcData, custoEnergiaKwh: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Potência (W)</label>
                    <input type="number" value={calcData.potenciaImpressoraW} onChange={e => setCalcData({...calcData, potenciaImpressoraW: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Custo Embalagem (R$)</label>
                    <input type="number" step="0.01" value={calcData.custoEmbalagem} onChange={e => setCalcData({...calcData, custoEmbalagem: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Margem de Erro (%)</label>
                    <input type="number" value={calcData.margemErroPct} onChange={e => setCalcData({...calcData, margemErroPct: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{userPlan === 'pro' ? 'Valor da Hora de Mão de Obra (R$)' : 'Mão de Obra (R$)'}</label>
                    <input type="number" step="0.01" value={userPlan === 'pro' ? calcData.valorHoraMaoDeObra : calcData.custoMaoDeObra} onChange={e => setCalcData({...calcData, ...(userPlan === 'pro' ? { valorHoraMaoDeObra: e.target.value } : { custoMaoDeObra: e.target.value })})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Margem de Lucro (%)</label>
                    <input type="number" value={calcData.lucroDesejadoPct} onChange={e => setCalcData({...calcData, lucroDesejadoPct: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm" />
                  </div>
                </div>

                {userPlan === 'pro' ? (
                  <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-indigo-300">Simulador de mão de obra e setup</p>
                        <p className="text-[11px] text-slate-500">O tempo é convertido automaticamente em custo usando o valor/hora acima.</p>
                      </div>
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      <div><label className="text-[10px] text-slate-400">Setup / fita (min)</label><input type="number" min="0" value={calcData.tempoSetupMin} onChange={e => setCalcData({...calcData, tempoSetupMin: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs" /></div>
                      <div><label className="text-[10px] text-slate-400">Pré-aquecimento (min)</label><input type="number" min="0" value={calcData.tempoPreAquecimentoMin} onChange={e => setCalcData({...calcData, tempoPreAquecimentoMin: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs" /></div>
                      <div><label className="text-[10px] text-slate-400">Fatiamento (min)</label><input type="number" min="0" value={calcData.tempoFatiamentoMin} onChange={e => setCalcData({...calcData, tempoFatiamentoMin: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs" /></div>
                      <div><label className="text-[10px] text-slate-400">Suportes (min/peça)</label><input type="number" min="0" value={calcData.tempoRemocaoSuportesMin} onChange={e => setCalcData({...calcData, tempoRemocaoSuportesMin: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs" /></div>
                      <div><label className="text-[10px] text-slate-400">Lixamento (min/peça)</label><input type="number" min="0" value={calcData.tempoLixamentoMin} onChange={e => setCalcData({...calcData, tempoLixamentoMin: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs" /></div>
                      <div><label className="text-[10px] text-slate-400">Lavagem UV (min/peça)</label><input type="number" min="0" value={calcData.tempoLavagemUvMin} onChange={e => setCalcData({...calcData, tempoLavagemUvMin: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs" /></div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 flex items-center justify-between gap-4">
                    <div><p className="text-xs font-bold text-slate-300">Simulador de setup e pós-processamento</p><p className="text-[11px] text-slate-500 mt-1">Disponível no Plano PRO para calcular automaticamente o tempo de mão de obra.</p></div>
                    <button type="button" onClick={() => setAbaAtiva('planos')} className="shrink-0 rounded-lg bg-indigo-600 px-3 py-2 text-[11px] font-bold text-white hover:bg-indigo-500">Ver PRO</button>
                  </div>
                )}

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition">
                  Calcular Precificação
                </button>
              </form>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-between space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-200 border-b border-slate-700 pb-2 mb-4">Resumo e Precificação</h2>
                  {resultadoCalculo ? (
                    <div className="space-y-4">
                      <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-xs space-y-2">
                        <p className="font-bold text-slate-300 text-sm">Tecnologia: {resultadoCalculo.tipoTecnologia}</p>
                        <div className="flex justify-between"><span>Custo Total de Produção:</span><span className="text-indigo-400 font-bold">R$ {resultadoCalculo.custoTotalBase}</span></div>
                      </div>
                      
                      <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-lg flex justify-between items-center">
                        <span className="text-emerald-300 font-bold">Custo Real (Venda Direta / PIX):</span>
                        <span className="text-2xl font-extrabold text-emerald-400">R$ {resultadoCalculo.precoVendaDireta}</span>
                      </div>
                      
                      {userPlan === 'gratuito' ? (
                        <div className="bg-slate-900 border border-slate-700/60 p-4 rounded-xl text-center space-y-2 mt-4 relative overflow-hidden">
                          <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                            <Lock className="w-4 h-4" /> Marketplaces Bloqueados
                          </div>
                          <p className="text-xs text-slate-400">
                            Cálculo de taxas e preços para <strong>Shopee, Mercado Livre e TikTok Shop</strong> disponíveis apenas no <strong>Plano PRO</strong>.
                          </p>
                          <button
                            type="button"
                            onClick={() => setAbaAtiva('planos')}
                            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition mt-1 shadow-md shadow-indigo-600/20"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Desbloquear Canais no Plano PRO
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                          <div className="bg-slate-900 border border-orange-500/30 p-3 rounded-lg text-center">
                            <span className="block text-xs text-orange-400 mb-1">Shopee (14% + R$4)</span>
                            <span className="text-lg font-bold text-slate-200">R$ {resultadoCalculo.shopee.precoAnuncio}</span>
                            <span className="block text-[10px] text-slate-400 mt-1">Lucro: R$ {resultadoCalculo.shopee.lucroLiquido}</span>
                          </div>
                          <div className="bg-slate-900 border border-yellow-500/30 p-3 rounded-lg text-center">
                            <span className="block text-xs text-yellow-400 mb-1">Mercado Livre (16.5% + R$6)</span>
                            <span className="text-lg font-bold text-slate-200">R$ {resultadoCalculo.mercadoLivre.precoAnuncio}</span>
                            <span className="block text-[10px] text-slate-400 mt-1">Lucro: R$ {resultadoCalculo.mercadoLivre.lucroLiquido}</span>
                          </div>
                          <div className="bg-slate-900 border border-pink-500/30 p-3 rounded-lg text-center">
                            <span className="block text-xs text-pink-400 mb-1">TikTok Shop (12% + R$3)</span>
                            <span className="text-lg font-bold text-slate-200">R$ {resultadoCalculo.tikTok.precoAnuncio}</span>
                            <span className="block text-[10px] text-slate-400 mt-1">Lucro: R$ {resultadoCalculo.tikTok.lucroLiquido}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm text-center py-16">Preencha os parâmetros e clique em calcular.</p>
                  )}
                </div>

                {resultadoCalculo && (
                  <div className="space-y-3">
                    <button onClick={salvarComoProduto} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition">
                      Salvar Produto no Catálogo
                    </button>

                    {userPlan === 'pro' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const ok = abrirOrcamentoParaImpressao({ calcData, resultadoCalculo, email: session?.user?.email });
                            if (!ok) showToast('O navegador bloqueou a janela do orçamento. Permita pop-ups para gerar o PDF.', 'warning');
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-2.5 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20"
                        >
                          <ExternalLink className="w-4 h-4" /> Gerar orçamento PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const ok = abrirWhatsAppOrcamento({ telefone: calcData.telefoneCliente, calcData, resultadoCalculo });
                            if (!ok) showToast('Informe o WhatsApp do cliente no topo da calculadora antes de enviar.', 'warning');
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20"
                        >
                          <Phone className="w-4 h-4" /> Enviar por WhatsApp
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-center">
                        <p className="text-xs text-slate-400">Orçamento profissional em PDF e envio formatado por WhatsApp são recursos do Plano PRO.</p>
                        <button type="button" onClick={() => setAbaAtiva('planos')} className="mt-2 text-xs font-bold text-indigo-400 hover:text-indigo-300">Desbloquear PRO</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

    </>
  );
}
