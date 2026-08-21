import { Product } from '../types/product';
import { Promotion } from '../types/promotion';

export interface PricingDetails {
  originalPrice: number;
  finalPrice: number;
  savings: number;
  discountPercentage: number;
  hasOffer: boolean;
  promotion?: any;
  type?: 'retail' | 'wholesale' | 'bundle' | 'volume_offer';
}

export function getProductPricing(
  product: Product, 
  quantity: number = 1, 
  isWholesale: boolean = false,
  activePromos: Promotion[] = []
): PricingDetails {
  let originalPrice = product.precioMN;
  let finalPrice = originalPrice;
  let pricingType: PricingDetails['type'] = isWholesale ? 'wholesale' : 'retail';

  // 1. Check Wholesale Base
  if (isWholesale && product.ventaMayorista?.habilitada) {
    finalPrice = product.ventaMayorista.precioMN;
  } else if (product.precioAnteriorMN && product.precioAnteriorMN > product.precioMN) {
    // Has built-in legacy offer
    finalPrice = product.precioMN;
    originalPrice = product.precioAnteriorMN;
  }

  const now = new Date();
  let bestPromo: Promotion | undefined = undefined;
  let lowestPrice = finalPrice;

  // 2. Check Database Promotions & Volume Offers
  // Priority: 1. special_price, 2. volume_offers, 3. general (percentage/fixed)
  const sortedPromos = [...activePromos].sort((a, b) => {
    const priority = {
      'special_price': 1,
      'volume_offers': 2,
      'percentage': 3,
      'fixed_amount': 3,
      'buy_x_get_y': 4,
      'quantity_discount': 5
    };
    return (priority[a.type as keyof typeof priority] || 9) - (priority[b.type as keyof typeof priority] || 9);
  });

  for (const promo of sortedPromos) {
    // Check status & dates
    if (promo.status !== 'active') continue;
    if (promo.start_date && new Date(promo.start_date) > now) continue;
    if (promo.end_date && new Date(promo.end_date) < now) continue;
    
    // Check quantity
    if (quantity < promo.min_quantity) continue;
    if (promo.max_quantity && quantity > promo.max_quantity) continue;

    // Check scope
    if (promo.apply_to === 'retail' && isWholesale) continue;
    if (promo.apply_to === 'wholesale' && !isWholesale) continue;

    // Check product association
    const matchesProduct = promo.products?.includes(product.id);
    if (!matchesProduct) continue;

    let calcPrice = finalPrice; // Start from current best base price

    if (promo.type === 'percentage') {
      calcPrice = originalPrice * (1 - promo.value / 100);
    } else if (promo.type === 'fixed_amount') {
      calcPrice = Math.max(0, originalPrice - promo.value);
    } else if (promo.type === 'special_price' || promo.type === 'quantity_discount') {
      calcPrice = promo.value;
    } else if (promo.type === 'volume_offers' && promo.volume_tiers) {
      // Find best tier for current quantity
      const tier = promo.volume_tiers
        .filter(t => quantity >= t.min_quantity)
        .sort((a, b) => b.min_quantity - a.min_quantity)[0];
      
      if (tier) {
        calcPrice = tier.price_value;
        pricingType = 'volume_offer';
      }
    }

    if (calcPrice < lowestPrice) {
      lowestPrice = calcPrice;
      bestPromo = promo;
    }
  }

  if (bestPromo && lowestPrice < originalPrice) {
    finalPrice = lowestPrice;
  }

  const savings = originalPrice - finalPrice;
  const discountPercentage = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

  return {
    originalPrice,
    finalPrice,
    savings,
    discountPercentage,
    hasOffer: savings > 0,
    promotion: bestPromo,
    type: pricingType
  };
}

export function getBundlePricing(bundle: any, isWholesale: boolean = false): PricingDetails {
  const items = bundle.items || [];
  
  // Calculate raw sum of individual prices
  const individualTotal = items.reduce((sum: number, item: any) => {
    const productPrice = isWholesale && item.product?.ventaMayorista?.habilitada
      ? item.product.ventaMayorista.precioMN
      : item.product?.precioMN || 0;
    return sum + (productPrice * item.quantity);
  }, 0);

  let finalPrice = individualTotal;
  const originalPrice = individualTotal;

  if (bundle.price_type === 'fixed') {
    finalPrice = isWholesale && bundle.price_wholesale 
      ? bundle.price_wholesale 
      : bundle.price_value;
  } else if (bundle.price_type === 'discount_percentage') {
    const discount = isWholesale && bundle.price_wholesale
      ? bundle.price_wholesale // In this case price_wholesale might be a different percentage
      : bundle.price_value;
    finalPrice = individualTotal * (1 - discount / 100);
  }

  const savings = originalPrice - finalPrice;
  const discountPercentage = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

  return {
    originalPrice,
    finalPrice,
    savings,
    discountPercentage,
    hasOffer: savings > 0,
    type: 'bundle'
  };
}
