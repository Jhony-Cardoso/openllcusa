import type { Metadata } from 'next'
import Link from 'next/link'

const SITEURL = 'https://openllcusa.com' // TODO cambia por tu dominio real [file:2]
const BRANDNAME = 'Open LLC USA' // TODO cambia por tu marca [file:2]

export const metadata: Metadata = {
  title: 'Recursos y Herramientas Gratuitas para Emprendedores | Open LLC USA',
  description: 'Calculadora fiscal, test de estado ideal (Wyoming vs Delaware) y asesoría gratuita 24/7 con nuestra IA especializada en LLCs para no residentes.',
  alternates: { canonical: `${SITEURL}/recursos` },
  openGraph: {
    type: 'website',
    url: `${SITEURL}/recursos`,
    title: 'Recursos y Herramientas Gratuitas para Emprendedores | Open LLC USA',
    description: 'Calculadora fiscal, test de estado ideal (Wyoming vs Delaware) y asesoría gratuita 24/7 con nuestra IA especializada en LLCs para no residentes.',
    images: [
      {
        url: `${SITEURL}/images/recursos-og.webp`,
        width: 1200,
        height: 630,
        alt: 'Herramientas y Recursos - Open LLC USA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recursos Gratuitas para Emprendedores | Open LLC USA',
    description: 'Calculadora fiscal, test de estado ideal y asesoría 24/7.',
  },
  robots: { index: true, follow: true }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: `Herramientas | ${BRANDNAME}`,
  url: `${SITEURL}/recursos`,
  description: 'Colección de herramientas gratuitas: calculadora, quiz y asesoría 24/7 con Zara.',
  isPartOf: { '@type': 'WebSite', name: BRANDNAME, url: SITEURL }
}

export default function HerramientasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main style={{ background: 'var(--color-background)' }}>
        {/* Hero: reutiliza el look & feel de otras páginas */}
        <section className="section" style={{ paddingTop: 110, paddingBottom: 40 }}>
          <div className="section-container" style={{ maxWidth: 900 }}>
            <p style={{ fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 10 }}>
              Herramientas gratuitas
            </p>

            <h1 style={{ fontSize: 42, lineHeight: 1.15, marginBottom: 14 }}>Herramientas</h1>

            <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', maxWidth: 720, lineHeight: 1.6, marginBottom: 18 }}>
              Usa estas herramientas para elegir el servicio correcto y avanzar con claridad.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/precios" className="btn btn-primary">
                Ver precios
              </Link>
              <Link href="/servicios" className="btn btn-white">
                Ver servicios
              </Link>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="section" style={{ paddingTop: 20 }}>
          <div className="section-container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 18
              }}
            >
              <article
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-card-border)',
                  borderRadius: 16,
                  padding: 22,
                  boxShadow: '0 8px 22px rgba(7, 36, 55, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Calculadora</h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                  Estima qué necesitas según tu situación y objetivos.
                </p>
                <Link className="btn btn-primary" href="/lead-form">
                  Abrir calculadora
                </Link>
              </article>

              <article
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-card-border)',
                  borderRadius: 16,
                  padding: 22,
                  boxShadow: '0 8px 22px rgba(7, 36, 55, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Quiz</h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                  Responde 5–7 preguntas y recibe una recomendación de plan.
                </p>
                <Link className="btn btn-primary" href="/quiz">
                  Empezar quiz
                </Link>
              </article>

              <article
                style={{
                  background: 'rgba(29, 78, 216, 0.06)',
                  border: '1px solid rgba(29, 78, 216, 0.35)',
                  borderRadius: 16,
                  padding: 22,
                  boxShadow: '0 8px 22px rgba(7, 36, 55, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Asesoría con Zara</h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                  Asesoría gratis 24/7 por voz con transcripción (modo demo por ahora).
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 'auto' }}>
                  <Link className="btn btn-primary" href="/zara">
                    Abrir Zara
                  </Link>
                </div>
              </article>

              {/* Nuevas tarjetas: Blog, Guías, FAQ, Contacto */}
              <article
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-card-border)',
                  borderRadius: 16,
                  padding: 22,
                  boxShadow: '0 8px 22px rgba(7, 36, 55, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Blog</h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                  Artículos, noticias y novedades sobre LLCs en EE. UU.
                </p>
                <Link className="btn btn-white" style={{ marginTop: 'auto', alignSelf: 'flex-start' }} href="/blog">
                  Leer Blog
                </Link>
              </article>

              <article
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-card-border)',
                  borderRadius: 16,
                  padding: 22,
                  boxShadow: '0 8px 22px rgba(7, 36, 55, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Guías</h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                  Guías detalladas para crear y mantener tu LLC desde cualquier país.
                </p>
                <Link className="btn btn-white" style={{ marginTop: 'auto', alignSelf: 'flex-start' }} href="/guia">
                  Ver Guías
                </Link>
              </article>

              <article
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-card-border)',
                  borderRadius: 16,
                  padding: 22,
                  boxShadow: '0 8px 22px rgba(7, 36, 55, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>FAQ</h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                  Respuestas rápidas a las preguntas más frecuentes de nuestros clientes.
                </p>
                <Link className="btn btn-white" style={{ marginTop: 'auto', alignSelf: 'flex-start' }} href="/faq">
                  Ver FAQ
                </Link>
              </article>

              <article
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-card-border)',
                  borderRadius: 16,
                  padding: 22,
                  boxShadow: '0 8px 22px rgba(7, 36, 55, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Contacto</h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                  ¿Necesitas ayuda personalizada? Escríbenos y te responderemos lo antes posible.
                </p>
                <Link className="btn btn-white" style={{ marginTop: 'auto', alignSelf: 'flex-start' }} href="/contacto">
                  Contactar
                </Link>
              </article>
            </div>

            <p style={{ marginTop: 18, color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
              Consejo: si estás comparando opciones, empieza por <Link href="/precios">/precios</Link> y luego entra al
              detalle del servicio en <Link href="/servicios">/servicios</Link>.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
