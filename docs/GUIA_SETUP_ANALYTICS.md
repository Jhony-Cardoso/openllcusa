# 📊 Guía de Configuración Inicial: Google Analytics 4 (GA4)

Esta guía te ayudará a configurar tu cuenta de Google Analytics desde cero de la manera correcta para un negocio digital.

## 1. Creación de la Cuenta

1.  Accede a [analytics.google.com](https://analytics.google.com) con tu **cuenta de empresa** (ej: `admin@openllcusa.com`).
2.  Haz clic en **"Empezar a medir"** o en el engranaje de **Administrar** (abajo a la izquierda) -> **Crear cuenta**.
3.  **Nombre de la cuenta:** `Open LLC USA` (o el nombre legal de tu empresa).
    *   Marca las casillas de compartir datos según tu preferencia (normalmente se dejan marcadas).

## 2. Creación de la Propiedad

1.  **Nombre de la propiedad:** `Open LLC USA Web`.
2.  **Zona horaria:** Selecciona la de tu público principal (ej: Estados Unidos - New York) o la tuya si prefieres ver los datos en tu horario.
3.  **Moneda:** `Dólar estadounidense ($)`. Importante para que los ingresos de Stripe coincidan con los informes.

## 3. Detalles del Negocio

1.  Selecciona tu categoría (ej: Finanzas, Leyes y gobierno, o Otros).
2.  Tamaño de la empresa: Pequeña (1-10) si aplica.
3.  Objetivos: Marca "Generar oportunidades de venta" y "Aumentar las ventas online".

## 4. Configurar Flujo de Datos (Data Stream)

1.  Selecciona la plataforma: **Web**.
2.  **URL del sitio:** `openllcusa.com` (o el dominio que vayas a usar, sin `https://`).
3.  **Nombre del flujo:** `Open LLC USA Web`.
4.  Mantén activada la **Medición mejorada** (trackea scrolls, clics, búsquedas automáticamente).
5.  Haz clic en **"Crear flujo"**.

## 5. 🚨 OBTENER EL ID DE MEDICIÓN

Una vez creado el flujo, verás una pantalla con detalles. Busca el **ID DE MEDICIÓN** en la parte superior derecha.
Tendrá este formato: **`G-XXXXXXXXXX`**.

> **¡Este es el código que necesitamos para integrar Next.js!**

---

## 🛡️ Consideraciones de Privacidad (GDPR/CCPA)

Al implementar Analytics, estás recolectando datos de usuarios.

*   **Cookie Banner:** Es recomendable (y obligatorio en Europa/California) tener un banner que avise al usuario.
*   **Modo de Consentimiento de Google:** Si activas esto, Analytics no guardará cookies hasta que el usuario acepte. (Podemos implementarlo básico al principio y mejorarlo después).

## 📈 Eventos Clave que Implementaremos

No basta con ver visitas. Vamos a configurar tu web para que Analytics reciba estos eventos específicos de tu negocio:

1.  `begin_checkout`: Cuando el usuario entra al formulario de pago.
2.  `purchase`: Cuando Stripe confirma el pago (enviaremos el valor `$197` para que GA4 calcule el retorno de inversión - ROAS).
3.  `sign_up`: Cuando un usuario se crea cuenta en Clerk.
