# ==================== STAGE 1: BUILD ====================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias primero (mejor cache)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Inyectar las variables PÚBLICAS directamente (Next.js las hornea en el código estático)
# Nota: Sólo van las públicas por seguridad (NEXT_PUBLIC_), nada de contraseñas.
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c3RlcmxpbmctY2ljYWRhLTY2LmNsZXJrLmFjY291bnRzLmRldiQ
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
ENV NEXT_PUBLIC_SUPABASE_URL=http://89.117.53.55:8001
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc0MzI5NzA4LCJleHAiOjIwODk2ODk3MDh9.In8vIQuS43KP8kW3OBhez4oW_u9FFPETewZIRZuQ_N4
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51StqGUJEd1MIEnRaKvUk1rhStNGHHrbnZNnYroZ0AW7B8cVnMAYHpbM0eIhebD9CfDuKoEd4OU66QLxqCM45aMRE00JKqzomGG
ENV NEXT_PUBLIC_BASE_URL=https://openllcusa.com
ENV NEXT_PUBLIC_GA_ID=G-LY8T63H5SZ

# Build de Next.js (usa output: 'standalone')
RUN npm run build

# ==================== STAGE 2: PRODUCTION ====================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar solo lo necesario del build standalone
COPY --from=builder --chown=node:node /app/next.config.ts ./
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Pre-create the cache folder and ensure node user has write access
RUN mkdir -p /app/.next/cache && chown -R node:node /app/.next

EXPOSE 3000

# Usuario no-root por seguridad
USER node

CMD ["node", "server.js"]