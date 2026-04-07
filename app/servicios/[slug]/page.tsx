import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import {
  CheckCircle2,
  ShieldCheck,
  Clock,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  Globe,
  Smartphone,
  BookOpen,
  Search,
  Zap,
  Lock,
  HeadphonesIcon
} from 'lucide-react'

interface Servicio {
  id: string
  slug: string
  nombre: string
  descripcion: string | null
  precio: number
  precio_recurrente?: number | null
  frecuencia_recurrente?: string | null
  requiere_llc: boolean
  tipo?: string
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: s } = await supabase
    .from('servicios')
    .select('nombre, descripcion')
    .eq('slug', slug)
    .single() as { data: Partial<Servicio> | null }

  if (!s) return {}
  return {
    title: `${s.nombre} | Open LLC USA`,
    description: s.descripcion?.slice(0, 160) ?? '',
    openGraph: { title: `${s.nombre} | Open LLC USA`, description: s.descripcion?.slice(0, 160) ?? '' }
  }
}

function getIconForSlug(slug: string) {
  if (slug.includes('llc') || slug.includes('launch') || slug.includes('primer')) return Globe
  if (slug.includes('banking')) return Smartphone
  if (slug.includes('ein')) return Search
  if (slug.includes('fiscal') || slug.includes('impuestos') || slug.includes('form')) return BookOpen
  if (slug.includes('consultoria')) return HeadphonesIcon
  if (slug.includes('compliance') || slug.includes('agente')) return ShieldCheck
  return Zap
}

function getTimelineForSlug(slug: string) {
  if (slug.includes('llc') || slug.includes('launch') || slug.includes('primer')) {
    return [
      { day: 'Día 1', title: 'Solicitud y Revisión', desc: 'Analizamos tus datos y preparamos los documentos estatales.' },
      { day: 'Día 2–4', title: 'Registro Estatal', desc: 'Tu LLC es aprobada oficialmente por el estado elegido.' },
      { day: 'Día 5–15', title: 'Obtención de EIN', desc: 'Tramitamos tu identificación fiscal ante el IRS sin SSN.' },
      { day: 'Día 16+', title: '¡Listo para operar!', desc: 'Recibes tu kit documental completo y guía para abrir cuenta bancaria.' },
    ]
  }
  if (slug.includes('ein')) {
    return [
      { day: 'Día 1', title: 'Envío de Formulario SS-4', desc: 'Preparamos y enviamos el formulario firmado al IRS en tu nombre.' },
      { day: 'Día 3–7', title: 'Gestión con el IRS', desc: 'Mantenemos contacto directo con el agente del IRS asignado.' },
      { day: 'Día 8–12', title: 'Confirmación del EIN', desc: 'Recibimos y verificamos tu número fiscal oficial.' },
      { day: '¡Listo!', title: 'Entrega de Carta CP 575', desc: 'Te entregamos el documento oficial que el banco te pedirá.' },
    ]
  }
  if (slug.includes('form') || slug.includes('5472') || slug.includes('impuestos')) {
    return [
      { day: 'Paso 1', title: 'Recogida de datos', desc: 'Completás el cuestionario fiscal con tus transacciones del año.' },
      { day: 'Paso 2', title: 'Preparación de formularios', desc: 'Nuestro equipo prepara el Form 5472 + 1120 correctamente.' },
      { day: 'Paso 3', title: 'Revisión y firma', desc: 'Revisas y apruebas los documentos antes de la presentación.' },
      { day: 'Paso 4', title: 'Presentación al IRS', desc: 'Enviamos en plazo para evitar la multa de $25,000 USD.' },
    ]
  }
  if (slug.includes('reporte-anual')) {
    return [
      { day: 'Paso 1', title: 'Recopilación de información', desc: 'Verificamos si hubo cambios en tu LLC durante el último año.' },
      { day: 'Paso 2', title: 'Preparación del reporte', desc: 'Elaboramos el Annual Report cumpliendo con los requisitos de tu estado.' },
      { day: 'Paso 3', title: 'Presentación', desc: 'Pagamos las tasas estatales y enviamos el reporte a las autoridades.' },
      { day: '¡Listo!', title: 'Certificado de Good Standing', desc: 'Te confirmamos que tu LLC sigue activa y en regla por un año más.' },
    ]
  }
  if (slug.includes('agente-registrado')) {
    return [
      { day: 'Paso 1', title: 'Contratación y Alta', desc: 'Te damos de alta en nuestro sistema para actuar como tu Registered Agent.' },
      { day: 'Paso 2', title: 'Actualización en el Estado', desc: 'Presentamos el cambio de Agente Registrado ante la Secretaría de Estado (si aplica).' },
      { day: 'Ongoing', title: 'Recepción de correspondencia', desc: 'Recibimos notificaciones oficiales, demandas o correo fiscal.' },
      { day: '24 hrs', title: 'Escaneo y Notificación', desc: 'Subimos todos los documentos importantes a tu portal y te avisamos de inmediato.' },
    ]
  }
  if (slug.includes('consultoria-legal') || slug.includes('consultoria-fiscal')) {
    return [
      { day: 'Paso 1', title: 'Reserva de sesión', desc: 'Programamos la videollamada en el horario que mejor te convenga.' },
      { day: 'Paso 2', title: 'Cuestionario Previo', desc: 'Nos envías el contexto y preguntas para aprovechar el tiempo al máximo.' },
      { day: 'En vivo', title: 'Videollamada de 1h', desc: 'Sesión personalizada para resolver tus dudas fiscales o societarias.' },
      { day: 'Paso 4', title: 'Plan de de acción', desc: 'Recibes notas y conclusiones clave al finalizar la asesoría.' },
    ]
  }
  if (slug.includes('compliance')) {
    return [
      { day: 'Paso 1', title: 'Auditoría de Estado', desc: 'Verificamos los vencimientos de tu LLC en su estado particular.' },
      { day: 'Paso 2', title: 'Renovación Agente Registrado', desc: 'Mantenemos tu dirección y representación oficial activa.' },
      { day: 'Paso 3', title: 'Preparación Reporte Anual', desc: 'Generamos y presentamos la memoria obligatoria estatal.' },
      { day: '¡Listo!', title: 'Entrega de Good Standing', desc: 'Recibes el comprobante oficial de que tu LLC está en verde probatorio.' },
    ]
  }
  return [
    { day: 'Paso 1', title: 'Solicitud', desc: 'Nos proporcionas la información necesaria para el trámite.' },
    { day: 'Paso 2', title: 'Procesamiento', desc: 'Nuestro equipo experto gestiona la solicitud con el organismo correspondiente.' },
    { day: 'Paso 3', title: 'Entrega', desc: 'Recibes el resultado final en tu portal de cliente.' },
  ]
}

function getFAQsForSlug(slug: string) {
  if (slug.includes('ein')) {
    return [
      { q: '¿Necesito SSN o ITIN para obtener el EIN?', a: 'No. Si tu LLC tiene al menos un miembro extranjero, podemos obtener el EIN sin SSN ni ITIN. Nos encargamos de todo con el IRS.' },
      { q: '¿Cuánto tarda el proceso?', a: 'Entre 8 y 12 días hábiles desde que presentamos la solicitud. En casos excepcionales puede tardar hasta 15 días.' },
      { q: '¿Puedo usar el EIN para abrir cuenta bancaria?', a: 'Sí. Es el documento clave que bancos como Mercury, Relay y Wise Business te solicitarán para abrir tu cuenta empresarial.' },
    ]
  }
  if (slug.includes('form') || slug.includes('5472') || slug.includes('impuestos')) {
    return [
      { q: '¿Qué pasa si no presento estos formularios?', a: 'El IRS impone multas desde $25,000 USD por Form 5472 no presentado o presentado incompleto.' },
      { q: '¿Cuándo es la fecha límite?', a: 'Generalmente el 15 de abril de cada año, para las operaciones del año anterior. Se puede pedir prórroga si se necesita más tiempo.' },
      { q: '¿Necesito pagar impuestos en EE.UU.?', a: 'Si eres extranjero no residente, operas desde fuera de EE.UU. y no tienes presencia física (ETBUS), normalmente no pagas Income Tax, pero sí debes presentar estos formularios de forma informativa.' },
    ]
  }
  if (slug.includes('reporte-anual')) {
    return [
      { q: '¿Qué es el Reporte Anual?', a: 'Es una actualización obligatoria que exige el estado para mantener tu LLC activa. Suele incluir confirmar la dirección y directores.' },
      { q: '¿El precio incluye las tasas del estado?', a: 'No, este servicio cubre nuestros honorarios por preparación, seguimiento y presentación. Las tasas del estado varían (ej. Wyoming $60, Delaware $300).' },
      { q: '¿Qué pasa si no lo presento?', a: 'El estado añadirá multas de penalización y eventualmente disolverá (cerrará) tu empresa, bloqueando su capacidad legal y cuenta bancaria.' },
    ]
  }
  if (slug.includes('agente-registrado')) {
    return [
      { q: '¿Es obligatorio tener Agente Registrado?', a: 'Sí. Todos los estados exigen por ley que tengas una dirección física abierta en horario laboral en el estado de formación para recibir notificaciones formales.' },
      { q: '¿El servicio se renueva anualmente?', a: 'Así es, como exige el estado, proveer la dirección oficial y representación es un servicio continuo que se abona por cada año.' },
      { q: '¿Me enviarán también el correo bloqueado o paquetes?', a: 'El Agente Registrado recibe notificaciones oficiales del gobierno o demandas. No es un servicio de buzón virtual (mail forwarding) ordinario para paquetes, sino legal.' },
    ]
  }
  if (slug.includes('consultoria')) {
    return [
      { q: '¿Podremos ver mi caso en particular?', a: 'Totalmente. Estudiaremos tu país, tu modelo de venta y la estructuración de tu LLC para optimizar e ir sobre seguro.' },
      { q: '¿Es deducible el costo de la consultoría?', a: 'Sí, la consultoría fiscal y legal es un gasto legítimo directamente imputable a los gastos de funcionamiento de tu LLC.' },
    ]
  }
  if (slug.includes('compliance')) {
    return [
      { q: '¿Es obligatorio el compliance básico?', a: 'Sí, no mantener el Agente Registrado activo o no presentar el Reporte Anual lleva al cierre administrativo (disolución) de la LLC.' },
      { q: '¿Incluye declaraciones federales del IRS?', a: 'No, este servicio cubre los requisitos mínimos a nivel ESTATAL. Para las obligaciones federales puedes contratar "Impuestos Federales".' },
      { q: '¿Cuánto tiempo cubre este paquete?', a: 'Cubre la renovación exigida y el servicio de agente registrado por 1 año calendario completo.' },
    ]
  }
  return [
    { q: '¿Necesito estar físicamente en EE.UU.?', a: 'No. Todo el proceso se realiza de forma 100% remota. Nunca necesitarás volar a EE.UU. para crear o gestionar tu LLC.' },
    { q: '¿Es legal si no soy residente americano?', a: 'Totalmente legal. La ley de EE.UU. permite a cualquier extranjero ser dueño y gestionar una LLC sin necesidad de visa ni residencia.' },
    { q: '¿Qué pasa después del primer año?', a: 'Tendrás obligaciones anuales: renovar el agente registrado, presentar el Annual Report (en algunos estados) y gestionar tus impuestos federales.' },
  ]
}

export default async function ServicioDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: servicio, error } = await supabase
    .from('servicios')
    .select('*')
    .eq('slug', slug)
    .single() as { data: Servicio | null; error: unknown }

  if (error || !servicio) notFound()

  const isPaquete = servicio.tipo === 'paquete'
  const IconHeader = getIconForSlug(slug)
  const timeline = getTimelineForSlug(slug)
  const faqs = getFAQsForSlug(slug)
  const descripcionLineas = servicio.descripcion
    ? servicio.descripcion.split('\n').filter((l: string) => l.trim() !== '')
    : []

  const precioFormateado = servicio.precio?.toLocaleString('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }) ?? '—'

  return (
    <div className="sd-page">

      {/* Breadcrumbs */}
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

        {/* ── COLUMNA IZQUIERDA ── */}
        <div className="sd-main">

          {/* Hero card */}
          <section className="sd-card">
            <div className="sd-card-icon-bg">
              <IconHeader size={220} />
            </div>
            <div className="sd-card-inner">
              <div className="sd-badge-wrapper">
                <span className={`sd-badge ${isPaquete ? 'sd-badge-paquete' : 'sd-badge-individual'}`}>
                  {isPaquete ? '🔥 Paquete todo incluido' : '⚙️ Servicio individual'}
                </span>
                {servicio.requiere_llc && (
                  <span className="sd-badge sd-badge-llc">Requiere LLC activa</span>
                )}
              </div>

              <h1 className="sd-title">{servicio.nombre}</h1>

              <p className="sd-subtitle">
                {servicio.descripcion?.slice(0, 220)}
                {servicio.descripcion && servicio.descripcion.length > 220 ? '…' : ''}
              </p>

              <div className="sd-trust-grid">
                {[
                  { icon: ShieldCheck, text: 'Garantía de satisfacción' },
                  { icon: Clock,       text: 'Trámite urgente disponible' },
                  { icon: Globe,       text: '100% online, sin viajar' },
                  { icon: HeadphonesIcon, text: 'Soporte experto en español' },
                ].map((item, i) => (
                  <div key={i} className="sd-trust-item">
                    <item.icon size={18} className="sd-trust-icon" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Descripción completa */}
          {descripcionLineas.length > 0 && (
            <section className="sd-card">
              <h2 className="sd-section-title">
                <BookOpen size={22} style={{ color: '#2563eb' }} />
                ¿Qué esperar de este servicio?
              </h2>
              {descripcionLineas.map((linea: string, i: number) => (
                <p key={i} className="sd-desc-text">{linea}</p>
              ))}

              {isPaquete && (
                <div className="sd-included-box">
                  <div className="sd-included-title">
                    <CheckCircle2 size={20} style={{ color: '#2563eb' }} />
                    Incluido en el paquete
                  </div>
                  <ul className="sd-included-grid">
                    {[
                      'Asesoría inicial 1:1',
                      'Revisión de documentos',
                      'Agente Registrado incluido',
                      'Manual de cumplimiento fiscal',
                      'Acceso al Portal del Cliente',
                      'Alertas automáticas de plazos',
                    ].map((b, i) => (
                      <li key={i} className="sd-included-item">
                        <CheckCircle2 size={16} style={{ color: '#2563eb', flexShrink: 0, marginTop: 2 }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* Timeline */}
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

          {/* Testimonios */}
          <section>
            <h2 className="sd-section-title">
              <ShieldCheck size={22} style={{ color: '#16a34a' }} />
              Lo que dicen otros fundadores
            </h2>
            <div className="sd-testi-grid">
              {[
                { name: 'Andrés V.', city: 'Madrid, España', text: 'Tenía mil dudas sobre el EIN y me lo resolvieron en menos de dos semanas. Trato increíblemente profesional y claro.' },
                { name: 'Lucía F.',  city: 'Bogotá, Colombia', text: 'Al principio me parecía complicado abrir una LLC desde fuera. Con ellos fue todo sencillo y súper rápido. ¡Muy recomendados!' },
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

          {/* FAQ */}
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

        {/* ── COLUMNA DERECHA ── */}
        <div className="sd-sidebar">

          {/* Tarjeta de precio */}
          <div className="sd-price-card">
            {isPaquete && <span className="sd-price-badge">✦ Mejor opción</span>}
            <p className="sd-price-label">Precio total</p>
            <p className="sd-price-amount">{precioFormateado}</p>
            {servicio.precio_recurrente && (
              <p className="sd-price-note">
                + {servicio.precio_recurrente?.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                /{servicio.frecuencia_recurrente === 'anual' ? 'año' : 'mes'} (renovación)
              </p>
            )}
            {!servicio.precio_recurrente && (
              <p className="sd-price-note">Pago único · Sin costes ocultos · Deducible fiscalmente</p>
            )}

            <Link href={isPaquete ? `/paquetes/${slug}/onboarding` : `/servicios/${slug}/onboarding`} className="sd-cta-button">
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
                <span>Garantía de satisfacción 7 días</span>
              </div>
            </div>
          </div>

          {/* Trust card */}
          <div className="sd-guarantee-card">
            <div className="sd-guarantee-icon-bg">
              <ShieldCheck size={150} />
            </div>
            <p className="sd-guarantee-kicker">¿Por qué elegirnos?</p>
            <p className="sd-guarantee-title">Garantía 7 días</p>
            <p className="sd-guarantee-desc">
              Si el servicio no cumple exactamente con lo prometido, te devolvemos el dinero. Sin burocracia, sin preguntas.
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
