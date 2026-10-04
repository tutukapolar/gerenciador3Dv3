import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Lock,
  Plus,
  Printer,
  Trash2,
  Wrench,
  Sparkles
} from 'lucide-react';

export default function MaquinasTab() {
  const {
    abaAtiva,
    setAbaAtiva,
    userPlan,
    impressoras,
    novaImpressora,
    setNovaImpressora,
    adicionarImpressora,
    excluirImpressora,
    atualizarHorasImpressora,
    registrarManutencao,
    LIMITES_MANUTENCAO
  } = useApp();

  const [horasLocais, setHorasLocais] = useState({});

  if (abaAtiva !== 'maquinas') return null;

  const getHoras = (imp) => Number(horasLocais[imp.id] ?? imp.horas_rodadas ?? 0);

  const itensManutencao = (imp) => {
    const horas = getHoras(imp);
    const itens = [];

    if (imp.tipo === 'SLA') {
      const ultima = Number(imp.ultima_troca_fep_horas ?? 0);
      itens.push({
        key: 'fep',
        label: 'Troca de FEP',
        limite: LIMITES_MANUTENCAO.fep,
        ultima,
        vencido: horas - ultima >= LIMITES_MANUTENCAO.fep
      });
    }

    if (imp.tipo !== 'SLA') {
      const ultima = Number(imp.ultima_troca_bico_horas ?? 0);
      itens.push({
        key: 'bico',
        label: 'Troca de bico',
        limite: LIMITES_MANUTENCAO.bico,
        ultima,
        vencido: horas - ultima >= LIMITES_MANUTENCAO.bico
      });
    }

    const ultimaLubrificacao = Number(imp.ultima_lubrificacao_horas ?? 0);
    itens.push({
      key: 'lubrificacao',
      label: 'Lubrificar eixos',
      limite: LIMITES_MANUTENCAO.lubrificacao,
      ultima: ultimaLubrificacao,
      vencido: horas - ultimaLubrificacao >= LIMITES_MANUTENCAO.lubrificacao
    });

    return itens;
  };

  const pendencias = impressoras.flatMap(imp => itensManutencao(imp).filter(item => item.vencido).map(item => ({ imp, item })));

  const salvarHoras = async (imp) => {
    await atualizarHorasImpressora(imp.id, horasLocais[imp.id] ?? imp.horas_rodadas ?? 0);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={adicionarImpressora} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
        <div className="flex flex-col gap-2 border-b border-slate-700 pb-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-200">Registrar Máquina na Print Farm</h2>
            <p className="text-xs text-slate-500 mt-1">Cadastre FDM ou SLA e acompanhe o uso da frota.</p>
          </div>
          {userPlan === 'gratuito' && (
            <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-semibold">
              Plano Gratuito: {impressoras.length}/1 Impressora
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="text" placeholder="Nome/Apelido (Ex: Ender 01)" required value={novaImpressora.nome} onChange={e => setNovaImpressora({ ...novaImpressora, nome: e.target.value })} className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500" />
          <input type="text" placeholder="Modelo (Ex: Bambu Lab P1S)" value={novaImpressora.modelo} onChange={e => setNovaImpressora({ ...novaImpressora, modelo: e.target.value })} className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500" />
          <select value={novaImpressora.tipo} onChange={e => setNovaImpressora({ ...novaImpressora, tipo: e.target.value })} className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200">
            <option value="FDM">FDM (Filamento)</option>
            <option value="SLA">SLA (Resina)</option>
          </select>
        </div>
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-6 rounded-lg transition flex items-center gap-2">
          <Plus className="w-4 h-4" /> Adicionar Impressora
        </button>
      </form>

      {userPlan === 'pro' && (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-indigo-500/15 p-2 text-indigo-400"><Wrench className="h-5 w-5" /></div>
            <div>
              <h3 className="text-sm font-bold text-indigo-200">Manutenção inteligente da Print Farm</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">Atualize as horas rodadas de cada máquina. O sistema compara o uso com os ciclos de manutenção e sinaliza quando houver uma revisão pendente.</p>
            </div>
          </div>
        </div>
      )}

      {userPlan !== 'pro' && (
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-slate-700 p-2 text-slate-400"><Lock className="h-5 w-5" /></div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Controle de manutenção é PRO</h3>
              <p className="mt-1 text-xs text-slate-500">Horas rodadas, alertas de FEP/bico/lubrificação e histórico de manutenção ficam disponíveis no Plano PRO.</p>
            </div>
          </div>
          <button onClick={() => setAbaAtiva('planos')} className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500">Conhecer o PRO</button>
        </div>
      )}

      {userPlan === 'pro' && pendencias.length > 0 && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm"><AlertTriangle className="h-4 w-4" /> Manutenções pendentes</div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pendencias.map(({ imp, item }) => (
              <div key={`${imp.id}-${item.key}`} className="rounded-lg border border-rose-500/20 bg-slate-900/60 p-3 text-xs text-slate-300">
                <strong>{imp.nome}</strong> — {item.label} atingiu o intervalo de {item.limite}h.
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-200">Minhas Impressoras</h2>
            <p className="text-xs text-slate-500 mt-1">Ciclos padrão: FEP 50h, bico 200h e lubrificação 100h. Você pode ajustar esses valores depois no código.</p>
          </div>
          {userPlan === 'pro' && <Sparkles className="h-5 w-5 text-indigo-400" />}
        </div>

        {impressoras.length === 0 ? (
          <p className="text-slate-500 text-sm">Nenhuma impressora registrada.</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {impressoras.map(imp => {
              const horas = getHoras(imp);
              const itens = itensManutencao(imp);
              return (
                <div key={imp.id} className="bg-slate-900 p-5 rounded-xl border border-slate-700 space-y-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-slate-800 p-2.5 text-cyan-400"><Printer className="h-5 w-5" /></div>
                      <div>
                        <h3 className="font-bold text-slate-100">{imp.nome}</h3>
                        <p className="text-xs text-slate-400">Modelo: {imp.modelo} | Tipo: <span className="text-indigo-400 font-bold">{imp.tipo}</span></p>
                        <p className="text-xs text-emerald-400 mt-1">Status: {imp.status}</p>
                      </div>
                    </div>
                    <button onClick={() => excluirImpressora(imp.id)} className="text-rose-400 hover:text-rose-300 p-1" aria-label={`Excluir ${imp.nome}`}><Trash2 className="w-4 h-4" /></button>
                  </div>

                  {userPlan === 'pro' && (
                    <>
                      <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-indigo-400" /> Horas rodadas</label>
                          <span className="text-sm font-black text-white">{horas.toFixed(1)}h</span>
                        </div>
                        <div className="flex gap-2">
                          <input type="number" min="0" step="0.1" value={horasLocais[imp.id] ?? imp.horas_rodadas ?? 0} onChange={e => setHorasLocais(prev => ({ ...prev, [imp.id]: e.target.value }))} className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-white" />
                          <button onClick={() => salvarHoras(imp)} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500">Atualizar</button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {itens.map(item => (
                          <div key={item.key} className={`rounded-lg border p-3 ${item.vencido ? 'border-rose-500/40 bg-rose-950/20' : 'border-slate-700 bg-slate-950/40'}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-xs font-bold text-slate-200">{item.label}</p>
                                <p className="mt-1 text-[10px] text-slate-500">Última: {item.ultima.toFixed(1)}h · ciclo {item.limite}h</p>
                              </div>
                              {item.vencido ? <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" /> : <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />}
                            </div>
                            <button onClick={() => registrarManutencao(imp.id, item.key)} className="mt-3 w-full rounded-md border border-slate-700 px-2 py-1.5 text-[10px] font-bold text-slate-300 hover:bg-slate-800">Registrar manutenção agora</button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
