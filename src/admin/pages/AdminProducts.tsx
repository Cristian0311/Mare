import { useState, useEffect } from 'react';
import { productService } from '../../services/products';
import { Product } from '../../types';
import { Search, Plus, Edit, Trash2, CheckCircle, XCircle, Package, MoreVertical, CheckSquare, Square, Tags, DollarSign, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Modal } from '../../components/ui/Modal';
import { ProductForm } from '../components/ProductForm';
import { motion, AnimatePresence } from 'motion/react';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive' | 'wholesale' | 'featured' | 'offers' | 'out_of_stock'>('all');
  
  const { formatPrice } = useCurrency();
  const { success, error } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      error('Error', 'No se pudieron cargar los productos de Supabase');
    }
    setIsLoading(false);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) 
        ? prev.filter(pId => pId !== id)
        : [...prev, id]
    );
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${product.nombre}" permanentemente de Supabase?`)) {
      try {
        await productService.deleteProduct(product.id);
        success('Eliminado', 'Producto eliminado correctamente de Supabase');
        loadProducts();
      } catch (err: any) {
        if (err.message === 'SAFE_DELETE_FAILED') {
          if (window.confirm('Este producto tiene historial y no puede ser eliminado físicamente. ¿Deseas ocultarlo (desactivarlo)?')) {
            await toggleStatus(product, false);
          }
        } else {
          error('Error', 'No se pudo eliminar el producto');
        }
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`¿Vas a eliminar ${selectedProducts.length} productos? Esta acción no se puede deshacer.`)) {
      try {
        for (const id of selectedProducts) {
          try {
            await productService.deleteProduct(id);
          } catch (e: any) {
             console.error(e);
          }
        }
        success('Eliminados', `Operación por lotes completada`);
        setSelectedProducts([]);
        loadProducts();
      } catch (err) {
        error('Error', 'Ocurrió un error en la eliminación por lotes');
      }
    }
  };

  const handleBulkToggleStatus = async (visible: boolean) => {
    try {
      for (const id of selectedProducts) {
        await productService.toggleProductStatus(id, visible);
      }
      success('Actualizados', `${selectedProducts.length} productos sincronizados con Supabase`);
      setSelectedProducts([]);
      loadProducts();
    } catch (err) {
      error('Error', 'Ocurrió un error al actualizar');
    }
  };

  const toggleStatus = async (product: Product, targetStatus?: boolean) => {
    const isCurrentlyActive = product.activo !== false;
    const newStatus = targetStatus !== undefined ? targetStatus : !isCurrentlyActive;
    
    try {
      await productService.toggleProductStatus(product.id, newStatus);
      loadProducts();
      success('Actualizado', `Producto ${newStatus ? 'público' : 'oculto'} correctamente`);
    } catch (err) {
      error('Error', 'No se pudo cambiar el estado');
    }
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Partial<Product>) => {
    try {
      if (editingProduct) {
        await productService.updateProduct({ ...editingProduct, ...data } as Product);
        success('Actualizado', 'Producto actualizado en Supabase');
      } else {
        await productService.createProduct(data as any);
        success('Creado', 'Producto registrado en Supabase');
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (err) {
      console.error(err);
      error('Error', 'No se pudo guardar el producto');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isActive = p.activo !== false;
    if (activeTab === 'active' && !isActive) return false;
    if (activeTab === 'inactive' && isActive) return false;
    if (activeTab === 'wholesale' && !p.ventaMayorista?.habilitada) return false;
    if (activeTab === 'featured' && !p.destacado) return false;
    if (activeTab === 'offers' && !p.oferta) return false;
    if (activeTab === 'out_of_stock' && (p.stock !== undefined && p.stock !== null && p.stock > 0)) return false;
    
    return matchesSearch;
  });

  if (isLoading) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-mare-navy uppercase tracking-tight">Catálogo Digital</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black text-mare-turquoise uppercase tracking-[0.2em]">Gestión de Productos</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sincronizado con Supabase</span>
          </div>
        </div>
        <button 
          onClick={handleOpenNew}
          className="flex items-center rounded-2xl px-6 py-3.5 font-black uppercase tracking-widest text-[10px] bg-mare-navy hover:bg-mare-navy/90 text-white shadow-xl shadow-mare-navy/20 transition-all active:scale-95"
        >
          <Plus size={16} className="mr-2" />
          Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Bulk Actions Toolbar */}
        {selectedProducts.length > 0 && (
          <div className="bg-mare-navy px-6 py-3 flex items-center justify-between text-white animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckSquare size={18} className="text-mare-gold" />
              <span className="text-xs font-black tracking-widest uppercase">{selectedProducts.length} seleccionados</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkToggleStatus(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                Hacer Públicos
              </button>
              <button 
                onClick={() => handleBulkToggleStatus(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                Ocultar
              </button>
              <button 
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        )}

        {/* Filters & Search */}
        <div className="p-4 md:p-8 border-b border-gray-100 bg-gray-50/30 flex flex-col xl:flex-row gap-6 justify-between items-center">
          
          <div className="flex bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 p-1.5 w-full xl:w-auto overflow-x-auto hide-scrollbar shadow-inner">
            {[
              { id: 'all', label: 'Todos', color: 'bg-mare-navy' },
              { id: 'active', label: 'Públicos', color: 'bg-emerald-600' },
              { id: 'inactive', label: 'Ocultos', color: 'bg-gray-400' },
              { id: 'wholesale', label: 'Mayorista', color: 'bg-mare-green' },
              { id: 'featured', label: 'Destacados', color: 'bg-mare-gold' },
              { id: 'offers', label: 'Ofertas', color: 'bg-orange-500' },
              { id: 'out_of_stock', label: 'Sin Stock', color: 'bg-red-500' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? `${tab.color} text-white shadow-lg` 
                    : 'text-gray-400 hover:text-mare-navy hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full xl:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-mare-turquoise transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Buscar producto por nombre o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 py-4 border border-gray-100 bg-white rounded-2xl text-xs font-black focus:ring-4 focus:ring-mare-turquoise/5 focus:border-mare-turquoise outline-none transition-all placeholder:text-gray-200 uppercase tracking-tight"
            />
          </div>
        </div>

        {/* Products List View */}
        <div className="bg-white overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 w-14">
                  <button 
                    onClick={() => {
                      if (selectedProducts.length === filteredProducts.length) setSelectedProducts([]);
                      else setSelectedProducts(filteredProducts.map(p => p.id));
                    }}
                    className="text-gray-300 hover:text-mare-navy transition-colors"
                  >
                    {selectedProducts.length === filteredProducts.length && filteredProducts.length > 0 
                      ? <CheckSquare size={20} className="text-mare-navy" /> 
                      : <Square size={20} />
                    }
                  </button>
                </th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Producto</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Estado</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoría</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Precio</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => {
                  const isActive = product.activo !== false;
                  const isSelected = selectedProducts.includes(product.id);
                  const mainImage = product.imagenes && product.imagenes.length > 0 ? product.imagenes[0] : null;

                  return (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={product.id} 
                      className={`group hover:bg-gray-50/30 transition-colors ${isSelected ? 'bg-mare-navy/[0.01]' : ''}`}
                    >
                      <td className="p-5">
                        <button 
                          onClick={() => toggleSelect(product.id)}
                          className="text-gray-200 hover:text-mare-navy transition-colors"
                        >
                          {isSelected ? <CheckSquare size={20} className="text-mare-navy" /> : <Square size={20} />}
                        </button>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 shrink-0 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center relative">
                            {mainImage ? (
                              <img src={mainImage} alt={product.nombre} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon size={20} className="text-gray-200" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-black text-[11px] text-mare-navy uppercase tracking-tight truncate max-w-[250px]">
                              {product.nombre}
                            </h3>
                            <p className="text-[9px] font-mono text-gray-300 uppercase tracking-widest mt-1">
                              ID: {product.id.substring(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {isActive ? 'Público' : 'Oculto'}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {product.categoria || 'Sin Categoría'}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="font-black text-xs text-mare-navy">
                          {formatPrice(product.precioMN)}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleOpenEdit(product)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-mare-turquoise hover:text-white rounded-lg transition-all"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(product)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Package className="text-gray-300" size={24} />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                No se encontraron productos
              </p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Editar Producto" : "Nuevo Producto"}
        maxWidth="xl"
      >
        <div className="bg-gray-50/50 w-full overflow-hidden">
          <ProductForm
            product={editingProduct}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </div>
      </Modal>
    </motion.div>
  );
}
