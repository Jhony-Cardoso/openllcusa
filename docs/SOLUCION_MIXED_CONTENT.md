# 🔧 Solución: Mixed Content Error (HTTP desde HTTPS)

## 📋 Problema Identificado

Cuando accedes a la aplicación desde ngrok (HTTPS) en el móvil, la página intenta hacer peticiones HTTP a Supabase, lo cual está bloqueado por el navegador por razones de seguridad.

### Causa Raíz: Mixed Content

```
Usuario móvil → https://xxx.ngrok-free.dev (HTTPS) ✅
              ↓
Intenta consultar → http://89.117.53.55:8001 (HTTP) ❌
              ↓
Navegador BLOQUEA la petición 🚫
```

**Los navegadores modernos NO permiten hacer peticiones HTTP desde páginas HTTPS** (Mixed Content Policy).

## ✅ Solución Implementada: API Proxy

Creamos una API route en Next.js que actúa como proxy:

```
Usuario móvil → https://xxx.ngrok-free.dev/api/servicios (HTTPS) ✅
              ↓
Servidor Next.js → http://89.117.53.55:8001 (HTTP) ✅
              ↓
Respuesta → Usuario móvil (HTTPS) ✅
```

### Archivos Creados/Modificados

#### 1. **Nueva API Route**: `app/api/servicios/route.ts`

Esta API:
- Recibe peticiones HTTPS del cliente
- Consulta Supabase desde el servidor (donde HTTP está permitido)
- Devuelve los datos al cliente vía HTTPS

```typescript
// GET /api/servicios?slug=obtencion-ein
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  
  // Consulta Supabase desde el servidor
  const response = await fetch(
    `${supabaseUrl}/rest/v1/servicios?slug=eq.${slug}`,
    { headers: { apikey, Authorization } }
  )
  
  return NextResponse.json(data)
}
```

#### 2. **Modificado**: `app/servicios/[slug]/onboarding/page.tsx`

**ANTES** (consulta directa - bloqueada por Mixed Content):
```typescript
const supabase = createClient()
const { data } = await supabase
  .from('servicios')
  .select('*')
  .eq('slug', slug)
  .single()
```

**AHORA** (usa API proxy - funciona correctamente):
```typescript
const response = await fetch(`/api/servicios?slug=${slug}`)
const data = await response.json()
```

## 🎯 Ventajas de esta Solución

1. ✅ **Funciona con ngrok (HTTPS)**: No hay problemas de Mixed Content
2. ✅ **Funciona en localhost (HTTP)**: También funciona en desarrollo local
3. ✅ **Más seguro**: Las credenciales de Supabase solo se usan en el servidor
4. ✅ **Mejor logging**: Podemos ver errores en el servidor
5. ✅ **Fácil de mantener**: Un solo punto de acceso a Supabase

## 📱 Prueba desde el Móvil

1. **Accede a la página de diagnóstico**:
   ```
   https://xxx.ngrok-free.dev/diagnostico
   ```

2. **Haz clic en "Probar servicio obtencion-ein"**
   - Deberías ver logs verdes ✅
   - Deberías ver los datos del servicio

3. **Navega al onboarding**:
   ```
   https://xxx.ngrok-free.dev/servicios/obtencion-ein/onboarding
   ```
   - Ahora debería cargar correctamente
   - No más error "Servicio no encontrado"

## 🔍 Verificación de Logs

### En el navegador móvil (consola):
```
🔍 Cargando servicio con slug: obtencion-ein
📡 Consultando API /api/servicios...
✅ Servicio cargado: { id: "...", nombre: "Obtención de EIN", ... }
```

### En el servidor (terminal):
```
GET /api/servicios?slug=obtencion-ein 200 in 150ms
```

## 🐛 Si el problema persiste

### 1. Verificar que la API funciona

Abre en el navegador del móvil:
```
https://xxx.ngrok-free.dev/api/servicios?slug=obtencion-ein
```

Deberías ver JSON con los datos del servicio.

### 2. Verificar variables de entorno

Asegúrate de que `.env.local` tiene:
```env
NEXT_PUBLIC_SUPABASE_URL=http://89.117.53.55:8001
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Verificar que Supabase está accesible

Desde el servidor, prueba:
```bash
curl http://89.117.53.55:8001/rest/v1/servicios?slug=eq.obtencion-ein \
  -H "apikey: YOUR_KEY" \
  -H "Authorization: Bearer YOUR_KEY"
```

## 📚 Solución a Largo Plazo

Para producción, considera:

1. **Usar HTTPS en Supabase**: Configura un certificado SSL en tu VPS
2. **Usar un dominio**: En lugar de IP, usa un dominio con SSL
3. **Usar Supabase Cloud**: Ya tiene HTTPS configurado

Ejemplo con dominio:
```env
NEXT_PUBLIC_SUPABASE_URL=https://supabase.tudominio.com
```

## 🎉 Resultado Esperado

Después de estos cambios:
- ✅ La página carga correctamente desde ngrok
- ✅ No hay errores de Mixed Content
- ✅ Los servicios se cargan desde la base de datos
- ✅ El flujo de onboarding funciona completamente
