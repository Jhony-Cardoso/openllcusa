# 🔧 Troubleshooting: Apple Pay y Google Pay no aparecen

## ✅ **Esto es NORMAL y ESPERADO**

Apple Pay y Google Pay **NO aparecen en todos los dispositivos/navegadores**. Stripe los muestra **automáticamente solo cuando están disponibles**.

---

## 🖥️ **¿Desde dónde estás probando?**

### **Escenario 1: Windows con Chrome/Edge/Firefox**
❌ **Apple Pay**: NO aparecerá (requiere dispositivo Apple)
❌ **Google Pay**: Puede aparecer si tienes Google Pay configurado en Chrome

**Qué verás:**
```
┌─────────────────────────────┐
│  💳 Pay with card           │
├─────────────────────────────┤
│  🔗 Pay with Link           │  (si ya usaste Link antes)
└─────────────────────────────┘
```

### **Escenario 2: Mac con Safari**
✅ **Apple Pay**: Aparecerá si tienes Apple Pay configurado
❌ **Google Pay**: NO aparecerá

**Qué verás:**
```
┌─────────────────────────────┐
│  🍎 Pay with Apple Pay      │  ← Solo si tienes Apple Pay
├─────────────────────────────┤
│  💳 Pay with card           │
└─────────────────────────────┘
```

### **Escenario 3: iPhone/iPad con Safari**
✅ **Apple Pay**: Aparecerá si tienes Apple Pay configurado
❌ **Google Pay**: NO aparecerá

### **Escenario 4: Android con Chrome**
❌ **Apple Pay**: NO aparecerá
✅ **Google Pay**: Aparecerá si tienes Google Pay configurado

---

## 🔍 **Diagnóstico Rápido**

### **Paso 1: Verifica tu dispositivo/navegador**

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Copiar y pegar en la consola del navegador
console.log('🖥️ Sistema:', navigator.platform);
console.log('🌐 Navegador:', navigator.userAgent);
console.log('📱 Es móvil:', /iPhone|iPad|Android/i.test(navigator.userAgent));
console.log('🍎 Es iOS:', /iPhone|iPad/i.test(navigator.userAgent));
console.log('🤖 Es Android:', /Android/i.test(navigator.userAgent));
```

### **Paso 2: Verifica la configuración de Stripe**

En la consola del navegador, cuando estés en la página de checkout:

```javascript
// Esto mostrará qué métodos de pago están disponibles
// (solo funciona después de que Stripe Checkout se cargue)
```

---

## ✅ **Cómo REALMENTE probar Apple Pay**

### **Opción 1: Usar un dispositivo Apple real**

1. **iPhone/iPad:**
   - Abre Safari (NO Chrome)
   - Ve a tu checkout: `http://TU-IP-LOCAL:3000/...`
   - Deberías ver el botón de Apple Pay

2. **Mac:**
   - Abre Safari (NO Chrome)
   - Ve a tu checkout
   - Deberías ver el botón de Apple Pay

### **Opción 2: Usar el simulador de iOS (solo Mac)**

```bash
# En Mac con Xcode instalado
open -a Simulator

# Luego:
# 1. Abre Safari en el simulador
# 2. Ve a Settings → Wallet & Apple Pay
# 3. Agrega una tarjeta de prueba
# 4. Navega a tu checkout
```

### **Opción 3: Usar ngrok para probar desde móvil**

```bash
# Instala ngrok
npm install -g ngrok

# Crea un túnel a tu servidor local
ngrok http 3000

# Ngrok te dará una URL pública como:
# https://abc123.ngrok.io

# Abre esa URL en tu iPhone/iPad
```

---

## ✅ **Cómo REALMENTE probar Google Pay**

### **Opción 1: Chrome en Desktop (Windows/Mac/Linux)**

1. Abre Chrome
2. Ve a `chrome://settings/payments`
3. Asegúrate de tener Google Pay habilitado
4. Agrega una tarjeta de pago
5. Ve a tu checkout

**Nota:** Google Pay en Desktop puede no aparecer en modo test de Stripe

### **Opción 2: Android con Chrome**

1. Configura Google Pay en tu dispositivo Android
2. Agrega una tarjeta
3. Abre Chrome
4. Ve a tu checkout (usa ngrok para acceder desde móvil)

---

## 🧪 **Verificación: ¿Está funcionando la configuración?**

### **Test 1: Verifica que el código esté correcto**

Ejecuta este comando para verificar tu configuración:

```bash
# Buscar la configuración de payment_method_types
grep -A 5 "payment_method_types" app/api/stripe/create-checkout-session/route.ts
```

Deberías ver:
```typescript
payment_method_types: [
    'card',
    'link',
],
```

### **Test 2: Verifica los logs de Stripe**

Cuando crees una sesión de checkout, verifica los logs:

```bash
# En tu terminal donde corre npm run dev
# Deberías ver algo como:
# 💰 [STRIPE] Creando sesión de checkout...
# 💰 [STRIPE] Line items: [...]
```

### **Test 3: Inspecciona la sesión en Stripe Dashboard**

1. Ve a https://dashboard.stripe.com/test/payments
2. Busca la sesión que acabas de crear
3. Haz clic en ella
4. Ve a la sección "Payment methods"
5. Deberías ver: "card, link" (y wallets si aplica)

---

## 🎯 **Solución: Forzar la aparición de wallets (solo para pruebas)**

Si quieres **forzar** que aparezcan los botones (aunque no funcionen realmente), puedes modificar temporalmente el código:

```typescript
// ⚠️ SOLO PARA PRUEBAS - NO USAR EN PRODUCCIÓN
payment_method_types: [
    'card',
    'link',
    'apple_pay',    // Forzar Apple Pay
    'google_pay',   // Forzar Google Pay
],
```

**PERO ESTO NO ES RECOMENDADO** porque:
- Los usuarios verán botones que no funcionarán
- Puede causar errores si el usuario no tiene el wallet configurado
- Stripe maneja esto automáticamente de forma inteligente

---

## 📊 **Tabla de Compatibilidad**

| Dispositivo/Navegador | Apple Pay | Google Pay | Card | Link |
|----------------------|-----------|------------|------|------|
| Windows + Chrome     | ❌        | ⚠️ Tal vez | ✅   | ✅   |
| Windows + Edge       | ❌        | ⚠️ Tal vez | ✅   | ✅   |
| Windows + Firefox    | ❌        | ❌         | ✅   | ✅   |
| Mac + Safari         | ✅        | ❌         | ✅   | ✅   |
| Mac + Chrome         | ❌        | ⚠️ Tal vez | ✅   | ✅   |
| iPhone + Safari      | ✅        | ❌         | ✅   | ✅   |
| iPhone + Chrome      | ✅        | ❌         | ✅   | ✅   |
| Android + Chrome     | ❌        | ✅         | ✅   | ✅   |
| Android + Firefox    | ❌        | ❌         | ✅   | ✅   |

---

## ✅ **Conclusión**

**Tu configuración está CORRECTA.** Apple Pay y Google Pay:

1. ✅ Están habilitados en tu código
2. ✅ Stripe los detectará automáticamente
3. ✅ Aparecerán cuando el usuario tenga el dispositivo/navegador correcto
4. ✅ Funcionarán en producción sin cambios

**No necesitas hacer nada más.** Simplemente:
- En Windows/Desktop: Verás solo tarjetas y Link
- En iPhone/Safari: Verás Apple Pay
- En Android/Chrome: Verás Google Pay

---

## 🚀 **Siguiente Paso**

Para probar realmente Apple Pay o Google Pay:

1. **Usa ngrok** para exponer tu servidor local
2. **Accede desde un dispositivo móvil** (iPhone o Android)
3. **Verifica que aparezcan** los botones correspondientes

¿Quieres que te ayude a configurar ngrok para probar desde móvil?
