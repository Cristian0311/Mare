import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col w-full ${className}`}>
        {label && (
          <label className="text-sm font-semibold text-mare-navy mb-1.5 ml-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            className={`w-full min-h-[48px] appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-base text-mare-navy transition-all duration-200 focus:border-mare-turquoise focus:outline-none focus:ring-4 focus:ring-mare-turquoise/10 disabled:bg-gray-50 disabled:text-gray-500
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : ''}
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 text-gray-400 pointer-events-none">
            <ChevronDown className="h-5 w-5" />
          </div>
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500 ml-1 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
