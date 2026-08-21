-- FASE 53 — PROVEEDORES, COMPRAS Y REABASTECIMIENTO

-- 1. TABLA DE PROVEEDORES
CREATE TABLE IF NOT EXISTS public.suppliers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    contact_name text,
    phone text,
    whatsapp text,
    email text,
    address text,
    province_id integer,
    municipality_id integer,
    notes text,
    status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. ASOCIACIÓN PRODUCTO-PROVEEDOR
CREATE TABLE IF NOT EXISTS public.supplier_products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    last_cost numeric(15, 2) DEFAULT 0,
    currency text DEFAULT 'CUP' CHECK (currency IN ('CUP', 'USD', 'EUR')),
    is_primary boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(supplier_id, product_id)
);

-- 3. TABLA DE COMPRAS (PURCHASES)
CREATE TABLE IF NOT EXISTS public.purchases (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_number text UNIQUE NOT NULL,
    supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'received', 'cancelled')),
    total_amount numeric(15, 2) DEFAULT 0,
    currency text DEFAULT 'CUP',
    notes text,
    admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    received_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 4. ITEMS DE LA COMPRA
CREATE TABLE IF NOT EXISTS public.purchase_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_id uuid NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity integer NOT NULL CHECK (quantity > 0),
    unit_cost numeric(15, 2) NOT NULL CHECK (unit_cost >= 0),
    subtotal numeric(15, 2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- 5. RLS POLICIES (Solo Admins)
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to suppliers" ON public.suppliers FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to supplier_products" ON public.supplier_products FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to purchases" ON public.purchases FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to purchase_items" ON public.purchase_items FOR ALL TO authenticated USING (public.is_admin());

-- 6. RPC PARA RECIBIR COMPRA (ATÓMICO E IDEMPOTENTE)
CREATE OR REPLACE FUNCTION public.receive_purchase(p_purchase_id uuid, p_admin_id uuid)
RETURNS json AS $$
DECLARE
    v_purchase record;
    v_item record;
    v_result json;
BEGIN
    -- 1. Bloquear compra y verificar estado
    SELECT * INTO v_purchase FROM public.purchases WHERE id = p_purchase_id FOR UPDATE;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Compra no encontrada');
    END IF;
    
    IF v_purchase.status = 'received' THEN
        RETURN json_build_object('success', false, 'error', 'La compra ya ha sido recibida');
    END IF;

    -- 2. Procesar cada item
    FOR v_item IN SELECT * FROM public.purchase_items WHERE purchase_id = p_purchase_id LOOP
        -- Usar la función de ajuste de stock de la Fase 52
        PERFORM public.adjust_product_stock(
            v_item.product_id,
            v_item.quantity,
            'entry',
            'Recepción de Compra #' || v_purchase.purchase_number,
            NULL, -- order_id
            NULL, -- reservation_id
            p_admin_id
        );
        
        -- Actualizar costo en supplier_products
        INSERT INTO public.supplier_products (supplier_id, product_id, last_cost, currency)
        VALUES (v_purchase.supplier_id, v_item.product_id, v_item.unit_cost, v_purchase.currency)
        ON CONFLICT (supplier_id, product_id) 
        DO UPDATE SET last_cost = EXCLUDED.last_cost, currency = EXCLUDED.currency;
    END LOOP;

    -- 3. Marcar compra como recibida
    UPDATE public.purchases 
    SET status = 'received', received_at = now(), updated_at = now(), admin_id = p_admin_id
    WHERE id = p_purchase_id;

    RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ÍNDICES
CREATE INDEX IF NOT EXISTS idx_purchases_supplier ON public.purchases(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase ON public.purchase_items(purchase_id);

-- 7. ACTUALIZAR TABLA DE PRODUCTOS
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS primary_supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cost_cup numeric(15, 2) DEFAULT 0;
