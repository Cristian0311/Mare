const fs = require('fs');
const file = 'src/admin/components/ProductForm.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    {formData.ventaMayorista.presentacion === 'Unidad' ? 'Cant. Mínima (Unidades)' : \`Unidades por \${formData.ventaMayorista.presentacion}\`}
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
              </div>`;

const replacement = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                
                {formData.ventaMayorista.presentacion !== 'Unidad' && (
                  <div className="min-w-0">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                      Unidades por {formData.ventaMayorista.presentacion}
                    </label>
                    <input 
                      type="number"
                      min="2"
                      value={formData.ventaMayorista.unidadesPorPresentacion || 1}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setFormData(prev => ({
                          ...prev,
                          ventaMayorista: { 
                            ...prev.ventaMayorista!, 
                            unidadesPorPresentacion: val
                          }
                        }));
                      }}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-mare-navy focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise outline-none transition-all bg-white"
                    />
                  </div>
                )}

                <div className="min-w-0">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Cant. Mínima ({formData.ventaMayorista.presentacion}s)
                  </label>
                  <input 
                    type="number"
                    min="1"
                    value={formData.ventaMayorista.cantidadMinima || 1}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setFormData(prev => ({
                        ...prev,
                        ventaMayorista: { 
                          ...prev.ventaMayorista!, 
                          cantidadMinima: val
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
              </div>`;

if (content.includes('Tipo de Presentación')) {
  // Try to replace using substring logic
  const startIndex = content.indexOf('<div className="grid grid-cols-1 md:grid-cols-3 gap-6">');
  const endIndex = content.indexOf('</div>', content.indexOf('Precio por {formData.ventaMayorista.presentacion}')) + 26; // approx
  
  if (startIndex !== -1) {
     const nextDiv = content.indexOf('              {formData.ventaMayorista.presentacion !== \'Unidad\' && (', startIndex);
     if (nextDiv !== -1) {
        content = content.substring(0, startIndex) + replacement + "\n" + content.substring(nextDiv);
        fs.writeFileSync(file, content);
        console.log('REPLACED');
     } else {
        console.log('Could not find next div');
     }
  } else {
     console.log('Could not find start div');
  }
}
