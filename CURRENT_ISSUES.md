# CURRENT_ISSUES.md

**Fecha de última actualización:** 2026-06-02  
**Propósito:** Lista viva de errores y problemas para priorizar y atacar de forma ordenada.  
**Regla:** Reportar de forma concreta (pasos para reproducir, entorno: local/prod, servicio afectado). Yo (el agente) ayudo a organizar.

---

## 🔴 Critical Blockers (impiden avanzar en flujos principales)

### 1. Páginas de servicios 404 en desarrollo (y algunos en prod)
- **Descripción:** La mayoría de `/servicios/[slug]` y flujos de onboarding dan 404. Solo "Agente Registrado" funcionó parcialmente para crear un pedido.
- **Impacto:** Imposible crear pedidos para Tax Filing, EIN, Reporte Anual, etc. en local. En prod algunos servicios también fallan.
- **Entorno:** Local dev (principalmente) y prod parcial.
- **Reportado:** 2026-06-02
- **Notas:** Existe `docs/DIAGNOSTICO_SERVICIO_NO_ENCONTRADO.md` pero parece enfocado en mobile/middleware. Posible problema de rutas, redirects legacy, o middleware.
- **Próximo paso sugerido:** Diagnosticar rutas activas vs slugs en DB.

### 2. Errores en Onboarding (requerimientos que no corresponden al servicio)
- **Descripción:** En onboarding aparecen preguntas o pasos que no aplican al servicio contratado (ej. datos fiscales para servicios que no son tax).
- **Impacto:** Confusión del cliente, abandonos, datos incorrectos en pedidos.
- **Entorno:** Flujo de creación de pedidos.
- **Reportado:** 2026-06-02

### 3. "Pedido no encontrado" al acceder a detalles
- **Descripción:** Al intentar ver detalles de pedidos (dashboard o admin), a veces aparece error "pedido no encontrado".
- **Impacto:** Flujos rotos después de pago o en admin.
- **Entorno:** Local y prod.

---

## 🟠 Admin Panel & Visibility

### 4. Dashboards difíciles de entender
- **Descripción:** Tanto el dashboard del cliente como el panel de admin son confusos. No está claro el estado de un pedido, qué hacer a continuación, o qué significa cada paso.
- **Impacto:** Usuario (y admin) no saben en qué punto está el trámite.
- **Relacionado:** Trabajo reciente en Resumen Ejecutivo (esqueleto visual ya implementado en admin/pedidos/[id]).
- **Reportado:** 2026-06-02

### 5. Falta de visibilidad en estados de pedidos (para admin)
- **Descripción:** El admin necesita mejor "Resumen Ejecutivo" + alertas claras (documentos faltantes, tiempo en paso, próxima acción).
- **Estado actual:** Componente `ResumenEjecutivo` creado como esqueleto. Pendiente conectar lógica real (alertas, emails automáticos, etc.).
- **Reportado:** Durante trabajo de Jun 2026.

---

## 🟡 Otros problemas reportados (a categorizar)

- Lista de errores "interminable" acumulada durante meses.
- Posibles inconsistencias entre paquetes y servicios individuales (requerimientos, pasos, metadata).
- Problemas en flujos de pago (Stripe) y webhooks que afectan creación de pedidos.
- Confusión entre "lo que el cliente ve" vs "lo que el admin ve".

---

## 📋 Cómo reportar nuevos errores (template)

Cuando veas uno, dime algo como:

**Servicio:** [ej. obtencion-ein, reporte-anual, agente-registrado...]
**Entorno:** Local / Producción / Ambos
**URL exacta donde falla:** 
**Pasos para reproducir:**
1. ...
2. ...
**Qué pasa (actual):** ...
**Qué debería pasar:** ...
**Captura o mensaje de error (si hay):** ...
**Severidad:** Blocker / Alto / Medio / Bajo

Yo lo añadiré aquí organizado y propondré prioridad.

---

## 🎯 Próximos pasos sugeridos (priorización inicial)

1. **Estabilizar creación de pedidos** para los servicios principales (Tax Filing, EIN, Reporte Anual).
2. **Mejorar visibilidad en Admin** (terminar el Resumen Ejecutivo que ya empezamos).
3. **Limpiar onboarding** para que solo pida lo relevante por servicio.
4. Hacer un inventario completo de rutas 404 y slugs.

**¿Quieres que empecemos a rellenar más detalles de los que mencionaste, o prefieres reportar los siguientes errores que veas?**

También podemos decidir si atacamos primero los blockers de creación de pedidos o la mejora visible del admin (Resumen Ejecutivo).
