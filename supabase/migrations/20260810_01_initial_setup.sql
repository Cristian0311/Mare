-- FASE 42 — INFRAESTRUCTURA INICIAL MARÉ
-- Este script prepara la base de datos para la plataforma MARÉ.

-- 1. EXTENSIONES
-- Habilitamos uuid-ossp para identificadores únicos universales.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE PRUEBA DE CONEXIÓN
-- Una tabla simple para verificar que la infraestructura responde correctamente.
CREATE TABLE IF NOT EXISTS public.health_check (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    status text NOT NULL DEFAULT 'online',
    last_check timestamp with time zone DEFAULT now()
);

-- Insertamos un registro inicial para pruebas.
INSERT INTO public.health_check (status) VALUES ('online')
ON CONFLICT DO NOTHING;

-- 3. POLÍTICAS DE SEGURIDAD (RLS) INICIALES
ALTER TABLE public.health_check ENABLE ROW LEVEL SECURITY;

-- Permitimos lectura pública para la prueba de conectividad inicial.
CREATE POLICY "Allow public read for health_check" 
ON public.health_check FOR SELECT 
TO anon 
USING (true);

-- 4. FUNCIÓN PARA ACTUALIZAR TIMESTAMPS
-- Una función genérica que utilizaremos en todas las tablas para updated_at.
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. COMENTARIOS DE DOCUMENTACIÓN
COMMENT ON TABLE public.health_check IS 'Tabla técnica para verificación de conectividad inicial de MARÉ.';
