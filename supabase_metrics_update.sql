-- 1. Añadir contador de vistas a productos
ALTER TABLE products ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- 2. Crear tabla para métricas globales de la página (visitas totales)
CREATE TABLE IF NOT EXISTS store_metrics (
  id TEXT PRIMARY KEY,
  value INTEGER DEFAULT 0
);

-- Insertar la métrica inicial de visitas a la tienda si no existe
INSERT INTO store_metrics (id, value) VALUES ('global_visits', 0) ON CONFLICT DO NOTHING;

-- 3. Crear RPC (Remote Procedure Call) para incrementar las visitas del producto de forma atómica
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Crear RPC para incrementar las visitas globales
CREATE OR REPLACE FUNCTION increment_global_visits()
RETURNS void AS $$
BEGIN
  UPDATE store_metrics
  SET value = COALESCE(value, 0) + 1
  WHERE id = 'global_visits';
END;
$$ LANGUAGE plpgsql;
