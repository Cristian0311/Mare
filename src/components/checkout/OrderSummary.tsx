import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCurrency } from '../../contexts/CurrencyContext';
import { cn } from '../../utils/cn';

interface OrderSummaryProps {
  subtotal: number;
  deliveryCost: number;
  discount?: number;
  isValid: boolean;
  onReview: () => void;
  isSubmitting?: boolean;
  step?: number;
}

export function OrderSummary({ 
  subtotal, 
  deliveryCost, 
  discount = 0,
  isValid, 
  onReview, 
  isSubmitting, 
  step = 1 
}: OrderSummaryProps) {
  const { formatPrice } = useCurrency();

  const finalTotal = Math.max(0, subtotal - discount) + deliveryCost;

  return (
    <div className="bg-mare-navy rounded-2xl p-6 text-white shadow-xl shadow-mare-navy/20">
      <h3 className="text-[11px] font-black text-mare-gold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
        <div className="w-1 h-3 bg-mare-gold rounded-full"></div>
        Resumen Final
      </h3>

      <div className="space-y-3 mb-8">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-white/60">Subtotal</span>
          <span className="font-black text-white">{formatPrice(subtotal)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between items-center text-xs animate-in slide-in-from-right-2 duration-300">
            <span className="font-bold text-white/60">Descuento</span>
            <span className="font-black text-mare-gold">- {formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-white/60">Entrega</span>
          <span className="font-black text-mare-green uppercase italic tracking-widest">
            {deliveryCost > 0 ? `+ ${formatPrice(deliveryCost)}` : 'Pendiente'}
          </span>
        </div>

        <div className="pt-4 border-t border-white/10 mt-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-mare-gold uppercase tracking-widest mb-1">Total a pagar hoy</p>
              <p className="text-3xl font-black text-white tracking-tighter">
                {formatPrice(finalTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Button 
        id="btn-confirm-order"
        type="button"
        variant="primary" 
        fullWidth 
        disabled={!isValid || isSubmitting}
        onClick={onReview}
        className={cn(
          "h-14 rounded-xl font-black tracking-[0.1em] text-[11px] sm:text-xs gap-3 shadow-lg transition-all",
          isValid ? "shadow-mare-green/20" : "opacity-50 grayscale cursor-not-allowed"
        )}
      >
        {isSubmitting ? (
          'ABRIENDO WHATSAPP...'
        ) : step === 1 ? (
          <>
            {isValid ? 'REVISAR PEDIDO' : 'COMPLETA TUS DATOS'}
            <ArrowLeft strokeWidth={1.5} className="w-4 h-4 rotate-180" />
          </>
        ) : (
          <>
            CONFIRMAR POR WHATSAPP
            <ArrowLeft strokeWidth={1.5} className="w-4 h-4 rotate-180" />
          </>
        )}
      </Button>
    </div>
  );
}
