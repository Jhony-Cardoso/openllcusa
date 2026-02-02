# Guía de Configuración de Webhooks de Stripe

Los webhooks permiten que Stripe notifique automáticamente a tu aplicación cuando ocurren eventos importantes (pagos completados, reembolsos, etc.).

---

## 📋 **Eventos que Manejamos**

Nuestro webhook (`/api/stripe/webhook`) maneja los siguientes eventos:

### **Pagos Únicos (Paquetes)**
- ✅ `checkout.session.completed` (mode=payment) - Cuando se completa un pago único

### **Suscripciones (Servicios Recurrentes)**
- ✅ `checkout.session.completed` (mode=subscription) - Cuando se crea una suscripción
- ✅ `customer.subscription.updated` - Cuando se actualiza una suscripción
- ✅ `customer.subscription.deleted` - Cuando se cancela una suscripción

---

## 🔧 **Configuración para Desarrollo Local**

### **Opción 1: Usar Stripe CLI (Recomendado)**

La Stripe CLI permite recibir webhooks en tu máquina local.

#### **1. Instalar Stripe CLI**

**Windows:**
```powershell
# Descargar desde: https://github.com/stripe/stripe-cli/releases/latest
# O usar Scoop:
scoop install stripe
```

**Mac:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
# Descargar el binario desde GitHub releases
```

#### **2. Autenticar Stripe CLI**

```bash
stripe login
```

Esto abrirá tu navegador para autorizar la CLI.

#### **3. Escuchar Webhooks Localmente**

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Esto te dará un **webhook signing secret** que empieza con `whsec_...`

#### **4. Actualizar .env.local**

Copia el webhook secret y agrégalo a tu `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_TU_SECRET_AQUI
```

#### **5. Reiniciar el Servidor**

```bash
# Detener con Ctrl+C
npm run dev
```

#### **6. Probar el Webhook**

En otra terminal, puedes enviar eventos de prueba:

```bash
# Simular un checkout completado
stripe trigger checkout.session.completed

# Simular un pago exitoso
stripe trigger payment_intent.succeeded

# Simular un reembolso
stripe trigger charge.refunded
```

---

## 🌐 **Configuración para Producción**

Cuando despliegues a producción, necesitas configurar webhooks reales en Stripe.

### **1. Obtener la URL Pública**

Tu webhook endpoint será:
```
https://TU_DOMINIO.com/api/stripe/webhook
```

### **2. Crear el Webhook en Stripe Dashboard**

1. Ve a [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Haz clic en **"Add endpoint"**
3. Configura:
   - **Endpoint URL**: `https://TU_DOMINIO.com/api/stripe/webhook`
   - **Events to send**: Selecciona:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `payment_intent.succeeded` (opcional)
     - `charge.refunded` (opcional)
   - O selecciona **"Select all events"** para recibir todos

4. Haz clic en **"Add endpoint"**

### **3. Obtener el Webhook Secret**

1. En la página del webhook que acabas de crear
2. Haz clic en **"Reveal"** en la sección "Signing secret"
3. Copia el secret (empieza con `whsec_...`)

### **4. Actualizar Variables de Entorno en Producción**

Agrega el webhook secret a las variables de entorno de tu servidor de producción:

```env
STRIPE_WEBHOOK_SECRET=whsec_TU_SECRET_DE_PRODUCCION
```

---

## 🧪 **Probar los Webhooks**

### **Método 1: Stripe CLI (Local)**

```bash
# Escuchar webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook

# En otra terminal, hacer un pago de prueba
# Ve a http://localhost:3000/precios y completa un pago
```

### **Método 2: Trigger Manual**

```bash
# Simular eventos específicos
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.updated
```

### **Método 3: Dashboard de Stripe**

1. Ve a [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Haz clic en tu webhook
3. Ve a la pestaña **"Send test webhook"**
4. Selecciona un evento y haz clic en **"Send test webhook"**

---

## 📊 **Monitorear Webhooks**

### **Ver Logs en Stripe Dashboard**

1. Ve a [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Haz clic en tu webhook
3. Ve a la pestaña **"Logs"**
4. Aquí verás:
   - ✅ Webhooks exitosos (200)
   - ❌ Webhooks fallidos (4xx, 5xx)
   - 🔄 Reintentos automáticos

### **Ver Logs en tu Aplicación**

Los logs aparecerán en la consola de tu servidor:

```
✅ [WEBHOOK] Evento recibido: checkout.session.completed
💳 [WEBHOOK] Procesando pago único para pedido: abc-123
✅ [WEBHOOK] Pedido marcado como pagado: abc-123
```

---

## 🔐 **Seguridad**

### **Verificación de Firma**

Nuestro webhook **siempre verifica** la firma de Stripe antes de procesar eventos:

```typescript
const event = stripe.webhooks.constructEvent(
  rawBody,
  signature,
  webhookSecret
);
```

Esto garantiza que:
- ✅ El evento proviene realmente de Stripe
- ✅ El evento no ha sido modificado
- ✅ El evento no es una repetición maliciosa

### **Mejores Prácticas**

1. ✅ **Nunca compartas** tu `STRIPE_WEBHOOK_SECRET`
2. ✅ **Usa HTTPS** en producción
3. ✅ **Verifica** que los eventos pertenecen a tus usuarios
4. ✅ **Maneja** eventos duplicados (Stripe puede reenviar)
5. ✅ **Responde rápido** (< 5 segundos) para evitar reintentos

---

## 🚨 **Solución de Problemas**

### **Error: "Webhook signature verification failed"**

**Causas:**
- El `STRIPE_WEBHOOK_SECRET` es incorrecto
- Estás usando el secret de test en producción (o viceversa)
- El body del request fue modificado antes de llegar al webhook

**Solución:**
1. Verifica que el secret en `.env.local` coincida con el de Stripe
2. Asegúrate de estar en el modo correcto (test/live)
3. No modifiques el body del request antes de verificar la firma

### **Error: "Missing stripe-signature header"**

**Causa:**
- La petición no viene de Stripe
- Hay un proxy/middleware que elimina headers

**Solución:**
- Verifica que la URL del webhook sea correcta
- Revisa la configuración de tu proxy/CDN

### **Los webhooks no llegan**

**Causas:**
- La URL del webhook es incorrecta
- Tu servidor no es accesible públicamente
- Firewall bloqueando peticiones de Stripe

**Solución:**
1. Verifica la URL en Stripe Dashboard
2. Para desarrollo local, usa Stripe CLI
3. Verifica que el puerto 3000 esté abierto

---

## 📝 **Próximos Pasos**

Una vez que los webhooks funcionen:

1. ✅ **Agregar emails** de confirmación cuando se complete un pago
2. ✅ **Crear notificaciones** en el dashboard del usuario
3. ✅ **Iniciar procesos** automáticos (crear LLC, enviar documentos)
4. ✅ **Registrar eventos** para auditoría

---

## 🔗 **Recursos Útiles**

- **Stripe Webhooks Docs**: https://stripe.com/docs/webhooks
- **Stripe CLI**: https://stripe.com/docs/stripe-cli
- **Testing Webhooks**: https://stripe.com/docs/webhooks/test
- **Webhook Events**: https://stripe.com/docs/api/events/types

---

¡Listo! Ahora tu aplicación puede recibir y procesar eventos de Stripe automáticamente. 🎉
