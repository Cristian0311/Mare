
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Promotion } from '../types/promotion';
import { promotionService } from '../services/promotion';
import { getProductPricing, PricingDetails } from '../utils/pricing';

interface PromotionContextType {
  activePromotions: Promotion[];
  isLoading: boolean;
  refreshPromotions: () => Promise<void>;
  getBestPrice: (product: any, quantity: number, isWholesale: boolean) => PricingDetails;
}

const PromotionContext = createContext<PromotionContextType | undefined>(undefined);

export function PromotionProvider({ children }: { children: ReactNode }) {
  const [activePromotions, setActivePromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshPromotions = async () => {
    setIsLoading(true);
    try {
      const data = await promotionService.getActivePromotions();
      setActivePromotions(data);
    } catch (e) {
      console.error('Error refreshing promotions:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPromotions();
  }, []);

  const getBestPrice = useCallback((product: any, quantity: number, isWholesale: boolean) => {
    return getProductPricing(product, quantity, isWholesale, activePromotions);
  }, [activePromotions]);

  return (
    <PromotionContext.Provider value={{ activePromotions, isLoading, refreshPromotions, getBestPrice }}>
      {children}
    </PromotionContext.Provider>
  );
}

export function usePromotions() {
  const context = useContext(PromotionContext);
  if (context === undefined) {
    throw new Error('usePromotions must be used within a PromotionProvider');
  }
  return context;
}
