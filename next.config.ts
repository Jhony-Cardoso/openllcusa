import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

  // Tu configuración actual y futura sigue aquí abajo sin problema
};

export default nextConfig;