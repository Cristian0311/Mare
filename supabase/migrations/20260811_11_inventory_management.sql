-- FASE 52 — INVENTORY MANAGEMENT
-- 1. EXTENDER TABLA DE PRODUCTOS
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS stock_tracking boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS stock_quantity integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS reserved_quantity integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS low_stock_threshold integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS availability_status text DEFAULT 'available' CHECK (availability_status IN ('available', 'low_stock', 'out_of_stock', 'on_order', 'discontinued'));

-- 2. TABLA DE MOVIMIENTOS DE INVENTARIO
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('entry', 'sale', 'reserve', 'release', 'adjustment', 'return')),
    quantity integer NOT NULL,
    previous_stock integer NOT NULL,
    new_stock integer NOT NULL,
    reason text,
    order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
    reservation_id uuid REFERENCES public.reservations(id) ON DELETE SET NULL,
    admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. ÍNDICES
CREATE INDEX IF NOT EXISTS idx_inv_product_id ON public.inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inv_type ON public.inventory_movements(type);
CREATE INDEX IF NOT EXISTS idx_products_availability ON public.products(availability_status);

-- 4. RLS POLICIES
DROP POLICY IF EXISTS "Admins have full access to inventory_movements" ON public.inventory_movements;
CREATE POLICY "Admins have full access to inventory_movements" 
ON public.inventory_movements FOR ALL TO authenticated 
USING (public.is_admin());

-- 5. FUNCTION TO UPDATE AVAILABILITY STATUS
CREATE OR REPLACE FUNCTION public.update_product_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT NEW.stock_tracking THEN
        NEW.availability_status := 'available';
    ELSIF NEW.stock_quantity - NEW.reserved_quantity <= 0 THEN
        NEW.availability_status := 'out_of_stock';
    ELSIF NEW.stock_quantity - NEW.reserved_quantity <= NEW.low_stock_threshold THEN
        NEW.availability_status := 'low_stock';
    ELSE
        NEW.availability_status := 'available';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_availability
BEFORE INSERT OR UPDATE OF stock_quantity, reserved_quantity, stock_tracking, low_stock_threshold
ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_product_availability();

-- Comentarios
COMMENT ON COLUMN public.products.stock_tracking IS 'Habilita el control de inventario numérico.';
COMMENT ON COLUMN public.products.stock_quantity IS 'Cantidad física total en almacén.';
COMMENT ON COLUMN public.products.reserved_quantity IS 'Cantidad comprometida en pedidos confirmados o reservas.';

-- 6. RPC PARA AJUSTE ATÓMICO DE STOCK (PREVENIR CONCURRENCIA)
CREATE OR REPLACE FUNCTION public.adjust_product_stock(
    p_product_id uuid,
    p_quantity integer,
    p_type text,
    p_reason text,
    p_order_id uuid DEFAULT NULL,
    p_reservation_id uuid DEFAULT NULL,
    p_admin_id uuid DEFAULT NULL
)
RETURNS json AS $$
DECLARE
    v_prev_stock integer;
    v_new_stock integer;
    v_prev_reserved integer;
    v_new_reserved integer;
    v_tracking boolean;
    v_result json;
BEGIN
    -- 1. Obtener estado actual con bloqueo de fila
    SELECT stock_quantity, reserved_quantity, stock_tracking 
    INTO v_prev_stock, v_prev_reserved, v_tracking
    FROM public.products
    WHERE id = p_product_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Producto no encontrado');
    END IF;

    IF NOT v_tracking THEN
        RETURN json_build_object('success', true, 'message', 'Producto sin seguimiento de stock');
    END IF;

    v_new_stock := v_prev_stock;
    v_new_reserved := v_prev_reserved;

    -- 2. Lógica de Negocio
    CASE p_type
        WHEN 'entry' THEN
            v_new_stock := v_prev_stock + p_quantity;
        WHEN 'sale' THEN
            v_new_stock := v_prev_stock - p_quantity;
        WHEN 'reserve' THEN
            v_new_reserved := v_prev_reserved + p_quantity;
        WHEN 'release' THEN
            v_new_reserved := v_prev_reserved - p_quantity;
        WHEN 'adjustment' THEN
            v_new_stock := p_quantity;
        WHEN 'return' THEN
            v_new_stock := v_prev_stock + p_quantity;
    END CASE;

    -- 3. Validar consistencia básica (opcional, dependiendo de si permitimos stock negativo)
    -- IF v_new_stock < 0 THEN
    --     RETURN json_build_object('success', false, 'error', 'Stock insuficiente');
    -- END IF;

    -- 4. Actualizar producto
    UPDATE public.products
    SET 
        stock_quantity = v_new_stock,
        reserved_quantity = v_new_reserved,
        updated_at = now()
    WHERE id = p_product_id;

    -- 5. Registrar movimiento
    INSERT INTO public.inventory_movements (
        product_id, type, quantity, previous_stock, new_stock, reason, order_id, reservation_id, admin_id
    ) VALUES (
        p_product_id, p_type, 
        CASE WHEN p_type = 'adjustment' THEN p_quantity - v_prev_stock ELSE p_quantity END,
        v_prev_stock, v_new_stock, p_reason, p_order_id, p_reservation_id, p_admin_id
    );

    RETURN json_build_object(
        'success', true, 
        'previous_stock', v_prev_stock,
        'new_stock', v_new_stock,
        'reserved_quantity', v_new_reserved
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. EXTENSIÓN DE ORDER_ITEMS PARA SOPORTE MAYORISTA
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS is_wholesale boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS units_per_presentation integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS presentation_name text;
