import { useState, useEffect } from 'react';
import { locationService } from '../../services/locations';
import { Province, Municipality } from '../../data/cubaLocations';
import { MapPin, Search, Edit, Eye, EyeOff, Save } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export function AdminLocations() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { success } = useToast();

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    setIsLoading(true);
    const data = await locationService.getAllProvinces();
    setProvinces(data);
    if (data.length > 0 && !selectedProvinceId) {
      setSelectedProvinceId(data[0].id);
    }
    setIsLoading(false);
  };

  const toggleProvince = async (id: string, active: boolean) => {
    await locationService.toggleProvince(id, active);
    loadLocations();
    success('Provincia actualizada', `La provincia ha sido ${active ? 'activada' : 'desactivada'}.`);
  };

  const toggleMunicipality = async (provinceId: string, muniName: string, active: boolean) => {
    await locationService.toggleMunicipality(provinceId, muniName, active);
    loadLocations();
  };

  const updateMunicipalityPrice = async (provinceId: string, muniName: string, price: number) => {
    await locationService.updateMunicipalityPrice(provinceId, muniName, price);
    loadLocations();
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-mare-blue border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const selectedProvince = provinces.find(p => p.id === selectedProvinceId);

  const filteredMunicipalities = selectedProvince?.municipios.filter(m => 
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-mare-navy uppercase tracking-tight">Provincias y Municipios</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Configura las zonas de operación para envíos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 border border-gray-100 overflow-hidden md:col-span-1">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-mare-navy flex items-center">
              <MapPin size={18} className="mr-2 text-mare-blue" /> Provincias
            </h2>
            <div className="text-xs text-gray-500">{provinces.length} totales</div>
          </div>
          
          <div className="overflow-y-auto max-h-[600px]">
            <ul className="divide-y divide-gray-100">
              {provinces.map(prov => (
                <li 
                  key={prov.id} 
                  className={`p-4 flex items-center justify-between transition-colors cursor-pointer ${selectedProvinceId === prov.id ? 'bg-mare-turquoise/10 border-l-4 border-mare-blue' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
                  onClick={() => setSelectedProvinceId(prov.id)}
                >
                  <div>
                    <span className={`font-medium ${selectedProvinceId === prov.id ? 'text-mare-blue' : 'text-mare-navy'}`}>{prov.nombre}</span>
                    <span className="ml-2 text-xs text-gray-500">{prov.municipios?.length || 0} mun.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleProvince(prov.id, !prov.activa); }}
                      className={`p-1.5 rounded-lg ${prov.activa ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                      title={prov.activa ? 'Desactivar' : 'Activar'}
                    >
                      {prov.activa ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 border border-gray-100 overflow-hidden md:col-span-2">
          {selectedProvince ? (
            <>
              <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-mare-navy">{selectedProvince.nombre}</h2>
                  <p className="text-xs text-gray-500">{selectedProvince.municipios.length} municipios</p>
                </div>
                
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Buscar municipio..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-mare-blue focus:border-mare-blue w-full sm:w-64"
                  />
                  <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-6 py-3 font-medium">Municipio</th>
                      <th className="px-6 py-3 font-medium">Costo Entrega (CUP)</th>
                      <th className="px-6 py-3 font-medium text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredMunicipalities.map((muni, index) => (
                      <tr key={index} className={!muni.activo ? 'bg-gray-50/50' : ''}>
                        <td className="px-6 py-5 font-medium text-mare-navy">
                          <span className={!muni.activo ? 'line-through text-gray-400' : ''}>{muni.nombre}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            <input 
                              type="number"
                              min="0"
                              value={muni.precioEntregaMN}
                              onChange={(e) => updateMunicipalityPrice(selectedProvince.id, muni.nombre, parseInt(e.target.value) || 0)}
                              className="w-24 border border-gray-300 rounded px-2 py-1 text-sm text-right"
                              disabled={!muni.activo}
                            />
                            <span className="ml-2 text-xs text-gray-500">CUP</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => toggleMunicipality(selectedProvince.id, muni.nombre, !muni.activo)}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              muni.activo 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {muni.activo ? 'Activo' : 'Inactivo'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredMunicipalities.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No se encontraron municipios.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <MapPin size={48} className="text-gray-200 mb-4" />
              <p>Selecciona una provincia para ver sus municipios</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
