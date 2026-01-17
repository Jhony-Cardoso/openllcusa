import { Metadata } from 'next';
import Link from 'next/link';
import { Check, Clock, MessageCircle, BookOpen, FileText, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Consultoría Legal para LLCs - $150/hora',
  description: 'Asesoría legal personalizada para tu LLC en USA. Estructura societaria, compliance, contratos, protección de activos y más. Sesiones en español con expertos.',
  keywords: [
    'consultoría legal LLC',
    'asesoría jurídica USA',
    'abogado LLC',
    'compliance empresarial',
    'estructura corporativa',
    'legal advice LLC'
  ],
  openGraph: {
    title: 'Consultoría Legal LLC - Open LLC USA',
    description: 'Sesiones personalizadas con expertos legales. $150/hora. Español e inglés.',
    type: 'website',
  },
};

export default function ConsultoriaLegalPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Consultoría Legal para LLCs',
    description: 'Sesiones personalizadas de asesoría legal sobre estructura y compliance de LLCs',
    provider: {
      '@type': 'Organization',
      name: 'Open LLC USA',
    },
    offers: {
      '@type': 'Offer',
      price: '150',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="section-container" style={{ maxWidth: '900px' }}>
          <div className="pricing-hero-eyebrow">SERVICIO INDIVIDUAL</div>
          <h1 className="pricing-hero-title">
            Consultoría Legal<br />
            para tu LLC
          </h1>
          <p className="pricing-hero-subtitle">
            Sesiones personalizadas con expertos en derecho corporativo y estructuras empresariales 
            internacionales. Resolvemos tus dudas sobre compliance, contratos, protección de activos, 
            estrategias fiscales y cualquier tema legal relacionado con tu LLC en Estados Unidos.
          </p>

          <div className="pricing-hero-badges">
            <span className="pricing-pill">
              <Clock size={14} style={{ marginRight: '6px' }} />
              Sesiones de 1 hora
            </span>
            <span className="pricing-pill pricing-pill-secondary">
              <MessageCircle size={14} style={{ marginRight: '6px' }} />
              Español o Inglés
            </span>
            <span className="pricing-pill">
              <Users size={14} style={{ marginRight: '6px' }} />
              Expertos certificados
            </span>
          </div>

          <div className="pricing-hero-cta">
            <a href="#reservar" className="btn btn-primary btn-lg">
              Reservar sesión - $150
            </a>
            <a href="#temas" className="btn btn-white btn-lg">
              Ver temas que cubrimos
            </a>
          </div>

          <p className="pricing-hero-note">
            ✓ Sesión por Zoom o Google Meet • Grabación disponible • Seguimiento por email incluido • 
            Material de referencia
          </p>
        </div>
      </section>

      {/* Para quién es este servicio */}
      <section className="section" style={{ background: 'var(--color-background)' }}>
        <div className="section-container" style={{ maxWidth: '800px' }}>
          <div className="section-header">
            <h2>¿Para quién es este servicio?</h2>
          </div>

          <div className="blog-content">
            <p>
              Esta consultoría es ideal si estás en alguna de estas situaciones:
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginTop: '28px'
            }}>
              {[
                {
                  title: 'Estás comenzando',
                  desc: 'Necesitas orientación sobre qué estado elegir, estructura óptima, o pasos iniciales.'
                },
                {
                  title: 'Ya tienes una LLC',
                  desc: 'Quieres optimizar tu estructura, revisar compliance, o implementar mejores prácticas.'
                },
                {
                  title: 'Buscas expansión',
                  desc: 'Planeas contratar empleados, abrir subsidiarias, o expandirte a otros estados.'
                },
                {
                  title: 'Situaciones complejas',
                  desc: 'Tienes múltiples socios, disputas societarias, o reestructuraciones en curso.'
                }
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'var(--color-surface)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-card-border)'
                }}>
                  <h3 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--color-primary)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Temas que cubrimos */}
      <section id="temas" className="section" style={{ background: '#f6fcfa' }}>
        <div className="section-container" style={{ maxWidth: '1000px' }}>
          <div className="section-header">
            <h2>Temas que cubrimos en las sesiones</h2>
            <p className="section-subtitle">
              Podemos asesorarte en cualquier aspecto legal relacionado con tu LLC
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                icon: <FileText size={32} />,
                title: 'Estructura y formación',
                items: [
                  'Elección del estado más conveniente',
                  'LLC vs Corporation vs Partnership',
                  'Single-member vs Multi-member',
                  'Clasificación fiscal (disregarded entity, S-Corp, C-Corp)'
                ]
              },
              {
                icon: <BookOpen size={32} />,
                title: 'Compliance y regulaciones',
                items: [
                  'Obligaciones estatales y federales',
                  'Reportes anuales y renovaciones',
                  'Licencias y permisos necesarios',
                  'Registros corporativos (actas, resoluciones)'
                ]
              },
              {
                icon: <Users size={32} />,
                title: 'Socios y gobernanza',
                items: [
                  'Operating Agreement personalizado',
                  'Distribución de utilidades y pérdidas',
                  'Entrada y salida de socios',
                  'Resolución de disputas'
                ]
              },
              {
                icon: <Check size={32} />,
                title: 'Protección de activos',
                items: [
                  'Estrategias de blindaje patrimonial',
                  'Separación de responsabilidades',
                  'Seguros recomendados',
                  'Estructuras multi-entidad'
                ]
              },
              {
                icon: <FileText size={32} />,
                title: 'Contratos y acuerdos',
                items: [
                  'Contratos con clientes y proveedores',
                  'NDAs y acuerdos de confidencialidad',
                  'Contratos de trabajo (employees vs contractors)',
                  'Acuerdos de servicio'
                ]
              },
              {
                icon: <MessageCircle size={32} />,
                title: 'Temas fiscales',
                items: [
                  'Optimización de estructura fiscal',
                  'Tratados de doble imposición',
                  'FATCA y CRS compliance',
                  'Estrategias de repatriación de fondos'
                ]
              }
            ].map((category, i) => (
              <div key={i} style={{
                background: 'var(--color-surface)',
                padding: '28px 24px',
                borderRadius: '16px',
                border: '1px solid var(--color-card-border)',
                boxShadow: '0 4px 12px rgba(7,36,55,0.08)'
              }}>
                <div style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>
                  {category.icon}
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 700 }}>
                  {category.title}
                </h3>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {category.items.map((item, j) => (
                    <li key={j} style={{ 
                      fontSize: '14px', 
                      color: 'var(--color-text-secondary)',
                      paddingLeft: '20px',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: 'var(--color-primary)'
                      }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="section">
        <div className="section-container" style={{ maxWidth: '900px' }}>
          <div className="section-header">
            <h2>Cómo funciona la consultoría</h2>
            <p className="section-subtitle">Proceso simple en 4 pasos</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {[
              {
                num: 1,
                title: 'Reserva tu sesión',
                desc: 'Selecciona fecha y hora conveniente. Te enviamos un formulario breve para entender tu situación y preparar la sesión.'
              },
              {
                num: 2,
                title: 'Preparación',
                desc: 'Nuestro equipo revisa tu caso antes de la sesión. Si compartiste documentos, los analizamos previamente para aprovechar mejor el tiempo.'
              },
              {
                num: 3,
                title: 'Sesión en vivo (1 hora)',
                desc: 'Videollamada por Zoom o Google Meet. Resolvemos tus dudas, damos recomendaciones específicas y discutimos estrategias aplicables a tu caso.'
              },
              {
                num: 4,
                title: 'Seguimiento',
                desc: 'Recibes: (1) grabación de la sesión, (2) resumen por escrito de recomendaciones, (3) material de referencia, (4) seguimiento por email durante 7 días.'
              }
            ].map((step) => (
              <div key={step.num} style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
                padding: '24px',
                background: 'var(--color-surface)',
                borderRadius: '14px',
                border: '1px solid var(--color-card-border)'
              }}>
                <div style={{
                  minWidth: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 700
                }}>
                  {step.num}
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{step.title}</h3>
                  <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginBottom: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="section" style={{ background: '#f0f4fa' }}>
        <div className="section-container" style={{ maxWidth: '800px' }}>
          <div className="section-header">
            <h2>¿Por qué consultar con nosotros?</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              {
                title: 'Expertos en no residentes',
                desc: 'Entendemos los desafíos únicos de emprendedores internacionales. Hemos ayudado a cientos de empresarios de Latinoamérica y Europa.'
              },
              {
                title: 'Experiencia práctica',
                desc: 'No solo teoría legal. Te damos recomendaciones basadas en casos reales que hemos manejado exitosamente.'
              },
              {
                title: 'Sin compromiso a largo plazo',
                desc: 'Pagas por sesión. No hay contratos de retainer ni cuotas mensuales. Consultas cuando lo necesites.'
              },
              {
                title: 'Comunicación clara',
                desc: 'Evitamos la jerga legal innecesaria. Explicamos todo en términos simples y prácticos que puedas aplicar.'
              },
              {
                title: 'Respaldo documentado',
                desc: 'Todas nuestras recomendaciones van respaldadas con referencias legales, casos precedentes o regulaciones aplicables.'
              }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'var(--color-surface)',
                padding: '20px 24px',
                borderRadius: '12px',
                border: '1px solid var(--color-card-border)',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  minWidth: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  ✓
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', marginBottom: '6px', fontWeight: 600 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginBottom: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="section" style={{ background: 'var(--color-background)' }}>
        <div className="section-container" style={{ maxWidth: '800px' }}>
          <div className="section-header">
            <h2>Preguntas frecuentes</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              {
                q: '¿Puedo contratar varias horas si necesito más tiempo?',
                a: 'Sí. Si prevés que necesitarás más de 1 hora, puedes reservar un paquete de 2 o 3 horas con descuento. Contáctanos para cotizar.'
              },
              {
                q: '¿Puedo compartir documentos antes de la sesión?',
                a: 'Sí, es recomendable. Envíanos documentos relevantes (Operating Agreement, contratos, declaraciones fiscales) al menos 48 horas antes para que los revisemos.'
              },
              {
                q: '¿La sesión incluye redacción de documentos legales?',
                a: 'La sesión es consultiva. Si necesitas documentos redactados (contratos, acuerdos), podemos cotizarlo por separado después de la sesión.'
              },
              {
                q: '¿Puedo grabar la sesión yo mismo?',
                a: 'Sí. Además, nosotros la grabamos y te la enviamos después. Puedes consultarla cuantas veces quieras.'
              },
              {
                q: '¿Qué pasa si necesito seguimiento después?',
                a: 'Incluimos 7 días de seguimiento por email para dudas puntuales relacionadas con la sesión. Si necesitas una segunda sesión, hay descuento para clientes recurrentes.'
              },
              {
                q: '¿Pueden asistir varios miembros de mi LLC?',
                a: 'Sí. Pueden participar todos los socios/miembros que deseen. No hay cargo adicional por participantes.'
              }
            ].map((faq, i) => (
              <details key={i} style={{
                background: 'var(--color-surface)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid var(--color-card-border)',
                cursor: 'pointer'
              }}>
                <summary style={{
                  fontWeight: 600,
                  fontSize: '16px',
                  marginBottom: '8px',
                  color: 'var(--color-text)'
                }}>
                  {faq.q}
                </summary>
                <p style={{
                  fontSize: '15px',
                  color: 'var(--color-text-secondary)',
                  marginTop: '12px',
                  marginBottom: 0,
                  lineHeight: 1.6
                }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="reservar" className="section cta-section">
        <div className="section-container" style={{ maxWidth: '700px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', marginBottom: '16px' }}>
            Resuelve tus dudas legales con expertos
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', marginBottom: '32px' }}>
            Sesiones personalizadas de 1 hora. Español o inglés.<br />
            Sin compromisos a largo plazo.
          </p>

          <div style={{ 
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px'
          }}>
            <div style={{ fontSize: '48px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              $150 USD
            </div>
            <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', marginBottom: '16px' }}>
              Por sesión de 1 hora
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: 'rgba(255,255,255,0.75)',
              borderTop: '1px solid rgba(255,255,255,0.2)',
              paddingTop: '16px',
              marginTop: '16px'
            }}>
              ✓ Videollamada • ✓ Grabación • ✓ Resumen escrito • ✓ 7 días de seguimiento
            </div>
          </div>

          <a href="/contacto" className="btn btn-white btn-lg" style={{ marginBottom: '16px' }}>
            Reservar mi sesión
          </a>

          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)' }}>
            ¿Prefieres hablar primero? <Link href="/contacto" style={{ color: '#fff', textDecoration: 'underline' }}>
              Contáctanos
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}