-- FIX FOR CRM AND CUSTOMERS
-- 20260813_21_schema_cleanup.sql

-- 1. ADD MISSING COLUMNS TO CUSTOMERS
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS last_order_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS total_spent_cup numeric(12, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_orders integer DEFAULT 0;

-- 2. ADD ALIAS FOR NAME IF NECESSARY OR RENAME
-- We will rename full_name to name to match the service and common patterns
-- First check if name exists, if not rename full_name
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='name') THEN
        ALTER TABLE public.customers RENAME COLUMN full_name TO name;
    END IF;
END $$;

-- 3. ENSURE BANNERS TABLE HAS ALL NECESSARY FIELDS (it already seems okay but let's be sure)
-- (Already handled in 007)

-- 4. UPDATE PERMISSIONS FOR NEW COLUMNS
-- (Policies usually cover all columns, so we are good if we have is_admin policies)
