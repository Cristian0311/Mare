import { Promotion, PromotionCode } from '../types/promotion';

export const promotionService = {
  async getActivePromotions(): Promise<Promotion[]> {
    // Promotions are not maintained in Mare. Retail price comes from the CRM product.
    return [];
  },
  async getAdminPromotions(): Promise<Promotion[]> {
    return [];
  },
  async createPromotion(): Promise<never> {
    throw new Error('Las promociones se administran en el CRM.');
  },
  async updatePromotionStatus(): Promise<never> {
    throw new Error('Las promociones se administran en el CRM.');
  },
  async getCoupons(): Promise<PromotionCode[]> {
    return [];
  },
  async validateCoupon(): Promise<{ valid: boolean; error?: string }> {
    return { valid: false, error: 'Los cupones no están habilitados en Mare.' };
  }
};
