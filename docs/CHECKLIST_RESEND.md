# ✅ Checklist de Configuración de Resend

## 📋 Pasos a Seguir

### ✅ Paso 1: Crear Cuenta en Resend
- [ ] Ir a [resend.com/signup](https://resend.com/signup)
- [ ] Registrarse con email o GitHub
- [ ] Verificar email de confirmación

### ✅ Paso 2: Obtener API Key
- [ ] Ir a **API Keys** en el menú lateral
- [ ] Hacer clic en **"Create API Key"**
- [ ] Nombrarla: `Open LLC USA - Production`
- [ ] Seleccionar permisos: **Full access**
- [ ] Copiar la API key (empieza con `re_...`)

### ✅ Paso 3: Configurar API Key en el Proyecto
- [ ] Abrir `.env.local`
- [ ] Reemplazar `re_TU_API_KEY_AQUI` con tu API key real
- [ ] Guardar el archivo
- [ ] Reiniciar el servidor: `npm run dev`

### ✅ Paso 4: Probar el Sistema
- [ ] Hacer una compra de prueba en Stripe
- [ ] Verificar que llegue el email de confirmación
- [ ] Revisar los logs del servidor para ver:
  ```
  📧 [WEBHOOK] Email de confirmación enviado a: usuario@email.com
  ```

---

## 🔧 Configuración Opcional (Dominio Personalizado)

### Paso 5: Configurar Dominio (Solo si quieres usar tu dominio)

#### 5.1. Agregar Dominio en Resend
- [ ] Ir a **Domains** en Resend
- [ ] Hacer clic en **"Add Domain"**
- [ ] Ingresar: `openllcusa.com` (o tu dominio)
- [ ] Hacer clic en **"Add"**

#### 5.2. Configurar DNS
Resend te mostrará 3 registros DNS. Agrégalos en tu proveedor de DNS:

**Registro 1: DKIM**
```
Tipo: TXT
Nombre: resend._domainkey
Valor: [el que te proporcione Resend]
```

**Registro 2: SPF**
```
Tipo: TXT
Nombre: @
Valor: v=spf1 include:_spf.resend.com ~all
```

**Registro 3: DMARC**
```
Tipo: TXT
Nombre: _dmarc
Valor: v=DMARC1; p=none; rua=mailto:dmarc@openllcusa.com
```

#### 5.3. Verificar Dominio
- [ ] Esperar 5-10 minutos después de agregar los registros
- [ ] En Resend, hacer clic en **"Verify"**
- [ ] Confirmar que aparece ✅ **"Verified"**

#### 5.4. Actualizar el Código
- [ ] Abrir `lib/services/email.service.ts`
- [ ] Cambiar `onboarding@resend.dev` por `noreply@openllcusa.com`
- [ ] Guardar y reiniciar el servidor

---

## 🧪 Cómo Probar

### Opción 1: Compra de Prueba en Stripe

1. Ir a tu aplicación
2. Seleccionar un servicio (ej: Obtención de EIN)
3. Completar el onboarding
4. Usar tarjeta de prueba de Stripe:
   ```
   Número: 4242 4242 4242 4242
   Fecha: Cualquier fecha futura
   CVC: Cualquier 3 dígitos
   ```
5. Completar el pago
6. Verificar que llegue el email

### Opción 2: Enviar Email de Prueba Manualmente

Puedes crear una ruta temporal para probar:

```typescript
// app/api/test-email/route.ts
import { EmailService } from '@/lib/services/email.service'
import { NextResponse } from 'next/server'

export async function GET() {
  const result = await EmailService.enviarBienvenida({
    to: 'tu-email@gmail.com', // Cambia por tu email
    nombreUsuario: 'Usuario de Prueba'
  })
  
  return NextResponse.json(result)
}
```

Luego visita: `http://localhost:3000/api/test-email`

---

## 📊 Estado Actual

| Componente | Estado | Notas |
|------------|--------|-------|
| Paquete Resend | ✅ Instalado | npm install resend |
| Variable de entorno | ⏳ Pendiente | Agregar API key real |
| Código actualizado | ✅ Listo | Usando dominio de prueba |
| Servicio de emails | ✅ Implementado | 2 tipos de emails |
| Integración webhook | ✅ Implementado | Envío automático |
| Dominio personalizado | ⏳ Opcional | Configurar DNS |

---

## 🎯 Próximos Pasos Inmediatos

1. **Ahora mismo:**
   - [ ] Ir a [resend.com/signup](https://resend.com/signup)
   - [ ] Crear cuenta
   - [ ] Obtener API key
   - [ ] Agregar a `.env.local`

2. **Después de configurar:**
   - [ ] Reiniciar servidor
   - [ ] Hacer compra de prueba
   - [ ] Verificar email

3. **Más adelante (opcional):**
   - [ ] Configurar dominio personalizado
   - [ ] Actualizar código con dominio real

---

## 🆘 Soporte

Si tienes problemas:

1. **Email no llega:**
   - Verifica que `RESEND_API_KEY` esté configurada
   - Revisa los logs del servidor
   - Verifica la consola de Resend: [resend.com/emails](https://resend.com/emails)

2. **Error de API:**
   - Verifica que la API key sea correcta
   - Asegúrate de que empiece con `re_`
   - Verifica que no tenga espacios extra

3. **Dominio no verifica:**
   - Espera más tiempo (puede tardar hasta 24 horas)
   - Verifica que los registros DNS estén correctos
   - Usa una herramienta como [mxtoolbox.com](https://mxtoolbox.com) para verificar

---

**Fecha:** 2026-01-29  
**Estado:** ⏳ Esperando configuración de API key
