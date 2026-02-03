-- Crear tabla de tareas administrativas
CREATE TABLE IF NOT EXISTS tareas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL, -- 'tramite_ein', 'formacion_llc', 'revision_documentos', etc.
  descripcion TEXT,
  estado TEXT DEFAULT 'pendiente', -- 'pendiente', 'en_proceso', 'esperando_cliente', 'completado'
  prioridad TEXT DEFAULT 'normal', -- 'baja', 'normal', 'alta', 'urgente'
  asignado_a TEXT, -- ID del admin asignado (opcional por ahora)
  metadata JSONB DEFAULT '{}'::jsonb, -- Para guardar datos extra específicos del trámite
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_tareas_pedido_id ON tareas(pedido_id);
CREATE INDEX IF NOT EXISTS idx_tareas_estado ON tareas(estado);
CREATE INDEX IF NOT EXISTS idx_tareas_created_at ON tareas(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;

-- Políticas:
-- 1. Los admins pueden ver y editar todas las tareas
-- (Por ahora, asumiremos que usaremos service_role para gestionar esto desde el backend, 
-- pero definimos una política básica para futuros usuarios admin)

CREATE POLICY "Service role has full access"
  ON tareas
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comentarios
COMMENT ON TABLE tareas IS 'Tareas internas para el equipo de administración';
COMMENT ON COLUMN tareas.tipo IS 'Tipo de trámite o tarea a realizar';
COMMENT ON COLUMN tareas.estado IS 'Estado actual del flujo de trabajo';
