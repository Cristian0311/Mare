import React from 'react';
import { Home, Grid, ShoppingBag, MessageCircle, Heart } from 'lucide-react';
import { appConfig } from '../../config';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';

import { motion } from 'framer-motion';
import { useWhatsApp } from '../../contexts/WhatsAppContext';

export function MobileNav() {
  const location = useLocation();
  const { totalItems } = useCart();
  const { favoriteCount } = useFavorites();
  const { openWhatsApp } = useWhatsApp();
  const isHome = location.pathname === '/';
  const isCategories = location.pathname.startsWith('/categoria') || location.pathname === '/categorias';
  const isCart = location.pathname === '/mi-pedido';
  const isFavorites = location.pathname === '/favoritos';
  const isInfo = location.pathname.startsWith('/informacion');

  const NavItem = ({ to, icon: Icon, label, isActive, badge }: any) => (
    <motion.div whileTap={{ scale: 0.9 }}>
      <Link to={to} className={`flex flex-col items-center justify-center h-full transition-colors ${isActive ? 'text-mare-green font-black' : 'text-gray-400 hover:text-mare-navy font-bold'}`}>
        <div className="relative">
          <Icon strokeWidth={isActive ? 2.5 : 1.8} className="h-5 w-5 mb-1" />
          {badge > 0 && (
            <span className="absolute -top-1 -right-2 bg-mare-gold text-yellow-950 text-[8px] font-black px-1.5 py-0.2 rounded-full border border-white min-w-[16px] text-center shadow-xs">
              {badge}
            </span>
          )}
        </div>
        <span className="text-[9px] uppercase tracking-wider">{label}</span>
      </Link>
    </motion.div>
  );

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto">
        <NavItem to="/" icon={Home} label="Inicio" isActive={isHome} />
        <NavItem to="/categorias" icon={Grid} label="Explorar" isActive={isCategories} />
        <NavItem to="/favoritos" icon={Heart} label="Favoritos" isActive={isFavorites} badge={favoriteCount} />
        <NavItem to="/mi-pedido" icon={ShoppingBag} label="Pedido" isActive={isCart} badge={totalItems} />

        <motion.div whileTap={{ scale: 0.9 }}>
          <button 
            onClick={() => openWhatsApp()}
            className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-green-600 font-bold transition-colors"
          >
            <MessageCircle strokeWidth={1.8} className="h-5 w-5 mb-1 text-green-600" />
            <span className="text-[9px] uppercase tracking-wider text-green-700 font-extrabold">WhatsApp</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

