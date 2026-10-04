import React from 'react';
import { useApp } from '../context/AppContext';
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

export default function FeedbackForm() {
  const { session, formFeedback, setFormFeedback, feedbackSucesso, enviarFeedback } = useApp();
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <MessageSquare className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-bold text-white">Enviar Sugestão ou Relatar um Erro</h3>
      </div>
      <p className="text-xs text-slate-400">
        Suas mensagens e sugestões são enviadas diretamente para os desenvolvedores da plataforma.
      </p>

      {feedbackSucesso && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg text-xs font-semibold">
          {feedbackSucesso}
        </div>
      )}

      <form onSubmit={enviarFeedback} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300">Tipo de Mensagem</label>
            <select 
              value={formFeedback.tipo} 
              onChange={e => setFormFeedback({ ...formFeedback, tipo: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 mt-1 focus:outline-none focus:border-indigo-500"
            >
              <option value="sugestao">Sugestão de Melhoria</option>
              <option value="bug">Relatar Erro / Bug</option>
              <option value="duvida">Dúvida ou Outro</option>
            </select>
          </div>

          {!session && (
            <div>
              <label className="text-xs font-semibold text-slate-300">Seu E-mail (Opcional)</label>
              <input 
                type="email" 
                placeholder="seu@email.com" 
                value={formFeedback.email} 
                onChange={e => setFormFeedback({ ...formFeedback, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white mt-1 focus:outline-none focus:border-indigo-500" 
              />
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300">Sua Mensagem *</label>
          <textarea 
            required 
            rows={3} 
            placeholder="Descreva aqui sua idéia, sugestão de recurso ou problema que você encontrou..." 
            value={formFeedback.mensagem} 
            onChange={e => setFormFeedback({ ...formFeedback, mensagem: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white mt-1 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button 
          type="submit" 
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-lg text-xs transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Send className="w-3.5 h-3.5" /> Enviar Mensagem
        </button>
      </form>
    </div>
  
  );
}
