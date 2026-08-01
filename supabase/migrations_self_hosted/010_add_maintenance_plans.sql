-- 1. Insertar el bucket para documentos de clientes (Plan Crecimiento)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documentos_clientes', 
  'documentos_clientes', 
  false,
  10485760, -- 10MB limit
  '{"image/jpeg","image/png","application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insertar los planes en la tabla paquetes (Legacy)
INSERT INTO public.paquetes (id, slug, nombre, nombre_corto, precio, precio_mensual, descripcion, descripcion_corta, caracteristicas, destacado, orden, activo)
VALUES
  (
    'a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6', 
    'compliance-basico', 
    'Plan Compliance Básico', 
    'Compliance', 
    NULL, 
    49.00, 
    'Mantén tu LLC al día sin complicaciones.', 
    'Lo mínimo para estar tranquilo', 
    '["Agente registrado y dirección oficial activos", "Recordatorios de annual report y obligaciones estatales", "Checklist BOIR y formularios informativos clave", "Soporte por email para dudas recurrentes", "Sin permanencia — pausa o cambia cuando quieras"]', 
    false, 
    4, 
    true
  ),
  (
    'b2c3d4e5-f6a7-48b9-c0d1-e2f3a4b5c6d7', 
    'plan-crecimiento', 
    'Plan Crecimiento', 
    'Crecimiento', 
    NULL, 
    129.00, 
    'Para negocios en marcha que necesitan contabilidad y fiscalidad.', 
    'Compliance + contabilidad ligera', 
    '["Todo del Plan Compliance Básico", "Conciliación mensual básica de movimientos", "Informe trimestral de ingresos, gastos y márgenes", "Sesión estratégica anual de revisión fiscal", "Documentación lista para tu asesor en España"]', 
    true, 
    5, 
    true
  )
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  nombre = EXCLUDED.nombre,
  precio_mensual = EXCLUDED.precio_mensual,
  caracteristicas = EXCLUDED.caracteristicas;

-- 3. Insertar los planes en la tabla servicios (Nueva tabla)
INSERT INTO public.servicios (id, slug, nombre, descripcion, precio, precio_recurrente, frecuencia_recurrente, categoria, requiere_llc, activo, tipo, flujo_onboarding)
VALUES
  (
    '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d', 
    'compliance-basico', 
    'Plan Compliance Básico', 
    'Mantén tu LLC al día con lo mínimo necesario para estar tranquilo.', 
    0, 
    49.00, 
    'mensual', 
    'paquetes', 
    true, 
    true, 
    'paquete', 
    '["intro", "datos-llc", "propietario", "revision", "checkout", "completado"]'
  ),
  (
    '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e', 
    'plan-crecimiento', 
    'Plan Crecimiento', 
    'Compliance y contabilidad ligera para negocios facturando.', 
    0, 
    129.00, 
    'mensual', 
    'paquetes', 
    true, 
    true, 
    'paquete', 
    '["intro", "datos-llc", "propietario", "documentos", "revision", "checkout", "completado"]'
  )
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  nombre = EXCLUDED.nombre,
  precio_recurrente = EXCLUDED.precio_recurrente,
  flujo_onboarding = EXCLUDED.flujo_onboarding;
