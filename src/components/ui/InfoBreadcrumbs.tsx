import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface InfoBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function InfoBreadcrumbs({ items }: InfoBreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 overflow-x-auto whitespace-nowrap pb-1 no-scrollbar">
      <Link to="/" className="hover:text-mare-navy transition-colors">Inicio</Link>
      <ChevronRight className="h-3 w-3 flex-shrink-0" />
      <Link to="/informacion" className="hover:text-mare-navy transition-colors">Información</Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          {item.path ? (
            <Link to={item.path} className="hover:text-mare-navy transition-colors">{item.name}</Link>
          ) : (
            <span className="text-mare-navy">{item.name}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
