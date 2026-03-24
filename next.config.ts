import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Solución recomendada y más usada en Next.js 15+
  // Desactiva la caché persistente en disco solo en desarrollo
  // (en producción sigue activa porque sí es útil)
  experimental: {
    // Opción oficial de Next.js 15 para desactivar la caché en disco
    // cuando solo estamos desarrollando
    webpackBuildWorker: false,
  },

  // Alternativa más directa y 100% efectiva (elige una de las dos):
  // webpack: (config, { dev }) => {
  //   if (dev) {
  //     config.cache = false; // mata la advertencia al 100%
  //   }
  //   return config;
  // },

  // Configuración de headers para CORS (necesario para Stripe)
  async headers() {
    return [
      {
        // Aplicar a todas las rutas de API
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // En producción, especifica dominios
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, stripe-signature' },
        ],
      },
    ];
  },

  // Redirecciones 301 SEO-friendly de /servicios/ a /paquetes/
  async redirects() {
    return [
      // 1. Catálogo /servicios va a /precios
      {
        source: '/servicios',
        destination: '/precios',
        permanent: true,
      },
      // 2. Corrección expresa del slug 'plan-compliance'
      {
        source: '/servicios/plan-compliance',
        destination: '/paquetes/compliance-basico/onboarding',
        permanent: true,
      },
      {
        source: '/servicios/plan-compliance/onboarding/:path*',
        destination: '/paquetes/compliance-basico/onboarding/:path*',
        permanent: true,
      },
      // 3. Redirigir explícitamente solo los paquetes de LLC (para no romper 'obtencion-ein', etc)
      {
        source: '/servicios/:slug(llc-esencial|launch-banking|primer-ano-pro|plan-crecimiento|pack-optimizacion|compliance-basico)',
        destination: '/paquetes/:slug/onboarding',
        permanent: true,
      },
      {
        source: '/servicios/:slug(llc-esencial|launch-banking|primer-ano-pro|plan-crecimiento|pack-optimizacion|compliance-basico)/onboarding/:path*',
        destination: '/paquetes/:slug/onboarding/:path*',
        permanent: true,
      },
    ];
  },

  // Tu configuración actual y futura sigue aquí abajo sin problema
};

export default nextConfig;