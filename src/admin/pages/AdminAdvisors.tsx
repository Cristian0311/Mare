import { useState, useEffect } from 'react';
import { Advisor } from '../../types';
import { advisorsService } from '../../services/advisors';
import { Edit, Trash2, Plus, Headset, CheckCircle, XCircle, ChevronRight, MessageCircle } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { motion, AnimatePresence } from 'motion/react';
import { AdvisorForm } from '../components/AdvisorForm';

export function AdminAdvisors() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState<Advisor | undefined>();
  const { success, error } = useToast();

  useEffect(() => {
    loadAdvisors();
  }, []);

  const loadAdvisors = async () => {
    setIsLoading(true);
    try {
      const data = await advisorsService.getAllAdvisors();
      setAdvisors(data);
    } catch (err) {
      error('Error', 'No se pudieron cargar los asesores.');
    }
    setIsLoading(false);
  };

  const handleSave = async (data: Omit<Advisor, 'id'>) => {
    try {
      if (editingAdvisor) {
        await advisorsService.updateAdvisor(editingAdvisor.id, data);
        success('Actualizado', 'El asesor se ha actualizado correctamente.');
      } else {
        await advisorsService.createAdvisor(data);
        success('Creado', 'El nuevo asesor ha sido registrado.');
      }
      setShowForm(false);
      setEditingAdvisor(undefined);
      loadAdvisors();
    } catch (err) {
      error('Error', 'No se pudo guardar la información del asesor.');
    }
  };

  const handleDelete = async (advisor: Advisor) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar a ${advisor.name}?`)) {
      try {
        await advisorsService.deleteAdvisor(advisor.id);
        success('Eliminado', 'El asesor ha sido eliminado del equipo.');
        loadAdvisors();
      } catch (err) {
        error('Error', 'No se pudo eliminar al asesor.');
      }
    }
  };

  const toggleAdvisor = async (id: string, active: boolean) => {
    try {
      await advisorsService.toggleAdvisor(id, active);
      loadAdvisors();
      success('Estado cambiado', `El asesor está ahora ${active ? 'activo' : 'inactivo'}.`);
    } catch (err) {
      error('Error', 'No se pudo cambiar el estado del asesor.');
    }
  };

  if (isLoading && !showForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="w-10 h-10 border-4 border-mare-navy border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cargando equipo...</p>
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
            onClick={() => { setShowForm(false); setEditingAdvisor(undefined); }}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all active:scale-90"
          >
            <XCircle size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-mare-navy uppercase tracking-tight leading-none">
              {editingAdvisor ? 'Modificar Perfil' : 'Registro de Asesor'}
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
              Gestión de Atención al Cliente
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gray-50/50 rounded-full -mr-24 -mt-24 pointer-events-none"></div>
          <AdvisorForm 
            advisor={editingAdvisor}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingAdvisor(undefined);
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
          <h1 className="text-3xl font-black text-mare-navy uppercase tracking-tight">Equipo de Asesores</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black text-mare-turquoise uppercase tracking-[0.2em]">Soporte WhatsApp</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Atención Directa</span>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center rounded-2xl px-6 py-3.5 font-black uppercase tracking-widest text-[10px] bg-mare-navy hover:bg-black text-white shadow-xl shadow-mare-navy/20 transition-all active:scale-95"
        >
          <Plus size={16} className="mr-2" />
          Nuevo Asesor
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Información del Asesor</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Canal de Ventas</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Estado</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {advisors.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-100 text-gray-200">
                        <Headset size={32} />
                      </div>
                      <p className="text-xs font-black text-gray-300 uppercase tracking-[0.2em]">No hay asesores registrados</p>
                    </td>
                  </tr>
                )}
                {advisors.map((advisor, index) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={advisor.id} 
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 shrink-0 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden relative shadow-sm group-hover:scale-105 transition-transform">
                          {advisor.avatarUrl ? (
                            <img src={advisor.avatarUrl} alt={advisor.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-300">
                              <Headset size={24} />
                            </div>
                          )}
                          {!advisor.active && (
                            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-black text-mare-navy uppercase tracking-tight leading-none group-hover:text-mare-gold transition-colors">{advisor.name}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                              advisor.isPrimary ? 'bg-mare-gold/10 text-mare-gold' : 'bg-gray-100 text-gray-400'
                            }`}>
                              {advisor.isPrimary ? 'Gerente' : 'Asesor'}
                            </span>
                            {advisor.role && (
                              <span className="text-[8px] font-black uppercase tracking-widest text-mare-turquoise">
                                • {advisor.role}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                          <MessageCircle size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-mare-navy uppercase tracking-tight">WhatsApp Business</span>
                          <span className="text-[10px] font-bold text-gray-400 mt-0.5">+{advisor.whatsapp}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <button 
                        onClick={() => toggleAdvisor(advisor.id, !advisor.active)}
                        className={`inline-flex items-center px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm border ${
                        advisor.active 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                          : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100'
                      }`}>
                        {advisor.active ? (
                          <><CheckCircle size={12} className="mr-2" /> Activo</>
                        ) : (
                          <><XCircle size={12} className="mr-2" /> Inactivo</>
                        )}
                      </button>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingAdvisor(advisor); setShowForm(true); }}
                          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-mare-turquoise hover:bg-mare-turquoise/10 rounded-xl transition-all shadow-sm"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(advisor)}
                          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
