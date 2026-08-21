import { useState, useEffect } from 'react';
import { categoryService } from '../../services/categories';
import { Category } from '../../types';
import { 
  Search, Plus, Edit, Trash2, CheckCircle, XCircle, Tags,
  ChevronRight, LayoutGrid
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { CategoryForm } from '../components/CategoryForm';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { motion, AnimatePresence } from 'motion/react';

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  
  const { success, error } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoryService.getAllCategories(true);
      setCategories(data);
    } catch (err) {
      error('Error', 'No se pudieron cargar las categorías');
    }
    setIsLoading(false);
  };

  const handleSave = async (data: Partial<Category>) => {
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, data);
        success('Actualizada', 'La categoría se ha actualizado correctamente.');
      } else {
        await categoryService.createCategory(data);
        success('Creada', 'La nueva categoría ha sido guardada.');
      }
      setShowForm(false);
      setEditingCategory(undefined);
      loadCategories();
    } catch (err: any) {
      console.error(err);
      error('Error', 'No se pudo guardar la categoría.');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (category: Category) => {
    try {
      if (window.confirm(`¿Estás seguro de que deseas eliminar la categoría: ${category.nombre}? Esto es irreversible.`)) {
        await categoryService.deleteCategory(category.id);
        success('Eliminada', 'La categoría ha sido eliminada.');
        loadCategories();
      }
    } catch (err: any) {
      if (err.message === 'SAFE_DELETE_FAILED') {
        if (window.confirm(`La categoría "${category.nombre}" tiene productos asociados. ¿Deseas desactivarla ahora?`)) {
          await toggleStatus(category);
        }
      } else {
        error('Error', 'No se pudo eliminar la categoría.');
      }
    }
  };

  const toggleStatus = async (category: Category) => {
    const isCurrentlyActive = category.activo !== false;
    try {
      await categoryService.toggleCategoryStatus(category.id, !isCurrentlyActive);
      loadCategories();
      success('Actualizado', `La categoría ha sido ${!isCurrentlyActive ? 'activada' : 'desactivada'}.`);
    } catch (err) {
      error('Error', 'No se pudo cambiar el estado.');
    }
  };

  const filteredCategories = categories.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (a.parent_id === b.parent_id) {
      return (a.orden || 0) - (b.orden || 0);
    }
    if (a.parent_id === b.id) return 1;
    if (b.parent_id === a.id) return -1;
    return (a.parent_id ? 1 : 0) - (b.parent_id ? 1 : 0);
  });

  if (isLoading && !showForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="w-10 h-10 border-4 border-mare-navy border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Organizando Catálogo...</p>
      </div>
    );
  }

  if (showForm) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        <div className="flex items-center gap-4 mb-10">
          <button 
            onClick={() => { setShowForm(false); setEditingCategory(undefined); }}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all active:scale-90"
          >
            <XCircle size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-mare-navy uppercase tracking-tight leading-none">
              {editingCategory ? 'Modificar Categoría' : 'Nueva Categoría'}
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
              Edición de Estructura Comercial
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gray-50/50 rounded-full -mr-24 -mt-24 pointer-events-none"></div>
          <CategoryForm 
            category={editingCategory}
            categories={categories}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingCategory(undefined);
            }}
          />
        </div>
      </motion.div>
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
          <h1 className="text-3xl font-black text-mare-navy uppercase tracking-tight">Arquitectura</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black text-mare-turquoise uppercase tracking-[0.2em]">Categorías & Secciones</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Niveles de Navegación</span>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(true)} 
          className="flex items-center rounded-2xl px-6 py-3.5 font-black uppercase tracking-widest text-[10px] bg-mare-navy hover:bg-black text-white shadow-xl shadow-mare-navy/10 transition-all active:scale-95"
        >
          <Plus size={16} className="mr-2" />
          Añadir Sección
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 md:p-8 border-b border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row gap-6 justify-between items-center">
          <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-mare-turquoise transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nombre o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 py-4 border border-gray-100 bg-white rounded-2xl text-xs font-black focus:ring-4 focus:ring-mare-turquoise/5 focus:border-mare-turquoise outline-none transition-all placeholder:text-gray-200 uppercase tracking-tight"
            />
          </div>
          <div className="flex gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm items-center">
            <LayoutGrid size={16} className="text-mare-gold" />
            <span className="text-[10px] font-black text-mare-navy uppercase tracking-widest">{filteredCategories.length} Entidades</span>
          </div>
        </div>

        {/* Categories List */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-16">Orden</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sección</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Dependencia</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Estado</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {filteredCategories.map((category, index) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    key={category.id} 
                    className={`group hover:bg-gray-50/50 transition-colors ${category.parent_id ? 'bg-gray-50/20' : ''}`}
                  >
                    <td className="px-8 py-4">
                      <div className="font-mono text-[10px] font-black text-gray-300 flex items-center justify-center w-8 h-8 bg-gray-50 rounded-lg group-hover:bg-mare-navy group-hover:text-white transition-all">
                        {category.orden || 0}
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-gray-50 border border-gray-50 flex items-center justify-center text-gray-400 group-hover:text-mare-gold group-hover:bg-white transition-all">
                          {getCategoryIcon(category.icono, "w-5 h-5")}
                        </div>
                        <div>
                          <div className="font-black text-mare-navy uppercase tracking-tight text-sm leading-none">
                            {category.nombre}
                          </div>
                          <div className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                            ID: {category.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-center">
                      {category.parent_id ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[8px] bg-mare-turquoise/10 text-mare-turquoise font-black uppercase tracking-widest">
                          Hijo de {category.parent_id}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[8px] bg-gray-100 text-gray-400 font-black uppercase tracking-widest">
                          Raíz
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-4 text-center">
                      <button 
                        onClick={() => toggleStatus(category)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                        category.activo !== false 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                          : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${category.activo !== false ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                        {category.activo !== false ? 'Activa' : 'Oculta'}
                      </button>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(category)} 
                          className="w-8 h-8 flex items-center justify-center bg-mare-navy/5 text-mare-navy hover:bg-mare-navy hover:text-white rounded-lg transition-all shadow-sm"
                          title="Editar"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(category)} 
                          className="w-8 h-8 flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all shadow-sm"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredCategories.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-100 text-gray-200">
                <Tags size={32} />
              </div>
              <p className="text-xs font-black text-gray-300 uppercase tracking-[0.2em]">
                {searchTerm ? 'No se encontraron resultados' : 'El catálogo está vacío'}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
