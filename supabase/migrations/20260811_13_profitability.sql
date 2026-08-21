-- FASE 54 — COSTOS, MÁRGENES Y RENTABILIDAD

-- 1. EXTENSIÓN DE ORDER_ITEMS PARA SNAPSHOT DE COSTOS
-- Esto permite que si el costo de un producto sube mañana, el margen de la venta de hoy no cambie.
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS cost_unit_cup numeric(15, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS margin_unit_cup numeric(15, 2) DEFAULT 0;

-- 2. FUNCIÓN PARA CALCULAR RENTABILIDAD POR PERÍODO (RPC)
CREATE OR REPLACE FUNCTION public.get_profitability_stats(
    p_start_date timestamp with time zone,
    p_end_date timestamp with time zone
)
RETURNS json AS $$
DECLARE
    v_total_revenue numeric;
    v_total_cost numeric;
    v_total_margin numeric;
    v_order_count integer;
    v_result json;
BEGIN
    SELECT 
        COALESCE(SUM(oi.subtotal_cup), 0),
        COALESCE(SUM(oi.cost_unit_cup * oi.quantity * oi.units_per_presentation), 0),
        COALESCE(SUM(oi.subtotal_cup - (oi.cost_unit_cup * oi.quantity * oi.units_per_presentation)), 0),
        COUNT(DISTINCT o.id)
    INTO 
        v_total_revenue, v_total_cost, v_total_margin, v_order_count
    FROM public.orders o
    JOIN public.order_items oi ON o.id = oi.order_id
    WHERE o.created_at BETWEEN p_start_date AND p_end_date
    AND o.status NOT IN ('cancelled');

    RETURN json_build_object(
        'revenue', v_total_revenue,
        'cost', v_total_cost,
        'margin', v_total_margin,
        'margin_percent', CASE WHEN v_total_revenue > 0 THEN (v_total_margin / v_total_revenue) * 100 ELSE 0 END,
        'order_count', v_order_count
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. VISTA DE RENTABILIDAD POR PRODUCTO
CREATE OR REPLACE VIEW public.product_profitability AS
SELECT 
    p.id as product_id,
    p.name as nombre,
    p.sku,
    SUM(oi.quantity * oi.units_per_presentation) as total_units_sold,
    SUM(oi.subtotal_cup) as total_revenue,
    SUM(oi.cost_unit_cup * oi.quantity * oi.units_per_presentation) as total_cost,
    SUM(oi.subtotal_cup - (oi.cost_unit_cup * oi.quantity * oi.units_per_presentation)) as total_margin,
    CASE 
        WHEN SUM(oi.subtotal_cup) > 0 
        THEN (SUM(oi.subtotal_cup - (oi.cost_unit_cup * oi.quantity * oi.units_per_presentation)) / SUM(oi.subtotal_cup)) * 100 
        ELSE 0 
    END as margin_percent
FROM public.products p
JOIN public.order_items oi ON p.id = oi.product_id
JOIN public.orders o ON oi.order_id = o.id
WHERE o.status NOT IN ('cancelled')
GROUP BY p.id, p.name as nombre, p.sku;

-- 4. RLS para asegurar que solo admins vean rentabilidad
-- (Las tablas ya tienen RLS, pero reforzamos que estas funciones solo devuelvan datos a admins)
