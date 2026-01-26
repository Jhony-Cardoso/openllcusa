-- Migration: Add codigo_pais field to pedidos table
-- Date: 2026-01-25
-- Description: Add country code field for phone numbers

ALTER TABLE public.pedidos 
ADD COLUMN IF NOT EXISTS codigo_pais VARCHAR(10) DEFAULT '+34';

COMMENT ON COLUMN public.pedidos.codigo_pais IS 'Código de país para el teléfono de la empresa (ej: +34, +1, +52)';
