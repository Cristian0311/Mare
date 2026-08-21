-- FASE 43 — LOCALIZACIONES (PROVINCIAS Y MUNICIPIOS)
-- 004_locations.sql

-- 1. PROVINCIAS
CREATE TABLE IF NOT EXISTS public.provinces (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL UNIQUE,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. MUNICIPIOS
CREATE TABLE IF NOT EXISTS public.municipalities (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    province_id uuid NOT NULL REFERENCES public.provinces(id) ON DELETE CASCADE,
    name text NOT NULL,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    sort_order integer DEFAULT 0,
    delivery_fee_cup numeric(12, 2) DEFAULT 0 CHECK (delivery_fee_cup >= 0),
    is_delivery_available boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(province_id, name)
);

-- Triggers para updated_at
CREATE TRIGGER update_provinces_updated_at
    BEFORE UPDATE ON public.provinces
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_municipalities_updated_at
    BEFORE UPDATE ON public.municipalities
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 3. ÍNDICES
CREATE INDEX IF NOT EXISTS idx_municipalities_province_id ON public.municipalities(province_id);
CREATE INDEX IF NOT EXISTS idx_provinces_status ON public.provinces(status);

-- 4. COMENTARIOS
COMMENT ON TABLE public.provinces IS 'Provincias de Cuba administrables en MARÉ.';
COMMENT ON TABLE public.municipalities IS 'Municipios relacionados con las provincias y su configuración de entrega.';
