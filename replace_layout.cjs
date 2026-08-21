const fs = require('fs');

const newContent = `import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  Bell
} from 'lucide-react';

const MENU_GROUPS = [
  {
    title: 'Principal',
    items: [
      { path: '/admin', icon: LayoutDashboard, label: 'Inicio', exact: true },
      { path: '/admin/pedidos', icon: ShoppingCart, label: 'Pedidos' },
      { path: '/admin/reserva', icon: Bookmark, label: 'Reservas' },
    ]
  },
  {
    title: 'Catálogo',
    items: [
      { path: '/admin/productos', icon: Package, label: 'Productos' },
      { path: '/admin/inventario', icon: Box, label: 'Inventario' },
      { path: '/admin/categorias', icon: Tags, label: 'Categorías' },
      { path: '/admin/abastecimiento', icon: RefreshCw, label: 'Abastecimiento' },
      { path: '/admin/almacen', icon: Archive, label: 'Almacén' },
    ]
  },
  {
    title: 'Ventas & Marketing',
    items: [
      { path: '/admin/promociones', icon: Tag, label: 'Promociones' },
      { path: '/admin/combos', icon: Sparkles, label: 'Combos y Ofertas' },
      { path: '/admin/mayorista', icon: Store, label: 'Mayorista' },
      { path: '/admin/precios', icon: CircleDollarSign, label: 'Precios' },
    ]
  },
  {
    title: 'Inteligencia',
    items: [
      { path: '/admin/recomendaciones', icon: Brain, label: 'Recomendaciones' },
      { path: '/admin/rentabilidad', icon: TrendingUp, label: 'Rentabilidad' },
      { path: '/admin/analitica', icon: BarChart3, label: 'Analítica' },
      { path: '/admin/automatizacion', icon: Zap, label: 'Automatización' },
    ]
  },
  {
    title: 'Clientes',
    items: [
      { path: '/admin/clientes', icon: Users, label: 'Directorio' },
      { path: '/admin/asesores', icon: Headset, label: 'Asesores' },
      { path: '/admin/whatsapp', icon: MessageCircle, label: 'WhatsApp' },
    ]
  },
  {
    title: 'Sistema',
    items: [
      { path: '/admin/envios', icon: Truck, label: 'Envíos' },
      { path: '/admin/ubicaciones', icon: MapPin, label: 'Zonas' },
      { path: '/admin/proveedores', icon: Truck, label: 'Proveedores' },
      { path: '/admin/compras', icon: ShoppingCart, label: 'Compras' },
      { path: '/admin/contenido', icon: FileText, label: 'Contenido' },
      { path: '/admin/seo', icon: Search, label: 'SEO' },
      { path: '/admin/migracion', icon: Database, label: 'Migración' },
      { path: '/admin/configuracion', icon: Settings, label: 'Ajustes' },
    ]
  }
];

const BOTTOM_NAV = [
  { path: '/admin', icon: LayoutDashboard, label: 'Inicio', exact: true },
  { path: '/admin/pedidos', icon: ShoppingCart, label: 'Pedidos' },
  { path: '/admin/productos', icon: Package, label: 'Productos' },
  { path: '/admin/clientes', icon: Users, label: 'Clientes' },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-mare-bg flex font-sans md:pb-0 pb-16">
      {/* Mobile Header */}
      <div className="md:hidden bg-mare-navy shadow-sm h-14 flex items-center justify-between px-4 fixed top-0 w-full z-30">
        <div className="font-black text-lg text-white tracking-widest flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-mare-gold text-mare-navy flex items-center justify-center text-xs shadow-sm">M</div>
          MARÉ <span className="text-xs font-bold text-mare-gold/80">ADMIN</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white relative">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-mare-navy"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-mare-gold text-mare-navy flex items-center justify-center font-black text-sm">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>

      {/* Desktop Top Bar */}
      <div className="hidden md:flex fixed top-0 right-0 left-64 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200 items-center px-8 z-20 justify-between shadow-sm">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar en el panel..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-2 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <span className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-black text-gray-400 uppercase tracking-tighter">⌘</span>
            <span className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-black text-gray-400 uppercase tracking-tighter">K</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <button className="text-gray-400 hover:text-mare-navy relative transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div className="flex items-center gap-3 pl-5 border-l border-gray-200">
            <div className="flex flex-col items-end">
              <span className="text-xs font-black text-mare-navy uppercase tracking-wider">{user.name}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.role}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-mare-gold text-mare-navy flex items-center justify-center font-black text-sm shadow-sm">
              {user.name.charAt(0)}
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
      <aside className={\`
        fixed md:static inset-y-0 left-0 z-50
        w-[280px] md:w-64 bg-mare-navy transform transition-transform duration-300 ease-in-out
        flex flex-col shadow-2xl md:shadow-none
        \${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      \`}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 shrink-0 border-b border-white/10 md:flex">
          <div className="font-black text-xl text-white tracking-widest flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-mare-gold text-mare-navy flex items-center justify-center text-sm shadow-md">M</div>
            MARÉ <span className="text-xs font-bold text-mare-gold/80">ADMIN</span>
          </div>
          <button className="md:hidden text-white/60 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
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
                        className={\`
                          flex items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all duration-200
                          \${isActive 
                            ? 'bg-white/10 text-white shadow-sm' 
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }
                        \`}
                      >
                        <item.icon size={18} className={\`mr-3 shrink-0 \${isActive ? 'text-mare-gold' : 'text-white/40'}\`} />
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
        <div className="p-4 border-t border-white/10 shrink-0">
          <button 
            onClick={logout}
            className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={18} className="mr-2 shrink-0" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-hidden flex flex-col md:h-screen md:pt-16 pt-14 relative z-10">
        <div className="flex-1 overflow-y-auto bg-mare-bg p-4 md:p-8 hide-scrollbar">
          <div className="max-w-7xl mx-auto w-full pb-8">
            <Outlet />
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
                className={\`flex flex-col items-center justify-center w-16 h-12 gap-1 rounded-xl transition-colors \${isActive ? 'text-mare-navy' : 'text-gray-400'}\`}
              >
                <item.icon size={isActive ? 22 : 20} className={isActive ? 'text-mare-navy' : ''} />
                <span className={\`text-[10px] font-bold \${isActive ? 'text-mare-navy' : ''}\`}>{item.label}</span>
              </NavLink>
            );
          })}
          
          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className={\`flex flex-col items-center justify-center w-16 h-12 gap-1 rounded-xl text-gray-400 \${isSidebarOpen ? 'text-mare-navy' : ''}\`}
          >
            <Menu size={20} />
            <span className="text-[10px] font-bold">Menú</span>
          </button>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/admin/layout/AdminLayout.tsx', newContent);
