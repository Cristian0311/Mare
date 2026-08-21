-- Fase 56 — Combos, Packs y Ofertas Inteligentes

-- 1. Bundles (Combos, Packs, Kits)
CREATE TABLE IF NOT EXISTS public.bundles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    type TEXT NOT NULL CHECK (type IN ('combo', 'pack', 'kit')),
    price_type TEXT NOT NULL CHECK (price_type IN ('fixed', 'discount_percentage')),
    price_value DECIMAL(12, 2) NOT NULL,
    price_wholesale DECIMAL(12, 2), -- Independent wholesale price
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'finished', 'archived')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    is_retail BOOLEAN DEFAULT true,
    is_wholesale BOOLEAN DEFAULT false,
    is_reservable BOOLEAN DEFAULT false,
    show_in_home BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bundle Items (Components)
CREATE TABLE IF NOT EXISTS public.bundle_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bundle_id UUID NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    variant_id TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Volume Tiers (for multi-level volume offers)
CREATE TABLE IF NOT EXISTS public.promotion_volume_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_id UUID NOT NULL REFERENCES public.promotions(id) ON DELETE CASCADE,
    min_quantity INTEGER NOT NULL CHECK (min_quantity > 0),
    price_value DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Complementary Products (Recommendations)
CREATE TABLE IF NOT EXISTS public.product_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    recommended_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'complementary' CHECK (type IN ('complementary', 'upsell', 'cross_sell')),
    score DECIMAL(5, 2) DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, recommended_product_id, type)
);

-- Enable RLS
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_volume_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_recommendations ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read bundles" ON public.bundles FOR SELECT USING (status = 'active');
CREATE POLICY "Public read bundle items" ON public.bundle_items FOR SELECT USING (true);
CREATE POLICY "Public read volume tiers" ON public.promotion_volume_tiers FOR SELECT USING (true);
CREATE POLICY "Public read product recommendations" ON public.product_recommendations FOR SELECT USING (true);

-- Admin policies (assuming role-based or just authenticated for now as per previous phases)
CREATE POLICY "Admin manage bundles" ON public.bundles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage bundle items" ON public.bundle_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage volume tiers" ON public.promotion_volume_tiers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage product recommendations" ON public.product_recommendations FOR ALL USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX idx_bundles_status ON public.bundles(status);
CREATE INDEX idx_bundles_dates ON public.bundles(start_date, end_date);
CREATE INDEX idx_bundle_items_bundle ON public.bundle_items(bundle_id);
CREATE INDEX idx_volume_tiers_promo ON public.promotion_volume_tiers(promotion_id);
CREATE INDEX idx_recommendations_product ON public.product_recommendations(product_id);

-- Update trigger for bundles
CREATE TRIGGER update_bundles_updated_at
    BEFORE UPDATE ON public.bundles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
