import { Product } from './product';
import { Bundle } from './bundle';

export type RecommendationType = 
  | 'related' 
  | 'complementary' 
  | 'popular' 
  | 'trending' 
  | 'best_rated' 
  | 'offers' 
  | 'combos' 
  | 'recently_viewed' 
  | 'for_you';

export type EventType = 'view' | 'click' | 'add_to_cart' | 'purchase';

export interface RecommendationEvent {
  id?: string;
  session_id: string;
  customer_id?: string | null;
  event_type: EventType;
  product_id?: string | null;
  category_id?: string | null;
  bundle_id?: string | null;
  recommendation_source?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface ManualRecommendation {
  id: string;
  source_product_id: string;
  target_product_id: string;
  relation_type: 'related' | 'complementary' | 'upsell' | 'cross_sell';
  priority: number;
  is_active: boolean;
  target_product?: Product;
}

export interface RecommendationExclusion {
  id: string;
  entity_type: 'product' | 'category';
  entity_id: string;
  reason?: string;
}

export interface RecommendationSettings {
  id: string;
  auto_recommendations_enabled: boolean;
  max_items_per_section: number;
  min_confidence_score: number;
  weights: {
    relevance: number;
    popularity: number;
    recency: number;
    margin: number;
    stock: number;
  };
}

export interface RecommendedItem {
  product?: Product;
  bundle?: Bundle;
  type: RecommendationType;
  score: number;
  reason?: string; // e.g. "Porque viste Ventilador F6", "Combo con 15% de ahorro"
  badge?: string; // "OFERTA", "COMBO", "MÁS VENDIDO", "A RESERVAR"
}

export interface RecommendationAnalytics {
  impressions: number;
  clicks: number;
  ctr: number; // percentage
  add_to_cart_count: number;
  conversion_count: number;
  conversion_rate: number;
  top_recommended_products: Array<{
    product_id: string;
    product_name: string;
    impressions: number;
    clicks: number;
    ctr: number;
  }>;
  top_converted_products: Array<{
    product_id: string;
    product_name: string;
    purchases: number;
    revenue_cup: number;
  }>;
  failed_recommendations: Array<{
    product_id: string;
    product_name: string;
    impressions: number;
    clicks: number;
    ctr?: number;
  }>;
}
