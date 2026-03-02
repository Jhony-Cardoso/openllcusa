-- =============================================================
-- EJECUTAR EN SUPABASE SQL EDITOR si la tabla 'notificaciones'
-- no existe todavía (es la causa del error 503 en el polling).
-- =============================================================

-- 1. Crear la tabla si no existe
CREATE TABLE IF NOT EXISTS notificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_notificaciones_user_id ON notificaciones(user_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leido ON notificaciones(leido);
CREATE INDEX IF NOT EXISTS idx_notificaciones_created_at ON notificaciones(created_at DESC);

-- 3. Activar RLS
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

-- 4. Policies (con IF NOT EXISTS usando DO block)
DO $$
BEGIN
  -- Policy SELECT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'notificaciones' AND policyname = 'Users can view own notifications'
  ) THEN
    CREATE POLICY "Users can view own notifications"
      ON notificaciones FOR SELECT
      USING (auth.uid()::text = user_id);
  END IF;

  -- Policy UPDATE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'notificaciones' AND policyname = 'Users can update own notifications'
  ) THEN
    CREATE POLICY "Users can update own notifications"
      ON notificaciones FOR UPDATE
      USING (auth.uid()::text = user_id);
  END IF;

  -- Policy INSERT (service_role bypass)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'notificaciones' AND policyname = 'Service role can insert notifications'
  ) THEN
    CREATE POLICY "Service role can insert notifications"
      ON notificaciones FOR INSERT
      WITH CHECK (true);
  END IF;
END
$$;

-- 5. Verificación final
SELECT 'Tabla notificaciones OK' AS status, COUNT(*) AS filas FROM notificaciones;
