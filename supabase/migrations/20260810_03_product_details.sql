-- FASE 43 — DETALLES DE PRODUCTOS (IMÁGENES Y MAYORISTAS)
-- 003_product_details.sql

-- 1. IMÁGENES DE PRODUCTO
CREATE TABLE IF NOT EXISTS public.product_images (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    storage_path text NOT NULL,
    alt_text text,
    is_primary boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. CONFIGURACIÓN MAYORISTA
CREATE TABLE IF NOT EXISTS public.wholesale_configs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    unit_type text NOT NULL DEFAULT 'unit' CHECK (unit_type IN ('unit', 'quantity', 'box', 'package', 'lot')),
    min_quantity integer NOT NULL DEFAULT 1 CHECK (min_quantity >= 1),
    price_cup numeric(12, 2) NOT NULL CHECK (price_cup >= 0),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(product_id, unit_type)
);

-- Trigger para updated_at
CREATE TRIGGER update_wholesale_configs_updated_at
    BEFORE UPDATE ON public.wholesale_configs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 3. ÍNDICES
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_wholesale_product_id ON public.wholesale_configs(product_id);

-- 4. COMENTARIOS
COMMENT ON TABLE public.product_images IS 'Almacena las referencias a las imágenes de los productos en el Storage.';
COMMENT ON TABLE public.wholesale_configs IS 'Configuración de precios y unidades para la venta mayorista.';
