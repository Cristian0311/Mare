import { appConfig } from '../../config';

interface LogoProps {
  variant?: 'full' | 'symbol' | 'compact';
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  isWhite?: boolean;
}

export function Logo({ variant = 'full', className = '', iconClassName = '', textClassName = '', isWhite = false }: LogoProps) {
  const symbol = (
    <div className={`relative ${iconClassName}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* The 'M' Shape */}
        <path
          d="M15 85V25L50 60L85 25V85"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isWhite ? 'text-white' : 'text-mare-green'}
        />
        {/* The Wave */}
        <path
          d="M5 75C25 60 45 90 65 75C85 60 100 75 100 75"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className={isWhite ? 'text-white/80' : 'text-mare-turquoise'}
        />
      </svg>
    </div>
  );

  if (variant === 'symbol') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="h-10 w-10">
          {symbol}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={variant === 'compact' ? 'h-7 w-7' : 'h-10 w-10'}>
        {symbol}
      </div>
      <div className="flex flex-col -gap-1">
        <span className={`${variant === 'compact' ? 'text-lg' : 'text-2xl'} font-black tracking-[0.1em] ${isWhite ? 'text-white' : 'text-mare-navy'} leading-none ${textClassName}`}>
          {appConfig.tiendaNombre}
        </span>
        {variant === 'full' && (
          <span className={`text-[7px] font-black tracking-[0.3em] uppercase mt-0.5 ${isWhite ? 'text-white/60' : 'text-mare-green'}`}>
            TODO LO QUE BUSCAS
          </span>
        )}
      </div>
    </div>
  );
}
