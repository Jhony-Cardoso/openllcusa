-- Migración: Crear tabla de facturas
-- Fecha: 2026-02-14

-- ⚠️ IMPORTANTE: Borrar tabla anterior para evitar conflictos de esquema
DROP TABLE IF EXISTS facturas CASCADE;

-- Crear tabla facturas
CREATE TABLE IF NOT EXISTS facturas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    numero_factura TEXT NOT NULL UNIQUE,
    
    -- Montos
    subtotal DECIMAL(10, 2) NOT NULL,
    impuestos DECIMAL(10, 2) DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL,
    
    -- Información de pago
    metodo_pago TEXT NOT NULL, -- 'stripe', 'paypal', etc.
    estado_pago TEXT NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'pagada', 'cancelada'
    fecha_pago TIMESTAMP WITH TIME ZONE,
    
    -- Archivo PDF
    pdf_path TEXT,
    
    -- Metadata adicional (JSON)
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_facturas_pedido_id ON facturas(pedido_id);
CREATE INDEX IF NOT EXISTS idx_facturas_user_id ON facturas(user_id);
CREATE INDEX IF NOT EXISTS idx_facturas_numero_factura ON facturas(numero_factura);
CREATE INDEX IF NOT EXISTS idx_facturas_estado_pago ON facturas(estado_pago);
CREATE INDEX IF NOT EXISTS idx_facturas_created_at ON facturas(created_at DESC);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_facturas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_facturas_updated_at
    BEFORE UPDATE ON facturas
    FOR EACH ROW
    EXECUTE FUNCTION update_facturas_updated_at();

-- Política: Usuarios pueden ver sus propias facturas
CREATE POLICY "Usuarios pueden ver sus propias facturas" ON facturas
    FOR SELECT
    TO authenticated
    USING (auth.uid()::text = user_id);

-- ---------------------------------------------------------------------------
-- EXTRAS: Configuración de Storage
-- ---------------------------------------------------------------------------

-- Crear bucket 'facturas' si no existe (Privado)
INSERT INTO storage.buckets (id, name, public)
VALUES ('facturas', 'facturas', false)
ON CONFLICT (id) DO NOTHING;

-- Política de Storage: Permitir acceso total al rol 'service_role' (Admin)
-- Nota: El service_role usualmente tiene acceso total por defecto, pero esto asegura 
-- que no haya bloqueos si se cambian configuraciones por defecto.
CREATE POLICY "Service Role tiene acceso total a facturas" ON storage.objects
    FOR ALL
    TO service_role
    USING (bucket_id = 'facturas')
    WITH CHECK (bucket_id = 'facturas');

-- Comentarios para documentación
COMMENT ON TABLE facturas IS 'Facturas generadas para los pedidos';
COMMENT ON COLUMN facturas.numero_factura IS 'Número único de factura (ej: INV-2024-001)';
COMMENT ON COLUMN facturas.subtotal IS 'Subtotal antes de impuestos';
COMMENT ON COLUMN facturas.impuestos IS 'Monto de impuestos aplicados';
COMMENT ON COLUMN facturas.total IS 'Total final (subtotal + impuestos)';
COMMENT ON COLUMN facturas.metodo_pago IS 'Método de pago utilizado';
COMMENT ON COLUMN facturas.estado_pago IS 'Estado del pago: pendiente, pagada, cancelada';
COMMENT ON COLUMN facturas.pdf_path IS 'Ruta del PDF de la factura en Supabase Storage';
COMMENT ON COLUMN facturas.metadata IS 'Información adicional en formato JSON';
