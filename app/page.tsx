
import { Metadata } from 'next'
import Link from 'next/link'
import TrackedLink from '@/components/home/TrackedLink'
import ScrollObserver from '@/components/home/ScrollObserver'
import MobileStickyCTA from '@/components/home/MobileStickyCTA'
import QuickContactSection from '@/components/home/QuickContactSection'

export const metadata: Metadata = {
  title: 'Crea tu LLC en Estados Unidos: Rápido, Online y Garantizado | Open LLC USA',
  description: 'Forma tu LLC en EE.UU. desde España o Latam sin visa ni SSN. Planes transparentes desde $349. Accede a Stripe y cuentas bancarias en dólares en días.',
  alternates: {
    canonical: 'https://openllcusa.com',
  },
  openGraph: {
    title: 'Crea tu LLC en EE.UU. con Open LLC USA',
    description: 'La forma más rápida y segura para emprendedores digitales de crear una empresa en EE.UU. sin pisar el país.',
    url: 'https://openllcusa.com',
    siteName: 'Open LLC USA',
    images: [
      {
        url: 'https://openllcusa.com/images/hero.webp',
        width: 1200,
        height: 630,
        alt: 'Open LLC USA - Crea tu LLC en Estados Unidos',
      },
    ],
    type: 'website',
  },
}

import React from 'react'
import Image from 'next/image'
import ReactCountryFlag from 'react-country-flag'
import { ArrowRight, Check, CheckCircle2, Loader2 } from 'lucide-react'
import './homepage-v4.css'


// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  // Blues — for hero, footer, accents only
  bd: '#0C2047', b9: '#1E3A8A', b7: '#1D4ED8', b5: '#3B82F6',
  b1: '#DBEAFE', b0: '#EFF6FF',
  // Green — success, checks
  gn: '#10B981', gd: '#059669', gl: '#D1FAE5',
  // CTA — orange
  ct: '#EA580C', ch: '#C2410C',
  // Neutrals
  tx: '#111827', ts: '#4B5563', tm: '#9CA3AF',
  br: '#E5E7EB', wh: '#FFFFFF', sf: '#F8FAFC',
  // Shadows
  shCard: '0 1px 4px rgba(17,24,39,.06), 0 4px 16px rgba(17,24,39,.07)',
  shCta: '0 6px 24px rgba(234,88,12,.38)',
  shBlue: '0 6px 24px rgba(30,58,138,.24)',
} as const


// ─────────────────────────────────────────────────────────────────────────────
// SHARED SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function Eyebrow({ text, green }: { text: string; green?: boolean }) {
  return (
    <span
      className="inline-block text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full"
      style={{
        background: green ? T.gl : T.b0,
        color: green ? T.gd : T.b7,
      }}
    >
      {text}
    </span>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-extrabold leading-tight mt-3.5"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 'clamp(28px, 3.5vw, 44px)',
        color: T.tx,
      }}
    >
      {children}
    </h2>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION OPTIMIZADA - VERSIÓN FINAL (mayor conversión)
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      style={{
        background: `linear-gradient(145deg, ${T.bd} 0%, ${T.b9} 65%, #1a368a 100%)`,
        padding: '112px 0 96px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 60% at 72% 48%, rgba(59,130,246,.16) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div
          className="hp-hgrid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}
        >
          {/* ── Copy ── */}
          <div className="hp-fu">
            {/* Social proof badge */}
            <div className="mb-6">
              <span
                className="hp-pdot inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full"
                style={{
                  background: 'rgba(16,185,129,.14)',
                  border: '1px solid rgba(16,185,129,.28)',
                  color: T.gn,
                }}
              >
                <span style={{ width: 7, height: 7, background: T.gn, borderRadius: '50%', flexShrink: 0 }} />
                +500 emprendedores hispanos ya tienen su LLC
              </span>
            </div>

            {/* H1 más potente */}
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(36px, 5.2vw, 68px)',
                fontWeight: 800,
                lineHeight: 1.08,
                color: T.wh,
                marginBottom: 24,
              }}
            >
              Tu LLC en Estados Unidos{' '}
              <em style={{ fontStyle: 'normal', color: '#FCD34D', textDecoration: 'underline', textDecorationColor: 'rgba(252,211,77,.45)' }}>
                en solo 72 horas
              </em>
            </h1>

            {/* Subtítulo mejorado */}
            <p style={{ fontSize: 19, color: 'rgba(255,255,255,.85)', lineHeight: 1.65, marginBottom: 40, maxWidth: 540 }}>
              Sin visa. Sin SSN. Sin salir de casa.<br />
              <strong>Más de 500 emprendedores de España y Latam</strong> ya facturan como empresas americanas. 
              Nosotros hacemos el 100% del trabajo.
            </p>

            {/* Primary CTA */}
            <div className="mb-6">
              <TrackedLink
                href="#precios"
                className="hp-pcta inline-flex items-center gap-3 font-extrabold rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${T.ct}, ${T.ch})`,
                  color: T.wh,
                  fontSize: 20,
                  padding: '24px 56px',
                  textDecoration: 'none',
                  boxShadow: T.shCta,
                }}
              >
                Ver planes desde $349
                <ArrowRight size={24} />
              </TrackedLink>
            </div>

            {/* Trust line */}
            <p className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,.8)' }}>
              🔒 Sin tarjeta · Sin compromiso · Garantía 100% sin errores
            </p>

            {/* Country pills */}
            <div className="flex flex-wrap gap-2 mt-10">
              {[
                { code: 'MX', name: 'México' },
                { code: 'CO', name: 'Colombia' },
                { code: 'ES', name: 'España' },
                { code: 'AR', name: 'Argentina' },
                { code: 'PE', name: 'Perú' },
                { code: 'US', name: 'EE.UU.' },
                { code: 'PY', name: 'Paraguay' },
              ].map((c) => (
                <span
                  key={c.code}
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,.08)',
                    border: '1px solid rgba(255,255,255,.13)',
                    color: 'rgba(255,255,255,.8)',
                  }}
                >
                  <ReactCountryFlag countryCode={c.code} svg style={{ fontSize: '1.25em' }} />
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="hp-himg hp-fu flex justify-center">
            <div className="hp-float w-full" style={{ maxWidth: 520 }}>
              <Image
                src="/images/hero.webp"
                alt="Emprendedor hispanohablante abriendo su LLC en EE.UU. desde casa"
                width={520}
                height={480}
                priority
                style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 32px 72px rgba(12,32,71,.55))' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TRUST BAR
// ─────────────────────────────────────────────────────────────────────────────
const TRUST_ITEMS = [
  { icon: '🌐', label: '100% en línea — Sin viajar' },
  { icon: '🪪', label: 'EIN incluido sin SSN' },
  { icon: '🪙', label: 'Aceptamos Criptomonedas' },
  { icon: '💬', label: 'Soporte en español ‹12h' },
  { icon: '✅', label: '+500 LLCs registradas' },
  { icon: '🔒', label: 'Pago 100% seguro' },
]

function TrustBar() {
  return (
    <div style={{ background: T.wh, borderBottom: `1px solid ${T.br}`, padding: '18px 0' }}>
      <div
        style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}
        className="flex flex-wrap justify-center gap-x-6 gap-y-2"
      >
        {TRUST_ITEMS.map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className="flex items-center justify-center text-sm flex-shrink-0"
              style={{ width: 26, height: 26, background: T.gl, borderRadius: '50%' }}
            >
              {icon}
            </span>
            <span className="text-sm font-medium" style={{ color: T.ts }}>
              {label}
            </span>
          </div>
        ))}
      </div>
      
      {/* Logos de partners / Confianza en Carrusel Infinito */}
      <div className="hp-marquee mt-8">
        <div className="hp-marquee-content">
          {/* Primer set de logos */}
          <div className="flex items-center gap-1.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <Image src="/images/logo-mercury.webp" alt="Mercury Bank" width={140} height={40} style={{ objectFit: 'contain', height: 40, width: 'auto' }} />
          </div>
          <div className="flex items-center gap-1.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <Image src="/images/logo-relay.webp" alt="Relay Financial" width={120} height={40} style={{ objectFit: 'contain', height: 35, width: 'auto' }} />
          </div>
          <div className="flex items-center gap-1.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <Image src="/images/logo-stripe.webp" alt="Stripe Verified Partner" width={110} height={40} style={{ objectFit: 'contain', height: 35, width: 'auto' }} />
          </div>
          <div className="flex items-center gap-1.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <Image src="/images/logo-irs.webp" alt="IRS Authorized E-file Provider" width={180} height={40} style={{ objectFit: 'contain', height: 45, width: 'auto' }} />
          </div>
          
          {/* Segundo set idéntico para que el loop infinito sea fluido */}
          <div className="flex items-center gap-1.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" aria-hidden="true">
            <Image src="/images/logo-mercury.webp" alt="Mercury Bank" width={140} height={40} style={{ objectFit: 'contain', height: 40, width: 'auto' }} />
          </div>
          <div className="flex items-center gap-1.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" aria-hidden="true">
            <Image src="/images/logo-relay.webp" alt="Relay Financial" width={120} height={40} style={{ objectFit: 'contain', height: 35, width: 'auto' }} />
          </div>
          <div className="flex items-center gap-1.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" aria-hidden="true">
            <Image src="/images/logo-stripe.webp" alt="Stripe Verified Partner" width={110} height={40} style={{ objectFit: 'contain', height: 35, width: 'auto' }} />
          </div>
          <div className="flex items-center gap-1.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" aria-hidden="true">
            <Image src="/images/logo-irs.webp" alt="IRS Authorized E-file Provider" width={180} height={40} style={{ objectFit: 'contain', height: 45, width: 'auto' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BENEFITS SECTION
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// SERVICE ICONS (inline SVG — zero extra packages)
// ─────────────────────────────────────────────────────────────────────────────
function IconLLC() {
  return (
    <svg viewBox="0 0 88 88" width="88" height="88" aria-hidden>
      <rect x="8" y="14" width="56" height="66" rx="9" fill="#EFF6FF" />
      <rect x="18" y="26" width="36" height="4.5" rx="2" fill="#1D4ED8" />
      <rect x="18" y="34" width="28" height="3" rx="1.5" fill="#3B82F665" />
      <rect x="18" y="41" width="30" height="3" rx="1.5" fill="#3B82F665" />
      <rect x="18" y="48" width="22" height="3" rx="1.5" fill="#3B82F665" />
      <circle cx="68" cy="68" r="18" fill="#10B981" />
      <path d="M60 68.5L65.5 74L77 62" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}
function IconEIN() {
  return (
    <svg viewBox="0 0 88 88" width="88" height="88" aria-hidden>
      <rect x="8" y="8" width="54" height="66" rx="9" fill="#FEF3C7" />
      <rect x="18" y="20" width="34" height="5" rx="2" fill="#92400E" />
      <rect x="18" y="29" width="26" height="3" rx="1.5" fill="#F59E0B90" />
      <rect x="18" y="36" width="30" height="3" rx="1.5" fill="#F59E0B90" />
      <rect x="18" y="43" width="22" height="3" rx="1.5" fill="#F59E0B90" />
      <circle cx="66" cy="66" r="18" fill="#1E3A8A" />
      <text x="66" y="73" textAnchor="middle" fontSize="13" fontWeight="800" fill="white" fontFamily="'Plus Jakarta Sans',sans-serif">EIN</text>
    </svg>
  )
}
function IconAgent() {
  return (
    <svg viewBox="0 0 88 88" width="88" height="88" aria-hidden>
      <circle cx="44" cy="26" r="18" fill="#D1FAE5" />
      <circle cx="44" cy="26" r="12" fill="#10B981" />
      <path d="M38 26L43 31L51 23" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M18 80Q18 56 44 56Q70 56 70 80" fill="#EFF6FF" />
      <rect x="30" y="53" width="28" height="24" rx="6" fill="#1E3A8A" />
      <circle cx="68" cy="14" r="12" fill="#FEF3C7" />
      <path d="M68 7v14M61 14h14" stroke="#92400E" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}
function IconBank() {
  return (
    <svg viewBox="0 0 88 88" width="88" height="88" aria-hidden>
      <rect x="4" y="34" width="72" height="46" rx="8" fill="#CCFBF1" />
      <polygon points="44,6 4,32 76,32" fill="#0D9488" />
      <rect x="8" y="40" width="64" height="7" fill="#0F766E" />
      <rect x="12" y="52" width="14" height="22" rx="4" fill="#1E3A8A" />
      <rect x="37" y="52" width="14" height="22" rx="4" fill="#1E3A8A" />
      <rect x="62" y="52" width="14" height="22" rx="4" fill="#1E3A8A" />
      <circle cx="68" cy="66" r="16" fill="#EA580C" />
      <path d="M68 57v18M59 66h18" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES DATA + SECTION (VERSIÓN COHERENTE Y FUNCIONAL)
// ─────────────────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    title: 'Registro de LLC',
    price: 'Desde $349',
    desc: (
      <>
        Crea tu empresa en <Link href="/blog/wyoming-vs-delaware-llc" className="text-blue-600 hover:underline">Wyoming o Delaware</Link> en solo 72 horas. Incluye EIN y documentos oficiales.
      </>
    ),
    features: [
      '✅ Dirección física real incluida',
      '✅ EIN (Tax ID)',
      '✅ Documentos digitales',
      '✅ Soporte en español'
    ],
    cta: 'Ver planes de LLC →',
    href: '#precios'
  },
  {
    title: 'Obtén tu EIN sin SSN',
    price: '',
    desc: 'El número de identificación fiscal que necesitan bancos y plataformas. Lo tramitamos por ti aunque no tengas visa.',
    features: [
      '✅ Sin SSN ni visa requerida',
      '✅ Entrega en 5-10 días hábiles',
      '✅ Válido para abrir cuentas bancarias'
    ],
    cta: 'Solicitar mi EIN ahora →',
    href: '/servicios/impuestos/obtencion-ein'
  },
  {
    title: 'Agente Registrado + Dirección Física',
    price: '',
    desc: 'Cumple con la ley estatal sin viajar. Te proporcionamos dirección física real en EE.UU.',
    features: [
      '✅ Dirección física real incluida',
      '✅ 1er año gratis en la mayoría de planes',
      '✅ Recepción de documentos del estado e IRS'
    ],
    cta: 'Contratar Agente Registrado →',
    href: '/servicios/agente-registrado'
  },
  {
    title: 'Cuenta Bancaria Empresarial',
    price: '',
    desc: (
      <>
        Abre cuenta en <Link href="/blog/cuenta-bancaria-llc-no-residente" className="text-blue-600 hover:underline">Mercury, Relay o Wise</Link> y cobra en dólares desde cualquier país.
      </>
    ),
    features: [
      '✅ Compatible con LLC de no residentes',
      '✅ Usamos dirección del Agente Registrado'
    ],
    cta: 'Explorar cuentas bancarias →',
    href: '/servicios/launch-banking'
  },
]

function ServicesSection() {
  return (
    <section id="servicios" style={{ padding: '120px 0', background: T.wh }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
        <div className="hp-fu text-center mb-16">
          <Eyebrow text="Nuestros Servicios" />
          <SectionHeading>Todo lo que necesitas para operar legalmente en EE.UU.</SectionHeading>
          <p className="text-lg mt-4 max-w-xl mx-auto" style={{ color: T.ts }}>
            No solo registramos tu LLC. Te damos todo el ecosistema para que factures como una empresa americana desde el primer día.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <div
              key={index}
              className="hp-fu hp-scard rounded-3xl p-8 border border-gray-200 hover:shadow-xl transition-all flex flex-col"
              style={{ background: T.wh }}
            >
              <div className="mb-6">
                <div className="text-5xl mb-3">📋</div>
                <h3 className="font-bold text-2xl" style={{ color: T.tx }}>{service.title}</h3>
                {service.price && <p className="text-3xl font-bold mt-2" style={{ color: T.b7 }}>{service.price}</p>}
              </div>

              <p className="text-gray-600 mb-8 flex-1 leading-relaxed">{service.desc}</p>

              <ul className="space-y-3 mb-10 flex-1">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px]">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <TrackedLink
                href={service.href}
                className="block text-center py-4 rounded-2xl border border-gray-300 hover:bg-gray-50 font-semibold transition"
              >
                {service.cta}
              </TrackedLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// PROCESS ICONS
// ─────────────────────────────────────────────────────────────────────────────
function ProcIconForm() {
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden>
      <rect x="6" y="4" width="44" height="54" rx="7" fill="#EFF6FF" />
      <rect x="14" y="14" width="28" height="4" rx="2" fill="#1D4ED8" />
      <rect x="14" y="22" width="22" height="3" rx="1.5" fill="#1D4ED855" />
      <rect x="14" y="29" width="24" height="3" rx="1.5" fill="#1D4ED855" />
      <rect x="14" y="40" width="28" height="10" rx="4" fill="#10B981" />
      <path d="M19 45L24 50L39 42" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  )
}
function ProcIconWork() {
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden>
      <circle cx="32" cy="32" r="26" fill="#EFF6FF" />
      <path
        className="hp-spin-arc"
        d="M32 10A22 22 0 0 1 54 32"
        stroke="#1D4ED8" strokeWidth="4" fill="none" strokeLinecap="round"
      />
      <circle cx="32" cy="32" r="10" fill="#DBEAFE" />
      <circle cx="32" cy="32" r="5" fill="#1D4ED8" />
    </svg>
  )
}
function ProcIconDone() {
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden>
      <circle cx="32" cy="32" r="28" fill="#D1FAE5" />
      <circle cx="32" cy="32" r="20" fill="#10B981" />
      <path d="M22 32L29 39L43 25" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCESS / TIMELINE SECTION (con iconos originales)
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [
  { 
    Icon: ProcIconForm, 
    n: 1, 
    tag: '⏱ Solo 5 minutos', 
    title: 'Completa el formulario', 
    desc: 'Solo necesitas tu pasaporte o DNI. Nada más. El resto lo hacemos nosotros.' 
  },
  { 
    Icon: ProcIconWork, 
    n: 2, 
    tag: '⚡ Nosotros hacemos el trabajo', 
    title: 'Procesamos todo por ti', 
    desc: 'Registro estatal + EIN + Agente Registrado + Operating Agreement. Todo incluido.' 
  },
  { 
    Icon: ProcIconDone, 
    n: 3, 
    tag: '🌍 En 72 horas', 
    title: 'Recibe tus documentos', 
    desc: 'Tu LLC estará activa y lista para operar. Documentos digitales en tu email.' 
  },
]

function ProcessSection() {
  return (
    <section id="proceso" style={{ padding: '120px 0', background: T.sf }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div className="hp-fu text-center mb-[72px]">
          <Eyebrow text="Cómo funciona" />
          <SectionHeading>Así de fácil. En serio.</SectionHeading>
          <p className="text-lg mt-3" style={{ color: T.ts }}>
            Sin papeleos confusos. Sin viajes. Sin esperas eternas.
          </p>
        </div>

        {/* Timeline grid con iconos originales */}
        <div style={{ position: 'relative' }}>
          <div className="hp-pconn" />
          <div
            className="hp-pcols"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36, position: 'relative', zIndex: 1 }}
          >
            {STEPS.map(({ Icon, n, tag, title, desc }) => (
              <div key={n} className="hp-fu text-center px-3">
                {/* Circle con icono original */}
                <div
                  className="flex items-center justify-center mx-auto mb-7"
                  style={{
                    width: 120, height: 120, borderRadius: '50%',
                    background: T.wh,
                    boxShadow: `0 0 0 8px ${T.sf}, ${T.shBlue}`,
                    position: 'relative',
                  }}
                >
                  <Icon />
                  {/* Number badge */}
                  <div
                    className="absolute flex items-center justify-center text-sm font-extrabold"
                    style={{
                      top: -8, right: -8, width: 32, height: 32, borderRadius: '50%',
                      background: T.b9, color: T.wh,
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                    }}
                  >
                    {n}
                  </div>
                </div>

                <span
                  className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3.5"
                  style={{ background: T.b0, color: T.b7 }}
                >
                  {tag}
                </span>

                <h3 className="font-bold text-xl mb-2.5" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", color: T.tx }}>
                  {title}
                </h3>
                <p className="text-[15px] leading-relaxed" style={{ color: T.ts }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA below timeline */}
        <div className="hp-fu text-center mt-[60px]">
          <TrackedLink
            href="#comenzar"
            className="inline-flex items-center gap-2 font-bold rounded-full"
            style={{ 
              background: T.b9, 
              color: T.wh, 
              fontSize: 16, 
              padding: '16px 40px', 
              textDecoration: 'none', 
              boxShadow: T.shBlue 
            }}
          >
            Iniciar mi LLC ahora <ArrowRight size={16} />
          </TrackedLink>
          <p className="text-sm mt-3.5" style={{ color: T.tm }}>
            🔒 Sin tarjeta de crédito · Sin compromiso · Garantía 100%
          </p>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LATAM SECTION OPTIMIZADA
// ─────────────────────────────────────────────────────────────────────────────
const COUNTRIES: [string, string, string][] = [
  ['MX', '/guias/mx', 'México'], 
  ['CO', '/guias/co', 'Colombia'],
  ['ES', '/guias/es', 'España'], 
  ['AR', '/guias/ar', 'Argentina'],
  ['PE', '/guias/pe', 'Perú'], 
  ['US', '/guias/us', 'EE.UU.'],
  ['PY', '/guias/py', 'Paraguay'],
]

function LatamSection() {
  return (
    <section
      style={{
        background: `linear-gradient(135deg, ${T.b0} 0%, #E0EDFF 100%)`,
        padding: '100px 0',
        borderTop: `1px solid ${T.b1}`,
        borderBottom: `1px solid ${T.b1}`,
      }}
    >
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }} className="text-center">
        <div className="hp-fu">
          <Eyebrow text="Cobertura global" />
          
          <h2
            className="font-extrabold mt-3.5 mb-4"
            style={{ 
              fontFamily: "'Plus Jakarta Sans',sans-serif", 
              fontSize: 'clamp(28px,3.5vw,42px)', 
              color: T.b9 
            }}
          >
            No importa desde dónde estés
          </h2>

          <p className="text-[17px] mx-auto mb-10 max-w-[560px]" style={{ color: T.ts }}>
            Ya hemos ayudado a emprendedores de España y toda Latam a registrar su LLC en EE.UU. 
            y empezar a facturar internacionalmente con éxito.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            {COUNTRIES.map(([code, href, name]) => (
              <TrackedLink
                key={code}
                href={href}
                className="group inline-flex flex-col items-center gap-2 text-sm font-medium px-6 py-4 rounded-2xl hover:bg-white transition-all hover:shadow-md"
                style={{ 
                  background: 'rgba(255,255,255,0.6)', 
                  border: `1px solid ${T.br}` 
                }}
              >
                <ReactCountryFlag 
                  countryCode={code} 
                  svg 
                  style={{ fontSize: '2.4em', borderRadius: '6px' }} 
                />
                <span className="group-hover:text-purple-600 transition-colors">{name}</span>
              </TrackedLink>
            ))}
          </div>

          <p className="text-xs mt-10" style={{ color: T.tm }}>
            ¿Tu país no está en la lista? Escríbenos, atendemos casi todos los países hispanohablantes.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS SECTION - VERSIÓN MEJORADA (6 testimonios en grid estático)
// ─────────────────────────────────────────────────────────────────────────────
const TESTIMONIOS = [
  {
    image: '/images/testimonials/carlos-colombia.webp',
    name: 'Carlos M.',
    country: 'co Colombia',
    quote: 'En solo 4 días tuve mi LLC en Delaware y ya estoy cobrando clientes de EE.UU. en dólares. Reduje mis impuestos un 42% el primer año. El proceso fue mucho más sencillo de lo que esperaba.',
    result: 'Ahorró más de $18.000 USD en impuestos el primer año',
    stars: 5
  },
  {
    image: '/images/testimonials/ana-mexico.webp',
    name: 'Ana R.',
    country: 'mx México',
    quote: 'Pensé que sería complicado por ser de México. Me gestionaron todo: LLC, EIN y cuenta en Mercury. En menos de 10 días ya tenía mi cuenta bancaria en EE.UU. funcionando.',
    result: 'Abrió cuenta en Mercury en solo 9 días',
    stars: 5
  },
  {
    image: '/images/testimonials/miguel-espana.webp',
    name: 'Miguel S.',
    country: 'es España',
    quote: 'Pasé de facturar como autónomo a tener una estructura profesional. En menos de un mes ya tenía mis primeros clientes americanos pagándome en dólares. Totalmente recomendable.',
    result: 'Consiguió sus primeros 3 clientes USA en menos de 30 días',
    stars: 5
  },
  {
    image: '/images/testimonials/laura-espana.webp',
    name: 'Laura P.',
    country: 'es España',
    quote: 'Como consultora, necesitaba transmitir profesionalidad. La LLC me permitió trabajar con clientes de Estados Unidos sin complicaciones y con una imagen mucho más sólida.',
    result: 'Aumentó su facturación un 65% en 6 meses',
    stars: 5
  },
  {    
    image: '/images/testimonials/roberto-argentina.webp',
    name: 'Roberto K.',
    country: 'ar Argentina',
    quote: 'Tengo un e-commerce y necesitaba recibir pagos de Amazon y clientes americanos. Con la LLC y la cuenta en Mercury todo se simplificó muchísimo. Muy buen servicio.',
    result: 'Empezó a recibir pagos de Amazon USA en 3 semanas',
    stars: 5
  },
  {
    image: '/images/testimonials/daniela-colombia.webp',
    name: 'Daniela M.',
    country: 'co Colombia',
    quote: 'Como desarrolladora de software, la LLC me dio credibilidad inmediata con clientes americanos. Además, pude optimizar bastante mi situación fiscal. El acompañamiento fue excelente.',
    result: 'Consiguió 4 clientes americanos en los primeros 2 meses',
    stars: 5
  },
]

function TestimonialsSection() {
return (
    <section id="testimonios" style={{ padding: '120px 0', background: T.wh }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
        <div className="hp-fu text-center mb-16">
          <Eyebrow text="Testimonios reales" />
          <SectionHeading>Lo dicen quienes ya dieron el paso</SectionHeading>
          <p className="text-lg mt-3" style={{ color: T.ts }}>
            No son casos inventados. Son emprendedores hispanos como tú que ya están operando desde EE.UU.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIOS.map((t, index) => (
            <div
              key={index}
              className="hp-fu hp-tcard rounded-3xl p-8 flex flex-col"
              style={{ 
                background: T.wh, 
                border: `1.5px solid ${T.br}`, 
                boxShadow: T.shCard,
                height: '100%'
              }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-6">
                {[...Array(t.stars)].map((_, i) => (
                  <span key={i} style={{ color: '#F59E0B', fontSize: 22 }}>★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-[15.5px] leading-relaxed mb-8 italic flex-1" style={{ color: T.ts }}>
                “{t.quote}”
              </p>

              {/* Result */}
              <div className="text-sm font-semibold mb-6" style={{ color: T.gn }}>
                {t.result}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                {t.image && typeof t.image === 'string' ? (
                  // Foto real
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-gray-200 flex-shrink-0">
                    <Image 
                      src={t.image} 
                      alt={t.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  // Inicial
                  <div 
                    className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: T.b9 }}
                  >
                    {t.name[0]}
                  </div>
                )}
                <div>
                  <div className="font-bold" style={{ color: T.tx }}>{t.name}</div>
                  <div className="text-sm" style={{ color: T.tm }}>{t.country}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}






// ─────────────────────────────────────────────────────────────────────────────
// GUARANTEE SECTION OPTIMIZADA
// ─────────────────────────────────────────────────────────────────────────────
function GuaranteeSection() {
  return (
    <section id="garantia" style={{ padding: '120px 0', background: T.wh, borderTop: `1px solid ${T.br}` }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
        <div 
          className="hp-fu hp-gi" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '280px 1fr', 
            gap: 80, 
            alignItems: 'center', 
            maxWidth: 1000, 
            margin: '0 auto' 
          }}
        >
          {/* Sello grande */}
          <div className="flex justify-center">
            <div 
              style={{ 
                width: 260, 
                height: 260, 
                borderRadius: '50%', 
                background: 'linear-gradient(145deg, #0C2047, #1E3A8A)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 20px 60px rgba(12,32,71,0.25)',
                position: 'relative'
              }}
            >
              <Image
                src="/images/garantia.webp"
                alt="Sello de Garantía 100% Sin Errores"
                width={180}
                height={180}
                style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))' }}
              />
              <div style={{ position: 'absolute', bottom: -8, right: -8, background: '#10B981', color: 'white', fontSize: '13px', fontWeight: 'bold', padding: '4px 14px', borderRadius: '9999px' }}>
                100% Garantizado
              </div>
            </div>
          </div>

          {/* Texto */}
          <div>
            <Eyebrow text="Sin riesgos" green />
            <h2
              className="font-extrabold mt-3.5 mb-6 leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(28px,3.2vw,42px)', color: T.tx }}
            >
              Garantía de Tramitación 100% Sin Errores
            </h2>
            
            <p className="text-[17px] leading-relaxed mb-8" style={{ color: T.ts, maxWidth: 520 }}>
              Si cometemos cualquier error en la tramitación de tu LLC que cause un rechazo por parte del estado, 
              <strong>nos hacemos cargo del 100% del costo de corrección</strong>. 
              Tu tranquilidad y tu dinero están protegidos.
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                '✅ Pago 100% Seguro',
                '✅ IRS Authorized Agent',
                '✅ Soporte en Español',
                '✅ +500 LLCs registradas con éxito',
                '✅ Devolución si no quedas satisfecho'
              ].map((item, i) => (
                <span
                  key={i}
                  className="text-sm font-medium px-5 py-2.5 rounded-2xl"
                  style={{ background: T.gl, color: T.gd }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// CTA FINAL SECTION OPTIMIZADA
// ─────────────────────────────────────────────────────────────────────────────
function CTAFinalSection() {
  return (
    <section
      id="comenzar"
      style={{
        background: `linear-gradient(145deg, ${T.bd} 0%, ${T.b9} 100%)`,
        padding: '120px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 48% 68% at 50% 108%,rgba(59,130,246,.22) 0%,transparent 70%)', pointerEvents: 'none' }} />
      
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }} className="text-center relative z-10">
        <div className="hp-fu">
          <p className="text-[13px] font-bold tracking-widest uppercase mb-4" style={{ color: '#FCD34D' }}>Tu momento es ahora</p>
          
          <h2
            className="font-extrabold leading-[1.12] mb-5"
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(32px,4.5vw,54px)', color: T.wh }}
          >
            Tu LLC lista en 72 horas.<br />¿Estás listo para dar el paso?
          </h2>

          <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,.85)', maxWidth: 520, margin: '0 auto' }}>
            Miles de emprendedores hispanos ya están operando y facturando desde EE.UU. sin complicaciones.<br />
            <strong>Tú puedes ser el siguiente.</strong>
          </p>

          {/* Primary CTA */}
          <TrackedLink
            href="#precios"
            className="hp-pcta inline-flex items-center gap-2.5 font-extrabold rounded-full mb-6"
            style={{
              background: `linear-gradient(135deg, ${T.ct}, ${T.ch})`,
              color: T.wh,
              fontSize: 19,
              padding: '22px 56px',
              textDecoration: 'none',
              boxShadow: T.shCta,
              fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}
          >
            👉 Crear mi LLC ahora
          </TrackedLink>

          {/* Trust line */}
          <p className="text-sm" style={{ color: 'rgba(255,255,255,.7)' }}>
            🔒 Sin tarjeta de crédito · Garantía 100% sin errores · Soporte en español
          </p>
        </div>
      </div>
    </section>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// MOBILE STICKY CTA - VERSIÓN MEJORADA
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// PAGE (root export) - VERSIÓN CORREGIDA Y LIMPIA
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main>
      <ScrollObserver />
    <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Open LLC USA",
      "url": "https://openllcusa.com",
      "description": "Ayudamos a emprendedores hispanohablantes a crear y gestionar su LLC en Estados Unidos de forma remota y profesional.",
      "logo": "https://openllcusa.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "hola@openllcusa.com",
        "contactType": "customer support",
        "areaServed": "ES",
        "availableLanguage": "Spanish"
      },
      "sameAs": [
        "https://www.linkedin.com/company/openllcusa",
        "https://www.instagram.com/openllcusa"
      ]
    })
  }}
/>
      <HeroSection />
      <TrustBar />

      {/* SECCIÓN BENEFICIOS (solo una, la optimizada) */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold tracking-widest text-purple-600">POR QUÉ FUNCIONA</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3">
              Lo que cambia el día que tienes tu LLC
            </h2>
            <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
              No es solo abrir una empresa. Es abrir una puerta que antes estaba cerrada.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "💰", title: "Paga menos impuestos, de forma legal", desc: "Reduce tu carga fiscal entre un 30% y un 50% de forma 100% legal." },
              { icon: "💳", title: "Cobra en dólares con facilidad", desc: "Abre cuentas en Mercury, Stripe o Wise y recibe pagos internacionales sin barreras." },
              { icon: "🌍", title: "Proyecta imagen profesional", desc: '"TuNombre LLC" en lugar de tu nombre personal. Ganas credibilidad inmediata.' },
              { icon: "🔒", title: "Protege tu patrimonio personal", desc: "La LLC separa tus bienes personales de las deudas de la empresa." },
              { icon: "📋", title: "Cumplimiento fiscal sin dolores de cabeza", desc: "Nos encargamos de las declaraciones y el EIN. Tú solo firmas." },
              { icon: "⚡", title: "Operativa en 72 horas", desc: "Olvídate de meses de espera. Tu LLC está lista para facturar en 3 días." },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{benefit.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServicesSection />
      <ProcessSection />
      <LatamSection />
      <TestimonialsSection />      
        
            {/* ===================== SECCIÓN PRECIOS OPTIMIZADA (FINAL) ===================== */}
      <section className="py-20 bg-slate-50" id="precios">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold tracking-widest text-purple-600">PRECIOS TRANSPARENTES</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3">Planes profesionales sin costos ocultos</h2>
            <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
              Elige el plan que mejor se adapte a tu situación. <span className="font-semibold">Todos incluyen nuestro proceso 100% gestionado.</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* STARTER */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="text-center mb-8">
                <span className="text-sm font-semibold text-gray-500">STARTER</span>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-gray-900">$349</span>
                  <span className="text-gray-500"> + tasa estatal</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Ideal para freelancers y primeros pasos</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3"><span className="text-green-500">✓</span> Registro de LLC</li>
                <li className="flex items-start gap-3"><span className="text-green-500">✓</span> EIN + Documentos básicos</li>
                <li className="flex items-start gap-3"><span className="text-green-500">✓</span> Agente Registrado 1 año</li>
                <li className="flex items-start gap-3"><span className="text-green-500">✓</span> Asistencia en español</li>
              </ul>
              <TrackedLink href="/paquetes/starter/onboarding" trackAction="cta_click" trackCategory="pricing" trackLabel="starter" className="block text-center py-4 rounded-2xl border border-gray-300 hover:bg-gray-50 font-semibold transition">
                Elegir Starter
              </TrackedLink>
            </div>

            {/* PROFESSIONAL - MÁS POPULAR */}
            <div className="bg-gradient-to-b from-purple-50 to-white border-2 border-purple-600 rounded-3xl p-8 relative flex flex-col md:scale-105 shadow-[0_8px_40px_rgba(147,51,234,0.25)] z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-6 py-1.5 rounded-full">MÁS POPULAR</div>
              <div className="text-center mb-8">
                <span className="text-sm font-semibold text-purple-600">PROFESSIONAL</span>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-gray-900">$499</span>
                  <span className="text-gray-500"> + tasa estatal</span>
                </div>
                <p className="text-sm text-purple-600 mt-2 font-semibold">El más elegido por emprendedores serios</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3"><span className="text-green-500">✓</span> Todo del Starter</li>
                <li className="flex items-start gap-3"><span className="text-green-500">✓</span> Cuenta bancaria en EE.UU.</li>
                <li className="flex items-start gap-3"><span className="text-green-500">✓</span> Operating Agreement personalizado</li>
                <li className="flex items-start gap-3"><span className="text-green-500">✓</span> Asistencia prioritaria</li>
                <li className="flex items-start gap-3"><span className="text-green-500">✓</span> Soporte 30 días</li>
              </ul>
              <TrackedLink href="/paquetes/professional/onboarding" trackAction="cta_click" trackCategory="pricing" trackLabel="professional" className="block text-center py-4 rounded-2xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">
                Elegir Professional
              </TrackedLink>
            </div>

            {/* BUSINESS */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="text-center mb-8">
                <span className="text-sm font-semibold text-gray-500">BUSINESS</span>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-gray-900">$849</span>
                  <span className="text-gray-500"> + tasa estatal</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Servicio completo y premium</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3"><span className="text-green-500">✓</span> Todo del Professional</li>
                <li className="flex items-start gap-3"><span className="text-green-500">✓</span> Presentación 5472 + 1120</li>
                <li className="flex items-start gap-3"><span className="text-green-500">✓</span> Dirección física real</li>
                <li className="flex items-start gap-3"><span className="text-green-500">✓</span> Soporte VIP 90 días</li>
                <li className="flex items-start gap-3"><span className="text-green-500">✓</span> Reportes Anuales</li>
                <li className="flex items-start gap-3"><span className="text-green-500">✓</span> Revisión anual incluida</li>
              </ul>
              <TrackedLink href="/paquetes/business/onboarding" trackAction="cta_click" trackCategory="pricing" trackLabel="business" className="block text-center py-4 rounded-2xl border border-gray-300 hover:bg-gray-50 font-semibold transition">
                Elegir Business
              </TrackedLink>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-10">
            ✅ Precio final + tasa estatal según el estado elegido • Sin sorpresas • Garantía de devolución 100%
          </p>

          {/* CTAs to the full pricing page */}
          <div className="text-center mt-8 flex flex-wrap gap-4 justify-center">
            <TrackedLink
              href="/precios"
              trackAction="cta_click"
              trackCategory="pricing"
              trackLabel="ver_todos_planes"
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full transition hover:-translate-y-1"
              style={{ background: '#EFF6FF', color: '#1E3A8A', border: '1.5px solid #DBEAFE', boxShadow: '0 4px 14px rgba(30,58,138,0.08)' }}
            >
              Ver todos los planes (Mantener + Optimizar) →
            </TrackedLink>
            <TrackedLink
              href="/precios#comparativa"
              trackAction="cta_click"
              trackCategory="pricing"
              trackLabel="ver_comparativa"
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full transition hover:-translate-y-1"
              style={{ background: '#F8FAFC', color: '#4B5563', border: '1.5px solid #E5E7EB' }}
            >
              Comparar con competidores →
            </TrackedLink>
          </div>
        </div>
      </section>
              
      
      <GuaranteeSection />
      <QuickContactSection />
      <CTAFinalSection />
      <MobileStickyCTA />
    </main>
  )
}