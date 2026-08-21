import { Shield, Clock, Phone } from 'lucide-react';
import { configService } from './services/config';

export function MaintenanceScreen() {
  const config = configService.getConfigSync();
  const { maintenance, store } = config;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-mare-navy/5 rounded-full scale-150 animate-pulse"></div>
            <img src={maintenance.image || store.logo} alt="MARÉ" className="w-24 h-24 relative rounded-full object-cover shadow-lg border border-gray-100" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter sm:text-3xl">
            {maintenance.title}
          </h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            {maintenance.message}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-8">
          <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
            <Clock size={20} className="mx-auto mb-2 text-mare-navy" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiempo Estimado</p>
            <p className="text-sm font-black text-gray-900 mt-1">{maintenance.estimatedTime}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
            <Shield size={20} className="mx-auto mb-2 text-mare-navy" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Seguridad</p>
            <p className="text-sm font-black text-gray-900 mt-1">Garantizada</p>
          </div>
        </div>

        <div className="pt-4 border-t border-dashed border-gray-200">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">¿Necesitas algo urgente?</p>
          <a 
            href={`https://wa.me/${store.contact.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-mare-navy text-white rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-mare-navy/10"
          >
            <Phone size={14} />
            Contactar por WhatsApp
          </a>
        </div>

        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest pt-8">
          &copy; {new Date().getFullYear()} {store.name} - Cuba
        </p>
      </div>
    </div>
  );
}
