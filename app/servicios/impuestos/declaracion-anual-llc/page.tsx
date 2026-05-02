// app/servicios/form-5472-1120/page.tsx
// Esta carpeta existe como ruta estática y Next.js NO usa [slug]/page.tsx.
// Creamos aquí la página de presentación del servicio de Impuestos Federales.

import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import {
  ShieldCheck,
  Clock,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  Globe,
  BookOpen,
  Zap,
  Lock,
  HeadphonesIcon
} from 'lucide-react'

const SLUG = 'form-5472-1120'

export async function generateMetadata(): Promise<Metadata> {
  const { data: s } = await supabaseAdmin
    .from('servicios')
    .select('nombre, descripcion')
    .eq('slug', SLUG)
    .single()

  if (!s) return { title: 'Impuestos Federales LLC | Open LLC USA' }
  return {
    title: `${(s as any).nombre} | Open LLC USA`,
    description: ((s as any).descripcion as string | null)?.slice(0, 160) ?? '',
    openGraph: {
      title: `${(s as any).nombre} | Open LLC USA`,
      description: ((s as any).descripcion as string | null)?.slice(0, 160) ?? '',
    },
  }
}

const timeline = [
  { day: 'Paso 1', title: 'Recogida de datos', desc: 'Completás el cuestionario fiscal con tus transacciones del año.' },
  { day: 'Paso 2', title: 'Preparación de formularios', desc: 'Nuestro equipo prepara el Form 5472 + 1120 correctamente.' },
  { day: 'Paso 3', title: 'Revisión y firma', desc: 'Revisas y apruebas los documentos antes de la presentación.' },
  { day: 'Paso 4', title: 'Presentación al IRS', desc: 'Enviamos en plazo para evitar la multa de $25,000 USD.' },
]

const faqs = [
  { q: '¿Qué pasa si no presento estos formularios?', a: 'El IRS impone multas desde $25,000 USD por Form 5472 no presentado o presentado incompleto.' },
  { q: '¿Cuándo es la fecha límite?', a: 'Generalmente el 15 de abril de cada año, para las operaciones del año anterior. Se puede pedir prórroga si se necesita más tiempo.' },
  { q: '¿Necesito pagar impuestos en EE.UU.?', a: 'Si eres extranjero no residente, operas desde fuera de EE.UU. y no tienes presencia física (ETBUS), normalmente no pagas Income Tax, pero sí debes presentar estos formularios de forma informativa.' },
]

export default async function ImpuestosFederalesPage() {
  const { data: dbServicio, error } = await supabaseAdmin
    .from('servicios')
    .select('*')
    .eq('slug', SLUG)
    .single() as { data: any; error: unknown }

  // Si no encuentra 'form-5472-1120', intentar con 'form-5472'
  let servicio = dbServicio;
  if (error || !servicio) {
    const { data: altServicio } = await supabaseAdmin
      .from('servicios')
      .select('*')
      .eq('slug', 'form-5472')
      .single() as { data: any; error: unknown }
    
    if (altServicio) {
      servicio = altServicio;
    } else {
      // Fallback estricto si no hay BD para que la build no falle (404)
      servicio = {
        nombre: 'Declaración de Impuestos Federales',
        descripcion: 'Presentación anual del Formulario 1120 + 5472.',
        precio: 397
      }
    }
  }

  const precioFormateado = servicio.precio?.toLocaleString('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }) ?? '$397'

  const descripcionLineas: string[] = servicio.descripcion
    ? servicio.descripcion.split('\n').filter((l: string) => l.trim() !== '')
    : ['Presentación anual del Formulario 1120 + 5472.']

  return (
    <div className="sd-page">

      <nav className="sd-breadcrumb">
        <ol>
          <li><Link href="/">Inicio</Link></li>
          <li><ChevronRight size={14} /></li>
          <li><Link href="/servicios">Servicios</Link></li>
          <li><ChevronRight size={14} /></li>
          <li style={{ fontWeight: 600, color: '#111827' }}>{servicio.nombre}</li>
        </ol>
      </nav>

      <div className="sd-grid">

        <div className="sd-main">

          <section className="sd-card">
            <div className="sd-card-icon-bg">
              <BookOpen size={220} />
            </div>
            <div className="sd-card-inner">
              <div className="sd-badge-wrapper">
                <span className="sd-badge sd-badge-individual">⚙️ Servicio individual</span>
              </div>
              <h1 className="sd-title">{servicio.nombre}</h1>
              <p className="sd-subtitle">
                {servicio.descripcion?.slice(0, 220)}
                {servicio.descripcion && servicio.descripcion.length > 220 ? '…' : ''}
              </p>
              <div className="sd-trust-grid">
                {[
                  { icon: ShieldCheck,     text: 'Garantía de tramitación 100% sin errores' },
                  { icon: Clock,           text: 'Gestión antes del plazo fiscal' },
                  { icon: Globe,           text: '100% online, sin viajar' },
                  { icon: HeadphonesIcon,  text: 'Soporte experto en español' },
                ].map((item, i) => (
                  <div key={i} className="sd-trust-item">
                    <item.icon size={18} className="sd-trust-icon" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {descripcionLineas.length > 0 && (
            <section className="sd-card">
              <h2 className="sd-section-title">
                <BookOpen size={22} style={{ color: '#2563eb' }} />
                ¿Qué esperar de este servicio?
              </h2>
              {descripcionLineas.map((linea: string, i: number) => (
                <p key={i} className="sd-desc-text">{linea}</p>
              ))}
            </section>
          )}

          <section className="sd-card">
            <h2 className="sd-section-title">
              <Zap size={22} style={{ color: '#2563eb' }} />
              Línea de tiempo del proceso
            </h2>
            <div className="sd-timeline">
              {timeline.map((item, i) => (
                <div key={i} className="sd-timeline-item">
                  <div className="sd-timeline-dot" />
                  <p className="sd-timeline-day">{item.day}</p>
                  <p className="sd-timeline-step-title">{item.title}</p>
                  <p className="sd-timeline-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="sd-section-title">
              <ShieldCheck size={22} style={{ color: '#16a34a' }} />
              Lo que dicen otros fundadores
            </h2>
            <div className="sd-testi-grid">
              {[
                { name: 'Andrés V.', city: 'Madrid, España',     text: 'Tenía mil dudas sobre los formularios 5472. Me lo resolvieron de forma clara y antes del plazo. ¡Sin multas y con total tranquilidad!' },
                { name: 'Lucía F.',  city: 'Bogotá, Colombia', text: 'El proceso fue muy sencillo: completé el cuestionario, revisé el borrador y ellos se encargaron de presentar todo ante el IRS. Muy recomendados.' },
              ].map((t, i) => (
                <div key={i} className="sd-testi-card">
                  <div className="sd-testi-stars">★★★★★</div>
                  <p className="sd-testi-text">"{t.text}"</p>
                  <div className="sd-testi-author">
                    <div className="sd-testi-avatar">{t.name[0]}</div>
                    <div>
                      <p className="sd-testi-name">{t.name}</p>
                      <p className="sd-testi-city">{t.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="sd-section-title">
              <HelpCircle size={22} style={{ color: '#2563eb' }} />
              Preguntas frecuentes
            </h2>
            {faqs.map((faq, i) => (
              <details key={i} className="sd-faq-item">
                <summary className="sd-faq-summary">
                  {faq.q}
                  <span className="sd-faq-chevron">›</span>
                </summary>
                <p className="sd-faq-answer">{faq.a}</p>
              </details>
            ))}
          </section>
        </div>

        <div className="sd-sidebar">

          <div className="sd-price-card">
            <p className="sd-price-label">Precio total</p>
            <p className="sd-price-amount">{precioFormateado}</p>
            <p className="sd-price-note">Pago único · Sin costes ocultos · Deducible fiscalmente</p>

            <Link href={`/servicios/impuestos/declaracion-anual-llc/onboarding`} className="sd-cta-button">
              Empezar proceso ahora
              <ArrowRight size={18} />
            </Link>

            <div className="sd-trust-footer">
              <div className="sd-trust-row">
                <Lock size={15} style={{ color: '#16a34a', flexShrink: 0 }} />
                <span>Pago 100% seguro · SSL cifrado</span>
              </div>
              <div className="sd-trust-row">
                <HeadphonesIcon size={15} style={{ color: '#2563eb', flexShrink: 0 }} />
                <span>Soporte prioritario incluido</span>
              </div>
              <div className="sd-trust-row">
                <ShieldCheck size={15} style={{ color: '#7c3aed', flexShrink: 0 }} />
                <span>Garantía de tramitación 100% sin errores</span>
              </div>
            </div>
          </div>

          <div className="sd-guarantee-card">
            <div className="sd-guarantee-icon-bg">
              <ShieldCheck size={150} />
            </div>
            <p className="sd-guarantee-kicker">¿Por qué elegirnos?</p>
            <p className="sd-guarantee-title">Garantía de Tramitación 100% Sin Errores</p>
            <p className="sd-guarantee-desc">
              Si cometemos cualquier error en la gestión de tu trámite, lo corregimos sin coste adicional. Tu expediente, bien hecho a la primera.
            </p>
            <div className="sd-avatars">
              {['A', 'L', 'M', 'R'].map((l, i) => (
                <div key={i} className="sd-avatar">{l}</div>
              ))}
              <div className="sd-avatar sd-avatar-count">+500</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
