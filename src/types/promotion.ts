
export type PromotionType = 'percentage' | 'fixed_amount' | 'special_price' | 'quantity_discount' | 'buy_x_get_y' | 'volume_offers';
export type PromotionStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'finished';
export type PromotionApplyTo = 'retail' | 'wholesale' | 'both';

export interface Promotion {
  id: string;
  campaign_id?: string;
  name: string;
  description?: string;
  type: PromotionType;
  value: number;
  min_quantity: number;
  max_quantity?: number;
  start_date?: string;
  end_date?: string;
  status: PromotionStatus;
  apply_to: PromotionApplyTo;
  usage_limit?: number;
  current_usage: number;
  created_at: string;
  updated_at: string;
  
  // Relations
  products?: string[]; // Array of product IDs
  volume_tiers?: { min_quantity: number; price_value: number }[];
  buy_x?: number;
  get_y?: number;
  buy_x_product_id?: string;
  buy_x_quantity?: number;
  get_y_quantity?: number;
  get_y_product_id?: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: PromotionStatus;
  created_at: string;
}

export interface PromotionCode {
  id: string;
  promotion_id: string;
  code: string;
  status: 'active' | 'inactive' | 'expired';
  max_uses?: number;
  current_uses: number;
  created_at: string;
}
