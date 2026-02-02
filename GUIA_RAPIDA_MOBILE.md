# 🚀 Guía Rápida: Probar desde Móvil

## ⚡ Opción 1: Script Automatizado (RECOMENDADO)

```powershell
# Ejecuta este comando en PowerShell:
.\setup-mobile-testing.ps1
```

El script te guiará paso a paso y hará todo automáticamente.

---

## 🔧 Opción 2: Manual (5 minutos)

### 1. Instalar ngrok
```powershell
npm install -g ngrok
```

### 2. Crear cuenta en ngrok
1. Ve a https://dashboard.ngrok.com/signup
2. Crea una cuenta GRATIS
3. Copia tu authtoken
4. Ejecuta:
```powershell
ngrok config add-authtoken TU_AUTHTOKEN_AQUI
```

### 3. Iniciar ngrok
```powershell
# Terminal 1: Servidor Next.js
npm run dev

# Terminal 2: ngrok
ngrok http 3000
```

### 4. Copiar URL de ngrok
Verás algo como:
```
Forwarding    https://abc123.ngrok-free.app -> http://localhost:3000
```

Copia la URL HTTPS: `https://abc123.ngrok-free.app`

### 5. Configurar Clerk
1. Ve a https://dashboard.clerk.com/
2. Selecciona tu aplicación
3. Ve a **Configure** → **Domains**
4. Click en **"Add domain"**
5. Pega: `abc123.ngrok-free.app` (sin `https://`)
6. Click en **"Add domain"**

### 6. Actualizar .env.local
```env
NEXT_PUBLIC_BASE_URL=https://abc123.ngrok-free.app
```

### 7. Reiniciar servidor
```powershell
# Detén el servidor (Ctrl+C)
npm run dev
```

### 8. Probar desde móvil
1. Abre `https://abc123.ngrok-free.app` en tu celular
2. Click en "Visit Site" (aviso de ngrok)
3. Prueba el login ✅

---

## 📱 ¿Qué verás en el móvil?

### iPhone (Safari):
- ✅ Tarjetas de crédito/débito
- ✅ **Apple Pay** (si tienes tarjetas en Wallet)
- ✅ Stripe Link

### Android (Chrome):
- ✅ Tarjetas de crédito/débito
- ✅ **Google Pay** (si tienes Google Pay configurado)
- ✅ Stripe Link

---

## 🐛 Problemas Comunes

### ❌ Error 404 al hacer login
**Solución**: Verifica que agregaste el dominio en Clerk Dashboard

### ❌ "This site can't be reached"
**Solución**: Verifica que ngrok esté corriendo

### ❌ "Redirect URI mismatch"
**Solución**: 
1. Actualiza `NEXT_PUBLIC_BASE_URL` en `.env.local`
2. Reinicia el servidor Next.js

---

## ⚠️ IMPORTANTE

- **Cada vez que reinicies ngrok**, obtendrás una URL diferente
- Necesitarás actualizar:
  1. Dominio en Clerk Dashboard
  2. `NEXT_PUBLIC_BASE_URL` en `.env.local`
  3. Reiniciar servidor Next.js

---

## 🎯 Checklist

Antes de probar desde el móvil, verifica:

- [ ] ngrok instalado y autenticado
- [ ] ngrok corriendo (`ngrok http 3000`)
- [ ] Servidor Next.js corriendo (`npm run dev`)
- [ ] Dominio agregado en Clerk Dashboard
- [ ] `NEXT_PUBLIC_BASE_URL` actualizado
- [ ] Servidor reiniciado

---

## 📞 ¿Necesitas ayuda?

Lee la guía completa en: `CONFIGURAR_CLERK_MOBILE.md`
