-- Fix foreign key constraints for pedidos table
-- This script ensures the relationships are properly set up

-- First, drop existing constraints if they exist (to avoid errors)
ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_paquete_id_fkey;
ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_servicio_id_fkey;
ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_estado_usa_id_fkey;

-- Now add them back with proper references
ALTER TABLE public.pedidos 
  ADD CONSTRAINT pedidos_paquete_id_fkey 
  FOREIGN KEY (paquete_id) 
  REFERENCES public.paquetes(id) 
  ON DELETE SET NULL;

ALTER TABLE public.pedidos 
  ADD CONSTRAINT pedidos_servicio_id_fkey 
  FOREIGN KEY (servicio_id) 
  REFERENCES public.servicios(id) 
  ON DELETE SET NULL;

ALTER TABLE public.pedidos 
  ADD CONSTRAINT pedidos_estado_usa_id_fkey 
  FOREIGN KEY (estado_usa_id) 
  REFERENCES public.estados_usa(id) 
  ON DELETE SET NULL;

-- Verify the constraints were created
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'pedidos'
  AND tc.table_schema = 'public';
