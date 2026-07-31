# AGENTS.md

Compact, high-signal guidance for AI agents working on this repository.  
Combine verified technical facts with project priorities and safe operating rules.

## Project Priorities (Highest Level)
- Maximize **CRO** (Conversion Rate Optimization)
- Maximize **SEO** (technical + content)
- Prefer small, high-impact changes over large refactors
- Never break existing flows (especially onboarding, checkout, dashboard, tax filing)

## Language
- Always respond to the user in **Spanish**.
- Use English only for code identifiers, API literals, error messages, or when the user explicitly requests it.
- Write new code comments in Spanish when it feels natural and does not break existing style.

## Infrastructure
- **Dev PC (local)**: 16 GB RAM → `NODE_OPTIONS=--max-old-space-size=8192` en `package.json`
- **VPS Dokploy (producción)**: 4 GB RAM total → `NODE_OPTIONS=--max-old-space-size=2048` en `Dockerfile`
- Regla: el builder usa 2 GB para dejar margen al OS (~300 MB), Dokploy (~500 MB) y el contenedor de producción activo (~300 MB).
- El `Dockerfile` también tiene `eslint.ignoreDuringBuilds: true` en `next.config.ts` para evitar fallos de OOM durante el lint.

## Commands
- `npm run dev` — starts with `cross-env NODE_OPTIONS=--max-old-space-size=8192` (local 16 GB). Variants: `dev:safe`, `dev:notrace`
- `npm run build` — production build (standalone output), uses `--webpack` flag
- `npm run lint` — **broken**. Use instead: `npx eslint . --ext .ts,.tsx,.js,.mjs`
- `npx tsc --noEmit` — typecheck (many existing errors; see quirks)
- Clean restart after middleware / .env.local / Clerk changes: delete `.next/` then `npm run dev` (or use `scripts/restart-dev.ps1`)
- Stripe webhooks local: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Mobile / real-device Clerk testing: `ngrok http 3000` + update Clerk allowed origins + `NEXT_PUBLIC_BASE_URL`
- Sub-project: `cd stripe-demo && npm install && npm run dev`
- DB/migrations: manual SQL via Supabase Studio + files in `supabase/migrations*/` + node scripts in `scripts/`

## Project Structure & Stack
- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind
- Auth: Clerk (middleware protects `/dashboard(.*)` and `/servicios/form-5472-1120/onboarding(.*)`)
- Database & Storage: Supabase
- Payments: Stripe
- Email: Resend
- Core domain: tax filing (5472 / 1120 / SS4 / EIN) → `pedidos` table + `tax_data` (JSONB)
- Heavy PDF/tax logic: `lib/services/tax-form.service.ts`, `lib/utils/pdfGenerator.ts`, `lib/pdf/`, scripts in `scripts/`
- Emails: `lib/services/email.service.ts` + `email-templates/`
- Onboarding: complex multi-step wizards under `app/*/onboarding/*`
- Admin: email allowlist (no Clerk orgs/roles)
- Path alias: `@/*` → project root

## Config Quirks (Critical)
- `typescript.ignoreBuildErrors: true` → builds succeed even with type errors
- `output: 'standalone'` + Docker-specific settings
- Turbopack enabled
- Legacy redirects/rewrites for old `/servicios/*` paths
- CORS headers on all `/api/*`
- No automated tests, no format script, no CI workflows
- `.env.local` is required for local development

## Testing & Verification Rules
- No Jest/Vitest/Playwright → **manual verification only**
- After any non-trivial change:
  1. Run `npm run build`
  2. Start `npm run dev`
  3. Manually test the affected user flow in the browser
- Common reset: kill node processes → `rm -rf .next` → `npm run dev`
- For PDF/tax changes: use the existing inspect/test scripts in `scripts/`

## Agent Behavior Rules
1. Always read `PROJECT_HANDOVER.md` (if it exists) and this `AGENTS.md` before starting work.
2. Prefer changes that improve both CRO and SEO.
3. Keep changes small and focused. Do not touch unrelated areas.
4. After finishing a task, clearly list:
   - Files created/modified
   - What the user must visually verify in the browser
5. Never assume tests exist. Always remind the user to verify manually.

## Mandatory Session Logging
After completing an important task (or before the user ends the session), append a record to `chat_history.md` in the project root using this exact format:

---
### 📅 Chat Session: [Current Date and Time]
**Main objective:** [One-sentence summary]

#### 👤 User Request:
> [Compact summary of what the user asked]

#### 🤖 Agent Solution:
- **Summary:** [Brief explanation of what was done]
- **Files created/modified:**
  - `path/to/file1`
  - `path/to/file2`

#### 💻 Key Code:
```[language]
[Only the most important final code block]
