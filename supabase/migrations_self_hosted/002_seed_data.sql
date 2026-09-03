-- Seed Data Migration Script
-- This script inserts the initial data for 'estados_usa', 'servicios', and 'paquetes'
-- extracted from the Cloud environment to ensure consistency.

-- 1. Seed 'estados_usa'
-- Datos verificados con fuentes oficiales (2025):
--   WY: sos.wyo.gov — $100 inicial, $60 Annual Report (mínimo para activos ≤$300k en WY)
--   DE: corp.delaware.gov — $90 inicial, $300 Franchise Tax anual (sube a $400 en 2026)
--   FL: sunbiz.org — $125 inicial, $138.75 Annual Report (≈$139)
--   NV: nvsos.gov — $425 inicial (Articles $75 + Initial List $150 + Business License $200), $350 anual (Annual List $150 + Business License $200)
--   TX: comptroller.texas.gov — $300 inicial, $0 Franchise Tax para ingresos < $2.47M (2025)
--   NM: sos.nm.gov — $50 inicial, $0 (NO requiere Annual Report para LLCs)
INSERT INTO public.estados_usa (id, codigo, nombre, filing_anual, filing_inicial, descripcion, ventajas, popular, recomendado, activo)
VALUES
  ('821dc3bc-f2e2-4659-aaab-a88d29360ac6', 'WY', 'Wyoming', 60.00, 100.00, 'Annual Report (License Tax) de $60 mínimo para LLCs con activos en Wyoming ≤ $300,000. Para activos superiores, $0.0002 por dólar.', '["Sin impuesto sobre la renta personal ni corporativo", "Máxima privacidad: no se publican nombres de propietarios", "Protección de activos líder en EE.UU.", "Annual Report de solo $60/año (el más bajo del país)"]', true, true, true),
  ('101b5bd9-9f06-41c4-9c66-864e050915f1', 'DE', 'Delaware', 300.00, 90.00, 'Annual Franchise Tax de $300 (2025). Sube a $400 a partir del año fiscal 2026 (House Bill 400). No requiere Annual Report, solo pago del impuesto.', '["Marco legal empresarial muy maduro y predecible", "Tribunal de Cancillería de Delaware (referente mundial)", "Atractivo para capital riesgo e inversores institucionales", "Sin impuesto estatal sobre ventas"]', false, false, true),
  ('4f9e2194-e6d2-43c9-aa66-0bca126ed892', 'FL', 'Florida', 139.00, 125.00, 'Annual Report de $138.75 (≈$139). Vence antes del 1 de mayo; multa de $400 si se presenta tarde.', '["Sin impuesto sobre la renta personal estatal", "Estado muy activo para negocios con clientes en EE.UU.", "Amplia red bancaria y fintech disponibles", "Clima favorable para startups y e-commerce"]', true, false, true),
  ('07b3f588-bacd-4140-8060-7a09049c9dd5', 'NV', 'Nevada', 350.00, 425.00, 'El filing inicial incluye Articles of Organization ($75) + Initial List ($150) + State Business License ($200). El reporte anual incluye Annual List ($150) + Business License renewal ($200).', '["Sin impuesto sobre la renta estatal", "Privacidad para propietarios (no se publica en registro público)", "Sin impuesto sobre plusvalías", "Favorable para protección de activos"]', false, false, true),
  ('34181ad0-9679-4929-ace9-74aa65e373ed', 'TX', 'Texas', 0.00, 300.00, 'El Franchise Tax de Texas es $0 para LLCs con ingresos bajo $2.47M (2025). Solo se presenta un Public Information Report (PIR) anual sin coste.', '["Sin impuesto sobre la renta personal estatal", "Franchise Tax $0 para la mayoría de startups", "Gran mercado y ecosistema empresarial", "Sin impuesto sobre plusvalías estatales"]', false, false, true),
  ('a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7', 'NM', 'New Mexico', 0.00, 50.00, 'New Mexico NO requiere Annual Report para LLCs. Es uno de los estados con menores costes de mantenimiento de EE.UU.', '["Sin Annual Report (0 USD/año)", "Filing inicial de solo $50", "Alta privacidad para propietarios", "Proceso de formación simple y rápido"]', false, false, true)
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

-- 2. Seed 'paquetes'
-- Planes actuales: Starter / Professional / Business
INSERT INTO public.paquetes (id, slug, nombre, nombre_corto, precio, precio_mensual, descripcion, descripcion_corta, caracteristicas, destacado, orden, stripe_price_id, stripe_price_id_mensual, activo)
VALUES
  ('2f1a8223-c047-4d45-8b97-f5e2e7423536', 'starter', 'Starter', 'Starter', 349.00, NULL, 'Para freelancers y emprendedores que quieren su primera LLC en EE.UU. de forma simple y económica.', 'Ideal para freelancers y primeros pasos', '["Registro de LLC en el estado óptimo", "EIN sin SSN ni ITIN", "Documentos esenciales para bancos y clientes", "Agente registrado gratis 1 año", "Asistencia completa en español"]', false, 1, NULL, NULL, true),
  ('fa610998-6f5f-4ee6-a2ee-ed0e78086c7c', 'professional', 'Professional', 'Prof', 499.00, NULL, 'El plan más elegido. Ideal para emprendedores serios que quieren cuenta bancaria y facturación internacional desde el primer día.', 'El más elegido por emprendedores', '["Todo del Starter", "Apertura de cuenta bancaria en EE.UU.", "Operating Agreement personalizado", "Sesión 1:1 para definir estrategia fiscal inicial", "Soporte prioritario 30 días"]', true, 2, NULL, NULL, true),
  ('fee3bc8a-4861-4bbe-bca4-ae2df87b26f7', 'business', 'Business', 'Business', 849.00, NULL, 'Para quienes necesitan el máximo soporte, cumplimiento fiscal avanzado y tranquilidad total.', 'Primer año casi todo resuelto', '["Todo del Professional", "Presentación Forms 5472 + 1120", "Dirección física real en EE.UU.", "BOIR incluido dentro de plazo", "Soporte VIP 90 días + revisión anual"]', false, 3, NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  nombre = EXCLUDED.nombre,
  nombre_corto = EXCLUDED.nombre_corto,
  precio = EXCLUDED.precio,
  descripcion = EXCLUDED.descripcion,
  descripcion_corta = EXCLUDED.descripcion_corta,
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
  
  -- Paquetes actuales (Starter / Professional / Business)
  ('8df54884-63d8-4903-911e-b830d4374352', 'professional', 'Professional', 'El más elegido. LLC + cuenta bancaria + soporte.', 499.00, NULL, NULL, 'paquetes', NULL, NULL, false, true, 'paquete', '["intro", "estado", "datos-empresa", "revision", "checkout", "completado"]'),
  ('06257795-e9ec-4f21-b8dc-a743056becaf', 'starter', 'Starter', 'Crea tu LLC en EE.UU. de forma simple y económica.', 349.00, NULL, NULL, 'paquetes', NULL, NULL, false, true, 'paquete', '["intro", "estado", "datos-empresa", "revision", "checkout", "completado"]'),
  ('78d8b169-93d0-4ca7-bbc5-022316ce8f6c', 'business', 'Business', 'Primer año casi todo resuelto. El máximo soporte fiscal y cumplimiento.', 849.00, NULL, NULL, 'paquetes', NULL, NULL, false, true, 'paquete', '["intro", "estado", "datos-empresa", "revision", "checkout", "completado"]')

ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio,
  precio_recurrente = EXCLUDED.precio_recurrente,
  tipo = EXCLUDED.tipo,
  flujo_onboarding = EXCLUDED.flujo_onboarding;
