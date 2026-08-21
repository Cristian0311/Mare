-- FASE 55 — PROMOCIONES, DESCUENTOS Y PRECIOS ESPECIALES

-- 1. TABLA DE CAMPAÑAS (Agrupadores de promociones)
CREATE TABLE IF NOT EXISTS public.campaigns (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'finished')),
    created_at timestamp with time zone DEFAULT now()
);

-- 2. TABLA DE PROMOCIONES
CREATE TABLE IF NOT EXISTS public.promotions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id uuid REFERENCES public.campaigns(id) ON DELETE SET NULL,
    name text NOT NULL,
    description text,
    type text NOT NULL CHECK (type IN ('percentage', 'fixed_amount', 'special_price', 'quantity_discount')),
    value numeric(15, 2) NOT NULL, -- Porcentaje o monto
    min_quantity integer DEFAULT 1,
    max_quantity integer,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'finished')),
    apply_to text DEFAULT 'retail' CHECK (apply_to IN ('retail', 'wholesale', 'both')),
    usage_limit integer,
    current_usage integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 3. ASOCIACIÓN PROMOCIÓN-PRODUCTO
CREATE TABLE IF NOT EXISTS public.promotion_products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    promotion_id uuid NOT NULL REFERENCES public.promotions(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    UNIQUE(promotion_id, product_id)
);

-- 4. TABLA DE CUPONES (Códigos de descuento)
CREATE TABLE IF NOT EXISTS public.promotion_codes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    promotion_id uuid NOT NULL REFERENCES public.promotions(id) ON DELETE CASCADE,
    code text UNIQUE NOT NULL,
    status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
    max_uses integer,
    current_uses integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- 5. ACTUALIZAR ORDER_ITEMS PARA TRAZABILIDAD
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS promotion_id uuid REFERENCES public.promotions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS original_price_cup numeric(15, 2),
ADD COLUMN IF NOT EXISTS discount_amount_cup numeric(15, 2) DEFAULT 0;

-- 6. RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_codes ENABLE ROW LEVEL SECURITY;

-- Admins: Full Access
CREATE POLICY "Admins full access campaigns" ON public.campaigns FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins full access promotions" ON public.promotions FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins full access promotion_products" ON public.promotion_products FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins full access promotion_codes" ON public.promotion_codes FOR ALL TO authenticated USING (public.is_admin());

-- Public: Solo lectura de promociones activas
CREATE POLICY "Public read active promotions" ON public.promotions FOR SELECT TO anon, authenticated USING (status = 'active');
CREATE POLICY "Public read active promotion_products" ON public.promotion_products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read active campaigns" ON public.campaigns FOR SELECT TO anon, authenticated USING (status = 'active');

-- 7. ÍNDICES
CREATE INDEX IF NOT EXISTS idx_promotions_status ON public.promotions(status);
CREATE INDEX IF NOT EXISTS idx_promotion_products_product ON public.promotion_products(product_id);
CREATE INDEX IF NOT EXISTS idx_promotion_codes_code ON public.promotion_codes(code);
