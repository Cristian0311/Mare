import { Product } from './product';

export type BundleType = 'combo' | 'pack' | 'kit';
export type BundleStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'finished' | 'archived';
export type BundlePriceType = 'fixed' | 'discount_percentage';

export interface Bundle {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  type: BundleType;
  price_type: BundlePriceType;
  price_value: number;
  price_wholesale?: number;
  status: BundleStatus;
  start_date?: string;
  end_date?: string;
  is_retail: boolean;
  is_wholesale: boolean;
  is_reservable: boolean;
  show_in_home: boolean;
  priority: number;
  metadata: any;
  created_at: string;
  updated_at: string;
  
  // Relations
  items?: BundleItem[];
}

export interface BundleItem {
  id: string;
  bundle_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  
  // Joined product data
  product?: Product;
}

export interface VolumeTier {
  id: string;
  promotion_id: string;
  min_quantity: number;
  price_value: number;
}

export interface ProductRecommendation {
  id: string;
  product_id: string;
  recommended_product_id: string;
  type: 'complementary' | 'upsell' | 'cross_sell';
  score: number;
  
  // Joined data
  recommended_product?: Product;
}
