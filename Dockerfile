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

ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51StqGUJEd1MIEnRaKvUk1rhStNGHHrbnZNnYroZ0AW7B8cVnMAYHpbM0eIhebD9CfDuKoEd4OU66QLxqCM45aMRE00JKqzomGG
ENV NEXT_PUBLIC_BASE_URL=https://openllcusa.com
ENV NEXT_PUBLIC_GA_ID=G-LY8T63H5SZ

# Asignar memoria al proceso Node durante el build.
# VPS tiene 4GB RAM; dejamos margen para el OS, Dokploy y el contenedor en producción.
ENV NODE_OPTIONS=--max-old-space-size=1536

# Build de Next.js (usa output: 'standalone')
# Ejecutamos 'next build' directamente para que no lea el NODE_OPTIONS=8192 del package.json
RUN npx next build --webpack

# ==================== STAGE 2: PRODUCTION ====================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=5000

# Copiar solo lo necesario del build standalone
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 5000

# Script de arranque: crea la carpeta de caché DESPUÉS de que Dokploy monte volúmenes
# Esto garantiza permisos correctos sin importar qué volúmenes se monten
CMD ["sh", "-c", "mkdir -p /app/.next/cache && node server.js"]