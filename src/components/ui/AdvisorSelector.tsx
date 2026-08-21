import { useState, useEffect } from 'react';
import { Advisor } from '../../types';
import { advisorsService } from '../../services/advisors';
import { Check, User, Info, MessageCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

interface AdvisorSelectorProps {
  onSelect: (advisor: Advisor) => void;
}

export function AdvisorSelector({ onSelect }: AdvisorSelectorProps) {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const loadAdvisors = async () => {
      const active = await advisorsService.getActiveAdvisors();
      setAdvisors(active);
    };

    loadAdvisors();
    
    const handleUpdate = async () => {
      const active = await advisorsService.getActiveAdvisors();
      setAdvisors(active);
    };
    
    window.addEventListener('mare_advisors_updated', handleUpdate);
    return () => window.removeEventListener('mare_advisors_updated', handleUpdate);
  }, []);

  const handleSelect = (advisor: Advisor) => {
    setSelectedId(advisor.id);
    onSelect(advisor);
  };

  if (advisors.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 text-center">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Info className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-xs text-mare-navy/60 font-bold uppercase tracking-widest mb-1">Sin asesores activos</p>
        <p className="text-[10px] text-gray-400 font-medium">Tu pedido se enviará al número principal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-1 mb-2">
        <span className="text-[9px] font-black text-mare-navy/40 uppercase tracking-[0.3em]">Atención Personalizada</span>
        <h3 className="text-sm font-black text-mare-navy uppercase tracking-tight">
          Selecciona tu Asesor
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {advisors.map((advisor, index) => (
          <motion.button
            key={advisor.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.3 }}
            onClick={() => handleSelect(advisor)}
            className={cn(
              "relative flex flex-col items-center p-5 rounded-[2rem] border transition-all duration-300 group overflow-hidden",
              selectedId === advisor.id 
                ? "border-mare-green bg-white shadow-xl shadow-mare-green/10 ring-2 ring-mare-green/20 scale-[1.02]" 
                : "border-gray-100 bg-white hover:border-mare-navy/20 hover:shadow-lg hover:shadow-gray-200/50"
            )}
          >
            {/* Selection Checkmark Badge */}
            <div className={cn(
              "absolute top-3.5 right-3.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10",
              selectedId === advisor.id 
                ? "bg-mare-green border-mare-green scale-110 shadow-md shadow-mare-green/20" 
                : "bg-white border-gray-100 scale-100 group-hover:border-gray-200"
            )}>
              {selectedId === advisor.id ? (
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />
              ) : (
                <div className="w-2 h-2 rounded-full bg-gray-200 group-hover:bg-gray-300" />
              )}
            </div>
            
            {/* Vector Avatar Container */}
            <div className="relative mb-4 mt-1">
              <div className={cn(
                "w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 p-1 bg-gradient-to-b from-gray-50 to-white transition-all duration-300 shadow-inner",
                selectedId === advisor.id ? "border-mare-green/30" : "border-gray-100 group-hover:border-mare-navy/10"
              )}>
                {advisor.avatarUrl ? (
                  <img 
                    src={advisor.avatarUrl} 
                    alt={advisor.name}
                    className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-mare-navy/5 rounded-full flex items-center justify-center text-mare-navy/30">
                    <User className="w-10 h-10" />
                  </div>
                )}
              </div>
              
              {/* Online status badge */}
              <div className="absolute bottom-0 right-0 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0"></span>
                <span className="text-[8px] font-black text-green-600 uppercase tracking-wider">Activo</span>
              </div>
            </div>
            
            <div className="text-center w-full px-1">
              <h4 className="font-black text-mare-navy text-xs md:text-sm tracking-tight mb-0.5 line-clamp-1">{advisor.name}</h4>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                {advisor.role || 'Asesor de Ventas'}
              </p>
              
              <div className={cn(
                "inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-colors w-full",
                selectedId === advisor.id
                  ? "bg-mare-green text-white shadow-sm"
                  : "bg-gray-50 text-mare-navy/70 group-hover:bg-mare-navy group-hover:text-white"
              )}>
                <MessageCircle size={10} className="shrink-0" />
                <span>Atención WhatsApp</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
      
      <div className="bg-gray-50/70 rounded-2xl p-4 border border-dashed border-gray-200 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm text-mare-navy">
          <Info size={15} />
        </div>
        <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
          Tu asesor asignado te asistirá personalmente vía WhatsApp con el pago, dudas sobre los productos y la entrega.
        </p>
      </div>
    </div>
  );
}
