import { Metadata } from 'next';
import Link from 'next/link';
import { Check, Clock, Shield, FileText, AlertTriangle, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Declaración de Impuestos Form 1120 + 5472 - $297',
  description: 'Presentación anual del Formulario 1120 y 5472 ante el IRS para LLCs de no residentes. Servicio profesional con CPA certificado. Cumplimiento fiscal garantizado.',
  keywords: [
    'Form 1120 LLC',
    'Form 5472 extranjeros',
    'declaración impuestos USA',
    'tax return LLC',
    'IRS compliance',
    'impuestos LLC no residentes'
  ],
  openGraph: {
    title: 'Declaración Anual Form 1120 + 5472 - Open LLC USA',
    description: 'Presentación profesional de impuestos para LLCs. $297 USD. CPA certificado.',
    type: 'website',
  },
};

export default function Form54721120Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Declaración de Impuestos Form 1120 + 5472',
    description: 'Presentación anual de formularios fiscales para LLCs de no residentes ante el IRS',
    provider: {
      '@type': 'Organization',
      name: 'Open LLC USA',
    },
    offers: {
      '@type': 'Offer',
      price: '297',
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
            Declaración de Impuestos<br />
            Form 1120 + Form 5472
          </h1>
          <p className="pricing-hero-subtitle">
            Cumple con tus obligaciones fiscales ante el IRS. Presentación profesional de los 
            Formularios 1120 (Corporate Income Tax Return) y 5472 (Information Return of a 25% 
            Foreign-Owned U.S. Corporation). <strong>Obligatorio para LLCs de no residentes</strong>, 
            incluso sin ingresos.
          </p>

          <div className="pricing-hero-badges">
            <span className="pricing-pill">
              <Clock size={14} style={{ marginRight: '6px' }} />
              Deadline: 15 de marzo (o 15 de abril)
            </span>
            <span className="pricing-pill pricing-pill-secondary">
              <Shield size={14} style={{ marginRight: '6px' }} />
              Preparado por CPA certificado
            </span>
            <span className="pricing-pill">
              <AlertTriangle size={14} style={{ marginRight: '6px' }} />
              Evita multas de hasta $25,000
            </span>
          </div>

          <div className="pricing-hero-cta">
            <a href="#contratar" className="btn btn-primary btn-lg">
              Contratar por $297
            </a>
            <a href="#por-que-necesito" className="btn btn-white btn-lg">
              ¿Por qué lo necesito?
            </a>
          </div>

          <p className="pricing-hero-note">
            ✓ Incluye: Form 1120 • Form 5472 • Revisión completa • Presentación electrónica ante IRS • 
            Confirmación de recepción • Soporte en español
          </p>
        </div>
      </section>

      {/* Por qué necesitas estos formularios */}
      <section id="por-que-necesito" className="section" style={{ background: 'var(--color-background)' }}>
        <div className="section-container" style={{ maxWidth: '800px' }}>
          <div className="section-header">
            <h2>¿Por qué debo presentar el Form 1120 y 5472?</h2>
          </div>

          <div className="blog-content">
            <p>
              Si tu LLC tiene al menos un 25% de propiedad extranjera, el IRS te obliga a presentar 
              estos formularios <strong>CADA AÑO</strong>, incluso si:
            </p>

            <ul>
              <li>Tu LLC no tuvo ingresos</li>
              <li>Tu LLC no operó durante el año fiscal</li>
              <li>Tu LLC está inactiva</li>
              <li>Todos tus ingresos fueron fuera de Estados Unidos</li>
            </ul>

            <h3>Form 1120 - U.S. Corporation Income Tax Return</h3>
            <p>
              Es la declaración anual de impuestos corporativos. Reporta los ingresos, gastos, 
              ganancias o pérdidas de tu LLC. Si tu LLC está clasificada como corporación 
              (C-Corp o S-Corp ante el IRS), este formulario es obligatorio.
            </p>

            <h3>Form 5472 - Information Return</h3>
            <p>
              Este formulario reporta las transacciones entre tu LLC y sus dueños extranjeros 
              o partes relacionadas. El IRS lo usa para asegurar que las transacciones sean 
              legítimas y estén correctamente reportadas.
            </p>

            <div style={{ 
              background: 'var(--color-bg-4)', 
              padding: '20px', 
              borderRadius: '12px',
              marginTop: '24px',
              border: '2px solid var(--color-error)'
            }}>
              <h4 style={{ marginBottom: '12px', fontSize: '18px', color: 'var(--color-error)' }}>
                <AlertTriangle size={20} style={{ display: 'inline', marginRight: '8px' }} />
                Multas por no presentar
              </h4>
              <p style={{ marginBottom: 0 }}>
                La multa por no presentar el Form 5472 es de <strong>$25,000 por cada formulario 
                no presentado</strong>. Si presentas tarde, la multa puede reducirse a $10,000. 
                No lo dejes para después.
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
            <p className="section-subtitle">Presentación completa y profesional de tus declaraciones fiscales</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                icon: <FileText size={32} />,
                title: 'Form 1120 completo',
                desc: 'Preparación del formulario de declaración de impuestos corporativos con todos los anexos necesarios.'
              },
              {
                icon: <FileText size={32} />,
                title: 'Form 5472 completo',
                desc: 'Reporte de transacciones con partes relacionadas extranjeras, requerido para LLCs con dueños no residentes.'
              },
              {
                icon: <Check size={32} />,
                title: 'Revisión por CPA',
                desc: 'Un Contador Público Certificado (CPA) revisa toda la información antes de presentarla al IRS.'
              },
              {
                icon: <Shield size={32} />,
                title: 'Presentación electrónica',
                desc: 'Enviamos los formularios directamente al IRS por vía electrónica y obtenemos confirmación de recepción.'
              },
              {
                icon: <Clock size={32} />,
                title: 'Cumplimiento de plazos',
                desc: 'Nos aseguramos de presentar antes del deadline para evitar multas y recargos.'
              },
              {
                icon: <DollarSign size={32} />,
                title: 'Consultoría incluida',
                desc: 'Respondemos tus dudas sobre deducciones, clasificación fiscal y estrategias de ahorro.'
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
      <section className="section">
        <div className="section-container" style={{ maxWidth: '900px' }}>
          <div className="section-header">
            <h2>Proceso de declaración fiscal</h2>
            <p className="section-subtitle">4 pasos. Lo hacemos todo por ti.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {[
              {
                num: 1,
                title: 'Recopilamos tu información',
                desc: 'Te enviamos un cuestionario simple para recopilar los datos de tu LLC: ingresos, gastos, transacciones con los dueños, etc.'
              },
              {
                num: 2,
                title: 'Preparamos los formularios',
                desc: 'Nuestro equipo de contadores prepara el Form 1120 y Form 5472 con toda tu información. Optimizamos deducciones legales.'
              },
              {
                num: 3,
                title: 'Revisión y aprobación',
                desc: 'Un CPA certificado revisa los formularios y te los envía para tu aprobación final antes de presentar al IRS.'
              },
              {
                num: 4,
                title: 'Presentación al IRS',
                desc: 'Presentamos electrónicamente al IRS y te enviamos la confirmación de recepción. Guardamos copias para tus archivos.'
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

      {/* Fechas límite */}
      <section className="section" style={{ background: '#fff8e1' }}>
        <div className="section-container" style={{ maxWidth: '800px' }}>
          <div className="section-header">
            <h2>Fechas límite importantes</h2>
          </div>

          <div style={{
            background: 'var(--color-surface)',
            padding: '32px',
            borderRadius: '16px',
            border: '2px solid var(--color-warning)'
          }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>
              <Clock size={24} style={{ display: 'inline', marginRight: '8px', color: 'var(--color-warning)' }} />
              Deadlines del IRS
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ 
                padding: '16px',
                background: 'var(--color-bg-2)',
                borderRadius: '10px',
                borderLeft: '4px solid var(--color-warning)'
              }}>
                <strong style={{ fontSize: '18px', display: 'block', marginBottom: '6px' }}>
                  15 de marzo
                </strong>
                <p style={{ marginBottom: 0, color: 'var(--color-text-secondary)' }}>
                  Para LLCs clasificadas como <strong>C-Corp</strong> ante el IRS
                </p>
              </div>

              <div style={{ 
                padding: '16px',
                background: 'var(--color-bg-2)',
                borderRadius: '10px',
                borderLeft: '4px solid var(--color-warning)'
              }}>
                <strong style={{ fontSize: '18px', display: 'block', marginBottom: '6px' }}>
                  15 de abril
                </strong>
                <p style={{ marginBottom: 0, color: 'var(--color-text-secondary)' }}>
                  Para LLCs clasificadas como <strong>S-Corp</strong> o single-member LLC
                </p>
              </div>

              <div style={{ 
                padding: '16px',
                background: 'var(--color-bg-3)',
                borderRadius: '10px',
                borderLeft: '4px solid var(--color-success)'
              }}>
                <strong style={{ fontSize: '16px', display: 'block', marginBottom: '6px' }}>
                  ✓ Extensión automática disponible
                </strong>
                <p style={{ marginBottom: 0, fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                  Si no llegas al deadline, podemos solicitar una extensión de 6 meses 
                  (hasta el 15 de septiembre u octubre).
                </p>
              </div>
            </div>
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
                q: '¿Debo presentar si mi LLC no tuvo ingresos?',
                a: 'Sí. Si tu LLC tiene propietarios extranjeros (25% o más), debes presentar el Form 5472 incluso sin ingresos. Es una obligación informativa, no sobre impuestos.'
              },
              {
                q: '¿Qué sucede si no presento estos formularios?',
                a: 'El IRS puede multarte con $25,000 por cada Form 5472 no presentado, más $10,000 adicionales si continúas sin presentar tras la notificación. No vale la pena el riesgo.'
              },
              {
                q: '¿Qué información necesitan de mí?',
                a: 'Necesitamos: estado de resultados (ingresos y gastos), transacciones con los dueños, información bancaria, deducciones aplicables, y detalles sobre activos/pasivos.'
              },
              {
                q: '¿Puedo deducir gastos si operé desde fuera de USA?',
                a: 'Sí. Puedes deducir gastos legítimos relacionados con tu negocio: software, servicios profesionales, marketing, viajes de negocios, etc.'
              },
              {
                q: '¿Este servicio incluye impuestos estatales?',
                a: 'No. Este servicio cubre solo la declaración federal (IRS). Los impuestos estatales dependen del estado donde está registrada tu LLC. Consúltanos para más info.'
              },
              {
                q: '¿Cuánto tiempo toma el proceso?',
                a: 'Una vez que nos proporcionas toda la información, preparamos los formularios en 3-5 días hábiles. Luego los presentamos al IRS electrónicamente.'
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
            Cumple con el IRS sin complicaciones
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', marginBottom: '32px' }}>
            Presentación profesional del Form 1120 + 5472.<br />
            Evita multas de hasta $25,000. CPA certificado.
          </p>

          <div style={{ 
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px'
          }}>
            <div style={{ fontSize: '48px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              $297 USD
            </div>
            <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)' }}>
              Servicio anual • Form 1120 + 5472 incluidos
            </div>
          </div>

          <a href="/contacto" className="btn btn-white btn-lg" style={{ marginBottom: '16px' }}>
            Contratar servicio ahora
          </a>

          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)' }}>
            ¿Tienes dudas? <Link href="/contacto" style={{ color: '#fff', textDecoration: 'underline' }}>
              Habla con nuestro equipo
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}