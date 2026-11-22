import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const styles = {
  success: {
    icon: CheckCircle2,
    wrapper: 'border-emerald-500/40 bg-emerald-950/90',
    iconColor: 'text-emerald-400'
  },
  warning: {
    icon: AlertTriangle,
    wrapper: 'border-amber-500/40 bg-amber-950/90',
    iconColor: 'text-amber-400'
  },
  error: {
    icon: XCircle,
    wrapper: 'border-rose-500/40 bg-rose-950/90',
    iconColor: 'text-rose-400'
  },
  info: {
    icon: Info,
    wrapper: 'border-indigo-500/40 bg-indigo-950/90',
    iconColor: 'text-indigo-400'
  }
};

export default function Toast() {
  const { toast, fecharToast } = useApp();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => fecharToast(), 4500);
    return () => window.clearTimeout(timer);
  }, [toast?.id]);

  if (!toast) return null;

  const config = styles[toast.type] || styles.info;
  const Icon = config.icon;

  return (
    <div className="fixed right-4 top-20 z-[90] w-[min(420px,calc(100vw-2rem))] animate-[fadeIn_.2s_ease-out]">
      <div className={`flex items-start gap-3 rounded-xl border p-4 shadow-2xl backdrop-blur ${config.wrapper}`}>
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.iconColor}`} />
        <p className="flex-1 text-sm leading-relaxed text-slate-100">{toast.message}</p>
        <button onClick={fecharToast} className="rounded-md p-1 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Fechar aviso">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
