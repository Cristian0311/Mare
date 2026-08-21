-- Fase 57 — Experiencia de Compra Personalizada y Recomendaciones Inteligentes

-- 1. Recommendation Tracking Events
CREATE TABLE IF NOT EXISTS public.recommendation_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'add_to_cart', 'purchase')),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    bundle_id UUID REFERENCES public.bundles(id) ON DELETE CASCADE,
    recommendation_source TEXT DEFAULT 'direct', -- 'related', 'complementary', 'popular', 'trending', 'bundle', 'cart_upsell', 'recently_viewed', 'for_you'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Manual Product Recommendation Rules / Overrides
CREATE TABLE IF NOT EXISTS public.manual_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    target_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    relation_type TEXT NOT NULL DEFAULT 'complementary' CHECK (relation_type IN ('related', 'complementary', 'upsell', 'cross_sell')),
    priority INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_product_id, target_product_id, relation_type)
);

-- 3. Exclusions (Products or Categories excluded from auto recommendations)
CREATE TABLE IF NOT EXISTS public.recommendation_exclusions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('product', 'category')),
    entity_id UUID NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Recommendation Engine Global Settings
CREATE TABLE IF NOT EXISTS public.recommendation_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auto_recommendations_enabled BOOLEAN DEFAULT true,
    max_items_per_section INTEGER DEFAULT 4,
    min_confidence_score DECIMAL(5,2) DEFAULT 0.10,
    weights JSONB DEFAULT '{
      "relevance": 0.35,
      "popularity": 0.25,
      "recency": 0.20,
      "margin": 0.10,
      "stock": 0.10
    }'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings row if none exists
INSERT INTO public.recommendation_settings (id, auto_recommendations_enabled, max_items_per_section)
SELECT '00000000-0000-0000-0000-000000000001', true, 4
WHERE NOT EXISTS (SELECT 1 FROM public.recommendation_settings);

-- RLS Policies
ALTER TABLE public.recommendation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_exclusions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_settings ENABLE ROW LEVEL SECURITY;

-- Allow public insertion of events (for anonymous tracking)
CREATE POLICY "Public insert recommendation events" ON public.recommendation_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read active manual recommendations" ON public.manual_recommendations FOR SELECT USING (is_active = true);
CREATE POLICY "Public read exclusions" ON public.recommendation_exclusions FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON public.recommendation_settings FOR SELECT USING (true);

-- Admin management policies
CREATE POLICY "Admin manage recommendation events" ON public.recommendation_events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage manual recommendations" ON public.manual_recommendations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage exclusions" ON public.recommendation_exclusions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage settings" ON public.recommendation_settings FOR ALL USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX idx_reco_events_session ON public.recommendation_events(session_id);
CREATE INDEX idx_reco_events_product ON public.recommendation_events(product_id);
CREATE INDEX idx_reco_events_type ON public.recommendation_events(event_type);
CREATE INDEX idx_reco_events_created ON public.recommendation_events(created_at);
CREATE INDEX idx_manual_reco_source ON public.manual_recommendations(source_product_id);
