# AGENTS.md

Compact guidance for agents. Extracted only from executable sources (package.json, next.config.ts, tsconfig, eslint, Dockerfile, scripts, key .ts, setup MDs) and verified facts that differ from defaults.

## Commands
- `npm run dev` — starts with `cross-env NODE_OPTIONS=--max-old-space-size=4096` (required; variants: dev:safe, dev:notrace exist)
- `npm run build` — production build (standalone output)
- `npm run lint` — **broken** (errors with "no such directory: .../lint"); run `npx eslint . --ext .ts,.tsx,.js,.mjs` instead
- `npx tsc --noEmit` — typecheck (reports many errors; see quirks)
- Clean dev restart (after middleware.ts, .env.local, Clerk changes): delete `.next/`, then `npm run dev` (or use `scripts/restart-dev.ps1`)
- Stripe webhooks local: `stripe listen --forward-to localhost:3000/api/stripe/webhook` (then update STRIPE_WEBHOOK_SECRET)
- Mobile / real-device Clerk testing: run `ngrok http 3000`, update Clerk dashboard allowed origins + `NEXT_PUBLIC_BASE_URL`, restart dev (see GUIA_RAPIDA_MOBILE.md, MOBILE_TESTING_SETUP.md; ngrok.exe in root)
- Sub-project: `cd stripe-demo && npm install && npm run dev` (isolated Stripe testing)
- DB/migrations: manual SQL via Supabase Studio (cloud primary in .env; legacy self-hosted at http://89.117.53.55:8001 in some scripts); apply via `supabase/migrations*/` + node scripts in `scripts/` using service role
- Test scripts: run individual `node scripts/*.mjs` or `ts-node test-*.ts` (email, webhook, SS4/PDF, estados, etc.)

## Project Structure & Entrypoints
- Next.js 16 (app router) + React 19 + TS + Tailwind + Clerk (auth) + Supabase (DB + Storage) + Stripe + Resend
- No monorepo; single app except `stripe-demo/` sub-app
- Protected routes: Clerk middleware protects `/dashboard(.*)` + `/servicios/form-5472-1120/onboarding(.*)`
- Admin: email allowlist (ADMIN_EMAIL + hardcoded) in multiple admin API/pages (no Clerk orgs/roles)
- Core domain: `pedidos` table + `tax_data` (JSONB) for tax filing (5472/1120/SS4/EIN); packages (paquetes) for one-time; subscriptions
- PDF/tax automation: `lib/services/tax-form.service.ts`, `lib/utils/pdfGenerator.ts`, `lib/pdf/`, heavy field-mapping scripts in `scripts/` (inspect 5472/1120/SS4 PDFs)
- Emails: `lib/services/email.service.ts`, templates in `email-templates/`
- Onboarding flows: complex multi-step wizards in `app/*/onboarding/*` + state machine in pedidos
- Aliases: `@/*` → project root (tsconfig)
- Migrations: not auto; committed .sql files; no supabase CLI in package.json

## Config Quirks (from next.config.ts, Dockerfile, etc.)
- `typescript.ignoreBuildErrors: true` (builds despite errors; tsc fails on route handler async params, missing @types/uuid, anys, etc.)
- `output: 'standalone'` + Docker-specific: `webpackBuildWorker: false`, dev `config.cache=false`, special `CMD mkdir -p /app/.next/cache && node server.js` (perms after volume mounts in Dokploy)
- Turbopack enabled explicitly (Next 16 default)
- Legacy redirects/rewrites for old `/servicios/*` URLs → current tax/service paths
- CORS headers on all `/api/*` (Stripe signature etc.)
- Dockerfile bakes some NEXT_PUBLIC_* (test keys) and uses `npm ci --legacy-peer-deps`
- .npmrc: `shamefully-hoist=true` (npm warning; pnpm leftover)
- No tests, no format script, no CI workflows in repo
- Env loading: .env.local required for dev (keys: Clerk pub/secret + urls, Supabase url/anon/service, Stripe pub/secret/webhook, RESEND_API_KEY, ADMIN_EMAIL, TELEGRAM_*, MAKE_LEADS_WEBHOOK_URL, NEXT_PUBLIC_BASE_URL, GA, Clarity). Dummies in code for build bypass.

## Testing & Verification
- No Jest/Vitest/etc.; manual only
- Verify changes: `npm run build`, browser flows for onboarding/checkout/dashboard/admin, Stripe test cards, `stripe trigger ...`, Resend test via `scripts/test-email.mjs`
- Common reset: kill node, `rm -rf .next`, `npm run dev`
- For PDF/tax changes: use scripts/inspect-*.js, test-ss4-*.mjs etc.

## References (high-value, non-obvious)
- Stripe local + products + webhooks: STRIPE_SETUP.md, WEBHOOKS_SETUP.md
- Mobile ngrok/Clerk: MOBILE_TESTING_SETUP.md, GUIA_RAPIDA_MOBILE.md, CONFIGURAR_CLERK_MOBILE.md, scripts/update-clerk-ngrok.ps1 + start-mobile-*.ps1
- Admin panel / states / facturacion: .agent/*.md (esp. CHECKLIST_PANEL_ADMIN.md, PANEL_ADMINISTRACION.md, SISTEMA_FACTURACION.md)
- Tax filing flow: docs/TAX_FILING_ARCHITECTURE.md
- Troubleshooting auth/onboarding/mobile: TROUBLESHOOTING.md
- DB schema updates: supabase/migrations* + full_db_restore.sql
- Other: INSTRUCCIONES_ESTADOS.md, PAYMENT_METHODS.md, TROUBLESHOOTING_PAYMENT_METHODS.md

Only edit if you can verify against current package.json/next.config/scripts. Omit generic advice.


# Directrices de Comportamiento del Agente

## Regla de Archivado Obligatorio y Automático
1. **Momento de ejecución:** Cada vez que completes con éxito una tarea importante (como crear un script, corregir un bug) o antes de que el usuario finalice la sesión, debes documentar la conversación.
2. **Ubicación del archivo:** Guarda el registro en un archivo de texto llamado `chat_history.md` situado en la raíz de este proyecto.
3. **Formato del historial:** Si el archivo `chat_history.md` ya existe, debes **añadir (append)** la nueva conversación al final sin borrar lo anterior. Si no existe, créalo desde cero.

## Estructura del Documento (Markdown)
Cada bloque de chat que agregues debe seguir estrictamente este diseño visual:

---
### 📅 Sesión del Chat: [Insertar Fecha y Hora Actual]
**Objetivo principal:** [Escribe un resumen muy corto de una frase sobre qué se hizo en este chat]

#### 👤 Petición del Usuario:
> [Resume de forma compacta qué te pidió el usuario]

#### 🤖 Solución de Grok Build:
- **Resumen:** [Breve explicación de los cambios realizados]
- **Archivos creados/modificados:** 
  - `[Ruta del archivo 1]`
  - `[Ruta del archivo 2]`

#### 💻 Código Generado Clave:
```[lenguaje]
[Pega aquí solo el bloque de código final o más importante generado en la conversación, no todo el chat completo]
```
---

