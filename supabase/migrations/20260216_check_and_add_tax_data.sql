
-- Script robusto para verificar y añadir la columna tax_data
-- Ejecutar en el Editor SQL de Supabase

DO $$ 
BEGIN 
    -- 1. Verificar si la columna existe en la tabla pedidos
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pedidos' AND column_name = 'tax_data') THEN
        RAISE NOTICE '✅ La columna tax_data YA EXISTE en la tabla pedidos.';
    ELSE
        -- 2. Si no existe, intentar crearla
        RAISE NOTICE '⚠️ La columna tax_data NO existe. Creándola...';
        ALTER TABLE pedidos ADD COLUMN tax_data JSONB DEFAULT '{}'::jsonb;
        RAISE NOTICE '✅ Columna tax_data CREATE EXITOSAMENTE.';
    END IF;

    -- 3. Verificar permisos (opcional, asegurar que authenticated pueda usarla)
    -- GRANT ALL ON pedidos TO authenticated; -- Descomentar si es necesario
    -- GRANT ALL ON pedidos TO service_role;
END $$;

-- 4. Consulta de verificación final (debe devolver una fila con tax_data null o {})
SELECT id, tax_data FROM pedidos LIMIT 1;
