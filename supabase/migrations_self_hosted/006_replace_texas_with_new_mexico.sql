-- Migration: Replace Texas with New Mexico
-- Date: 2026-01-25
-- Description: Remove Texas and add New Mexico to the estados_usa table

-- 1. Desactivar Texas
UPDATE public.estados_usa 
SET activo = false 
WHERE codigo = 'TX';

-- 2. Insertar Nuevo México
INSERT INTO public.estados_usa (id, codigo, nombre, filing_anual, filing_inicial, descripcion, ventajas, popular, recomendado, activo)
VALUES
  ('a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7', 'NM', 'New Mexico', 50.00, 50.00, 
   'Estado con costos de mantenimiento muy bajos y proceso de formación simple', 
   '["Costos de filing muy bajos (50 USD anual)", "Proceso de formación simple", "Buena privacidad para los propietarios", "Sin impuesto estatal sobre ingresos de LLC"]'::jsonb, 
   false, false, true)
ON CONFLICT (id) DO UPDATE SET
  codigo = EXCLUDED.codigo,
  nombre = EXCLUDED.nombre,
  filing_anual = EXCLUDED.filing_anual,
  filing_inicial = EXCLUDED.filing_inicial,
  descripcion = EXCLUDED.descripcion,
  ventajas = EXCLUDED.ventajas,
  popular = EXCLUDED.popular,
  recomendado = EXCLUDED.recomendado,
  activo = EXCLUDED.activo;
