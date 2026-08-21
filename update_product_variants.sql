-- MARÉ E-COMMERCE: MIGRACIÓN PARA SOPORTE DE VARIANTES (Tallas, Colores, Opciones)
-- Instrucciones: Copia y ejecuta este script en el SQL Editor de tu consola de Supabase.

-- 1. Agregar columnas jsonb a la tabla principal de productos para atomicidad rápida
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS opciones_variantes jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS variantes jsonb DEFAULT '[]'::jsonb;

-- 2. Crear tabla relacional opcional product_variants para consultas estructuradas
CREATE TABLE IF NOT EXISTS public.product_variants (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku text,
    atributos jsonb NOT NULL DEFAULT '{}'::jsonb,
    precio_cup numeric(12, 2),
    precio_anterior_cup numeric(12, 2),
    stock integer DEFAULT 0,
    disponibilidad text DEFAULT 'disponible',
    imagen text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 3. Índices de rendimiento
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_products_opciones_variantes ON public.products USING gin (opciones_variantes);
CREATE INDEX IF NOT EXISTS idx_products_variantes ON public.products USING gin (variantes);

-- 4. Trigger para auto-actualizar timestamp en product_variants
DROP TRIGGER IF EXISTS update_product_variants_updated_at ON public.product_variants;
CREATE TRIGGER update_product_variants_updated_at
    BEFORE UPDATE ON public.product_variants
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 5. Habilitar RLS y políticas de acceso
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura publica de variantes" ON public.product_variants;
CREATE POLICY "Lectura publica de variantes"
    ON public.product_variants FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Administradores controlan variantes" ON public.product_variants;
CREATE POLICY "Administradores controlan variantes"
    ON public.product_variants FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 6. Comentarios descriptivos
COMMENT ON COLUMN public.products.opciones_variantes IS 'Grupos de opciones de variantes (ej: Talla: [S, M, L], Color: [Negro, Blanco]).';
COMMENT ON COLUMN public.products.variantes IS 'Lista de combinaciones de variantes con precios y stock específicos en formato JSONB.';
COMMENT ON TABLE public.product_variants IS 'Tabla relacional de variantes por producto.';
