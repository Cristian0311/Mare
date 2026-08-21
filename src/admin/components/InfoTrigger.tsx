import React, { useState, useRef, useEffect } from 'react';
import createPortal from 'react-dom';
import { HelpCircle, X, Info } from 'lucide-react';

interface InfoTriggerProps {
  text: string;
  title?: string;
}

export function InfoTrigger({ text, title }: InfoTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const toggleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Calculate coordinates relative to viewport
      setCoords({
        top: rect.bottom + window.scrollY + 6,
        left: Math.min(Math.max(16, rect.left - 120), window.innerWidth - 290)
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <span className="inline-flex items-center align-middle ml-1 relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleOpen}
        onMouseEnter={() => {
          if (buttonRef.current && !isOpen) {
            const rect = buttonRef.current.getBoundingClientRect();
            setCoords({
              top: rect.bottom + window.scrollY + 6,
              left: Math.min(Math.max(16, rect.left - 120), window.innerWidth - 290)
            });
          }
        }}
        className="text-gray-400 hover:text-mare-turquoise p-0.5 rounded-full hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-mare-turquoise/40 shrink-0"
        title="Ver ayuda"
        aria-label="Información de ayuda"
      >
        <HelpCircle size={15} className="text-gray-400 hover:text-mare-turquoise" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop to capture clicks and close */}
          <div 
            className="fixed inset-0 z-[99990] bg-black/20 backdrop-blur-[1px] md:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />

          {/* Modal / Popover card */}
          <div 
            className="fixed z-[99999] w-[280px] sm:w-[320px] bg-mare-navy text-white text-xs rounded-2xl p-4 shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-150"
            style={{
              top: Math.min(coords.top, window.innerHeight + window.scrollY - 180),
              left: Math.max(12, Math.min(coords.left, window.innerWidth - 300)),
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2 mb-2 pb-1.5 border-b border-white/10">
              <span className="font-black uppercase tracking-wider text-[10px] text-mare-gold flex items-center gap-1.5">
                <Info size={13} className="text-mare-gold shrink-0" />
                {title || 'Información de ayuda'}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Cerrar"
              >
                <X size={14} />
              </button>
            </div>
            <p className="leading-relaxed font-semibold text-gray-200 text-[11px] break-words">
              {text}
            </p>
          </div>
        </>
      )}
    </span>
  );
}
