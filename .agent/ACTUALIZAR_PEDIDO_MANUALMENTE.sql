-- Script SQL para actualizar manualmente un pedido a "pagado"
-- Ejecuta esto en Supabase SQL Editor

-- 1. Primero, encuentra el ID del pedido que necesitas actualizar
SELECT id, numero_pedido, estado_pedido, total_pagado, created_at
FROM pedidos
WHERE user_id = 'TU_USER_ID_AQUI' -- Reemplaza con tu Clerk User ID
ORDER BY created_at DESC
LIMIT 5;

-- 2. Una vez que tengas el ID del pedido, actualízalo:
UPDATE pedidos
SET 
  estado_pedido = 'pagado',
  total_pagado = 249,
  fecha_pago = NOW(),
  paso_actual = 6,
  completado_at = NOW()
WHERE id = 'PEDIDO_ID_AQUI'; -- Reemplaza con el ID del pedido

-- 3. Verificar que se actualizó correctamente:
SELECT id, numero_pedido, estado_pedido, total_pagado, fecha_pago
FROM pedidos
WHERE id = 'PEDIDO_ID_AQUI';
