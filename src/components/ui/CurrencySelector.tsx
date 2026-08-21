import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { currencies, CurrencyCode } from '../../config/currency';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

export function CurrencySelector() {
  const { currency: currentCurrency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mare-turquoise/50",
          isOpen ? "bg-gray-100 shadow-inner" : "bg-gray-50 hover:bg-gray-100"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Seleccionar moneda"
      >
        <span className="text-base leading-none">{currencies[currentCurrency].flag}</span>
        <span className="text-[11px] font-black text-mare-navy tracking-tight">{currencies[currentCurrency].label}</span>
        <ChevronDown className={cn(
          "h-3 w-3 text-gray-400 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-[60] overflow-hidden"
            role="listbox"
          >
            {(Object.keys(currencies) as CurrencyCode[]).map((code) => (
              <button
                key={code}
                onClick={() => handleSelect(code)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-left transition-colors",
                  currentCurrency === code 
                    ? "bg-mare-green/5 text-mare-green" 
                    : "text-mare-navy hover:bg-gray-50"
                )}
                role="option"
                aria-selected={currentCurrency === code}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{currencies[code].flag}</span>
                  <span className="text-[11px] font-black">{currencies[code].label}</span>
                </div>
                {currentCurrency === code && (
                  <Check className="h-3 w-3 stroke-[3]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
