-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    user_id text NOT NULL PRIMARY KEY,
    email text,
    stripe_customer_id text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. Estados USA
CREATE TABLE IF NOT EXISTS public.estados_usa (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    codigo text NOT NULL,
    nombre text NOT NULL,
    filing_anual numeric NOT NULL,
    filing_inicial numeric,
    descripcion text,
    ventajas jsonb,
    popular boolean DEFAULT false,
    recomendado boolean DEFAULT false,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. Servicios
CREATE TABLE IF NOT EXISTS public.servicios (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    nombre text NOT NULL,
    descripcion text,
    precio numeric NOT NULL,
    precio_recurrente numeric,
    frecuencia_recurrente text,
    categoria text,
    stripe_price_id text,
    stripe_price_id_recurrente text,
    requiere_llc boolean DEFAULT false,
    activo boolean DEFAULT true,
    tipo text DEFAULT 'paquete',
    flujo_onboarding jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 4. Paquetes (Legacy/Duplicate? Included for completeness)
CREATE TABLE IF NOT EXISTS public.paquetes (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    nombre text NOT NULL,
    nombre_corto text,
    precio numeric DEFAULT 0,
    precio_mensual numeric,
    descripcion text,
    descripcion_corta text,
    caracteristicas jsonb,
    destacado boolean DEFAULT false,
    orden integer DEFAULT 0,
    stripe_price_id text,
    stripe_price_id_mensual text,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 5. Pedidos
CREATE TABLE IF NOT EXISTS public.pedidos (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    numero_pedido text NOT NULL,
    user_id text NOT NULL,
    paquete_id uuid REFERENCES public.paquetes(id), -- References paquetes table for bundles
    servicio_id uuid REFERENCES public.servicios(id), -- References servicios table for individual services
    estado_usa_id uuid REFERENCES public.estados_usa(id),
    estado_pedido text DEFAULT 'borrador',
    paso_actual integer DEFAULT 1,
    nombre_empresa text,
    sector text,
    descripcion_negocio text,
    num_socios integer,
    ingresos_estimados text,
    email_empresa text,
    telefono_empresa text,
    direccion_empresa jsonb,
    notas_cliente text,
    preferencias jsonb,
    stripe_customer_id text,
    stripe_payment_intent_id text,
    stripe_session_id text,
    tipo_pago text,
    total_pagado numeric,
    fecha_pago timestamp with time zone,
    metadata jsonb,
    documentos_subidos text[],
    completado_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 6. Pedido Servicios (Relation M2M or specific items)
CREATE TABLE IF NOT EXISTS public.pedido_servicios (
    pedido_id uuid REFERENCES public.pedidos(id) ON DELETE CASCADE,
    servicio_id uuid REFERENCES public.servicios(id),
    PRIMARY KEY (pedido_id, servicio_id)
);

-- 7. Suscripciones
CREATE TABLE IF NOT EXISTS public.suscripciones (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id text NOT NULL,
    pedido_id uuid REFERENCES public.pedidos(id),
    servicio_id uuid REFERENCES public.servicios(id),
    estado text DEFAULT 'active',
    stripe_customer_id text,
    stripe_subscription_id text,
    stripe_price_id text,
    cancel_at_period_end boolean DEFAULT false,
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    canceled_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 8. Facturas
CREATE TABLE IF NOT EXISTS public.facturas (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    numero_factura text NOT NULL,
    pedido_id uuid REFERENCES public.pedidos(id),
    user_id text,
    monto numeric NOT NULL,
    moneda text DEFAULT 'USD',
    estado text DEFAULT 'pagada',
    url_pdf text,
    stripe_invoice_id text,
    items jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- 9. Notificaciones
CREATE TABLE IF NOT EXISTS public.notificaciones (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id text NOT NULL,
    pedido_id uuid REFERENCES public.pedidos(id),
    tipo text NOT NULL,
    titulo text NOT NULL,
    mensaje text NOT NULL,
    url text,
    leido boolean DEFAULT false,
    leido_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

-- 10. Actividad Pedidos
CREATE TABLE IF NOT EXISTS public.actividad_pedidos (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    pedido_id uuid REFERENCES public.pedidos(id) ON DELETE CASCADE,
    user_id text,
    tipo_evento text NOT NULL,
    descripcion text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- 11. Documentos
CREATE TABLE IF NOT EXISTS public.documentos (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    pedido_id uuid REFERENCES public.pedidos(id),
    user_id text NOT NULL,
    tipo text NOT NULL,
    nombre_archivo text NOT NULL,
    url text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now()
);
-- Seed Data Migration Script
-- This script inserts the initial data for 'estados_usa', 'servicios', and 'paquetes'
-- extracted from the Cloud environment to ensure consistency.

-- 1. Seed 'estados_usa'
INSERT INTO public.estados_usa (id, codigo, nombre, filing_anual, filing_inicial, descripcion, ventajas, popular, recomendado, activo)
VALUES
  ('821dc3bc-f2e2-4659-aaab-a88d29360ac6', 'WY', 'Wyoming', 60.00, 100.00, NULL, NULL, true, true, true),
  ('101b5bd9-9f06-41c4-9c66-864e050915f1', 'DE', 'Delaware', 300.00, 90.00, NULL, NULL, false, false, true),
  ('4f9e2194-e6d2-43c9-aa66-0bca126ed892', 'FL', 'Florida', 138.00, 125.00, NULL, NULL, true, false, true),
  ('07b3f588-bacd-4140-8060-7a09049c9dd5', 'NV', 'Nevada', 150.00, 75.00, NULL, NULL, false, false, true),
  ('34181ad0-9679-4929-ace9-74aa65e373ed', 'TX', 'Texas', 300.00, 300.00, NULL, NULL, false, false, true)
ON CONFLICT (id) DO UPDATE SET
  codigo = EXCLUDED.codigo,
  nombre = EXCLUDED.nombre,
  filing_anual = EXCLUDED.filing_anual,
  filing_inicial = EXCLUDED.filing_inicial,
  popular = EXCLUDED.popular,
  recomendado = EXCLUDED.recomendado,
  activo = EXCLUDED.activo;

-- 2. Seed 'paquetes'
-- Note: inserting legacy/duplicate 'paquetes' table data first as it has no dependencies (other than potential FKs which we are populating).
INSERT INTO public.paquetes (id, slug, nombre, nombre_corto, precio, precio_mensual, descripcion, descripcion_corta, caracteristicas, destacado, orden, stripe_price_id, stripe_price_id_mensual, activo)
VALUES
  ('2f1a8223-c047-4d45-8b97-f5e2e7423536', 'llc-esencial', 'LLC Esencial', 'Esencial', 597.00, NULL, NULL, 'Para validar tu negocio sin complicarte', '["ConstituciÃ³n de tu LLC en el estado correcto", "ObtenciÃ³n de tu EIN aunque no tengas SSN o ITIN", "Operating agreement y documentos esenciales listos para bancos y clientes", "1 aÃ±o de agente registrado y direcciÃ³n bÃ¡sica oficial", "GuÃ­a clara sobre impuestos bÃ¡sicos, BOIR y relaciÃ³n con Hacienda EspaÃ±a"]', false, 1, NULL, NULL, true),
  ('fa610998-6f5f-4ee6-a2ee-ed0e78086c7c', 'launch-banking', 'Launch + Banking', 'Launch', 897.00, NULL, NULL, 'Para lanzar y cobrar con tu LLC desde el primer mes', '["Todo lo incluido en LLC Esencial", "AcompaÃ±amiento para apertura de cuenta en banca online o fintech alineadas con no residentes", "RevisiÃ³n de tu primera factura y estructura de cobros a clientes internacionales", "SesiÃ³n 1:1 de 45-60 minutos para definir estado, banco y enfoque fiscal inicial", "Checklist de lanzamiento de LLC creada a LLC facturando sin pasos ocultos"]', true, 2, NULL, NULL, true),
  ('fee3bc8a-4861-4bbe-bca4-ae2df87b26f7', 'primer-ano-pro', 'Primer AÃ±o Pro', 'Pro', 1397.00, NULL, NULL, 'Primer aÃ±o casi todo resuelto', '["Todo lo incluido en Launch + Banking", "PreparaciÃ³n y presentaciÃ³n del BOIR dentro de plazo", "GestiÃ³n del reporte o impuesto anual estatal (nuestros honorarios incluidos, tasas aparte)", "Soporte prioritario por email/WhatsApp para dudas operativas y fiscales del dÃ­a a dÃ­a", "RevisiÃ³n bÃ¡sica de tu contabilidad hasta un volumen mÃ¡ximo de movimientos"]', false, 3, NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio,
  caracteristicas = EXCLUDED.caracteristicas,
  destacado = EXCLUDED.destacado,
  orden = EXCLUDED.orden;

-- 3. Seed 'servicios'
INSERT INTO public.servicios (id, slug, nombre, descripcion, precio, precio_recurrente, frecuencia_recurrente, categoria, stripe_price_id, stripe_price_id_recurrente, requiere_llc, activo, tipo, flujo_onboarding)
VALUES
  ('82c55079-3b09-4c4c-986b-d16e7e9d2257', 'formacion-llc', 'FormaciÃ³n de LLC', 'ConstituciÃ³n completa de tu LLC en el estado que elijas', 497.00, NULL, NULL, 'constitucion', NULL, NULL, false, true, 'individual', NULL),
  ('a89f7a00-092f-45c1-a908-b9ba465a27f5', 'form-5472', 'Form 5472 + 1120', 'DeclaraciÃ³n anual federal para LLC con propietarios extranjeros', 397.00, NULL, NULL, 'fiscal', NULL, NULL, false, true, 'individual', NULL),
  ('7d3f579b-163e-4a3b-ae0b-62d0c7e6b1db', 'consultoria-fiscal', 'ConsultorÃ­a Fiscal', 'SesiÃ³n de consultorÃ­a personalizada 1 hora', 197.00, NULL, NULL, 'fiscal', NULL, NULL, false, true, 'individual', NULL),
  ('fdbf0572-5c56-447b-93db-aace1faccfb1', 'obtencion-ein', 'ObtenciÃ³n de EIN', 'Tramitamos tu EIN con el IRS. Ideal si ya tienes la LLC pero te falta el nÃºmero fiscal.', 197.00, NULL, NULL, 'tramites', NULL, NULL, true, true, 'individual', NULL),
  ('0489df83-75f2-4a58-add6-8cf78879faed', 'agente-registrado', 'Agente Registrado', 'Servicio de agente registrado anual', 149.00, 149.00, 'anual', 'cumplimiento', NULL, NULL, false, true, 'individual', NULL),
  
  -- Packages mirrored in servicios table
  ('8df54884-63d8-4903-911e-b830d4374352', 'launch-banking', 'Launch + Banking', 'Para lanzar y cobrar con tu LLC desde el primer mes. Incluye FormaciÃ³n LLC + Soporte Bancario.', 897.00, NULL, NULL, 'paquetes', NULL, NULL, false, true, 'paquete', '["intro", "estado", "datos-empresa", "revision", "checkout", "completado"]'),
  ('06257795-e9ec-4f21-b8dc-a743056becaf', 'llc-esencial', 'LLC Esencial', 'Para validar tu negocio sin complicarte. CreaciÃ³n LLC, EIN y documentaciÃ³n bÃ¡sica.', 597.00, NULL, NULL, 'paquetes', NULL, NULL, false, true, 'paquete', '["intro", "estado", "datos-empresa", "revision", "checkout", "completado"]'),
  ('78d8b169-93d0-4ca7-bbc5-022316ce8f6c', 'primer-ano-pro', 'Primer AÃ±o Pro', 'Primer aÃ±o casi todo resuelto. Todo lo de Launch + Banking mÃ¡s gestiÃ³n fiscal y BOIR.', 1397.00, NULL, NULL, 'paquetes', NULL, NULL, false, true, 'paquete', '["intro", "estado", "datos-empresa", "revision", "checkout", "completado"]')

ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio,
  precio_recurrente = EXCLUDED.precio_recurrente,
  tipo = EXCLUDED.tipo,
  flujo_onboarding = EXCLUDED.flujo_onboarding;
-- Add servicio_id column to pedidos table
-- This allows pedidos to reference either a paquete (bundle) or an individual servicio

ALTER TABLE public.pedidos 
ADD COLUMN IF NOT EXISTS servicio_id uuid REFERENCES public.servicios(id);

-- Add a comment to clarify the usage
COMMENT ON COLUMN public.pedidos.paquete_id IS 'References a bundle/package from paquetes table (LLC Esencial, Launch + Banking, Primer AÃ±o Pro)';
COMMENT ON COLUMN public.pedidos.servicio_id IS 'References an individual service from servicios table';
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
-- Clean up existing pedidos and fix foreign keys
-- Step 1: Delete all existing pedidos (they have invalid references)
DELETE FROM public.pedidos;

-- Step 2: Drop existing constraints if they exist
ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_paquete_id_fkey;
ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_servicio_id_fkey;
ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_estado_usa_id_fkey;

-- Step 3: Add proper foreign key constraints
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

-- Step 4: Verify the constraints
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

-- Ãndices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_notificaciones_user_id ON notificaciones(user_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leido ON notificaciones(leido);
CREATE INDEX IF NOT EXISTS idx_notificaciones_created_at ON notificaciones(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

-- PolÃ­tica: Los usuarios solo pueden ver sus propias notificaciones
CREATE POLICY "Users can view own notifications"
  ON notificaciones
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- PolÃ­tica: Los usuarios pueden marcar como leÃ­das sus notificaciones
CREATE POLICY "Users can update own notifications"
  ON notificaciones
  FOR UPDATE
  USING (auth.uid()::text = user_id);

-- PolÃ­tica: El sistema puede crear notificaciones (usando service_role)
CREATE POLICY "Service role can insert notifications"
  ON notificaciones
  FOR INSERT
  WITH CHECK (true);

-- Comentarios para documentaciÃ³n
COMMENT ON TABLE notificaciones IS 'Notificaciones del sistema para mostrar en el dashboard del usuario';
COMMENT ON COLUMN notificaciones.tipo IS 'Tipo de notificaciÃ³n: pago_exitoso, pedido_completado, documento_listo, etc.';
COMMENT ON COLUMN notificaciones.leido IS 'Indica si el usuario ya vio la notificaciÃ³n';
COMMENT ON COLUMN notificaciones.url IS 'URL opcional para redirigir cuando el usuario hace clic en la notificaciÃ³n';
-- Migration: Replace Texas with New Mexico
-- Date: 2026-01-25
-- Description: Remove Texas and add New Mexico to the estados_usa table

-- 1. Desactivar Texas
UPDATE public.estados_usa 
SET activo = false 
WHERE codigo = 'TX';

-- 2. Insertar Nuevo MÃ©xico
INSERT INTO public.estados_usa (id, codigo, nombre, filing_anual, filing_inicial, descripcion, ventajas, popular, recomendado, activo)
VALUES
  ('a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7', 'NM', 'New Mexico', 50.00, 50.00, 
   'Estado con costos de mantenimiento muy bajos y proceso de formaciÃ³n simple', 
   '["Costos de filing muy bajos (50 USD anual)", "Proceso de formaciÃ³n simple", "Buena privacidad para los propietarios", "Sin impuesto estatal sobre ingresos de LLC"]'::jsonb, 
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
-- Migration: Add codigo_pais field to pedidos table
-- Date: 2026-01-25
-- Description: Add country code field for phone numbers

ALTER TABLE public.pedidos 
ADD COLUMN IF NOT EXISTS codigo_pais VARCHAR(10) DEFAULT '+34';

COMMENT ON COLUMN public.pedidos.codigo_pais IS 'CÃ³digo de paÃ­s para el telÃ©fono de la empresa (ej: +34, +1, +52)';
-- Crear tabla de tareas administrativas
CREATE TABLE IF NOT EXISTS tareas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL, -- 'tramite_ein', 'formacion_llc', 'revision_documentos', etc.
  descripcion TEXT,
  estado TEXT DEFAULT 'pendiente', -- 'pendiente', 'en_proceso', 'esperando_cliente', 'completado'
  prioridad TEXT DEFAULT 'normal', -- 'baja', 'normal', 'alta', 'urgente'
  asignado_a TEXT, -- ID del admin asignado (opcional por ahora)
  metadata JSONB DEFAULT '{}'::jsonb, -- Para guardar datos extra especÃ­ficos del trÃ¡mite
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ãndices
CREATE INDEX IF NOT EXISTS idx_tareas_pedido_id ON tareas(pedido_id);
CREATE INDEX IF NOT EXISTS idx_tareas_estado ON tareas(estado);
CREATE INDEX IF NOT EXISTS idx_tareas_created_at ON tareas(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;

-- PolÃ­ticas:
-- 1. Los admins pueden ver y editar todas las tareas
-- (Por ahora, asumiremos que usaremos service_role para gestionar esto desde el backend, 
-- pero definimos una polÃ­tica bÃ¡sica para futuros usuarios admin)

CREATE POLICY "Service role has full access"
  ON tareas
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comentarios
COMMENT ON TABLE tareas IS 'Tareas internas para el equipo de administraciÃ³n';
COMMENT ON COLUMN tareas.tipo IS 'Tipo de trÃ¡mite o tarea a realizar';
COMMENT ON COLUMN tareas.estado IS 'Estado actual del flujo de trabajo';
-- =============================================================
-- EJECUTAR EN SUPABASE SQL EDITOR si la tabla 'notificaciones'
-- no existe todavÃ­a (es la causa del error 503 en el polling).
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

-- 2. Ãndices para mejorar rendimiento
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

-- 5. VerificaciÃ³n final
SELECT 'Tabla notificaciones OK' AS status, COUNT(*) AS filas FROM notificaciones;
