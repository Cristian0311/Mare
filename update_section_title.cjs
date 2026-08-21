const fs = require('fs');
const content = `import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
}

export function SectionTitle({ title, subtitle, className = '', action }: SectionTitleProps) {
  return (
    <div className={\`mb-6 \${className}\`}>
      <div className="flex flex-row items-end justify-between gap-4 mb-1.5">
        <div className="flex flex-col min-w-0 flex-1">
          {subtitle && (
            <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">
              {subtitle}
            </p>
          )}
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-4 md:h-5 bg-mare-gold rounded-full shrink-0"></div>
             <h2 className="text-[16px] sm:text-lg md:text-xl font-black text-mare-navy tracking-tight uppercase leading-none truncate">
               {title}
             </h2>
          </div>
        </div>
        
        {action && (
          <div className="shrink-0 mb-0.5">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/ui/SectionTitle.tsx', content);
