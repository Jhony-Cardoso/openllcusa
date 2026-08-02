// Página de detalle del servicio de Impuestos (Obtención EIN)
// Ruta estática: /servicios/impuestos/obtencion-ein
// Usa el slug actual de la base de datos.

import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
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

const SLUG = 'impuestos/obtencion-ein'

export async function generateMetadata(): Promise<Metadata> {
  const { data: s } = await supabaseAdmin
    .from('servicios')
    .select('nombre, descripcion')
    .eq('slug', SLUG)
    .single()

  if (!s) return { title: 'Obtención de EIN para LLC | Open LLC USA' }
  return {
    title: `${(s as any).nombre} | Open LLC USA`,
    description: ((s as any).descripcion as string | null)?.slice(0, 160) ?? 'Obtén tu número fiscal federal (EIN) sin SSN ni ITIN. Servicio profesional en 5-7 días hábiles.',
    openGraph: {
      title: `${(s as any).nombre} | Open LLC USA`,
      description: ((s as any).descripcion as string | null)?.slice(0, 160) ?? 'Obtén tu número fiscal federal (EIN) sin SSN ni ITIN.',
    },
  }
}

const timeline = [
  { day: 'Paso 1', title: 'Firma de Autorización', desc: 'Firmas digitalmente el formulario SS-4 para autorizarnos ante el IRS.' },
  { day: 'Paso 2', title: 'Tramitación oficial', desc: 'Nosotros preparamos y presentamos el documento al IRS el mismo día.' },
  { day: 'Paso 3', title: 'Recepción del EIN', desc: 'En un plazo de 5 a 7 días hábiles recibes la carta CP 575 oficial con tu número.' },
]

const faqs = [
  { q: '¿Necesito tener SSN o ITIN?', a: 'No. Si tu LLC tiene al menos un miembro extranjero (sin SSN), podemos obtener el EIN sin problema.' },
  { q: '¿Cuánto tarda el proceso?', a: 'Normalmente 5-7 días hábiles desde que presentamos la solicitud al IRS.' },
  { q: '¿Puedo usar el EIN para abrir cuenta bancaria?', a: 'Sí, el EIN es requisito obligatorio para abrir cuentas bancarias empresariales en EE.UU.' },
]

export default async function ObtencionEinPage() {
  const { data: dbServicio, error } = await supabaseAdmin
    .from('servicios')
    .select('*')
    .eq('slug', SLUG)
    .single() as { data: any; error: unknown }

  let servicio = dbServicio;
  if (error || !servicio) {
    // Fallback si no hay datos en BD
    servicio = {
      nombre: 'Obtención de EIN',
      descripcion: 'Obtén tu número fiscal federal para tu empresa LLC en Estados Unidos. Requisito esencial para abrir cuentas bancarias, contratar empleados, presentar impuestos y operar legalmente. Sin necesidad de SSN o ITIN.',
      precio: 197
    }
  }

  const precioFormateado = servicio.precio?.toLocaleString('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }) ?? '$197'

  const descripcionLineas = servicio.descripcion
    ? servicio.descripcion.split('\n').filter((l: string) => l.trim() !== '')
    : [
        'El EIN (Employer Identification Number) es el número de identificación fiscal que el IRS asigna a las empresas en Estados Unidos.',
        'Nosotros nos encargamos de todo el proceso con el IRS sin que necesites un Social Security Number (SSN).'
      ]

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
                  { icon: ShieldCheck,     text: '100% Legal y Certificado por IRS' },
                  { icon: Clock,           text: 'Procesamiento en 5-7 días hábiles' },
                  { icon: Globe,           text: 'Sin SSN ni ITIN requerido' },
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

            <Link href={`/servicios/impuestos/obtencion-ein/onboarding`} className="sd-cta-button">
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
                <span>Gestión oficial ante el IRS</span>
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