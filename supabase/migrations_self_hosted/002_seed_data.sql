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
  ('2f1a8223-c047-4d45-8b97-f5e2e7423536', 'llc-esencial', 'LLC Esencial', 'Esencial', 597.00, NULL, NULL, 'Para validar tu negocio sin complicarte', '["Constitución de tu LLC en el estado correcto", "Obtención de tu EIN aunque no tengas SSN o ITIN", "Operating agreement y documentos esenciales listos para bancos y clientes", "1 año de agente registrado y dirección básica oficial", "Guía clara sobre impuestos básicos, BOIR y relación con Hacienda España"]', false, 1, NULL, NULL, true),
  ('fa610998-6f5f-4ee6-a2ee-ed0e78086c7c', 'launch-banking', 'Launch + Banking', 'Launch', 897.00, NULL, NULL, 'Para lanzar y cobrar con tu LLC desde el primer mes', '["Todo lo incluido en LLC Esencial", "Acompañamiento para apertura de cuenta en banca online o fintech alineadas con no residentes", "Revisión de tu primera factura y estructura de cobros a clientes internacionales", "Sesión 1:1 de 45-60 minutos para definir estado, banco y enfoque fiscal inicial", "Checklist de lanzamiento de LLC creada a LLC facturando sin pasos ocultos"]', true, 2, NULL, NULL, true),
  ('fee3bc8a-4861-4bbe-bca4-ae2df87b26f7', 'primer-ano-pro', 'Primer Año Pro', 'Pro', 1397.00, NULL, NULL, 'Primer año casi todo resuelto', '["Todo lo incluido en Launch + Banking", "Preparación y presentación del BOIR dentro de plazo", "Gestión del reporte o impuesto anual estatal (nuestros honorarios incluidos, tasas aparte)", "Soporte prioritario por email/WhatsApp para dudas operativas y fiscales del día a día", "Revisión básica de tu contabilidad hasta un volumen máximo de movimientos"]', false, 3, NULL, NULL, true)
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
  ('82c55079-3b09-4c4c-986b-d16e7e9d2257', 'formacion-llc', 'Formación de LLC', 'Constitución completa de tu LLC en el estado que elijas', 497.00, NULL, NULL, 'constitucion', NULL, NULL, false, true, 'individual', NULL),
  ('a89f7a00-092f-45c1-a908-b9ba465a27f5', 'form-5472', 'Form 5472 + 1120', 'Declaración anual federal para LLC con propietarios extranjeros', 397.00, NULL, NULL, 'fiscal', NULL, NULL, false, true, 'individual', NULL),
  ('7d3f579b-163e-4a3b-ae0b-62d0c7e6b1db', 'consultoria-fiscal', 'Consultoría Fiscal', 'Sesión de consultoría personalizada 1 hora', 197.00, NULL, NULL, 'fiscal', NULL, NULL, false, true, 'individual', NULL),
  ('fdbf0572-5c56-447b-93db-aace1faccfb1', 'obtencion-ein', 'Obtención de EIN', 'Tramitamos tu EIN con el IRS. Ideal si ya tienes la LLC pero te falta el número fiscal.', 197.00, NULL, NULL, 'tramites', NULL, NULL, true, true, 'individual', NULL),
  ('0489df83-75f2-4a58-add6-8cf78879faed', 'agente-registrado', 'Agente Registrado', 'Servicio de agente registrado anual', 149.00, 149.00, 'anual', 'cumplimiento', NULL, NULL, false, true, 'individual', NULL),
  
  -- Packages mirrored in servicios table
  ('8df54884-63d8-4903-911e-b830d4374352', 'launch-banking', 'Launch + Banking', 'Para lanzar y cobrar con tu LLC desde el primer mes. Incluye Formación LLC + Soporte Bancario.', 897.00, NULL, NULL, 'paquetes', NULL, NULL, false, true, 'paquete', '["intro", "estado", "datos-empresa", "revision", "checkout", "completado"]'),
  ('06257795-e9ec-4f21-b8dc-a743056becaf', 'llc-esencial', 'LLC Esencial', 'Para validar tu negocio sin complicarte. Creación LLC, EIN y documentación básica.', 597.00, NULL, NULL, 'paquetes', NULL, NULL, false, true, 'paquete', '["intro", "estado", "datos-empresa", "revision", "checkout", "completado"]'),
  ('78d8b169-93d0-4ca7-bbc5-022316ce8f6c', 'primer-ano-pro', 'Primer Año Pro', 'Primer año casi todo resuelto. Todo lo de Launch + Banking más gestión fiscal y BOIR.', 1397.00, NULL, NULL, 'paquetes', NULL, NULL, false, true, 'paquete', '["intro", "estado", "datos-empresa", "revision", "checkout", "completado"]')

ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio,
  precio_recurrente = EXCLUDED.precio_recurrente,
  tipo = EXCLUDED.tipo,
  flujo_onboarding = EXCLUDED.flujo_onboarding;
