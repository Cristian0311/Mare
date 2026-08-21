import { useState } from 'react';
import { Advisor } from '../../types';
import { Button } from '../../components/ui/Button';
import { MessageCircle, User, Camera } from 'lucide-react';

interface AdvisorFormProps {
  advisor?: Advisor;
  onSave: (data: Omit<Advisor, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export function AdvisorForm({ advisor, onSave, onCancel }: AdvisorFormProps) {
  const [formData, setFormData] = useState<Omit<Advisor, 'id'>>({
    name: advisor?.name || '',
    whatsapp: advisor?.whatsapp || '',
    avatarUrl: advisor?.avatarUrl || '',
    role: advisor?.role || 'Asesor de Ventas',
    active: advisor?.active !== undefined ? advisor.active : true,
    isPrimary: advisor?.isPrimary || false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-mare-navy uppercase tracking-widest ml-1">Nombre Completo</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:ring-4 focus:ring-mare-turquoise/5 focus:border-mare-turquoise outline-none transition-all uppercase tracking-tight"
              placeholder="Ej: Juan Pérez"
            />
          </div>
        </div>

        {/* WhatsApp */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-mare-navy uppercase tracking-widest ml-1">WhatsApp (Sin +)</label>
          <div className="relative">
            <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              required
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.replace(/\D/g, '') })}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:ring-4 focus:ring-mare-turquoise/5 focus:border-mare-turquoise outline-none transition-all uppercase tracking-tight"
              placeholder="5355555555"
            />
          </div>
        </div>

        {/* Role */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-mare-navy uppercase tracking-widest ml-1">Rol / Cargo</label>
          <input
            type="text"
            value={formData.role || ''}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:ring-4 focus:ring-mare-turquoise/5 focus:border-mare-turquoise outline-none transition-all uppercase tracking-tight"
            placeholder="Ej: Asesor de Ventas, Soporte Técnico"
          />
        </div>

        {/* Avatar URL */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-mare-navy uppercase tracking-widest ml-1">URL Avatar (Opcional)</label>
          <div className="relative">
            <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="url"
              value={formData.avatarUrl || ''}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:ring-4 focus:ring-mare-turquoise/5 focus:border-mare-turquoise outline-none transition-all lowercase"
              placeholder="https://ejemplo.com/avatar.jpg"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isPrimary"
            checked={formData.isPrimary}
            onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
            className="w-5 h-5 rounded-lg border-gray-300 text-mare-navy focus:ring-mare-navy"
          />
          <label htmlFor="isPrimary" className="text-[10px] font-black text-mare-navy uppercase tracking-widest cursor-pointer">
            Asesor Principal
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="active"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            className="w-5 h-5 rounded-lg border-gray-300 text-mare-navy focus:ring-mare-navy"
          />
          <label htmlFor="active" className="text-[10px] font-black text-mare-navy uppercase tracking-widest cursor-pointer">
            Cuenta Activa
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-2xl px-8 py-4 text-[10px] font-black uppercase tracking-widest"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="rounded-2xl px-12 py-4 text-[10px] font-black uppercase tracking-widest bg-mare-navy hover:bg-black"
        >
          {advisor ? 'Guardar Cambios' : 'Crear Asesor'}
        </Button>
      </div>
    </form>
  );
}
