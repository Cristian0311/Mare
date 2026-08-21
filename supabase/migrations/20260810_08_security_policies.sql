-- FASE 43 — POLÍTICAS DE SEGURIDAD (RLS)
-- 008_security_policies.sql

-- Habilitar RLS en todas las tablas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wholesale_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.municipalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currency_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- 1. POLÍTICAS DE LECTURA PÚBLICA (ANON)
-- Datos que cualquier usuario de la tienda debe poder ver.

CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (status = 'active');
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (status = 'active');
CREATE POLICY "Public product images are viewable by everyone" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Public wholesale configs are viewable by everyone" ON public.wholesale_configs FOR SELECT USING (status = 'active');
CREATE POLICY "Public provinces are viewable by everyone" ON public.provinces FOR SELECT USING (status = 'active');
CREATE POLICY "Public municipalities are viewable by everyone" ON public.municipalities FOR SELECT USING (status = 'active');
CREATE POLICY "Public advisors are viewable by everyone" ON public.advisors FOR SELECT USING (status = 'active');
CREATE POLICY "Public store settings are viewable by everyone" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Public currency settings are viewable by everyone" ON public.currency_settings FOR SELECT USING (is_active = true);
CREATE POLICY "Public banners are viewable by everyone" ON public.banners FOR SELECT USING (status = 'active');
CREATE POLICY "Public SEO settings are viewable by everyone" ON public.seo_settings FOR SELECT USING (true);

-- 2. POLÍTICAS DE ADMINISTRACIÓN (AUTHENTICATED)
-- Solo los administradores autenticados pueden modificar datos.

-- Función para verificar si un usuario es administrador (se puede refinar con roles en el futuro)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (auth.role() = 'authenticated');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar políticas de administración a todas las tablas
-- Nota: En un entorno de producción real, se especificarían políticas más granulares por tabla.
-- Para esta fase inicial, permitimos todo a usuarios autenticados.

DO $$
DECLARE
    t text;
    tables text[] := ARRAY[
        'categories', 'products', 'product_images', 'wholesale_configs', 
        'provinces', 'municipalities', 'customers', 'advisors', 
        'orders', 'order_items', 'reservations', 'store_settings', 
        'currency_settings', 'banners', 'seo_settings'
    ];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        EXECUTE format('CREATE POLICY "Admins have full access to %I" ON public.%I FOR ALL TO authenticated USING (public.is_admin())', t, t);
    END LOOP;
END $$;

-- 3. POLÍTICAS DE ESCRITURA PARA CLIENTES (ANON)
-- Los clientes anónimos deben poder crear pedidos, reservas y sus propios perfiles de cliente durante el checkout.

CREATE POLICY "Anonymous users can create customers" ON public.customers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anonymous users can create orders" ON public.orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anonymous users can create order items" ON public.order_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anonymous users can create reservations" ON public.reservations FOR INSERT TO anon WITH CHECK (true);

-- 4. COMENTARIOS
COMMENT ON FUNCTION public.is_admin IS 'Verifica si el usuario actual tiene permisos de administrador.';
