-- Script para diagnosticar y poblar tax_data en pedidos fiscales
-- Ejecutar en el Editor SQL de Supabase

-- 1. Ver todos los pedidos con metadata de tipo tax_filing
SELECT 
    id,
    numero_pedido,
    metadata->>'tipo_servicio' as tipo_servicio,
    tax_data,
    created_at,
    estado_pedido
FROM pedidos
WHERE metadata->>'tipo_servicio' = 'tax_filing_5472'
ORDER BY created_at DESC;

-- 2. Contar cuántos tienen tax_data vacío
SELECT 
    COUNT(*) as total_pedidos_fiscales,
    COUNT(tax_data) as con_tax_data,
    COUNT(*) - COUNT(tax_data) as sin_tax_data
FROM pedidos
WHERE metadata->>'tipo_servicio' = 'tax_filing_5472';

-- 3. SOLO PARA TESTING: Poblar tax_data de ejemplo en un pedido específico
-- IMPORTANTE: Reemplaza 'TU_PEDIDO_ID' con el ID real del pedido que quieres probar
/*
UPDATE pedidos
SET tax_data = '{
    "taxYear": "2024",
    "companyName": "Test LLC",
    "ein": "12-3456789",
    "state": "Wyoming",
    "address": "123 Main St, Cheyenne, WY 82001",
    "ownerName": "John Doe",
    "ownerAddress": "456 Oak Ave, Miami, FL 33101",
    "ownerCountry": "United States",
    "transactions": []
}'::jsonb
WHERE id = 'TU_PEDIDO_ID';
*/

-- 4. Verificar que se actualizó correctamente
-- SELECT id, tax_data FROM pedidos WHERE id = 'TU_PEDIDO_ID';
