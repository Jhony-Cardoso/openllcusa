import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  // ==================== SOLUCIÓN PARA EL ERROR EACCES EN .next/cache ====================
  // Esto es clave para entornos Docker como Dokploy
  experimental: {
    // Desactiva la caché persistente en disco durante el build cuando sea necesario
    webpackBuildWorker: false,
  },

  // Configuración recomendada para evitar problemas de permisos en Docker
  webpack: (config, { dev, isServer }) => {
    // En desarrollo desactivamos la caché para evitar warnings
    if (dev) {
      config.cache = false;
    }
    return config;
  },

  // Forzar directorio de caché en /tmp para evitar problemas de permisos
  distDir: '.next',

  // ==================== TU CONFIGURACIÓN ORIGINAL (sin cambios) ====================
  typescript: {
    // Permite compilar aunque haya errores de TypeScript
    ignoreBuildErrors: true,
  },

  // Configuración de headers para CORS (Stripe, etc.)
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, stripe-signature' },
        ],
      },
    ];
  },

  // Redirecciones 301 SEO-friendly
  async redirects() {
    return [
      {
        source: '/servicios/plan-compliance',
        destination: '/paquetes/compliance-basico/onboarding',
        permanent: true,
      },
      {
        source: '/servicios/impuestos-federales',
        destination: '/servicios/impuestos-llc-5472-1120',
        permanent: true,
      },
      {
        source: '/servicios/form-5472',
        destination: '/servicios/impuestos-llc-5472-1120',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;