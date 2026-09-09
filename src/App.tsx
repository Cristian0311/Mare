import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AppRoutes } from './AppRoutes';
import { AuthProvider } from './admin/contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { configService } from './services/config';

export default function App() {
  useEffect(() => {
    // Sincronizar configuración con DB al inicio
    configService.getConfig().catch(e => console.error('Error syncing config:', e));
  }, []);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ToastProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ToastProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
