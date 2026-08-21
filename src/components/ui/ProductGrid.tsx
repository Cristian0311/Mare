import { ReactNode } from 'react';

interface ProductGridProps {
  children: ReactNode;
  className?: string;
}

export function ProductGrid({ children, className = '' }: ProductGridProps) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 ${className}`}>
      {children}
    </div>
  );
}
