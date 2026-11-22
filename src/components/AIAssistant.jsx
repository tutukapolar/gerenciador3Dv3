import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, X, Send, Sparkles, Minimize2, ChevronRight, Wifi, WifiOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SUGESTOES = [
  'Como funciona a calculadora?',
  'Abrir configurações',
  'Quantas impressoras eu tenho?',
  'Adicionar impressora Ender 3 V3, tipo FDM',
  'Adicionar filamento PLA preto, marca Elegoo, preço 95',
];

function AIAssistantPanel() {
  const {
    session,
    abaAtiva,
    setAbaAtiva,
    userPlan,
    impressoras,
    filamentos,
    produtos,
    encomendas,
    calcData,
    configuracoes,
    atualizarConfiguracao,
    setCalcData,
    showToast,
    supabase,
    carregarDados,
  } = useApp();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [connected, setConnected] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(null);
  const confirmarAcoes = Boolean(configuracoes?.assistente?.confirmarAcoes);

  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: 'Olá! Sou a IA do 3D Print Manager. Posso explicar o sistema, analisar seus dados e executar tarefas por você, como cadastrar impressoras e filamentos, alterar configurações e preparar a calculadora.' }
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const contexto = useMemo(() => ({
    telaAtual: abaAtiva,
    plano: userPlan,
    impressoras: impressoras.map(i => ({ id: i.id, nome: i.nome, modelo: i.modelo, tipo: i.tipo, status: i.status, horasRodadas: i.horas_rodadas || 0 })),
    filamentos: filamentos.map(f => ({ id: f.id, nome: f.nome, marca: f.marca, cor: f.cor, tipo: f.tipo, precoKg: f.preco_kg, pesoAtualG: f.peso_atual_g })),
    produtos: produtos.map(p => ({ id: p.id, nome: p.nome, preco: p.preco_sugerido, pesoG: p.peso_g })),
    encomendas: encomendas.map(e => ({ id: e.id, cliente: e.cliente, status: e.status, valorTotal: e.valor_total })),
    configuracoes,
    calculadoraAtual: calcData,
  }), [abaAtiva, userPlan, impressoras, filamentos, produtos, encomendas, configuracoes, calcData]);

  const addAssistant = (text) => setMessages(prev => [...prev, { id: Date.now() + Math.random(), role: 'assistant', text }]);

  const applyActions = async (actions = []) => {
    let refreshed = false;
    for (const action of actions) {
      if (!action) continue;
      if (action.type === 'navigate') {
        setAbaAtiva(action.tab);
      } else if (action.type === 'update_setting') {
        const numericPaths = new Set([
          'calculadora.custoEnergiaKwh', 'calculadora.potenciaImpressoraW', 'calculadora.margemErroPct',
          'calculadora.valorHoraMaoDeObra', 'calculadora.custoEmbalagem', 'calculadora.lucroDesejadoPct',
          'calculadora.precoResinaLitro', 'manutencao.fep', 'manutencao.bico', 'manutencao.lubrificacao'
        ]);
        const booleanPaths = new Set(['notificacoes.manutencao', 'notificacoes.estoqueBaixo', 'notificacoes.onboarding', 'notificacoes.toasts', 'assistente.ativo', 'assistente.confirmarAcoes']);
        let value = action.value;
        if (numericPaths.has(action.path)) value = Number(value);
        if (booleanPaths.has(action.path)) value = value === true || String(value).toLowerCase() === 'true';
        atualizarConfiguracao(action.path, value);
      } else if (action.type === 'prepare_calculator') {
        setCalcData(prev => ({ ...prev, ...action.data }));
        setAbaAtiva('calculadora');
      }
      if (action.type === 'refresh_data') refreshed = true;
    }
    if (refreshed && session?.user?.id) await carregarDados(session.user.id);
    if (actions.some(a => a?.type === 'navigate')) setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const enviar = async (raw, forceMutations = false) => {
    const text = raw.trim();
    if (!text || typing) return;

    const nextMessages = [...messages, { id: Date.now(), role: 'user', text }];
    setMessages(nextMessages);
    setInput('');
    setTyping(true);

    try {
      const allowMutations = forceMutations || !confirmarAcoes;
      if (!supabase?.functions) throw new Error('Cliente Supabase indisponível.');

      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          messages: nextMessages.slice(-14).map(m => ({ role: m.role, text: m.text })),
          context: contexto,
          allowMutations,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setConnected(true);
      if (data?.text) addAssistant(data.text);
      await applyActions(data?.actions || []);

      if (confirmarAcoes && /^(confirmar|confirmo|sim|pode)$/i.test(text) && pendingRequest) {
        setPendingRequest(null);
      }
    } catch (error) {
      console.error('Assistente IA:', error);
      setConnected(false);
      addAssistant(`Não consegui conectar à IA agora. ${error?.message || 'Verifique a configuração da Edge Function.'}`);
      showToast?.('Não foi possível conectar ao assistente IA.', 'error');
    } finally {
      setTyping(false);
    }
  };

  const executar = async (text) => {
    const isConfirm = /^(confirmar|confirmo|sim|pode)$/i.test(text.trim());
    if (isConfirm && pendingRequest) {
      const request = pendingRequest;
      setPendingRequest(null);
      await enviar(request, true);
      return;
    }

    if (confirmarAcoes && /\b(adicionar|cadastrar|criar|registrar|alterar|mudar)\b/i.test(text)) {
      setPendingRequest(text);
      addAssistant(`Entendi. Como a confirmação de ações está ativada, vou aguardar sua confirmação antes de cadastrar ou alterar dados. Digite “confirmar” para executar: “${text}”.`);
      return;
    }

    await enviar(text);
  };

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} className="ai-fab fixed bottom-5 right-5 z-50 w-16 h-16 rounded-full bg-indigo-600 text-white shadow-2xl border border-white/20 flex items-center justify-center hover:scale-105 transition" title="Abrir assistente IA">
          <Bot className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-slate-900 flex items-center justify-center"><Sparkles className="w-3 h-3 text-slate-900" /></span>
        </button>
      )}

      {open && (
        <div className="ai-panel fixed bottom-5 right-5 z-50 w-[min(410px,calc(100vw-24px))] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[min(720px,calc(100vh-32px))]">
          <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center"><Bot className="w-5 h-5" /></div>
              <div>
                <div className="font-bold flex items-center gap-2">Assistente IA {connected === true ? <Wifi className="w-3.5 h-3.5 text-emerald-300" /> : connected === false ? <WifiOff className="w-3.5 h-3.5 text-rose-300" /> : null}</div>
                <div className="text-[11px] text-white/70">Groq + ações no sistema</div>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setMessages([{ id: Date.now(), role: 'assistant', text: 'Conversa limpa. O que você gostaria de fazer?' }])} className="p-2 hover:bg-white/10 rounded-lg" title="Limpar conversa"><Minimize2 className="w-4 h-4" /></button>
              <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/10 rounded-lg" title="Fechar"><X className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[300px]">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] rounded-2xl px-3 py-2.5 text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-md' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-md'}`}>
                  {typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text)}
                  {msg.action && <button onClick={() => setAbaAtiva(msg.action)} className="mt-2 flex items-center gap-1 text-xs font-semibold text-cyan-300">Abrir tela <ChevronRight className="w-3 h-3" /></button>}
                </div>
              </div>
            ))}
            {typing && <div className="text-xs text-slate-500 px-2">A IA está pensando e verificando o sistema...</div>}
            <div ref={endRef} />
          </div>

          <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto">
            {SUGESTOES.slice(0, 4).map(s => <button key={s} onClick={() => executar(s)} className="shrink-0 text-[11px] px-2.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:border-indigo-500/50">{s}</button>)}
          </div>

          <form onSubmit={e => { e.preventDefault(); executar(input); }} className="p-3 border-t border-slate-700 bg-slate-950/60 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ex.: cadastre uma Ender 3 V3..." className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
            <button type="submit" disabled={!input.trim() || typing} className="w-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 flex items-center justify-center"><Send className="w-4 h-4" /></button>
          </form>
        </div>
      )}
    </>
  );
}


class AIAssistantErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Erro de renderização no Assistente IA:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-5 right-5 z-50">
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="rounded-full bg-indigo-600 text-white px-4 py-3 shadow-2xl border border-white/20 text-sm font-medium"
          >
            Reabrir Assistente IA
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AIAssistant() {
  return (
    <AIAssistantErrorBoundary>
      <AIAssistantPanel />
    </AIAssistantErrorBoundary>
  );
}
