import { Metadata } from 'next';
import Link from 'next/link';
import { Check, Clock, Shield, FileText, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Obtención de EIN para No Residentes - $197',
  description: 'Obtén tu número fiscal federal (EIN) sin SSN ni ITIN. Servicio profesional en 5-7 días hábiles. Ideal para LLCs de extranjeros. Incluye certificación IRS.',
  keywords: [
    'obtener EIN sin SSN',
    'EIN para extranjeros',
    'número fiscal USA',
    'EIN para LLC',
    'IRS EIN no residentes',
    'tramitar EIN',
    'EIN internacional'
  ],
  openGraph: {
    title: 'Obtención de EIN - Open LLC USA',
    description: 'Obtén tu EIN sin SSN. Servicio profesional $197. Procesamiento en 5-7 días.',
    type: 'website',
  },
};

export default function ObtencionEINPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Obtención de EIN (Employer Identification Number)',
    description: 'Tramitación de número fiscal federal para empresas LLC de no residentes',
    provider: {
      '@type': 'Organization',
      name: 'Open LLC USA',
    },
    offers: {
      '@type': 'Offer',
      price: '197',
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
            Obtención de EIN<br />
            (Employer Identification Number)
          </h1>
          <p className="pricing-hero-subtitle">
            Obtén tu número fiscal federal para tu empresa LLC en Estados Unidos. 
            Requisito esencial para abrir cuentas bancarias, contratar empleados, 
            presentar impuestos y operar legalmente. <strong>Sin necesidad de SSN o ITIN.</strong>
          </p>

          <div className="pricing-hero-badges">
            <span className="pricing-pill">
              <Clock size={14} style={{ marginRight: '6px' }} />
              Procesamiento: 5-7 días hábiles
            </span>
            <span className="pricing-pill pricing-pill-secondary">
              <Shield size={14} style={{ marginRight: '6px' }} />
              100% Legal y Certificado por IRS
            </span>
          </div>

          <div className="pricing-hero-cta">
            <a href="obtencion-ein/onboarding" className="btn btn-primary btn-lg">
              Contratar por $197
            </a>
            <a href="#como-funciona" className="btn btn-white btn-lg">
              Ver cómo funciona
            </a>
          </div>

          <p className="pricing-hero-note">
            ✓ Incluye: Tramitación completa ante el IRS • Carta de confirmación oficial • 
            Seguimiento personalizado • Soporte en español
          </p>
        </div>
      </section>

      {/* ¿Qué es el EIN? */}
      <section className="section" style={{ background: 'var(--color-background)' }}>
        <div className="section-container" style={{ maxWidth: '800px' }}>
          <div className="section-header">
            <h2>¿Qué es el EIN y por qué lo necesitas?</h2>
          </div>

          <div className="blog-content">
            <p>
              El <strong>EIN (Employer Identification Number)</strong> es el número de identificación 
              fiscal que el IRS (Internal Revenue Service) asigna a las empresas en Estados Unidos. 
              Es equivalente al "RUC" en Perú, "RFC" en México o "NIF" en España.
            </p>

            <h3>Sin EIN, NO puedes:</h3>
            <ul>
              <li>Abrir una cuenta bancaria empresarial en Estados Unidos</li>
              <li>Contratar empleados o contratistas</li>
              <li>Presentar declaraciones de impuestos federales</li>
              <li>Recibir pagos de clientes corporativos (muchos lo requieren)</li>
              <li>Solicitar licencias comerciales estatales</li>
            </ul>

            <div style={{ 
              background: 'var(--color-bg-1)', 
              padding: '20px', 
              borderRadius: '12px',
              marginTop: '24px'
            }}>
              <h4 style={{ marginBottom: '12px', fontSize: '18px' }}>
                <AlertCircle size={20} style={{ display: 'inline', marginRight: '8px', color: 'var(--color-primary)' }} />
                Importante para extranjeros
              </h4>
              <p style={{ marginBottom: 0 }}>
                La buena noticia: <strong>NO necesitas SSN (Social Security Number) ni ITIN</strong> para 
                obtener el EIN si tu LLC tiene al menos un miembro extranjero. Nosotros nos encargamos 
                de todo el proceso con el IRS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Qué incluye el servicio */}
      <section className="section" style={{ background: '#f6fcfa' }}>
        <div className="section-container" style={{ maxWidth: '1000px' }}>
          <div className="section-header">
            <h2>¿Qué incluye este servicio?</h2>
            <p className="section-subtitle">Todo lo necesario para obtener tu EIN de forma rápida y segura</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                icon: <FileText size={32} />,
                title: 'Formulario SS-4 completo',
                desc: 'Preparamos y presentamos el Formulario SS-4 ante el IRS con toda tu información correcta.'
              },
              {
                icon: <Shield size={32} />,
                title: 'Tramitación oficial',
                desc: 'Nos comunicamos directamente con el IRS en tu nombre. Tú solo proporcionas los datos.'
              },
              {
                icon: <Check size={32} />,
                title: 'Carta de confirmación',
                desc: 'Recibes la carta oficial del IRS (CP 575) con tu número EIN asignado.'
              },
              {
                icon: <Clock size={32} />,
                title: 'Seguimiento diario',
                desc: 'Te mantenemos informado del estado de tu solicitud todos los días.'
              }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'var(--color-surface)',
                padding: '28px 24px',
                borderRadius: '16px',
                border: '1px solid var(--color-card-border)',
                boxShadow: '0 4px 12px rgba(7,36,55,0.08)'
              }}>
                <div style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginBottom: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="section">
        <div className="section-container" style={{ maxWidth: '900px' }}>
          <div className="section-header">
            <h2>Proceso de obtención del EIN</h2>
            <p className="section-subtitle">3 pasos simples. Lo hacemos todo por ti.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {[
              {
                num: 1,
                title: 'Completa el formulario',
                desc: 'Nos proporcionas la información básica de tu LLC: nombre legal, dirección registrada, miembros, etc. Solo te toma 10 minutos.'
              },
              {
                num: 2,
                title: 'Nosotros tramitamos ante el IRS',
                desc: 'Preparamos el Formulario SS-4 y lo presentamos directamente al IRS. Gestionamos toda la comunicación oficial.'
              },
              {
                num: 3,
                title: 'Recibes tu EIN',
                desc: 'En 5-7 días hábiles recibes tu número EIN y la carta oficial CP 575 del IRS. Listo para abrir tu cuenta bancaria.'
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

      {/* Preguntas frecuentes */}
      <section className="section" style={{ background: '#f0f4fa' }}>
        <div className="section-container" style={{ maxWidth: '800px' }}>
          <div className="section-header">
            <h2>Preguntas frecuentes</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              {
                q: '¿Necesito tener SSN o ITIN?',
                a: 'No. Si tu LLC tiene al menos un miembro extranjero (sin SSN), podemos obtener el EIN sin problema. Es uno de los beneficios de formar una LLC como no residente.'
              },
              {
                q: '¿Cuánto tarda el proceso?',
                a: 'Normalmente 5-7 días hábiles desde que presentamos la solicitud al IRS. En casos excepcionales puede tardar hasta 10 días.'
              },
              {
                q: '¿Qué necesito para empezar?',
                a: 'Solo necesitas: (1) los documentos de formación de tu LLC, (2) una copia de tu pasaporte, (3) una dirección en USA (puede ser tu agente registrado).'
              },
              {
                q: '¿Puedo usar el EIN para abrir cuenta bancaria?',
                a: 'Sí, el EIN es requisito obligatorio para abrir cuentas bancarias empresariales en bancos como Mercury, Relay, Wise Business, etc.'
              },
              {
                q: '¿Tiene costo adicional si mi LLC tiene varios miembros?',
                a: 'No. El precio de $197 es fijo independientemente del número de miembros que tenga tu LLC.'
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
      <section id="contratar" className="section cta-section">
        <div className="section-container" style={{ maxWidth: '700px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', marginBottom: '16px' }}>
            ¿Listo para obtener tu EIN?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', marginBottom: '32px' }}>
            Tramitación profesional en 5-7 días. Sin SSN ni ITIN requerido.<br />
            Soporte en español incluido.
          </p>

          <div style={{ 
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px'
          }}>
            <div style={{ fontSize: '48px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              $197 USD
            </div>
            <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)' }}>
              Pago único • Sin costos ocultos
            </div>
          </div>

          <a href="/servicios/obtencion-ein/onboarding" className="btn btn-white btn-lg" style={{ marginBottom: '16px' }}>
            Contratar servicio ahora
          </a>

          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)' }}>
            ¿Tienes dudas? <Link href="/contacto" style={{ color: '#fff', textDecoration: 'underline' }}>
              Contáctanos
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}