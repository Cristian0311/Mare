import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionProps {
  title: string;
  children: ReactNode;
  id: string;
}

export function Accordion({ title, children, id }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left focus:outline-none group"
        aria-expanded={isOpen}
        aria-controls={id}
      >
        <span className="text-sm font-bold text-mare-navy group-hover:text-mare-green transition-colors">
          {title}
        </span>
        <div className={`p-1 rounded-full bg-gray-50 text-gray-400 group-hover:text-mare-green group-hover:bg-mare-green/5 transition-all ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="h-4 w-4" />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-sm text-gray-500 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
