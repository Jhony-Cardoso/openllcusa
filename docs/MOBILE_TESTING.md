# 📱 Configuración de Pruebas Móviles con ngrok

Este documento explica cómo configurar tu aplicación para pruebas móviles usando ngrok y Clerk.

## 🎯 Problema que resuelve

Cuando intentas acceder a tu aplicación desde un dispositivo móvil mientras desarrollas en `localhost`, Clerk devuelve un error 404 porque:
1. El móvil no puede acceder a `localhost:3000` (es local a tu computadora)
2. Clerk no reconoce la URL de ngrok en sus dominios permitidos

## ✅ Solución Automática

Hemos creado scripts que automatizan todo el proceso:

### Paso 1: Instalar ngrok (solo la primera vez)

Si aún no tienes ngrok instalado:

```bash
# Opción 1: Con Chocolatey (recomendado en Windows)
choco install ngrok

# Opción 2: Descargar manualmente desde https://ngrok.com/download
```

### Paso 2: Iniciar ngrok

Abre una terminal y ejecuta:

```bash
ngrok http 3000
```

Deja esta terminal abierta. Verás algo como:

```
Forwarding  https://abc123.ngrok-free.dev -> http://localhost:3000
```

### Paso 3: Actualizar Clerk automáticamente

En otra terminal, ejecuta:

```powershell
.\scripts\update-clerk-ngrok.ps1
```

Este script:
- ✅ Obtiene la URL pública de ngrok
- ✅ Actualiza `.env.local` con la nueva URL
- ✅ Actualiza Clerk para permitir la URL de ngrok
- ✅ Te muestra la URL para usar en tu móvil

### Paso 4: Reiniciar el servidor de desarrollo

```bash
npm run dev
```

### Paso 5: Probar en tu móvil

Abre el navegador de tu móvil y accede a la URL que te mostró el script (algo como `https://abc123.ngrok-free.dev`).

## 🔧 Solución Manual (si la automática falla)

Si el script automático no funciona, puedes actualizar Clerk manualmente:

1. Ve a [Clerk Dashboard](https://dashboard.clerk.com)
2. Selecciona tu aplicación: **sterling-cicada-66**
3. Ve a **Configure → Domains**
4. En **Allowed origins**, agrega tu URL de ngrok (ej: `https://abc123.ngrok-free.dev`)
5. Guarda los cambios

## 📝 Notas Importantes

### URL de ngrok cambia cada vez

Cada vez que reinicias ngrok, obtienes una nueva URL. Por eso necesitas:
1. Ejecutar `.\scripts\update-clerk-ngrok.ps1` cada vez que reinicias ngrok
2. Reiniciar tu servidor de desarrollo (`npm run dev`)

### Versión gratuita de ngrok

Con la versión gratuita de ngrok:
- ✅ La URL cambia cada vez que reinicias
- ✅ Funciona perfectamente para desarrollo
- ⚠️ Verás una pantalla de advertencia la primera vez que accedes (solo haz clic en "Visit Site")

### Versión de pago de ngrok (opcional)

Si quieres una URL fija que no cambie:
1. Crea una cuenta en [ngrok.com](https://ngrok.com)
2. Obtén tu authtoken
3. Configura un dominio estático
4. Usa `ngrok http 3000 --domain=tu-dominio.ngrok-free.app`

## 🐛 Solución de Problemas

### Error: "ngrok no está corriendo"

**Solución**: Asegúrate de que ngrok está corriendo en otra terminal:
```bash
ngrok http 3000
```

### Error 404 al intentar login desde móvil

**Causa**: Clerk no tiene la URL de ngrok en allowed_origins

**Solución**:
1. Ejecuta `.\scripts\update-clerk-ngrok.ps1`
2. O actualiza manualmente en Clerk Dashboard

### El email no se auto-rellena

**Solución**: Asegúrate de que:
1. El usuario está autenticado con Clerk
2. El usuario tiene un email en su cuenta de Clerk
3. Has reiniciado el servidor después de los cambios

## 🔄 Flujo de Trabajo Típico

```bash
# Terminal 1: Iniciar ngrok
ngrok http 3000

# Terminal 2: Actualizar Clerk
.\scripts\update-clerk-ngrok.ps1

# Terminal 3: Iniciar servidor de desarrollo
npm run dev

# Móvil: Acceder a la URL de ngrok
# https://abc123.ngrok-free.dev
```

## 📚 Recursos Adicionales

- [Documentación de ngrok](https://ngrok.com/docs)
- [Documentación de Clerk](https://clerk.com/docs)
- [Clerk Allowed Origins](https://clerk.com/docs/deployments/overview#allowed-origins)
