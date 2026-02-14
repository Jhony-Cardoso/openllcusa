# Sistema de Facturación Automática

## Descripción General
El sistema genera facturas automáticamente en formato PDF cuando se confirma un pago a través de Stripe. Las facturas se almacenan en Supabase Storage y están vinculadas a los pedidos y usuarios.

## Componentes

### 1. Base de Datos (`facturas`)
Tabla en Supabase que almacena los metadatos de las facturas.
- `id`: UUID único
- `pedido_id`: Referencia al pedido
- `user_id`: Referencia al usuario (Clerk/Supabase)
- `numero_factura`: Formato INV-AAAA-TIMESTAMP-RANDOM
- `pdf_path`: Ruta del archivo en Storage
- `total`, `subtotal`, `impuestos`: Montos financieros

### 2. Generación de PDF (`lib/pdf/invoice-generator.ts`)
Utiliza `pdf-lib` para generar un documento PDF de aspecto profesional.
- Diseño limpio y moderno (basado en Stitch)
- Incluye logo (texto simulado), detalles de empresa y cliente
- Tabla de items y totales
- Estado de pago visual

### 3. Servicio (`lib/services/invoice.service.ts`)
Orquesta el proceso:
1.  Crea el registro en la base de datos con estado `pagada`.
2.  Genera el PDF en memoria.
3.  Sube el PDF al bucket `facturas` en Supabase Storage.
4.  Actualiza el registro con la ruta del archivo (`pdf_path`).

### 4. Webhook de Stripe
Integrado en `app/api/stripe/webhook/route.ts`.
- Detecta evento `checkout.session.completed`.
- Llama a `InvoiceService.generarFacturaParaPedido`.
- Se ejecuta de manera asíncrona al envío de email para no bloquear.

### 5. API de Descarga (`app/api/facturas/[id]/descargar/route.ts`)
Endpoint seguro para descargar el PDF.
- Valida que el usuario sea el dueño de la factura o un administrador.
- Descarga el archivo desde el bucket privado de Supabase y lo sirve al navegador.

## Uso en Frontend

### Dashboard Cliente (`app/dashboard/pedidos/[id]/page.tsx`)
Muestra una tarjeta en la sección de "Documentos" si la factura existe y tiene un PDF asociado.

### Panel Admin (`app/admin/pedidos/[id]/page.tsx`)
Muestra una tarjeta de "Facturación" en la columna lateral con el número de factura, total y botón de descarga.

## Configuración Requerida

### Supabase Storage
Se requiere un bucket llamado `facturas`.
- **Acceso:** Privado.
- **Políticas:** 
    - Insert/Update: Solo Admin (Service Role).
    - Select: Authenticated Users (para descarga via API usando Service Role, o políticas RLS si se descarga directo). Actualmente usamos descarga via API con Service Role, así que el bucket puede ser totalmente privado.

### Base de Datos
Ejecutar la migración `supabase/migrations/20260214_create_facturas_table.sql`.

## Próximos Pasos (TODO)
- [ ] Personalizar datos de la empresa (Open LLC USA) con datos reales.
- [ ] Añadir logo real (imagen) al PDF.
- [ ] Manejar impuestos dinámicos si es necesario.
- [ ] Permitir regenerar facturas desde el admin si hay errores.
