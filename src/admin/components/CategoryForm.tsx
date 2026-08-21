import { useState } from 'react';
import { Category } from '../../types';
import { Button } from '../../components/ui/Button';
import { Save, AlertCircle } from 'lucide-react';
import { getCategoryIcon } from '../../utils/categoryIcons';

const ICON_OPTIONS = [
  'hogar', 'electrodomesticos', 'tecnologia', 'ropa', 'calzado', 
  'belleza', 'bisuteria', 'alimentos', 'aseo', 'salud', 'ninos', 
  'mochilas', 'deportes', 'automotor', 'ferreteria', 'mascotas', 
  'oficina', 'gaming', 'regalos', 'cocina', 'limpieza', 'tv', 'gafas', 'maquillaje', 'otros'
];

interface CategoryFormProps {
  category?: Category;
  categories?: Category[];
  onSave: (data: Partial<Category>) => Promise<void>;
  onCancel: () => void;
}

export function CategoryForm({ category, categories = [], onSave, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState<Partial<Category>>(
    category || {
      nombre: '',
      parent_id: '',
      slug: '',
      descripcion: '',
      imagen: '',
      icono: 'otros',
      activo: true,
      orden: 0
    }
  );
  
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Auto-generate slug if it's a new category and name changes
      if (name === 'nombre' && !category) {
        setFormData(prev => ({
          ...prev,
          slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    
    try {
      await onSave(formData);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar la categoría. Revisa la consola.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm font-bold">{errorMsg}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Nombre de la Categoría
            </label>
            <input 
              type="text"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej. Ropa de Hombre"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-mare-navy focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none transition-all placeholder:text-gray-300"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Slug (URL Amigable)
            </label>
            <input 
              type="text"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              placeholder="ropa-de-hombre"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-500 focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none transition-all placeholder:text-gray-300 bg-gray-50/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Icono de la Categoría
          </label>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            {ICON_OPTIONS.map((iconName) => {
              const isSelected = formData.icono === iconName;
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icono: iconName }))}
                  className={`flex items-center justify-center p-3 rounded-xl transition-all border ${
                    isSelected 
                      ? 'bg-mare-navy text-white border-mare-navy shadow-lg shadow-mare-navy/20 scale-110 z-10' 
                      : 'bg-white text-gray-400 border-gray-100 hover:border-mare-turquoise/30 hover:text-mare-turquoise'
                  }`}
                  title={iconName}
                >
                  {getCategoryIcon(iconName, "w-5 h-5")}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Categoría Padre (Opcional - Para Subcategorías)
          </label>
          <select
            name="parent_id"
            value={formData.parent_id || ''}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-mare-navy focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none transition-all bg-white"
          >
            <option value="">Ninguna (Categoría Principal)</option>
            {categories
              .filter(c => c.id !== category?.id) // Prevent self-referencing
              .map(c => (
                <option key={c.id} value={c.id}>
                  {c.parent_id ? '— ' : ''}{c.nombre}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Descripción (Opcional)
          </label>
          <textarea 
            name="descripcion"
            value={formData.descripcion || ''}
            onChange={handleChange}
            rows={3}
            placeholder="Breve descripción que aparecerá debajo del título..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-mare-navy focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none transition-all placeholder:text-gray-300 resize-none"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Orden de Visualización
            </label>
            <input 
              type="number"
              name="orden"
              value={formData.orden || 0}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono font-bold focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none transition-all bg-white"
            />
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center p-3.5 bg-white border border-gray-200 rounded-xl cursor-pointer transition-all hover:border-mare-turquoise/30 hover:shadow-sm">
              <input 
                type="checkbox"
                name="activo"
                checked={formData.activo}
                onChange={handleChange}
                className="w-5 h-5 text-mare-turquoise border-gray-300 rounded focus:ring-mare-turquoise focus:ring-offset-0 transition-colors"
              />
              <div className="ml-3">
                <span className="block text-xs font-black text-mare-navy uppercase tracking-widest">
                  Categoría Activa
                </span>
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">
                  Visible en la tienda
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          className="rounded-xl px-6 py-3 font-black uppercase tracking-widest text-[10px] text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700" 
          disabled={isSaving}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          className="rounded-xl px-8 py-3 font-black uppercase tracking-widest text-[10px] bg-mare-navy hover:bg-mare-navy/90 text-white shadow-lg shadow-mare-navy/20 border-none" 
          disabled={isSaving}
        >
          {isSaving ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Guardando DB...
            </div>
          ) : (
            <div className="flex items-center">
              <Save size={16} className="mr-2" />
              Guardar en Supabase
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
