-- FASE 50 — CRM SUPPORT
-- 1. EXTENDER TABLA DE CLIENTES
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
ADD COLUMN IF NOT EXISTS internal_notes text,
ADD COLUMN IF NOT EXISTS advisor_id uuid REFERENCES public.advisors(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS tags text[];

-- 2. TABLA DE NOTAS HISTÓRICAS (Opcional pero recomendado para auditoría)
CREATE TABLE IF NOT EXISTS public.customer_notes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    note text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. ÍNDICES PARA CRM
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_status ON public.customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_advisor_id ON public.customers(advisor_id);

-- 4. RLS POLICIES (Actualización para CRM)
-- Asegurar que solo admins pueden ver y editar estos campos
DROP POLICY IF EXISTS "Admins have full access to customer_notes" ON public.customer_notes;
CREATE POLICY "Admins have full access to customer_notes" 
ON public.customer_notes FOR ALL TO authenticated 
USING (public.is_admin());

-- Comentarios
COMMENT ON COLUMN public.customers.status IS 'Estado del cliente para el CRM (activo/archivado).';
COMMENT ON COLUMN public.customers.internal_notes IS 'Notas administrativas rápidas.';
COMMENT ON COLUMN public.customers.advisor_id IS 'Asesor asignado permanentemente al cliente.';
