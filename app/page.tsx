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
// HERO SECTION
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
                Más de 500 emprendedores ya confiaron en nosotros
              </span>
            </div>

            {/* H1 */}
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
              Tu LLC en Estados Unidos en{' '}
              <em
                style={{
                  fontStyle: 'normal',
                  color: '#FCD34D',
                  textDecoration: 'underline',
                  textDecorationColor: 'rgba(252,211,77,.3)',
                  textUnderlineOffset: 6,
                }}
              >
                72 horas
              </em>
              {'.'}
              <span
                style={{
                  display: 'block',
                  fontSize: '0.78em',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,.88)',
                  marginTop: 14,
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em',
                }}
              >
                Sin visa. Sin SSN. Sin moverte de casa.
              </span>
            </h1>

            {/* Subheading */}
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,.72)', lineHeight: 1.72, marginBottom: 40, maxWidth: 500 }}>
              Más de 500 emprendedores hispanos ya operan con su LLC en Wyoming, Delaware o Florida.
              {' '}Nosotros nos encargamos del 100% del proceso{' '}—{' '}
              <strong style={{ color: T.wh, fontWeight: 700 }}>tú solo firmas</strong>.
            </p>

            {/* Primary CTA */}
            <div className="mb-3">
              <Link
                href="#comenzar"
                onClick={() => Analytics.trackStartLLC('hero')}
                className="hp-pcta inline-flex items-center gap-2.5 font-extrabold rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${T.ct}, ${T.ch})`,
                  color: T.wh,
                  fontSize: 18,
                  padding: '20px 48px',
                  textDecoration: 'none',
                  boxShadow: T.shCta,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                👉 Comenzar mi LLC ahora
              </Link>
            </div>

            {/* No cc badge */}
            <p className="flex items-center gap-1.5 mb-7" style={{ fontSize: 13, color: 'rgba(255,255,255,.42)' }}>
              🔒 Sin tarjeta de crédito para empezar · Sin compromiso
            </p>

            {/* Secondary CTA */}
            <div className="mb-10">
              <Link
                href="#proceso"
                onClick={() => Analytics.trackHowItWorks('hero')}
                className="inline-flex items-center gap-2 font-semibold rounded-full"
                style={{
                  background: 'rgba(255,255,255,.09)',
                  border: '1.5px solid rgba(255,255,255,.2)',
                  color: 'rgba(255,255,255,.88)',
                  fontSize: 15,
                  padding: '13px 26px',
                  textDecoration: 'none',
                }}
              >
                Ver cómo funciona ↓
              </Link>
            </div>

            {/* Country pills */}
            <div className="flex flex-wrap gap-2">
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

          {/* ── Illustration ── */}
          <div className="hp-himg hp-fu flex justify-center">
            <div className="hp-float w-full" style={{ maxWidth: 500 }}>
              <Image
                src="/images/hero.webp"
                alt="Emprendedor hispanohablante abriendo su LLC en EE.UU. desde su ordenador"
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
const BENEFITS = [
  {
    icon: '💰',
    iconBg: '#D1FAE5',
    iconColor: T.gd,
    title: 'Paga menos impuestos, de forma legal',
    desc: 'Muchos clientes reducen su carga fiscal entre un 30% y un 50% estructurando sus ingresos a través de una LLC. Sin trampas. El sistema americano está diseñado para esto.',
  },
  {
    icon: '💳',
    iconBg: '#DBEAFE',
    iconColor: T.b7,
    title: 'Cobra en dólares con Stripe, Mercury y PayPal',
    desc: 'Sin entidad en EE.UU., muchas plataformas te cierran la puerta. Con tu LLC activa, abres cuentas en Mercury o Wise Business y cobras en dólares sin comisiones abusivas.',
  },
  {
    icon: '🌍',
    iconBg: '#EDE9FE',
    iconColor: '#7C3AED',
    title: 'Proyecta imagen de empresa internacional',
    desc: '"XYZ LLC" en lugar de "Juan García, autónomo". Para clientes en EE.UU., Canadá o UK, la diferencia es enorme. Una LLC te pone al nivel de quien ya gana los contratos que tú quieres.',
  },
  {
    icon: '🔒',
    iconBg: '#FEF3C7',
    iconColor: '#92400E',
    title: 'Tu patrimonio personal, protegido',
    desc: 'La LLC separa legalmente tus bienes personales de las deudas de tu empresa. Si algo sale mal en el negocio, tu casa, tu coche y tus ahorros no están en juego.',
  },
  {
    icon: '📋',
    iconBg: '#DBEAFE',
    iconColor: T.b9,
    title: 'Cumplimiento fiscal 100% en regla',
    desc: 'Con declaración anual incluida en los planes superiores, cumples con el IRS sin entender la normativa americana. Nos encargamos nosotros — sin que tengas que mover un dedo.',
  },
  {
    icon: '⚡',
    iconBg: '#D1FAE5',
    iconColor: T.gd,
    title: 'Operativo en 72 horas, no en meses',
    desc: 'Los trámites tradicionales tardan semanas o meses. Con Open LLC USA, tu empresa está activa y lista para facturar en menos de tres días hábiles. Verificado por +500 clientes.',
  },
]

function BenefitsSection() {
  return (
    <section style={{ padding: '112px 0', background: T.sf }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div className="hp-fu text-center mb-16">
          <Eyebrow text="Por qué funciona" />
          <SectionHeading>Lo que cambia el día que tienes tu LLC</SectionHeading>
          <p className="text-lg mt-3 mx-auto" style={{ color: T.ts, maxWidth: 560 }}>
            No es solo abrir una empresa. Es abrir una puerta que antes estaba cerrada.
          </p>
        </div>

        {/* Benefits grid — 3 cols × 2 rows */}
        <div
          className="hp-tgrid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}
        >
          {BENEFITS.map(({ icon, iconBg, title, desc }) => (
            <div
              key={title}
              className="hp-fu rounded-2xl"
              style={{
                background: T.wh,
                border: `1.5px solid ${T.br}`,
                padding: '32px 28px',
                boxShadow: T.shCard,
              }}
            >
              {/* Icon badge */}
              <div
                className="flex items-center justify-center mb-5 flex-shrink-0"
                style={{
                  width: 52, height: 52,
                  borderRadius: 14,
                  background: iconBg,
                  fontSize: 24,
                }}
              >
                {icon}
              </div>
              <h3
                className="font-bold mb-2.5 leading-snug"
                style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 16,
                  color: T.tx,
                }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: T.ts }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

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
// SERVICES SECTION
// ─────────────────────────────────────────────────────────────────────────────
const SERVICES = [
  { Icon: IconLLC, title: 'Registro de LLC', desc: 'Crea tu empresa en Wyoming, New Mexico, Delaware o Florida. Lista para operar globalmente.', href: '/servicios/formacion-llc', cta: 'Ver detalles' },
  { Icon: IconEIN, title: 'Obtén tu EIN sin SSN', desc: 'Necesario para abrir cuenta bancaria, contratar y pagar impuestos. Lo tramitamos por ti.', href: '/servicios/obtencion-ein', cta: 'Solicitar EIN' },
  { Icon: IconAgent, title: 'Agente Registrado', desc: 'Cumple con los requisitos legales de tu estado. Incluido el primer año sin costo adicional.', href: '/servicios/agente-registrado', cta: 'Más información' },
  { Icon: IconBank, title: 'Cuenta Bancaria Empresarial', desc: 'Te conectamos con bancos que aceptan LLCs de no residentes. Mercury, Relay y más.', href: '/servicios/launch-banking', cta: 'Explorar opciones' },
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
            Desde el registro hasta el cumplimiento fiscal. Te acompañamos en cada paso.
          </p>
        </div>

        {/* Grid */}
        <div
          className="hp-sgrid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}
        >
          {SERVICES.map(({ Icon, title, desc, href, cta }) => (
            <div
              key={title}
              className="hp-fu hp-scard rounded-2xl"
              style={{ background: T.wh, border: `1.5px solid ${T.br}`, padding: '38px 28px', boxShadow: T.shCard }}
            >
              <div className="mb-6"><Icon /></div>
              <h3 className="font-bold mb-2.5 text-lg" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", color: T.tx }}>{title}</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: T.ts }}>{desc}</p>
              <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: T.b7, textDecoration: 'none' }}>
                {cta} <ArrowRight size={13} strokeWidth={2.5} />
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
// PROCESS / TIMELINE SECTION
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [
  { Icon: ProcIconForm, n: 1, tag: '⏱ Solo 5 minutos', title: 'Completa el formulario', desc: '5 minutos. Solo necesitas tu pasaporte. Nada más.' },
  { Icon: ProcIconWork, n: 2, tag: '⚡ Sin complicaciones', title: 'Nosotros hacemos el trabajo', desc: 'Registro estatal + EIN + Agente registrado. Todo incluido, sin que muevas un dedo.' },
  { Icon: ProcIconDone, n: 3, tag: '🌍 En 72 horas', title: 'Recibe tus documentos', desc: 'En 72 horas. Listo para operar en EE.UU. desde cualquier lugar del mundo.' },
]

function ProcessSection() {
  return (
    <section id="proceso" style={{ padding: '120px 0', background: T.sf }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div className="hp-fu text-center mb-[72px]">
          <Eyebrow text="Cómo funciona" />
          <SectionHeading>Así de fácil. En serio.</SectionHeading>
          <p className="text-lg mt-3" style={{ color: T.ts }}>Sin papeleos confusos. Sin viajes. Sin esperas eternas.</p>
        </div>

        {/* Timeline grid */}
        <div style={{ position: 'relative' }}>
          <div className="hp-pconn" />
          <div
            className="hp-pcols"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36, position: 'relative', zIndex: 1 }}
          >
            {STEPS.map(({ Icon, n, tag, title, desc }) => (
              <div key={n} className="hp-fu text-center px-3">
                {/* Circle */}
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
                <h3 className="font-bold text-xl mb-2.5" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", color: T.tx }}>{title}</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: T.ts }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA below timeline */}
        <div className="hp-fu text-center mt-[60px]">
          <Link
            href="#comenzar"
            onClick={() => Analytics.trackStartLLC('process')}
            className="inline-flex items-center gap-2 font-bold rounded-full"
            style={{ background: T.b9, color: T.wh, fontSize: 16, padding: '16px 40px', textDecoration: 'none', boxShadow: T.shBlue }}
          >
            Iniciar mi LLC ahora <ArrowRight size={16} />
          </Link>
          <p className="text-sm mt-3.5" style={{ color: T.tm }}>🔒 Sin tarjeta de crédito · Sin compromiso</p>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LATAM SECTION
// ─────────────────────────────────────────────────────────────────────────────
const COUNTRIES: [string, string, string][] = [
  ['MX', '/guias/mx', 'México'], ['CO', '/guias/co', 'Colombia'],
  ['ES', '/guias/es', 'España'], ['AR', '/guias/ar', 'Argentina'],
  ['PE', '/guias/pe', 'Perú'], ['US', '/guias/us', 'EE.UU.'],
  ['PY', '/guias/py', 'Paraguay'],
]

function LatamSection() {
  return (
    <section
      style={{
        background: `linear-gradient(135deg, ${T.b0} 0%, #E0EDFF 100%)`,
        padding: '88px 0',
        borderTop: `1px solid ${T.b1}`,
        borderBottom: `1px solid ${T.b1}`,
      }}
    >
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }} className="text-center">
        <div className="hp-fu">
          <Eyebrow text="Cobertura global" />
          <h2
            className="font-extrabold mt-3.5 mb-3.5"
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(26px,3.5vw,42px)', color: T.b9 }}
          >
            No importa desde dónde estés
          </h2>
          <p className="text-[17px] mx-auto mb-10" style={{ color: T.ts, maxWidth: 560 }}>
            Ya hemos ayudado a fundadores de México, Colombia, España, Argentina, Perú, EE.UU., Paraguay y más a establecer su presencia legal en EE.UU.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {COUNTRIES.map(([code, href, name]) => (
              <Link
                key={name}
                href={href}
                className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full"
                style={{ background: T.wh, border: `1px solid ${T.br}`, color: T.b9, textDecoration: 'none', boxShadow: T.shCard }}
              >
                <ReactCountryFlag countryCode={code} svg style={{ fontSize: '1.2em', borderRadius: '2px', boxShadow: '0 0 2px rgba(0,0,0,0.1)' }} />
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS SECTION
// ─────────────────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    image: '/images/testimonio-carlos.webp',
    initial: 'C', name: 'Carlos M.', country: '🇨🇴 Colombia',
    grad: `linear-gradient(135deg, ${T.b9}, ${T.b7})`,
    quote: '"Gracias a Open LLC USA, ahora tengo mi LLC en Delaware y una cuenta en Mercury. Todo en 4 días."',
  },
  {
    image: '/images/testimonio-ana.webp',
    initial: 'A', name: 'Ana R.', country: '🇲🇽 México',
    grad: `linear-gradient(135deg, ${T.gd}, ${T.gn})`,
    quote: '"El proceso fue sorprendentemente simple. El equipo respondió todas mis dudas en español y obtuve mi EIN sin complicaciones."',
  },
  {
    image: '/images/testimonio-miguel.webp',
    initial: 'M', name: 'Miguel S.', country: '🇪🇸 España',
    grad: `linear-gradient(135deg, ${T.ct}, ${T.ch})`,
    quote: '"Perfecto para iniciar mi negocio digital. Soporte excepcional y precios justos."',
  },
]

function TestimonialsSection() {
  return (
    <section id="testimonios" style={{ padding: '120px 0', background: T.wh }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
        <div className="hp-fu text-center mb-16">
          <Eyebrow text="Testimonios" />
          <SectionHeading>Lo dicen quienes ya dieron el paso</SectionHeading>
        </div>

        <div className="hp-tgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {TESTIMONIALS.map(({ image, initial, name, country, grad, quote }) => (
            <div
              key={name}
              className="hp-fu hp-tcard rounded-2xl"
              style={{ background: T.wh, border: `1.5px solid ${T.br}`, padding: '32px 28px', boxShadow: T.shCard, position: 'relative', overflow: 'hidden' }}
            >
              {/* Decorative quote */}
              <div aria-hidden style={{ position: 'absolute', top: 14, right: 18, fontSize: 80, fontFamily: 'Georgia,serif', color: T.b0, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>"</div>
              {/* Stars */}
              <div className="flex gap-0.5 mb-3.5">
                {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#F59E0B', fontSize: 17 }}>★</span>)}
              </div>
              {/* Quote */}
              <p className="text-[15px] leading-relaxed mb-6 italic relative z-10" style={{ color: T.ts }}>{quote}</p>
              {/* Author */}
              <div className="flex items-center gap-3">
                {image ? (
                  <div className="flex-shrink-0" style={{ width: 46, height: 46, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${T.b1}` }}>
                    <Image src={image} alt={name} width={46} height={46} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center font-extrabold text-lg flex-shrink-0"
                    style={{ width: 46, height: 46, borderRadius: '50%', background: grad, color: T.wh, fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                  >
                    {initial}
                  </div>
                )}
                <div>
                  <div className="font-bold text-[15px]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", color: T.tx }}>{name}</div>
                  <div className="text-[13px] mt-0.5" style={{ color: T.tm }}>{country}</div>
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
// PRICING SECTION
// ─────────────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Esencial', price: '$199', featured: false,
    features: ['✅ Registro de LLC', '✅ EIN incluido', '✅ Agente Registrado (1er año)', '✅ Documentos digitales', '✅ Soporte en español'],
  },
  {
    name: 'Pro', price: '$349', featured: true,
    features: ['✅ Todo del plan Esencial', '✅ Apertura cuenta bancaria', '✅ Consultoría fiscal inicial', '✅ Operating Agreement', '✅ Prioridad de soporte'],
  },
  {
    name: 'Premium', price: '$599', featured: false,
    features: ['✅ Todo del plan Pro', '✅ Impuestos Federales (5472)', '✅ Reporte Anual incluido', '✅ Consultoría legal 1 hora', '✅ Acceso prioritario VIP'],
  },
]

function PricingSection() {
  return (
    <section id="precios" style={{ padding: '120px 0', background: T.sf }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div className="hp-fu text-center mb-4">
          <Eyebrow text="Precios transparentes" />
          <SectionHeading>Sin costos ocultos. Todo incluido.</SectionHeading>
          <p className="text-lg mt-3" style={{ color: T.ts }}>Elige el plan que mejor se adapte a tu negocio. Sin sorpresas.</p>
        </div>

        {/* Guarantee pill above grid */}
        <div className="hp-fu text-center mb-14">
          <span
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-full"
            style={{ background: T.gl, border: `1px solid rgba(16,185,129,.3)`, color: T.gd }}
          >
            🛡️ Garantía de Tramitación 100% Sin Errores · Sin costos ocultos
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
              {/* Most popular badge */}
              {featured && (
                <div
                  className="absolute text-xs font-bold px-[18px] py-1.5 rounded-full whitespace-nowrap"
                  style={{ top: -14, left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg,${T.ct},${T.ch})`, color: T.wh, boxShadow: T.shCta }}
                >
                  ⭐ Más Popular
                </div>
              )}

              <div
                className="text-[13px] font-bold tracking-widest uppercase mb-2.5"
                style={{ color: featured ? 'rgba(255,255,255,.5)' : T.tm }}
              >
                {name}
              </div>

              <div
                className="font-extrabold leading-none mb-1.5"
                style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 56, color: featured ? T.wh : T.tx }}
              >
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

              {/* Guarantee badge inside Pro card */}
              {featured && (
                <div
                  className="flex items-center gap-2 rounded-[10px] mb-4.5 px-3.5 py-2.5"
                  style={{ background: 'rgba(16,185,129,.12)', border: '1px solid rgba(16,185,129,.25)' }}
                >
                  <span className="text-base">🛡️</span>
                  <span className="text-[13px] font-semibold" style={{ color: '#6EE7B7' }}>
                    Garantía de tramitación sin errores
                  </span>
                </div>
              )}

              <Link
                href="#comenzar"
                onClick={() => Analytics.trackStartLLC('pricing')}
                className="block text-center font-bold text-[15px] py-[15px] rounded-full"
                style={{
                  textDecoration: 'none',
                  background: featured ? `linear-gradient(135deg,${T.ct},${T.ch})` : T.b9,
                  color: T.wh,
                  boxShadow: featured ? T.shCta : T.shBlue,
                }}
              >
                {featured ? '👉 Comenzar ahora' : 'Elegir este plan'}
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
// GUARANTEE SECTION
// ─────────────────────────────────────────────────────────────────────────────
const TRUST_BADGES = [
  '🔒 Pago 100% Seguro', '🏛️ IRS Authorized Agent',
  '💬 Soporte en Español', '🛡️ Garantía 100% Sin Errores', '⭐ +500 LLCs registradas',
]

function GuaranteeSection() {
  return (
    <section id="garantia" style={{ padding: '120px 0', background: T.wh, borderTop: `1px solid ${T.br}` }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
        <div
          className="hp-fu hp-gi"
          style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 64, alignItems: 'center', maxWidth: 920, margin: '0 auto' }}
        >
          <div className="hp-gi-img flex justify-center">
            <Image
              src="/images/garantia.webp"
              alt="Sello de garantía de tramitación sin errores"
              width={200}
              height={200}
              style={{ width: 200, height: 200, objectFit: 'contain', filter: 'drop-shadow(0 16px 36px rgba(30,58,138,.2))' }}
            />
          </div>

          <div>
            <Eyebrow text="Sin riesgos" green />
            <h2
              className="font-extrabold mt-3.5 mb-3.5 leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(24px,3vw,38px)', color: T.tx }}
            >
              Garantía de Tramitación 100% Sin Errores
            </h2>
            <p className="text-[17px] leading-relaxed mb-7" style={{ color: T.ts, maxWidth: 500 }}>
              Si cometemos algún error en la tramitación de tu LLC que resulte en un rechazo por parte del estado, asumimos el costo de la corrección al 100%. Tu tranquilidad está garantizada.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {TRUST_BADGES.map((b) => (
                <span
                  key={b}
                  className="text-sm font-semibold px-4 py-[7px] rounded-full"
                  style={{ background: T.sf, border: `1.5px solid ${T.br}`, color: T.ts }}
                >
                  {b}
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
// QUICK CONTACT FORM
// ─────────────────────────────────────────────────────────────────────────────
const COUNTRIES_LIST = [
  'España', 'México', 'Colombia', 'Argentina', 'Chile', 'Perú',
  'Venezuela', 'Ecuador', 'Guatemala', 'Bolivia', 'Otro país',
]

function QuickContactSection() {
  const [form, setForm] = useState({ name: '', email: '', country: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trackeamos el intento de envío
    Analytics.trackAdvisoryFormSubmit({
      country: form.country || 'no_seleccionado'
    });

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

      const data = await response.json();

      if (response.ok) {
        setSent(true);
        Analytics.trackAdvisoryFormSuccess();
      } else {
        alert('Hubo un error al enviar el formulario. Inténtalo de nuevo.');
        console.error('Error del servidor:', data);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('Error de conexión. Por favor, inténtalo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', fontSize: 15, color: T.tx,
    background: T.sf, border: `1.5px solid ${T.br}`, borderRadius: 12,
    fontFamily: "'Inter',sans-serif",
  }

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
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(24px,3vw,36px)', color: T.b9 }}
          >
            ¿Tienes dudas? Recibe asesoría personalizada en ‹12h
          </h2>
          <p className="text-base mx-auto" style={{ color: T.ts, maxWidth: 500 }}>
            Sin compromiso. Un especialista te responderá en español y resolverá todas tus preguntas.
          </p>
        </div>

        {/* Success state */}
        {sent ? (
          <div
            className="hp-fu hp-on text-center rounded-2xl mx-auto"
            style={{ background: T.wh, border: `1.5px solid rgba(16,185,129,.35)`, padding: '48px 36px', boxShadow: T.shCard, maxWidth: 560 }}
          >
            <div
              className="flex items-center justify-center text-3xl mx-auto mb-5"
              style={{ width: 64, height: 64, borderRadius: '50%', background: T.gl }}
            >
              ✅
            </div>
            <h3 className="font-bold text-xl mb-2.5" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", color: T.tx }}>¡Mensaje recibido!</h3>
            <p className="text-[15px]" style={{ color: T.ts }}>
              Un especialista te contactará en menos de 12 horas. Revisa tu bandeja de entrada (y spam, por si acaso).
            </p>
          </div>
        ) : (
          /* Form */
          <form
            onSubmit={handleSubmit}
            className="hp-fu rounded-2xl mx-auto"
            style={{ background: T.wh, border: `1.5px solid ${T.br}`, padding: '40px 36px', boxShadow: T.shCard, maxWidth: 680 }}
          >
            <div className="hp-fgrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: T.ts }}>Nombre *</label>
                <input
                  className="hp-input"
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
                  className="hp-input"
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
                className="hp-input"
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
                transition: 'background .2s, transform .18s',
              }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Enviando…
                </span>
              ) : '✉️ Recibir asesoría gratuita'}
            </button>

            <p className="text-[12px] text-center mt-3" style={{ color: T.tm }}>
              🔒 Sin spam. Sin compromiso. Respuesta garantizada en menos de 12 horas.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CTA FINAL SECTION
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
            className="font-extrabold leading-[1.12] mb-4.5"
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(30px,4.5vw,54px)', color: T.wh }}
          >
            No dejes que la burocracia frene tu negocio global
          </h2>
          <p className="text-lg mb-12" style={{ color: 'rgba(255,255,255,.68)' }}>
            Miles de emprendedores ya lo hicieron. Ahora te toca a ti.
          </p>

          {/* Primary CTA */}
          <Link
            href="#comenzar"
            onClick={() => Analytics.trackStartLLC('footer')}
            className="hp-pcta inline-flex items-center gap-2.5 font-extrabold rounded-full mb-4"
            style={{
              background: `linear-gradient(135deg,${T.ct},${T.ch})`,
              color: T.wh, fontSize: 18, padding: '20px 52px',
              textDecoration: 'none',
              fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}
          >
            👉 Crear mi LLC en 3 minutos
          </Link>

          {/* Secondary CTA */}
          <div className="mb-6">
            <Link
              href="/calculadora-fiscal"
              className="inline-flex items-center gap-2 font-semibold rounded-full"
              style={{
                background: 'rgba(255,255,255,.09)', border: '1.5px solid rgba(255,255,255,.2)',
                color: 'rgba(255,255,255,.88)', fontSize: 15, padding: '13px 30px', textDecoration: 'none',
              }}
            >
              🧮 Calculadora Fiscal
            </Link>
          </div>

          <p className="text-[13px]" style={{ color: 'rgba(255,255,255,.36)' }}>
            🔒 Sin tarjeta de crédito · Garantía 7 días · +500 LLCs registradas
          </p>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE STICKY CTA
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
          Abre tu LLC en 72 horas
        </div>
        <div className="text-xs" style={{ color: T.tm }}>Desde $199 · Sin tarjeta para empezar</div>
      </div>
      <Link
        href="#comenzar"
        className="inline-flex items-center font-bold rounded-full whitespace-nowrap flex-shrink-0"
        style={{
          background: `linear-gradient(135deg,${T.ct},${T.ch})`,
          color: T.wh, fontSize: 14, padding: '11px 22px',
          textDecoration: 'none', boxShadow: T.shCta,
          fontFamily: "'Plus Jakarta Sans',sans-serif",
        }}
      >
        Comenzar →
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
      <BenefitsSection />
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