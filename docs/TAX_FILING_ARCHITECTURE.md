# Arquitectura del Sistema de Presentación Fiscal (Tax Filing)

Este documento describe el flujo técnico para la generación y presentación de formularios fiscales (Form 5472 + 1120) para LLCs de propiedad extranjera.

## 1. Resumen del Flujo

1.  **Onboarding (Frontend):** El usuario rellena un wizard con datos de la LLC, Dueño y Transacciones.
2.  **Creación de Pedido (API):** Se crea un registro en la tabla `pedidos` con el estado `pendiente_pago` y se guarda la información fiscal en la columna `tax_data` (JSONB).
3.  **Pago (Stripe):** Se redirige al usuario a Stripe Checkout.
4.  **Procesamiento (Webhook):**
    *   Stripe confirma el pago (`checkout.session.completed`).
    *   El sistema detecta que es un servicio fiscal (`metadata.tipo_servicio = 'tax_filing_5472'`).
    *   **Generación PDF:** Se genera el PDF combinado (1120 Cover + 5472 + Statements).
    *   **Almacenamiento:** Se sube el PDF al bucket `documentos` en Supabase Storage.
    *   **Vinculación:** Se guarda la URL del documento en `pedidos.metadata.documents`.
5.  **Entrega (Dashboard):** El usuario ve el pedido como "Pagado" y puede descargar su formulario desde el Dashboard.

## 2. Estructura de Datos

### Tabla `pedidos`

Se ha añadido una columna específica para datos estructurados complejos que no encajan en el modelo relacional estándar o en `metadata` genérico.

-   **`tax_data` (JSONB):** Contiene la estructura completa del formulario.
    ```json
    {
      "llcName": "Ejemplo LLC",
      "llcEin": "12-3456789",
      "ownerName": "Juan Pérez",
      "capitalContributionCash": 5000,
      "taxYear": 2024,
      ...
    }
    ```

### Tabla `documentos` (Storage Payload en `pedidos.metadata`)

En `pedidos.metadata.documents`:
```json
{
  "form_5472_url": "https://.../tax-forms/USER_ID/PEDIDO_ID/form-5472-1120.pdf",
  "generated_at": "2026-02-14T12:00:00Z"
}
```

## 3. Servicios Clave

-   **`TaxFormService` (`lib/services/tax-form.service.ts`):**
    -   `generate5472Package(data)`: Orquesta la carga de templates PDF, rellenado de campos XFA/AcroForm, y unión de documentos.
    -   Maneja la lógica de "Supporting Statements" dinámicos.

-   **`PedidoModel` (`lib/models/pedido.ts`):**
    -   `guardarDatosFiscales(id, data)`: Método especializado para actualizar `tax_data` y estado.

-   **Webhook Stripe (`app/api/stripe/webhook/route.ts`):**
    -   Punto de entrada asíncrono que garantiza que el documento se genere solo tras el pago confirmado.

## 4. Configuración Necesaria

-   **Templates PDF:** Deben existir en `public/templates/irs/` (`f5472.pdf`, `f1120.pdf`).
-   **Storage:** Bucket `documentos` debe existir y tener políticas de lectura pública (o usar URLs firmadas).
-   **Variables de Entorno:**
    -   `STRIPE_SECRET_KEY`
    -   `STRIPE_WEBHOOK_SECRET`
    -   `NEXT_PUBLIC_SUPABASE_URL`
    -   `SUPABASE_SERVICE_ROLE_KEY`
