import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col w-full ${className}`}>
        {label && (
          <label className="text-sm font-semibold text-mare-navy mb-1.5 ml-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-4 text-gray-400 flex items-center justify-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`w-full min-h-[48px] rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-mare-navy transition-all duration-200 placeholder:text-gray-400 focus:border-mare-turquoise focus:outline-none focus:ring-4 focus:ring-mare-turquoise/10 disabled:bg-gray-50 disabled:text-gray-500
              ${leftIcon ? 'pl-11' : ''} 
              ${rightIcon ? 'pr-11' : ''}
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : ''}
            `}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-4 text-gray-400 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500 ml-1 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
