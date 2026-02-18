# Guía: Verificar y Configurar Webhook de Stripe

## 🔍 Paso 1: Verificar Webhook en Stripe Dashboard

1. Ve a: https://dashboard.stripe.com/test/webhooks
2. Busca un endpoint con tu URL de ngrok:
   ```
   https://myrl-squiffy-eusebia.ngrok-free.dev/api/stripe/webhook
   ```
3. Verifica que esté escuchando el evento: `checkout.session.completed`

## ⚠️ Problema Común: ngrok no está corriendo

Si ngrok no está corriendo, el webhook NO funcionará. Para verificar:

1. Abre una terminal
2. Ejecuta: `ngrok http 3000`
3. Copia la URL que aparece (ej: `https://xxxx.ngrok-free.dev`)
4. Actualiza `.env.local`:
   ```
   NEXT_PUBLIC_BASE_URL=https://xxxx.ngrok-free.dev
   ```
5. Actualiza el webhook en Stripe Dashboard con la nueva URL

## ✅ Solución Recomendada: Stripe CLI

En lugar de ngrok, usa Stripe CLI para desarrollo local:

### Instalación
```bash
winget install stripe
```

### Autenticación
```bash
stripe login
```

### Escuchar Webhooks
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Esto te dará un webhook secret temporal. Cópialo y actualiza `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXX
```

### Reiniciar Servidor
```bash
npm run dev
```

## 🧪 Probar Webhook

Después de configurar Stripe CLI, haz un pago de prueba y deberías ver en la terminal de Stripe CLI:
```
✔ Received event checkout.session.completed
→ POST http://localhost:3000/api/stripe/webhook [200]
```

Y en la terminal de tu servidor Next.js:
```
💳 [WEBHOOK] Procesando pago único para pedido: XXX
✅ [WEBHOOK] Pedido marcado como pagado. Filas: 1
```

## 📊 Verificar Estado del Pedido

Después del pago, verifica en Supabase que el pedido se actualizó:

```sql
SELECT id, numero_pedido, estado_pedido, total_pagado, fecha_pago
FROM pedidos
WHERE user_id = 'TU_USER_ID'
ORDER BY created_at DESC
LIMIT 1;
```

Debería mostrar:
- `estado_pedido`: `'pagado'`
- `total_pagado`: `249`
- `fecha_pago`: (timestamp reciente)
