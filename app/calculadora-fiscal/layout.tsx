// app/calculadora-fiscal/layout.tsx

import type { Metadata } from 'next';

// ===================================
// METADATA PARA SEO
// ===================================
// Este metadata se aplicará a la página de la calculadora fiscal
// Mejora el SEO y cómo se ve al compartir en redes sociales
export const metadata: Metadata = {
  // Título optimizado para búsquedas (máx 60 caracteres recomendado)
  title: 'Calculadora Fiscal España 2025 - Compara LLC vs Autónomo vs SL',
  // Descripción atractiva con palabras clave (máx 160 caracteres)
  description: 'Calculadora fiscal gratuita para emprendedores en España. Compara impuestos entre Autónomo, SL y LLC USA. Resultados estimados en segundos.',
  
  // Palabras clave relevantes para SEO
  keywords: [
    'calculadora fiscal españa',
    'calculadora impuestos autónomos',
    'comparar LLC vs autónomo',
    'calculadora SL vs autónomo',
    'impuestos emprendedores españa',
    'IRPF autónomos 2025',
    'impuesto sociedades españa'
  ],
  
  // URL canónica para evitar contenido duplicado
  alternates: {
    canonical: 'https://openllcusa.com/calculadora-fiscal',
  },
  
  // Open Graph para Facebook, LinkedIn, WhatsApp
  openGraph: {
    title: 'Calculadora Fiscal España 2025 - Open LLC USA',
    description: 'Herramienta gratuita para comparar impuestos entre Autónomo, SL y LLC. Estimaciones personalizadas para emprendedores.',
    url: 'https://openllcusa.com/calculadora-fiscal',
    siteName: 'Open LLC USA',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/images/og-calculadora-fiscal.jpg', // Tu imagen de Flux
        width: 1200,
        height: 630,
        alt: 'Calculadora Fiscal Open LLC USA',
      },
    ],
  },
  
  // Twitter Cards para compartir en Twitter/X
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora Fiscal España 2025',
    description: 'Compara impuestos entre Autónomo, SL y LLC USA. Gratis y sin registro.',
    images: ['/images/og-calculadora-fiscal.jpg'],
  },
  
  // Instrucciones para buscadores
  robots: {
    index: true, // Permitir indexación
    follow: true, // Seguir enlaces
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

// ===================================
// LAYOUT (wrapper para la página)
// ===================================
// Este layout simplemente envuelve el contenido de la página
// pero permite que Next.js 15 aplique el metadata correctamente
export default function CalculadoraFiscalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
