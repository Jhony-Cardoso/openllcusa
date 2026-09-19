# Informe de auditoría — `knowledge/` (base de conocimiento de Zara)

> Fecha de la auditoría: **19 de septiembre de 2026**
> Alcance: la carpeta `knowledge/` del repo (309 ficheros) y su relación con el asistente de chat.
> Método: lectura del código de ingesta y del widget, comprobación HTTP real contra `openllcusa.com`,
> y fuente oficial citada en cada dato externo. Nada de este informe se basa en suposiciones sin cita.

---

## 1. Cómo llega el conocimiento al asistente (contexto imprescindible)

| Pieza | Qué hace |
|---|---|
| `scripts/ingest-knowledge.ts` | Recorre `knowledge/` **recursivamente** y sube **todos** los `.md` a la tabla `knowledge_base` de Supabase, troceando por `## `. |
| `app/api/chat/route.ts` | En cada respuesta consulta la tabla vía RPC `match_knowledge`. **No lee los `.md`.** |
| Consecuencia 1 | Editar un `.md` **no cambia** lo que responde Zara hasta que se re-ingesta. |
| Consecuencia 2 | "Lo que Zara sabe hoy" es lo ingerido en su día más los parches hechos directamente en la BD (p. ej. `scripts/fix-ein-time.mjs`, 11-ago-2026). |
| Consecuencia 3 | Este informe audita **los ficheros**, que son la fuente de verdad de la *próxima* ingesta. |

Composición: **309 ficheros** → 301 en `knowledge/custom/` (q01…q300 + `faq_impuestos.md`) y **8 en `knowledge/web/`**
(scrapes del sitio hechos el 9 y el 13 de agosto de 2026).

---

## 2. Enlaces que llevan a un 404 (verificado con `curl` contra producción)

| URL | Estado HTTP | Dónde se enlaza | Estado actual |
|---|---|---|---|
| `/servicios/boi-report` | **404** | `custom/faq_impuestos.md:16`, `q48-boi-report-fincen.md:34`, `q50-planes-open-llc-usa.md:21`, `q60-error-boi-report.md:29`, `q91-despues-de-registrar-llc.md:30` | **pendiente** (ver §6) |
| `/guias/us` | **404** (antes) | `web/inicio.md:182` | **RESUELTO**: se creó `app/guias/us/page.tsx` (19-09-2026) |
| `/Zara` | **404** | `web/recursos.md:25` | pendiente: la ruta viva es `/zara`; el scrape alteró el caso |

Variantes probadas para el BOI, todas 404: `/servicios/boi`, `/servicios/impuestos/boi-report`,
`/servicios/reporte-boi`, `/servicios/boi-report-fincen`, `/servicios/impuestos/boi`.

Enlaces comprobados que **sí** funcionan: `/servicios/form-5472-1120` → 308 → `/servicios/impuestos/declaracion-anual-llc` (200),
`/servicios/agente-registrado`, `/servicios/launch-banking`, `/servicios/impuestos/obtencion-ein`,
`/guias/{mx,co,es,ar,pe,py}`, `/blog/llc-usa-desde-argentina`, `/zara`, `/quiz`, `/lead-form`, `/precios`, `/contacto`.

---

## 3. Enlaces con ancla (`#seccion`) que no navegan desde el chat

**El problema:** el widget de chat vive en todas las páginas. Un enlace `[texto](#precios)` solo funciona si la
sección con ese `id` está en la página donde está el usuario; en el resto de páginas, el clic no hace nada.

**Dónde aparecen:** `web/inicio.md` (`#precios` ×4, `#comenzar`), `web/precios.md` (`#formar`, `#mantener`,
`#optimizar`, `#comparativa`) y `web/contacto.md` (`#top`, que además está muerto incluso en `/contacto`:
ver `app/contacto/page.tsx:284`).

**Resuelto sin complicaciones:** `components/chat/ChatWidget.tsx` incluye ahora `resolveChatHref()`, que convierte
cualquier ancla en ruta absoluta antes de renderizar el enlace (`#precios` → `/#precios`;
`#formar` → `/precios#formar`). El arreglo es inmediato y **no depende de re-ingestar**.
Queda como mejora opcional corregir los `.md` para que la próxima ingesta ya traiga rutas absolutas.

---

## 4. Ruido que ensucia las respuestas del RAG

- **17 enlaces `/_next/image?url=%2Fimages%2F…`** en los scrapes (`web/inicio.md`, `web/precios.md`). Si el modelo
  los copia, el usuario ve URLs ilegibles de optimizador de imágenes.
- **`knowledge/web/` duplica** contenido ya presente en `custom/` (precios, FAQ, contacto). Riesgo de que el
  retrieval devuelva el scrape antes que el fichero bueno.
- **Recomendación:** excluir `web/` de la ingesta (o regenerarlo limpio) cuando se re-ingeste.

---

## 5. Contenido verificado como correcto

- **Precios y planes del scrape, al día:** $349 / $499 / $849 y mantenimientos $49/mes (Compliance Básico) y
  $129/mes (Crecimiento). Sus checkout vivos: `/paquetes/starter|professional|compliance-basico|plan-crecimiento/onboarding` → 200.
- Rutas de servicios, guías, blog y páginas de conversión: 200 (lista en §2).
- Contradicción de plazos detectada: **corregida** en `q98` y `q100` (la LLC en 24-72 h; el EIN del IRS en
  2-4 semanas sin SSN por fax), coherente con `q04` y `q87`.

---

## 6. Hallazgo legal: el servicio BOI no tiene base para tus clientes

**Fuente oficial:** FinCEN — https://www.fincen.gov/boi (regla provisional de 26-mar-2025).
Texto oficial: *"All entities created in the United States — including those previously known as 'domestic reporting
companies' — and their beneficial owners are now exempt from the requirement to report beneficial ownership information"*.
Solo quedan obligadas las **empresas extranjeras** registradas para operar en EE.UU.

**Implicación:** los clientes de Open LLC USA constituyen LLC **estadounidenses** → están exentos. Vender el BOI como
obligatorio sería vender un servicio innecesario, y el knowledge lo está contando mal.

**Ficheros afectados (18):** `faq_impuestos.md` (lo ofrece por **$99** con enlace a la ruta 404),
`q48`, `q50`, `q55`, `q60`, `q78`, `q79`, `q85`, `q91`, `q94`, `q95`, `q150`, `q159`, `q166`, `q185`, `q209`, `q244`, `q280`.
Varios lo presentan como obligatorio desde 2024 y con multas de **$500/día**.

**Decisión pendiente del usuario.** Opciones: (a) no crear el servicio y corregir los 18 ficheros + publicar una
página de contenido informativa (recomendado); (b) mantener el servicio pero reformulado para empresas extranjeras.

---

## 7. Plazos oficiales de constitución de LLC por estado

Tasas estatales de constitución y plazos publicados por la propia administración. **Consulta: 19-09-2026.**
Verificación: Wyoming, Delaware y Florida comprobadas directamente en la fuente; Nuevo México según lo indicado.

| Estado | Tasa estatal | Plazo publicado | Online / expeditado |
|---|---|---|---|
| **Wyoming** | **$100** (+2,4 % de comisión si se paga con tarjeta) | **Inmediato** si se presenta online (la entidad queda activa al instante). Por correo: **máximo 15 días hábiles** | Online sí (WyoBiz). Expidetado **no aplica a la constitución** de la LLC |
| **Nuevo México** | **$50** (NMSA 1978 §53-19-63(A)) | **Sin plazo publicado**: la División de Business Services indica *1-2 días hábiles* en una ponencia, pero el SOS no lo publica como plazo garantizado | **Solo online** (no acepta papel). Sin expeditado publicado |
| **Delaware** | **$110** | **Sin plazo publicado**: *"varía según el volumen"* de expedientes recibidos (FAQ oficial) | No hay constitución online completa (solo envío electrónico). Expidetado: **+$50** (24 h), **+$100** (mismo día), **+$500** (2 h), **+$1.000** (1 h) |
| **Florida** | **$125** = $100 + $25 (designación de agente registrado) | **Sin plazo publicado**: procesa *"en el orden de recepción"*; publica la fecha en curso en *Document Processing Dates* | Online sí (Sunbiz). **Sin expeditado publicado** para la constitución |

**Fuentes:** Wyoming: FAQ del Secretary of State (`sos.wyo.gov/FAQS.aspx?root=BUS`) y *Business Division Filing Fee
Schedule* eff. 01-07-2026 (`sos.wyo.gov/Business/docs/BusinessFees.pdf`). Nuevo México: `sos.nm.gov/business-services/`
y NMSA 1978 §53-19-63 (`nmonesource.com`). Delaware: *Corporate Fee Schedule, Revised August 1, 2026*
(`corpfiles.delaware.gov/Fee_Schedule/AugustFee2026.pdf`) y FAQ de la Division of Corporations. Florida:
Fla. Stat. §605.0213 (flsenate.gov) y páginas oficiales de Sunbiz.

**Advertencias:**
1. **Delaware y Florida no publican plazo numérico**: cualquier "2-4 semanas" que circule es estimación de terceros.
   Si un cliente necesita fecha comprometida en Delaware, la única vía documentada es pagar expeditado.
2. **Florida bloquea el acceso automatizado** (Cloudflare 403): sus datos operativos se leyeron de copias archivadas
   de las propias páginas oficiales y las tasas se confirmaron contra el estatuto vigente.
3. Las tasas estatales cambian: Wyoming revisa su fee schedule en junio, Delaware en agosto. **Reverificar antes de publicar.**
4. No incluyen agente registrado, EIN, publicación ni los informes anuales posteriores
   (Wyoming $60/año mínimo; Delaware $300/año de franchise tax; Florida $138,75/año; Nuevo México sin reporte anual).

---

## 8. Recomendaciones priorizadas

1. **Decidir el BOI** (§6) y, si se opta por la opción recomendada, corregir los 18 ficheros antes de cualquier ingesta.
2. **Corregir los enlaces de los `.md`** antes de la próxima ingesta: `/servicios/boi-report` (5 ficheros) y `/Zara` (1).
   Sin re-ingesta no urgen, pero si algún día se ingesta, entran tal cual.
3. **Excluir o regenerar `knowledge/web/`**: duplica contenido y mete ruido (`_next/image`).
4. **Añadir las guías de país al sitemap**: hoy solo están `/guias` y `/guias/us` (§2).
5. **Unificar el email de contacto**: el footer ya usa `info@`; siguen con `hola@` el JSON-LD de la home
   (`app/page.tsx:1008`) y el pie de los emails transaccionales (`lib/services/email.service.ts:1042`).
6. **Re-ingesta programada** cada vez que se toquen precios, planes o plazos: es el único modo de que Zara lo sepa.
