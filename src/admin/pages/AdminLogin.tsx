import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, User } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Error', 'Por favor ingresa usuario y contraseña');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/mare0311');
    } else {
      error('Acceso denegado', 'Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center flex flex-col items-center">
        <div className="w-16 h-16 mb-3 rounded-full bg-gradient-to-br from-[#0F1B2E] to-[#060A12] border border-white/10 shadow-lg flex items-center justify-center overflow-hidden p-0">
          <img src="/icon.svg" alt="MARÉ" className="w-full h-full object-cover rounded-full" />
        </div>
        <h1 className="text-3xl font-black text-mare-navy tracking-widest">MARÉ<span className="text-mare-gold">.</span></h1>
        <p className="text-xs text-mare-turquoise font-extrabold uppercase tracking-widest mt-0.5">Panel Administrativo</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Usuario o Correo
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-mare-blue focus:border-mare-blue h-10 border px-3"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-mare-blue focus:border-mare-blue h-10 border px-3"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mare-blue hover:bg-mare-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mare-blue transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
            
            <div className="text-xs text-center text-gray-400 mt-4">
              Use "admin" y "admin" para acceder en esta fase.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
