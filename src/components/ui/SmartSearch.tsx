import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, TrendingUp, Tag, Box } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { searchProducts, suggestCategories, suggestSubcategories, suggestTags, POPULAR_SEARCHES } from '../../utils/search';
import { productService } from '../../services/products';
import { useCurrency } from '../../contexts/CurrencyContext';
import { HighlightedText } from './HighlightedText';
import { getProductPricing } from '../../utils/pricing';

interface SmartSearchProps {
  placeholder?: string;
  className?: string;
}

export function SmartSearch({ placeholder = '¿Qué estás buscando?', className = '' }: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  
  const debouncedQuery = useDebounce(query, 300);
  const { history, addSearch, removeSearch, clearHistory } = useSearchHistory();
  const [products, setProducts] = useState(productService.getProductsSync());

  useEffect(() => {
    const handleUpdate = () => setProducts(productService.getProductsSync());
    window.addEventListener('mare_products_updated', handleUpdate);
    return () => window.removeEventListener('mare_products_updated', handleUpdate);
  }, []);

  // Search results
  const productResults = debouncedQuery ? searchProducts(products, debouncedQuery).slice(0, 6) : [];
  const categoryResults = debouncedQuery ? suggestCategories(debouncedQuery).slice(0, 4) : [];
  const subcategoryResults = debouncedQuery ? suggestSubcategories(debouncedQuery).slice(0, 4) : [];
  const tagResults = debouncedQuery ? suggestTags(debouncedQuery).slice(0, 6) : [];
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    addSearch(searchTerm);
    setIsOpen(false);
    navigate(`/buscar?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const firstOption = wrapperRef.current?.querySelector('[role="option"]') as HTMLElement;
      firstOption?.focus();
    }
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const options = Array.from(wrapperRef.current?.querySelectorAll('[role="option"]') || []) as HTMLElement[];
      const currentIndex = options.indexOf(e.currentTarget);
      if (currentIndex !== -1) {
        let nextIndex = e.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex >= options.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = options.length - 1;
        options[nextIndex]?.focus();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      const input = wrapperRef.current?.querySelector('input');
      input?.focus();
    }
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center w-full">
        <div className="absolute left-4 text-gray-400 pointer-events-none">
          <Search strokeWidth={1.5} className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full min-h-[48px] rounded-full border border-gray-200 bg-gray-50 pl-11 pr-11 py-3 text-sm md:text-base text-mare-navy transition-all duration-200 placeholder:text-gray-400 focus:bg-white focus:border-mare-turquoise focus:outline-none focus:ring-4 focus:ring-mare-turquoise/10"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(true);
            }}
            className="absolute right-3 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X strokeWidth={1.5} className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-[80vh] flex flex-col animate-in fade-in slide-in-from-top-2 duration-200" role="listbox" aria-label="Sugerencias de búsqueda">
          <div className="overflow-y-auto overscroll-contain">
            {!debouncedQuery ? (
              <div className="p-4 flex flex-col gap-6">
                {history.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Búsquedas recientes</h3>
                      <button onClick={clearHistory} className="text-xs text-mare-turquoise hover:underline">Borrar todo</button>
                    </div>
                    <ul className="flex flex-col gap-1">
                      {history.map((term, i) => (
                        <li key={i} className="flex items-center justify-between group">
                          <button
                            onClick={() => handleSearch(term)}
                            className="flex items-center flex-1 gap-3 p-2 hover:bg-gray-50 rounded-lg text-left focus:bg-gray-50 focus:outline-none"
                            role="option"
                            tabIndex={-1}
                            onKeyDown={(e) => handleOptionKeyDown(e, () => handleSearch(term))}
                          >
                            <Clock strokeWidth={1.5} className="h-4 w-4 text-gray-400" />
                            <span className="text-mare-navy font-medium text-sm truncate">{term}</span>
                          </button>
                          <button
                            onClick={() => removeSearch(term)}
                            className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Eliminar ${term} del historial`}
                          >
                            <X strokeWidth={1.5} className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <TrendingUp strokeWidth={1.5} className="h-4 w-4" />
                    Tendencias
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => handleSearch(term)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none text-mare-navy rounded-full text-sm font-medium transition-colors"
                        role="option"
                        tabIndex={-1}
                        onKeyDown={(e) => handleOptionKeyDown(e, () => handleSearch(term))}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2">
                {categoryResults.length > 0 && (
                  <div className="mb-4">
                    <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Categorías</div>
                    {categoryResults.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setIsOpen(false);
                          navigate(`/categoria/${cat.slug}`);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none rounded-xl text-left transition-colors"
                        role="option"
                        tabIndex={-1}
                        onKeyDown={(e) => handleOptionKeyDown(e, () => { setIsOpen(false); navigate(`/categoria/${cat.slug}`); })}
                      >
                        <div className="bg-gray-100 p-2 rounded-lg text-gray-500">
                          <Tag strokeWidth={1.5} className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-mare-navy text-sm">
                          <HighlightedText text={cat.nombre} highlight={debouncedQuery} />
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {subcategoryResults.length > 0 && (
                  <div className="mb-4">
                    <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Subcategorías</div>
                    {subcategoryResults.map(sub => (
                      <button
                        key={sub.subcategory.id}
                        onClick={() => {
                          setIsOpen(false);
                          navigate(`/buscar?q=${encodeURIComponent(sub.subcategory.nombre)}`);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none rounded-xl text-left transition-colors"
                        role="option"
                        tabIndex={-1}
                        onKeyDown={(e) => handleOptionKeyDown(e, () => { setIsOpen(false); navigate(`/buscar?q=${encodeURIComponent(sub.subcategory.nombre)}`); })}
                      >
                        <div className="bg-gray-100 p-2 rounded-lg text-gray-500">
                          <Tag strokeWidth={1.5} className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-mare-navy text-sm">
                            <HighlightedText text={sub.subcategory.nombre} highlight={debouncedQuery} />
                          </span>
                          <span className="text-xs text-gray-400">en {sub.categoryName}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {tagResults.length > 0 && (
                  <div className="mb-4">
                    <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Etiquetas Relacionadas</div>
                    <div className="flex flex-wrap gap-2 px-3">
                      {tagResults.map((tag, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setIsOpen(false);
                            navigate(`/buscar?q=${encodeURIComponent(tag)}`);
                          }}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none text-mare-navy rounded-full text-sm font-medium transition-colors"
                          role="option"
                          tabIndex={-1}
                          onKeyDown={(e) => handleOptionKeyDown(e, () => { setIsOpen(false); navigate(`/buscar?q=${encodeURIComponent(tag)}`); })}
                        >
                          <HighlightedText text={tag} highlight={debouncedQuery} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {productResults.length > 0 ? (
                  <div>
                    <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Productos</div>
                    {productResults.map(prod => (
                      <button
                        key={prod.id}
                        onClick={() => {
                          setIsOpen(false);
                          navigate(`/producto/${prod.slug}`);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none rounded-xl text-left transition-colors"
                        role="option"
                        tabIndex={-1}
                        onKeyDown={(e) => handleOptionKeyDown(e, () => { setIsOpen(false); navigate(`/producto/${prod.slug}`); })}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={prod.imagenes[0]} alt={prod.nombre} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-semibold text-mare-navy text-sm truncate">
                            <HighlightedText text={prod.nombre} highlight={debouncedQuery} />
                          </span>
                          <div className="flex flex-col">
                            {prod.ventaMayorista?.habilitada ? (
                              <>
                                <span className="text-[9px] text-gray-500 font-medium">
                                  Unidad: {formatPrice(prod.precioMN)}
                                </span>
                                <span className="text-[10px] text-mare-green font-bold">
                                  Mayorista: {formatPrice(prod.ventaMayorista.precioMN || 0)}
                                </span>
                              </>
                            ) : (
                              <span className="text-xs text-gray-500 font-medium">
                                {formatPrice(getProductPricing(prod).finalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handleSearch(query)}
                      className="w-full mt-2 py-3 text-center text-sm font-bold text-mare-turquoise hover:bg-gray-50 focus:bg-gray-50 focus:outline-none rounded-xl transition-colors"
                      role="option"
                      tabIndex={-1}
                      onKeyDown={(e) => handleOptionKeyDown(e, () => handleSearch(query))}
                    >
                      Ver todos los resultados
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center flex flex-col items-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-3">
                      <Box strokeWidth={1.5} className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-mare-navy font-medium text-sm">No encontramos resultados para "{query}"</p>
                    <p className="text-gray-500 text-xs mt-1">Intenta con otros términos más generales.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
