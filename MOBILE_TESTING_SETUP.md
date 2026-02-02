# 📱 Guía: Probar la Aplicación en Móvil (Celular)

## 🚨 **Problema Actual**

Cuando intentas acceder desde el celular:
- ❌ Clerk te lleva a una página 404
- ❌ El login no funciona

**Causa:** Clerk solo está configurado para `localhost:3000`, pero desde el celular accedes con una URL diferente.

---

## ✅ **Solución: Usar ngrok**

ngrok crea un túnel HTTPS público que redirige a tu `localhost:3000`, permitiendo:
- ✅ Acceder desde cualquier dispositivo
- ✅ HTTPS automático (requerido por Clerk)
- ✅ URL estable durante la sesión
- ✅ Probar Apple Pay y Google Pay en dispositivos reales

---

## 🔧 **Paso 1: Instalar ngrok**

### **Opción A: Con npm (RECOMENDADO)**

```bash
npm install -g ngrok
```

### **Opción B: Descargar manualmente**

1. Ve a https://ngrok.com/download
2. Descarga la versión para Windows
3. Descomprime el archivo
4. Mueve `ngrok.exe` a una carpeta en tu PATH

---

## 🚀 **Paso 2: Crear cuenta en ngrok (GRATIS)**

1. Ve a https://dashboard.ngrok.com/signup
2. Crea una cuenta gratuita
3. Ve a https://dashboard.ngrok.com/get-started/your-authtoken
4. Copia tu authtoken

### **Autenticar ngrok:**

```bash
ngrok config add-authtoken TU_AUTHTOKEN_AQUI
```

---

## 🌐 **Paso 3: Iniciar ngrok**

### **Asegúrate de que tu app esté corriendo:**

```bash
# Terminal 1: Tu aplicación Next.js
npm run dev
```

### **Inicia ngrok en otra terminal:**

```bash
# Terminal 2: ngrok
ngrok http 3000
```

**Verás algo como:**

```
ngrok                                                                    

Session Status                online
Account                       tu-email@example.com
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Tu URL pública será:** `https://abc123.ngrok-free.app`

---

## 🔐 **Paso 4: Configurar Clerk**

### **4.1 Agregar el dominio de ngrok a Clerk**

1. Ve a https://dashboard.clerk.com
2. Selecciona tu aplicación
3. Ve a **"Configure"** → **"Domains"**
4. Haz clic en **"Add domain"**
5. Agrega tu URL de ngrok: `abc123.ngrok-free.app` (sin https://)
6. Marca como **"Development"**
7. Guarda

### **4.2 Actualizar las URLs de redirección**

En el mismo dashboard de Clerk:

1. Ve a **"Paths"**
2. Verifica que las rutas sean:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/dashboard`

### **4.3 Actualizar `.env.local`**

**IMPORTANTE:** Necesitas actualizar `NEXT_PUBLIC_BASE_URL` temporalmente:

```bash
# Cambia esto:
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Por esto (usa TU URL de ngrok):
NEXT_PUBLIC_BASE_URL=https://abc123.ngrok-free.app
```

**Reinicia tu servidor Next.js** después de cambiar `.env.local`:

```bash
# Ctrl+C para detener
npm run dev
```

---

## 📱 **Paso 5: Probar en tu Celular**

### **5.1 Abre la URL de ngrok en tu celular**

1. En tu celular, abre el navegador (Safari en iOS, Chrome en Android)
2. Navega a: `https://abc123.ngrok-free.app`
3. **Importante:** ngrok mostrará una pantalla de advertencia la primera vez
4. Haz clic en **"Visit Site"**

### **5.2 Probar el Login**

1. Intenta hacer login
2. Deberías poder autenticarte sin problemas
3. Verifica que te redirija correctamente

### **5.3 Probar el Checkout**

1. Navega al flujo de onboarding
2. Llega hasta el checkout
3. **En iOS con Safari:** Deberías ver Apple Pay 🍎
4. **En Android con Chrome:** Deberías ver Google Pay 🤖

---

## 🔄 **Paso 6: Webhook de Stripe (Opcional pero Recomendado)**

Si quieres que los webhooks funcionen con ngrok:

### **Terminal 3: Stripe CLI con ngrok**

```bash
stripe listen --forward-to https://abc123.ngrok-free.app/api/stripe/webhook
```

**Copia el webhook secret** que te da y actualiza `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_NUEVO_SECRET_AQUI
```

---

## 📝 **Script Automatizado**

He creado un script para facilitar el proceso. Guárdalo como `start-mobile-testing.ps1`:

```powershell
# start-mobile-testing.ps1
Write-Host "🚀 Iniciando entorno de pruebas móviles..." -ForegroundColor Cyan

# Verificar si ngrok está instalado
if (-not (Get-Command ngrok -ErrorAction SilentlyContinue)) {
    Write-Host "❌ ngrok no está instalado" -ForegroundColor Red
    Write-Host "Instalando ngrok..." -ForegroundColor Yellow
    npm install -g ngrok
}

# Verificar si el servidor Next.js está corriendo
$nextjsRunning = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.CommandLine -like "*next dev*"}

if (-not $nextjsRunning) {
    Write-Host "⚠️  Next.js no está corriendo" -ForegroundColor Yellow
    Write-Host "Inicia el servidor con: npm run dev" -ForegroundColor Yellow
    exit
}

# Iniciar ngrok
Write-Host "🌐 Iniciando ngrok..." -ForegroundColor Green
Start-Process -FilePath "ngrok" -ArgumentList "http 3000"

Write-Host ""
Write-Host "✅ ngrok iniciado!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Abre http://127.0.0.1:4040 para ver la URL de ngrok"
Write-Host "2. Copia la URL HTTPS (ej: https://abc123.ngrok-free.app)"
Write-Host "3. Agrégala a Clerk Dashboard → Domains"
Write-Host "4. Actualiza NEXT_PUBLIC_BASE_URL en .env.local"
Write-Host "5. Reinicia npm run dev"
Write-Host "6. Abre la URL en tu celular"
Write-Host ""
```

**Ejecutar:**

```bash
.\start-mobile-testing.ps1
```

---

## 🎯 **Checklist de Verificación**

Antes de probar en el celular, verifica:

- [ ] ngrok está instalado y autenticado
- [ ] `npm run dev` está corriendo
- [ ] ngrok está corriendo (`ngrok http 3000`)
- [ ] Has copiado la URL de ngrok (ej: `https://abc123.ngrok-free.app`)
- [ ] Has agregado el dominio en Clerk Dashboard
- [ ] Has actualizado `NEXT_PUBLIC_BASE_URL` en `.env.local`
- [ ] Has reiniciado `npm run dev`
- [ ] Puedes acceder a la URL de ngrok desde tu navegador desktop

---

## 🐛 **Troubleshooting**

### **Problema: "Invalid domain" en Clerk**

**Solución:**
- Asegúrate de agregar el dominio SIN `https://`
- Ejemplo correcto: `abc123.ngrok-free.app`
- Ejemplo incorrecto: `https://abc123.ngrok-free.app`

### **Problema: ngrok muestra "Visit Site" cada vez**

**Solución:**
- Esto es normal en la versión gratuita
- Simplemente haz clic en "Visit Site"
- O actualiza a ngrok Pro para eliminar esta pantalla

### **Problema: "Redirect URI mismatch" en Clerk**

**Solución:**
- Verifica que `NEXT_PUBLIC_BASE_URL` esté actualizado
- Reinicia el servidor Next.js
- Limpia la caché del navegador en el celular

### **Problema: Los webhooks no funcionan**

**Solución:**
- Usa `stripe listen --forward-to https://TU-URL-NGROK/api/stripe/webhook`
- Actualiza `STRIPE_WEBHOOK_SECRET` con el nuevo secret
- Reinicia el servidor

---

## 🔄 **Volver a Desarrollo Local**

Cuando termines de probar en móvil:

1. **Detén ngrok** (Ctrl+C en la terminal de ngrok)
2. **Restaura `.env.local`:**
   ```bash
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```
3. **Reinicia el servidor Next.js**
4. **Opcional:** Elimina el dominio de ngrok de Clerk Dashboard

---

## 💡 **Tips Adicionales**

### **Mantener la misma URL de ngrok**

Con ngrok gratuito, la URL cambia cada vez que lo reinicias. Para mantener la misma URL:

**Opción 1: No cerrar ngrok**
- Deja ngrok corriendo mientras desarrollas

**Opción 2: ngrok Pro**
- Paga por ngrok Pro para tener URLs estáticas
- Costo: ~$10/mes

### **Depurar en el celular**

**iOS (Safari):**
1. Conecta el iPhone a tu Mac
2. Abre Safari en Mac → Develop → [Tu iPhone] → [Tu página]
3. Verás la consola del navegador

**Android (Chrome):**
1. Conecta el Android a tu PC
2. Abre Chrome en PC → `chrome://inspect`
3. Verás los dispositivos conectados

---

## 🎉 **Resultado Final**

Después de seguir estos pasos:

- ✅ Podrás acceder a tu app desde el celular
- ✅ El login con Clerk funcionará correctamente
- ✅ Verás Apple Pay en iOS
- ✅ Verás Google Pay en Android
- ✅ Los webhooks funcionarán (si configuraste Stripe CLI)
- ✅ Podrás probar el flujo completo de pago

---

## 📚 **Recursos**

- **ngrok Docs:** https://ngrok.com/docs
- **Clerk Development Instances:** https://clerk.com/docs/deployments/overview
- **Stripe Testing:** https://stripe.com/docs/testing

¡Listo para probar en móvil! 🚀
