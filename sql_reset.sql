-- ESTE SCRIPT ELIMINA TODOS LOS DATOS Y REINICIA LAS TABLAS A SU ESTADO ORIGINAL --
-- SE DEBEN MANTENER LAS TABLAS PERO VACIAR SU CONTENIDO --
-- EJECUTAR ESTO EN EL SQL EDITOR DE SUPABASE --

BEGIN;

-- Desactivar temporalmente los triggers (como los de auditoría o validación) para evitar problemas en cascada
SET session_replication_role = 'replica';

-- 1. Eliminar datos transaccionales (Ordenes, Clientes, Reservas, Analytics)
TRUNCATE TABLE 
  orders,
  order_items,
  customers,
  customer_notes,
  reservations,
  store_metrics,
  automation_logs,
  automation_alerts,
  automation_tasks,
  recommendation_events,
  product_recommendations
CASCADE;

-- 2. Eliminar datos de inventario y configuración (Opcional: Comentar si se desean mantener las categorías y productos)
-- Si la idea es empezar desde 0 absoluto (incluyendo catálogo), descomentar las siguientes líneas:
-- TRUNCATE TABLE 
--   products,
--   categories,
--   subcategories,
--   product_images,
--   wholesale_configs,
--   banners,
--   promotions,
--   promotion_products,
--   promotion_codes,
--   provinces,
--   municipalities
-- CASCADE;

-- Reactivar triggers
SET session_replication_role = 'origin';

-- 3. Reiniciar contadores específicos
UPDATE products SET views_count = 0;
INSERT INTO store_metrics (id, value) VALUES ('global_visits', 0) ON CONFLICT (id) DO UPDATE SET value = 0;

COMMIT;

-- FIN DEL SCRIPT --
