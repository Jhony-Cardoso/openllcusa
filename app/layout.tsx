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
    default: 'Open LLC USA - Crea tu LLC desde España',
  },
  description: 'Calculadora fiscal y servicios para crear y gestionar tu LLC USA desde España',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: 'Open LLC USA',
    locale: 'es_ES',
    type: 'website',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://openllcusa.com'),
};

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