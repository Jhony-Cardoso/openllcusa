# 🔧 Configurar Clerk para Pruebas desde Móvil

## 📋 Problema Actual
Al intentar hacer login desde el celular, Clerk te redirige a una página 404 porque solo permite redirecciones a dominios configurados explícitamente.

## ✅ Solución Completa

### Paso 1: Instalar ngrok

```powershell
# Opción A: Con npm (RECOMENDADO)
npm install -g ngrok

# Opción B: Con Chocolatey
choco install ngrok

# Opción C: Descargar manualmente desde https://ngrok.com/download
```

### Paso 2: Crear Cuenta en ngrok (GRATIS)

1. Ve a https://dashboard.ngrok.com/signup
2. Crea una cuenta gratuita
3. Copia tu authtoken desde https://dashboard.ngrok.com/get-started/your-authtoken
4. Ejecuta en tu terminal:

```powershell
ngrok config add-authtoken TU_AUTHTOKEN_AQUI
```

### Paso 3: Iniciar ngrok

```powershell
# Asegúrate de que tu servidor Next.js esté corriendo
npm run dev

# En otra terminal, inicia ngrok
ngrok http 3000
```

Verás algo como:
```
Forwarding    https://abc123.ngrok-free.app -> http://localhost:3000
```

**⚠️ IMPORTANTE**: Copia la URL HTTPS (ejemplo: `https://abc123.ngrok-free.app`)

### Paso 4: Configurar Clerk Dashboard

1. **Ve al Dashboard de Clerk**:
   - https://dashboard.clerk.com/
   - Selecciona tu aplicación

2. **Agrega el dominio de ngrok**:
   - Ve a **"Configure"** → **"Domains"**
   - Click en **"Add domain"**
   - Pega tu URL de ngrok (ejemplo: `abc123.ngrok-free.app`)
   - **NO incluyas** `https://`, solo el dominio
   - Click en **"Add domain"**

3. **Configura las URLs de desarrollo**:
   - Ve a **"Configure"** → **"Paths"**
   - En **"Development instance"**, agrega:
     - Sign in URL: `/sign-in`
     - Sign up URL: `/sign-up`
     - After sign in URL: `/dashboard`
     - After sign up URL: `/dashboard`

4. **Habilita el dominio para desarrollo**:
   - Ve a **"Configure"** → **"Settings"**
   - Busca **"Development instance"**
   - Asegúrate de que tu dominio de ngrok esté listado

### Paso 5: Actualizar Variables de Entorno

Crea un archivo `.env.local.mobile` (temporal para pruebas):

```env
# Clerk (MISMO QUE .env.local)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c3RlcmxpbmctY2ljYWRhLTY2LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_finFb7nZWLpQPlldjPMVOMDy2liZyw6N80wcRiCBpi

# URLs de redirección (MISMO QUE .env.local)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase (MISMO QUE .env.local)
NEXT_PUBLIC_SUPABASE_URL=http://89.117.53.55:8001
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjkxNzg0NzQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.crGv5JUg5LPY4WtwtDDdxAuD7Ew5uTDU9x_YNmUyTDA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wZW4tbGxjLXVzYS1zdXBhYmFzZS02YzNiMDQtODktMTE3LTUzLTU1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzQ2MzcxMSwiZXhwIjoyMDUzMDM5NzExfQ.D6TQEfzKcCT792QYabRacW2Gcuo9OVimOveGfBRKYbE

# Stripe (MISMO QUE .env.local)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51StqGUJEd1MIEnRaKvUk1rhStNGHHrbnZNnYroZ0AW7B8cVnMAYHpbM0eIhebD9CfDuKoEd4OU66QLxqCM45aMRE00JKqzomGG
STRIPE_SECRET_KEY=sk_test_51StqGUJEd1MIEnRaIIm5X58Ij5hbtB3YTU2OVn5eGwbt2qZXxhwbfXPZOqMNN3LUNR4zQuvvfPU0IIPoYIPAHIHF00EJodhaZD
STRIPE_WEBHOOK_SECRET=whsec_e56d83c26db0d9eee836ac3e851725663b29f332836af7a4e2de4842e7222c0b

# ⚠️ CAMBIAR ESTO: Reemplaza con tu URL de ngrok
NEXT_PUBLIC_BASE_URL=https://abc123.ngrok-free.app
```

**⚠️ IMPORTANTE**: Reemplaza `https://abc123.ngrok-free.app` con tu URL real de ngrok.

### Paso 6: Reiniciar el Servidor

```powershell
# Detén el servidor Next.js (Ctrl+C)

# Copia las variables de entorno para esta sesión
cp .env.local.mobile .env.local

# Reinicia el servidor
npm run dev
```

### Paso 7: Probar desde el Móvil

1. **Abre la URL de ngrok en tu celular**:
   - Ejemplo: `https://abc123.ngrok-free.app`

2. **Acepta el aviso de ngrok**:
   - La primera vez verás una página de advertencia de ngrok
   - Click en **"Visit Site"**

3. **Prueba el login**:
   - Intenta hacer login
   - Ahora debería funcionar correctamente ✅

## 🔍 Verificación de Configuración

### Checklist antes de probar:

- [ ] ngrok está instalado y autenticado
- [ ] ngrok está corriendo (`ngrok http 3000`)
- [ ] Servidor Next.js está corriendo (`npm run dev`)
- [ ] Dominio de ngrok agregado en Clerk Dashboard
- [ ] `NEXT_PUBLIC_BASE_URL` actualizado en `.env.local`
- [ ] Servidor reiniciado después de cambiar `.env.local`

## 🐛 Solución de Problemas

### Error: "Invalid domain"
**Causa**: El dominio de ngrok no está agregado en Clerk.
**Solución**: Ve a Clerk Dashboard → Configure → Domains → Add domain

### Error: "Redirect URI mismatch"
**Causa**: Las URLs de redirección no coinciden.
**Solución**: 
1. Verifica que `NEXT_PUBLIC_BASE_URL` sea tu URL de ngrok
2. Reinicia el servidor Next.js

### Error: "This site can't be reached"
**Causa**: ngrok no está corriendo o la URL es incorrecta.
**Solución**: 
1. Verifica que ngrok esté corriendo
2. Copia la URL correcta (debe ser HTTPS)

### Error 404 al hacer login
**Causa**: Clerk no reconoce el dominio de ngrok.
**Solución**:
1. Ve a Clerk Dashboard
2. Configure → Domains
3. Agrega tu dominio de ngrok (sin `https://`)
4. Espera 1-2 minutos para que se propague

## 📱 Probar Apple Pay y Google Pay

Una vez que el login funcione:

### Para Apple Pay (iPhone):
1. Asegúrate de tener al menos una tarjeta en Apple Wallet
2. Abre Safari en tu iPhone
3. Ve a la URL de ngrok
4. Haz login
5. Ve a la página de pago
6. Deberías ver el botón de Apple Pay ✅

### Para Google Pay (Android):
1. Asegúrate de tener Google Pay configurado
2. Abre Chrome en tu Android
3. Ve a la URL de ngrok
4. Haz login
5. Ve a la página de pago
6. Deberías ver el botón de Google Pay ✅

## 🔄 Cada vez que reinicies ngrok

**⚠️ IMPORTANTE**: Cada vez que detengas y reinicies ngrok, obtendrás una URL diferente (en el plan gratuito).

Necesitarás:
1. Copiar la nueva URL de ngrok
2. Actualizar el dominio en Clerk Dashboard
3. Actualizar `NEXT_PUBLIC_BASE_URL` en `.env.local`
4. Reiniciar el servidor Next.js

### Solución: Usar un dominio estático (Opcional - Requiere plan de pago)

Si quieres evitar esto, puedes:
- Usar ngrok con un dominio estático (plan de pago)
- O usar una alternativa gratuita como Cloudflare Tunnel

## 🎯 Resumen Rápido

```powershell
# 1. Instalar ngrok
npm install -g ngrok

# 2. Autenticar ngrok
ngrok config add-authtoken TU_AUTHTOKEN

# 3. Iniciar servidor Next.js
npm run dev

# 4. En otra terminal, iniciar ngrok
ngrok http 3000

# 5. Copiar la URL HTTPS que aparece

# 6. Ir a Clerk Dashboard y agregar el dominio

# 7. Actualizar NEXT_PUBLIC_BASE_URL en .env.local

# 8. Reiniciar el servidor Next.js

# 9. Abrir la URL de ngrok en el celular
```

## 📞 ¿Necesitas Ayuda?

Si sigues teniendo problemas:
1. Verifica que todos los pasos estén completos
2. Revisa los logs del servidor Next.js
3. Revisa los logs de ngrok
4. Verifica la configuración en Clerk Dashboard
