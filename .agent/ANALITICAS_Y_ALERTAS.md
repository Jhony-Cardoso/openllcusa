# 🎯 Analíticas y Alertas - Documentación

**Fecha de Implementación:** 14 de febrero de 2026  
**Versión:** 1.0  
**Estado:** ✅ Completado

---

## 📊 Analíticas de Ventas

### Ubicación
`/admin/analiticas`

### Funcionalidades Implementadas

#### 1. **Métricas Principales**
- 💰 **Ingresos Este Mes:** Total de ingresos del mes actual con % de crecimiento
- 📦 **Pedidos Este Mes:** Número de pedidos con % de crecimiento
- 📈 **Tasa de Conversión:** Porcentaje de pedidos pagados vs totales
- ⏱️ **Tiempo Promedio:** Días promedio de tramitación (desde creación hasta completado)

#### 2. **Gráfico de Tendencias**
- Visualización de los últimos 6 meses
- Barras de progreso mostrando ingresos por mes
- Número de pedidos por mes
- Comparación visual entre meses

#### 3. **Distribución de Pedidos**
- **Pendientes:** Pedidos sin pagar
- **Pagados:** Pedidos con pago confirmado
- **Tramitando:** Pedidos en proceso ante el IRS (paso 7-8)
- **Completados:** Pedidos finalizados (paso 9)

#### 4. **Tabla Comparativa**
- Comparación entre mes actual, mes anterior y total histórico
- Métricas: Pedidos, Pagados, Ingresos, Conversión
- Visualización clara de tendencias

#### 5. **Exportar Reporte** (Botón preparado)
- Funcionalidad lista para implementar exportación a PDF/Excel

---

## 🚨 Alertas Críticas

### Ubicación
`/admin/alertas`

### Sistema de Monitoreo Inteligente

#### Alertas Críticas (Acción Inmediata)

##### 1. **Onboarding Pendiente (+7 días)**
- **Qué detecta:** Clientes que pagaron hace más de 7 días pero no completaron el checklist legal
- **Por qué es crítico:** El cliente pagó pero está bloqueado, puede solicitar reembolso
- **Acción recomendada:** Contactar al cliente para ayudarle a completar el onboarding

##### 2. **Sin Tramitar (+3 días)**
- **Qué detecta:** SS-4 firmado hace más de 3 días pero no enviado al IRS
- **Por qué es crítico:** El cliente completó su parte, esperamos acción del admin
- **Acción recomendada:** Descargar SS-4 y enviar al IRS inmediatamente

##### 3. **Tramitación Lenta (+14 días)**
- **Qué detecta:** Pedidos en tramitación ante el IRS hace más de 14 días
- **Por qué es crítico:** El IRS normalmente responde en 7-10 días hábiles
- **Acción recomendada:** Verificar estado con el IRS, posible problema

#### Advertencias (Revisar Próximamente)

##### 4. **Pagos Pendientes (+30 días)**
- **Qué detecta:** Pedidos sin pago hace más de 30 días
- **Por qué es advertencia:** Probablemente abandonados, pero vale la pena un seguimiento
- **Acción recomendada:** Email de recordatorio o eliminar si no hay interés

##### 5. **Sin Actividad Reciente (+30 días)**
- **Qué detecta:** Pedidos sin actualizaciones en más de 30 días
- **Por qué es advertencia:** Pueden estar estancados sin razón aparente
- **Acción recomendada:** Revisar manualmente y actualizar estado

##### 6. **Documentos Faltantes**
- **Qué detecta:** Pedidos pagados sin documento de identidad cargado
- **Por qué es advertencia:** Necesario para completar el proceso
- **Acción recomendada:** Solicitar al cliente que suba su identificación

### Visualización

#### Resumen de Alertas
- **Total de Alertas:** Número total de problemas detectados
- **Críticas:** Requieren acción inmediata (rojo)
- **Advertencias:** Revisar próximamente (amarillo)
- **Al Día:** Pedidos sin problemas (verde)

#### Detalle de Cada Alerta
- Título y descripción del problema
- Número de pedidos afectados
- Lista de hasta 5 pedidos con:
  - Número de pedido
  - Servicio/Paquete
  - Días desde última actualización
  - Paso actual del proceso
  - Link directo al pedido

---

## 🎨 Diseño y UX

### Paleta de Colores

#### Analíticas
- **Azul:** Ingresos y métricas financieras
- **Esmeralda:** Pedidos y conversión
- **Púrpura:** Tasas y porcentajes
- **Ámbar:** Tiempo y duración

#### Alertas
- **Rojo:** Alertas críticas (acción inmediata)
- **Ámbar:** Advertencias (revisar próximamente)
- **Verde:** Todo al día (sin problemas)

### Componentes Reutilizables

#### MetricCard
```tsx
<MetricCard
  label="Ingresos Este Mes"
  value="$5,000"
  change={+15.5}
  icon={DollarSign}
  color="blue"
/>
```

#### EstadoBar
```tsx
<EstadoBar
  label="Completados"
  value={10}
  total={50}
  color="emerald"
/>
```

#### AlertSection
```tsx
<AlertSection
  title="Onboarding Pendiente"
  description="Clientes que pagaron pero no completaron el checklist"
  pedidos={[...]}
  icon={Clock}
  color="red"
/>
```

---

## 🔧 Implementación Técnica

### Archivos Creados

1. **`app/admin/analiticas/page.tsx`**
   - Página completa de analíticas
   - Cálculos de métricas en tiempo real
   - Gráficos y visualizaciones

2. **`app/admin/alertas/page.tsx`**
   - Sistema de monitoreo de alertas
   - Detección automática de problemas
   - Clasificación por criticidad

### Dependencias Utilizadas

- **Next.js 14:** Server Components para mejor rendimiento
- **Lucide React:** Iconos modernos y consistentes
- **Tailwind CSS:** Estilos responsivos y profesionales
- **Supabase:** Consultas a la base de datos

### Cálculos Implementados

#### Crecimiento Mensual
```typescript
const crecimiento = mesAnterior > 0
  ? ((mesActual - mesAnterior) / mesAnterior) * 100
  : 0
```

#### Tasa de Conversión
```typescript
const tasaConversion = totalPedidos > 0
  ? (pedidosPagados / totalPedidos) * 100
  : 0
```

#### Tiempo Promedio de Tramitación
```typescript
const tiempoPromedio = pedidosCompletados.map(p => {
  const inicio = new Date(p.created_at)
  const fin = new Date(p.updated_at)
  return (fin - inicio) / (1000 * 60 * 60 * 24) // días
}).reduce((a, b) => a + b, 0) / pedidosCompletados.length
```

---

## 📈 Métricas Clave

### KPIs Monitoreados

1. **Ingresos Mensuales:** Suma de `total_pagado` de pedidos pagados
2. **Tasa de Conversión:** % de pedidos que pasan de borrador a pagado
3. **Tiempo de Tramitación:** Días desde creación hasta completado
4. **Pedidos Estancados:** Pedidos sin actividad en X días
5. **Satisfacción del Cliente:** (Futuro) Basado en tiempo de respuesta

### Umbrales de Alerta

| Métrica | Advertencia | Crítico |
|---------|-------------|---------|
| Onboarding Pendiente | - | +7 días |
| Sin Tramitar | - | +3 días |
| Tramitación Lenta | - | +14 días |
| Pagos Pendientes | +30 días | - |
| Sin Actividad | +30 días | - |
| Documentos Faltantes | Cualquier caso | - |

---

## 🚀 Próximas Mejoras

### Analíticas

1. **Exportación de Reportes**
   - PDF con gráficos
   - Excel con datos detallados
   - Programación de reportes automáticos

2. **Gráficos Interactivos**
   - Biblioteca de gráficos (Chart.js, Recharts)
   - Zoom y filtrado
   - Comparación de períodos personalizados

3. **Predicciones**
   - Proyección de ingresos
   - Tendencias de crecimiento
   - Análisis de estacionalidad

4. **Segmentación**
   - Por estado USA
   - Por tipo de servicio
   - Por fuente de adquisición

### Alertas

1. **Notificaciones Automáticas**
   - Email cuando aparece alerta crítica
   - Slack/Discord integration
   - Push notifications

2. **Acciones Rápidas**
   - Botón "Contactar Cliente" desde la alerta
   - "Marcar como Revisado"
   - "Posponer Alerta"

3. **Historial de Alertas**
   - Registro de todas las alertas generadas
   - Tiempo de resolución
   - Análisis de patrones

4. **Alertas Personalizadas**
   - Configurar umbrales personalizados
   - Crear reglas de alerta propias
   - Desactivar alertas específicas

---

## 📞 Uso Recomendado

### Rutina Diaria del Admin

#### Mañana (9:00 AM)
1. Revisar **Alertas Críticas**
2. Atender pedidos con onboarding pendiente
3. Descargar y enviar SS-4 al IRS

#### Mediodía (12:00 PM)
4. Verificar estado de tramitaciones lentas
5. Actualizar estados de pedidos

#### Tarde (5:00 PM)
6. Revisar **Analíticas** del día
7. Planificar acciones para mañana

#### Semanal (Viernes)
8. Exportar reporte semanal
9. Analizar tendencias
10. Ajustar estrategias

---

## ✅ Checklist de Verificación

### Analíticas
- [ ] Las métricas se calculan correctamente
- [ ] Los gráficos muestran datos reales
- [ ] La comparación mensual funciona
- [ ] El botón de exportar está visible (funcionalidad pendiente)

### Alertas
- [ ] Se detectan onboardings pendientes
- [ ] Se detectan SS-4 sin tramitar
- [ ] Se detectan tramitaciones lentas
- [ ] Los links a pedidos funcionan
- [ ] Los colores indican correctamente la criticidad

---

## 🎉 Resultado

Ahora tienes un **sistema completo de Business Intelligence** que te permite:

✅ **Monitorear el negocio en tiempo real**  
✅ **Detectar problemas antes de que escalen**  
✅ **Tomar decisiones basadas en datos**  
✅ **Optimizar el flujo de trabajo**  
✅ **Mejorar la satisfacción del cliente**

---

**Implementado por:** Antigravity AI  
**Fecha:** 14 de febrero de 2026  
**Versión:** 1.0
