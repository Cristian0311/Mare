import React, { useState, useEffect } from 'react';
import { Product, Category, VariantOption, ProductVariant } from '../../types';
import { categoryService } from '../../services/categories';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Save, X, Plus, Trash2, Image as ImageIcon, Truck, AlertCircle, Edit2, Check, Layers, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { InfoTrigger } from './InfoTrigger';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  onCancel: () => void;
}

const AVAILABILITY_PRESETS = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'agotado', label: 'Agotado' }
];

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const { formatPrice } = useCurrency();
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    categoryService.getAllCategories().then(data => setCategories(data));
  }, []);
  
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      nombre: '',
      descripcionCorta: '',
      descripcionCompleta: '',
      precioMN: 0,
      precioAnteriorMN: undefined,
      categoria: '',
      subcategoria: '',
      imagenes: [],
      etiquetas: [],
      disponibilidad: 'disponible',
      activo: true,
      stock: 0,
      sku: '',
      destacado: false,
    }
  );



  const [newTag, setNewTag] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : parseFloat(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAvailSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, disponibilidad: e.target.value as any }));
  };

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (('key' in e && e.key === 'Enter') || e.type === 'click') {
      e.preventDefault();
      if (newTag.trim() && !formData.etiquetas?.includes(newTag.trim())) {
        setFormData(prev => ({
          ...prev,
          etiquetas: [...(prev.etiquetas || []), newTag.trim()]
        }));
        setNewTag('');
      }
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      etiquetas: prev.etiquetas?.filter(t => t !== tag)
    }));
  };

  // Estados y handlers para Variantes (Tallas, Colores, Opciones)
  const [newOptName, setNewOptName] = useState('');
  const [newOptValues, setNewOptValues] = useState('');

  const opcionesVariantes: VariantOption[] = formData.opcionesVariantes || [];
  const variantes: ProductVariant[] = formData.variantes || [];

  const handleAddPresetOption = (type: 'talla' | 'color' | 'capacidad') => {
    let option: VariantOption;
    if (type === 'talla') {
      option = { nombre: 'Talla', valores: ['S', 'M', 'L', 'XL', 'XXL'] };
    } else if (type === 'color') {
      option = { nombre: 'Color', valores: ['Negro', 'Blanco', 'Azul', 'Rojo', 'Gris', 'Verde'] };
    } else {
      option = { nombre: 'Capacidad', valores: ['64 GB', '128 GB', '256 GB', '512 GB'] };
    }

    const existsIndex = opcionesVariantes.findIndex(o => o.nombre.toLowerCase() === option.nombre.toLowerCase());
    let updatedOpts: VariantOption[];
    if (existsIndex >= 0) {
      updatedOpts = [...opcionesVariantes];
      const merged = Array.from(new Set([...updatedOpts[existsIndex].valores, ...option.valores]));
      updatedOpts[existsIndex] = { ...updatedOpts[existsIndex], valores: merged };
    } else {
      updatedOpts = [...opcionesVariantes, option];
    }

    setFormData(prev => ({ ...prev, opcionesVariantes: updatedOpts }));
  };

  const handleAddCustomOption = () => {
    if (!newOptName.trim() || !newOptValues.trim()) return;
    const vals = newOptValues.split(',').map(v => v.trim()).filter(Boolean);
    if (vals.length === 0) return;

    const newOption: VariantOption = {
      nombre: newOptName.trim(),
      valores: vals
    };

    const existsIndex = opcionesVariantes.findIndex(o => o.nombre.toLowerCase() === newOption.nombre.toLowerCase());
    let updatedOpts: VariantOption[];
    if (existsIndex >= 0) {
      updatedOpts = [...opcionesVariantes];
      const merged = Array.from(new Set([...updatedOpts[existsIndex].valores, ...vals]));
      updatedOpts[existsIndex] = { ...updatedOpts[existsIndex], valores: merged };
    } else {
      updatedOpts = [...opcionesVariantes, newOption];
    }

    setFormData(prev => ({ ...prev, opcionesVariantes: updatedOpts }));
    setNewOptName('');
    setNewOptValues('');
  };

  const handleRemoveOption = (optIndex: number) => {
    const updated = opcionesVariantes.filter((_, i) => i !== optIndex);
    setFormData(prev => ({ ...prev, opcionesVariantes: updated }));
  };

  const handleRemoveValueFromOption = (optIndex: number, valIndex: number) => {
    const updated = [...opcionesVariantes];
    updated[optIndex].valores = updated[optIndex].valores.filter((_, i) => i !== valIndex);
    setFormData(prev => ({ ...prev, opcionesVariantes: updated }));
  };

  // Auto-generate variants when options change
  useEffect(() => {
    const opts = formData.opcionesVariantes || [];
    if (opts.length === 0) {
      if ((formData.variantes || []).length > 0) {
        setFormData(prev => ({ ...prev, variantes: [] }));
      }
      return;
    }

    const cartesian = (args: string[][]): string[][] => {
      const r: string[][] = [];
      const max = args.length - 1;
      function helper(arr: string[], i: number) {
        for (let j = 0, l = args[i].length; j < l; j++) {
          const a = arr.slice(0);
          a.push(args[i][j]);
          if (i === max) r.push(a);
          else helper(a, i + 1);
        }
      }
      helper([], 0);
      return r;
    };

    const names = opts.map(o => o.nombre);
    const valueLists = opts.map(o => o.valores);

    if (valueLists.some(l => l.length === 0)) return;

    const combinations = cartesian(valueLists);
    
    // We need to compare existing variants to generated ones
    // Only update if they differ (to avoid infinite loops)
    
    const existingVariantes = formData.variantes || [];
    
    const generatedVariants: ProductVariant[] = combinations.map((combo, idx) => {
      const atributos: Record<string, string> = {};
      combo.forEach((val, i) => {
        atributos[names[i]] = val;
      });

      const existing = existingVariantes.find(v => {
        const existingKeys = Object.keys(v.atributos || {});
        const newKeys = Object.keys(atributos);
        if (existingKeys.length !== newKeys.length) return false;
        return Object.keys(atributos).every(k => v.atributos?.[k] === atributos[k]);
      });

      if (existing) {
        return existing;
      }

      return {
        id: `var-${Date.now()}-${idx}`,
        atributos,
        precioMN: undefined,
        stock: undefined,
        disponibilidad: 'disponible',
        sku: `${formData.sku || 'MRE'}-${combo.join('-').toUpperCase().replace(/\s+/g, '')}`
      };
    });

    // Check if generatedVariants is different from existingVariantes
    // (We only check length and shallow ID equality to prevent loops)
    const isDifferent = generatedVariants.length !== existingVariantes.length || 
                        !generatedVariants.every(g => existingVariantes.some(e => e.id === g.id));
                        
    if (isDifferent) {
      setFormData(prev => ({ ...prev, variantes: generatedVariants }));
    }
  }, [formData.opcionesVariantes, formData.sku]);

  const handleGenerateCombinations = () => {
    // This is now handled automatically by the useEffect
  };

  const handleUpdateVariant = (index: number, updates: Partial<ProductVariant>) => {
    const updated = [...variantes];
    updated[index] = { ...updated[index], ...updates };
    setFormData(prev => ({ ...prev, variantes: updated }));
  };

  const handleRemoveVariant = (index: number) => {
    const updated = variantes.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, variantes: updated }));
  };

  const selectedCategory = categories.find(c => c.id === formData.categoria);
  const subcategories = selectedCategory?.subcategorias || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    try {
      const finalData = { ...formData };
      await onSubmit(finalData);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar el producto');
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-sans max-w-4xl mx-auto min-w-0 w-full overflow-hidden">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100 min-w-0">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm font-bold break-words min-w-0 flex-1">{errorMsg}</p>
        </div>
      )}

      {/* Basic Info Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm space-y-6 min-w-0 w-full">
        <h3 className="text-[10px] font-black text-mare-navy uppercase tracking-widest border-b border-gray-100 pb-3 flex items-center">
          <span className="w-2 h-2 bg-mare-gold rounded-full mr-2"></span>
          Información Básica
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
          <div className="col-span-1 md:col-span-2 min-w-0">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center flex-wrap gap-1">
              Nombre del Producto
              <InfoTrigger title="Título principal" text="Nombre visible del producto. Trate de ser claro e incluir la marca si es relevante." />
            </label>
            <input 
              type="text" 
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-mare-navy focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none transition-all"
              placeholder="Ej: Camisa de Lino Premium"
            />
          </div>
          
          <div className="min-w-0">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center flex-wrap gap-1">
              Categoría
              <InfoTrigger title="Organización" text="Define en qué colección principal de la tienda aparecerá este producto." />
            </label>
            <select 
              name="categoria"
              required
              value={formData.categoria}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-mare-navy focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none bg-white transition-all max-w-full"
            >
              <option value="" disabled>Seleccionar categoría...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
          
          <div className="min-w-0">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center flex-wrap gap-1">
              Subcategoría
              <InfoTrigger title="Filtrado detallado" text="Ayuda a los usuarios a encontrar el producto más rápido mediante filtros." />
            </label>
            <select 
              name="subcategoria"
              value={formData.subcategoria}
              onChange={handleChange}
              disabled={!formData.categoria || subcategories.length === 0}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-mare-navy focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400 transition-all max-w-full"
            >
              <option value="">Ninguna</option>
              {subcategories.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.nombre}</option>
              ))}
            </select>
          </div>
          
          <div className="col-span-1 md:col-span-2 min-w-0">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center flex-wrap gap-1">
              Descripción Corta
              <InfoTrigger title="Resumen" text="Aparecerá en las miniaturas de los productos. Máximo 1-2 oraciones cortas." />
            </label>
            <textarea 
              name="descripcionCorta"
              required
              value={formData.descripcionCorta}
              onChange={handleChange}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-mare-navy focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none resize-none transition-all"
              placeholder="Resumen para la tarjeta de producto..."
            />
          </div>
          
          <div className="col-span-1 md:col-span-2 min-w-0">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center flex-wrap gap-1">
              Descripción Completa
              <InfoTrigger title="Detalles" text="Información exhaustiva visible en la página del producto. Incluye medidas, materiales o políticas específicas." />
            </label>
            <textarea 
              name="descripcionCompleta"
              value={formData.descripcionCompleta || ''}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-mare-navy focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none resize-none transition-all"
              placeholder="Detalles completos, materiales, usos..."
            />
          </div>
        </div>
      </div>

      {/* Pricing and Inventory Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm space-y-6 min-w-0 w-full">
        <h3 className="text-[10px] font-black text-mare-navy uppercase tracking-widest border-b border-gray-100 pb-3 flex items-center">
          <span className="w-2 h-2 bg-mare-turquoise rounded-full mr-2"></span>
          Precios e Inventario
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
          <div className="min-w-0">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center flex-wrap gap-1">
              Precio Principal (CUP)
              <InfoTrigger title="Precio Real" text="El valor en CUP al que se venderá el producto." />
            </label>
            <div className="relative min-w-0">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">$</span>
              <input 
                type="number" 
                name="precioMN"
                required
                min="0"
                step="1"
                value={formData.precioMN}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm font-mono font-black text-mare-navy focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="min-w-0">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center flex-wrap gap-1">
              Precio Anterior (CUP)
              <InfoTrigger title="Oferta o Descuento" text="Si llenas esto con un valor superior al precio principal, se calculará y mostrará un globo de oferta." />
            </label>
            <div className="relative min-w-0">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">$</span>
              <input 
                type="number" 
                name="precioAnteriorMN"
                min="0"
                step="1"
                value={formData.precioAnteriorMN || ''}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm font-mono text-gray-500 focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none transition-all"
                placeholder="Opcional"
              />
            </div>
            {formData.precioAnteriorMN && formData.precioMN && formData.precioAnteriorMN > formData.precioMN && (
              <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-2 break-words">
                Descuento Activo: {Math.round((1 - formData.precioMN / formData.precioAnteriorMN) * 100)}%
              </p>
            )}
          </div>

          {/* Disponibilidad Flexible */}
          <div className="min-w-0">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center flex-wrap gap-1">
              Disponibilidad
              <InfoTrigger title="Estado del Inventario" text="Indica si el producto está disponible para la venta inmediata o si se ha agotado." />
            </label>
            <select 
              value={formData.disponibilidad || 'disponible'}
              onChange={handleAvailSelectChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-mare-navy focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none transition-all bg-white mb-2 max-w-full"
            >
              {AVAILABILITY_PRESETS.map(preset => (
                <option key={preset.value} value={preset.value}>{preset.label}</option>
              ))}
            </select>
            
            {formData.disponibilidad === 'disponible' && (
              <div className="p-3 bg-mare-turquoise/5 rounded-xl border border-mare-turquoise/10 flex items-start gap-2.5">
                <AlertCircle className="w-3.5 h-3.5 text-mare-turquoise shrink-0 mt-0.5" />
                <p className="text-[9px] font-bold text-mare-turquoise uppercase tracking-wider leading-relaxed">
                  Los productos disponibles se manejan en el mismo día o hasta 3 días, en dependencia de lo que le informe el asesor.
                </p>
              </div>
            )}
          </div>
          
          <div className="min-w-0">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center flex-wrap gap-1">
              Stock
              <InfoTrigger title="Cantidad" text="Cantidad física. Si lo dejas en blanco, se asume inventario infinito." />
            </label>
            <input 
              type="number" 
              name="stock"
              min="0"
              value={formData.stock || ''}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono font-bold text-mare-navy focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none transition-all"
              placeholder="Dejar en blanco si es infinito"
            />
          </div>
          
          <div className="min-w-0">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center flex-wrap gap-1">
              SKU / Código
              <InfoTrigger title="Unidad de Mantenimiento de Stock" text="Código interno o código de barras para la gestión de su almacén." />
            </label>
            <input 
              type="text" 
              name="sku"
              value={formData.sku || ''}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono font-bold text-gray-500 focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none transition-all bg-gray-50/50"
              placeholder="Ej: MRE-1234"
            />
          </div>
        </div>

        {/* Wholesale Section */}
        <div className="pt-4 border-t border-gray-100 min-w-0">
          <label className="flex items-center mb-4 cursor-pointer">
            <input 
              type="checkbox"
              checked={formData.ventaMayorista?.habilitada || false}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                ventaMayorista: {
                  habilitada: e.target.checked,
                  presentacion: prev.ventaMayorista?.presentacion || 'Unidad',
                  cantidadMinima: prev.ventaMayorista?.cantidadMinima || 10,
                  unidadesPorPresentacion: prev.ventaMayorista?.unidadesPorPresentacion || 1,
                  precioMN: prev.ventaMayorista?.precioMN || (prev.precioMN || 0) * 0.8
                }
              }))}
              className="w-4 h-4 text-mare-turquoise border-gray-300 rounded focus:ring-mare-turquoise"
            />
            <span className="ml-2 text-[10px] font-black text-mare-navy uppercase tracking-widest flex items-center gap-1">
              Habilitar Venta Mayorista
              <InfoTrigger title="Mayorista" text="Permite vender este producto al por mayor con un precio especial." />
            </span>
          </label>

          {formData.ventaMayorista?.habilitada && (
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-4 min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="min-w-0">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Tipo de Presentación
                  </label>
                  <select
                    value={formData.ventaMayorista.presentacion}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      ventaMayorista: { ...prev.ventaMayorista!, presentacion: e.target.value as any }
                    }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-mare-navy focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none transition-all bg-white"
                  >
                    <option value="Unidad">Unidad</option>
                    <option value="Paquete">Paquete</option>
                    <option value="Caja">Caja</option>
                    <option value="Lote">Lote</option>
                  </select>
                </div>
                
                <div className="min-w-0">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    {formData.ventaMayorista.presentacion === 'Unidad' ? 'Cant. Mínima (Unidades)' : `Unidades por ${formData.ventaMayorista.presentacion}`}
                  </label>
                  <input 
                    type="number"
                    min="1"
                    value={formData.ventaMayorista.unidadesPorPresentacion || 1}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setFormData(prev => ({
                        ...prev,
                        ventaMayorista: { 
                          ...prev.ventaMayorista!, 
                          unidadesPorPresentacion: val,
                          cantidadMinima: prev.ventaMayorista?.presentacion === 'Unidad' ? val : 1
                        }
                      }));
                    }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-mare-navy focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none transition-all bg-white"
                  />
                </div>

                <div className="min-w-0">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Precio por {formData.ventaMayorista.presentacion} (MN)
                  </label>
                  <input 
                    type="number"
                    min="0"
                    step="1"
                    value={formData.ventaMayorista.precioMN}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      ventaMayorista: { ...prev.ventaMayorista!, precioMN: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-mare-navy focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none transition-all bg-white"
                  />
                </div>
              </div>

              {formData.ventaMayorista.presentacion !== 'Unidad' && (
                <div className="p-3 bg-white border border-gray-200 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resumen de Cálculo:</span>
                    <div className="text-right">
                      <p className="text-xs font-black text-mare-navy">
                        Precio unitario: {formatPrice(formData.ventaMayorista.precioMN / (formData.ventaMayorista.unidadesPorPresentacion || 1))}
                      </p>
                      <p className="text-[9px] font-bold text-green-500 uppercase">
                        Ahorro por unidad: {formatPrice(Math.max(0, (formData.precioMN || 0) - (formData.ventaMayorista.precioMN / (formData.ventaMayorista.unidadesPorPresentacion || 1))))}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Variants & Options Section (Tallas, Colores, etc.) */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm space-y-6 min-w-0 w-full">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-wrap gap-2">
          <h3 className="text-[10px] font-black text-mare-navy uppercase tracking-widest flex items-center flex-wrap gap-1">
            <Layers size={14} className="text-mare-turquoise mr-1" />
            Variantes del Producto (Tallas, Colores, Opciones)
            <InfoTrigger title="Opciones de producto" text="Agrega opciones como Tallas o Colores para generar variantes con precios y stock específicos." />
          </h3>
        </div>

        {/* Preset quick buttons */}
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
            Añadir Opciones Rápidas
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleAddPresetOption('talla')}
              className="px-3 py-1.5 text-xs font-bold text-mare-navy bg-gray-50 hover:bg-mare-turquoise/10 hover:text-mare-turquoise border border-gray-200 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus size={12} /> + Tallas (S, M, L, XL)
            </button>
            <button
              type="button"
              onClick={() => handleAddPresetOption('color')}
              className="px-3 py-1.5 text-xs font-bold text-mare-navy bg-gray-50 hover:bg-mare-turquoise/10 hover:text-mare-turquoise border border-gray-200 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus size={12} /> + Colores (Negro, Blanco, Azul, Rojo)
            </button>
            <button
              type="button"
              onClick={() => handleAddPresetOption('capacidad')}
              className="px-3 py-1.5 text-xs font-bold text-mare-navy bg-gray-50 hover:bg-mare-turquoise/10 hover:text-mare-turquoise border border-gray-200 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus size={12} /> + Capacidad (64 GB, 128 GB, 256 GB)
            </button>
          </div>
        </div>

        {/* Add custom option input */}
        <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 space-y-3">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
            O crea una opción personalizada
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-4">
              <input
                type="text"
                placeholder="Nombre (ej: Material)"
                value={newOptName}
                onChange={e => setNewOptName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-mare-navy focus:outline-none bg-white"
              />
            </div>
            <div className="sm:col-span-6">
              <input
                type="text"
                placeholder="Valores separados por coma (ej: Algodón, Lino, Cuero)"
                value={newOptValues}
                onChange={e => setNewOptValues(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-mare-navy focus:outline-none bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleAddCustomOption}
                className="w-full h-full py-2 bg-mare-turquoise hover:bg-mare-green text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Añadir
              </button>
            </div>
          </div>
        </div>

        {/* Display active option groups */}
        {opcionesVariantes.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Grupos de Opciones Configurados ({opcionesVariantes.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {opcionesVariantes.map((opt, optIdx) => (
                <div key={optIdx} className="border border-gray-200 rounded-xl p-3 bg-white space-y-2 relative shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-mare-navy uppercase tracking-wider">
                      {opt.nombre}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(optIdx)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                      title="Eliminar opción"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {opt.valores.map((val, valIdx) => (
                      <span
                        key={valIdx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200"
                      >
                        {val}
                        <button
                          type="button"
                          onClick={() => handleRemoveValueFromOption(optIdx, valIdx)}
                          className="text-gray-400 hover:text-red-500 transition-colors ml-0.5 cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Display generated variants list */}
        {variantes.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Combinaciones / Variantes Generadas ({variantes.length})
              </h4>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, variantes: [] }))}
                className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
              >
                Borrar todas
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {variantes.map((v, vIdx) => (
                <div
                  key={v.id || vIdx}
                  className="border border-gray-200 rounded-xl p-3 bg-gray-50/50 hover:bg-white transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    {Object.entries(v.atributos).map(([k, val]) => (
                      <span key={k} className="px-2 py-0.5 bg-mare-navy text-white text-[10px] font-bold rounded-md">
                        {k}: <span className="text-mare-gold">{val}</span>
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-gray-400">Precio CUP:</span>
                      <input
                        type="number"
                        placeholder={`${formData.precioMN || 0}`}
                        value={v.precioMN ?? ''}
                        onChange={e => handleUpdateVariant(vIdx, { precioMN: e.target.value === '' ? undefined : parseFloat(e.target.value) })}
                        className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-mare-navy bg-white focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-gray-400">Stock:</span>
                      <input
                        type="number"
                        placeholder="Ilimitado"
                        value={v.stock ?? ''}
                        onChange={e => handleUpdateVariant(vIdx, { stock: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })}
                        className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-mare-navy bg-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(vIdx)}
                      className="text-gray-400 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                      title="Eliminar variante"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Images Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm space-y-6 min-w-0 w-full">
        <h3 className="text-[10px] font-black text-mare-navy uppercase tracking-widest border-b border-gray-100 pb-3 flex items-center flex-wrap gap-1">
          <ImageIcon size={14} className="text-mare-gold mr-1" />
          Imágenes del Producto
          <InfoTrigger title="Multimedia" text="La primera imagen cargada siempre se mostrará como principal en la tienda." />
        </h3>
        
        <ImageUploader 
          images={formData.imagenes || []}
          onImagesChange={(urls) => setFormData(prev => ({ ...prev, imagenes: urls }))}
          maxImages={6}
        />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest break-words">
          Sube imágenes nítidas del producto. La primera imagen será la principal en la tienda pública.
        </p>
      </div>

      {/* Meta & Tags Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm space-y-6 min-w-0 w-full">
        <h3 className="text-[10px] font-black text-mare-navy uppercase tracking-widest border-b border-gray-100 pb-3 flex items-center">
          <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
          Etiquetas y Visibilidad
        </h3>
        
        <div className="min-w-0">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center flex-wrap gap-1">
            Etiquetas
            <InfoTrigger title="Búsqueda rápida" text="Escribe una palabra y presiona ENTER. Ayuda a encontrar el producto en la barra de búsqueda de la tienda." />
          </label>
          <div className="flex gap-2 mb-3 min-w-0">
            <input 
              type="text" 
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
              className="flex-1 min-w-0 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none transition-all"
              placeholder="Nueva etiqueta..."
            />
            <Button type="button" onClick={handleAddTag} variant="outline" className="rounded-xl px-4 text-mare-navy border-gray-200 hover:border-mare-navy shrink-0">
              <Plus size={18} />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 min-w-0 max-w-full">
            {(formData.etiquetas || []).map(tag => (
              <span key={tag} className="inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 border border-gray-200 break-all max-w-full">
                <span className="truncate">{tag}</span>
                <button 
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-gray-400 hover:text-red-500 shrink-0"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 min-w-0">
          <label className="flex items-center p-4 bg-gray-50/50 border border-gray-200 rounded-xl cursor-pointer hover:border-mare-turquoise/30 transition-all min-w-0">
            <input 
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              className="w-5 h-5 text-mare-turquoise border-gray-300 rounded focus:ring-mare-turquoise shrink-0"
            />
            <div className="ml-3 min-w-0 flex-1">
              <span className="flex items-center text-xs font-black text-mare-navy uppercase tracking-widest flex-wrap gap-1">
                Producto Activo
                <InfoTrigger title="Visibilidad" text="Si se apaga, el producto desaparecerá de la tienda pública, pero no será borrado de la base de datos." />
              </span>
              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Visible en la tienda principal</span>
            </div>
          </label>
          
        </div>
      </div>

      <div className="pt-8 flex flex-col-reverse md:flex-row justify-end gap-3 sticky bottom-4 z-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-lg">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          className="rounded-xl px-8 py-3.5 font-black uppercase tracking-widest text-xs text-gray-500 border-gray-200 bg-white hover:bg-gray-50 shadow-sm" 
          disabled={isSaving}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          className="rounded-xl px-8 py-3.5 font-black uppercase tracking-widest text-xs bg-mare-navy hover:bg-mare-navy/90 text-white shadow-xl shadow-mare-navy/20 border-none" 
          disabled={isSaving}
        >
          {isSaving ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Sincronizando DB...
            </div>
          ) : (
            <div className="flex items-center">
              <Save size={18} className="mr-2" />
              Guardar en Supabase
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
