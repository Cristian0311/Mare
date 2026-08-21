import { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function IconButton({ 
  children, 
  variant = 'ghost', 
  size = 'md',
  className = '',
  ...props 
}: IconButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-full transition-all duration-200 active:scale-[0.95] disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-mare-green text-white hover:bg-mare-turquoise shadow-sm hover:shadow-md",
    secondary: "bg-mare-navy text-white hover:bg-gray-800 shadow-sm",
    outline: "border-2 border-gray-200 text-mare-navy hover:border-mare-green hover:text-mare-green bg-transparent",
    ghost: "bg-transparent text-mare-navy hover:bg-gray-100",
  };
  
  const sizes = {
    sm: "p-2 min-w-[36px] min-h-[36px]",
    md: "p-2.5 min-w-[44px] min-h-[44px]", // 44px min touch target
    lg: "p-3.5 min-w-[52px] min-h-[52px]",
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
