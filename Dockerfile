# ==================== STAGE 1: BUILD ====================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias primero (mejor cache)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Build de Next.js (usa output: 'standalone')
RUN npm run build

# ==================== STAGE 2: PRODUCTION ====================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar solo lo necesario del build standalone
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# Usuario no-root por seguridad
USER node

CMD ["node", "server.js"]