# Guía de Resolución: Flujo de Onboarding de Paquetes

## 🔐 Error 404 en Página de Sign-In (RESUELTO - 25/01/2026)

### Problema
Al intentar acceder a `/sign-in` después de comprar un paquete, aparecía un error 404 "This page could not be found".

### Causa
Las rutas de autenticación de Clerk estaban configuradas incorrectamente:
- **Variables de entorno** apuntaban a `/auth/sign-in` y `/auth/sign-up`
- **Estructura de carpetas** estaba en `app/auth/sign-in/[[...sign-in]]/page.tsx`
- Clerk con catch-all routes `[[...sign-in]]` requiere que la ruta sea `/sign-in` directamente

### Solución Aplicada
1. **Actualizado `.env.local`**:
   ```bash
   # ANTES
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
   
   # DESPUÉS
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   ```

2. **Movidas las carpetas de autenticación**:
   - De: `app/auth/sign-in/` → A: `app/sign-in/`
   - De: `app/auth/sign-up/` → A: `app/sign-up/`

3. **Eliminada carpeta `app/auth/`** (ya no es necesaria)

4. **Reiniciado el servidor**:
   ```powershell
   # Detener procesos Node.js
   Get-Process node | Stop-Process -Force
   
   # Limpiar caché
   Remove-Item -Path ".next" -Recurse -Force
   
   # Reiniciar servidor
   npm run dev
   ```

### Verificación
Después de aplicar estos cambios:
- ✅ La ruta `/sign-in` debe funcionar correctamente
- ✅ El formulario de Clerk debe aparecer sin error 404
- ✅ El flujo de onboarding debe continuar normalmente

---


## 🔄 Flujo de Onboarding Interrumpido Después del Login (RESUELTO - 25/01/2026)

### Problema
Después de resolver el error 404 en `/sign-in`, surgió un nuevo problema:
1. Usuario hace clic en "Empezar" en un paquete (ej: Launch + Banking)
2. Se redirige a `/sign-in` correctamente
3. Usuario se autentica exitosamente
4. **Problema**: En lugar de volver al flujo de onboarding, se redirige a `/dashboard` y pierde el contexto de la compra

### Causa
El flujo de autenticación no preservaba la información sobre qué paquete estaba intentando comprar el usuario:
- Al hacer clic en "Continuar" sin estar autenticado, se redirigía a `/sign-in` sin parámetros
- Clerk, por defecto, redirigía a `/dashboard` (según `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`)
- No había forma de que el sistema supiera a dónde volver después del login

### Solución Aplicada

#### 1. **Modificado el flujo de redirección en onboarding**
Archivo: `app/paquetes/[paqueteSlug]/onboarding/page.tsx`

```typescript
// ANTES
if (!isUserLoaded || !user) {
  router.push('/sign-in');
  return;
}

// DESPUÉS
if (!isUserLoaded || !user) {
  const returnUrl = `/paquetes/${paqueteSlug}/onboarding`;
  router.push(`/sign-in?redirect_url=${encodeURIComponent(returnUrl)}`);
  return;
}
```

#### 2. **Actualizado componente de Sign-In**
Archivo: `app/sign-in/[[...sign-in]]/page.tsx`

```typescript
'use client';

import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/dashboard';

  return (
    // ... UI ...
    <SignIn forceRedirectUrl={redirectUrl} />
  );
}
```

#### 3. **Actualizado componente de Sign-Up**
Archivo: `app/sign-up/[[...sign-up]]/page.tsx`

Misma lógica que sign-in para mantener consistencia.

#### 4. **Corregidos enlaces en página de precios**
Archivo: `app/precios/page.tsx`

Cambiados todos los enlaces de:
- `/servicios/launch-banking` → `/paquetes/launch-banking/onboarding`
- `/servicios/llc-esencial` → `/paquetes/llc-esencial/onboarding`
- etc.

### Flujo Correcto Ahora

1. Usuario hace clic en "Empezar" en `/precios` → va a `/paquetes/launch-banking/onboarding`
2. Si no está autenticado, se redirige a `/sign-in?redirect_url=%2Fpaquetes%2Flaunch-banking%2Fonboarding`
3. Usuario se autentica
4. **Clerk redirige automáticamente** a `/paquetes/launch-banking/onboarding` (usando `forceRedirectUrl`)
5. El flujo continúa normalmente al paso 2 (selección de estado)

### Verificación
- ✅ El parámetro `redirect_url` se pasa correctamente en la URL
- ✅ Clerk respeta el `forceRedirectUrl` y redirige al onboarding
- ✅ El usuario puede completar todo el flujo sin interrupciones
- ✅ Si ya está autenticado, va directamente al onboarding sin pasar por login

---



## ✅ Cambios Realizados en el Código

### 1. Rutas Corregidas
- Cambiadas todas las rutas de `/servicios/` a `/paquetes/`
- Archivos actualizados:
  - `app/paquetes/[paqueteSlug]/onboarding/estado/page.tsx`
  - `app/paquetes/[paqueteSlug]/onboarding/datos-empresa/page.tsx`
  - `app/paquetes/[paqueteSlug]/onboarding/revision/page.tsx`
  - `app/paquetes/[paqueteSlug]/onboarding/layout.tsx`

### 2. Modelo de Pedido Actualizado
- Ahora soporta tanto `paquete_id` (bundles) como `servicio_id` (servicios individuales)
- Método `crear()` actualizado con parámetros opcionales
- Método `obtenerPorUsuario()` añadido
- Método `obtenerCompleto()` corregido para hacer join con `paquetes` y `servicios`

### 3. Tipos TypeScript Actualizados
- `database.types.ts` actualizado con ambas columnas: `paquete_id` y `servicio_id`

### 4. Logs de Debugging Añadidos
- Añadidos console.log en los pasos de estado y datos-empresa para facilitar debugging

## 📋 Scripts SQL a Ejecutar en Supabase Studio

### Script 1: Limpiar y Configurar Foreign Keys
```sql
-- Limpiar pedidos existentes (tienen referencias inválidas)
TRUNCATE TABLE public.pedidos CASCADE;

-- Eliminar constraints antiguas
ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_paquete_id_fkey;
ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_servicio_id_fkey;
ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_estado_usa_id_fkey;

-- Añadir columna servicio_id si no existe
ALTER TABLE public.pedidos 
ADD COLUMN IF NOT EXISTS servicio_id uuid;

-- Crear foreign keys correctas
ALTER TABLE public.pedidos 
  ADD CONSTRAINT pedidos_paquete_id_fkey 
  FOREIGN KEY (paquete_id) 
  REFERENCES public.paquetes(id) 
  ON DELETE SET NULL;

ALTER TABLE public.pedidos 
  ADD CONSTRAINT pedidos_servicio_id_fkey 
  FOREIGN KEY (servicio_id) 
  REFERENCES public.servicios(id) 
  ON DELETE SET NULL;

ALTER TABLE public.pedidos 
  ADD CONSTRAINT pedidos_estado_usa_id_fkey 
  FOREIGN KEY (estado_usa_id) 
  REFERENCES public.estados_usa(id) 
  ON DELETE SET NULL;
```

### Script 2: Verificar Configuración
```sql
-- Verificar foreign keys
SELECT 
    tc.constraint_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'pedidos'
  AND tc.table_schema = 'public';

-- Verificar datos de paquetes
SELECT id, slug, nombre FROM paquetes;

-- Verificar datos de estados
SELECT id, codigo, nombre FROM estados_usa WHERE activo = true;
```

## 🔧 Pasos para Resolver el Problema

### 1. Ejecutar Scripts SQL
- Abre Supabase Studio (http://89.117.53.55:8001)
- Ve a SQL Editor
- Ejecuta el Script 1 (Limpiar y Configurar Foreign Keys)
- Ejecuta el Script 2 (Verificar Configuración)
- Confirma que:
  - Hay 3 foreign keys en pedidos
  - Hay 3 paquetes en la tabla paquetes
  - Hay 5 estados en la tabla estados_usa

### 2. Limpiar Caché de Next.js
- Cierra VSCode completamente
- Elimina manualmente la carpeta `.next` desde el Explorador de Windows
- Si Windows no te deja eliminarla, reinicia tu PC

### 3. Reiniciar el Servidor
```powershell
npm run dev
```

### 4. Probar el Flujo
1. Abre http://localhost:3000
2. Haz clic en "Empezar" en cualquier paquete (Launch + Banking, LLC Esencial, etc.)
3. Abre la consola del navegador (F12)
4. Deberías ver:
   - Logs con emojis (🔍, 📊, 📦)
   - Los 5 estados de USA en el paso de selección
   - El flujo completo debería funcionar

## 🐛 Si Sigues Teniendo Problemas

### Problema: "No se encontró el pedido"
- Verifica que ejecutaste el Script 1 para limpiar pedidos
- Verifica que las foreign keys están correctas (Script 2)

### Problema: "Los estados no aparecen"
- Abre la consola del navegador
- Busca el log "📊 Estados obtenidos:"
- Si el array está vacío, ejecuta el script de seed: `002_seed_data.sql`

### Problema: "Error de foreign key"
- Ejecuta el Script 1 de nuevo
- Asegúrate de que la tabla `paquetes` tiene datos antes de crear pedidos

### Problema: "Error EPERM en .next/trace"
- Cierra todos los procesos de Node.js
- Reinicia tu computadora
- Elimina la carpeta `.next` manualmente
- Ejecuta `npm run dev` de nuevo

## 📞 Contacto

Si después de seguir todos estos pasos el problema persiste, proporciona:
1. Captura de pantalla de la consola del navegador (F12)
2. Resultado del Script 2 (Verificar Configuración)
3. Logs del servidor de Next.js
