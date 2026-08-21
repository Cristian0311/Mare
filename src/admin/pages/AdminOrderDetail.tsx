import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, MapPin, Package, Clock, CheckCircle, 
  XCircle, Truck, Calendar, MessageSquare, Save, AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { orderService } from '../../services/orders';
import { Button } from '../../components/ui/Button';
import { useCurrency } from '../../contexts/CurrencyContext';

export function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  useEffect(() => {
    if (id) {
      loadOrder(id);
    }
  }, [id]);

  const loadOrder = async (orderId: string) => {
    setIsLoading(true);
    try {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
      setInternalNotes(data.internal_notes || '');
    } catch (e) {
      console.error(e);
      alert('Error cargando el pedido');
      navigate('/mare0311/pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (updates: any) => {
    if (!order) return;
    
    setIsUpdating(true);
    try {
      await orderService.updateOrder(order.id, updates);
      await loadOrder(order.id);
    } catch (e) {
      console.error(e);
      alert('Error actualizando el pedido');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    
    if (newStatus === 'cancelled' && !window.confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
      return;
    }
    
    await handleUpdate({ status: newStatus });
  };

  const handleSaveInternalNotes = async () => {
    if (!order) return;
    setIsSavingNotes(true);
    try {
      await handleUpdate({ internal_notes: internalNotes });
    } finally {
      setIsSavingNotes(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'pending': return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Nuevo' };
      case 'confirmed': return { icon: CheckCircle, color: 'text-mare-turquoise', bg: 'bg-mare-turquoise/10', border: 'border-mare-turquoise/30', label: 'Confirmado' };
      case 'processing': return { icon: Package, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', label: 'En Preparación' };
      case 'ready': return { icon: CheckCircle, color: 'text-mare-green', bg: 'bg-mare-green/10', border: 'border-mare-green/30', label: 'Listo' };
      case 'delivered': return { icon: Truck, color: 'text-gray-500', bg: 'bg-gray-100', border: 'border-gray-200', label: 'Entregado' };
      case 'cancelled': return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', label: 'Cancelado' };
      default: return { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', label: status };
    }
  };

  if (isLoading) {
    return null;
  }

  if (!order) return null;

  const statusInfo = getStatusConfig(order.status);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/mare0311/pedidos')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-mare-navy uppercase tracking-tight flex items-center gap-3">
            {order.order_number}
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} flex items-center`}>
              <statusInfo.icon className="w-3.5 h-3.5 mr-1.5" />
              {statusInfo.label}
            </span>
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            {new Date(order.created_at).toLocaleString('es-ES', { 
              dateStyle: 'long', timeStyle: 'short' 
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Productos e Importes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 font-medium text-mare-navy flex justify-between">
              <span>Productos ({order.items?.length || 0})</span>
              {order.order_type === 'wholesale' && (
                <span className="text-mare-turquoise bg-mare-turquoise/20 px-2 py-0.5 rounded text-xs font-bold tracking-wider">MAYORISTA</span>
              )}
            </div>
            <div className="divide-y divide-gray-100">
              {order.items?.map((item: any) => (
                <div key={item.id} className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-mare-navy">{item.product_name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {formatPrice(item.unit_price_cup)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="font-bold text-mare-navy">
                    {formatPrice(item.subtotal_cup)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Totales */}
            <div className="p-4 bg-gray-50/50 space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal_cup)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Entrega</span>
                <span>{formatPrice(order.delivery_fee_cup)}</span>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-lg text-mare-navy">
                <span>Total</span>
                <span>{formatPrice(order.total_cup)}</span>
              </div>
            </div>
          </div>
          
          {/* Internal Notes */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-mare-navy flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                Notas Internas (Solo Admin)
              </h3>
              <Button 
                size="sm" 
                variant="primary" 
                onClick={handleSaveInternalNotes}
                disabled={isSavingNotes || isUpdating}
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>
            <textarea
              className="w-full h-32 p-4 bg-gray-50 rounded-xl border border-gray-100 focus:bg-white focus:ring-2 focus:ring-mare-navy/5 outline-none transition-all text-sm font-medium"
              placeholder="Añade notas que solo los administradores podrán ver..."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
            />
          </div>
          
          {/* Change Status Area */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 border border-gray-100 p-6">
            <h3 className="font-bold text-mare-navy mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-gray-400" />
              Gestión de Estado
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={order.status === 'pending' ? 'primary' : 'outline'} 
                onClick={() => handleStatusChange('pending')}
                disabled={isUpdating}
                size="sm"
              >
                Nuevo
              </Button>
              <Button 
                variant={order.status === 'confirmed' ? 'primary' : 'outline'} 
                onClick={() => handleStatusChange('confirmed')}
                disabled={isUpdating}
                size="sm"
              >
                Confirmar
              </Button>
              <Button 
                variant={order.status === 'processing' ? 'primary' : 'outline'} 
                onClick={() => handleStatusChange('processing')}
                disabled={isUpdating}
                size="sm"
              >
                En Preparación
              </Button>
              <Button 
                variant={order.status === 'ready' ? 'primary' : 'outline'} 
                onClick={() => handleStatusChange('ready')}
                disabled={isUpdating}
                size="sm"
              >
                Listo
              </Button>
              <Button 
                variant={order.status === 'delivered' ? 'primary' : 'outline'} 
                onClick={() => handleStatusChange('delivered')}
                disabled={isUpdating}
                size="sm"
              >
                Entregado
              </Button>
              <Button 
                variant={order.status === 'cancelled' ? 'primary' : 'outline'} 
                onClick={() => handleStatusChange('cancelled')}
                disabled={isUpdating}
                className="!text-red-500 border-red-200 hover:bg-red-50"
                size="sm"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Detalles de cliente y envío */}
        <div className="space-y-6">
          {/* Cliente */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 border border-gray-100 p-6">
            <div className="flex items-center gap-2 font-bold text-mare-navy mb-4 pb-2 border-b border-gray-100">
              <User className="h-5 w-5 text-gray-400" />
              Cliente
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nombre</p>
                <div 
                  className="font-medium text-mare-navy cursor-pointer hover:text-mare-navy transition-colors flex items-center justify-between group"
                  onClick={() => order.customer_id && navigate(`/mare0311/clientes/${order.customer_id}`)}
                >
                  {order.customer?.nombre || order.customer?.name || 'No disponible'}
                  <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-mare-navy" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Teléfono</p>
                <p className="font-medium text-mare-navy">{order.customer?.telefono || order.customer?.phone || 'No disponible'}</p>
              </div>
              {order.customer?.whatsapp && order.customer.whatsapp !== (order.customer.telefono || order.customer.phone) && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">WhatsApp</p>
                  <p className="font-medium text-mare-navy">{order.customer.whatsapp}</p>
                </div>
              )}
              
              <Button 
                className="w-full mt-2" 
                variant="outline"
                onClick={() => window.open(`https://wa.me/${order.customer?.whatsapp || order.customer?.telefono || order.customer?.phone}`, '_blank')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contactar por WhatsApp
              </Button>
            </div>
          </div>

          {/* Entrega */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 border border-gray-100 p-6">
            <div className="flex items-center gap-2 font-bold text-mare-navy mb-4 pb-2 border-b border-gray-100">
              <MapPin className="h-5 w-5 text-gray-400" />
              Entrega
            </div>
            <div className="space-y-3">
              {order.province && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Provincia</p>
                  <p className="font-medium text-mare-navy">{order.province.nombre || order.province.name}</p>
                </div>
              )}
              {order.municipality && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Municipio</p>
                  <p className="font-medium text-mare-navy">{order.municipality.nombre || order.municipality.name}</p>
                </div>
              )}
              {order.address && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dirección / Punto</p>
                  <p className="font-medium text-mare-navy text-sm whitespace-pre-wrap">{order.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Observaciones */}
          {order.customer_notes && (
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 border border-gray-100 p-6">
              <div className="flex items-center gap-2 font-bold text-mare-navy mb-4 pb-2 border-b border-gray-100">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                Notas del Cliente
              </div>
              <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                {order.customer_notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
