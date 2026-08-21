import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  ArrowLeft,
  ShoppingBag,
  History,
  MessageSquare,
  Save,
  Trash2,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  UserCheck,
  Star,
  DollarSign
} from 'lucide-react';
import { customerService } from '../../services/customers';
import { orderService } from '../../services/orders';
import { Button } from '../../components/ui/Button';
import { useCurrency } from '../../contexts/CurrencyContext';

export function AdminCustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<'activity' | 'orders' | 'notes'>('activity');

  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const loadData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [customerData, statsData, ordersData] = await Promise.all([
        customerService.getCustomerById(id),
        customerService.getCustomerStats(id),
        orderService.getOrders({ customerId: id })
      ]);
      setCustomer(customerData);
      setStats(statsData);
      setOrders(ordersData.data || []);
    } catch (e) {
      console.error(e);
      alert('Error cargando los datos del cliente');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleUpdateStatus = async (status: 'active' | 'archived') => {
    if (!id) return;
    try {
      await customerService.updateCustomer(id, { status });
      await loadData();
    } catch (e) {
      alert('Error actualizando estado');
    }
  };

  const handleAddNote = async () => {
    if (!id || !newNote.trim()) return;
    setIsSaving(true);
    try {
      await customerService.addNote(id, newNote);
      setNewNote('');
      await loadData();
    } catch (e) {
      alert('Error añadiendo nota');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return null;
  }

  if (!customer) return <div>Cliente no encontrado</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/mare0311/clientes')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-mare-navy text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-mare-navy/10">
              {customer?.name?.charAt(0) || '?'}
            </div>
            <div>
              <h1 className="text-xl font-black text-mare-navy uppercase tracking-tight">{customer.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                  customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {customer.status === 'active' ? 'ACTIVO' : 'ARCHIVADO'}
                </span>
                {stats.wholesaleCount > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-700 uppercase tracking-widest">
                    MAYORISTA
                  </span>
                )}
                {stats.totalOrders >= 5 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-700 uppercase tracking-widest">
                    FRECUENTE
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {customer.status === 'active' ? (
            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus('archived')}>
              <Trash2 className="h-4 w-4 mr-2" />
              Archivar
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus('active')}>
              <UserCheck className="h-4 w-4 mr-2" />
              Reactivar
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={() => window.open(`https://wa.me/${customer.whatsapp || customer.phone}`, '_blank')}>
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 border border-gray-100 p-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Información de Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                  <Phone className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Teléfono</p>
                  <p className="text-sm font-bold text-mare-navy">{customer.phone}</p>
                </div>
              </div>
              
              {customer.email && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Email</p>
                    <p className="text-sm font-bold text-mare-navy break-all">{customer.email}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                  <MapPin className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Ubicación</p>
                  <p className="text-sm font-bold text-mare-navy">
                    {customer.province || 'Provincia no def.'}
                    {customer.municipality && `, ${customer.municipality}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-gray-50">
                <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Miembro desde</p>
                  <p className="text-sm font-bold text-mare-navy">{new Date(customer.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 border border-gray-100 p-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Asesor Asignado</h3>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-mare-navy/5 text-mare-navy flex items-center justify-center font-bold text-xs uppercase tracking-tighter">
                {customer.advisor?.name?.charAt(0) || '?'}
              </div>
              <div className="flex-grow">
                <p className="text-xs font-bold text-mare-navy">{customer.advisor?.name || 'Sin asignar'}</p>
              </div>
              <Button size="sm" variant="ghost" className="p-1 h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Pedidos</p>
              <p className="text-xl font-black text-mare-navy uppercase tracking-tight">{stats.totalOrders}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Comprado</p>
              <p className="text-xl font-black text-mare-navy uppercase tracking-tight">{formatPrice(stats.totalSpent)}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Promedio</p>
              <p className="text-xl font-black text-mare-navy uppercase tracking-tight">{formatPrice(stats.avgOrder)}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mayorista</p>
              <p className="text-xl font-bold text-purple-600">{stats.wholesaleCount}</p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button 
              onClick={() => setActiveTab('activity')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'activity' ? 'bg-white text-mare-navy shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}
            >
              Actividad
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'orders' ? 'bg-white text-mare-navy shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}
            >
              Pedidos ({orders.length})
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'notes' ? 'bg-white text-mare-navy shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}
            >
              Notas
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 border border-gray-100 overflow-hidden">
            {activeTab === 'activity' && (
              <div className="p-6 space-y-6">
                <h3 className="font-bold text-mare-navy flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Resumen de Comportamiento
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Última Compra</p>
                    {stats.lastOrder ? (
                      <div>
                        <p className="text-sm font-bold text-mare-navy">{new Date(stats.lastOrder.created_at).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{formatPrice(stats.lastOrder.total_cup)}</p>
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-gray-400 italic">No hay pedidos registrados</p>
                    )}
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Estado Comercial</p>
                    {stats.totalOrders > 0 ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-bold text-mare-navy">Activo Recurrente</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-bold text-gray-400">Prospecto</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
                  <p className="text-xs font-bold text-amber-800 mb-1 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Observación Automática
                  </p>
                  <p className="text-xs text-amber-700">
                    {stats.totalOrders > 3 
                      ? 'Este cliente tiene un alto valor de vida (LTV). Priorizar atención personalizada.' 
                      : 'Cliente en fase de captación. Un seguimiento oportuno podría convertirlo en recurrente.'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No hay pedidos para mostrar.</p>
                  </div>
                ) : (
                  orders.map(order => (
                    <div 
                      key={order.id} 
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between group"
                      onClick={() => navigate(`/mare0311/pedidos/${order.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-mare-navy group-hover:text-white transition-colors">
                          <ShoppingBag size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-mare-navy">Pedido {order.order_number}</p>
                          <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="text-sm font-bold text-mare-navy">{formatPrice(order.total_cup)}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{order.status}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-mare-navy" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <textarea 
                      className="flex-grow p-4 bg-gray-50 rounded-xl border border-gray-100 focus:bg-white focus:ring-2 focus:ring-mare-navy/5 outline-none transition-all text-sm font-medium h-24"
                      placeholder="Escribe una nota administrativa..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      variant="primary" 
                      onClick={handleAddNote} 
                      disabled={!newNote.trim() || isSaving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Añadir Nota
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Historial de Notas</h4>
                  {customer.notes?.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No hay notas registradas.</p>
                  ) : (
                    customer.notes?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((note: any) => (
                      <div key={note.id} className="p-4 bg-gray-50 rounded-xl border border-gray-50">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.note}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">
                            {new Date(note.created_at).toLocaleString()}
                          </p>
                          <p className="text-[10px] font-black text-mare-navy uppercase">Admin</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
