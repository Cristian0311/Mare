import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCcw, Home, AlertTriangle, Sparkles } from 'lucide-react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error: Error | null; isChunkError: boolean; }

const isChunkFailure = (error: any) => {
  const message = error?.message || String(error || '');
  return /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk/i.test(message);
};

const hardReset = async () => {
  try { sessionStorage.removeItem('mare_chunk_retry_time'); } catch {}
  try { localStorage.removeItem('mare-admin-session'); } catch {}
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
    }
  } catch {}
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.unregister()));
    }
  } catch {}
  const url = new URL('/', window.location.origin);
  url.searchParams.set('mare_refresh', String(Date.now()));
  window.location.replace(url.toString());
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, isChunkError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isChunkError: isChunkFailure(error) };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MARÉ runtime error:', error, errorInfo);
    try {
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: error.message, stack: error.stack, info: errorInfo, url: window.location.href })
      }).catch(() => {});
    } catch {}
  }

  private retry = () => {
    window.location.reload();
  };

  private reset = () => {
    void hardReset();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    const isChunk = this.state.isChunkError;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isChunk ? 'bg-mare-turquoise/10 text-mare-turquoise' : 'bg-red-50 text-red-500'}`}>
          {isChunk ? <Sparkles size={32} /> : <AlertTriangle size={32} />}
        </div>
        <h2 className="text-xl font-black text-mare-navy uppercase tracking-tight mb-3">
          {isChunk ? 'Nueva versión de MARÉ disponible' : 'Error al iniciar MARÉ'}
        </h2>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-8 max-w-md leading-relaxed">
          {isChunk
            ? 'La aplicación necesita cargar una versión actualizada.'
            : 'Puedes reintentar o abrir el inicio limpio de la aplicación.'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={this.retry} className="flex items-center px-6 py-3 bg-mare-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">
            <RefreshCcw size={16} className="mr-2" />
            {isChunk ? 'Actualizar MARÉ' : 'Reintentar'}
          </button>
          <a href="/?mare_reset=1790656346836" className="flex items-center px-6 py-3 bg-white text-mare-navy border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
            <Home size={16} className="mr-2" />
            Ir al Inicio
          </a>
          <button type="button" onClick={this.reset} className="px-6 py-3 bg-gray-50 text-gray-500 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest">
            Restablecer aplicación
          </button>
        </div>
      </div>
    );
  }
}
