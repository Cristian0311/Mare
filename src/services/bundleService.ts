import { Bundle, ProductRecommendation } from '../types/bundle';

export const bundleService = {
  async getActiveBundles(): Promise<Bundle[]> {
    // Mare no mantiene combos en una base de datos propia.
    return [];
  },
  calculateBundleAvailability(bundle: Bundle): Bundle & { availability: number; isAvailable: boolean } {
    return { ...bundle, availability: 0, isAvailable: false };
  },
  async getBundleById(): Promise<Bundle | null> {
    return null;
  },
  async getRecommendations(): Promise<ProductRecommendation[]> {
    return [];
  },
  async createBundle(): Promise<never> {
    throw new Error('Los combos se administran en el CRM.');
  }
};
