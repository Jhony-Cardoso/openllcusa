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
- **Dev PC (local)**: 16 GB RAM → `NODE_OPTIONS=--max-old-space-size=4096` en `package.json` (rebajado para evitar OOM con webpackBuildWorker)
- **VPS Dokploy (producción)**: 4 GB RAM total → `NODE_OPTIONS=--max-old-space-size=768` en `Dockerfile` (muy bajo intencionalmente para forzar al Garbage Collector de Node y evitar que el OS mate el proceso).
- **Configuración estricta de Build en VPS**: Para evitar fallos "Cancelled" por OOM Killer en `next build`:
  1. `Dockerfile`: usar `--max-old-space-size=768` y `ENV NEXT_TELEMETRY_DISABLED=1` en la fase de build.
  2. `next.config.ts`: 
     - Desactivar completamente la caché de Webpack: `webpack: (config) => { config.cache = false; return config; }`
     - Forzar 1 solo hilo: `experimental: { webpackBuildWorker: false, cpus: 1, workerThreads: false }`
     - Evitar linting: `eslint: { ignoreDuringBuilds: true }`

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

## AI Assistant & RAG (Knowledge Base) Rules
When updating the AI Assistant (`app/api/chat/route.ts`) or the Knowledge Base (`knowledge/*.md`), follow these best practices to ensure the LLM follows instructions and avoids "Lost in the middle" syndrome:
1. **Embed Markdown Links Directly**: The AI often copies text verbatim from RAG chunks. Always include explicit Markdown links to our services (e.g., `[Formulario 5472](/servicios/form-5472-1120)`) directly within the `.md` knowledge files.
2. **Re-ingest after Editing**: Whenever you modify files in the `knowledge/` folder, you MUST run `npx tsx scripts/ingest-knowledge.ts` to update the Supabase vector embeddings.
3. **Prompt Structure (Lost in the middle)**: Critical instructions (like "always include links") must be placed at the VERY END of the final system prompt, after the RAG context has been injected.
4. **Low Temperature**: Maintain `temperature: 0.3` (or similar) in the `streamText` configuration to enforce strict adherence to formatting rules.

## Blog & Content Formatting Rules
When creating or editing blog posts (`lib/blog/posts.ts`):
1. **Hero Images**: Every post MUST have a custom generated hero image in the `image` field (e.g., `/blog/blog_hero_topic.jpg`). Generate these images with a prompt style: *"A high quality, modern, flat vector illustration on a dark blue background... Corporate premium aesthetic, no text."*
2. **Visual Blocks (Callouts)**: Never write long walls of text. Break them up by injecting visual blockquotes for critical info using emojis, e.g.: `> 💡 **Consejo Experto**: ...` or `> 🚨 **Importante**: ...`. 
3. **Internal Linking**: Always include an explicit Next.js `<Link>` or standard markdown link CTA towards the end of the content pointing to `/agendar` or relevant services.
4. **Humanized Tone**: The text of the blog articles must be highly humanized, conversational, and natural to avoid AI-detection by Google (SEO). Avoid robotic transition phrases (e.g., 'En conclusión', 'Es importante destacar'), use varied sentence structures, idiomatic expressions where appropriate, and write as if a real human expert is speaking directly to the reader.

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
