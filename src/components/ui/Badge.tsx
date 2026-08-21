import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gold' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const baseStyles = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap max-w-full truncate";
  
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-mare-green/10 text-mare-green",
    warning: "bg-orange-100 text-orange-700",
    error: "bg-red-100 text-red-700",
    gold: "bg-mare-gold/20 text-yellow-800",
    outline: "border border-gray-200 text-gray-600 bg-transparent",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
