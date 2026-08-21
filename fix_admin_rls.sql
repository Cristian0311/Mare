-- Ejecuta este script en el SQL Editor de Supabase
-- Esto permitirá que el panel administrativo (que usa sesión local)
-- pueda leer y escribir en todas las tablas temporalmente usando la key 'anon'.

DO $$
DECLARE
    t text;
    tables text[] := ARRAY[
        'categories', 'products', 'product_images', 'wholesale_configs', 
        'product_variants', 'provinces', 'municipalities', 'delivery_zones',
        'customers', 'advisors', 'orders', 'order_items', 'order_status_history',
        'reservations', 'settings', 'currency_settings', 'seo_config',
        'banners', 'promotions', 'promotion_products', 'promotion_codes',
        'bundles', 'bundle_items', 'promotion_volume_tiers',
        'inventory_transactions', 'suppliers', 'purchase_orders', 'purchase_order_items',
        'product_recommendations', 'recommendation_events', 'manual_recommendations',
        'recommendation_exclusions', 'recommendation_settings', 'automation_rules',
        'automation_alerts', 'automation_tasks', 'automation_logs', 'automation_config',
        'exchange_rates'
    ];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        -- Otorga permisos totales al rol 'anon'
        EXECUTE format('DROP POLICY IF EXISTS "Anon Admin Access for %I" ON public.%I', t, t);
        EXECUTE format('CREATE POLICY "Anon Admin Access for %I" ON public.%I FOR ALL TO anon USING (true) WITH CHECK (true)', t, t);
    END LOOP;
END $$;
