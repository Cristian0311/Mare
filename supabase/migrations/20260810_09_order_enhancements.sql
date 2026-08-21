ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS order_number text,
ADD COLUMN IF NOT EXISTS internal_notes text;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z}';
    result text := '';
    i integer := 0;
BEGIN
    IF NEW.order_number IS NULL THEN
        FOR i IN 1..6 LOOP
            result := result || chars[1+random()*(array_length(chars, 1)-1)];
        END LOOP;
        NEW.order_number := 'ORD-' || to_char(NEW.created_at, 'YYMMDD') || '-' || result;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number ON public.orders;
CREATE TRIGGER set_order_number
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

-- Actualizar existentes
UPDATE public.orders SET order_number = 'ORD-OLD-' || substr(md5(id::text), 1, 6) WHERE order_number IS NULL;

-- Make it unique
ALTER TABLE public.orders ADD CONSTRAINT unique_order_number UNIQUE (order_number);
