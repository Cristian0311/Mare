import { useState, useEffect } from 'react';
import { orderService } from '../../services/orders';
import { Search, Eye, Filter, Download, DollarSign, Package, MapPin, Calendar, CheckCircle, Clock, Truck, XCircle, ChevronRight } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  const { formatPrice } = useCurrency();
  const { error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      error('Error', 'No se pudieron cargar los pedidos');
    }
    setIsLoading(false);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed': return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle, label: 'Completado' };
      case 'delivered': return { color: 'text-mare-turquoise', bg: 'bg-mare-turquoise/10', border: 'border-blue-100', icon: MapPin, label: 'Entregado' };
      case 'shipped': return { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', icon: Truck, label: 'En Camino' };
      case 'ready': return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle, label: 'Listo' };
      case 'processing': return { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', icon: Package, label: 'Preparando' };
      case 'cancelled': return { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: XCircle, label: 'Cancelado' };
      case 'pending':
      default: return { color: 'text-mare-gold', bg: 'bg-mare-gold/10', border: 'border-mare-gold/20', icon: Clock, label: 'Pendiente' };
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.telefono?.includes(searchTerm);
      
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="w-10 h-10 border-4 border-mare-navy border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sincronizando Pedidos...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-mare-navy uppercase tracking-tight">Gestión Operativa</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black text-mare-turquoise uppercase tracking-[0.2em]">Listado de Pedidos</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Flujo de Ventas</span>
          </div>
        </div>
        <button className="flex items-center rounded-2xl px-6 py-3.5 font-black uppercase tracking-widest text-[10px] bg-white text-mare-navy border border-gray-100 hover:border-mare-navy shadow-sm transition-all active:scale-95">
          <Download size={16} className="mr-2" />
          Exportar Reporte
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 md:p-8 border-b border-gray-100 bg-gray-50/30 flex flex-col xl:flex-row gap-6 justify-between items-center">
          <div className="relative w-full xl:max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-mare-turquoise transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Buscar por cliente, ID o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 py-4 border border-gray-100 bg-white rounded-2xl text-xs font-black focus:ring-4 focus:ring-mare-turquoise/5 focus:border-mare-turquoise outline-none transition-all placeholder:text-gray-200 uppercase tracking-tight"
            />
          </div>
          
          <div className="flex w-full xl:w-auto gap-4">
            <div className="relative w-full xl:w-56">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-3.5 border border-gray-100 bg-white rounded-2xl text-[9px] font-black uppercase tracking-widest text-mare-navy focus:ring-4 focus:ring-mare-turquoise/5 outline-none appearance-none cursor-pointer"
              >
                <option value="all">Todos los Estados</option>
                <option value="pending">Pendientes</option>
                <option value="processing">Preparando</option>
                <option value="ready">Listos</option>
                <option value="shipped">En Camino</option>
                <option value="delivered">Entregados</option>
                <option value="completed">Completados</option>
                <option value="cancelled">Cancelados</option>
              </select>
              <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
            </div>
            
            <div className="relative w-full xl:w-56">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-3.5 border border-gray-100 bg-white rounded-2xl text-[9px] font-black uppercase tracking-widest text-mare-navy focus:ring-4 focus:ring-mare-turquoise/5 outline-none appearance-none cursor-pointer"
              >
                <option value="all">Cualquier Fecha</option>
                <option value="today">Hoy</option>
                <option value="week">Esta Semana</option>
                <option value="month">Este Mes</option>
              </select>
              <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="p-4 md:p-8 bg-white">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order, index) => {
                const status = getStatusConfig(order.status);
                const StatusIcon = status.icon;
                
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    key={order.id} 
                    className="group flex flex-col p-6 rounded-[2rem] border border-gray-50 bg-white hover:border-mare-gold/20 hover:shadow-xl hover:shadow-gray-200/40 transition-all cursor-pointer"
                    onClick={() => navigate(`/mare0311/pedidos/${order.id}`)}
                  >
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <div className="font-mono font-black text-mare-navy uppercase tracking-tight text-base group-hover:text-mare-gold transition-colors">
                          #{order.order_number}
                        </div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                          <Calendar size={12} className="text-gray-300" />
                          {new Date(order.created_at).toLocaleDateString('es-ES', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                          {new Date(order.created_at).toLocaleTimeString('es-ES', {
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <div className={`inline-flex items-center px-4 py-2 rounded-xl border ${status.bg} ${status.border} ${status.color} shadow-sm`}>
                        <StatusIcon size={12} className="mr-2" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{status.label}</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-b border-gray-50 py-5 my-2 flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="font-black text-mare-navy text-sm uppercase tracking-tight truncate">
                          {order.customer?.nombre || 'Cliente Anónimo'}
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 mt-1.5 flex items-center gap-1.5">
                          <MapPin size={12} className="shrink-0 text-gray-300" />
                          <span className="truncate">{order.municipality?.nombre || 'Ciudad'}, {order.province?.nombre || 'Cuba'}</span>
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-mare-navy group-hover:text-white transition-all">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-mare-gold/10 text-mare-gold flex items-center justify-center shadow-sm">
                          <DollarSign size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                          <div className="font-black text-lg text-mare-navy leading-none">
                            {formatPrice(order.total_cup)}
                          </div>
                          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1.5">
                            {order.order_type === 'wholesale' ? 'Venta Mayorista' : 'Venta Retail'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex -space-x-3">
                        {(order.items || []).slice(0, 3).map((item: any, i: number) => (
                          <div key={i} className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden z-[10-i]">
                            <img src={item.product?.imagenes?.[0] || '/placeholder.png'} className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <div className="w-9 h-9 rounded-xl bg-gray-100 border border-white flex items-center justify-center text-[9px] font-black text-gray-400 z-0">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredOrders.length === 0 && (
              <div className="col-span-1 xl:col-span-2 p-16 text-center flex flex-col items-center border border-dashed border-gray-100 rounded-[2.5rem]">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-100">
                  <Package className="text-gray-200" size={32} />
                </div>
                <p className="text-xs font-black text-gray-300 uppercase tracking-[0.2em] max-w-xs leading-relaxed">
                  {searchTerm || statusFilter !== 'all' ? 'No se encontraron pedidos con los criterios seleccionados' : 'El flujo de pedidos está vacío actualmente'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
