-- FASE 43 — ESQUEMA DE CATEGORÍAS Y PRODUCTOS
-- 002_categories_and_products.sql

-- 1. CATEGORÍAS
CREATE TABLE IF NOT EXISTS public.categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    image_path text,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Trigger para updated_at
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 2. PRODUCTOS
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    price_cup numeric(12, 2) NOT NULL DEFAULT 0 CHECK (price_cup >= 0),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    product_type text NOT NULL DEFAULT 'retail' CHECK (product_type IN ('retail', 'wholesale', 'reservation')),
    is_featured boolean DEFAULT false,
    stock integer DEFAULT NULL, -- NULL significa stock ilimitado
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Trigger para updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 3. ÍNDICES
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_type ON public.products(product_type);
CREATE INDEX IF NOT EXISTS idx_categories_status ON public.categories(status);

-- 4. COMENTARIOS
COMMENT ON TABLE public.categories IS 'Categorías de productos de MARÉ.';
COMMENT ON TABLE public.products IS 'Catálogo principal de productos (Retail, Mayorista y Reserva).';
