'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ReactCountryFlag from 'react-country-flag'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import './homepage-v4.css'
import { analyticsEvents } from "../lib/analytics";

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
// SCROLL ANIMATION HOOK
// ─────────────────────────────────────────────────────────────────────────────
function useFadeUp() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const siblings = Array.from(
            entry.target.parentElement?.querySelectorAll('.hp-fu') ?? []
          )
            ; (entry.target as HTMLElement).style.transitionDelay =
              `${siblings.indexOf(entry.target) * 85}ms`
          entry.target.classList.add('hp-on')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.hp-fu').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

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
// HERO SECTION OPTIMIZADA (con banderas)
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
                <span
                  className="hp-pdot"
                  style={{ width: 7, height: 7, background: T.gn, borderRadius: '50%', flexShrink: 0 }}
                />
                +500 emprendedores hispanos ya tienen su LLC
              </span>
            </div>

            {/* H1 Mejorado */}
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 800,
                lineHeight: 1.09,
                color: T.wh,
                marginBottom: 22,
              }}
            >
              Tu LLC en Estados Unidos{' '}
              <em style={{ fontStyle: 'normal', color: '#FCD34D', textDecoration: 'underline', textDecorationColor: 'rgba(252,211,77,.4)' }}>
                en solo 72 horas
              </em>
              <span style={{ display: 'block', fontSize: '0.78em', fontWeight: 700, color: 'rgba(255,255,255,.9)', marginTop: 14 }}>
                Sin visa · Sin SSN · Sin salir de casa
              </span>
            </h1>

            {/* Subtítulo mejorado */}
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,.8)', lineHeight: 1.7, marginBottom: 40, maxWidth: 520 }}>
              Más de 500 emprendedores de España y Latam ya facturan como empresas americanas.<br />
              <strong>Nosotros hacemos el 100% del trabajo.</strong> Tú solo firmas y empiezas a cobrar en dólares.
            </p>

            {/* Primary CTA */}
            <div className="mb-4">
              <Link
                href="#comenzar"
                onClick={() => analyticsEvents.trackEvent('cta_click', 'hero', 'comenzar_llc')}
                className="hp-pcta inline-flex items-center gap-2.5 font-extrabold rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${T.ct}, ${T.ch})`,
                  color: T.wh,
                  fontSize: 19,
                  padding: '22px 52px',
                  textDecoration: 'none',
                  boxShadow: T.shCta,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                👉 Crear mi LLC ahora
              </Link>
            </div>

            {/* Trust badges */}
            <p className="flex items-center gap-1.5 mb-8 text-sm" style={{ color: 'rgba(255,255,255,.75)' }}>
              🔒 Sin tarjeta · Sin compromiso · Garantía 100% sin errores
            </p>

            {/* Secondary CTA */}
            <Link
              href="#proceso"
              onClick={() => analyticsEvents.trackEvent('cta_click', 'hero', 'ver_proceso')}
              className="inline-flex items-center gap-2 font-semibold rounded-full"
              style={{
                background: 'rgba(255,255,255,.1)',
                border: '1.5px solid rgba(255,255,255,.25)',
                color: 'rgba(255,255,255,.9)',
                fontSize: 15,
                padding: '14px 32px',
                textDecoration: 'none',
              }}
            >
              Ver cómo funciona en 3 pasos ↓
            </Link>

            {/* Country pills - RESTAURADAS */}
            <div className="flex flex-wrap gap-2 mt-8">
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
                    color: 'rgba(255,255,255,.76)',
                  }}
                >
                  <ReactCountryFlag countryCode={c.code} svg style={{ fontSize: '1.2em', borderRadius: '2px' }} />
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="hp-himg hp-fu flex justify-center">
            <div className="hp-float w-full" style={{ maxWidth: 500 }}>
              <Image
                src="/images/hero.webp"
                alt="Emprendedor hispanohablante abriendo su LLC en EE.UU. desde casa"
                width={500}
                height={460}
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
  { icon: '🏢', label: 'Agente Registrado gratis 1er año' },
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
{/* ===================== NUEVA SECCIÓN DE BENEFICIOS OPTIMIZADA ===================== */}
<section className="py-16 bg-white">
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
      <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
        <div className="text-4xl mb-6">💰</div>
        <h3 className="text-2xl font-semibold mb-3">Paga menos impuestos, de forma legal</h3>
        <p className="text-gray-600">Reduce tu carga fiscal entre un 30% y un 50% de forma 100% legal.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
        <div className="text-4xl mb-6">💳</div>
        <h3 className="text-2xl font-semibold mb-3">Cobra en dólares con facilidad</h3>
        <p className="text-gray-600">Abre cuentas en Mercury, Relay o Stripe y recibe pagos internacionales sin barreras.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
        <div className="text-4xl mb-6">🌍</div>
        <h3 className="text-2xl font-semibold mb-3">Proyecta imagen profesional</h3>
        <p className="text-gray-600">"TuNombre LLC" en lugar de tu nombre personal. Ganas credibilidad inmediata.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
        <div className="text-4xl mb-6">🔒</div>
        <h3 className="text-2xl font-semibold mb-3">Protege tu patrimonio personal</h3>
        <p className="text-gray-600">La LLC separa tus bienes personales de las deudas de la empresa.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
        <div className="text-4xl mb-6">📋</div>
        <h3 className="text-2xl font-semibold mb-3">Cumplimiento fiscal sin dolores de cabeza</h3>
        <p className="text-gray-600">Nos encargamos de las declaraciones y el EIN. Tú solo firmas.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
        <div className="text-4xl mb-6">⚡</div>
        <h3 className="text-2xl font-semibold mb-3">Operativa en 72 horas</h3>
        <p className="text-gray-600">Olvídate de meses de espera. Tu LLC está lista para facturar en 3 días.</p>
      </div>
    </div>
  </div>
</section>
{/* ===================== FIN SECCIÓN BENEFICIOS ===================== */}
  

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
// SERVICES SECTION OPTIMIZADA
// ─────────────────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    title: 'Registro de LLC',
    price: 'Desde $349',
    desc: 'Crea tu empresa en Wyoming, Delaware o Florida en solo 72 horas. Incluye EIN y documentos oficiales.',
    features: [
      '✅ Dirección física real incluida',
      '✅ EIN (Tax ID)',
      '✅ Documentos digitales',
      '✅ Soporte en español'
    ],
    cta: 'Ver planes de LLC →',
    href: '/servicios/formacion-llc'
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
    href: '/servicios/obtencion-ein'
  },
  {
    title: 'Agente Registrado + Dirección Física',
    price: '',
    desc: 'Cumple con la ley estatal sin viajar. Te proporcionamos dirección física real en EE.UU. para recibir documentos oficiales.',
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
    desc: 'Abre cuenta en Mercury, Relay o Wise Business y cobra en dólares desde cualquier país.',
    features: [
      '✅ Compatible con LLC de no residentes',
      '✅ Usamos dirección del Agente Registrado',
      '✅ Te guiamos paso a paso'
    ],
    cta: 'Explorar cuentas bancarias →',
    href: '/servicios/launch-banking'
  },
]

function ServicesSection() {
  return (
    <section id="servicios" style={{ padding: '120px 0', background: T.wh }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div className="hp-fu text-center mb-16">
          <Eyebrow text="Nuestros Servicios" />
          <SectionHeading>Todo lo que necesitas para operar legalmente en EE.UU.</SectionHeading>
          <p className="text-lg mt-3 mx-auto" style={{ color: T.ts, maxWidth: 520 }}>
            Desde el registro hasta la cuenta bancaria. Te acompañamos en cada paso con total transparencia.
          </p>
        </div>

        {/* Grid */}
        <div
          className="hp-sgrid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}
        >
          {SERVICES.map((service, index) => (
            <div
              key={index}
              className="hp-fu hp-scard rounded-3xl p-8 hover:shadow-xl transition-all"
              style={{ 
                background: T.wh, 
                border: `1.5px solid ${T.br}` 
              }}
            >
              <div className="mb-6">
                <div className="text-4xl mb-2">📋</div>
                {service.price && (
                  <div className="text-sm font-bold text-purple-600 mt-2">{service.price}</div>
                )}
              </div>
              
              <h3 className="font-bold text-xl mb-3" style={{ color: T.tx }}>{service.title}</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: T.ts }}>{service.desc}</p>

              <ul className="text-sm mb-8 space-y-2" style={{ color: T.ts }}>
                {service.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              <Link 
                href={service.href} 
                className="inline-flex items-center gap-2 font-semibold text-sm hover:text-purple-600 transition-colors"
                style={{ color: T.b7 }}
              >
                {service.cta}
              </Link>
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
          <Link
            href="#comenzar"
            onClick={() => analyticsEvents.trackEvent('cta_click', 'process', 'iniciar_llc')}
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
          </Link>
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
              <Link
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
              </Link>
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
// TESTIMONIALS SECTION OPTIMIZADA
// ─────────────────────────────────────────────────────────────────────────────
const TESTIMONIOS = [
  {
    image: '/images/testimonio-carlos.webp',
    name: 'Carlos M.',
    country: '🇨🇴 Colombia',
    quote: '"En solo 4 días tuve mi LLC en Delaware y ya estoy cobrando clientes de EE.UU. en dólares. Reduje impuestos un 42% este año. Increíble."',
    result: 'Ahorró ~$18.400 USD en impuestos',
    stars: 5
  },
  {
    image: '/images/testimonio-ana.webp',
    name: 'Ana R.',
    country: '🇲🇽 México',
    quote: '"Pensé que sería complicado por ser de México. Me gestionaron todo: LLC, EIN y cuenta en Mercury. Llevo 7 meses operando sin problemas y con soporte en español."',
    result: 'Abrió cuenta bancaria USA en 9 días',
    stars: 5
  },
  {
    image: '/images/testimonio-miguel.webp',
    name: 'Miguel S.',
    country: '🇪🇸 España',
    quote: '"Pasé de facturar como autónomo a tener una empresa americana. Ya tengo clientes en Florida y California. El proceso fue transparente y rápido. 100% recomendado."',
    result: 'Expandió negocio a EE.UU. en menos de 3 semanas',
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
            No son casos inventados. Son emprendedores hispanos como tú.
          </p>
        </div>

        <div className="hp-tgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {TESTIMONIOS.map((t, index) => (
            <div
              key={index}
              className="hp-fu hp-tcard rounded-3xl p-8"
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
              <p className="text-[15.5px] leading-relaxed mb-8 italic" style={{ color: T.ts }}>
                {t.quote}
              </p>

              {/* Result */}
              <div className="text-sm font-semibold mb-6" style={{ color: T.gn }}>
                {t.result}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-100 flex-shrink-0"
                  style={{ background: '#f1f5f9' }}
                >
                  <Image 
                    src={t.image} 
                    alt={t.name} 
                    width={56} 
                    height={56} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
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
// PRICING SECTION OPTIMIZADA (Precios ajustados)
// ─────────────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Starter',
    price: '$349',
    featured: false,
    features: [
      '✅ Registro de LLC en Wyoming, Delaware o Florida',
      '✅ EIN (Tax ID) incluido',
      '✅ Agente Registrado primer año',
      '✅ Documentos digitales oficiales',
      '✅ Soporte en español',
    ],
  },
  {
    name: 'Professional',
    price: '$499',
    featured: true,
    features: [
      '✅ Todo del plan Starter',
      '✅ Apertura de cuenta bancaria (Mercury o Relay)',
      '✅ Operating Agreement personalizado',
      '✅ Consultoría fiscal inicial',
      '✅ Prioridad en soporte',
    ],
  },
  {
    name: 'Business',
    price: '$849',
    featured: false,
    features: [
      '✅ Todo del plan Professional',
      '✅ Presentación de formularios 5472 y 1120 (2026-2027)',
      '✅ Reportes anuales incluidos',
      '✅ Asesoría legal adicional',
      '✅ Soporte VIP ilimitado',
    ],
  },
]

function PricingSection() {
  return (
    <section id="precios" style={{ padding: '120px 0', background: T.sf }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div className="hp-fu text-center mb-4">
          <Eyebrow text="Precios transparentes" />
          <SectionHeading>Planes profesionales sin costos ocultos</SectionHeading>
          <p className="text-lg mt-3" style={{ color: T.ts }}>
            Elige según tu etapa. Todos incluyen nuestro proceso 100% gestionado.
          </p>
        </div>

        {/* Guarantee pill */}
        <div className="hp-fu text-center mb-14">
          <span
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-full"
            style={{ background: T.gl, border: `1px solid rgba(16,185,129,.3)`, color: T.gd }}
          >
            🛡️ Garantía de Tramitación 100% Sin Errores
          </span>
        </div>

        {/* Pricing grid */}
        <div className="hp-pgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, alignItems: 'start' }}>
          {PLANS.map(({ name, price, featured, features }) => (
            <div
              key={name}
              className="hp-fu hp-pcard rounded-[22px]"
              style={{
                background: featured ? T.b9 : T.wh,
                border: featured ? `2px solid ${T.b7}` : `1.5px solid ${T.br}`,
                padding: '38px 32px',
                boxShadow: featured ? T.shBlue : T.shCard,
                transform: featured ? 'scale(1.035)' : 'none',
                position: 'relative',
              }}
            >
              {featured && (
                <div
                  className="absolute text-xs font-bold px-[18px] py-1.5 rounded-full whitespace-nowrap"
                  style={{ top: -14, left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg,${T.ct},${T.ch})`, color: T.wh, boxShadow: T.shCta }}
                >
                  ⭐ MÁS POPULAR
                </div>
              )}

              <div className="text-[13px] font-bold tracking-widest uppercase mb-2.5" style={{ color: featured ? 'rgba(255,255,255,.5)' : T.tm }}>
                {name}
              </div>

              <div className="font-extrabold leading-none mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 56, color: featured ? T.wh : T.tx }}>
                {price}
                <span style={{ fontSize: 15, fontWeight: 400, color: featured ? 'rgba(255,255,255,.4)' : T.tm }}>
                  {' '}/pago único
                </span>
              </div>

              <div style={{ width: 36, height: 2.5, background: featured ? 'rgba(255,255,255,.18)' : T.br, borderRadius: 2, margin: '18px 0 22px' }} />

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 11 }}>
                {features.map((f) => (
                  <li key={f} className="text-sm" style={{ color: featured ? 'rgba(255,255,255,.84)' : T.ts }}>{f}</li>
                ))}
              </ul>

              <Link
                href="#comenzar"
                onClick={() => analyticsEvents.trackEvent('cta_click', 'pricing', name.toLowerCase())}
                className="block text-center font-bold text-[15px] py-[15px] rounded-full"
                style={{
                  textDecoration: 'none',
                  background: featured ? `linear-gradient(135deg,${T.ct},${T.ch})` : T.b9,
                  color: T.wh,
                  boxShadow: featured ? T.shCta : T.shBlue,
                }}
              >
                {featured ? '👉 Elegir Professional' : `Elegir ${name}`}
              </Link>

              {featured && (
                <p className="text-center text-[12px] mt-2.5" style={{ color: 'rgba(255,255,255,.36)' }}>
                  🔒 Sin tarjeta para empezar
                </p>
              )}
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
// QUICK CONTACT FORM OPTIMIZADO  (con COUNTRIES_LIST incluida)
// ─────────────────────────────────────────────────────────────────────────────

// Lista de países para el formulario
const COUNTRIES_LIST = [
  'España', 'México', 'Colombia', 'Argentina', 'Chile', 'Perú',
  'Venezuela', 'Ecuador', 'Guatemala', 'Bolivia', 'Otro país',
];

function QuickContactSection() {
  const [form, setForm] = useState({ name: '', email: '', country: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    analyticsEvents.trackEvent('cta_click', 'asesoria_rapida', 'enviar');

    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          country: form.country,
        }),
      });

      if (response.ok) {
        setSent(true);
        analyticsEvents.trackEvent('form_submit_success', 'asesoria_rapida');
      } else {
        alert('Hubo un error al enviar. Inténtalo de nuevo.');
      }
    } catch (error) {
      alert('Error de conexión. Por favor, inténtalo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px', fontSize: 16, color: T.tx,
    background: T.sf, border: `1.5px solid ${T.br}`, borderRadius: 12,
    fontFamily: "'Inter',sans-serif",
  };

  return (
    <section
      id="contacto-rapido"
      style={{
        background: `linear-gradient(135deg, ${T.b0} 0%, #E8F0FF 100%)`,
        padding: '96px 0',
        borderTop: `1px solid ${T.b1}`,
        borderBottom: `1px solid ${T.b1}`,
      }}
    >
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div className="hp-fu text-center mb-11">
          <Eyebrow text="Asesoría rápida" />
          <h2
            className="font-extrabold mt-3.5 mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(26px,3vw,38px)', color: T.b9 }}
          >
            ¿Tienes dudas? Recibe asesoría personalizada en menos de 12 horas
          </h2>
          <p className="text-base mx-auto" style={{ color: T.ts, maxWidth: 520 }}>
            Sin compromiso. Un especialista en español te responderá de forma clara y adaptada a tu situación.
          </p>
        </div>

        {/* Success state */}
        {sent ? (
          <div
            className="hp-fu text-center rounded-2xl mx-auto"
            style={{ background: T.wh, border: `1.5px solid rgba(16,185,129,.35)`, padding: '48px 36px', boxShadow: T.shCard, maxWidth: 560 }}
          >
            <div className="text-4xl mb-5">✅</div>
            <h3 className="font-bold text-xl mb-2.5" style={{ color: T.tx }}>¡Solicitud recibida!</h3>
            <p className="text-[15.5px]" style={{ color: T.ts }}>
              Un especialista revisará tu caso y te responderá en menos de 12 horas.<br /><br />
              <strong>Si quieres que preparemos mejor tu respuesta</strong>, responde a este mismo email contándonos tu duda principal.
            </p>
          </div>
        ) : (
          /* Formulario simple */
          <form
            onSubmit={handleSubmit}
            className="hp-fu rounded-2xl mx-auto"
            style={{ background: T.wh, border: `1.5px solid ${T.br}`, padding: '40px 36px', boxShadow: T.shCard, maxWidth: 680 }}
          >
            <div className="hp-fgrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: T.ts }}>Nombre completo *</label>
                <input
                  required
                  type="text"
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: T.ts }}>Email *</label>
                <input
                  required
                  type="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[13px] font-semibold mb-1.5" style={{ color: T.ts }}>País de residencia *</label>
              <select
                required
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                style={{ ...inputStyle, color: form.country ? T.tx : T.tm }}
              >
                <option value="" disabled>Selecciona tu país…</option>
                {COUNTRIES_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold text-base rounded-full border-0 cursor-pointer"
              style={{
                background: loading ? T.tm : `linear-gradient(135deg,${T.ct},${T.ch})`,
                color: T.wh,
                padding: '16px 32px',
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                boxShadow: loading ? 'none' : T.shCta,
              }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Enviando…
                </span>
              ) : '✉️ Recibir asesoría gratuita'}
            </button>

            <p className="text-[12.5px] text-center mt-4" style={{ color: T.tm }}>
              🔒 Tus datos están protegidos • Respuesta garantizada en menos de 12 horas • Sin spam
            </p>
          </form>
        )}
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
          <Link
            href="#comenzar"
            onClick={() => analyticsEvents.trackEvent('cta_click', 'final_cta', 'crear_llc')}
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
          </Link>

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
// MOBILE STICKY CTA OPTIMIZADO
// ─────────────────────────────────────────────────────────────────────────────
function MobileStickyCTA() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 440)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div className={`hp-mob ${show ? 'hp-show' : ''}`}>
      <div className="flex-1">
        <div className="text-[13px] font-bold" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", color: T.tx }}>
          Abre tu LLC desde $349
        </div>
        <div className="text-xs" style={{ color: T.tm }}>72 horas · Sin visa · Soporte en español</div>
      </div>
      <Link
        href="#comenzar"
        onClick={() => analyticsEvents.trackEvent('cta_click', 'sticky_cta', 'comenzar')}
        className="inline-flex items-center font-bold rounded-full whitespace-nowrap flex-shrink-0"
        style={{
          background: `linear-gradient(135deg,${T.ct},${T.ch})`,
          color: T.wh, 
          fontSize: 14, 
          padding: '11px 26px',
          textDecoration: 'none', 
          boxShadow: T.shCta,
          fontFamily: "'Plus Jakarta Sans',sans-serif",
        }}
      >
        Comenzar ahora →
      </Link>
    </div>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// PAGE (root export)
// NOTE: Nav and Footer are already in app/layout.tsx — not duplicated here.
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  useFadeUp()

  return (
    <main>
      <HeroSection />
      <TrustBar />

      {/* ===================== SECCIÓN DE BENEFICIOS OPTIMIZADA + FONDO DIFERENCIADO ===================== */}
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
      {/* ===================== FIN SECCIÓN BENEFICIOS ===================== */}
      <ServicesSection />
      <ProcessSection />
      <LatamSection />
      <TestimonialsSection />
      <PricingSection />
      <GuaranteeSection />
      <QuickContactSection />
      <CTAFinalSection />
      <MobileStickyCTA />
    </main>
  )
}