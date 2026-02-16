-- Migración: Añadir columna tax_data a la tabla pedidos
-- Fecha: 2026-02-14

-- Añadir columna JSONB para guardar datos fiscales estructurados
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS tax_data JSONB DEFAULT '{}'::jsonb;

-- Comentario para documentación
COMMENT ON COLUMN pedidos.tax_data IS 'Almacena datos estructurados para trámites fiscales (Form 5472, BOI, etc)';

-- Índice para búsquedas rápidas dentro del JSON (opcional pero recomendado)
CREATE INDEX IF NOT EXISTS idx_pedidos_tax_data ON pedidos USING gin (tax_data);
