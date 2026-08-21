import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  ShoppingBag,
  Star,
  UserPlus,
  UserMinus,
  MessageSquare
} from 'lucide-react';
import { customerService } from '../../services/customers';
import { Button } from '../../components/ui/Button';
import { useCurrency } from '../../contexts/CurrencyContext';

export function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'archived'>('active');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 20;

  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const { data, count } = await customerService.getCustomers({
        search: searchTerm || undefined,
        status: statusFilter,
        segment: segmentFilter !== 'all' ? segmentFilter as any : undefined,
        page,
        limit
      });
      setCustomers(data || []);
      setTotalCount(count || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [statusFilter, segmentFilter, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
      else loadCustomers();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-mare-navy uppercase tracking-tight">CRM de Clientes</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Gestión de relaciones comerciales y fidelización.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
            {totalCount} Clientes
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mare-navy/10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none min-w-[120px]"
            >
              <option value="active">Activos</option>
              <option value="archived">Archivados</option>
            </select>
            
            <select
              value={segmentFilter}
              onChange={(e) => { setSegmentFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none min-w-[140px]"
            >
              <option value="all">Todos los segmentos</option>
              <option value="new">Nuevos (30d)</option>
              <option value="frequent">Frecuentes</option>
              <option value="wholesale">Mayoristas</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? null : customers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron clientes con estos filtros.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4 hidden md:table-cell">Contacto</th>
                  <th className="px-6 py-4 hidden lg:table-cell">Ubicación</th>
                  <th className="px-6 py-4">Actividad</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {customers.map(customer => (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/mare0311/clientes/${customer.id}`)}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-mare-navy/5 text-mare-navy flex items-center justify-center font-bold text-sm shrink-0">
                          {customer.nombre?.charAt(0) || customer.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-bold text-mare-navy group-hover:text-mare-navy transition-colors">
                            {customer.nombre || customer.name}
                          </div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">
                            ID: {customer.id.slice(0, 8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <Phone className="h-3 w-3 mr-1.5 text-gray-400" />
                          {customer.telefono || customer.phone}
                        </div>
                        {customer.email && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Mail className="h-3 w-3 mr-1.5 text-gray-400" />
                            {customer.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden lg:table-cell">
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="h-3 w-3 mr-1.5 text-gray-400" />
                        {customer.province || 'No definida'}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <Calendar className="h-3 w-3 mr-1.5 text-gray-400" />
                          Último: {customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : 'Nunca'}
                        </div>
                        {customer.status === 'archived' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 uppercase tracking-widest w-fit">
                            Archivado
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-mare-navy transition-colors inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Página {page} de {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1 || isLoading}
                onClick={(e) => { e.stopPropagation(); setPage(p => p - 1); }}
              >
                Anterior
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page === totalPages || isLoading}
                onClick={(e) => { e.stopPropagation(); setPage(p => p + 1); }}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
