-- FASE 43 — CLIENTES Y ASESORES
-- 005_customers_and_advisors.sql

-- 1. CLIENTES
CREATE TABLE IF NOT EXISTS public.customers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name text NOT NULL,
    phone text NOT NULL,
    whatsapp text,
    province_id uuid REFERENCES public.provinces(id) ON DELETE SET NULL,
    municipality_id uuid REFERENCES public.municipalities(id) ON DELETE SET NULL,
    address text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. ASESORES
CREATE TABLE IF NOT EXISTS public.advisors (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    avatar_path text,
    phone text,
    whatsapp text NOT NULL,
    gender text CHECK (gender IN ('male', 'female', 'other')),
    role text NOT NULL DEFAULT 'Asesor de Ventas',
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Triggers para updated_at
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_advisors_updated_at
    BEFORE UPDATE ON public.advisors
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 3. ÍNDICES
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_advisors_status ON public.advisors(status);

-- 4. COMENTARIOS
COMMENT ON TABLE public.customers IS 'Información de clientes que han realizado pedidos o reservas.';
COMMENT ON TABLE public.advisors IS 'Asesores de MARÉ (Emily Suarez, Cristian Marco, etc.).';
