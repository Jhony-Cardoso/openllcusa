// app/precios/page.tsx
// Server Component — alineado con el design system de la homepage
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import '../homepage-v4.css'
import ScrollObserver from '@/components/home/ScrollObserver'

const SITE_URL = 'https://openllcusa.com'

// ─── Design tokens (mismo sistema que homepage) ───────────────────────────────
const T = {
  bd: '#0C2047', b9: '#1E3A8A', b7: '#1D4ED8', b5: '#3B82F6',
  b1: '#DBEAFE', b0: '#EFF6FF',
  gn: '#10B981', gd: '#059669', gl: '#D1FAE5',
  ct: '#EA580C', ch: '#C2410C',
  tx: '#111827', ts: '#4B5563', tm: '#9CA3AF',
  br: '#E5E7EB', wh: '#FFFFFF', sf: '#F8FAFC',
  shCard: '0 1px 4px rgba(17,24,39,.06), 0 4px 16px rgba(17,24,39,.07)',
  shCta: '0 6px 24px rgba(234,88,12,.38)',
  shBlue: '0 6px 24px rgba(30,58,138,.24)',
} as const

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Precios para crear y mantener tu LLC en EE. UU. | Open LLC USA',
  description:
    'Planes claros desde $349 para formar, mantener y optimizar tu LLC en Estados Unidos. Sin letra pequeña, sin sorpresas. Comparativa con EZFrontiers, Circle Club y Openbiz.',
  alternates: {
    canonical: `${SITE_URL}/precios`,
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/precios`,
    title: 'Precios claros para tu LLC en EE. UU. | Open LLC USA',
    description:
      'Forma, mantén y optimiza tu LLC en Estados Unidos. Planes desde $349 con soporte en español.',
    siteName: 'Open LLC USA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Precios para crear tu LLC en EE. UU. | Open LLC USA',
    description:
      'Planes por etapas: Formar ($349–$849), Mantener ($49/mes) y Optimizar tu LLC en EE. UU.',
  },
  robots: { index: true, follow: true },
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Open LLC USA',
  url: SITE_URL,
  description:
    'Servicio especializado en creación y mantenimiento de LLC en Estados Unidos para hispanohablantes no residentes.',
  areaServed: [
    { '@type': 'Country', name: 'Spain' },
    { '@type': 'Country', name: 'Mexico' },
    { '@type': 'Country', name: 'Colombia' },
    { '@type': 'Country', name: 'Argentina' },
  ],
  serviceType: 'US LLC formation and compliance for non-US residents',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Planes para tu LLC en EE. UU.',
    itemListElement: [
      { '@type': 'Offer', name: 'Starter', priceSpecification: { '@type': 'PriceSpecification', price: 349, priceCurrency: 'USD' }, category: 'Formar' },
      { '@type': 'Offer', name: 'Professional', priceSpecification: { '@type': 'PriceSpecification', price: 499, priceCurrency: 'USD' }, category: 'Formar' },
      { '@type': 'Offer', name: 'Business', priceSpecification: { '@type': 'PriceSpecification', price: 849, priceCurrency: 'USD' }, category: 'Formar' },
      { '@type': 'Offer', name: 'Plan Compliance Básico', priceSpecification: { '@type': 'PriceSpecification', price: 49, priceCurrency: 'USD' }, category: 'Mantener' },
      { '@type': 'Offer', name: 'Plan Crecimiento', priceSpecification: { '@type': 'PriceSpecification', price: 129, priceCurrency: 'USD' }, category: 'Mantener' },
      { '@type': 'Offer', name: 'Pack Optimización', priceSpecification: { '@type': 'PriceSpecification', price: 397, priceCurrency: 'USD' }, category: 'Optimizar' },
    ],
  },
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────
function Eyebrow({ text, green }: { text: string; green?: boolean }) {
  return (
    <span
      className="inline-block text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full"
      style={{ background: green ? T.gl : T.b0, color: green ? T.gd : T.b7 }}
    >
      {text}
    </span>
  )
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm" style={{ color: T.ts }}>
      <span
        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
        style={{ background: T.gl }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5l2.5 2.5 4.5-5" stroke={T.gd} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {children}
    </li>
  )
}

function StageBadge({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
        style={{ background: T.b9, color: T.wh }}
      >
        {number}
      </div>
      <span className="font-extrabold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: T.tx }}>
        {label}
      </span>
    </div>
  )
}

// ─── PÁGINA ───────────────────────────────────────────────────────────────────
export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollObserver />

      <main style={{ fontFamily: "'Inter', sans-serif", background: T.sf }}>

        {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
        <section
          style={{
            background: `linear-gradient(145deg, ${T.bd} 0%, ${T.b9} 65%, #1a368a 100%)`,
            padding: '96px 0 80px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Glow */}
          <div
            aria-hidden
            style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 55% 55% at 80% 50%, rgba(59,130,246,.14) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div className="hp-fu mb-5">
              <Eyebrow text="Precios transparentes · Sin letra pequeña" />
            </div>
            <h1
              className="hp-fu font-extrabold leading-tight"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(30px, 4.5vw, 56px)',
                color: T.wh,
                marginBottom: 20,
              }}
            >
              Forma, mantén y optimiza<br />tu LLC en EE.&nbsp;UU.
            </h1>
            <p
              className="hp-fu"
              style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', color: 'rgba(255,255,255,.75)', maxWidth: 600, margin: '0 auto 36px' }}
            >
              Tres etapas lógicas para que siempre sepas qué estás pagando y por qué.
              Soporte en español pensado para hispanohablantes.
            </p>
            {/* Anchors rápidos */}
            <div className="hp-fu flex flex-wrap gap-3 justify-center">
              {[
                { href: '#formar', label: '1. Formar LLC' },
                { href: '#mantener', label: '2. Mantener' },
                { href: '#optimizar', label: '3. Optimizar' },
                { href: '#comparativa', label: 'Ver comparativa' },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-sm font-semibold px-5 py-2.5 rounded-full transition"
                  style={{
                    background: 'rgba(255,255,255,.10)',
                    border: '1px solid rgba(255,255,255,.22)',
                    color: T.wh,
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ ETAPA 1: FORMAR ════════════════════════════════════════════════ */}
        <section id="formar" style={{ padding: '96px 0', background: T.wh }}>
          <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
            <div className="hp-fu text-center mb-14">
              <Eyebrow text="Etapa 1" />
              <StageBadge number="1" label="Forma tu LLC en Estados Unidos" />
              <p className="text-base mx-auto" style={{ color: T.ts, maxWidth: 560 }}>
                Elegir bien el estado, crear tu LLC, conseguir tu EIN y dejar listos los documentos que
                te pedirán bancos, pasarelas de pago y clientes. Todo gestionado por nosotros.
              </p>
            </div>

            {/* Cards de planes */}
            <div
              className="hp-pgrid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'start' }}
            >
              {/* STARTER */}
              <article
                className="hp-fu hp-pcard rounded-3xl p-8 flex flex-col"
                style={{ background: T.wh, border: `1.5px solid ${T.br}`, boxShadow: T.shCard }}
              >
                <span
                  className="text-xs font-bold tracking-widest uppercase mb-4"
                  style={{ color: T.tm }}
                >
                  STARTER
                </span>
                <div className="mb-2">
                  <span
                    className="font-extrabold"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 48, color: T.tx }}
                  >
                    $349
                  </span>
                  <span className="text-sm ml-1.5" style={{ color: T.tm }}>+ tasa estatal</span>
                </div>
                <p className="text-sm mb-6" style={{ color: T.ts }}>Ideal para freelancers y primeros pasos</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <CheckItem>Registro de LLC en el estado óptimo</CheckItem>
                  <CheckItem>EIN sin SSN ni ITIN</CheckItem>
                  <CheckItem>Documentos esenciales para bancos y clientes</CheckItem>
                  <CheckItem>Agente registrado gratis 1 año</CheckItem>
                  <CheckItem>Asistencia completa en español</CheckItem>
                </ul>
                <Link
                  href="/paquetes/starter/onboarding"
                  className="block text-center font-bold rounded-full py-4 transition"
                  style={{ background: T.sf, border: `1.5px solid ${T.br}`, color: T.tx }}
                >
                  Empezar con Starter
                </Link>
                <p className="text-xs text-center mt-3" style={{ color: T.tm }}>
                  Ideal para validar tu negocio sin complicarte
                </p>
              </article>

              {/* PROFESSIONAL — DESTACADO */}
              <article
                className="hp-fu hp-pcard rounded-3xl p-8 flex flex-col relative"
                style={{
                  background: `linear-gradient(150deg, #f5f3ff 0%, ${T.wh} 100%)`,
                  border: `2px solid #7c3aed`,
                  boxShadow: '0 8px 40px rgba(124,58,237,.18)',
                  transform: 'scale(1.03)',
                }}
              >
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold px-5 py-1.5 rounded-full"
                  style={{ background: '#7c3aed', color: T.wh }}
                >
                  MÁS POPULAR
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: '#7c3aed' }}
                  >
                    PROFESSIONAL
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full shadow-sm" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                    🔥 Solo 3 plazas a este precio
                  </span>
                </div>
                <div className="mb-2">
                  <span
                    className="font-extrabold"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 48, color: T.tx }}
                  >
                    $499
                  </span>
                  <span className="text-sm ml-1.5" style={{ color: T.tm }}>+ tasa estatal</span>
                </div>
                <p className="text-sm font-semibold mb-6" style={{ color: '#7c3aed' }}>El más elegido por emprendedores</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <CheckItem>Todo del Starter</CheckItem>
                  <CheckItem>Apertura de cuenta bancaria en EE.UU.</CheckItem>
                  <CheckItem>Operating Agreement personalizado</CheckItem>
                  <CheckItem>Sesión 1:1 para definir estrategia fiscal inicial</CheckItem>
                  <CheckItem>Soporte prioritario 30 días</CheckItem>
                </ul>
                <Link
                  href="/paquetes/professional/onboarding"
                  className="block text-center font-bold rounded-full py-4 transition"
                  style={{ background: '#7c3aed', color: T.wh }}
                >
                  Elegir Professional
                </Link>
                <p className="text-xs text-center mt-3" style={{ color: T.tm }}>
                  Recomendado si facturas en los próximos 30–60 días
                </p>
              </article>

              {/* BUSINESS */}
              <article
                className="hp-fu hp-pcard rounded-3xl p-8 flex flex-col"
                style={{ background: T.wh, border: `1.5px solid ${T.br}`, boxShadow: T.shCard }}
              >
                <span
                  className="text-xs font-bold tracking-widest uppercase mb-4"
                  style={{ color: T.tm }}
                >
                  BUSINESS
                </span>
                <div className="mb-2">
                  <span
                    className="font-extrabold"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 48, color: T.tx }}
                  >
                    $849
                  </span>
                  <span className="text-sm ml-1.5" style={{ color: T.tm }}>+ tasa estatal</span>
                </div>
                <p className="text-sm mb-6" style={{ color: T.ts }}>Primer año casi todo resuelto</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <CheckItem>Todo del Professional</CheckItem>
                  <CheckItem>Presentación Forms 5472 + 1120</CheckItem>
                  <CheckItem>Dirección física real en EE.UU.</CheckItem>
                  <CheckItem>BOIR incluido dentro de plazo</CheckItem>
                  <CheckItem>Soporte VIP 90 días + revisión anual</CheckItem>
                </ul>
                <Link
                  href="/paquetes/business/onboarding"
                  className="block text-center font-bold rounded-full py-4 transition"
                  style={{ background: T.sf, border: `1.5px solid ${T.br}`, color: T.tx }}
                >
                  Elegir Business
                </Link>
                <p className="text-xs text-center mt-3" style={{ color: T.tm }}>
                  Puedes añadir un plan de mantenimiento tras el primer año
                </p>
              </article>
            </div>

            {/* Trust footnote */}
            <p className="hp-fu text-center text-sm mt-10" style={{ color: T.tm }}>
              ✅ Precio cerrado + tasa estatal según el estado elegido &nbsp;•&nbsp; Sin sorpresas &nbsp;•&nbsp; Garantía de devolución 100%
            </p>

            {/* Banner pago fraccionado */}
            <div
              className="hp-fu flex items-center gap-5 rounded-2xl mt-10 p-6"
              style={{ background: T.b0, border: `1.5px solid ${T.b1}` }}
            >
              <span className="text-3xl flex-shrink-0">💳</span>
              <div>
                <p className="font-bold text-sm mb-0.5" style={{ color: T.b9 }}>Facilidades de pago</p>
                <p className="text-sm" style={{ color: T.ts }}>
                  Al pagar con Stripe, podrás fraccionar el importe en cuotas mensuales según disponibilidad en tu país y método de pago.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ ETAPA 2: MANTENER ══════════════════════════════════════════════ */}
        <section
          id="mantener"
          style={{
            padding: '96px 0',
            background: `linear-gradient(135deg, ${T.b0} 0%, #E8F0FF 100%)`,
            borderTop: `1px solid ${T.b1}`,
          }}
        >
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
            <div className="hp-fu text-center mb-14">
              <Eyebrow text="Etapa 2" />
              <div className="flex items-center justify-center gap-3 mt-5 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: T.b9, color: T.wh }}
                >
                  2
                </div>
                <h2
                  className="font-extrabold text-left"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(22px, 3vw, 34px)', color: T.tx }}
                >
                  Mantén tu LLC al día
                </h2>
              </div>
              <p className="text-base mx-auto" style={{ color: T.ts, maxWidth: 560 }}>
                Si tu LLC ya está creada, estos planes te ayudan a no perder plazos ni pagar multas
                absurdas por despistes con el estado o el IRS.
              </p>
            </div>

            <div
              className="hp-pgrid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}
            >
              {/* COMPLIANCE BÁSICO */}
              <article
                className="hp-fu hp-pcard rounded-3xl p-8 flex flex-col"
                style={{ background: T.wh, border: `1.5px solid ${T.br}`, boxShadow: T.shCard }}
              >
                <span className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: T.tm }}>
                  PLAN COMPLIANCE BÁSICO
                </span>
                <div className="mb-1">
                  <span className="font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 44, color: T.tx }}>
                    $49
                  </span>
                  <span className="text-sm ml-1.5" style={{ color: T.tm }}>/mes · sin permanencia</span>
                </div>
                <p className="text-sm mb-6" style={{ color: T.ts }}>Lo mínimo para estar tranquilo</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <CheckItem>Agente registrado y dirección oficial activos</CheckItem>
                  <CheckItem>Recordatorios de annual report y obligaciones estatales</CheckItem>
                  <CheckItem>Checklist BOIR y formularios informativos clave</CheckItem>
                  <CheckItem>Soporte por email para dudas recurrentes</CheckItem>
                  <CheckItem>Sin permanencia — pausa o cambia cuando quieras</CheckItem>
                </ul>
                <Link
                  href="/paquetes/compliance-basico/onboarding"
                  className="block text-center font-bold rounded-full py-4 transition"
                  style={{ background: T.b9, color: T.wh }}
                >
                  Activar Compliance Básico
                </Link>
              </article>

              {/* PLAN CRECIMIENTO */}
              <article
                className="hp-fu hp-pcard rounded-3xl p-8 flex flex-col"
                style={{ background: T.wh, border: `1.5px solid ${T.br}`, boxShadow: T.shCard }}
              >
                <span className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: T.tm }}>
                  PLAN CRECIMIENTO
                </span>
                <div className="mb-1">
                  <span className="font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 44, color: T.tx }}>
                    $129
                  </span>
                  <span className="text-sm ml-1.5" style={{ color: T.tm }}>/mes · para negocios en marcha</span>
                </div>
                <p className="text-sm mb-6" style={{ color: T.ts }}>Compliance + contabilidad ligera</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <CheckItem>Todo del Plan Compliance Básico</CheckItem>
                  <CheckItem>Conciliación mensual básica de movimientos</CheckItem>
                  <CheckItem>Informe trimestral de ingresos, gastos y márgenes</CheckItem>
                  <CheckItem>Sesión estratégica anual de revisión fiscal</CheckItem>
                  <CheckItem>Documentación lista para tu asesor en España</CheckItem>
                </ul>
                <Link
                  href="/paquetes/plan-crecimiento/onboarding"
                  className="block text-center font-bold rounded-full py-4 transition"
                  style={{ background: T.b9, color: T.wh }}
                >
                  Activar Plan Crecimiento
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* ═══ ETAPA 3: OPTIMIZAR ═════════════════════════════════════════════ */}
        <section id="optimizar" style={{ padding: '96px 0', background: T.wh }}>
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
            <div className="hp-fu text-center mb-14">
              <Eyebrow text="Etapa 3" green />
              <div className="flex items-center justify-center gap-3 mt-5 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: T.gd, color: T.wh }}
                >
                  3
                </div>
                <h2
                  className="font-extrabold text-left"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(22px, 3vw, 34px)', color: T.tx }}
                >
                  Optimiza impuestos y estructura
                </h2>
              </div>
              <p className="text-base mx-auto" style={{ color: T.ts, maxWidth: 560 }}>
                Cuando ya generas ingresos, el retorno está en mejores decisiones fiscales.
                No en ahorrar $50 en el agente registrado.
              </p>
            </div>

            <div
              className="hp-pgrid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}
            >
              {/* PACK OPTIMIZACIÓN */}
              <article
                className="hp-fu hp-pcard rounded-3xl p-8 flex flex-col"
                style={{ background: T.wh, border: `1.5px solid ${T.br}`, boxShadow: T.shCard }}
              >
                <span className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: T.tm }}>
                  PACK OPTIMIZACIÓN ESPAÑA–EE. UU.
                </span>
                <div className="mb-1">
                  <span className="font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 44, color: T.tx }}>
                    $397
                  </span>
                  <span className="text-sm ml-1.5" style={{ color: T.tm }}>pago único</span>
                </div>
                <p className="text-sm mb-6" style={{ color: T.ts }}>Diagnóstico + plan de acción escrito</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <CheckItem>Cuestionario previo sobre tu negocio y modelo de ingresos</CheckItem>
                  <CheckItem>Informe con recomendaciones concretas de estructura, estados y bancos</CheckItem>
                  <CheckItem>Sesión 1:1 de hasta 90 min para revisar el informe</CheckItem>
                  <CheckItem>Priorización de acciones para los próximos 12 meses</CheckItem>
                </ul>
                <Link
                  href="/contacto"
                  className="block text-center font-bold rounded-full py-4 transition"
                  style={{
                    background: `linear-gradient(135deg, ${T.ct}, ${T.ch})`,
                    color: T.wh,
                    boxShadow: T.shCta,
                  }}
                >
                  Quiero revisar mi estructura
                </Link>
              </article>

              {/* ASESORÍA CONTINUA */}
              <article
                className="hp-fu hp-pcard rounded-3xl p-8 flex flex-col"
                style={{ background: T.wh, border: `1.5px solid ${T.br}`, boxShadow: T.shCard }}
              >
                <span className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: T.tm }}>
                  ASESORÍA CONTINUA DE ALTO VALOR
                </span>
                <div className="mb-1">
                  <span className="font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 44, color: T.tx }}>
                    $997
                  </span>
                  <span className="text-sm ml-1.5" style={{ color: T.tm }}>/año · o desde $97/mes</span>
                </div>
                <p className="text-sm mb-6" style={{ color: T.ts }}>Para cuando tu LLC ya es clave en tu negocio</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <CheckItem>Bolsa de horas de consultoría avanzada al año</CheckItem>
                  <CheckItem>Revisión anual de estructura, estados, bancos y flujos de cobro</CheckItem>
                  <CheckItem>Soporte para expansión, inversión o cambio de residencia</CheckItem>
                  <CheckItem>Coordinación con tu asesoría en España si la necesitas</CheckItem>
                </ul>
                <Link
                  href="/contacto"
                  className="block text-center font-bold rounded-full py-4 transition"
                  style={{ background: T.sf, border: `1.5px solid ${T.br}`, color: T.tx }}
                >
                  Hablar sobre asesoría continua
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* ═══ TABLA COMPARATIVA COMPETIDORES ════════════════════════════════ */}
        <section
          id="comparativa"
          style={{
            padding: '96px 0',
            background: `linear-gradient(135deg, ${T.b0} 0%, #E8F0FF 100%)`,
            borderTop: `1px solid ${T.b1}`,
          }}
        >
          <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
            <div className="hp-fu text-center mb-14">
              <Eyebrow text="Comparativa de mercado" />
              <h2
                className="font-extrabold mt-4 mb-3"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(24px, 3.5vw, 38px)', color: T.tx }}
              >
                ¿Cómo nos comparamos con otros proveedores?
              </h2>
              <p className="text-base mx-auto" style={{ color: T.ts, maxWidth: 560 }}>
                Cifras aproximadas basadas en información pública. No somos los más baratos;
                somos los más claros con el contexto España–EE.&nbsp;UU.
              </p>
            </div>

            <div className="hp-fu overflow-x-auto rounded-2xl" style={{ boxShadow: T.shCard }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  background: T.wh,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  borderRadius: 16,
                  overflow: 'hidden',
                }}
              >
                <thead>
                  <tr style={{ background: T.b9, color: T.wh }}>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 700 }}>Proveedor</th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 700 }}>Precio entrada LLC</th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 700 }}>Acompañamiento</th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 700 }}>Contexto España–EE. UU.</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: '✅ Open LLC USA',
                      price: 'Desde $349 + tasas',
                      support: 'Por etapas: Formar, Mantener y Optimizar. Soporte en español.',
                      context: 'Explicado de forma explícita en todos los planes.',
                      highlight: true,
                    },
                    {
                      name: 'EZFrontiers',
                      price: '≈ $699 + tasas',
                      support: 'Paquete cerrado de creación de LLC con foco en no residentes.',
                      context: 'Contenido educativo sólido; asesoría fiscal personalizada va aparte.',
                    },
                    {
                      name: 'Circle Club',
                      price: '$647 + tasas (Essential)',
                      support: 'Fuerte enfoque en ahorro fiscal y acompañamiento.',
                      context: 'Buen foco fiscal, pero menos desglosado por etapas.',
                    },
                    {
                      name: 'Openbiz',
                      price: '≈ $599 + tasas',
                      support: 'Escala rápido a $1.200–$3.997/año al incluir impuestos.',
                      context: 'Muy completo pero concentrado en planes anuales altos.',
                    },
                    {
                      name: 'American Prana',
                      price: '$999 + tasas (Master Plan)',
                      support: 'Plataforma SaaS con app propia. Incluye LLC, EIN, cuenta bancaria y primer cierre fiscal.',
                      context: 'Renovación anual $599. Muy fuerte en compliance IRS; precio de entrada más alto.',
                    },
                    {
                      name: 'Firmaway',
                      price: 'Desde $499 + tasas (Starter)',
                      support: 'Planes desde $499 (1 socio) hasta $1.199 (All-in). Muy orientado a Latinoamérica.',
                      context: 'Tax Season $699. Buena apertura bancaria; fiscalidad integrada solo en plan alto.',
                    },
                  ].map((row, i) => (
                    <tr
                      key={row.name}
                      style={{
                        background: row.highlight ? T.b0 : i % 2 === 0 ? T.wh : T.sf,
                        borderBottom: `1px solid ${T.br}`,
                      }}
                    >
                      <td style={{ padding: '14px 20px', fontWeight: row.highlight ? 700 : 400, color: row.highlight ? T.b9 : T.tx }}>
                        {row.name}
                      </td>
                      <td style={{ padding: '14px 20px', color: T.ts, fontWeight: row.highlight ? 600 : 400 }}>
                        {row.price}
                      </td>
                      <td style={{ padding: '14px 20px', color: T.ts }}>{row.support}</td>
                      <td style={{ padding: '14px 20px', color: T.ts }}>{row.context}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="hp-fu text-xs text-center mt-5" style={{ color: T.tm }}>
              Precios aproximados basados en información pública de cada proveedor en julio 2026. No vendemos &ldquo;ser los más baratos&rdquo;, sino darte claridad en cada etapa.
            </p>
          </div>
        </section>
        {/* ═══ COMPARATIVA DE ESTADOS ═══════════════════════════════════════════ */}
        <section style={{ padding: '80px 24px', background: T.sf, borderTop: `1px solid ${T.br}` }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div className="text-center mb-12 hp-fu">
              <Eyebrow text="Wyoming vs Delaware" />
              <h2 className="font-extrabold mt-4 mb-4 text-3xl text-gray-900">
                ¿Qué estado elegir para tu LLC?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                No importa qué plan elijas, en Open LLC USA te formamos la empresa en el estado que mejor se adapte a tu perfil. Estos son los dos más populares para no residentes (lee nuestro <Link href="/blog/wyoming-vs-delaware-llc" className="text-blue-600 hover:underline font-medium">análisis profundo de Wyoming vs Delaware</Link>):
              </p>
            </div>
            
            <div className="hp-fu bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr style={{ background: T.bd, color: T.wh }}>
                      <th style={{ padding: '16px 24px', fontWeight: 700, width: '33%' }}>Característica</th>
                      <th style={{ padding: '16px 24px', fontWeight: 700, width: '33%', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>Wyoming 🤠</th>
                      <th style={{ padding: '16px 24px', fontWeight: 700, width: '33%', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>Delaware 🏛️</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { f: 'Perfil ideal', w: 'Negocios digitales, e-commerce, consultores', d: 'Startups tecnológicas, empresas que buscan inversión (Venture Capital)' },
                      { f: 'Costo de mantenimiento anual (Estado)', w: '~$62 USD', d: '$300 USD fijos (Franchise Tax)' },
                      { f: 'Privacidad', w: 'Excelente (Dueños no figuran en registros públicos)', d: 'Excelente (Dueños no figuran en registros públicos)' },
                      { f: 'Protección patrimonial', w: 'Excepcional (Charging Order Protection)', d: 'Excepcional (Court of Chancery)' },
                      { f: 'Prestigio Corporativo', w: 'Normal', d: 'Alto (El estándar de Fortune 500)' },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${T.br}`, background: i % 2 === 0 ? T.wh : T.sf }}>
                        <td style={{ padding: '16px 24px', fontWeight: 600, color: T.tx }}>{row.f}</td>
                        <td style={{ padding: '16px 24px', color: T.ts, borderLeft: `1px solid ${T.br}` }}>{row.w}</td>
                        <td style={{ padding: '16px 24px', color: T.ts, borderLeft: `1px solid ${T.br}` }}>{row.d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-center mt-8 hp-fu">
              <p className="text-sm text-gray-500">
                ¿Aún tienes dudas? Incluimos asesoría para elegir el estado correcto en nuestro <Link href="/paquetes/professional/onboarding" className="text-blue-600 font-bold hover:underline">Plan Professional</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ GARANTÍA ═══════════════════════════════════════════════════════ */}
        <section style={{ padding: '80px 24px', background: T.wh, borderTop: `1px solid ${T.br}` }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div className="hp-fu flex flex-col md:flex-row items-center gap-10 bg-slate-50 p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex-shrink-0 relative">
                <div style={{ width: 140, height: 140, borderRadius: '50%', background: 'linear-gradient(145deg, #0C2047, #1E3A8A)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(12,32,71,0.2)' }}>
                  <Image src="/images/garantia.webp" alt="Garantía 100%" width={100} height={100} />
                </div>
              </div>
              <div>
                <Eyebrow text="Riesgo Cero" green />
                <h2 className="font-extrabold mt-3 mb-4 text-2xl md:text-3xl text-gray-900">
                  Garantía 100% de Tramitación sin Errores
                </h2>
                <p className="text-gray-600 leading-relaxed mb-5">
                  La LLC no es un juego. Un error al formarla puede costarte multas o problemas con el IRS. Por eso, <strong>si cometemos algún error técnico en la constitución de tu LLC, nos hacemos cargo del 100% de los gastos para solucionarlo</strong>. 
                </p>
                <div className="flex gap-2 items-center text-sm font-semibold text-green-700">
                  <span className="bg-green-100 p-1 rounded-full px-3">✓ Proceso Seguro</span>
                  <span className="bg-green-100 p-1 rounded-full px-3">✓ Agentes Autorizados</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FAQ ════════════════════════════════════════════════════════════ */}
        <section style={{ padding: '80px 24px', background: T.sf, borderTop: `1px solid ${T.br}` }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="text-center mb-12 hp-fu">
              <Eyebrow text="Dudas frecuentes" />
              <h2 className="font-extrabold mt-4 mb-4 text-3xl text-gray-900">
                Preguntas antes de empezar
              </h2>
            </div>
            
            <div className="space-y-4 hp-fu">
              {[
                {
                  q: '¿Qué pasa después de pagar?',
                  a: 'Recibirás acceso a tu portal seguro de onboarding donde te pediremos tus datos básicos (pasaporte y nombre de la empresa). Tras rellenarlo en 5 minutos, nosotros empezamos a trabajar de inmediato.'
                },
                {
                  q: '¿Hay algún costo oculto mensual?',
                  a: 'No. Nuestros paquetes de formación (Starter, Professional, Business) son de pago único. A partir del segundo año solo deberás pagar el mantenimiento y los impuestos de tu estado.'
                },
                {
                  q: '¿Por qué elegir el plan Professional?',
                  a: 'Porque incluye la apertura de cuenta bancaria y la sesión 1:1. Es el plan ideal si planeas recibir pagos de clientes o plataformas americanas en los próximos 30 días.'
                }
              ].map((faq, i) => (
                <details key={i} className="group bg-white p-6 rounded-2xl border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition">
                  <summary className="font-bold text-lg text-gray-900 flex justify-between items-center list-none outline-none">
                    {faq.q}
                    <span className="text-blue-600 group-open:rotate-180 transition-transform font-normal">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA FINAL ══════════════════════════════════════════════════════ */}
        <section
          style={{
            padding: '96px 24px',
            background: `linear-gradient(145deg, ${T.bd} 0%, ${T.b9} 100%)`,
            textAlign: 'center',
          }}
        >
          <div className="hp-fu" style={{ maxWidth: 620, margin: '0 auto' }}>
            <Eyebrow text="¿No sabes por dónde empezar?" />
            <h2
              className="font-extrabold mt-5 mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(26px, 3.5vw, 40px)', color: T.wh }}
            >
              Háblanos de tu situación y te decimos qué plan encaja
            </h2>
            <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 17, marginBottom: 36 }}>
              Sin compromiso. Un especialista en español te responde en menos de 12 horas.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contacto"
                className="font-bold rounded-full px-8 py-4 transition"
                style={{
                  background: `linear-gradient(135deg, ${T.ct}, ${T.ch})`,
                  color: T.wh,
                  boxShadow: T.shCta,
                  fontSize: 16,
                }}
              >
                Recibir asesoría gratuita →
              </Link>
              <Link
                href="/paquetes/starter/onboarding"
                className="font-bold rounded-full px-8 py-4 transition"
                style={{
                  background: 'rgba(255,255,255,.10)',
                  border: '1.5px solid rgba(255,255,255,.30)',
                  color: T.wh,
                  fontSize: 16,
                }}
              >
                Empezar con Starter ($349)
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
