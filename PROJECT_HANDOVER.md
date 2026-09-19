# PROJECT HANDOVER — Next.js · Open LLC USA

> **Análisis actualizado el 19 de septiembre de 2026.** (Versión anterior: 26-jul-2026.)
> Enfoque CRO + SEO. Leyenda: ✅ verificado contra el código, git o HTTP real contra `openllcusa.com`;
> ⚠️ pendiente o no verificado en esta pasada. La versión anterior de este documento describía problemas
> que ya estaban resueltos en el código; aquí solo figura lo comprobado.

---

## 0. Documentos relacionados (lectura obligatoria antes de trabajar)

- `AGENTS.md` — reglas operativas, prioridades, comandos y convenciones del repo.
- `docs/INFORME_KNOWLEDGE.md` — auditoría de `knowledge/` (base de conocimiento del asistente Zara):
  enlaces rotos, hallazgo legal sobre el BOI y plazos oficiales de registro por estado.

---

## 1. Arquitectura y stack ✅

- **Router:** App Router (Next.js 16.3.4, React 19.2.8, TypeScript 5, Turbopack). Todo vive en `app/`; no hay `pages/`.
- **Estilos:** Tailwind 3.4 + `@tailwindcss/typography`; CSS globales (`globals.css`, `header.css`, `homepage-v4.css`) y CSS Modules puntuales.
- **Datos:** Supabase (PostgreSQL). Tablas relevantes: `servicios`, `paquetes`, `pedidos`, `pedido_servicios`, `estados_usa`, `knowledge_base`, `facturas`.
- **Auth:** Clerk (`@clerk/nextjs`, localización `esES`). El middleware protege `/dashboard(.*)` y el onboarding de servicios fiscales.
- **Pagos:** Stripe (checkout de paquetes, de servicios individuales, de tax filing y suscripciones). Los servicios individuales se cobran por `precio` de la tabla `servicios` (no requieren `stripe_price_id`).
- **Email:** Resend. **Blog:** markdown local (`lib/blog/posts.ts`, 5 posts). **Analytics:** GA4 (`@next/third-parties`) + Clarity en lazy.
- **PDF fiscales:** `pdf-lib`, `pdfjs-dist`, `pdf-parse` (formularios SS-4, 5472, 1120).
- **Despliegue:** Docker con `output: standalone` en Dokploy. Producción: `https://openllcusa.com`.

---

## 2. Estado actual del desarrollo ✅

Funciona en producción: homepage (9 secciones), auth, checkout Stripe (4 flujos), onboarding multi-paso,
dashboard de usuario, panel de administración, blog, calculadora fiscal, quiz, guías por país, lead-form,
servicios fiscales (declaración anual, EIN), `sitemap.ts`, `robots.ts`, JSON-LD, **asistente de chat "Zara"**
con RAG sobre `knowledge_base`, banner de cookies, páginas legales, redirecciones 301 de URLs legacy,
CORS en `/api/*`, generación de PDFs del IRS y emails transaccionales.

Componentes de referencia: `components/home/*` (secciones de la home), `components/layout/Header.tsx`,
`components/layout/Footer.tsx`, `components/chat/ChatWidget.tsx`, `components/dashboard/OnboardingWizard.tsx`.

---

## 3. SEO

### ✅ Resuelto (con evidencia)

1. **La homepage ya no es client-only.** `app/page.tsx` **no** tiene `'use client'`, exporta `Metadata` y compone
   la página con Server Components (1179 líneas). El problema crítico nº1 del análisis anterior está cerrado.
2. **`canonical` presente en 29 ficheros**, incluidos la home, `/precios`, `/calculadora-fiscal`,
   `/contacto` (`layout.tsx`), `/quiz` (`layout.tsx`), `/lead-form` (`layout.tsx`), `/blog/[slug]`,
   `/servicios/[slug]`, `/guias/[country]` y las 10 landings SEO y por estado.
3. **Precios unificados:** home $349/$499/$849 = `/precios` (líneas 234/290/330) = JSON-LD de `/precios` (líneas 69-71).
4. **Una sola sección de precios** en la home (líneas 1064-1171), con CTAs correctos a
   `/paquetes/{starter|professional|business}/onboarding` (1091/1114/1137). Ya no hay secciones duplicadas.
5. **`/guias/us` creada** (antes 404): `app/guias/us/page.tsx`, con metadata completa, JSON-LD
   (BreadcrumbList + FAQPage) y tabla de plazos oficiales por estado. Añadida al sitemap.
6. **Código muerto eliminado:** `components/FloatingButtons.tsx` (no se renderizaba desde abril de 2026).

### ⚠️ Pendiente

1. **Las guías por país no están en el sitemap:** `app/sitemap.ts` incluye `/guias` y `/guias/us`, pero ninguna
   `/guias/<pais>`, aunque existen 20+ rutas generadas.
2. **Sin `canonical` en 6 páginas públicas:** `/agendar`, `/blog`, `/faq-calculadora`, `/guia`, `/guia/[slug]` y `/legal/*`.
   (Las de `admin/`, `dashboard/` y onboarding no cuentan: están bloqueadas en `robots.ts`.)
3. **`GA_ID` de relleno:** `components/shared/CookiesBanner.tsx:43` usa `'G-XXXXXXXXXX'` y ese banner sí se monta
   (`app/layout.tsx:138`). Sin el ID real, la medición de CRO queda coja.
4. **Dos emails de contacto:** `info@openllcusa.com` (footer, `/contacto`, sector legal) y `hola@openllcusa.com`
   (JSON-LD de la home, `app/page.tsx:1008`, y pie de todos los emails, `lib/services/email.service.ts:1042`).
5. **`/servicios/boi-report` responde 404** y el knowledge lo enlaza 5 veces (ver informe: además el servicio
   carece de base legal para clientes que crean LLCs estadounidenses).
6. **`next-sitemap.config.js` es inerte:** ningún script de `package.json` lo ejecuta. El sitemap real es `app/sitemap.ts`.

---

## 4. CRO

### ✅ Resuelto

1. **CTAs de precios correctos.** El fallo anterior (`href="#asesoria"`, un ancla inexistente) ya no existe en el repo.
2. **"Iniciar mi LLC ahora"** (sección de proceso) apunta a `#precios`; antes iba a `#comenzar`, obligando a un salto intermedio.
3. **WhatsApp del footer operativo** con número provisional `+34 699087039` (pendiente el definitivo).
4. **CTA "Agendar mi consulta gratuita" de `/contacto`**: lleva al widget de Calendly y este se ve completo
   (dinámico: id `#agendar`, altura responsive mediante `--calendly-h` en `globals.css`).
5. **Enlaces del chat:** los enlaces con ancla que generaba el RAG ya navegan desde cualquier página
   (`resolveChatHref()` en `ChatWidget.tsx`).

### ⚠️ Pendiente

1. **Ancla muerta en `/contacto`:** `app/contacto/page.tsx:284` usa `href="#top"` y no existe `id="top"`.
2. **Wallets cripto de relleno en el checkout:**
   `app/paquetes/[paqueteSlug]/onboarding/checkout/page.tsx:405, 412 y 419` muestran `TU_BILLETERA_USDT_AQUI`,
   `TU_BILLETERA_USDC_AQUI` y `TU_BILLETERA_BTC_AQUI`. Si el pago con cripto está activo, es dinero.
3. **Sin tests automatizados:** toda verificación es manual (`npm run build` + `npm run dev` + navegador).

---

## 5. Próximas tareas recomendadas (por impacto)

1. **Decisión sobre el BOI** y, si se aplica, corrección de los 18 ficheros de `knowledge/` (riesgo legal y de credibilidad).
2. **`GA_ID` real** en `CookiesBanner.tsx` para poder medir conversión.
3. **Wallets del checkout** si el pago cripto está operativo.
4. **Ancla `#top`** de `/contacto` (arreglo de una línea).
5. **SEO de rutas existentes:** guías de país al sitemap y `canonical` en las 6 páginas públicas listadas.
6. **Unificar el email** de contacto en JSON-LD y emails transaccionales.
7. **Limpieza de deuda:** 7 ficheros `.back*` en `lib/models/` (`pedido.ts.back3…back9`), `_RESPALDO_SERICIOS/`
   —ojo, la carpeta se llama `_RESPALDO_SERVICIOS`—, `Temp/full_history.txt` y entradas antiguas de
   `chat_history.md` con codificación rota (mojibake).

---

## 6. Reglas operativas

- `npm run dev` — desarrollo (local, 16 GB RAM). Variantes: `dev:safe`, `dev:notrace`.
- `npm run build` — build de producción (standalone, usa `--webpack`).
- `npm run lint` — **roto**. Alternativa: `npx eslint . --ext .ts,.tsx,.js,.mjs`.
- `npx tsc --noEmit` — typecheck (arrastra errores previos; `typescript.ignoreBuildErrors: true` en build).
- Reset limpio tras tocar middleware, `.env.local` o Clerk: borrar `.next/` y `npm run dev`.
- Stripe local: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
- Sub-proyecto: `cd stripe-demo && npm install && npm run dev`.
- Base de conocimiento: tras editar `knowledge/*.md`, hay que ejecutar `npx tsx scripts/ingest-knowledge.ts`
  (`npm run ingest`) o Zara no se entera.
- Tras cualquier cambio no trivial: `npm run build`, `npm run dev`, y probar el flujo afectado en el navegador.

## 7. Infraestructura y quirks (de `AGENTS.md`)

- Dev local (16 GB): `NODE_OPTIONS=--max-old-space-size=4096` / 8192 según script.
- VPS Dokploy (4 GB): `--max-old-space-size=768` en `Dockerfile`, `NEXT_TELEMETRY_DISABLED=1`,
  caché de Webpack desactivada, `webpackBuildWorker: false`, `cpus: 1`, linting ignorado en build.
- Este PC ya ha sufrido OOM con builds e ingestas: no lanzar build e ingesta a la vez.
- `.env` y `.env.local` contienen secretos: nunca volcarlos en conversaciones ni en documentación.
