import React from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, RotateCcw, Save, Palette, Calculator, Wrench, Bell, Building2, Bot, ShieldCheck } from 'lucide-react';

const Field = ({ label, value, onChange, type = 'text', suffix, min, max, step }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-semibold text-slate-300">{label}</span>
    <div className="relative">
      <input type={type} value={value ?? ''} onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)} min={min} max={max} step={step} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
      {suffix && <span className="absolute right-3 top-2.5 text-xs text-slate-500">{suffix}</span>}
    </div>
  </label>
);

export default function ConfiguracoesTab() {
  const { abaAtiva, configuracoes, atualizarConfiguracao, resetConfiguracoes, showToast } = useApp();
  if (abaAtiva !== 'configuracoes') return null;

  const c = configuracoes;
  const set = (path, value) => atualizarConfiguracao(path, value);

  const salvar = () => showToast('Configurações salvas neste dispositivo.', 'success');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2"><Settings className="w-6 h-6 text-indigo-400" /> Configurações</h2>
          <p className="text-sm text-slate-400 mt-1">Personalize a calculadora, aparência, manutenção e comportamento do sistema.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetConfiguracoes} className="px-3 py-2 rounded-xl border border-slate-700 text-slate-300 text-sm hover:bg-slate-800 flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Restaurar</button>
          <button onClick={salvar} className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-500 flex items-center gap-2"><Save className="w-4 h-4" /> Salvar</button>
        </div>
      </div>

      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-5">
        <h3 className="font-bold text-white flex items-center gap-2"><Palette className="w-5 h-5 text-cyan-400" /> Aparência e interface</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <label className="space-y-1.5"><span className="text-xs font-semibold text-slate-300">Tema</span><select value={c.interface.tema} onChange={e => set('interface.tema', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white"><option value="dark">Escuro</option><option value="light">Claro</option></select></label>
          <label className="space-y-1.5"><span className="text-xs font-semibold text-slate-300">Densidade</span><select value={c.interface.densidade} onChange={e => set('interface.densidade', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white"><option value="compact">Compacta</option><option value="comfortable">Confortável</option></select></label>
          <label className="space-y-1.5"><span className="text-xs font-semibold text-slate-300">Cor de destaque</span><select value={c.interface.accent} onChange={e => set('interface.accent', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white"><option value="indigo">Índigo</option><option value="cyan">Ciano</option><option value="violet">Violeta</option><option value="emerald">Esmeralda</option><option value="custom">Personalizada</option></select></label>
          <label className="space-y-1.5"><span className="text-xs font-semibold text-slate-300">Cor personalizada</span><div className="flex gap-2"><input type="color" value={c.interface.accentHex || '#4f46e5'} onChange={e => set('interface.accentHex', e.target.value)} className="h-11 w-14 rounded-xl bg-slate-900 border border-slate-700 p-1 cursor-pointer" /><input value={c.interface.accentHex || '#4f46e5'} onChange={e => set('interface.accentHex', e.target.value)} pattern="^#[0-9A-Fa-f]{6}$" className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white font-mono uppercase" /></div></label>
        </div>
      </section>

      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-5">
        <h3 className="font-bold text-white flex items-center gap-2"><Calculator className="w-5 h-5 text-indigo-400" /> Valores padrão da calculadora</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Energia" type="number" step="0.01" suffix="R$/kWh" value={c.calculadora.custoEnergiaKwh} onChange={v => set('calculadora.custoEnergiaKwh', v)} />
          <Field label="Potência da impressora" type="number" suffix="W" value={c.calculadora.potenciaImpressoraW} onChange={v => set('calculadora.potenciaImpressoraW', v)} />
          <Field label="Margem de erro" type="number" suffix="%" value={c.calculadora.margemErroPct} onChange={v => set('calculadora.margemErroPct', v)} />
          <Field label="Valor/hora de mão de obra" type="number" step="0.01" suffix="R$/h" value={c.calculadora.valorHoraMaoDeObra} onChange={v => set('calculadora.valorHoraMaoDeObra', v)} />
          <Field label="Embalagem" type="number" step="0.01" suffix="R$" value={c.calculadora.custoEmbalagem} onChange={v => set('calculadora.custoEmbalagem', v)} />
          <Field label="Lucro desejado" type="number" suffix="%" value={c.calculadora.lucroDesejadoPct} onChange={v => set('calculadora.lucroDesejadoPct', v)} />
          <Field label="Preço padrão da resina" type="number" step="0.01" suffix="R$/L" value={c.calculadora.precoResinaLitro} onChange={v => set('calculadora.precoResinaLitro', v)} />
        </div>
      </section>

      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-5">
        <h3 className="font-bold text-white flex items-center gap-2"><Wrench className="w-5 h-5 text-amber-400" /> Manutenção de máquinas</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Troca de FEP" type="number" suffix="h" value={c.manutencao.fep} onChange={v => set('manutencao.fep', v)} />
          <Field label="Troca de bico" type="number" suffix="h" value={c.manutencao.bico} onChange={v => set('manutencao.bico', v)} />
          <Field label="Lubrificação" type="number" suffix="h" value={c.manutencao.lubrificacao} onChange={v => set('manutencao.lubrificacao', v)} />
        </div>
        <p className="text-xs text-slate-500">Esses ciclos alimentam os alertas da tela Máquinas.</p>
      </section>

      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-5">
        <h3 className="font-bold text-white flex items-center gap-2"><Building2 className="w-5 h-5 text-emerald-400" /> Dados do negócio</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nome da empresa" value={c.negocio.nome} onChange={v => set('negocio.nome', v)} />
          <Field label="WhatsApp" value={c.negocio.whatsapp} onChange={v => set('negocio.whatsapp', v)} />
          <Field label="E-mail comercial" value={c.negocio.email} onChange={v => set('negocio.email', v)} />
          <Field label="Cidade" value={c.negocio.cidade} onChange={v => set('negocio.cidade', v)} />
        </div>
      </section>

      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-5">
        <h3 className="font-bold text-white flex items-center gap-2"><Bell className="w-5 h-5 text-rose-400" /> Notificações</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            ['manutencao', 'Alertas de manutenção'],
            ['estoqueBaixo', 'Alertas de estoque baixo'],
            ['onboarding', 'Mostrar onboarding para novos usuários'],
            ['toasts', 'Exibir mensagens rápidas (toasts)'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center justify-between gap-4 bg-slate-900/60 border border-slate-700 rounded-xl p-3 cursor-pointer">
              <span className="text-sm text-slate-300">{label}</span>
              <input type="checkbox" checked={c.notificacoes[key]} onChange={e => set(`notificacoes.${key}`, e.target.checked)} className="w-4 h-4 accent-indigo-500" />
            </label>
          ))}
        </div>
      </section>

      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-5">
        <h3 className="font-bold text-white flex items-center gap-2"><Bot className="w-5 h-5 text-cyan-400" /> Assistente</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="flex items-center justify-between gap-4 bg-slate-900/60 border border-slate-700 rounded-xl p-3 cursor-pointer"><span className="text-sm text-slate-300">Mostrar bola flutuante</span><input type="checkbox" checked={c.assistente.ativo} onChange={e => set('assistente.ativo', e.target.checked)} className="w-4 h-4 accent-indigo-500" /></label>
          <label className="flex items-center justify-between gap-4 bg-slate-900/60 border border-slate-700 rounded-xl p-3 cursor-pointer"><span className="text-sm text-slate-300">Confirmar ações automáticas</span><input type="checkbox" checked={c.assistente.confirmarAcoes} onChange={e => set('assistente.confirmarAcoes', e.target.checked)} className="w-4 h-4 accent-indigo-500" /></label>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 text-xs text-indigo-200 flex gap-2"><ShieldCheck className="w-4 h-4 shrink-0" /> O assistente só executa ações que o sistema já permite. A confirmação pode ser ativada para evitar alterações acidentais.</div>
      </section>
    </div>
  );
}
