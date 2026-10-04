import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  CheckCircle2,
  Calculator,
  Layers,
  Printer,
  Sparkles,
  X
} from 'lucide-react';

export default function OnboardingWizard() {
  const {
    onboardingOpen,
    concluirOnboarding,
    adiarOnboarding,
    novaImpressora,
    setNovaImpressora,
    adicionarImpressora,
    novoFilamento,
    setNovoFilamento,
    adicionarFilamento,
    filamentos,
    impressoras,
    calcData,
    setCalcData,
    filamentosProjeto,
    setFilamentosProjeto,
    calcularPreco,
    resultadoCalculo,
    setAbaAtiva
  } = useApp();

  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!onboardingOpen) return;
    if (impressoras.length === 0) setStep(0);
    else if (filamentos.length === 0) setStep(1);
    else if (!resultadoCalculo) setStep(2);
  }, [onboardingOpen]);

  const steps = useMemo(() => [
    { title: 'Cadastre sua primeira impressora', icon: Printer },
    { title: 'Cadastre seu primeiro filamento', icon: Layers },
    { title: 'Faça sua primeira estimativa', icon: Calculator }
  ], []);

  if (!onboardingOpen) return null;

  const avancarImpressora = async (e) => {
    e.preventDefault();
    setBusy(true);
    const ok = await adicionarImpressora(e);
    setBusy(false);
    if (ok) setStep(1);
  };

  const avancarFilamento = async (e) => {
    e.preventDefault();
    setBusy(true);
    const materialCriado = await adicionarFilamento(e);
    setBusy(false);
    if (materialCriado) {
      setFilamentosProjeto([{ idTemp: Date.now(), filamentoId: materialCriado.id, pesoGramas: '50' }]);
      setStep(2);
    }
  };

  const fazerEstimativa = (e) => {
    e.preventDefault();
    setBusy(true);

    calcularPreco(e);
    window.setTimeout(() => setBusy(false), 250);
  };

  const finalizar = () => {
    concluirOnboarding();
    setAbaAtiva('dashboard');
  };

  const IconAtual = steps[step].icon;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Primeiros passos</p>
              <h2 className="font-bold text-white">Vamos deixar seu 3D Print Manager pronto</h2>
            </div>
          </div>
          <button onClick={concluirOnboarding} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Fechar onboarding">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-2">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const ativo = index === step;
              const concluido = index < step;
              return (
                <React.Fragment key={item.title}>
                  <div className={`flex min-w-0 flex-1 items-center gap-2 ${ativo ? 'text-white' : concluido ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${concluido ? 'border-emerald-500 bg-emerald-500/15' : ativo ? 'border-indigo-500 bg-indigo-500/15' : 'border-slate-700 bg-slate-800'}`}>
                      {concluido ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span className="hidden truncate text-xs font-semibold sm:block">{item.title}</span>
                  </div>
                  {index < steps.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 text-slate-700" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-xl bg-slate-800 p-3 text-indigo-400"><IconAtual className="h-6 w-6" /></div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Etapa {step + 1} de 3</p>
              <h3 className="mt-1 text-xl font-bold text-white">{steps[step].title}</h3>
              <p className="mt-1 text-sm text-slate-400">
                {step === 0 && 'Cadastre uma máquina para começar a organizar sua produção.'}
                {step === 1 && 'Cadastre o material que você mais usa para que a calculadora conheça seu custo real.'}
                {step === 2 && 'Vamos calcular uma peça de exemplo para você ver o valor de venda imediatamente.'}
              </p>
            </div>
          </div>

          {step === 0 && (
            <form onSubmit={avancarImpressora} className="space-y-4">
              <input required value={novaImpressora.nome} onChange={e => setNovaImpressora({ ...novaImpressora, nome: e.target.value })} placeholder="Nome da impressora (ex.: P1S 01)" className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-indigo-500" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input value={novaImpressora.modelo} onChange={e => setNovaImpressora({ ...novaImpressora, modelo: e.target.value })} placeholder="Modelo" className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-indigo-500" />
                <select value={novaImpressora.tipo} onChange={e => setNovaImpressora({ ...novaImpressora, tipo: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200 outline-none focus:border-indigo-500">
                  <option value="FDM">FDM (Filamento)</option>
                  <option value="SLA">SLA (Resina)</option>
                </select>
              </div>
              <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-bold text-white transition hover:bg-indigo-500 disabled:opacity-60">
                {busy ? 'Salvando...' : <>Cadastrar e continuar <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={avancarFilamento} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input required value={novoFilamento.nome} onChange={e => setNovoFilamento({ ...novoFilamento, nome: e.target.value })} placeholder="Nome (ex.: PLA Branco)" className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-indigo-500" />
                <input value={novoFilamento.marca} onChange={e => setNovoFilamento({ ...novoFilamento, marca: e.target.value })} placeholder="Marca" className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-indigo-500" />
                <input required type="number" step="0.01" value={novoFilamento.precoKg} onChange={e => setNovoFilamento({ ...novoFilamento, precoKg: e.target.value })} placeholder="Preço por kg (R$)" className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-indigo-500" />
                <input type="text" value={novoFilamento.cor} onChange={e => setNovoFilamento({ ...novoFilamento, cor: e.target.value })} placeholder="Cor" className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-indigo-500" />
              </div>
              <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-bold text-white transition hover:bg-indigo-500 disabled:opacity-60">
                {busy ? 'Salvando...' : <>Cadastrar e continuar <ArrowRight className="h-4 w-4" /></>}
              </button>
              {filamentos.length > 0 && <p className="text-center text-xs text-emerald-400">Você já possui {filamentos.length} material(is) cadastrado(s).</p>}
            </form>
          )}

          {step === 2 && (
            <form onSubmit={fazerEstimativa} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input required value={calcData.nomeItem} onChange={e => setCalcData({ ...calcData, nomeItem: e.target.value })} placeholder="Nome da peça" className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-indigo-500" />
                <input required type="number" min="0.1" step="0.1" value={calcData.tempoHoras} onChange={e => setCalcData({ ...calcData, tempoHoras: e.target.value })} placeholder="Tempo de impressão (h)" className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-indigo-500" />
              </div>
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-indigo-300"><CheckCircle2 className="h-4 w-4" /> Material para a estimativa</div>
                <p className="mt-1 text-xs text-slate-400">Usaremos 50 g do primeiro filamento cadastrado. Você poderá ajustar tudo depois na Calculadora.</p>
              </div>
              <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-500 disabled:opacity-60">
                {busy ? 'Calculando...' : <>Calcular minha primeira peça <Calculator className="h-4 w-4" /></>}
              </button>
              {resultadoCalculo && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-center">
                  <p className="text-xs text-emerald-300">Estimativa criada</p>
                  <p className="mt-1 text-2xl font-black text-emerald-400">R$ {resultadoCalculo.precoVendaDireta}</p>
                </div>
              )}
            </form>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <button onClick={adiarOnboarding} className="text-xs font-semibold text-slate-400 hover:text-white">
            Fazer depois
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && <button onClick={() => setStep(step - 1)} className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"><ChevronLeft className="h-4 w-4" /> Voltar</button>}
            {step === 2 && resultadoCalculo && <button onClick={finalizar} className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500">Concluir <Check className="h-4 w-4" /></button>}
          </div>
        </div>
      </div>
    </div>
  );
}
