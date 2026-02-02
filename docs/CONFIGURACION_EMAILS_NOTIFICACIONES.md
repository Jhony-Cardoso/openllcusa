# 📧 Configuración de Emails y Notificaciones

## 🎯 Funcionalidades Implementadas

### 1. ✅ Emails de Confirmación
- Email automático cuando se completa un pago
- Template profesional con detalles del pedido
- Botón para ver el pedido en el dashboard

### 2. ✅ Sistema de Notificaciones
- Notificaciones en tiempo real en el dashboard
- Widget con contador de notificaciones no leídas
- Página completa de notificaciones
- Marcar como leídas individual o todas

### 3. 🔄 Próximos Pasos (Pendientes)
- Iniciar procesos automáticos según el servicio
- Analytics para trackear conversiones

## 📝 Configuración Requerida

### Paso 1: Crear Cuenta en Resend

1. Ve a [resend.com](https://resend.com)
2. Crea una cuenta gratuita
3. Verifica tu email

### Paso 2: Obtener API Key

1. En el dashboard de Resend, ve a **API Keys**
2. Crea una nueva API key
3. Copia la key (empieza con `re_...`)

### Paso 3: Configurar Dominio (Opcional pero Recomendado)

Para enviar emails desde tu propio dominio:

1. En Resend, ve a **Domains**
2. Agrega tu dominio (ej: `openllcusa.com`)
3. Configura los registros DNS que te proporcionen:
   - SPF
   - DKIM
   - DMARC
4. Espera a que se verifique (puede tardar unos minutos)

**Mientras tanto**, puedes usar el dominio de prueba de Resend:
- Los emails se enviarán desde `onboarding@resend.dev`
- Solo funcionará en modo desarrollo

### Paso 4: Agregar Variables de Entorno

Agrega a tu `.env.local`:

```env
# Resend (para emails)
RESEND_API_KEY=re_tu_api_key_aqui
```

### Paso 5: Aplicar Migración de Base de Datos

Ejecuta la migración para crear la tabla de notificaciones:

```bash
# Conectarte a tu Supabase y ejecutar:
psql -h 89.117.53.55 -p 5432 -U postgres -d postgres -f supabase/migrations_self_hosted/005_notificaciones.sql
```

O desde el dashboard de Supabase:
1. Ve a **SQL Editor**
2. Copia el contenido de `005_notificaciones.sql`
3. Ejecuta

### Paso 6: Actualizar el Email en el Servicio

Edita `lib/services/email.service.ts` y cambia:

```typescript
from: 'Open LLC USA <noreply@openllcusa.com>'
```

Por tu dominio verificado o usa el de prueba:

```typescript
from: 'Open LLC USA <onboarding@resend.dev>' // Para desarrollo
```

## 🧪 Probar el Sistema

### Probar Emails Localmente

1. Asegúrate de que `RESEND_API_KEY` está configurada
2. Reinicia el servidor: `npm run dev`
3. Haz una compra de prueba en Stripe
4. Verifica que llegue el email de confirmación

### Probar Notificaciones

1. Aplica la migración de la tabla `notificaciones`
2. Haz una compra de prueba
3. Ve al dashboard
4. Deberías ver el icono de campana con un contador
5. Haz clic para ver las notificaciones

## 📊 Estructura de Archivos Creados

```
lib/
├── services/
│   ├── email.service.ts          # Servicio de emails con Resend
│   └── notificacion.service.ts   # Servicio de notificaciones

app/
├── api/
│   ├── notificaciones/
│   │   └── route.ts               # API para obtener/marcar notificaciones
│   └── stripe/
│       └── webhook/
│           └── route.ts           # Actualizado con emails y notificaciones

├── dashboard/
│   └── notificaciones/
│       └── page.tsx               # Página completa de notificaciones

components/
└── NotificacionesWidget.tsx       # Widget de notificaciones para el header

supabase/
└── migrations_self_hosted/
    └── 005_notificaciones.sql     # Migración para tabla de notificaciones
```

## 🎨 Integrar Widget en el Header

Para mostrar el widget de notificaciones en el header del dashboard, agrega:

```tsx
// En tu componente de Header/Navbar del dashboard
import NotificacionesWidget from '@/components/NotificacionesWidget'

export default function DashboardHeader() {
  return (
    <header>
      {/* ... otros elementos ... */}
      <NotificacionesWidget />
      {/* ... otros elementos ... */}
    </header>
  )
}
```

## 📧 Tipos de Emails Disponibles

### 1. Email de Confirmación de Pago
Se envía automáticamente cuando:
- Un usuario completa un pago en Stripe
- El webhook `checkout.session.completed` se dispara

Incluye:
- Detalles del servicio comprado
- Monto pagado
- Fecha y hora
- ID del pedido
- Botón para ver el pedido

### 2. Email de Bienvenida
Para enviar manualmente cuando un usuario se registra:

```typescript
import { EmailService } from '@/lib/services/email.service'

await EmailService.enviarBienvenida({
  to: 'usuario@email.com',
  nombreUsuario: 'Juan Pérez'
})
```

## 🔔 Tipos de Notificaciones Disponibles

### 1. Pago Exitoso
```typescript
await NotificacionService.notificarPagoExitoso(
  userId,
  pedidoId,
  'Obtención de EIN',
  197.00
)
```

### 2. Pedido Completado
```typescript
await NotificacionService.notificarPedidoCompletado(
  userId,
  pedidoId,
  'Obtención de EIN'
)
```

### 3. Documento Listo
```typescript
await NotificacionService.notificarDocumentoListo(
  userId,
  pedidoId,
  'Certificado de EIN'
)
```

### 4. Bienvenida
```typescript
await NotificacionService.notificarBienvenida(
  userId,
  'Juan Pérez'
)
```

## 🚀 Próximas Mejoras Sugeridas

### 1. Procesos Automáticos
Agregar lógica en el webhook para iniciar workflows según el servicio:

```typescript
// En webhook/route.ts después de crear la notificación
if (pedido.servicios?.slug === 'obtencion-ein') {
  // Crear tarea para el equipo
  await crearTareaEIN(pedido)
} else if (pedido.servicios?.slug === 'formacion-llc') {
  // Iniciar proceso de documentos
  await iniciarProcesoLLC(pedido)
}
```

### 2. Analytics
Trackear eventos importantes:

```typescript
// Integrar Google Analytics o similar
analytics.track('Pago Completado', {
  servicio: nombreServicio,
  monto: montoPagado,
  userId: userId
})
```

### 3. Más Tipos de Emails
- Email cuando el pedido está en proceso
- Email cuando se sube un documento
- Email de recordatorio si falta información
- Email de seguimiento post-compra

### 4. Notificaciones Push
- Usar servicios como OneSignal o Firebase
- Notificaciones en el navegador
- Notificaciones móviles (si hay app)

## 🐛 Solución de Problemas

### Los emails no se envían

1. **Verifica la API key**:
   ```bash
   echo $RESEND_API_KEY
   ```

2. **Verifica los logs del servidor**:
   Busca mensajes como:
   ```
   ✅ Email de confirmación enviado a: usuario@email.com
   ```

3. **Revisa la consola de Resend**:
   - Ve a [resend.com/emails](https://resend.com/emails)
   - Verifica el estado de los emails enviados

### Las notificaciones no aparecen

1. **Verifica que la tabla existe**:
   ```sql
   SELECT * FROM notificaciones LIMIT 1;
   ```

2. **Verifica RLS**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'notificaciones';
   ```

3. **Verifica los logs del webhook**:
   ```
   🔔 [WEBHOOK] Notificación creada para usuario: user_xxx
   ```

### El widget no carga

1. **Verifica que el usuario está autenticado**
2. **Abre la consola del navegador** y busca errores
3. **Verifica la API**:
   ```bash
   curl http://localhost:3000/api/notificaciones \
     -H "Cookie: __session=xxx"
   ```

## 📚 Recursos

- [Documentación de Resend](https://resend.com/docs)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)

---

**Estado:** ✅ Implementado  
**Pendiente:** Configurar Resend API Key y aplicar migración
