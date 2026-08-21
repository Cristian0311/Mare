import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import { Shield, Plus, Mail, Trash2, Edit2, ShieldAlert } from 'lucide-react';

export function AdminAdministrators() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      // Usaremos admin_users si existe, si no, intentaremos simularlo
      const { data, error } = await supabase.from('admin_users').select('*');
      if (error && error.code !== '42P01') {
        console.error("Error loading admins", error);
      } else {
        setAdmins(data || []);
      }
    } catch (err) {
      console.error("Error in loadAdmins", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-mare-navy uppercase tracking-tight">Administradores</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Gestiona los accesos al panel.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-mare-navy text-white px-4 py-2 rounded-xl font-bold hover:bg-mare-navy/90 transition-colors w-full sm:w-auto">
          <Plus size={20} />
          <span>Nuevo Admin</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 font-medium">Cargando...</div>
        ) : admins.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
              <Shield className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-mare-navy uppercase tracking-tight">No hay datos</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-sm">No se encontraron registros de administradores.</p>
          </div>
        ) : (
          <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {admins.map((admin) => (
              <div key={admin.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-1">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-mare-gold/10 text-mare-gold flex items-center justify-center font-black text-lg uppercase">
                    {admin.name?.charAt(0) || 'A'}
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-mare-navy text-sm uppercase tracking-tight truncate">
                      {admin.name}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 mt-1 flex items-center gap-1 truncate">
                      <Mail size={12} className="shrink-0" />
                      <span className="truncate">{admin.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-mare-navy/5 text-mare-navy border border-mare-navy/10">
                    {admin.role || 'Admin'}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-mare-turquoise/10 text-mare-turquoise hover:bg-mare-turquoise/20 font-black uppercase tracking-widest text-[9px] rounded-lg transition-colors">
                      <Edit2 size={14} />
                      Editar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 hover:bg-red-100 font-black uppercase tracking-widest text-[9px] rounded-lg transition-colors">
                      <Trash2 size={14} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
