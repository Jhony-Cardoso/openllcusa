-- Add servicio_id column to pedidos table
-- This allows pedidos to reference either a paquete (bundle) or an individual servicio

ALTER TABLE public.pedidos 
ADD COLUMN IF NOT EXISTS servicio_id uuid REFERENCES public.servicios(id);

-- Add a comment to clarify the usage
COMMENT ON COLUMN public.pedidos.paquete_id IS 'References a bundle/package from paquetes table (LLC Esencial, Launch + Banking, Primer Año Pro)';
COMMENT ON COLUMN public.pedidos.servicio_id IS 'References an individual service from servicios table';
