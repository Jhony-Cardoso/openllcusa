# ==================== STAGE 1: BUILD ====================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar solo los archivos necesarios para instalar dependencias
COPY package*.json ./
COPY prisma ./prisma/          # Si usas Prisma (aunque uses Supabase, por si acaso)
COPY . .

# Instalar dependencias (incluyendo devDependencies para el build)
RUN npm ci --legacy-peer-deps

# Build de Next.js (usa standalone gracias a tu next.config.ts)
RUN npm run build

# ==================== STAGE 2: PRODUCTION ====================
FROM node:20-alpine AS runner

WORKDIR /app

# Variables de entorno recomendadas para producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar solo lo necesario del build (gracias a output: 'standalone')
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Puerto que expone Next.js
EXPOSE 3000

# Usuario no-root por seguridad
USER node

# Comando de inicio (el que genera standalone)
CMD ["node", "server.js"]