-- FASE 43 — PEDIDOS Y RESERVAS
-- 006_orders_and_reservations.sql

-- 1. PEDIDOS
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
    advisor_id uuid REFERENCES public.advisors(id) ON DELETE SET NULL,
    order_type text NOT NULL DEFAULT 'retail' CHECK (order_type IN ('retail', 'wholesale', 'reservation')),
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'ready', 'delivered', 'cancelled')),
    subtotal_cup numeric(12, 2) NOT NULL DEFAULT 0,
    delivery_fee_cup numeric(12, 2) NOT NULL DEFAULT 0,
    total_cup numeric(12, 2) NOT NULL DEFAULT 0,
    province_id uuid REFERENCES public.provinces(id) ON DELETE SET NULL,
    municipality_id uuid REFERENCES public.municipalities(id) ON DELETE SET NULL,
    address text,
    customer_notes text,
    whatsapp_sent boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. ÍTEMS DE PEDIDO (HISTÓRICO)
CREATE TABLE IF NOT EXISTS public.order_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
    product_name text NOT NULL, -- Nombre al momento de la compra
    unit_price_cup numeric(12, 2) NOT NULL, -- Precio al momento de la compra
    quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
    subtotal_cup numeric(12, 2) NOT NULL,
    variant_info jsonb, -- Para tallas/colores si existen
    created_at timestamp with time zone DEFAULT now()
);

-- 3. RESERVAS (MARÉ RESERVA 30/70)
CREATE TABLE IF NOT EXISTS public.reservations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
    product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
    advisor_id uuid REFERENCES public.advisors(id) ON DELETE SET NULL,
    quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price_at_reservation numeric(12, 2) NOT NULL,
    deposit_percentage integer NOT NULL DEFAULT 30,
    remaining_percentage integer NOT NULL DEFAULT 70,
    deposit_amount_cup numeric(12, 2) NOT NULL,
    remaining_amount_cup numeric(12, 2) NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'requested', 'purchased', 'ready', 'delivered', 'cancelled')),
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT reservation_percentage_check CHECK (deposit_percentage + remaining_percentage = 100)
);

-- Triggers para updated_at
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_reservations_updated_at
    BEFORE UPDATE ON public.reservations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. ÍNDICES
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reservations_customer_id ON public.reservations(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 5. COMENTARIOS
COMMENT ON TABLE public.orders IS 'Cabecera de pedidos realizados en la tienda.';
COMMENT ON TABLE public.order_items IS 'Líneas de detalle de cada pedido. Preserva datos históricos.';
COMMENT ON TABLE public.reservations IS 'Gestión de reservas MARÉ Reserva (30% adelanto / 70% llegada).';
