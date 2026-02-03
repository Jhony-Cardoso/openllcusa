// app/layout.tsx (layout raíz)

import './globals.css';
import './header.css';
import { ClerkProvider } from '@clerk/nextjs';
import { esES } from '@clerk/localizations';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookiesBanner from '@/components/shared/CookiesBanner';
import type { Metadata } from 'next'; // ← Importar tipo

// ===================================
// METADATA RAÍZ (con template)
// ===================================
export const metadata: Metadata = {
  // ✅ NUEVO: Usar template en lugar de título fijo
  title: {
    template: '%s | Open LLC USA', // ← %s será reemplazado por el título de cada página
    default: 'Open LLC USA - Crea tu LLC desde España', // ← Solo para la home
  },

  // ✅ NUEVO: Descripción por defecto (puede ser sobrescrita)
  description: 'Calculadora fiscal y servicios para crear y gestionar tu LLC USA desde España',

  // ✅ AÑADIR: Metadata global que aplica a todas las páginas
  robots: {
    index: true,
    follow: true,
  },

  // ✅ AÑADIR: Open Graph por defecto (puede ser sobrescrito)
  openGraph: {
    siteName: 'Open LLC USA',
    locale: 'es_ES',
    type: 'website',
  },
};

import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ClerkProvider localization={esES}>
          <Header />
          {children}
          <Footer />
          {/* Banner de cookies global */}
          <CookiesBanner />
        </ClerkProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      </body>
    </html>
  );
}
