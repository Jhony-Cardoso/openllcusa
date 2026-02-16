# Solución: tax_data Vacío en Pedidos Fiscales

## 🔍 Problema Identificado

El pedido fiscal que estás viendo en el admin tiene `tax_data = null`, por eso aparecen "N/A" en todos los campos.

**Causa:** El pedido se creó antes de que el sistema guardara correctamente los datos fiscales, o hubo un error durante el proceso de checkout.

---

## ✅ Soluciones

### **Opción 1: Crear un Nuevo Pedido de Prueba** (RECOMENDADO)

Esta es la forma más rápida y segura de probar el flujo completo:

1. **Accede al formulario fiscal:**
   ```
   http://localhost:3000/servicios/form-5472-1120/onboarding
   ```

2. **Completa el formulario con datos de prueba:**
   - **Paso 1 - Datos de la LLC:**
     - Nombre: Test International LLC
     - EIN: 98-7654321
     - Dirección: 1234 Business Ave
     - Ciudad: Cheyenne
     - Estado: Wyoming
     - ZIP: 82001
     - Fecha de formación: 2024-01-15

   - **Paso 2 - Datos del Dueño:**
     - Nombre: Juan Pérez García
     - Dirección: Calle Principal 123, Piso 4
     - Ciudad: Madrid
     - País: Spain
     - Tax ID: 12345678X
     - Tipo: Foreign Tax ID

   - **Paso 3 - Transacciones:**
     - Contribución en efectivo: $5,000
     - Resto: $0

3. **Realiza el pago con tarjeta de prueba:**
   ```
   Número: 4242 4242 4242 4242
   Fecha: Cualquier fecha futura (ej: 12/25)
   CVC: Cualquier 3 dígitos (ej: 123)
   ZIP: Cualquier código (ej: 12345)
   ```

4. **Verifica en el admin:**
   - Ve a `/admin/pedidos`
   - Busca el nuevo pedido
   - Deberías ver los datos fiscales correctamente poblados

---

### **Opción 2: Poblar Manualmente el Pedido Actual**

Si prefieres usar el pedido existente para pruebas:

1. **Obtén el ID del pedido:**
   - Está en la URL: `/admin/pedidos/[ID]`
   - Ejemplo: `38c0d409-ba87-4467-b2f3-92a9c23dcdc5`

2. **Abre el Editor SQL de Supabase:**
   - Ve a tu proyecto en Supabase
   - Menú lateral → SQL Editor
   - New Query

3. **Ejecuta el script:**
   - Abre el archivo: `supabase/migrations/poblar_tax_data_prueba.sql`
   - Copia todo el contenido
   - **IMPORTANTE:** Reemplaza `'TU_PEDIDO_ID_AQUI'` con el ID real del pedido
   - Ejecuta el script (botón "Run")

4. **Verifica:**
   - Refresca la página del admin
   - Los datos deberían aparecer correctamente

---

## 🧪 Probar la Generación de Formularios

Una vez que tengas un pedido con `tax_data` poblado:

1. **Accede al pedido en el admin:**
   ```
   http://localhost:3000/admin/pedidos/[ID]
   ```

2. **Verifica que los datos aparezcan:**
   - Deberías ver:
     - Año Fiscal: 2024
     - Nombre LLC: Test International LLC
     - EIN: 98-7654321
     - Estado: Wyoming

3. **Haz clic en "Generar Formularios":**
   - El sistema generará el PDF
   - Lo subirá a Supabase Storage
   - Actualizará el pedido con la URL del documento

4. **Descarga el PDF:**
   - Aparecerá un botón "Descargar Formularios"
   - Verifica que el PDF contenga los datos correctos

---

## 🐛 Solución al Error del Bloqueador

El error `ERR_BLOCKED_BY_CLIENT` que viste es causado por extensiones del navegador (bloqueadores de anuncios, privacy badger, etc.).

**Solución temporal:**
1. Abre el sitio en modo incógnito
2. O desactiva temporalmente las extensiones de bloqueo

---

## 📋 Checklist de Verificación

- [ ] Crear nuevo pedido de prueba O poblar pedido existente
- [ ] Verificar que `tax_data` aparece en el admin
- [ ] Generar formularios PDF
- [ ] Descargar y revisar el PDF
- [ ] Subir acuse de recibo de prueba
- [ ] Verificar que el cliente ve el documento en su dashboard

---

## 🆘 Si Algo No Funciona

Envíame:
1. Logs de la consola del navegador (F12 → Console)
2. Logs de la terminal del servidor
3. Captura de pantalla del error

¡Estoy aquí para ayudarte!
