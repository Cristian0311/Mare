import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { Bundle } from '../types/bundle';
import { useToast } from './ToastContext';
import { usePromotions } from './PromotionContext';
import { getProductPricing, getBundlePricing } from '../utils/pricing';
import { productService } from '../services/products';

export interface CartItem extends Partial<Product> {
  id: string;
  nombre: string;
  precioMN: number;
  imagenes: string[];
  quantity: number;
  selectedVariantId?: string;
  selectedVariantName?: string;
  isWholesale?: boolean;
  isBundle?: boolean;
  bundle?: Bundle;
  isFreeGift?: boolean;
  giftSourcePromotionId?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variantId?: string, variantName?: string, isWholesale?: boolean) => void;
  addBundle: (bundle: Bundle, quantity?: number, isWholesale?: boolean) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const getCartItemId = (item: CartItem | { id: string, selectedVariantId?: string, isWholesale?: boolean, isBundle?: boolean }) => {
  const parts = [item.id, item.selectedVariantId || ''];
  if (item.isBundle) parts.push('bundle');
  if (item.isWholesale) parts.push('wholesale');
  if (!item.isWholesale && !item.isBundle) parts.push('retail');
  return parts.join('|');
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mare-cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error parsing cart from localStorage', e);
      localStorage.removeItem('mare-cart');
      return [];
    }
  });
  const { success, info } = useToast();
  const { getBestPrice, activePromotions } = usePromotions();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.setItem('mare-cart', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [items]);

  // Handle Buy X Get Y gifts
  useEffect(() => {
    const handleGifts = async () => {
      if (!activePromotions || activePromotions.length === 0) return;

      let cartChanged = false;
      const newItems = [...items];
      
      // 1. Remove all gifts whose source is no longer valid or quantity changed
      const giftItems = items.filter(i => i.isFreeGift);
      for (const gift of giftItems) {
        const promo = activePromotions.find(p => p.id === gift.giftSourcePromotionId);
        const sourceItem = items.find(i => i.id === promo?.buy_x_product_id && !i.isFreeGift);
        
        const requiredGiftQty = sourceItem 
          ? Math.floor(sourceItem.quantity / (promo?.buy_x_quantity || 1)) * (promo?.get_y_quantity || 1)
          : 0;

        if (requiredGiftQty === 0) {
          const idx = newItems.findIndex(i => i.id === gift.id && i.isFreeGift && i.giftSourcePromotionId === gift.giftSourcePromotionId);
          if (idx > -1) {
            newItems.splice(idx, 1);
            cartChanged = true;
          }
        } else if (gift.quantity !== requiredGiftQty) {
          const idx = newItems.findIndex(i => i.id === gift.id && i.isFreeGift && i.giftSourcePromotionId === gift.giftSourcePromotionId);
          if (idx > -1) {
            newItems[idx] = { ...newItems[idx], quantity: requiredGiftQty };
            cartChanged = true;
          }
        }
      }

      // 2. Add missing gifts
      for (const promo of activePromotions) {
        if (promo.type !== 'buy_x_get_y' || promo.status !== 'active') continue;
        
        const sourceItem = items.find(i => i.id === promo.buy_x_product_id && !i.isFreeGift);
        if (!sourceItem) continue;

        const requiredGiftQty = Math.floor(sourceItem.quantity / (promo.buy_x_quantity || 1)) * (promo.get_y_quantity || 1);
        if (requiredGiftQty <= 0) continue;

        const existingGift = items.find(i => i.id === promo.get_y_product_id && i.isFreeGift && i.giftSourcePromotionId === promo.id);
        
        if (!existingGift) {
          try {
            const giftProduct = await productService.getProductById(promo.get_y_product_id!);
            if (giftProduct) {
              newItems.push({
                ...giftProduct,
                id: giftProduct.id!,
                nombre: giftProduct.nombre!,
                precioMN: 0, 
                imagenes: giftProduct.imagenes || [],
                quantity: requiredGiftQty,
                isFreeGift: true,
                giftSourcePromotionId: promo.id
              });
              cartChanged = true;
            }
          } catch (e) {
            console.error('Error adding free gift', e);
          }
        }
      }

      if (cartChanged) {
        setItems(newItems);
      }
    };

    handleGifts();
  }, [items, activePromotions]);

  const addItem = useCallback((product: Product, quantity = 1, variantId?: string, variantName?: string, isWholesale = false) => {
    setItems(prev => {
      // Un item es el mismo si tiene el mismo ID de producto, variante y modo (detalle/mayorista/reserva)
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && 
        item.selectedVariantId === variantId &&
        item.isWholesale === isWholesale
      );

      if (existingIndex !== -1) {
        const newItems = [...prev];
        newItems[existingIndex] = { 
          ...newItems[existingIndex], 
          quantity: newItems[existingIndex].quantity + quantity 
        };
        return newItems;
      }

      return [...prev, { 
        ...product, 
        quantity, 
        selectedVariantId: variantId,
        selectedVariantName: variantName,
        isWholesale,
      }];
    });

    // Notificación única centralizada
    success(
'✓ AGREGADO A MI PEDIDO',
      `${quantity}x ${product.nombre}${isWholesale ? ' (Mayorista)' : ''}`,
      {
        label: 'VER PEDIDO',
        onClick: () => navigate('/mi-pedido')
      }
    );
  }, [success, navigate]);

  const addBundle = useCallback((bundle: Bundle, quantity = 1, isWholesale = false) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => 
        item.id === bundle.id && 
        item.isBundle === true &&
        item.isWholesale === isWholesale
      );

      if (existingIndex !== -1) {
        const newItems = [...prev];
        newItems[existingIndex] = { 
          ...newItems[existingIndex], 
          quantity: newItems[existingIndex].quantity + quantity 
        };
        return newItems;
      }

      const cartItem: CartItem = {
        id: bundle.id,
        nombre: bundle.name,
        precioMN: bundle.price_value,
        imagenes: bundle.image_url ? [bundle.image_url] : [],
        quantity,
        isWholesale,
        isBundle: true,
        bundle: bundle,
        categoria: 'Combo'
      } as CartItem;

      return [...prev, cartItem];
    });

    success(
      '✓ AGREGADO AL PEDIDO',
      `${quantity}x ${bundle.name}${isWholesale ? ' (Mayorista)' : ''}`,
      {
        label: 'VER PEDIDO',
        onClick: () => navigate('/mi-pedido')
      }
    );
  }, [success, navigate]);

  const removeItem = useCallback((cartItemId: string) => {
    setItems(prev => prev.filter(item => getCartItemId(item) !== cartItemId));
    info('Producto eliminado');
  }, [info]);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => {
      const itemToUpdate = prev.find(item => getCartItemId(item) === cartItemId);
      if (!itemToUpdate) return prev;

      // Logic for wholesale conversion if quantity drops below minimum
      if (itemToUpdate.isWholesale && itemToUpdate.ventaMayorista && quantity < itemToUpdate.ventaMayorista.cantidadMinima) {
        // If it's a "Solo Mayorista" product (retail price is 0), don't allow dropping below minimum
        if (itemToUpdate.precioMN === 0) {
          return prev.map(item => getCartItemId(item) === cartItemId ? { ...item, quantity: itemToUpdate.ventaMayorista!.cantidadMinima } : item);
        }

        const retailItemId = getCartItemId({ ...itemToUpdate, isWholesale: false });
        const existingRetailIndex = prev.findIndex(item => getCartItemId(item) === retailItemId);

        if (existingRetailIndex !== -1) {
          // Merge with existing retail item and remove wholesale item
          const filtered = prev.filter(item => getCartItemId(item) !== cartItemId);
          return filtered.map((item, idx) => 
            idx === (existingRetailIndex < prev.indexOf(itemToUpdate) ? existingRetailIndex : existingRetailIndex - 1)
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Convert current item to retail
          return prev.map(item => getCartItemId(item) === cartItemId ? { ...item, quantity, isWholesale: false } : item);
        }
      }

      return prev.map(item => getCartItemId(item) === cartItemId ? { ...item, quantity } : item);
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    info('Pedido vaciado');
  }, [info]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = items.reduce((sum, item) => {
    if (item.isBundle && item.bundle) {
      const pricing = getBundlePricing(item.bundle, !!item.isWholesale);
      return sum + (pricing.finalPrice * item.quantity);
    }

    const pricing = getBestPrice(item as Product, item.quantity, !!item.isWholesale);
    const units = (item.isWholesale && item.ventaMayorista?.unidadesPorPresentacion) 
      ? item.quantity * item.ventaMayorista.unidadesPorPresentacion
      : item.quantity;
    
    return sum + (pricing.finalPrice * units);
  }, 0);

  return (
    <CartContext.Provider value={{ items, addItem, addBundle, removeItem, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
