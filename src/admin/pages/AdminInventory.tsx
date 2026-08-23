import { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { 
  Package, 
  Search, 
  Filter, 
  ChevronRight, 
  Plus, 
  Minus, 
  History, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Box,
  Truck,
  ImageIcon
} from 'lucide-react';
import { inventoryService } from '../../services/inventory';
import { productService } from '../../services/products';
import { Button } from '../../components/ui/Button';
import { useCurrency } from '../../contexts/CurrencyContext';

export function AdminInventory() {
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustData, setAdjustData] = useState({ quantity: 0, type: 'entry' as any, reason: '' });
  
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [movements, setMovements] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const { formatPrice } = useCurrency();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [products, inventoryStats] = await Promise.all([
        productService.getProducts(),
        inventoryService.getInventoryStats()
      ]);

      // Enhance products with inventory data
      const enrichedProducts = products.map(p => ({
        ...p,
        stockAvailable: p.stock_tracking ? (p.stock_quantity || 0) : null
      }));

      setItems(enrichedProducts);
      setStats(inventoryStats);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistory = async (productId: string) => {
    setIsHistoryLoading(true);
    try {
      const { data } = await inventoryService.getMovements({ productId, limit: 50 });
      setMovements(data || []);
      setShowHistoryModal(true);
    } catch (e) {
      alert('Error cargando historial');
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter === 'low_stock') return matchesSearch && item.availability_status === 'low_stock';
    if (statusFilter === 'out_of_stock') return matchesSearch && item.available === false;
    if (statusFilter === 'tracking') return matchesSearch && item.stock_tracking;
    
    return matchesSearch;
  });

  const handleAdjustStock = async () => {
    if (!selectedProduct || !adjustData.reason) return;
    
    try {
      await inventoryService.adjustStock({
        productId: selectedProduct.id,
        quantity: adjustData.quantity,
        type: adjustData.type,
        reason: adjustData.reason
      });
      setShowAdjustModal(false);
      setAdjustData({ quantity: 0, type: 'entry', reason: '' });
      loadData();
    } catch (e) {
      alert('Error ajustando inventario');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-mare-navy tracking-tight">Gestión de Inventario</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Control de existencias y movimientos físicos.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button 
            onClick={loadData}
            className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-black uppercase tracking-widest transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
          <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-2">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-mare-navy leading-none mb-1">{stats?.available || 0}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Disponibles</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-2">
            <AlertTriangle size={16} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-mare-navy leading-none mb-1">{stats?.low_stock || 0}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Bajo</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
          <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-2">
            <Package size={16} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-mare-navy leading-none mb-1">{stats?.out_of_stock || 0}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Agotados</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
          <div className="w-8 h-8 rounded-full bg-mare-turquoise/10 text-mare-turquoise flex items-center justify-center mb-2">
            <RefreshCw size={16} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-mare-navy leading-none mb-1">{stats?.total_items || 0}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Productos</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-mare-navy/10 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-mare-navy/10 w-full md:w-auto"
            >
              <option value="all">Todos los estados</option>
              <option value="tracking">Con seguimiento</option>
              <option value="low_stock">Stock Bajo</option>
              <option value="out_of_stock">Agotado</option>
            </select>
          </div>
        </div>

        <div className="flex-1 bg-gray-50/30">
          {/* Header Row (Desktop only) */}
          <div className="hidden md:flex items-center px-6 py-4 border-b border-gray-100 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <div className="flex-1">Producto</div>
            <div className="w-24 text-center">Físico</div>
            <div className="w-24 text-center">Disponible</div>
            <div className="w-28 text-center">Estado</div>
            <div className="w-24 text-right">Acciones</div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-mare-navy border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Box className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Sin resultados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Producto</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">SKU</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Físico</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Disponible</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Estado</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                            {item.imagenes?.[0] ? (
                              <img src={item.imagenes[0]} alt={item.nombre} className="h-full w-full object-cover" />
                            ) : (
                              <ImageIcon size={14} className="text-gray-300" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-mare-navy truncate max-w-[200px] leading-tight">{item.nombre}</div>
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tight mt-0.5">
                              {item.categoriaNombre || 'Sin Categoría'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <code className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded-lg text-gray-500 uppercase tracking-tighter">
                          {item.sku || '---'}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-center font-black text-gray-600">
                        {item.stock_tracking ? item.stock_quantity : '∞'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.stock_tracking ? (
                          <span className={`font-black ${item.stockAvailable <= 0 ? 'text-red-500' : item.stockAvailable <= item.low_stock_threshold ? 'text-amber-500' : 'text-green-600'}`}>
                            {item.stockAvailable}
                          </span>
                        ) : (
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">Activo</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          item.available !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.available !== false ? 'Disponible' : 'Agotado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          {item.stock_tracking && (
                            <button 
                              onClick={() => {
                                setSelectedProduct(item);
                                setShowAdjustModal(true);
                              }}
                              className="p-2 text-gray-400 hover:text-mare-navy hover:bg-white hover:shadow-sm rounded-xl transition-all"
                              title="Ajustar Stock"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              setSelectedProduct(item);
                              loadHistory(item.id);
                            }}
                            className="p-2 text-gray-400 hover:text-mare-navy hover:bg-white hover:shadow-sm rounded-xl transition-all"
                            title="Historial"
                          >
                            <History className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Ajuste */}
      {showAdjustModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-black text-mare-navy tracking-tight">Ajustar Inventario</h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-gray-400 hover:text-gray-600"><ChevronRight size={20} className="rotate-180" /></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-2xl">
                <img src={selectedProduct.imagenes?.[0] || 'https://via.placeholder.com/50'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="font-bold text-mare-navy text-sm">{selectedProduct.nombre}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Stock Físico: {selectedProduct.stock_quantity}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-mare-navy uppercase tracking-widest mb-2">Tipo de Movimiento</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustData({ ...adjustData, type: 'entry' })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${adjustData.type === 'entry' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-50'}`}
                  >
                    <ArrowDownRight className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Entrada</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustData({ ...adjustData, type: 'exit' })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${adjustData.type === 'exit' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-50'}`}
                  >
                    <ArrowUpRight className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Salida</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustData({ ...adjustData, type: 'adjustment' })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${adjustData.type === 'adjustment' ? 'border-mare-turquoise bg-mare-turquoise/10 text-mare-navy' : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-50'}`}
                  >
                    <RefreshCw className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ajuste</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-mare-navy uppercase tracking-widest mb-2">Cantidad (Valor Absoluto)</label>
                <input
                  type="number"
                  min="1"
                  value={adjustData.quantity || ''}
                  onChange={(e) => setAdjustData({ ...adjustData, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-mare-navy/10"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-mare-navy uppercase tracking-widest mb-2">Motivo / Notas</label>
                <input
                  type="text"
                  placeholder="Ej: Compra a proveedor, pérdida, etc."
                  value={adjustData.reason}
                  onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-mare-navy/10"
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex gap-2">
              <button 
                onClick={() => setShowAdjustModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAdjustStock}
                disabled={!adjustData.quantity || !adjustData.reason}
                className="flex-1 px-4 py-3 bg-mare-navy hover:bg-mare-navy/90 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Historial */}
      {showHistoryModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <div>
                <h3 className="font-black text-mare-navy tracking-tight">Historial de Movimientos</h3>
                <p className="text-sm font-bold text-gray-500 mt-1">{selectedProduct.nombre}</p>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full">
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
              {isHistoryLoading ? (
                <div className="flex justify-center p-12">
                  <div className="w-8 h-8 border-4 border-mare-navy border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : movements.length === 0 ? (
                <div className="text-center p-12 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm font-black uppercase tracking-widest">No hay movimientos registrados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {movements.map((mov) => (
                    <div key={mov.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          mov.movement_type === 'entry' ? 'bg-green-100 text-green-600' :
                          mov.movement_type === 'exit' ? 'bg-red-100 text-red-600' :
                          'bg-mare-turquoise/20 text-mare-turquoise'
                        }`}>
                          {mov.movement_type === 'entry' ? <ArrowDownRight size={20} /> :
                           mov.movement_type === 'exit' ? <ArrowUpRight size={20} /> :
                           <RefreshCw size={18} />}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-mare-navy">{mov.reason}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                            {new Date(mov.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-lg ${
                          mov.movement_type === 'entry' ? 'text-green-600' :
                          mov.movement_type === 'exit' ? 'text-red-600' :
                          'text-mare-turquoise'
                        }`}>
                          {mov.movement_type === 'exit' ? '-' : '+'}{mov.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
