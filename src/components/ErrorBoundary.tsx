import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCcw, Home, AlertTriangle, Sparkles } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isChunkError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isChunkError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    const errorMsg = error?.message || error?.toString() || '';
    const isChunkError = 
      errorMsg.includes('Failed to fetch dynamically imported module') ||
      errorMsg.includes('Importing a module script failed') ||
      errorMsg.includes('Loading chunk');

    return { hasError: true, error, isChunkError };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Auto-reload if chunk error and not reloaded recently
    if (this.state.isChunkError) {
      const now = Date.now();
      const lastReload = parseInt(sessionStorage.getItem('mare_chunk_retry_time') || '0', 10);
      if (now - lastReload > 8000) {
        sessionStorage.setItem('mare_chunk_retry_time', now.toString());
        window.location.reload();
        return;
      }
    }

    // Log to server if API available
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        info: errorInfo,
        url: window.location.href
      })
    }).catch(() => {});
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, isChunkError: false });
    
    if (this.state.isChunkError && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (const registration of registrations) {
          registration.unregister();
        }
      }).finally(() => {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isChunk = this.state.isChunkError;

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm max-w-xl mx-auto my-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isChunk ? 'bg-mare-turquoise/10 text-mare-turquoise' : 'bg-red-50 text-red-500'}`}>
            {isChunk ? <Sparkles size={32} /> : <AlertTriangle size={32} />}
          </div>
          
          <h2 className="text-xl font-black text-mare-navy uppercase tracking-tight mb-2 text-center">
            {isChunk ? 'Nueva versión de MARÉ disponible' : 'Algo salió mal en este módulo'}
          </h2>
          
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-8 text-center max-w-md leading-relaxed">
            {isChunk 
              ? 'Se han realizado mejoras en la tienda. Haz clic en actualizar para cargar la última versión.' 
              : 'Se ha producido un error inesperado. Puedes reintentar la acción o volver al inicio.'}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={this.handleReset}
              className="flex items-center px-6 py-3 bg-mare-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-mare-navy/90 transition-all shadow-md active:scale-95"
            >
              <RefreshCcw size={16} className="mr-2" />
              {isChunk ? 'Actualizar MARÉ' : 'Reintentar'}
            </button>
            
            <button
              onClick={this.handleGoHome}
              className="flex items-center px-6 py-3 bg-white text-mare-navy border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
            >
              <Home size={16} className="mr-2" />
              Ir al Inicio
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-10 p-4 bg-gray-50 rounded-lg w-full max-w-2xl overflow-auto border border-gray-200">
              <p className="text-[10px] font-black text-red-600 mb-2 uppercase tracking-widest">Error técnico:</p>
              <pre className="text-[10px] text-gray-600 font-mono">
                {this.state.error?.toString()}
                {"\n"}
                {this.state.error?.stack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
