# 🤖 Automatización de Procesos y Notificaciones Internas

Este documento describe el sistema implementado para automatizar la gestión de pedidos, notificando al equipo administrativo y generando tareas de seguimiento automáticamente cuando se confirma un pago.

## 🔄 Flujo de Automatización

Cuando un cliente completa un pago en Stripe, sucede lo siguiente:

1.  **Webhook de Stripe (`/api/stripe/webhook`)**:
    *   Recibe el evento `checkout.session.completed`.
    *   Verifica la firma de seguridad.
    *   Marca el pedido como `pagado` en la base de datos `pedidos`.

2.  **Generación de Tareas (`TaskService`)**:
    *   Analiza el tipo de servicio comprado (ej: `obtencion-ein`, `formacion-llc`).
    *   Genera registros en la tabla `tareas` necesarios para completar el servicio.
    *   Ejemplo para LLC:
        1.  Verificar disponibilidad de nombre.
        2.  Redactar Articles of Organization.
        3.  Tramitar EIN.

3.  **Notificación al Equipo (`EmailService`)**:
    *   Envía un correo electrónico a la dirección administrativa (`ADMIN_EMAIL`).
    *   Asunto: "🤑 Nueva Venta: [Servicio] ($[Monto])".
    *   Contenido: Detalles del pedido y cliente.

## 🛠️ Componentes del Sistema

### 1. Base de Datos: Tabla `tareas`

Tabla destinada al uso interno del equipo para gestionar el trabajo pendiente.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `pedido_id` | UUID | Relación con la tabla `pedidos` |
| `tipo` | TEXT | Ej: `tramite_ein`, `formacion_llc` |
| `estado` | TEXT | `pendiente`, `en_proceso`, `completado` |
| `prioridad` | TEXT | `baja`, `normal`, `alta`, `urgente` |
| `descripcion` | TEXT | Detalles de lo que hay que hacer |

### 2. Servicio: `TaskService` (`lib/services/task.service.ts`)

Encargado de la lógica de negocio.

*   **`generarTareasPorPedido(pedido)`**: Método principal llamado por el webhook. Contiene las reglas de qué tareas crear para cada producto.
*   **`crear(params)`**: Método helper para insertar en la BD.

### 3. Servicio: `EmailService` (`lib/services/email.service.ts`)

*   **`notificarEquipo(params)`**: Envía alertas al admin usando Resend.
*   Usa la variable de entorno `ADMIN_EMAIL` (por defecto `soporte@openllcusa.com`).

## ⚙️ Configuración

Para recibir las notificaciones en tu correo personal, agrega/edita esta variable en `.env.local`:

```env
ADMIN_EMAIL=tu_email@gmail.com
```

## 🧪 Pruebas

Se ha habilitado una ruta de API para probar este flujo sin tener que gastar dinero real en Stripe.

**Ruta:** `/api/test-automation`

**Parámetros:**
*   `admin_email`: (Opcional) Sobrescribir temporalmente dónde enviar la alerta.

**Uso:**
Acceder a: `http://localhost:3000/api/test-automation`

Esto buscará el último pedido existente en la base de datos y simulará que acaba de ser pagado, disparando la creación de tareas y el email de alerta.
