-- FASE 59 — CENTRO DE INTELIGENCIA COMERCIAL MARÉ
-- Optimizado para Supabase Free Plan con consultas agregadas e índices eficientes.

-- 1. ÍNDICES DE RENDIMIENTO PARA ANÁLISIS COMERCIAL
CREATE INDEX IF NOT EXISTS idx_orders_created_at_status ON public.orders(created_at, status);
CREATE INDEX IF NOT EXISTS idx_orders_order_type_status ON public.orders(order_type, status);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_products_stock_cost ON public.products(stock_quantity, cost_cup, status);
CREATE INDEX IF NOT EXISTS idx_reservations_status_created ON public.reservations(status, created_at);

-- 2. VISTA AGREGADA DE VENTAS DIARIAS PARA TENDENCIAS
CREATE OR REPLACE VIEW public.bi_daily_sales_view AS
SELECT 
    DATE_TRUNC('day', o.created_at)::date AS sales_date,
    o.order_type,
    COUNT(DISTINCT o.id) AS orders_count,
    COALESCE(SUM(o.subtotal_cup), 0) AS gross_sales_cup,
    COALESCE(SUM(o.delivery_fee_cup), 0) AS delivery_revenue_cup,
    COALESCE(SUM(o.total_cup), 0) AS net_sales_cup,
    COALESCE(SUM(oi.cost_unit_cup * oi.quantity * oi.units_per_presentation), 0) AS total_cost_cup,
    COALESCE(SUM(oi.subtotal_cup - (oi.cost_unit_cup * oi.quantity * oi.units_per_presentation)), 0) AS gross_profit_cup
FROM public.orders o
LEFT JOIN public.order_items oi ON o.id = oi.order_id
WHERE o.status NOT IN ('cancelled')
GROUP BY DATE_TRUNC('day', o.created_at)::date, o.order_type;

-- 3. VISTA DE DESEMPEÑO POR CATEGORÍA
CREATE OR REPLACE VIEW public.bi_category_performance_view AS
SELECT 
    c.id AS category_id,
    c.name AS category_name,
    COUNT(DISTINCT o.id) AS orders_count,
    COALESCE(SUM(oi.quantity * oi.units_per_presentation), 0) AS total_units_sold,
    COALESCE(SUM(oi.subtotal_cup), 0) AS net_sales_cup,
    COALESCE(SUM(oi.cost_unit_cup * oi.quantity * oi.units_per_presentation), 0) AS total_cost_cup,
    COALESCE(SUM(oi.subtotal_cup - (oi.cost_unit_cup * oi.quantity * oi.units_per_presentation)), 0) AS total_profit_cup,
    CASE 
        WHEN SUM(oi.subtotal_cup) > 0 
        THEN (SUM(oi.subtotal_cup - (oi.cost_unit_cup * oi.quantity * oi.units_per_presentation)) / SUM(oi.subtotal_cup)) * 100 
        ELSE 0 
    END AS margin_percent
FROM public.categories c
JOIN public.products p ON p.categoria_id = c.id
JOIN public.order_items oi ON p.id = oi.product_id
JOIN public.orders o ON oi.order_id = o.id
WHERE o.status NOT IN ('cancelled')
GROUP BY c.id, c.name;

-- 4. RPC PARA MÉTRICAS AGREGADAS EJECUTIVAS
CREATE OR REPLACE FUNCTION public.get_bi_executive_summary(
    p_start_date timestamp with time zone,
    p_end_date timestamp with time zone
)
RETURNS json AS $$
DECLARE
    v_gross_sales numeric;
    v_delivery_fees numeric;
    v_net_sales numeric;
    v_total_cost numeric;
    v_total_profit numeric;
    v_orders_count integer;
    v_units_sold integer;
    v_avg_ticket numeric;
    v_margin_pct numeric;
BEGIN
    SELECT 
        COALESCE(SUM(o.subtotal_cup), 0),
        COALESCE(SUM(o.delivery_fee_cup), 0),
        COALESCE(SUM(o.total_cup), 0),
        COALESCE(SUM(oi.cost_unit_cup * oi.quantity * oi.units_per_presentation), 0),
        COALESCE(SUM(oi.subtotal_cup - (oi.cost_unit_cup * oi.quantity * oi.units_per_presentation)), 0),
        COUNT(DISTINCT o.id),
        COALESCE(SUM(oi.quantity * oi.units_per_presentation), 0)
    INTO 
        v_gross_sales,
        v_delivery_fees,
        v_net_sales,
        v_total_cost,
        v_total_profit,
        v_orders_count,
        v_units_sold
    FROM public.orders o
    LEFT JOIN public.order_items oi ON o.id = oi.order_id
    WHERE o.created_at BETWEEN p_start_date AND p_end_date
    AND o.status NOT IN ('cancelled');

    v_avg_ticket := CASE WHEN v_orders_count > 0 THEN v_net_sales / v_orders_count ELSE 0 END;
    v_margin_pct := CASE WHEN v_net_sales > 0 THEN (v_total_profit / v_net_sales) * 100 ELSE 0 END;

    RETURN json_build_object(
        'gross_sales', v_gross_sales,
        'delivery_fees', v_delivery_fees,
        'net_sales', v_net_sales,
        'total_cost', v_total_cost,
        'total_profit', v_total_profit,
        'orders_count', v_orders_count,
        'units_sold', v_units_sold,
        'avg_ticket', v_avg_ticket,
        'margin_percent', v_margin_pct
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. POLÍTICAS DE SEGURIDAD RLS PARA ACCESO ADMINISTRATIVO DE INTELIGENCIA
-- Las vistas heredan las políticas de las tablas subyacentes. Aseguramos permisos RPC.
GRANT EXECUTE ON FUNCTION public.get_bi_executive_summary TO authenticated;
