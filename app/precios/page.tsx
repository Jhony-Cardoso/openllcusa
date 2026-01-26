// app/precios/page.tsx
import type { Metadata } from 'next';

const SITE_URL = 'https://openllcusa.com'; // TODO: cambia por tu dominio real
const BRAND_NAME = 'Open LLC USA'; // TODO: cambia por tu marca

export const metadata: Metadata = {
  title: 'Precios para crear y mantener tu LLC en Estados Unidos | ' + BRAND_NAME,
  description:
    'Precios claros para formar, mantener y optimizar tu LLC en Estados Unidos desde España. ' +
    'Planes desde 597 USD + tasas. Comparativa transparente frente a EZFrontiers, Circle Club, Openbiz y LLC Hub.',
  alternates: {
    canonical: `${SITE_URL}/precios`,
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/precios`,
    title: 'Precios claros para tu LLC en EE. UU. | ' + BRAND_NAME,
    description:
      'Formar, mantener y optimizar tu LLC en Estados Unidos con precios cerrados, soporte en español y foco en residentes en España.',
    siteName: BRAND_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Precios para crear tu LLC en Estados Unidos',
    description:
      'Planes por etapas: Formar, Mantener y Optimizar tu LLC en EE. UU. desde España, sin letra pequeña.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: BRAND_NAME,
  url: SITE_URL,
  description:
    'Servicio especializado en creación y mantenimiento de LLC en Estados Unidos para residentes en España y otros no residentes.',
  areaServed: [
    {
      '@type': 'Country',
      name: 'Spain',
    },
    {
      '@type': 'Country',
      name: 'Mexico',
    },
    {
      '@type': 'Country',
      name: 'Argentina',
    },
  ],
  serviceType: 'US LLC formation and compliance for non-US residents',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Planes de formación y mantenimiento de LLC en EE. UU.',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'LLC Esencial',
        price: '597',
        priceCurrency: 'USD',
        category: 'Formar',
      },
      {
        '@type': 'Offer',
        name: 'Launch + Banking',
        price: '897',
        priceCurrency: 'USD',
        category: 'Formar',
      },
      {
        '@type': 'Offer',
        name: 'Primer Año Pro',
        price: '1397',
        priceCurrency: 'USD',
        category: 'Formar',
      },
      {
        '@type': 'Offer',
        name: 'Plan Compliance Básico',
        price: '49',
        priceCurrency: 'USD',
        category: 'Mantener',
      },
      {
        '@type': 'Offer',
        name: 'Plan Crecimiento',
        price: '129',
        priceCurrency: 'USD',
        category: 'Mantener',
      },
      {
        '@type': 'Offer',
        name: 'Pack Optimización España–EE. UU.',
        price: '397',
        priceCurrency: 'USD',
        category: 'Optimizar',
      },
    ],
  },
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="pricing-page">
        {/* HERO PRICING */}
        <section className="pricing-hero">
          <div className="section-container">
            <p className="pricing-hero-eyebrow">
              Formar · Mantener · Optimizar tu LLC en EE. UU.
            </p>
            <h1 className="pricing-hero-title">
              Precios claros para crear y mantener tu LLC en Estados Unidos desde tu país
            </h1>
            <p className="pricing-hero-subtitle">
              Sin letra pequeña, sin paquetes confusos. Eliges el nivel de acompañamiento que
              necesitas hoy y siempre sabrás qué incluye cada euro que pagas.
            </p>
            <div className="pricing-hero-badges">
              <span className="pricing-pill">
                Desde 597 USD + tasas para formar tu LLC
              </span>
              <span className="pricing-pill pricing-pill-secondary">
                Planes mensuales desde 49 USD/mes para mantenerla al día
              </span>
            </div>
            <div className="pricing-hero-cta">
              <a href="/contacto" className="btn btn-primary btn-lg">
                Reservar consultoría gratuita
              </a>
              <a href="#comparativa" className="btn btn-white btn-lg">
                Ver comparativa con otros proveedores
              </a>
            </div>
            <p className="pricing-hero-note">
              Competidores como EZFrontiers, Circle Club u Openbiz se mueven entre 499 y 699 USD
              solo por la formación inicial. Nosotros te damos más contexto fiscal España–EE. UU.
              manteniendo un precio competitivo.
            </p>
          </div>
        </section>

        {/* ETAPA 1: FORMAR */}
        <section className="section pricing-section" aria-labelledby="formar-heading">
          <div className="section-container">
            <header className="section-header">
              <h2 id="formar-heading">1. Formar tu LLC en Estados Unidos</h2>
              <p className="section-subtitle">
                Empezamos por lo esencial: elegir bien el estado, crear tu LLC, conseguir tu EIN y
                dejar listos los documentos que te van a pedir bancos, pasarelas de pago y
                clientes.
              </p>
            </header>

            <div className="pricing-grid">
              {/* LLC ESENCIAL */}
              <article className="pricing-card">
                <div className="pricing-card-header">
                  <h3>LLC Esencial</h3>
                  <p className="pricing-card-tag">Para validar tu negocio sin complicarte</p>
                  <p className="pricing-card-price">
                    <span className="pricing-card-amount">597 USD</span>
                    <span className="pricing-card-label">+ tasas estatales · pago único</span>
                  </p>
                  <p className="pricing-card-anchor">
                    Referencia: EZFrontiers (699 USD) o Circle Club (647 USD) por servicios
                    comparables.
                  </p>
                </div>
                <div className="pricing-card-body">
                  <p className="pricing-card-description">
                    Creación de tu LLC en el estado correcto, EIN y documentación base listos para
                    operar online, con todo explicado en español y pensando en Hacienda España.
                  </p>
                  <ul className="pricing-card-features">
                    <li>Constitución de tu LLC en el estado óptimo (Wyoming, Delaware u otro).</li>
                    <li>Obtención de tu EIN aunque no tengas SSN o ITIN.</li>
                    <li>
                      Operating agreement y documentos esenciales listos para bancos y clientes.
                    </li>
                    <li>1 año de agente registrado y dirección básica oficial.</li>
                    <li>
                      Guía clara sobre impuestos básicos, BOIR y relación con Hacienda España.
                    </li>
                  </ul>
                  <div className="pricing-card-cta">
                    <a href="/paquetes/llc-esencial/onboarding" className="btn btn-primary">
                      Empezar con LLC Esencial
                    </a>
                    <p className="pricing-card-footnote">
                      Ideal si quieres arrancar lean y luego ampliar con planes de mantenimiento.
                    </p>
                  </div>
                </div>
              </article>

              {/* LAUNCH + BANKING */}
              <article className="pricing-card pricing-card-featured">
                <div className="pricing-card-header">
                  <div className="pricing-card-badge">Plan más elegido</div>
                  <h3>Launch + Banking</h3>
                  <p className="pricing-card-tag">
                    Para lanzar y cobrar con tu LLC desde el primer mes
                  </p>
                  <p className="pricing-card-price">
                    <span className="pricing-card-amount">897 USD</span>
                    <span className="pricing-card-label">+ tasas estatales · pago único</span>
                  </p>
                  <p className="pricing-card-anchor">
                    Menos que combinar varios servicios sueltos de Circle Club u Openbiz, con más
                    foco en negocios digitales desde España.
                  </p>
                </div>
                <div className="pricing-card-body">
                  <p className="pricing-card-description">
                    Todo lo de LLC Esencial más acompañamiento para abrir tu cuenta bancaria o
                    fintech y una sesión 1:1 para diseñar tu estrategia fiscal básica España–
                    Estados Unidos.
                  </p>
                  <ul className="pricing-card-features">
                    <li>Todo lo incluido en LLC Esencial.</li>
                    <li>
                      Acompañamiento para apertura de cuenta en banca online o fintech alineadas
                      con no residentes.
                    </li>
                    <li>
                      Revisión de tu primera factura y estructura de cobros a clientes
                      internacionales.
                    </li>
                    <li>
                      Sesión 1:1 de 45–60 minutos para definir estado, banco y enfoque fiscal
                      inicial.
                    </li>
                    <li>
                      Checklist de lanzamiento: de “LLC creada” a “LLC facturando” sin pasos
                      ocultos.
                    </li>
                  </ul>
                  <div className="pricing-card-cta">
                    <a href="/paquetes/launch-banking/onboarding" className="btn btn-primary">
                      Lanzar mi LLC con acompañamiento
                    </a>
                    <p className="pricing-card-footnote">
                      Recomendado si tu objetivo es facturar en los próximos 30–60 días.
                    </p>
                  </div>
                </div>
              </article>

              {/* PRIMER AÑO PRO */}
              <article className="pricing-card">
                <div className="pricing-card-header">
                  <h3>Primer Año Pro</h3>
                  <p className="pricing-card-tag">Primer año casi todo resuelto</p>
                  <p className="pricing-card-price">
                    <span className="pricing-card-amount">1.397 USD</span>
                    <span className="pricing-card-label">+ tasas estatales · primer año</span>
                  </p>
                  <p className="pricing-card-anchor">
                    Alternativa más ligera a paquetes de 1.200–3.997 USD/año de Openbiz para
                    impuestos y contabilidad.
                  </p>
                </div>
                <div className="pricing-card-body">
                  <p className="pricing-card-description">
                    Pensado para que en tu primer año no se te pase ningún plazo: BOIR,
                    obligaciones estatales y dudas operativas resueltas sin que tengas que estar
                    persiguiendo a nadie.
                  </p>
                  <ul className="pricing-card-features">
                    <li>Todo lo incluido en Launch + Banking.</li>
                    <li>Preparación y presentación del BOIR dentro de plazo.</li>
                    <li>
                      Gestión del reporte o impuesto anual estatal (nuestros honorarios incluidos,
                      tasas aparte).
                    </li>
                    <li>
                      Soporte prioritario por email/WhatsApp para dudas operativas y fiscales del
                      día a día.
                    </li>
                    <li>
                      Revisión básica de tu contabilidad hasta un volumen máximo de movimientos.
                    </li>
                  </ul>
                  <div className="pricing-card-cta">
                    <a href="/paquetes/primer-ano-pro/onboarding" className="btn btn-primary">
                      Quiero olvidarme del primer año
                    </a>
                    <p className="pricing-card-footnote">
                      Puedes pasar a un plan mensual de mantenimiento al terminar el primer año.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* BANNER FACILIDADES DE PAGO */}
        <section className="pricing-payment-banner-section" aria-label="Facilidades de pago">
          <div className="section-container">
            <div className="pricing-payment-banner">
              <div className="pricing-payment-icon">
                <span aria-hidden="true">💳</span>
              </div>
              <div className="pricing-payment-content">
                <p className="pricing-payment-title">Facilidades de pago</p>
                <p className="pricing-payment-text">
                  Al efectuar el pago, la pasarela de Stripe podrá ofrecerte la posibilidad de
                  fraccionar el importe en cuotas mensuales, según disponibilidad en tu país y
                  método de pago.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ETAPA 2: MANTENER */}
        <section className="section pricing-section" aria-labelledby="mantener-heading">
          <div className="section-container">
            <header className="section-header">
              <h2 id="mantener-heading">2. Mantener tu LLC al día</h2>
              <p className="section-subtitle">
                Si tu LLC ya está creada, estos planes te ayudan a no perder plazos ni pagar multas
                absurdas por despistes con el estado o el IRS.
              </p>
            </header>

            <div className="pricing-grid pricing-grid-two">
              {/* PLAN COMPLIANCE BÁSICO */}
              <article className="pricing-card">
                <div className="pricing-card-header">
                  <h3>Plan Compliance Básico</h3>
                  <p className="pricing-card-tag">Lo mínimo para estar tranquilo</p>
                  <p className="pricing-card-price">
                    <span className="pricing-card-amount">49 USD</span>
                    <span className="pricing-card-label">al mes · sin permanencia</span>
                  </p>
                  <p className="pricing-card-anchor">
                    Equivalente a pagar unos 588 USD/año, frente a planes desde 600 USD/año de LLC
                    Hub solo por mantenimiento básico.
                  </p>
                </div>
                <div className="pricing-card-body">
                  <p className="pricing-card-description">
                    Para quien quiere que alguien vigile plazos y obligaciones mínimas de su LLC en
                    Estados Unidos, pero mantiene la contabilidad en otra parte.
                  </p>
                  <ul className="pricing-card-features">
                    <li>Agente registrado y dirección básica mientras el plan esté activo.</li>
                    <li>
                      Recordatorios y guía detallada para annual report o impuesto de franquicia en
                      tu estado.
                    </li>
                    <li>Checklist para BOIR y otros formularios informativos clave.</li>
                    <li>Soporte por email para dudas recurrentes sobre obligaciones mínimas.</li>
                    <li>Sin permanencia: puedes pausar o cambiar de plan cuando lo necesites.</li>
                  </ul>
                  <div className="pricing-card-cta">
                    <a href="/paquetes/compliance-basico/onboarding" className="btn btn-primary">
                      Activar Compliance Básico
                    </a>
                  </div>
                </div>
              </article>

              {/* PLAN CRECIMIENTO */}
              <article className="pricing-card">
                <div className="pricing-card-header">
                  <h3>Plan Crecimiento</h3>
                  <p className="pricing-card-tag">Compliance + contabilidad ligera</p>
                  <p className="pricing-card-price">
                    <span className="pricing-card-amount">129 USD</span>
                    <span className="pricing-card-label">al mes · para negocios en marcha</span>
                  </p>
                  <p className="pricing-card-anchor">
                    Alternativa accesible frente a planes completos de hasta 3.997–6.000 USD/año de
                    otros proveedores.
                  </p>
                </div>
                <div className="pricing-card-body">
                  <p className="pricing-card-description">
                    Para negocios online que ya facturan de forma recurrente y quieren números
                    claros mes a mes sin pagar un despacho completo en Estados Unidos.
                  </p>
                  <ul className="pricing-card-features">
                    <li>Todo lo incluido en el Plan Compliance Básico.</li>
                    <li>
                      Conciliación mensual básica hasta un número definido de movimientos al mes.
                    </li>
                    <li>Informe trimestral con resumen de ingresos, gastos y márgenes.</li>
                    <li>
                      Una sesión estratégica anual para revisar estructura y planificación fiscal
                      internacional.
                    </li>
                    <li>
                      Preparación de documentación base para tu asesor en España si lo necesitas.
                    </li>
                  </ul>
                  <div className="pricing-card-cta">
                    <a href="/paquetes/plan-crecimiento/onboarding" className="btn btn-primary">
                      Quiero mantener y crecer
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ETAPA 3: OPTIMIZAR */}
        <section className="section pricing-section" aria-labelledby="optimizar-heading">
          <div className="section-container">
            <header className="section-header">
              <h2 id="optimizar-heading">3. Optimizar impuestos y estructura</h2>
              <p className="section-subtitle">
                Cuando ya generas ingresos, el retorno está en tomar mejores decisiones fiscales y
                de estructura, no en ahorrar 50 USD en el agente registrado.
              </p>
            </header>

            <div className="pricing-grid pricing-grid-two">
              {/* PACK OPTIMIZACIÓN */}
              <article className="pricing-card">
                <div className="pricing-card-header">
                  <h3>Pack Optimización España–EE. UU.</h3>
                  <p className="pricing-card-tag">Diagnóstico y plan de acción</p>
                  <p className="pricing-card-price">
                    <span className="pricing-card-amount">397 USD</span>
                    <span className="pricing-card-label">pago único</span>
                  </p>
                </div>
                <div className="pricing-card-body">
                  <p className="pricing-card-description">
                    Una revisión de tu situación actual en España y Estados Unidos, con un plan
                    estructurado por escrito y una sesión para que salgas sin dudas pendientes.
                  </p>
                  <ul className="pricing-card-features">
                    <li>
                      Cuestionario previo para entender tu negocio, modelo de ingresos y
                      jurisdicciones.
                    </li>
                    <li>
                      Informe escrito con recomendaciones concretas de estructura, estados y bancos.
                    </li>
                    <li>
                      Sesión 1:1 de hasta 90 minutos para revisar el informe y resolver dudas.
                    </li>
                    <li>
                      Priorización de acciones para los próximos 12 meses (quick wins y cambios
                      estructurales).
                    </li>
                  </ul>
                  <div className="pricing-card-cta">
                    <a href="/paquetes/pack-optimizacion/onboarding" className="btn btn-primary">
                      Quiero revisar mi estructura
                    </a>
                  </div>
                </div>
              </article>

              {/* ASESORÍA CONTINUA */}
              <article className="pricing-card">
                <div className="pricing-card-header">
                  <h3>Asesoría continua de alto valor</h3>
                  <p className="pricing-card-tag">Para cuando tu LLC ya es clave</p>
                  <p className="pricing-card-price">
                    <span className="pricing-card-amount">997 USD</span>
                    <span className="pricing-card-label">al año · o desde 97 USD/mes</span>
                  </p>
                </div>
                <div className="pricing-card-body">
                  <p className="pricing-card-description">
                    Pensado para fundadores que prefieren tomar decisiones apoyados en alguien que
                    vive día a día las fricciones entre Estados Unidos y España.
                  </p>
                  <ul className="pricing-card-features">
                    <li>Bolsa de horas de consultoría avanzada al año.</li>
                    <li>
                      Revisión anual de tu estructura para ajustar estados, bancos y flujos de
                      cobro.
                    </li>
                    <li>
                      Soporte para casos puntuales de expansión, inversión o cambio de residencia.
                    </li>
                    <li>
                      Coordinación básica con tu asesoría en España cuando sea necesario.
                    </li>
                  </ul>
                  <div className="pricing-card-cta">
                    <a href="/contacto" className="btn btn-primary">
                      Hablar sobre asesoría continua
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* TABLA COMPARATIVA */}
        <section
          id="comparativa"
          className="section pricing-section pricing-compare-section"
          aria-labelledby="comparativa-heading"
        >
          <div className="section-container">
            <header className="section-header">
              <h2 id="comparativa-heading">Comparativa rápida con otros proveedores</h2>
              <p className="section-subtitle">
                Números aproximados de mercado para que veas en qué rango nos movemos frente a otros
                proveedores populares en el mundo hispano.
              </p>
            </header>

            <div className="pricing-compare">
              <table className="pricing-compare-table">
                <thead>
                  <tr>
                    <th>Proveedor</th>
                    <th>Precio entrada LLC</th>
                    <th>Tipo de acompañamiento</th>
                    <th>Fiscalidad España–EE. UU.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Nosotros</td>
                    <td>Desde 597 USD + tasas</td>
                    <td>
                      Por etapas: Formar, Mantener y Optimizar. Soporte en español pensando en
                      residentes en España.
                    </td>
                    <td>Explicada de forma explícita en todos los planes.</td>
                  </tr>
                  <tr>
                    <td>EZFrontiers</td>
                    <td>≈699 USD + tasas</td>
                    <td>Paquete cerrrado de creación de LLC con foco en no residentes.</td>
                    <td>
                      Contenido educativo potente, pero orientación fiscal personalizada suele ir
                      aparte.
                    </td>
                  </tr>
                  <tr>
                    <td>Circle Club</td>
                    <td>647 USD + tasas (plan Essential)</td>
                    <td>Paquetes con fuerte enfoque en ahorro fiscal y acompañamiento.</td>
                    <td>
                      Fuerte foco comercial en fiscalidad, pero menos desglosado por etapas.
                    </td>
                  </tr>
                  <tr>
                    <td>Openbiz</td>
                    <td>≈599 USD + tasas (incorporación)</td>
                    <td>
                      Escala rápido a 1.200–3.997 USD/año cuando entra impuestos y contabilidad.
                    </td>
                    <td>
                      Muy completo, pero concentrado en planes anuales altos más que en tickets
                      intermedios.
                    </td>
                  </tr>
                  <tr>
                    <td>LLC Hub</td>
                    <td>≈600 USD/año (plan Esenciales)</td>
                    <td>Modelo por suscripción anual con 600–1.400 USD/año según nivel.</td>
                    <td>
                      Mantenimiento corporativo sólido, pero fiscalidad España–EE. UU. menos al
                      centro del mensaje.
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="pricing-compare-note">
                Los precios anteriores son rangos aproximados basados en la información pública de
                cada proveedor. No vendemos “ser los más baratos”, sino darte claridad y etapas
                lógicas para que siempre sepas qué estás pagando y por qué.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
