-- ======================================================================
-- SCRIPT PARA POBLAR tax_data EN PEDIDOS EXISTENTES
-- ======================================================================
-- INSTRUCCIONES:
-- 1. Abre el Editor SQL de Supabase  
-- 2. Ejecuta primero la CONSULTA 1 para ver tus pedidos fiscales
-- 3. Copia el ID del pedido que quieras poblar
-- 4. Sustituye 'TU_PEDIDO_ID_AQUI' en la CONSULTA 2
-- 5. Ejecuta la CONSULTA 2
-- ======================================================================

-- CONSULTA 1: Ver TODOS los pedidos fiscales y su estado de tax_data
SELECT 
    id,
    numero_pedido,
    metadata->>'tipo_servicio' as tipo_servicio,
    CASE WHEN tax_data IS NULL THEN '❌ VACÍO' ELSE '✅ OK' END as estado_tax_data,
    estado_pedido,
    created_at
FROM pedidos
WHERE metadata->>'tipo_servicio' = 'tax_filing_5472'
ORDER BY created_at DESC;

-- CONSULTA 2: Poblar tax_data con datos de prueba (DESCOMENTA y reemplaza ID)
-- NOTA: Usa el formato PLANO (llcName, llcEin, etc.) que es el que envía el formulario
/*
UPDATE pedidos
SET tax_data = '{
    "taxYear": "2024",
    "llcName": "Test International LLC",
    "llcEin": "98-7654321",
    "llcAddress": "1234 Business Ave",
    "llcCity": "Cheyenne",
    "llcState": "Wyoming",
    "llcZip": "82001",
    "formationDate": "2024-01-15",
    "ownerName": "Juan Pérez García",
    "ownerAddress": "Calle Principal 123, Piso 4",
    "ownerCity": "Madrid",
    "ownerCountry": "Spain",
    "ownerTaxId": "12345678X",
    "ownerReferenceIdType": "Foreign Tax ID",
    "capitalContributionCash": 5000,
    "capitalContributionProperty": 0,
    "capitalDistributionCash": 0,
    "capitalDistributionProperty": 0,
    "formationCost": 500,
    "hasTradeOrBusiness": false,
    "isDisregardedEntity": true
}'::jsonb
WHERE id = 'TU_PEDIDO_ID_AQUI';
*/

-- CONSULTA 3: Verificar que se guardó correctamente (DESCOMENTA y reemplaza ID)
/*
SELECT 
    id,
    numero_pedido,
    tax_data->>'llcName' as llc_name,
    tax_data->>'llcEin' as ein,
    tax_data->>'taxYear' as tax_year,
    tax_data->>'ownerName' as owner_name,
    tax_data->>'llcState' as state
FROM pedidos
WHERE id = 'TU_PEDIDO_ID_AQUI';
*/
