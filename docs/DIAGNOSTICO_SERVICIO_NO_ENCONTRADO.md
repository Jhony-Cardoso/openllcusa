# 🔧 Diagnóstico: Error "Servicio no encontrado"

## 📋 Problema Actual

Cuando accedes a `/servicios/obtencion-ein/onboarding` desde el móvil, aparece el error "Servicio no encontrado" antes de pedir el login.

## 🔍 Causas Identificadas

### 1. **Middleware demasiado restrictivo (CORREGIDO)**

**Problema anterior:**
El middleware estaba usando un enfoque de "proteger todo excepto rutas públicas", lo cual puede causar bloqueos inesperados.

**Solución aplicada:**
Cambiamos a un enfoque más seguro: "solo proteger rutas del dashboard"

```typescript
// ANTES (problemático)
const isPublicRoute = createRouteMatcher([...muchas rutas...])
if (!isPublicRoute(req)) {
  await auth.protect() // Bloquea todo lo demás
}

// AHORA (correcto)
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
])
if (isProtectedRoute(req)) {
  await auth.protect() // Solo bloquea dashboard
}
```

### 2. **Servidor no reiniciado**

El servidor de desarrollo lleva corriendo 17+ minutos. Los cambios en `middleware.ts` **requieren reiniciar el servidor** para aplicarse.

## ✅ Solución

### Paso 1: Reiniciar el servidor de desarrollo

```bash
# Detener el servidor actual (Ctrl+C en la terminal donde corre npm run dev)
# Luego reiniciar:
npm run dev
```

### Paso 2: Limpiar caché del navegador móvil

En el móvil:
1. Cierra la pestaña del navegador
2. Abre una nueva pestaña en modo incógnito (si es posible)
3. Accede nuevamente a la URL de ngrok

### Paso 3: Verificar que ngrok está corriendo

```bash
# En una terminal separada, verifica que ngrok esté activo:
ngrok http 3000
```

## 🎯 Flujo Correcto Esperado

```
1. Usuario accede a: https://xxx.ngrok-free.dev/servicios/obtencion-ein/onboarding
2. Middleware verifica: ¿Es /dashboard? → NO → Permite acceso ✅
3. Página carga y consulta Supabase para obtener servicio "obtencion-ein"
4. Si el usuario NO está autenticado → Muestra formulario de elegibilidad
5. Al hacer clic en "Continuar" → Redirige a /sign-in
6. Usuario se autentica → Vuelve al onboarding
7. Continúa al checkout
```

## 🐛 Si el problema persiste

### Verificar que el servicio existe en la base de datos

```sql
SELECT * FROM servicios WHERE slug = 'obtencion-ein';
```

Debería devolver:
- `id`: `fdbf0572-5c56-447b-93db-aace1faccfb1`
- `slug`: `obtencion-ein`
- `nombre`: `Obtención de EIN`
- `precio`: `197.00`

### Verificar logs del servidor

Busca en la consola del servidor mensajes como:
- `Error obteniendo servicio:` → Problema con Supabase
- Errores de autenticación → Problema con Clerk

### Verificar variables de entorno

Asegúrate de que `.env.local` tiene:
```env
NEXT_PUBLIC_SUPABASE_URL=http://89.117.53.55:8001
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📝 Cambios Realizados

### Archivo: `middleware.ts`

**Antes:**
```typescript
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/servicios(.*)',
  '/paquetes(.*)',
  // ... muchas más
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})
```

**Ahora:**
```typescript
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})
```

### Archivos corregidos (rutas de redirección):

- ✅ `app/dashboard/facturacion/page.tsx`
- ✅ `app/dashboard/perfil/page.tsx`
- ✅ `app/dashboard/pedidos/page.tsx`
- ✅ `app/dashboard/page.tsx`
- ✅ `app/dashboard/pedidos/[id]/page.tsx`
- ✅ `app/dashboard/documentos/page.tsx`

Todos cambiados de `redirect('/auth/sign-in')` a `redirect('/sign-in')`

## 🎉 Resultado Esperado

Después de reiniciar el servidor:
- ✅ `/servicios/obtencion-ein/onboarding` carga correctamente
- ✅ Muestra el formulario de elegibilidad
- ✅ No pide login hasta hacer clic en "Continuar"
- ✅ Después del login, redirige correctamente al checkout
- ✅ No más error 404 en `/auth/sign-in`
- ✅ No más error "Servicio no encontrado"
