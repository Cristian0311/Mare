import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AppRoutes } from './AppRoutes';
import { AuthProvider } from './admin/contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
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
