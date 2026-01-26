# Guía de Configuración de Stripe (Modo Test)

## 📋 Paso 1: Crear Cuenta de Stripe

1. Ve a [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Crea una cuenta gratuita con tu email
3. **NO necesitas** proporcionar información bancaria para el modo de prueba
4. Confirma tu email

---

## 🔑 Paso 2: Obtener las API Keys de Prueba

1. Una vez dentro del Dashboard de Stripe, asegúrate de estar en **modo de prueba**
   - En la esquina superior derecha, verás un toggle "Test mode" / "Live mode"
   - Debe estar en **"Test mode"** (aparece un banner naranja)

2. Ve a **Developers** → **API keys**
   - URL directa: https://dashboard.stripe.com/test/apikeys

3. Copia las siguientes claves:
   - **Publishable key**: Empieza con `pk_test_...`
   - **Secret key**: Haz clic en "Reveal test key" y copia la que empieza con `sk_test_...`

---

## 🔧 Paso 3: Configurar las Variables de Entorno

Abre el archivo `.env.local` y reemplaza las claves de Stripe:

```env
# Stripe (Modo Test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_TU_CLAVE_AQUI
STRIPE_SECRET_KEY=sk_test_TU_CLAVE_SECRETA_AQUI
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx  # Lo configuraremos después
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**⚠️ IMPORTANTE**: 
- La `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` es pública (se puede ver en el navegador)
- La `STRIPE_SECRET_KEY` es privada (NUNCA la compartas ni la subas a Git)
- El `STRIPE_WEBHOOK_SECRET` lo configuraremos más adelante

---

## 📦 Paso 4: Instalar Stripe SDK

Ejecuta en la terminal:

```bash
npm install stripe @stripe/stripe-js
```

---

## 🧪 Paso 5: Probar con Tarjetas de Prueba

Stripe proporciona tarjetas de prueba que puedes usar:

### Tarjetas que FUNCIONAN:
- **Visa**: `4242 4242 4242 4242`
- **Mastercard**: `5555 5555 5555 4444`
- **American Express**: `3782 822463 10005`

### Datos adicionales para cualquier tarjeta de prueba:
- **Fecha de expiración**: Cualquier fecha futura (ej: 12/34)
- **CVC**: Cualquier 3 dígitos (ej: 123)
- **Código postal**: Cualquier código (ej: 12345)

### Tarjetas que FALLAN (para probar errores):
- **Tarjeta declinada**: `4000 0000 0000 0002`
- **Fondos insuficientes**: `4000 0000 0000 9995`
- **Tarjeta expirada**: `4000 0000 0000 0069`

Documentación completa: https://stripe.com/docs/testing

---

## 🎨 Paso 6: Crear Productos y Precios en Stripe

Tienes dos opciones:

### Opción A: Crear manualmente en el Dashboard (Recomendado para empezar)

1. Ve a **Products** en el Dashboard de Stripe
   - URL: https://dashboard.stripe.com/test/products

2. Haz clic en **"+ Add product"**

3. Crea tus productos:

   **Producto 1: LLC Esencial**
   - Name: `LLC Esencial`
   - Description: `Paquete básico para crear tu LLC`
   - Pricing:
     - Price: `597.00 USD`
     - Billing: `One time`
   - Guarda y copia el **Price ID** (empieza con `price_...`)

   **Producto 2: Launch + Banking**
   - Name: `Launch + Banking`
   - Description: `Paquete completo con soporte bancario`
   - Pricing:
     - Price: `897.00 USD`
     - Billing: `One time`
   - Guarda y copia el **Price ID**

   **Producto 3: Primer Año Pro**
   - Name: `Primer Año Pro`
   - Description: `Paquete premium con todo incluido`
   - Pricing:
     - Price: `1397.00 USD`
     - Billing: `One time`
   - Guarda y copia el **Price ID**

### Opción B: Crear mediante script (Automático)

Ejecuta el script que crearemos en el siguiente paso.

---

## 🔄 Paso 7: Actualizar la Base de Datos con los Price IDs

Una vez que tengas los Price IDs de Stripe, actualiza la tabla `paquetes` en Supabase:

```sql
-- Actualizar los stripe_price_id en la tabla paquetes
UPDATE public.paquetes
SET stripe_price_id = 'price_TU_PRICE_ID_AQUI'
WHERE slug = 'llc-esencial';

UPDATE public.paquetes
SET stripe_price_id = 'price_TU_PRICE_ID_AQUI'
WHERE slug = 'launch-banking';

UPDATE public.paquetes
SET stripe_price_id = 'price_TU_PRICE_ID_AQUI'
WHERE slug = 'primer-ano-pro';
```

---

## ✅ Paso 8: Verificar la Configuración

1. **Reinicia el servidor** de Next.js:
   ```bash
   # Detén el servidor (Ctrl+C)
   npm run dev
   ```

2. **Prueba el flujo de pago**:
   - Ve a `http://localhost:3000/precios`
   - Selecciona un paquete
   - Completa el onboarding
   - En el checkout, usa la tarjeta de prueba: `4242 4242 4242 4242`

3. **Verifica en Stripe Dashboard**:
   - Ve a **Payments** en Stripe
   - Deberías ver el pago de prueba

---

## 🎯 Próximos Pasos

Una vez que todo funcione en modo test:

1. ✅ Desarrollar y probar completamente
2. ✅ Configurar webhooks para eventos de Stripe
3. ✅ Cuando estés listo para producción:
   - Completa la verificación de la cuenta de Stripe
   - Cambia a las claves de producción (`pk_live_...` y `sk_live_...`)
   - Actualiza los webhooks para producción

---

## 📚 Recursos Útiles

- **Dashboard de Stripe (Test)**: https://dashboard.stripe.com/test/dashboard
- **Documentación de Stripe**: https://stripe.com/docs
- **Tarjetas de prueba**: https://stripe.com/docs/testing
- **Checkout de Stripe**: https://stripe.com/docs/payments/checkout
- **Webhooks**: https://stripe.com/docs/webhooks

---

## 🆘 Solución de Problemas

### Error: "Invalid API Key"
- Verifica que estés usando las claves de **test** (empiezan con `pk_test_` y `sk_test_`)
- Asegúrate de que no haya espacios antes/después de las claves en `.env.local`

### Error: "No such price"
- Verifica que el Price ID esté correcto en la base de datos
- Asegúrate de estar en modo test en Stripe

### El pago no aparece en Stripe
- Verifica que estés viendo el dashboard en **modo test**
- Revisa la consola del navegador para errores

---

¡Listo! Ahora puedes desarrollar todo el sistema de pagos sin necesidad de una cuenta real. 🚀
