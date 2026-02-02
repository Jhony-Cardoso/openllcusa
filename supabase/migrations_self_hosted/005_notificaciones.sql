-- Crear tabla de notificaciones para el dashboard
CREATE TABLE IF NOT EXISTS notificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL, -- 'pago_exitoso', 'pedido_completado', 'documento_listo', etc.
  titulo TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  url TEXT, -- URL opcional para redirigir al hacer clic
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_notificaciones_user_id ON notificaciones(user_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leido ON notificaciones(leido);
CREATE INDEX IF NOT EXISTS idx_notificaciones_created_at ON notificaciones(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver sus propias notificaciones
CREATE POLICY "Users can view own notifications"
  ON notificaciones
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Política: Los usuarios pueden marcar como leídas sus notificaciones
CREATE POLICY "Users can update own notifications"
  ON notificaciones
  FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Política: El sistema puede crear notificaciones (usando service_role)
CREATE POLICY "Service role can insert notifications"
  ON notificaciones
  FOR INSERT
  WITH CHECK (true);

-- Comentarios para documentación
COMMENT ON TABLE notificaciones IS 'Notificaciones del sistema para mostrar en el dashboard del usuario';
COMMENT ON COLUMN notificaciones.tipo IS 'Tipo de notificación: pago_exitoso, pedido_completado, documento_listo, etc.';
COMMENT ON COLUMN notificaciones.leido IS 'Indica si el usuario ya vio la notificación';
COMMENT ON COLUMN notificaciones.url IS 'URL opcional para redirigir cuando el usuario hace clic en la notificación';
