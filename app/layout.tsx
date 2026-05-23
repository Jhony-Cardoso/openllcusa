import './globals.css';
import './header.css';
import { ClerkProvider } from '@clerk/nextjs';
import { esES } from '@clerk/localizations';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookiesBanner from '@/components/shared/CookiesBanner';
import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

export const metadata: Metadata = {
  title: {
    template: '%s | Open LLC USA',
    default: 'Crea tu LLC en Estados Unidos en 72 horas | Open LLC USA',
  },
  description: 'Forma tu LLC en EE.UU. desde España o Latam sin visa ni SSN. Planes desde $349 + tasa estatal. +500 emprendedores hispanos ya lo han hecho. Proceso 100% remoto y garantizado.',
  keywords: [
    'LLC USA', 
    'crear LLC Estados Unidos', 
    'formar empresa USA', 
    'LLC sin visa', 
    'EIN sin SSN', 
    'empresa en Delaware', 
    'empresa en Wyoming',
    'abrir LLC desde España'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: 'Open LLC USA',
    locale: 'es_ES',
    type: 'website',
    url: 'https://openllcusa.com',
    title: 'Crea tu LLC en Estados Unidos en 72 horas | Open LLC USA',
    description: 'La forma más fácil y segura de tener tu empresa americana desde España o Latinoamérica.',
    images: [{ url: '/images/hero.webp' }],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://openllcusa.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClerkProvider localization={esES}>
          <Header />
          {children}
          <Footer />
          <CookiesBanner />
        </ClerkProvider>

        {/* ==================== GOOGLE ANALYTICS 4 ==================== */}
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GA_ID || ''}
        />

        {/* ==================== MICROSOFT CLARITY (opcional por ahora) ==================== */}
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <Script
            id="microsoft-clarity"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}