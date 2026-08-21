import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Truck,
  Bookmark,
  ShoppingCart,
  Users,
  MapPin,
  Headset,
  MessageCircle,
  CircleDollarSign,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  Database,
  BarChart3,
  Box,
  RefreshCw,
  Tag,
  Sparkles,
  Brain,
  Zap,
  TrendingUp,
  Store,
  Archive,
  ChevronRight,
  Bell,
  Image,
  ShoppingBag
} from 'lucide-react';

const MENU_GROUPS = [
  {
    title: 'Operaciones',
    items: [
      { path: '/mare0311', icon: LayoutDashboard, label: 'Resumen', exact: true },
      { path: '/mare0311/pedidos', icon: ShoppingCart, label: 'Pedidos' },
      { path: '/mare0311/productos', icon: Package, label: 'Productos' },
      { path: '/mare0311/inventario', icon: Archive, label: 'Inventario' },
      { path: '/mare0311/categorias', icon: Tags, label: 'Categorías' },
    ]
  },
  {
    title: 'Comercial',
    items: [
      { path: '/mare0311/clientes', icon: Users, label: 'Clientes' },
      { path: '/mare0311/asesores', icon: Headset, label: 'Asesores' },
      { path: '/mare0311/mayoristas', icon: CircleDollarSign, label: 'Mayoristas' },
    ]
  },
  {
    title: 'Logística',
    items: [
      { path: '/mare0311/entregas', icon: Truck, label: 'Entregas' },
      { path: '/mare0311/zonas', icon: MapPin, label: 'Zonas' },
    ]
  },
  {
    title: 'Sistema',
    items: [
      { path: '/mare0311/contenido', icon: FileText, label: 'Contenido' },
      { path: '/mare0311/whatsapp', icon: MessageCircle, label: 'WhatsApp' },
      { path: '/mare0311/precios', icon: CircleDollarSign, label: 'Precios/Moneda' },
      { path: '/mare0311/configuracion', icon: Settings, label: 'Ajustes' },
    ]
  }
];

const BOTTOM_NAV = [
  { path: '/mare0311', icon: LayoutDashboard, label: 'Inicio', exact: true },
  { path: '/mare0311/pedidos', icon: ShoppingCart, label: 'Pedidos' },
  { path: '/mare0311/productos', icon: Package, label: 'Productos' },
];

export function AdminLayout() {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showForcedEntry, setShowForcedEntry] = useState(false);

  // Safety timer for internal loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) setShowForcedEntry(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleForcedLogout = () => {
    localStorage.removeItem('mare-admin-session');
    window.location.href = '/mare0311/login';
  };

  if (isLoading && !showForcedEntry) {
    return (
      <div className="min-h-screen bg-mare-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-mare-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isLoading && showForcedEntry) {
    return (
      <div className="min-h-screen bg-mare-bg flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 shadow-xl text-center border border-gray-100">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <X size={32} />
          </div>
          <h2 className="text-xl font-black text-mare-navy uppercase tracking-tight mb-2">Error de Conexión</h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            La verificación de acceso está tardando más de lo normal. Esto puede deberse a una sesión corrupta o problemas de red.
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-mare-navy text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-mare-navy/20 active:scale-95 transition-all"
            >
              Reintentar Carga
            </button>
            <button 
              onClick={handleForcedLogout}
              className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-gray-100 active:scale-95 transition-all"
            >
              Limpiar Sesión y Salir
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-mare-bg flex items-center justify-center">
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Redirigiendo...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mare-bg flex font-sans md:pb-0 pb-16">
      {/* Mobile Header */}
      <div className="md:hidden bg-mare-navy shadow-sm h-14 flex items-center justify-between px-4 fixed top-0 w-full z-30">
        <div className="font-black text-lg text-white tracking-widest flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-mare-gold text-mare-navy flex items-center justify-center text-xs shadow-sm">M</div>
          MARÉ <span className="text-xs font-bold text-mare-gold/80">ADMIN</span>
        </div>
        <div className="flex items-center gap-2">
          <NavLink 
            to="/" 
            className="flex items-center gap-1 px-2.5 py-1 bg-mare-gold/20 text-mare-gold rounded-lg text-[9px] font-black uppercase tracking-wider border border-mare-gold/30 hover:bg-mare-gold hover:text-mare-navy transition-all"
          >
            <Store size={12} />
            Tienda
          </NavLink>
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white relative">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-mare-navy"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-mare-gold text-mare-navy flex items-center justify-center font-black text-sm uppercase">
            {user?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>

      {/* Desktop Top Bar */}
      <div className="hidden md:flex fixed top-0 right-0 left-64 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 items-center px-8 z-20 justify-between shadow-sm">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mare-turquoise transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Buscar..."
            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-bold focus:bg-white focus:ring-4 focus:ring-mare-turquoise/5 focus:border-mare-turquoise outline-none transition-all placeholder:text-gray-300"
          />
        </div>
        <div className="flex items-center gap-6">
          <NavLink 
            to="/" 
            className="flex items-center gap-2 px-4 py-2 bg-mare-navy text-white hover:bg-mare-navy/90 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] shadow-lg shadow-mare-navy/10 transition-all active:scale-95"
          >
            <Store size={14} />
            Tienda Pública
          </NavLink>
          
          <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
            <button className="text-gray-400 hover:text-mare-navy relative transition-colors group">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-mare-gold rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-mare-navy uppercase tracking-tight">{user?.name || 'Admin'}</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">En línea</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 text-mare-navy flex items-center justify-center font-black text-xs uppercase shadow-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-mare-navy/80 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-[280px] md:w-64 bg-mare-navy transform transition-transform duration-300 ease-in-out
        flex flex-col shadow-2xl md:shadow-none border-r border-white/5
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 shrink-0 md:flex border-b border-white/5">
          <div className="font-black text-xl text-white tracking-[0.15em] flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white text-mare-navy flex items-center justify-center text-xs shadow-md font-black">M</div>
            MARÉ <span className="text-[10px] font-black text-mare-gold tracking-widest opacity-80">ADMIN</span>
          </div>
          <button className="md:hidden text-white/40 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        {/* Sidebar Menu */}
        <div className="flex-1 overflow-y-auto py-4 hide-scrollbar">
          <nav className="space-y-6 px-4">
            {MENU_GROUPS.map((group, groupIdx) => (
              <div key={groupIdx}>
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2 mb-2">
                  {group.title}
                </h4>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = item.exact 
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`
                          flex items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all duration-200
                          ${isActive 
                            ? 'bg-white/10 text-white shadow-sm' 
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }
                        `}
                      >
                        <item.icon size={18} className={`mr-3 shrink-0 ${isActive ? 'text-mare-gold' : 'text-white/40'}`} />
                        {item.label}
                        {isActive && <ChevronRight size={14} className="ml-auto opacity-50 text-mare-gold" />}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 px-6 border-t border-white/5 shrink-0 bg-white/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-mare-gold text-mare-navy flex items-center justify-center font-black text-sm uppercase shadow-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase tracking-tight leading-none">{user?.name || 'Administrador'}</span>
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.1em] mt-1">{user?.role || 'Admin'}</span>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 flex items-center justify-center transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-hidden flex flex-col md:h-screen md:pt-16 pt-14 relative z-10">
        <div className="flex-1 overflow-y-auto bg-mare-bg p-4 md:p-8 hide-scrollbar">
          <div className="max-w-7xl mx-auto w-full pb-8">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-5px_20px_-15px_rgba(0,0,0,0.1)] z-30 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {BOTTOM_NAV.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={`flex flex-col items-center justify-center w-16 h-12 gap-1 rounded-xl transition-colors ${isActive ? 'text-mare-navy' : 'text-gray-400'}`}
              >
                <item.icon size={isActive ? 22 : 20} className={isActive ? 'text-mare-navy' : ''} />
                <span className={`text-[10px] font-bold ${isActive ? 'text-mare-navy' : ''}`}>{item.label}</span>
              </NavLink>
            );
          })}
          
          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className={`flex flex-col items-center justify-center w-16 h-12 gap-1 rounded-xl text-gray-400 ${isSidebarOpen ? 'text-mare-navy' : ''}`}
          >
            <Menu size={20} />
            <span className="text-[10px] font-bold">Menú</span>
          </button>
        </div>
      </div>
    </div>
  );
}
