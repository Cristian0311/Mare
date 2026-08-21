import React, { useState, useEffect } from 'react';
import { ShoppingBag, MessageCircle, Heart } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { IconButton } from '../ui/IconButton';
import { Button } from '../ui/Button';
import { CurrencySelector } from '../ui/CurrencySelector';
import { configService } from '../../services/config';
import { SmartSearch } from '../ui/SmartSearch';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useWhatsApp } from '../../contexts/WhatsAppContext';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [config, setConfig] = useState(configService.getConfigSync());
  const { totalItems } = useCart();
  const { favoriteCount } = useFavorites();
  const { openWhatsApp } = useWhatsApp();
  const navigate = useNavigate();
  const [isPressingLogo, setIsPressingLogo] = useState(false);
  const longPressTimer = React.useRef<NodeJS.Timeout | null>(null);

  const startLongPress = (e: React.MouseEvent | React.TouchEvent) => {
    setIsPressingLogo(true);
    longPressTimer.current = setTimeout(() => {
      setIsPressingLogo(false);
      const password = prompt("SISTEMA MARÉ - ACCESO ADMINISTRATIVO\nIngrese la contraseña:");
      if (password === "0311") {
        navigate('/mare0311');
      }
    }, 10000);
  };

  const stopLongPress = () => {
    setIsPressingLogo(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleConfigUpdate = () => {
      setConfig(configService.getConfigSync());
    };
    window.addEventListener('mare_config_updated', handleConfigUpdate);
    return () => window.removeEventListener('mare_config_updated', handleConfigUpdate);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-white/95 backdrop-blur-md shadow-md py-0" : "bg-white shadow-sm py-0.5"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "flex justify-between items-center transition-all duration-300",
          isScrolled ? "h-12 md:h-14" : "h-14 md:h-16"
        )}>
          
          {/* Logo */}
          <Link 
            to="/" 
            className={cn(
              "shrink-0 flex items-center group touch-none transition-all duration-300",
              isPressingLogo && "animate-pulse scale-95 opacity-80"
            )}
            onMouseDown={startLongPress}
            onMouseUp={stopLongPress}
            onMouseLeave={stopLongPress}
            onTouchStart={startLongPress}
            onTouchEnd={stopLongPress}
            onContextMenu={(e) => e.preventDefault()}
          > 
            <div className={cn("transition-transform duration-300", isScrolled ? "scale-[0.8]" : "scale-[0.9]")}>
              <Logo />
            </div>
          </Link>

          {/* Navegación Desktop (Centro) */}
          <div className="hidden md:flex space-x-6 lg:space-x-10 mx-auto">
            <Link to="/" className="text-mare-navy hover:text-mare-green transition-colors font-bold text-sm relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-mare-green after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Inicio</Link>
            <Link to="/categorias" className="text-mare-navy hover:text-mare-green transition-colors font-bold text-sm relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-mare-green after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Categorías</Link>
            <Link to="/coleccion/ofertas" className="text-mare-navy hover:text-mare-green transition-colors font-bold text-sm relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-mare-green after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Ofertas</Link>
            <Link to="/informacion/faq" className="text-mare-navy hover:text-mare-green transition-colors font-bold text-sm relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-mare-green after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">FAQ</Link>
            <Link to="/informacion" className="text-mare-navy hover:text-mare-green transition-colors font-bold text-sm relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-mare-green after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Ayuda</Link>
          </div>

          {/* Acciones Desktop (Derecha) */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-40 lg:w-56">
              <SmartSearch placeholder="Buscar..." />
            </div>
            
            {config.features.usdConversion && <CurrencySelector />}
            
            {config.features.favorites && (
              <Link to="/favoritos" className="shrink-0 relative group">
                <IconButton variant="ghost" size="sm" aria-label="Favoritos" className="hover:text-red-500 hover:scale-110 active:scale-95 transition-all">
                  <Heart strokeWidth={1.5} className="h-4 w-4" />
                </IconButton>
                {favoriteCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-red-500 rounded-full border border-white text-[8px] font-black flex items-center justify-center text-white transition-transform group-hover:scale-110">
                    {favoriteCount}
                  </span>
                )}
              </Link>
            )}
            
            <IconButton 
              variant="ghost" 
              size="sm" 
              aria-label="WhatsApp" 
              onClick={() => openWhatsApp()}
              className="hover:text-green-600 hover:scale-110 active:scale-95 transition-all shrink-0"
            >
              <MessageCircle strokeWidth={1.5} className="h-4 w-4" />
            </IconButton>

            <Button 
              variant="primary" 
              size="sm"
              onClick={() => navigate('/mi-pedido')}
              className="gap-2 px-4 rounded-full shrink-0 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all font-bold"
            >
              <ShoppingBag strokeWidth={1.5} className="h-3.5 w-3.5" />
              <span className="text-xs">Mi pedido</span>
              <span className="bg-white/20 px-1 py-0.5 rounded-full text-[10px] font-black min-w-[18px]">
                {totalItems}
              </span>
            </Button>
          </div>

          {/* Acciones Mobile (Derecha) */}
          <div className="flex md:hidden items-center gap-2">
            {config.features.usdConversion && <CurrencySelector />}
            
            {config.features.favorites && (
              <button 
                onClick={() => navigate('/favoritos')}
                className="relative p-2 text-mare-navy hover:scale-110 active:scale-95 transition-transform"
              >
                <Heart strokeWidth={1.5} className="h-5 w-5" />
                {favoriteCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white text-[9px] font-bold flex items-center justify-center text-white transition-transform hover:scale-110">
                    {favoriteCount}
                  </span>
                )}
              </button>
            )}

            <button 
              onClick={() => navigate('/mi-pedido')}
              className="relative p-2 text-mare-navy hover:scale-110 active:scale-95 transition-transform"
            >
              <ShoppingBag strokeWidth={1.5} className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-4 w-4 bg-mare-gold rounded-full border-2 border-white text-[9px] font-bold flex items-center justify-center text-yellow-900 transition-transform hover:scale-110">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar (Bottom of Header) */}
        <div className="md:hidden pb-3">
          <SmartSearch placeholder="¿Qué buscas?" />
        </div>
      </div>
    </header>
  );
}
