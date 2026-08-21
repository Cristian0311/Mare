-- FASE 43 — CONFIGURACIÓN, BANNERS Y SEO
-- 007_settings_and_seo.sql

-- 1. CONFIGURACIÓN DE LA TIENDA
CREATE TABLE IF NOT EXISTS public.store_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    key text NOT NULL UNIQUE,
    value jsonb NOT NULL,
    description text,
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. TASA DE CAMBIO
CREATE TABLE IF NOT EXISTS public.currency_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    base_currency text NOT NULL DEFAULT 'CUP',
    target_currency text NOT NULL DEFAULT 'USD',
    exchange_rate numeric(12, 4) NOT NULL DEFAULT 1.0,
    is_active boolean DEFAULT true,
    updated_at timestamp with time zone DEFAULT now()
);

-- 3. BANNERS PUBLICITARIOS
CREATE TABLE IF NOT EXISTS public.banners (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text,
    subtitle text,
    image_path text NOT NULL,
    button_text text,
    button_url text,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 4. SEO POR PÁGINA
CREATE TABLE IF NOT EXISTS public.seo_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_path text NOT NULL UNIQUE, -- e.g., '/', '/categorias', '/mayorista'
    title text,
    description text,
    keywords text,
    og_image_path text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Triggers para updated_at
CREATE TRIGGER update_banners_updated_at
    BEFORE UPDATE ON public.banners
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_seo_settings_updated_at
    BEFORE UPDATE ON public.seo_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 5. COMENTARIOS
COMMENT ON TABLE public.store_settings IS 'Configuraciones dinámicas de la tienda (WhatsApp, horarios, etc.).';
COMMENT ON TABLE public.currency_settings IS 'Control centralizado de la tasa de cambio CUP/USD.';
COMMENT ON TABLE public.banners IS 'Gestión de banners promocionales de la Home.';
COMMENT ON TABLE public.seo_settings IS 'Configuraciones SEO específicas por ruta.';
