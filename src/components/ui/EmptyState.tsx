import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-gray-50 border border-dashed border-gray-200", className)}
    >
      <div className="text-gray-400 mb-4 bg-white p-4 rounded-full shadow-sm hover:scale-110 hover:text-mare-green transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-mare-navy mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-6">{description}</p>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
