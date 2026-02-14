# 🚀 Panel de Administración - Documentación Completa

**Fecha de Implementación:** 13 de febrero de 2026  
**Versión:** 1.0  
**Estado:** ✅ Completado

---

## 📋 Índice

1. [Visión General](#visión-general)
2. [Funcionalidades Implementadas](#funcionalidades-implementadas)
3. [Arquitectura Técnica](#arquitectura-técnica)
4. [Guía de Uso](#guía-de-uso)
5. [Endpoints API](#endpoints-api)
6. [Flujo de Trabajo](#flujo-de-trabajo)
7. [Seguridad](#seguridad)
8. [Próximas Mejoras](#próximas-mejoras)

---

## 🎯 Visión General

El **Panel de Administración** es una interfaz completa y profesional que te permite gestionar todos los pedidos de formación de LLC y solicitudes de EIN. Está diseñado para:

- **Centralizar la gestión:** Todos los pedidos en un solo lugar
- **Automatizar procesos:** Actualización de estados con notificaciones automáticas
- **Gestionar documentos:** Descarga de SS-4 y subida de Carta EIN
- **Monitorear progreso:** Estado de tramitación ante el IRS en tiempo real

### Filosofía de Diseño

- **Admin ve TODO:** Acceso completo a SS-4, documentos internos y datos del cliente
- **Cliente ve RESULTADOS:** Solo documentos finales (Carta EIN), no procesos internos
- **Seguridad primero:** Validación de permisos en cada endpoint
- **UX profesional:** Interfaz moderna con feedback visual en tiempo real

---

## ✨ Funcionalidades Implementadas

### 1. **Dashboard Principal** (`/admin`)

#### Estadísticas en Tiempo Real
- 💰 **Ingresos Totales:** Suma de todos los pedidos pagados
- 📦 **Ventas Realizadas:** Número de pedidos completados
- ⏳ **Onboarding Pendiente:** Pedidos que requieren atención
- 👥 **Total Usuarios:** Número total de clientes

#### Alertas y Acciones Pendientes
- Lista de pedidos que requieren atención inmediata
- Filtrado automático de pedidos con onboarding incompleto
- Acceso rápido a cada pedido para gestión

#### Actividad Reciente
- Tabla con los últimos 5 pedidos
- Estado visual (pagado/pendiente)
- Monto y fecha de cada pedido

### 2. **Detalle de Pedido** (`/admin/pedidos/[id]`)

#### Información del Cliente
- ✅ Datos del Member (Propietario)
  - Nombre completo
  - Fecha de nacimiento
  - Nacionalidad y residencia
  - ID Fiscal (tipo y valor)
  - Dirección personal completa

- ✅ Configuración de la LLC
  - Designador legal
  - Tipo de gestión
  - Propósito del negocio
  - Sitio web

- ✅ Documentos del Cliente
  - Copia de pasaporte/identificación
  - Visualización directa desde el panel

#### Gestión de Documentos (Componente AdminDocumentManager)

##### 📄 Descargar SS-4
- **Cuándo está disponible:** Cuando `paso_actual >= 7`
- **Qué hace:** Genera y descarga el formulario SS-4 firmado por el cliente
- **Formato:** PDF con todos los datos del checklist legal
- **Uso:** Para enviar al IRS vía fax o correo

##### 📤 Subir Carta EIN del IRS
- **Validaciones:**
  - Solo archivos PDF
  - Máximo 10MB
  - Solo administradores
- **Qué hace:**
  - Sube el archivo a Supabase Storage
  - Actualiza metadata del pedido
  - Marca el pedido como completado (`paso_actual = 9`)
  - El cliente recibe notificación automática
- **Resultado:** El cliente puede descargar su Carta EIN desde su dashboard

##### 📊 Actualizar Estado de Tramitación
- **Estados disponibles:**
  - ⏳ Pendiente de Envío
  - 📤 Enviado al IRS
  - 🔍 En Revisión por el IRS
  - ✅ Aprobado - EIN Asignado
  - ❌ Rechazado

- **Notas Administrativas:**
  - Campo de texto libre para registrar detalles
  - Ejemplo: "Enviado al IRS el 13/02/2026 vía fax. Número de confirmación: 123456"

- **Botones de Acción Rápida:**
  - **Marcar: Tramitando** → Actualiza a `paso_actual = 8`
  - **Marcar: Completado** → Actualiza a `paso_actual = 9`

---

## 🏗️ Arquitectura Técnica

### Componentes Creados

#### 1. **AdminDocumentManager** (`components/admin/AdminDocumentManager.tsx`)
- **Tipo:** Client Component (React)
- **Props:**
  - `pedidoId`: ID del pedido
  - `numeroPedido`: Número de pedido (ej: "ORD-2024-001")
  - `pasoActual`: Paso actual del proceso (1-9)
  - `metadata`: Objeto con todos los datos del pedido

- **Estados Internos:**
  - `uploading`: Indica si se está subiendo un archivo
  - `updating`: Indica si se está actualizando el estado
  - `message`: Mensaje de feedback (success/error)
  - `selectedFile`: Archivo seleccionado para subir
  - `estadoTramitacion`: Estado actual ante el IRS
  - `notasAdmin`: Notas administrativas

- **Funcionalidades:**
  - Selección y validación de archivos
  - Subida de Carta EIN con feedback visual
  - Actualización de estado con confirmación
  - Recarga automática después de acciones exitosas

### Endpoints API Creados

#### 1. **GET `/api/admin/pedidos/[id]/descargar-ss4`**
- **Autenticación:** Requerida (Clerk)
- **Autorización:** Solo administradores
- **Validaciones:**
  - Usuario autenticado
  - Email en lista de admins
  - Pedido existe
  - Cliente completó el formulario (`paso_actual >= 7`)
- **Respuesta:** PDF del formulario SS-4
- **Nombre del archivo:** `SS4_[numero_pedido]_[timestamp].pdf`

#### 2. **POST `/api/admin/pedidos/[id]/subir-carta-ein`**
- **Autenticación:** Requerida (Clerk)
- **Autorización:** Solo administradores
- **Body:** FormData con campo `carta_ein` (File)
- **Validaciones:**
  - Usuario autenticado
  - Email en lista de admins
  - Pedido existe
  - Archivo es PDF
  - Tamaño máximo 10MB
- **Proceso:**
  1. Convierte el archivo a Buffer
  2. Genera nombre único: `carta-ein-[numero_pedido]-[uuid].pdf`
  3. Sube a Supabase Storage: `pedidos/[id]/documentos/[filename]`
  4. Actualiza metadata del pedido con:
     - `carta_ein_path`: Ruta del archivo
     - `carta_ein_nombre`: Nombre original
     - `carta_ein_subida_fecha`: Timestamp
     - `carta_ein_subida_por`: Email del admin
  5. Actualiza `paso_actual = 9` (Completado)
- **Respuesta:** JSON con confirmación y datos del archivo

#### 3. **POST `/api/admin/pedidos/[id]/actualizar-estado`**
- **Autenticación:** Requerida (Clerk)
- **Autorización:** Solo administradores
- **Body (JSON):**
  ```json
  {
    "paso_actual": 8,
    "estado_tramitacion": "enviado_irs",
    "notas_admin": "Enviado al IRS el 13/02/2026"
  }
  ```
- **Validaciones:**
  - Usuario autenticado
  - Email en lista de admins
  - Pedido existe
  - `paso_actual` es requerido
- **Proceso:**
  1. Actualiza `paso_actual` en la tabla `pedidos`
  2. Actualiza metadata con:
     - `estado_tramitacion`
     - `notas_admin`
     - `ultima_actualizacion_admin`: Timestamp
     - `actualizado_por`: Email del admin
- **Respuesta:** JSON con confirmación

#### 4. **GET `/api/pedidos/[id]/descargar-carta-ein`**
- **Autenticación:** Requerida (Clerk)
- **Autorización:** Solo el propietario del pedido
- **Validaciones:**
  - Usuario autenticado
  - Pedido pertenece al usuario
  - Carta EIN existe (`metadata.carta_ein_path`)
- **Proceso:**
  1. Descarga el archivo desde Supabase Storage
  2. Convierte Blob a Buffer
  3. Devuelve el PDF
- **Respuesta:** PDF de la Carta EIN
- **Nombre del archivo:** `Carta_EIN_[numero_pedido].pdf`

---

## 📖 Guía de Uso

### Flujo Completo: Desde el Pedido hasta la Entrega del EIN

#### Paso 1: Cliente Completa el Onboarding
1. Cliente paga el servicio
2. Cliente completa el checklist legal (7 pasos)
3. Cliente firma digitalmente el SS-4
4. `paso_actual` se actualiza a `7`

#### Paso 2: Admin Descarga el SS-4
1. Accede a `/admin/pedidos/[id]`
2. En la sección "Gestión de Trámite", ve el botón "Descargar SS-4"
3. Hace clic y descarga el PDF
4. Envía el SS-4 al IRS (fax, correo, etc.)

#### Paso 3: Admin Actualiza el Estado
1. Selecciona el estado "Enviado al IRS"
2. Añade notas: "Enviado el 13/02/2026 vía fax. Confirmación: 123456"
3. Hace clic en "Marcar: Tramitando"
4. `paso_actual` se actualiza a `8`

#### Paso 4: IRS Procesa la Solicitud
1. El IRS revisa el formulario
2. Aprueba la solicitud
3. Envía la Carta EIN por correo/email

#### Paso 5: Admin Sube la Carta EIN
1. Recibe la Carta EIN del IRS
2. Escanea el documento (PDF)
3. En el panel de admin, selecciona el archivo
4. Hace clic en "Subir Carta EIN"
5. El sistema:
   - Sube el archivo a Supabase
   - Actualiza `paso_actual = 9`
   - Notifica al cliente automáticamente

#### Paso 6: Cliente Descarga su Carta EIN
1. Cliente ve notificación de EIN aprobado
2. Accede a su dashboard de pedidos
3. Ve la sección destacada "🎉 Tu Número EIN ha sido Aprobado"
4. Descarga la Carta EIN oficial del IRS

---

## 🔒 Seguridad

### Validación de Administradores

Todos los endpoints de admin validan que el usuario sea administrador:

```typescript
const adminEmails = [process.env.ADMIN_EMAIL, 'josemanuelguerranunez5@gmail.com']
const isAdmin = adminEmails.includes(user?.emailAddresses[0]?.emailAddress || '')

if (!isAdmin) {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
}
```

### Variables de Entorno

Añade a tu `.env.local`:

```env
ADMIN_EMAIL=tu-email@ejemplo.com
```

### Permisos de Supabase Storage

Asegúrate de que el bucket `documentos` tenga las políticas correctas:

```sql
-- Política para que los admins puedan subir archivos
CREATE POLICY "Admins can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documentos');

-- Política para que los usuarios puedan descargar sus documentos
CREATE POLICY "Users can download their documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documentos');
```

---

## 🚀 Próximas Mejoras

### Corto Plazo
- [ ] **Notificaciones por Email:** Enviar email al cliente cuando se suba la Carta EIN
- [ ] **Historial de Cambios:** Registrar todos los cambios de estado con timestamps
- [ ] **Búsqueda Avanzada:** Filtrar pedidos por estado, fecha, cliente, etc.
- [ ] **Exportar Reportes:** Generar reportes en PDF/Excel de ventas y pedidos

### Medio Plazo
- [ ] **Dashboard de Analíticas:** Gráficos de ventas, conversión, tiempo promedio de tramitación
- [ ] **Integración con NorthWest:** Envío automático de documentos al Registered Agent
- [ ] **Chat Interno:** Comunicación directa con el cliente desde el panel
- [ ] **Automatización de Fax:** Enviar SS-4 al IRS directamente desde el panel

### Largo Plazo
- [ ] **IA para Revisión de Documentos:** Validación automática de datos del SS-4
- [ ] **Integración con IRS:** Consulta automática del estado de tramitación
- [ ] **Multi-idioma:** Soporte para inglés y otros idiomas
- [ ] **App Móvil para Admin:** Gestión desde dispositivos móviles

---

## 📊 Métricas de Éxito

### KPIs a Monitorear
- **Tiempo promedio de tramitación:** Desde `paso_actual = 7` hasta `paso_actual = 9`
- **Tasa de aprobación del IRS:** Porcentaje de solicitudes aprobadas
- **Satisfacción del cliente:** Encuestas post-entrega
- **Errores en formularios:** Número de SS-4 rechazados por el IRS

---

## 🎓 Notas Técnicas

### Estructura de Metadata del Pedido

```typescript
interface PedidoMetadata {
  // Datos del Member
  member_nombre_completo?: string
  member_fecha_nacimiento?: string
  member_nacionalidad?: string
  member_residencia_pais?: string
  member_tax_id_tipo?: string
  member_tax_id_valor?: string
  member_direccion?: string
  
  // Datos de la LLC
  empresa_designador?: string
  empresa_tipo_gestion?: string
  empresa_proposito?: string
  empresa_sitio_web?: string
  
  // Documentos
  documento_identidad_path?: string
  documento_identidad_nombre?: string
  carta_ein_path?: string
  carta_ein_nombre?: string
  carta_ein_subida_fecha?: string
  carta_ein_subida_por?: string
  
  // Estado de tramitación
  estado_tramitacion?: 'pendiente' | 'enviado_irs' | 'en_revision' | 'aprobado' | 'rechazado'
  notas_admin?: string
  ultima_actualizacion_admin?: string
  actualizado_por?: string
}
```

### Pasos del Proceso (paso_actual)

| Paso | Descripción | Quién lo completa |
|------|-------------|-------------------|
| 1 | Solicitud recibida | Sistema (automático) |
| 2 | Pago confirmado | Stripe (webhook) |
| 3-6 | Checklist legal en progreso | Cliente |
| 7 | Checklist legal completado + SS-4 firmado | Cliente |
| 8 | Tramitando ante el IRS | Admin |
| 9 | EIN entregado | Admin |

---

## 📞 Soporte

Si tienes dudas o encuentras algún problema:

1. Revisa esta documentación
2. Consulta los logs en la consola del navegador
3. Verifica los logs del servidor en la terminal
4. Contacta al equipo de desarrollo

---

**Implementado con ❤️ por Antigravity AI**  
**Fecha:** 13 de febrero de 2026
