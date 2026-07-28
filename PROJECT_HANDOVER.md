# PROJECT HANDOVER — Next.js · Open LLC USA

> Análisis exhaustivo del proyecto con enfoque en **CRO** y **SEO**.
> Fecha del análisis: 26 de julio de 2026.

---

## 1. Arquitectura y Stack

### Router utilizado
- **App Router** (Next.js 16, React 19, Turbopack habilitado).
- Todas las rutas viven en `app/`. No hay `pages/`.

### Estilos
- **Tailwind CSS 3.4** + `@tailwindcss/typography`.
- CSS global en `app/globals.css`, `app/header.css`, `app/homepage.css`, `app/homepage-v4.css`.
- CSS Modules ocasionales (`faq.module.css`, `quiz.module.css`, `lead-form.module.css`, `page.module.css` en calculadora).
- Design tokens inline en la homepage (`const T = { ... }`), definidos como constantes JS con colores y sombras.
- Config de Tailwind muy básica (solo `background`/`foreground` como variables CSS).

### Gestión de datos / estado
| Capa | Tecnología |
|---|---|
| DB | **Supabase** (PostgreSQL cloud) |
| Auth | **Clerk** (`@clerk/nextjs`, localización `esES`) |
| Pagos | **Stripe** (checkout, webhooks, suscripciones) |
| Email transaccional | **Resend** |
| Estado client-side | React `useState`/`useEffect` (sin stores globales) |
| Fetching server | Supabase admin client directo en RSC |
| Fetching client | `fetch` a `app/api/*` route handlers |
| Blog | MDX/Markdown local en `content/` (leído con `lib/blog/posts.ts`) |
| Analytics | Google Analytics 4 (`@next/third-parties`), Microsoft Clarity (lazy) |
| PDF generation | `pdf-lib`, `pdfjs-dist` |

### Dependencias clave
- `next@^16.2.2`, `react@^19.2.4`
- `@clerk/nextjs@^6.39.1`, `@clerk/localizations`
- `@supabase/supabase-js@^2.87.1`, `@supabase/ssr@^0.8.0`
- `stripe@^20.2.0`, `@stripe/stripe-js@^8.6.4`
- `resend@^6.9.1`
- `next-sitemap@^4.2.3`, `next-mdx-remote@^6.0.0`
- `react-calendly`, `react-country-flag`, `lucide-react`
- `svix` (webhooks Clerk)
- `pdf-lib`, `pdf-parse`, `pdfjs-dist` (generación/lectura de formularios IRS)

### Infraestructura
- Docker (Dockerfile con `output: standalone`) desplegado en **Dokploy**.
- `typescript.ignoreBuildErrors: true` (builds aunque haya errores TS).
- Sitio en producción: **https://openllcusa.com**.

---

## 2. Estado actual del desarrollo

### Qué funciona actualmente
- **Homepage completa** con secciones: Hero, Trust Bar (logos), Beneficios, Servicios, Proceso (3 pasos), Cobertura Latam, Testimonios, Precios (3 planes), Garantía, Formulario de contacto rápido, CTA final, Mobile Sticky CTA.
- **Auth** (sign-in, sign-up, dashboard protegido) vía Clerk con localización en español.
- **Checkout/pago** con Stripe (paquetes starter/professional/business, servicios individuales).
- **Onboarding multi-paso** para cada paquete/servicio.
- **Dashboard de usuario** (pedidos, documentos, facturación, suscripciones, perfil, notificaciones).
- **Panel de administración** (pedidos, clientes, leads, alertas, analíticas, documentos).
- **Blog** con contenido Markdown local y renderizado con `react-markdown`.
- **Calculadora fiscal** interactiva (compara Autónomo vs SL vs LLC USA).
- **Quiz** "¿Es una LLC para ti?" con resultados personalizados.
- **Guías por país** dinámicas (`/guias/[country]`), con generación estática.
- **Formulario de leads** (`/lead-form`) con tracking GA4.
- **Páginas de servicios dinámicas** (`/servicios/[slug]`) con datos de Supabase.
- **Servicios fiscales**: declaración anual LLC, obtención EIN.
- **Sitemap.ts** dinámico (estáticas + servicios + blog).
- **robots.ts** con bloqueo de rutas internas.
- **Structured data** (JSON-LD) en homepage.
- **Botones flotantes**: WhatsApp y "Carla" (asistente virtual placeholder).
- **Cookies banner**, páginas legales (privacidad, condiciones, changelog).
- **Redirecciones 301** para URLs legacy de servicios.
- **CORS headers** en todas las API routes.
- **Generación PDF** para formularios IRS (SS4, 5472, 1120).
- **Emails transaccionales** vía Resend.

### Componentes y páginas principales

| Ruta / Componente | Propósito |
|---|---|
| `app/page.tsx` | Homepage (1536 líneas, `'use client'`, todo en un archivo) |
| `app/precios/page.tsx` | Página de precios detallada con JSON-LD |
| `app/servicios/page.tsx` | Listado de servicios individuales |
| `app/servicios/[slug]/page.tsx` | Página dinámica de servicio (RSC + `generateMetadata`) |
| `app/calculadora-fiscal/` | Calculadora fiscal interactiva con layout con metadata |
| `app/quiz/page.tsx` | Quiz interactivo de 8 preguntas |
| `app/lead-form/page.tsx` | Formulario de captura de leads (2 pasos) |
| `app/blog/` + `app/blog/[slug]/` | Blog con Markdown y `generateMetadata` |
| `app/guias/[country]/` | Guías por país con `generateMetadata` |
| `app/contacto/page.tsx` | Contacto con Calendly integrado |
| `app/faq/page.tsx` | FAQ con CSS Module |
| `app/dashboard/` | Panel de usuario (pedidos, docs, perfil, facturación) |
| `app/admin/` | Panel de administración |
| `app/checkout/` | Checkout vacío (lógica en onboarding/Stripe) |
| `components/layout/Header.tsx` | Header con mega-menú, Carla modal, auth buttons |
| `components/layout/Footer.tsx` | Footer con enlaces y columnas |
| `components/FloatingButtons.tsx` | WhatsApp + Carla (placeholder) |
| `lib/jsonld-schema.ts` | Structured data centralizado |
| `lib/analytics.ts` | Tracking GA4 custom |

---

## 3. SEO — Estado actual y oportunidades

### ✅ Qué está bien implementado
1. **Metadata global** con `title template`, `description`, `keywords`, `openGraph`, `robots` en el root `layout.tsx`.
2. **`metadataBase`** configurada correctamente.
3. **Open Graph** con imagen en la homepage, locale `es_ES`.
4. **`sitemap.ts`** dinámico que incluye páginas estáticas, servicios (Supabase) y posts del blog.
5. **`robots.ts`** que bloquea `/dashboard/`, `/api/`, `/sign-in/`, `/sign-up/`, onboarding y checkout.
6. **Redirecciones 301** para URLs legacy de servicios.
7. **JSON-LD** con schema de Organization, WebSite, Service, BreadcrumbList, AggregateRating, FAQPage.
8. **`generateMetadata`** dinámico en: servicios (`[slug]`), blog (`[slug]`), guías (`[country]`).
9. **Metadata estática** en: precios (con canonical + OG + Twitter), calculadora (con canonical + OG + Twitter + keywords), recursos, FAQ, legal.
10. **`generateStaticParams`** en blog y guías para SSG.
11. **Blog con contenido de calidad** orientado a keywords de LLC.
12. **Guías por país** que generan landing pages SEO para cada mercado.
13. **`lang="es"`** en el tag `<html>`.
14. **Imagen hero con alt text descriptivo**.
15. **Jerarquía de headings** generalmente correcta en la homepage (H1 → H2 → H3).

### ❌ Problemas y oportunidades de mejora

#### CRÍTICOS (impacto alto)
1. **Homepage entera es `'use client'`**: El archivo `app/page.tsx` completo es un Client Component. Esto significa que **NO se renderiza en el servidor como HTML estático**. Los bots de Google recibirán un bundle JS vacío hasta que se hidrate. El `export const metadata` de la homepage en `layout.tsx` se aplica, pero todo el contenido (H1, textos, CTAs, testimonios, precios, structured data) se genera solo en el cliente. Esto es **devastador para SEO**.
   - El JSON-LD inline en la homepage se inyecta vía `dangerouslySetInnerHTML` dentro de un componente client — puede no ser indexado.
   - Los textos de la homepage (1536 líneas de contenido valioso) no están disponibles para crawlers que no ejecuten JS.

2. **Múltiples `id` duplicados de Organization en JSON-LD** (`#organization` aparece 2 veces con propiedades distintas). Google puede ignorar datos duplicados/conflictivos.

3. **Teléfono placeholder** en JSON-LD (`+1-234-567-890` y `+34-XXX-XXX-XXX`). Google puede penalizar por datos falsos.

4. **Falta canonical URL** en la mayoría de páginas: solo la tiene `/precios`, `/calculadora-fiscal` y `/recursos`. Faltan en: homepage, servicios, blog, guías, FAQ, contacto, quiz, lead-form.

5. **Página de contacto sin metadata** (`'use client'` sin `export const metadata`).

6. **Página de servicios (`/servicios/page.tsx`) sin metadata** — es un `'use client'` sin metadata export.

7. **Quiz (`/quiz/page.tsx`) sin metadata** — sin título ni descripción.

8. **Lead-form sin metadata** — sin título ni descripción.

9. **Varias páginas de servicio individuales** (agente-registrado, launch-banking, etc.) pueden no existir como rutas estáticas (dependen de datos en Supabase).

#### IMPORTANTES (impacto medio)
10. **No hay `<link rel="alternate" hreflang="...">` para internacionalización**: El sitio está en español pero compite por keywords en un mercado global.

11. **`next-sitemap.config.js` coexiste con `app/sitemap.ts`** — redundancia que puede causar confusión. Solo uno debería generar el sitemap.

12. **Blog posts sin canonical** ni `article:published_time` en metadata.

13. **Guías por país sin OG image** ni Twitter card.

14. **No hay página 404 personalizada** (`app/not-found.tsx`).

15. **Imágenes sin dimensiones específicas** en algunos componentes (aunque Next.js Image lo maneja).

16. **Pricing en la homepage discrepa con la página `/precios`**: homepage muestra $349/$499/$849, `/precios` muestra $597/$897/$1397. Confusión potencial.

#### DESEABLES (impacto bajo)
17. **No hay `manifest.json`/`webmanifest`** para PWA/AMP.
18. **No hay breadcrumbs visibles** en páginas internas (solo en JSON-LD).
19. **Tailwind config muy básica** — no aprovecha custom utilities para velocidad de desarrollo.
20. **Archivos `.bak` y `.back` en producción** pueden servir contenido duplicado si no están en gitignore.

---

## 4. CRO — Estado actual y oportunidades

### ✅ Puntos de conversión actuales
1. **Hero CTA** ("Ver planes desde $349") — botón naranja grande con sombra, bien posicionado.
2. **Sección de precios** con 3 planes (Starter/Professional/Business), plan medio destacado con badge "MÁS POPULAR".
3. **CTA en sección de proceso** ("Iniciar mi LLC ahora").
4. **Formulario de contacto rápido** (nombre, email, país) — 3 campos, baja fricción.
5. **CTA final** ("Crear mi LLC ahora") — sección full-width con fondo oscuro.
6. **Mobile Sticky CTA** — barra fija en móvil que aparece al hacer scroll.
7. **Trust bar** con 6 indicadores de confianza + logos de partners en carrusel.
8. **Sección de garantía** con sello visual grande.
9. **Testimonios** (6 testimonios con foto, nombre, país y resultado cuantificado).
10. **Botón WhatsApp flotante** (siempre visible).
11. **Quiz interactivo** como herramienta de cualificación y lead generation.
12. **Calculadora fiscal** como herramienta de valor y captura.
13. **Formulario de leads** (`/lead-form`) con 2 pasos + tracking GA4.
14. **Calendly** integrado en la página de contacto.
15. **Analytics tracking** en todos los CTAs principales.

### ❌ Fricciones detectadas

#### CRÍTICAS (pierden ventas)
1. **CTAs de precios en homepage apuntan a `#asesoria` que no existe**: Los botones "Elegir Starter", "Elegir Professional", "Elegir Business" en la primera sección de precios (líneas ~908-968) apuntan a `href="#asesoria"` — un anchor que **no existe** en la página. El usuario hace clic y no pasa nada. **Esto destruye conversiones directamente.**
   - La SEGUNDA sección de precios (líneas ~1459-1519) sí apunta a `/paquetes/[plan]/onboarding` correctamente, pero hay **dos secciones de precios duplicadas** lo cual causa confusión.

2. **Secciones duplicadas en homepage**: Hay DOS secciones de beneficios (una declarada como JSX suelto en líneas 302-354 y otra en el render principal, líneas 1392-1423) y DOS secciones de precios (una en líneas 878-976 y otra en líneas 1431-1527). Los usuarios ven contenido repetido.

3. **WhatsApp con número placeholder** (`https://wa.me/1234567890`): El botón flotante de WhatsApp apunta a un número ficticio. Los usuarios que hagan clic no llegarán a nadie.

4. **Carla (asistente virtual) es solo un `alert()`**: El botón de Carla muestra un simple alert diciendo "Pronto estaré disponible". Genera expectativa y decepciona, dañando la confianza.

5. **CTA de proceso apunta a `#comenzar`** que lleva a la sección CTA final, no al onboarding real. El flujo no termina en la acción de compra.

#### IMPORTANTES (reducen conversiones)
6. **Precios inconsistentes**: Homepage muestra $349/$499/$849 pero `/precios` muestra $597/$897/$1397. El usuario que compare sentirá desconfianza.

7. **Homepage de 1536 líneas monolítica**: Todo en un solo archivo client-side. Esto ralentiza el First Contentful Paint (FCP) y Time to Interactive (TTI). Página pesada = más abandonos.

8. **No hay exit-intent popup ni urgencia**: No hay ningún mecanismo para recuperar usuarios que abandonan (exit-intent, countdown, oferta limitada).

9. **El formulario de contacto rápido NO pide teléfono**, pero tampoco ofrece un canal directo inmediato (chat real, no placeholder).

10. **No hay social proof dinámico**: Los testimonios son estáticos y hardcoded. No hay reviews verificadas (Google, Trustpilot), ni contador en tiempo real.

11. **Pricing duplicado crea scroll excesivo**: El usuario tiene que scrollear mucho en la homepage. A más scroll, más abandono.

12. **No hay "comparison table"** en precios para ver diferencias rápidamente entre planes.

#### DESEABLES (optimización fina)
13. **No hay A/B testing** implementado.
14. **No hay email sequence** post-lead capturado (nurturing).
15. **No hay tracking de scroll depth** ni heatmaps (Clarity está, pero no confirmado activo).
16. **El quiz no tiene un CTA agresivo al final** que lleve directo al checkout.
17. **Falta microcopy de urgencia** ("Solo quedan 3 plazas este mes", "Precio válido hasta...").
18. **Los testimonios no tienen fotos reales verificables** (nombres genéricos como "Carlos M.", "Ana R.").

---

## 5. Próximas 3-5 tareas recomendadas
*(Ordenadas por impacto combinado en CRO + SEO)*

### 🔴 TAREA 1 — Convertir homepage a Server Component (IMPACTO: MÁXIMO)
**Tipo**: SEO + CRO (performance)
- Refactorizar `app/page.tsx` para que el contenido estático se renderice en servidor.
- Extraer las partes interactivas (formulario, sticky CTA, animaciones) a Client Components pequeños.
- Mover el `export const metadata` desde `layout.tsx` al propio `page.tsx` con contenido específico de homepage.
- Resultado: Google indexa todo el contenido, FCP mejora drásticamente, LCP baja.

### 🔴 TAREA 2 — Arreglar CTAs rotos y eliminar duplicados (IMPACTO: MÁXIMO)
**Tipo**: CRO (conversiones directas)
- Eliminar la sección de precios que apunta a `#asesoria` (anchor inexistente).
- Eliminar la sección de beneficios duplicada.
- Dejar UNA sola sección de precios con CTAs que apunten a `/paquetes/[plan]/onboarding`.
- Arreglar el número de WhatsApp con el real.
- Eliminar o reemplazar el botón de Carla con un chat real o eliminarlo.

### 🟡 TAREA 3 — Unificar precios y añadir canonical URLs (IMPACTO: ALTO)
**Tipo**: SEO + CRO
- Unificar precios entre homepage y `/precios` (deben ser idénticos).
- Añadir `alternates.canonical` a TODAS las páginas que no lo tienen (homepage, contacto, servicios, quiz, lead-form, FAQ, blog posts, guías).
- Arreglar los placeholders en JSON-LD (teléfono, redes sociales).

### 🟡 TAREA 4 — Añadir metadata a páginas sin ella (IMPACTO: ALTO)
**Tipo**: SEO
- Añadir `export const metadata` a: `/contacto`, `/servicios` (listado), `/quiz`, `/lead-form`.
- Añadir `canonical`, `openGraph` y `twitter` cards a blog posts y guías por país.
- Crear `app/not-found.tsx` con CTA y metadata.

### 🟢 TAREA 5 — Optimización CRO de la página de precios (IMPACTO: MEDIO-ALTO)
**Tipo**: CRO
- Añadir tabla comparativa de planes.
- Añadir elementos de urgencia/escasez.
- Añadir FAQ debajo de precios.
- Implementar tracking de scroll depth + micro-conversiones en GA4.
- Mejorar la sección de garantía con copy más persuasivo.

---

## 6. Notas importantes

- **No hay tests automatizados.** Cualquier cambio debe verificarse manualmente levantando el servidor de desarrollo (`npm run dev`) y revisando visualmente.
- **Prioridad máxima: CRO y SEO.**
- `typescript.ignoreBuildErrors: true` — el proyecto compila aunque haya errores de TS. Esto enmascara problemas.
- El comando `npm run lint` está roto. Usar `npx eslint . --ext .ts,.tsx,.js,.mjs` como alternativa.
- Clean restart recomendado: eliminar `.next/` y ejecutar `npm run dev`.
- Hay archivos de test, debug y backup (`.bak`, `.back`, `test-*.ts`, `diagnostico/`) que deberían limpiarse antes de producción.
- El directorio `content/` está vacío — los posts del blog podrían estar en otro lugar o no haberse creado aún.
- La app se despliega vía Docker en Dokploy con algunas variables de entorno baked-in.
- Stripe webhooks locales requieren `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
