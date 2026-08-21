import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  isLoading = false,
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-mare-green text-white hover:bg-mare-turquoise shadow-sm shadow-mare-green/20 hover:shadow-md",
    secondary: "bg-mare-navy text-white hover:bg-gray-800 shadow-sm hover:shadow-md",
    outline: "border-2 border-gray-200 text-mare-navy hover:border-mare-green hover:text-mare-green bg-transparent",
    ghost: "bg-transparent text-mare-navy hover:bg-gray-100",
  };
  
  const sizes = {
    sm: "py-2 px-4 text-sm min-h-[36px]",
    md: "py-3 px-6 text-base min-h-[44px]", // 44px min for touch targets
    lg: "py-4 px-8 text-lg min-h-[52px]",
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Cargando...</span>
        </div>
      ) : children}
    </button>
  );
}
