import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { AppContext } from './context/AppContext';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import { gerarPayloadPix } from './utils/pix';
import './theme.css';

const ADMIN_EMAIL = 'ytty8229@gmail.com';

export default function App() {

  // Informações do PIX
  const CHAVE_PIX = "192c8e91-54c8-4c1d-a48f-68397556353e";
  const NOME_RECEBEDOR = "Arthur Corrêa Sousa";
  const CIDADE_RECEBEDOR = "Guaratinguetá";
  const VALOR_PRO = 19.90;
  const SEU_NUMERO_WHATSAPP = "5512988289882";

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('dashboard');
  const [userPlan, setUserPlan] = useState('gratuito');

  // Estados de Autenticação ('login' | 'signUp')
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // --- AVALIAÇÕES E FEEDBACK/SUGESTÕES ---
  const [avaliacoesList, setAvaliacoesList] = useState([]);
  const [novaAvaliacao, setNovaAvaliacao] = useState({ nome: '', nota: 5, comentario: '' });
  const [formFeedback, setFormFeedback] = useState({ tipo: 'sugestao', email: '', mensagem: '' });
  const [feedbackSucesso, setFeedbackSucesso] = useState('');
  const [feedbacksAdminList, setFeedbacksAdminList] = useState([]);

  // --- UX / ONBOARDING / TOASTS ---
  const [toast, setToast] = useState(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [dadosCarregados, setDadosCarregados] = useState(false);


  // --- CONFIGURAÇÕES / PREFERÊNCIAS DO USUÁRIO ---
  const CONFIG_PADRAO = {
    interface: { tema: 'dark', densidade: 'comfortable', accent: 'indigo', accentHex: '#4f46e5' },
    calculadora: {
      custoEnergiaKwh: 0.90,
      potenciaImpressoraW: 200,
      margemErroPct: 5,
      valorHoraMaoDeObra: 20,
      custoEmbalagem: 3.50,
      lucroDesejadoPct: 100,
      precoResinaLitro: 200
    },
    manutencao: { fep: 50, bico: 200, lubrificacao: 100 },
    negocio: { nome: '', whatsapp: SEU_NUMERO_WHATSAPP, email: '', cidade: '' },
    notificacoes: { manutencao: true, estoqueBaixo: true, onboarding: true, toasts: true },
    assistente: { ativo: true, confirmarAcoes: false }
  };

  const [configuracoes, setConfiguracoes] = useState(CONFIG_PADRAO);

  const atualizarConfiguracao = (path, value) => {
    setConfiguracoes(prev => {
      const parts = path.split('.');
      const next = { ...prev };
      let cursor = next;
      for (let i = 0; i < parts.length - 1; i++) {
        cursor[parts[i]] = { ...cursor[parts[i]] };
        cursor = cursor[parts[i]];
      }
      cursor[parts[parts.length - 1]] = value;

      if (path === 'interface.accent') {
        const presets = { indigo: '#4f46e5', cyan: '#0891b2', violet: '#7c3aed', emerald: '#059669' };
        next.interface.accentHex = presets[value] || next.interface.accentHex || '#4f46e5';
      }
      if (path === 'interface.accentHex') {
        const validHex = /^#[0-9A-Fa-f]{6}$/.test(String(value));
        if (!validHex) return prev;
        next.interface.accent = 'custom';
      }

      localStorage.setItem('3dpm:configuracoes', JSON.stringify(next));
      if (path.startsWith('calculadora.')) {
        const mapaCalc = {
          custoEnergiaKwh: 'custoEnergiaKwh',
          potenciaImpressoraW: 'potenciaImpressoraW',
          margemErroPct: 'margemErroPct',
          valorHoraMaoDeObra: 'valorHoraMaoDeObra',
          custoEmbalagem: 'custoEmbalagem',
          lucroDesejadoPct: 'lucroDesejadoPct'
        };
        const chave = parts[1];
        if (mapaCalc[chave]) {
          setCalcData(prev => ({ ...prev, [mapaCalc[chave]]: String(value) }));
        }
      }
      return next;
    });
  };

  const resetConfiguracoes = () => {
    setConfiguracoes(CONFIG_PADRAO);
    localStorage.setItem('3dpm:configuracoes', JSON.stringify(CONFIG_PADRAO));
    setCalcData(prev => ({
      ...prev,
      custoEnergiaKwh: String(CONFIG_PADRAO.calculadora.custoEnergiaKwh),
      potenciaImpressoraW: String(CONFIG_PADRAO.calculadora.potenciaImpressoraW),
      margemErroPct: String(CONFIG_PADRAO.calculadora.margemErroPct),
      valorHoraMaoDeObra: String(CONFIG_PADRAO.calculadora.valorHoraMaoDeObra),
      custoEmbalagem: String(CONFIG_PADRAO.calculadora.custoEmbalagem),
      lucroDesejadoPct: String(CONFIG_PADRAO.calculadora.lucroDesejadoPct)
    }));
    showToast('Configurações restauradas para os valores padrão.', 'success');
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('3dpm:configuracoes') || 'null');
      if (saved) {
        const merged = {
          ...CONFIG_PADRAO,
          ...saved,
          interface: { ...CONFIG_PADRAO.interface, ...(saved.interface || {}) },
          calculadora: { ...CONFIG_PADRAO.calculadora, ...(saved.calculadora || {}) },
          manutencao: { ...CONFIG_PADRAO.manutencao, ...(saved.manutencao || {}) },
          negocio: { ...CONFIG_PADRAO.negocio, ...(saved.negocio || {}) },
          notificacoes: { ...CONFIG_PADRAO.notificacoes, ...(saved.notificacoes || {}) },
          assistente: { ...CONFIG_PADRAO.assistente, ...(saved.assistente || {}) }
        };
        setConfiguracoes(merged);
        setCalcData(prev => ({
          ...prev,
          custoEnergiaKwh: String(merged.calculadora.custoEnergiaKwh),
          potenciaImpressoraW: String(merged.calculadora.potenciaImpressoraW),
          margemErroPct: String(merged.calculadora.margemErroPct),
          valorHoraMaoDeObra: String(merged.calculadora.valorHoraMaoDeObra),
          custoEmbalagem: String(merged.calculadora.custoEmbalagem),
          lucroDesejadoPct: String(merged.calculadora.lucroDesejadoPct)
        }));
      }
    } catch (error) {
      console.warn('Não foi possível carregar as configurações locais.', error);
    }
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
  };

  const fecharToast = () => setToast(null);

  // --- MÁQUINAS / PRINT FARM ---
  const [impressoras, setImpressoras] = useState([]);
  const [novaImpressora, setNovaImpressora] = useState({ nome: '', modelo: '', tipo: 'FDM' });

  // --- ESTOQUE DE FILAMENTOS E RESINAS ---
  const [filamentos, setFilamentos] = useState([]);
  const [novoFilamento, setNovoFilamento] = useState({ nome: '', marca: '', cor: '', tipo: 'PLA', precoKg: '', pesoTotalG: '1000' });
  const [estoqueFeedback, setEstoqueFeedback] = useState({ tipo: '', texto: '' });
  const [filamentoExcluindoId, setFilamentoExcluindoId] = useState(null);

  // --- CALCULADORA (FDM / RESINA) ---
  const [tipoTecnologia, setTipoTecnologia] = useState('FDM');
  const [linkMakerworld, setLinkMakerworld] = useState('');
  const [filamentosProjeto, setFilamentosProjeto] = useState([
    { idTemp: Date.now(), filamentoId: '', pesoGramas: '' }
  ]);
  const [resinaProjeto, setResinaProjeto] = useState({ volumeMl: '', precoLitro: '200', tempoUvMin: '10', desgasteFepHora: '0.15', volumeIpaMl: '50' });

  const [calcData, setCalcData] = useState({
    nomeItem: '',
    telefoneCliente: '',
    tempoHoras: '',
    quantidadePecas: '1',
    margemErroPct: '5',
    custoEnergiaKwh: '0.90',
    potenciaImpressoraW: '200',
    custoMaoDeObra: '10.00',
    valorHoraMaoDeObra: '20.00',
    tempoSetupMin: '0',
    tempoPreAquecimentoMin: '0',
    tempoFatiamentoMin: '5',
    tempoRemocaoSuportesMin: '0',
    tempoLixamentoMin: '0',
    tempoLavagemUvMin: '0',
    custoEmbalagem: '3.50',
    lucroDesejadoPct: '100'
  });
  const [resultadoCalculo, setResultadoCalculo] = useState(null);

  // --- PRODUTOS E ENCOMENDAS ---
  const [produtos, setProdutos] = useState([]);
  const [encomendas, setEncomendas] = useState([]);
  const [novaEncomenda, setNovaEncomenda] = useState({
    cliente: '',
    contato: '',
    endereco: '',
    produtoId: '',
    produtoNome: '',
    quantidade: 1,
    valorProduto: '',
    taxaEntrega: '',
    status: 'Pendente',
    impressoraId: ''
  });

  // --- ESTADO DA ABA ANÚNCIOS ---
  const [produtoAnuncioId, setProdutoAnuncioId] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [copiadoPix, setCopiadoPix] = useState(false);
  const [gerandoIA, setGerandoIA] = useState(false);
  const [textoAnuncioGerado, setTextoAnuncioGerado] = useState('');
  const [tomAnuncio, setTomAnuncio] = useState('persuasivo');
  const [plataformaAnuncio, setPlataformaAnuncio] = useState('shopee');
  const [detalhesAnuncio, setDetalhesAnuncio] = useState({
    material: '',
    cor: '',
    alturaCm: '',
    larguraCm: '',
    profundidadeCm: '',
    acabamento: '',
    publicoAlvo: '',
    uso: '',
    diferencial: '',
    prazoEnvio: ''
  });

  // Payload do PIX do Passo 1
  const payloadPix = gerarPayloadPix({
    chave: CHAVE_PIX,
    nome: NOME_RECEBEDOR,
    cidade: CIDADE_RECEBEDOR,
    valor: VALOR_PRO
  });

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(payloadPix)}`;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setDadosCarregados(false);
      if (currentSession) {
        carregarDados(currentSession.user.id);
        if (currentSession.user.email === ADMIN_EMAIL) {
          carregarFeedbacksAdmin();
        }
      } else {
        setDadosCarregados(false);
        setOnboardingOpen(false);
        setImpressoras([]);
        setFilamentos([]);
        setProdutos([]);
        setEncomendas([]);
        setFeedbacksAdminList([]);
      }
      carregarAvaliacoes();
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user?.id || !dadosCarregados) return;

    const key = `3dpm:onboarding:${session.user.id}`;
    const status = localStorage.getItem(key);
    const usuarioNovo = status === 'pending';
    const dashboardVazio = impressoras.length === 0 && filamentos.length === 0 && produtos.length === 0;

    if (status !== 'completed' && (usuarioNovo || dashboardVazio)) {
      setOnboardingOpen(true);
    }
  }, [session?.user?.id, dadosCarregados, impressoras.length, filamentos.length, produtos.length]);

  const concluirOnboarding = () => {
    if (session?.user?.id) {
      localStorage.setItem(`3dpm:onboarding:${session.user.id}`, 'completed');
    }
    setOnboardingOpen(false);
    showToast('Tudo certo! Seu espaço de produção está pronto.', 'success');
  };

  const adiarOnboarding = () => {
    setOnboardingOpen(false);
    showToast('Tudo bem. O passo a passo ficará disponível novamente no próximo acesso.', 'info');
  };

  const carregarAvaliacoes = async () => {
    try {
      const { data } = await supabase.from('avaliacoes').select('*').order('created_at', { ascending: false });
      if (data) setAvaliacoesList(data);
    } catch (err) {
      console.log('Tabela de avaliações não encontrada ou vazia.');
    }
  };

  const carregarFeedbacksAdmin = async () => {
    try {
      const { data } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });
      if (data) setFeedbacksAdminList(data);
    } catch (err) {
      console.log('Tabela de feedbacks não encontrada ou vazia.');
    }
  };

     const carregarDados = async (userId) => {
    try {
      const [filRes, prodRes, encRes, impRes, profRes] = await Promise.all([
        supabase.from('estoque_filamentos').select('*').eq('user_id', userId),
        supabase.from('produtos').select('*').eq('user_id', userId),
        supabase.from('encomendas').select('*').eq('user_id', userId),
        supabase.from('impressoras').select('*').eq('user_id', userId),
        // Buscamos o plano e a data de expiração juntos do Supabase
        supabase.from('profiles').select('plano, data_expiracao').eq('id', userId).maybeSingle()
      ]);

      if (filRes.data) setFilamentos(filRes.data);
      if (prodRes.data) setProdutos(prodRes.data);
      if (encRes.data) setEncomendas(encRes.data);
      if (impRes.data) {
        let manutencaoLocal = {};
        try {
          manutencaoLocal = JSON.parse(localStorage.getItem(`3dpm:maintenance:${userId}`) || '{}');
        } catch {
          manutencaoLocal = {};
        }

        setImpressoras(impRes.data.map(imp => ({
          ...imp,
          horas_rodadas: imp.horas_rodadas ?? manutencaoLocal[imp.id]?.horas_rodadas ?? 0,
          ultima_troca_fep_horas: imp.ultima_troca_fep_horas ?? manutencaoLocal[imp.id]?.ultima_troca_fep_horas ?? 0,
          ultima_troca_bico_horas: imp.ultima_troca_bico_horas ?? manutencaoLocal[imp.id]?.ultima_troca_bico_horas ?? 0,
          ultima_lubrificacao_horas: imp.ultima_lubrificacao_horas ?? manutencaoLocal[imp.id]?.ultima_lubrificacao_horas ?? 0
        })));
      }
      
      if (profRes.data) {
        const planoAtual = profRes.data.plano || 'gratuito';
        const dataExpiracaoStr = profRes.data.data_expiracao;

        // Se o plano for PRO, validamos se ele ainda está dentro do prazo de validade
        if (planoAtual === 'pro' && dataExpiracaoStr) {
          const agoraMs = Date.now();
          const vencimentoMs = Date.parse(dataExpiracaoStr);

          // Se a data já passou (está no passado) ou se a conversão falhar
          if (isNaN(vencimentoMs) || agoraMs > vencimentoMs) {
            setUserPlan('gratuito');
            
            // Faz o downgrade automático direto na tabela do Supabase
            await supabase
              .from('profiles')
              .update({ plano: 'gratuito' })
              .eq('id', userId);
              
            console.log("Plano PRO expirado com sucesso.");
          } else {
            setUserPlan('pro');
          }
        } else {
          setUserPlan(planoAtual);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setDadosCarregados(true);
    }
  };



  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (authMode === 'signUp') {
      const { data: authData, error: signUpErr } = await supabase.auth.signUp({ email, password });
      if (signUpErr) {
        setAuthError(signUpErr.message);
        return;
      }
      if (authData.user) {
        await supabase.from('profiles').insert([{ id: authData.user.id, email, plano: 'gratuito' }]);
        localStorage.setItem(`3dpm:onboarding:${authData.user.id}`, 'pending');
        setAuthSuccess('Conta criada com sucesso! Faça login para começar o passo a passo.');
        setAuthMode('login');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError('E-mail ou senha inválidos.');
    }
  };

  const enviarAvaliacao = async (e) => {
    e.preventDefault();
    if (!novaAvaliacao.nome || !novaAvaliacao.comentario) return;

    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const itemNovaAvaliacao = {
      nome: novaAvaliacao.nome,
      nota: parseInt(novaAvaliacao.nota),
      comentario: novaAvaliacao.comentario,
      data: dataAtual
    };

    try {
      const { data, error } = await supabase.from('avaliacoes').insert([itemNovaAvaliacao]).select();
      if (!error && data) {
        setAvaliacoesList([data[0], ...avaliacoesList]);
      } else {
        setAvaliacoesList([{ id: Date.now(), ...itemNovaAvaliacao }, ...avaliacoesList]);
      }
    } catch (err) {
      setAvaliacoesList([{ id: Date.now(), ...itemNovaAvaliacao }, ...avaliacoesList]);
    }

    setNovaAvaliacao({ nome: '', nota: 5, comentario: '' });
    alert('Obrigado! Sua avaliação foi publicada com sucesso.');
  };

  const enviarFeedback = async (e) => {
    e.preventDefault();
    if (!formFeedback.mensagem) return;

    const emailEnviar = session?.user?.email || formFeedback.email || 'Anônimo';

    try {
      const { data, error } = await supabase.from('feedbacks').insert([{
        tipo: formFeedback.tipo,
        email: emailEnviar,
        mensagem: formFeedback.mensagem
      }]).select();

      if (!error && data && session?.user?.email === ADMIN_EMAIL) {
        setFeedbacksAdminList([data[0], ...feedbacksAdminList]);
      }
    } catch (err) {
      console.log('Feedback registrado localmente');
    }

    setFeedbackSucesso('Sua mensagem foi enviada aos desenvolvedores! Agradecemos sua ajuda.');
    setFormFeedback({ tipo: 'sugestao', email: '', mensagem: '' });
    setTimeout(() => setFeedbackSucesso(''), 4000);
  };

 // -------------------------------------------------------------
// 1. ATUALIZAÇÃO DA FUNÇÃO DE IMPORTAÇÃO MAKERWORLD (SCRAPING REAL)
// -------------------------------------------------------------
const importarDadosLink = async () => {
  if (!linkMakerworld) return;
  try {
    // Chamada à Edge Function do Supabase responsável por desviar de CORS/Cloudflare
    const response = await fetch("https://dafrfrwnwvnrysjtmjro.supabase.co/functions/v1/makerworld-scraper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ url: linkMakerworld })
    });

    const data = await response.json();

    if (data && !data.error) {
      setCalcData(prev => ({
        ...prev,
        nomeItem: data.title || 'Modelo MakerWorld',
        tempoHoras: (data.printTimeMinutes / 60).toFixed(2) || '1.0'
      }));

      if (tipoTecnologia === 'FDM' && data.weightGramas) {
        setFilamentosProjeto([
          { idTemp: Date.now(), filamentoId: filamentos[0]?.id?.toString() || '', pesoGramas: data.weightGramas.toString() }
        ]);
      }
      alert('Dados do MakerWorld importados com sucesso!');
    } else {
      alert('Não foi possível extrair os dados diretamente. Verifique a URL.');
    }
  } catch (err) {
    console.error('Erro na extração do MakerWorld:', err);
    alert('Erro ao conectar com o serviço de scraping do MakerWorld.');
  }
};

// -------------------------------------------------------------
// 2. ADIÇÃO DO SUPORTE A RECEBIMENTO AUTOMÁTICO DO SLICER (WEBHOOK)
// -------------------------------------------------------------
useEffect(() => {
  // Listener para capturar dados vindos de extensões de navegador ou script do Slicer
  const handleSlicerData = (event) => {
    if (event.data && event.data.source === '3D_SLICER_INTEGRATION') {
      const { nomeModel, tempoMinutos, pesoGramos, tecnologia } = event.data;
      
      if (tecnologia) setTipoTecnologia(tecnologia);

      setCalcData(prev => ({
        ...prev,
        nomeItem: nomeModel || prev.nomeItem,
        tempoHoras: (tempoMinutos / 60).toFixed(2)
      }));

      if (pesoGramos && filamentos.length > 0) {
        setFilamentosProjeto([
          { idTemp: Date.now(), filamentoId: filamentos[0].id.toString(), pesoGramas: pesoGramos.toString() }
        ]);
      }
      alert(`Dados recebidos do Slicer para: ${nomeModel}`);
    }
  };

  window.addEventListener('message', handleSlicerData);
  return () => window.removeEventListener('message', handleSlicerData);
}, [filamentos]);
  
  const adicionarImpressora = async (e = null, dadosOverride = null) => {
    e?.preventDefault();
    const dados = dadosOverride || novaImpressora;
    if (!dados.nome) return false;

    if (userPlan === 'gratuito' && impressoras.length >= 1) {
      showToast('O Plano Gratuito permite apenas 1 impressora. Faça upgrade para o Plano PRO para liberar a frota.', 'warning');
      setAbaAtiva('planos');
      return false;
    }

    const { data, error } = await supabase.from('impressoras').insert([{
      user_id: session.user.id,
      nome: dados.nome,
      modelo: dados.modelo || 'Genérica',
      tipo: dados.tipo || 'FDM',
      status: 'livre'
    }]).select();

    if (!error && data) {
      setImpressoras([...impressoras, data[0]]);
      setNovaImpressora({ nome: '', modelo: '', tipo: 'FDM' });
      showToast('Impressora cadastrada com sucesso.', 'success');
      return true;
    }

    showToast('Não foi possível cadastrar a impressora. Tente novamente.', 'error');
    return false;
  };

  const LIMITES_MANUTENCAO = configuracoes.manutencao;

  const getMaintenanceLocal = () => {
    try {
      return JSON.parse(localStorage.getItem(`3dpm:maintenance:${session?.user?.id}`) || '{}');
    } catch {
      return {};
    }
  };

  const saveMaintenanceLocal = (id, patch) => {
    const all = getMaintenanceLocal();
    all[id] = { ...(all[id] || {}), ...patch };
    localStorage.setItem(`3dpm:maintenance:${session?.user?.id}`, JSON.stringify(all));
  };

  const atualizarHorasImpressora = async (id, horas) => {
    if (userPlan !== 'pro') {
      showToast('O controle de manutenção é exclusivo do Plano PRO.', 'warning');
      setAbaAtiva('planos');
      return false;
    }

    const valor = Math.max(0, parseFloat(horas) || 0);
    const { error } = await supabase.from('impressoras').update({ horas_rodadas: valor }).eq('id', id);

    if (error) {
      saveMaintenanceLocal(id, { horas_rodadas: valor });
      showToast('Horas atualizadas neste dispositivo. Rode a migração SQL para sincronizar entre dispositivos.', 'warning');
    } else {
      showToast('Horas de operação atualizadas.', 'success');
    }

    setImpressoras(prev => prev.map(imp => imp.id === id ? { ...imp, horas_rodadas: valor } : imp));
    return true;
  };

  const registrarManutencao = async (id, tipo) => {
    if (userPlan !== 'pro') {
      showToast('A gestão de manutenção é exclusiva do Plano PRO.', 'warning');
      setAbaAtiva('planos');
      return false;
    }

    const impressora = impressoras.find(imp => imp.id === id);
    if (!impressora) return false;

    const horas = Number(impressora.horas_rodadas || 0);
    const campo = tipo === 'fep' ? 'ultima_troca_fep_horas' : tipo === 'bico' ? 'ultima_troca_bico_horas' : 'ultima_lubrificacao_horas';
    const patch = { [campo]: horas };
    const { error } = await supabase.from('impressoras').update(patch).eq('id', id);

    if (error) {
      saveMaintenanceLocal(id, patch);
      showToast('Manutenção registrada neste dispositivo. Rode a migração SQL para sincronizar na nuvem.', 'warning');
    } else {
      showToast('Manutenção registrada com sucesso.', 'success');
    }

    setImpressoras(prev => prev.map(imp => imp.id === id ? { ...imp, ...patch } : imp));
    return true;
  };

  const excluirImpressora = async (id) => {
    await supabase.from('impressoras').delete().eq('id', id);
    setImpressoras(impressoras.filter(i => i.id !== id));
  };

  const corMaterialSwatch = (cor) => {
    if (!cor) return '#64748b';
    const mapa = {
      preto: '#0f172a', branco: '#f8fafc', vermelho: '#ef4444', azul: '#3b82f6',
      verde: '#22c55e', amarelo: '#eab308', cinza: '#94a3b8', laranja: '#f97316',
      rosa: '#ec4899', roxo: '#a855f7', natural: '#d6d3d1', transparente: '#67e8f9'
    };
    const chave = cor.trim().toLowerCase();
    return mapa[chave] || '#6366f1';
  };

  const adicionarFilamento = async (e = null, dadosOverride = null) => {
    e?.preventDefault();
    const dados = dadosOverride || novoFilamento;
    setEstoqueFeedback({ tipo: '', texto: '' });
    if (!dados.nome || !dados.precoKg) {
      setEstoqueFeedback({ tipo: 'erro', texto: 'Informe o nome e o preço por quilo para cadastrar o material.' });
      return false;
    }

    if (userPlan === 'gratuito' && filamentos.length >= 5) {
      setEstoqueFeedback({ tipo: 'erro', texto: 'O Plano Gratuito permite até 5 materiais. Faça upgrade para o Plano Pro.' });
      return false;
    }

    const { data, error } = await supabase.from('estoque_filamentos').insert([{
      user_id: session.user.id,
      nome: dados.nome,
      marca: dados.marca || 'Genérica',
      cor: dados.cor || 'Padrão',
      tipo: dados.tipo || 'PLA',
      preco_kg: parseFloat(dados.precoKg),
      peso_atual_g: parseFloat(dados.pesoTotalG) || 1000
    }]).select();

    if (!error && data) {
      setFilamentos([...filamentos, data[0]]);
      setNovoFilamento({ nome: '', marca: '', cor: '', tipo: 'PLA', precoKg: '', pesoTotalG: '1000' });
      setEstoqueFeedback({ tipo: 'ok', texto: 'Material adicionado ao estoque.' });
      showToast('Filamento cadastrado com sucesso.', 'success');
      return data[0];
    } else {
      setEstoqueFeedback({ tipo: 'erro', texto: 'Não foi possível salvar o material. Tente novamente.' });
      showToast('Não foi possível salvar o filamento.', 'error');
      return false;
    }
  };

  const excluirFilamento = async (id) => {
    const { error } = await supabase.from('estoque_filamentos').delete().eq('id', id);
    if (error) {
      setEstoqueFeedback({ tipo: 'erro', texto: 'Não foi possível remover o material.' });
      setFilamentoExcluindoId(null);
      return;
    }
    setFilamentos(filamentos.filter(f => f.id !== id));
    setFilamentoExcluindoId(null);
    setEstoqueFeedback({ tipo: 'ok', texto: 'Material removido do estoque.' });
  };

  const calcularPreco = (e = null) => {
    e?.preventDefault();
    
    const tempoH = parseFloat(calcData.tempoHoras) || 0;
    const qtdPecas = parseInt(calcData.quantidadePecas) || 1;
    const pctErro = parseFloat(calcData.margemErroPct) || 0;
    const potenciaW = parseFloat(calcData.potenciaImpressoraW) || 200;
    const kwhPreco = parseFloat(calcData.custoEnergiaKwh) || 0.90;
    const maoDeObra = parseFloat(calcData.custoMaoDeObra) || 0;
    const embalagem = parseFloat(calcData.custoEmbalagem) || 0;
    const margemLucroPct = parseFloat(calcData.lucroDesejadoPct) || 100;

    const tempoSetupMin = parseFloat(calcData.tempoSetupMin) || 0;
    const tempoPreAquecimentoMin = parseFloat(calcData.tempoPreAquecimentoMin) || 0;
    const tempoFatiamentoMin = parseFloat(calcData.tempoFatiamentoMin) || 0;
    const tempoRemocaoSuportesMin = parseFloat(calcData.tempoRemocaoSuportesMin) || 0;
    const tempoLixamentoMin = parseFloat(calcData.tempoLixamentoMin) || 0;
    const tempoLavagemUvMin = parseFloat(calcData.tempoLavagemUvMin) || 0;
    const valorHoraMaoDeObra = parseFloat(calcData.valorHoraMaoDeObra) || 20;
    const tempoMaoDeObraMin = userPlan === 'pro'
      ? tempoSetupMin + tempoPreAquecimentoMin + tempoFatiamentoMin + ((tempoRemocaoSuportesMin + tempoLixamentoMin + tempoLavagemUvMin) * qtdPecas)
      : 0;
    const maoDeObraCalculada = userPlan === 'pro'
      ? (tempoMaoDeObraMin / 60) * valorHoraMaoDeObra
      : maoDeObra;

    let custoMaterialBase = 0;
    let pesoOuVolumeTotal = 0;
    const detalhamentoMateriais = [];

    if (tipoTecnologia === 'FDM') {
      filamentosProjeto.forEach(fp => {
        const filamentoEncontrado = filamentos.find(f => f.id === fp.filamentoId || f.id === parseInt(fp.filamentoId));
        const pesoG = parseFloat(fp.pesoGramas) || 0;
        const precoKg = filamentoEncontrado ? (filamentoEncontrado.preco_kg || filamentoEncontrado.precoKg) : 120;
        
        const custoParcial = ((pesoG * qtdPecas) / 1000) * precoKg;
        custoMaterialBase += custoParcial;
        pesoOuVolumeTotal += (pesoG * qtdPecas);

        detalhamentoMateriais.push({
          nome: filamentoEncontrado ? `${filamentoEncontrado.nome} (${filamentoEncontrado.tipo || 'PLA'} - ${filamentoEncontrado.cor})` : 'Filamento Genérico',
          medidaParcial: `${(pesoG * qtdPecas).toFixed(0)}g`,
          custoParcial: custoParcial.toFixed(2)
        });
      });
    } else {
      if (userPlan === 'gratuito') {
        showToast('O Módulo de Resina (SLA) é exclusivo para assinantes do Plano PRO.', 'warning');
        setAbaAtiva('planos');
        return false;
      }
      const volumeMl = parseFloat(resinaProjeto.volumeMl) || 0;
      const precoLitro = parseFloat(resinaProjeto.precoLitro) || 200;
      const custoResina = ((volumeMl * qtdPecas) / 1000) * precoLitro;
      const custoIpa = ((parseFloat(resinaProjeto.volumeIpaMl) || 50) / 1000) * 35; 
      const desgasteFep = (parseFloat(resinaProjeto.desgasteFepHora) || 0.15) * (tempoH * qtdPecas);
      
      custoMaterialBase = custoResina + custoIpa + desgasteFep;
      pesoOuVolumeTotal = (volumeMl * qtdPecas);

      detalhamentoMateriais.push({
        nome: `Resina SLA (${volumeMl}ml) + IPA + Desgaste FEP/Tela`,
        medidaParcial: `${(volumeMl * qtdPecas).toFixed(0)}ml`,
        custoParcial: custoMaterialBase.toFixed(2)
      });
    }

    const custoEnergiaBase = ((tempoH * qtdPecas) * (potenciaW / 1000)) * kwhPreco;
    const custoAdicionalErro = (custoMaterialBase + custoEnergiaBase) * (pctErro / 100);
    const custoTotalBase = custoMaterialBase + custoEnergiaBase + custoAdicionalErro + maoDeObraCalculada + embalagem;

    const valorLucroDesejado = custoTotalBase * (margemLucroPct / 100);
    const precoVendaDireta = custoTotalBase + valorLucroDesejado;

    const calcularPlataforma = (comissaoPct, taxaFixa) => {
      const comissaoDecimal = comissaoPct / 100;
      const precoAnuncio = (custoTotalBase + valorLucroDesejado + taxaFixa) / (1 - comissaoDecimal);
      const valorComissao = precoAnuncio * comissaoDecimal;
      const lucroLiquido = precoAnuncio - valorComissao - taxaFixa - custoTotalBase;
      return {
        precoAnuncio: precoAnuncio.toFixed(2),
        lucroLiquido: lucroLiquido.toFixed(2)
      };
    };

    setResultadoCalculo({
      tipoTecnologia,
      qtdPecas,
      pesoOuVolumeTotal: pesoOuVolumeTotal.toFixed(0),
      unidadeMedida: tipoTecnologia === 'FDM' ? 'g' : 'ml',
      tempoTotalH: (tempoH * qtdPecas).toFixed(1),
      detalhamentoMateriais,
      custoMaterial: custoMaterialBase.toFixed(2),
      custoEnergia: custoEnergiaBase.toFixed(2),
      custoAdicionalErro: custoAdicionalErro.toFixed(2),
      custoMaoDeObra: maoDeObraCalculada.toFixed(2),
      tempoMaoDeObraMin: tempoMaoDeObraMin.toFixed(0),
      custoEmbalagem: embalagem.toFixed(2),
      custoTotalBase: custoTotalBase.toFixed(2),
      precoVendaDireta: precoVendaDireta.toFixed(2),
      shopee: calcularPlataforma(14, 4.00),
      mercadoLivre: calcularPlataforma(16.5, 6.00),
      tikTok: calcularPlataforma(12, 3.00)
    });

    showToast('Precificação calculada com sucesso.', 'success');
    return true;
  };

  const salvarComoProduto = async () => {
    if (!resultadoCalculo || !calcData.nomeItem) return;
    
    if (userPlan === 'gratuito' && produtos.length >= 3) {
      alert('O Plano Gratuito permite salvar no máximo 3 produtos. Faça upgrade para o Plano Pro!');
      setAbaAtiva('planos');
      return;
    }

    const nomeProdutoFinal = `${calcData.nomeItem} ${resultadoCalculo.qtdPecas > 1 ? `(Kit ${resultadoCalculo.qtdPecas}x)` : ''}`;
    
    const { data, error } = await supabase.from('produtos').insert([{
      user_id: session.user.id,
      nome: nomeProdutoFinal,
      preco_sugerido: parseFloat(resultadoCalculo.precoVendaDireta),
      custo_total: parseFloat(resultadoCalculo.custoTotalBase),
      tempo_horas: parseFloat(resultadoCalculo.tempoTotalH),
      shopee_preco: userPlan === 'pro' ? parseFloat(resultadoCalculo.shopee.precoAnuncio) : null,
      ml_preco: userPlan === 'pro' ? parseFloat(resultadoCalculo.mercadoLivre.precoAnuncio) : null,
      tiktok_preco: userPlan === 'pro' ? parseFloat(resultadoCalculo.tikTok.precoAnuncio) : null,
      peso_g: parseFloat(resultadoCalculo.pesoOuVolumeTotal)
    }]).select();

    if (!error && data) {
      setProdutos([...produtos, data[0]]);
      alert('Produto salvo com sucesso no catálogo!');
      setAbaAtiva('produtos');
    } else {
      alert('Erro ao salvar produto.');
    }
  };

  const excluirProduto = async (id) => {
    await supabase.from('produtos').delete().eq('id', id);
    setProdutos(produtos.filter(p => p.id !== id));
  };

  const adicionarEncomenda = async (e) => {
    e.preventDefault();
    if (!novaEncomenda.cliente || !novaEncomenda.produtoNome) return;

    const qtd = parseInt(novaEncomenda.quantidade) || 1;
    const valProd = parseFloat(novaEncomenda.valorProduto) || 0;
    const taxaEntrega = parseFloat(novaEncomenda.taxaEntrega) || 0;
    const valorTotal = (qtd * valProd) + taxaEntrega;

    const { data, error } = await supabase.from('encomendas').insert([{
      user_id: session.user.id,
      cliente: novaEncomenda.cliente,
      contato: novaEncomenda.contato,
      endereco: novaEncomenda.endereco,
      produto_nome: novaEncomenda.produtoNome,
      quantidade: qtd,
      valor_total: valorTotal,
      status: novaEncomenda.status || 'Pendente',
      impressora_id: novaEncomenda.impressoraId || null,
      data: new Date().toLocaleDateString('pt-BR')
    }]).select();

    if (error) {
      alert('Erro ao gravar encomenda: Verifique o banco de dados Supabase.');
      console.error(error);
      return;
    }

    if (data) {
      if (novaEncomenda.status === 'Imprimindo' && novaEncomenda.impressoraId) {
        await supabase.from('impressoras').update({ status: 'ocupada' }).eq('id', novaEncomenda.impressoraId);
        setImpressoras(impressoras.map(i => i.id === parseInt(novaEncomenda.impressoraId) ? { ...i, status: 'ocupada' } : i));
      }

      setEncomendas([...encomendas, data[0]]);
      setNovaEncomenda({ cliente: '', contato: '', endereco: '', produtoId: '', produtoNome: '', quantidade: 1, valorProduto: '', taxaEntrega: '', status: 'Pendente', impressoraId: '' });
      alert('Encomenda registrada com sucesso!');
    }
  };

  const atualizarStatusEncomenda = async (encomendaId, novoStatus, impressoraId) => {
    try {
      const { error } = await supabase
        .from('encomendas')
        .update({ status: novoStatus })
        .eq('id', encomendaId);

      if (error) {
        console.error('Erro ao atualizar status no banco:', error);
        alert('Erro ao atualizar status da encomenda.');
        return;
      }

      setEncomendas(prev =>
        prev.map(enc => (enc.id === encomendaId ? { ...enc, status: novoStatus } : enc))
      );

      if (impressoraId) {
        const impIdNum = parseInt(impressoraId);
        const novoStatusImpressora = novoStatus === 'Imprimindo' ? 'ocupada' : 'livre';

        await supabase
          .from('impressoras')
          .update({ status: novoStatusImpressora })
          .eq('id', impIdNum);

        setImpressoras(prev =>
          prev.map(imp => (imp.id === impIdNum ? { ...imp, status: novoStatusImpressora } : imp))
        );
      }
    } catch (err) {
      console.error('Erro ao sincronizar estados:', err);
    }
  };

  const excluirEncomenda = async (id, impressoraId) => {
    await supabase.from('encomendas').delete().eq('id', id);
    if (impressoraId) {
      await supabase.from('impressoras').update({ status: 'livre' }).eq('id', impressoraId);
      setImpressoras(impressoras.map(i => i.id === impressoraId ? { ...i, status: 'livre' } : i));
    }
    setEncomendas(encomendas.filter(e => e.id !== id));
  };

const handleGerarAnuncioIA = async () => {
    const produto = produtos.find(
      p => p.id === produtoAnuncioId || p.id === parseInt(produtoAnuncioId)
    );

    if (!produto) return;

    setGerandoIA(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-listing', {
        body: {
          productName: produto.nome,
          material: detalhesAnuncio.material || produto.material || '',
          preco: produto.preco_sugerido,
          pesoG: produto.peso_g || '',
          cor: detalhesAnuncio.cor,
          alturaCm: detalhesAnuncio.alturaCm,
          larguraCm: detalhesAnuncio.larguraCm,
          profundidadeCm: detalhesAnuncio.profundidadeCm,
          acabamento: detalhesAnuncio.acabamento,
          publicoAlvo: detalhesAnuncio.publicoAlvo,
          uso: detalhesAnuncio.uso,
          diferencial: detalhesAnuncio.diferencial,
          prazoEnvio: detalhesAnuncio.prazoEnvio,
          tom: tomAnuncio,
          plataforma: plataformaAnuncio
        }
      });

      if (error) throw error;
      if (!data) throw new Error('A Edge Function não retornou dados.');
      if (data.error) throw new Error(data.error);

      let resultado = null;
      try {
        resultado = typeof data.text === 'string' ? JSON.parse(data.text) : data.text;
      } catch {
        resultado = null;
      }

      if (resultado?.titulo && resultado?.descricao) {
        const tags = Array.isArray(resultado.tags)
          ? resultado.tags.filter(tag => typeof tag === 'string').slice(0, 8)
          : [];

        const textoFormatado = [
          resultado.titulo,
          '',
          resultado.descricao,
          '',
          tags.length ? '🔎 Tags:' : '',
          ...tags.map(tag => `#${tag}`)
        ].filter((linha, index, arr) => linha !== '' || (index > 0 && arr[index - 1] !== '')).join('\n');

        setTextoAnuncioGerado(textoFormatado);
      } else if (typeof data.text === 'string') {
        setTextoAnuncioGerado(data.text);
      } else {
        throw new Error('A IA não retornou um anúncio válido.');
      }
    } catch (error) {
      console.error('Erro ao chamar IA:', error);
      showToast(
        `Erro ao gerar anúncio: ${error?.message || 'erro desconhecido'}`,
        'error'
      );
    } finally {
      setGerandoIA(false);
    }
  };
  
  const faturamentoTotal = encomendas.reduce((acc, curr) => acc + (parseFloat(curr.valor_total) || 0), 0);
  const produtoAnuncio = produtos.find(p => p.id === produtoAnuncioId || p.id === parseInt(produtoAnuncioId));

  const obterTextoPadraoAnuncio = () => {
    if (!produtoAnuncio) return '';
    return `🔥 ${produtoAnuncio.nome.toUpperCase()} - IMPRESSÃO 3D DE ALTA QUALIDADE 🔥

Produzido com tecnologia de Impressão 3D profissional, garantindo resistência e acabamento impecável. 

💰 VALORES SUGERIDOS PARA VENDA:
🛒 Venda Direta (PIX): R$ ${produtoAnuncio.preco_sugerido}
🟠 Shopee: R$ ${produtoAnuncio.shopee_preco || 'Consulte Plano PRO'}
🟡 Mercado Livre: R$ ${produtoAnuncio.ml_preco || 'Consulte Plano PRO'}
🎵 TikTok Shop: R$ ${produtoAnuncio.tiktok_preco || 'Consulte Plano PRO'}

📦 Características:
- Peso aproximado: ${produtoAnuncio.peso_g}g
- Material de alta durabilidade e ecologicamente correto
- Fabricação própria na nossa Print Farm

⚡ Envio rápido para todo o país! Dúvidas? Deixe a sua pergunta abaixo.`;
  };


  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  const app = {
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
    toast,
    setToast,
    showToast,
    fecharToast,
    onboardingOpen,
    setOnboardingOpen,
    concluirOnboarding,
    adiarOnboarding,
    dadosCarregados,
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
    atualizarHorasImpressora,
    registrarManutencao,
    LIMITES_MANUTENCAO,
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
    configuracoes,
    atualizarConfiguracao,
    resetConfiguracoes,
    supabase,
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Carregando sistema SaaS...</div>;
  }

  return (
    <AppContext.Provider value={app}>
      {session ? <DashboardLayout /> : <LandingPage />}
    </AppContext.Provider>
  );
}
