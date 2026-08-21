import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { productService } from '../services/products';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  favoriteCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
const STORAGE_KEY = 'mare_favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar favoritos al iniciar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as string[];
        // Purge IDs of products that no longer exist or are inactive
        const products = productService.getProductsSync();
        const validIds = parsed.filter(id => products.some(p => p.id === id && p.activo !== false));
        setFavorites(validIds);
      } catch (e) {
        console.error('Error parsing favorites', e);
        setFavorites([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Escuchar cambios en productos para purgar favoritos si un producto se elimina o desactiva
  useEffect(() => {
    const handleProductsUpdate = () => {
      const products = productService.getProductsSync();
      setFavorites(prev => prev.filter(id => products.some(p => p.id === id && p.activo !== false)));
    };
    window.addEventListener('mare_products_updated', handleProductsUpdate);
    return () => window.removeEventListener('mare_products_updated', handleProductsUpdate);
  }, []);

  // Guardar en localStorage cuando cambien
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const addFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.includes(id) ? prev : [id, ...prev]);
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(fid => fid !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fid => fid !== id) 
        : [id, ...prev]
    );
  }, []);

  const isFavorite = useCallback((id: string) => {
    return favorites.includes(id);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      addFavorite, 
      removeFavorite, 
      toggleFavorite, 
      isFavorite,
      favoriteCount: favorites.length
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
