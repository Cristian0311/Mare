import { Truck } from 'lucide-react';
import { CheckoutData } from '../../hooks/useCheckoutForm';
import { cn } from '../../utils/cn';

interface DeliveryOptionsProps {
  metodo: 'domicilio' | 'recogida';
  onChange: (value: 'domicilio' | 'recogida') => void;
}

export function DeliveryOptions({ metodo, onChange }: DeliveryOptionsProps) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-mare-navy/5 rounded-lg">
          <Truck className="w-4 h-4 text-mare-navy" />
        </div>
        <h2 className="text-sm font-black text-mare-navy uppercase tracking-tight">04 — ENTREGA</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange('domicilio')}
          className={cn(
            "flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
            metodo === 'domicilio' 
              ? "border-mare-green bg-mare-green/5" 
              : "border-gray-100 bg-white hover:border-gray-200"
          )}
        >
          <div className="flex flex-col">
            <span className="text-xs font-black text-mare-navy uppercase tracking-tight">A domicilio</span>
            <span className="text-[10px] text-gray-400 font-bold mt-0.5">Recibe en tu puerta</span>
          </div>
          <div className={cn(
            "w-4 h-4 rounded-full border-2 flex items-center justify-center",
            metodo === 'domicilio' ? "border-mare-green bg-mare-green" : "border-gray-200"
          )}>
            {metodo === 'domicilio' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange('recogida')}
          className={cn(
            "flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
            metodo === 'recogida' 
              ? "border-mare-green bg-mare-green/5" 
              : "border-gray-100 bg-white hover:border-gray-200"
          )}
        >
          <div className="flex flex-col">
            <span className="text-xs font-black text-mare-navy uppercase tracking-tight">Recogida</span>
            <span className="text-[10px] text-gray-400 font-bold mt-0.5">Ven por tu pedido</span>
          </div>
          <div className={cn(
            "w-4 h-4 rounded-full border-2 flex items-center justify-center",
            metodo === 'recogida' ? "border-mare-green bg-mare-green" : "border-gray-200"
          )}>
            {metodo === 'recogida' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
          </div>
        </button>
      </div>
    </section>
  );
}
