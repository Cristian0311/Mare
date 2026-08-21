import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credenciales mockeadas por ahora
const MOCK_USER: AdminUser = {
  id: '1',
  name: 'Administrador MARÉ',
  email: 'admin@mare.cu',
  role: 'SUPER_ADMIN',
  active: true
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Safety Timeout: Forzar fin de carga tras 5 segundos pase lo que pase
    const safetyTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Auth check taking too long, forcing load completion...');
        setIsLoading(false);
      }
    }, 5000);

    const checkSession = () => {
      console.log('AuthProvider: Initializing session check...');
      try {
        const storedUser = localStorage.getItem('mare-admin-session');
        if (storedUser) {
          console.log('AuthProvider: Found stored session');
          const parsed = JSON.parse(storedUser);
          if (parsed && typeof parsed === 'object') {
            setUser(parsed);
            console.log('AuthProvider: User session restored:', parsed.email);
          }
        } else {
          console.log('AuthProvider: No stored session found');
        }
      } catch (e) {
        console.error('AuthProvider: Failed to parse admin session:', e);
        localStorage.removeItem('mare-admin-session');
      } finally {
        console.log('AuthProvider: Loading completed');
        setIsLoading(false);
        clearTimeout(safetyTimeout);
      }
    };

    checkSession();
    return () => clearTimeout(safetyTimeout);
  }, []);

  useEffect(() => {
    // Redirigir a login si no hay sesión y está en /mare0311
    if (!isLoading && !user && location.pathname.toLowerCase().startsWith('/mare0311')) {
      console.log('AuthProvider: No user, redirecting to login from', location.pathname);
      if (location.pathname !== '/mare0311/login') {
        navigate('/mare0311/login', { replace: true });
      }
    }
  }, [user, isLoading, location.pathname, navigate]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Hardcoded credentials para esta fase. 
    // ADVERTENCIA: En un entorno real debe usar un backend seguro.
    if (email === 'admin' && password === 'admin') {
      setUser(MOCK_USER);
      localStorage.setItem('mare-admin-session', JSON.stringify(MOCK_USER));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mare-admin-session');
    navigate('/mare0311/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
