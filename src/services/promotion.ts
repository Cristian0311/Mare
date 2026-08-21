
import { supabase, isConfigured } from '../lib/supabase/client';
import { Promotion, Campaign, PromotionCode } from '../types/promotion';

export const promotionService = {
  async getActivePromotions(): Promise<Promotion[]> {
    if (!isConfigured) return [];
    
    const { data, error } = await supabase
      .from('promotions')
      .select('*, promotion_products(product_id)')
      .eq('status', 'active');
    
    if (error) {
      if (error.message && error.code !== 'PGRST205' && !error.message.includes('schema cache')) {
        console.error('Error fetching active promotions:', error);
      }
      return [];
    }
    
    return data.map(p => ({
      ...p,
      products: p.promotion_products?.map((pp: any) => pp.product_id) || []
    }));
  },

  async getAdminPromotions(): Promise<Promotion[]> {
    if (!isConfigured) return [];

    const { data, error } = await supabase
      .from('promotions')
      .select('*, promotion_products(product_id)')
      .order('created_at', { ascending: false });
    
    if (error) {
      if (error.message && error.code !== 'PGRST205' && !error.message.includes('schema cache')) {
        console.error('Error fetching admin promotions:', error);
      }
      return [];
    }
    
    return data.map(p => ({
      ...p,
      products: p.promotion_products?.map((pp: any) => pp.product_id) || []
    }));
  },

  async createPromotion(promotion: Partial<Promotion>, productIds?: string[]): Promise<Promotion> {
    const { data: promo, error: promoError } = await supabase
      .from('promotions')
      .insert([{
        name: promotion.name,
        description: promotion.description,
        type: promotion.type,
        value: promotion.value,
        min_quantity: promotion.min_quantity || 1,
        max_quantity: promotion.max_quantity,
        start_date: promotion.start_date,
        end_date: promotion.end_date,
        status: promotion.status || 'draft',
        apply_to: promotion.apply_to || 'retail',
        usage_limit: promotion.usage_limit,
        campaign_id: promotion.campaign_id
      }])
      .select()
      .maybeSingle();

    if (promoError) throw promoError;

    if (productIds && productIds.length > 0) {
      const items = productIds.map(pid => ({
        promotion_id: promo.id,
        product_id: pid
      }));
      const { error: itemsError } = await supabase
        .from('promotion_products')
        .insert(items);
      if (itemsError) throw itemsError;
    }

    return { ...promo, products: productIds || [] };
  },

  async updatePromotionStatus(id: string, status: Promotion['status']): Promise<void> {
    const { error } = await supabase
      .from('promotions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  },

  async getCoupons(): Promise<PromotionCode[]> {
    const { data, error } = await supabase
      .from('promotion_codes')
      .select('*, promotions(name)');
    
    if (error) throw error;
    return data;
  },

  async validateCoupon(code: string): Promise<{ valid: boolean; promotion?: Promotion; error?: string }> {
    if (!isConfigured) return { valid: false, error: 'Base de datos no configurada' };

    const { data, error } = await supabase
      .from('promotion_codes')
      .select('*, promotions(*)')
      .eq('code', code.toUpperCase())
      .maybeSingle();

    if (error || !data) return { valid: false, error: 'Cupón no encontrado' };
    
    const promo = data.promotions;
    
    if (data.status !== 'active' || promo.status !== 'active') {
      return { valid: false, error: 'Cupón inactivo' };
    }

    if (data.max_uses && data.current_uses >= data.max_uses) {
      return { valid: false, error: 'Cupón agotado' };
    }

    // Check dates
    const now = new Date();
    if (promo.start_date && new Date(promo.start_date) > now) {
      return { valid: false, error: 'Promoción no ha comenzado' };
    }
    if (promo.end_date && new Date(promo.end_date) < now) {
      return { valid: false, error: 'Promoción expirada' };
    }

    return { valid: true, promotion: promo };
  }
};
