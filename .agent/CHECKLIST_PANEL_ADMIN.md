# ✅ Checklist de Verificación - Panel de Administración

**Fecha:** 13 de febrero de 2026  
**Responsable:** José Manuel

---

## 📋 Checklist Pre-Producción

### 1. Configuración de Variables de Entorno

- [ ] **`.env.local` actualizado con:**
  ```env
  ADMIN_EMAIL=tu-email@ejemplo.com
  ```

### 2. Configuración de Supabase Storage

- [ ] **Bucket `documentos` creado**
  - Ir a Supabase Dashboard > Storage
  - Crear bucket llamado `documentos`
  - Configurar como privado

- [ ] **Políticas de acceso configuradas:**
  ```sql
  -- Permitir a usuarios autenticados subir archivos
  CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documentos');

  -- Permitir a usuarios autenticados descargar archivos
  CREATE POLICY "Authenticated users can download"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'documentos');

  -- Permitir a usuarios autenticados actualizar archivos
  CREATE POLICY "Authenticated users can update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'documentos');
  ```

### 3. Verificación de Endpoints API

- [ ] **GET `/api/admin/pedidos/[id]/descargar-ss4`**
  - Probar con un pedido que tenga `paso_actual >= 7`
  - Verificar que descarga el PDF correctamente
  - Verificar que solo admins pueden acceder

- [ ] **POST `/api/admin/pedidos/[id]/subir-carta-ein`**
  - Probar subida de un PDF de prueba
  - Verificar que se guarda en Supabase Storage
  - Verificar que actualiza el metadata del pedido
  - Verificar que actualiza `paso_actual = 9`

- [ ] **POST `/api/admin/pedidos/[id]/actualizar-estado`**
  - Probar actualización de estado
  - Verificar que guarda las notas administrativas
  - Verificar que registra quién hizo el cambio

- [ ] **GET `/api/pedidos/[id]/descargar-carta-ein`**
  - Probar descarga como cliente
  - Verificar que solo el propietario puede descargar
  - Verificar que descarga el PDF correcto

### 4. Verificación de Componentes

- [ ] **AdminDocumentManager**
  - Probar selección de archivo
  - Verificar validación de tipo (solo PDF)
  - Verificar validación de tamaño (máx 10MB)
  - Probar subida de archivo
  - Verificar feedback visual (loading, success, error)
  - Probar actualización de estado
  - Verificar recarga automática después de acciones

### 5. Verificación de Páginas

- [ ] **`/admin` (Dashboard Principal)**
  - Verificar que muestra estadísticas correctas
  - Verificar que lista pedidos pendientes
  - Verificar que muestra actividad reciente

- [ ] **`/admin/pedidos/[id]` (Detalle de Pedido)**
  - Verificar que muestra toda la información del cliente
  - Verificar que muestra el componente AdminDocumentManager
  - Verificar que el botón "Descargar SS-4" funciona
  - Verificar que el formulario de subida funciona

- [ ] **`/dashboard/pedidos/[id]` (Dashboard del Cliente)**
  - Verificar que NO muestra el SS-4
  - Verificar que muestra la Carta EIN cuando está disponible
  - Verificar que el botón de descarga funciona

### 6. Pruebas de Seguridad

- [ ] **Acceso no autorizado:**
  - Intentar acceder a `/admin` sin estar logueado → Redirige a `/sign-in`
  - Intentar acceder a `/admin` con usuario no-admin → Redirige a `/dashboard`
  - Intentar descargar SS-4 sin ser admin → Error 403
  - Intentar descargar Carta EIN de otro usuario → Error 403

- [ ] **Validaciones de archivos:**
  - Intentar subir un archivo que no es PDF → Error
  - Intentar subir un archivo > 10MB → Error

### 7. Pruebas de Flujo Completo

- [ ] **Flujo End-to-End:**
  1. Crear un pedido de prueba
  2. Completar el onboarding como cliente
  3. Firmar el SS-4
  4. Acceder al panel de admin
  5. Descargar el SS-4
  6. Actualizar estado a "Enviado al IRS"
  7. Subir una Carta EIN de prueba
  8. Verificar que el cliente puede descargar la Carta EIN
  9. Verificar que el pedido está marcado como completado

### 8. Verificación de Build

- [ ] **Build de producción exitoso:**
  ```bash
  npm run build
  ```
  - Sin errores de TypeScript
  - Sin errores de ESLint
  - Sin warnings críticos

### 9. Documentación

- [ ] **Documentación completa creada:**
  - `.agent/PANEL_ADMINISTRACION.md`
  - `.agent/CAMBIOS_DASHBOARD_CLIENTE.md`
  - `.agent/RESUMEN_PANEL_ADMIN.md`
  - Este checklist

### 10. Deployment

- [ ] **Variables de entorno en producción:**
  - `ADMIN_EMAIL` configurado en Vercel/hosting
  - Todas las variables de Supabase configuradas

- [ ] **Deploy a producción:**
  ```bash
  git add .
  git commit -m "feat: Implementar panel de administración completo"
  git push origin main
  ```

- [ ] **Verificación post-deploy:**
  - Acceder a `https://tu-dominio.com/admin`
  - Probar todas las funcionalidades en producción
  - Verificar que Supabase Storage funciona en producción

---

## 🐛 Troubleshooting

### Problema: "No se encuentra AdminDocumentManager"
**Solución:** Verificar que el import esté correcto:
```tsx
import AdminDocumentManager from '@/components/admin/AdminDocumentManager'
```

### Problema: "Error al subir archivo a Supabase"
**Solución:** 
1. Verificar que el bucket `documentos` existe
2. Verificar las políticas de acceso
3. Verificar que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` están configuradas

### Problema: "Error 403 al acceder a /admin"
**Solución:**
1. Verificar que tu email está en la lista de admins
2. Verificar que `ADMIN_EMAIL` está configurado en `.env.local`
3. Verificar que estás logueado con el email correcto

### Problema: "El cliente no puede descargar la Carta EIN"
**Solución:**
1. Verificar que `metadata.carta_ein_path` existe en el pedido
2. Verificar que el archivo existe en Supabase Storage
3. Verificar que el cliente está logueado con la cuenta correcta

---

## 📞 Contacto

Si encuentras algún problema que no está en este checklist:

1. Revisa los logs del servidor (terminal)
2. Revisa los logs del navegador (consola)
3. Consulta la documentación en `.agent/PANEL_ADMINISTRACION.md`
4. Contacta al equipo de desarrollo

---

## ✅ Firma de Aprobación

- [ ] **Todas las pruebas pasadas**
- [ ] **Build exitoso**
- [ ] **Documentación completa**
- [ ] **Listo para producción**

**Fecha de aprobación:** _______________  
**Aprobado por:** _______________

---

**Creado por:** Antigravity AI  
**Fecha:** 13 de febrero de 2026
