import { supabaseAdmin } from '@/lib/supabase-admin'
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
import {
  isEIN,
  isReporteAnual,
  isAgenteRegistrado,
  isLaunchBanking,
  isConsultoriaFiscal,
  isTaxFilingSlug,
  SERVICE_SLUGS
} from '@/lib/constants'

// Design Tokens - coherentes con la homepage
const T = {
  bd: '#0C2047', b9: '#1E3A8A', b7: '#1D4ED8', b5: '#3B82F6',
  b1: '#DBEAFE', b0: '#EFF6FF',
  gn: '#10B981', gd: '#059669', gl: '#D1FAE5',
  ct: '#EA580C', ch: '#C2410C',
  tx: '#111827', ts: '#4B5563', tm: '#9CA3AF',
  br: '#E5E7EB', wh: '#FFFFFF', sf: '#F8FAFC',
} as const

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
  const { data: s } = await supabaseAdmin
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
  if (isEIN(slug)) return Search
  if (isTaxFilingSlug(slug)) return BookOpen
  if (isReporteAnual(slug)) return ShieldCheck
  if (isAgenteRegistrado(slug)) return ShieldCheck
  if (isLaunchBanking(slug)) return Smartphone
  if (isConsultoriaFiscal(slug)) return HeadphonesIcon
  if (slug.includes('launch') || slug.includes('primer') || slug.includes('llc')) return Globe
  if (slug.includes('fiscal') || slug.includes('impuestos') || slug.includes('form')) return BookOpen
  if (slug.includes('consultoria')) return HeadphonesIcon
  if (slug.includes('compliance') || slug.includes('agente')) return ShieldCheck
  return Zap
}

function getTimelineForSlug(slug: string) {
  // Paquetes (starter/professional/business)
  if (slug.includes('starter') || slug.includes('professional') || slug.includes('business')) {
    return [
      { day: 'Día 1', title: 'Solicitud y Revisión', desc: 'Analizamos tus datos y preparamos los documentos estatales.' },
      { day: 'Día 2–4', title: 'Registro Estatal', desc: 'Tu LLC es aprobada oficialmente por el estado elegido.' },
      { day: 'Día 5–15', title: 'Obtención de EIN', desc: 'Tramitamos tu identificación fiscal ante el IRS sin SSN.' },
      { day: 'Día 16+', title: '¡Listo para operar!', desc: 'Recibes tu kit documental completo y guía para abrir cuenta bancaria.' },
    ]
  }

  if (isEIN(slug)) {
    return [
      { day: 'Día 1', title: 'Envío de Formulario SS-4', desc: 'Preparamos y enviamos el formulario firmado al IRS en tu nombre.' },
      { day: 'Día 3–7', title: 'Gestión con el IRS', desc: 'Mantenemos contacto directo con el agente del IRS asignado.' },
      { day: 'Día 8–12', title: 'Confirmación del EIN', desc: 'Recibimos y verificamos tu número fiscal oficial.' },
      { day: '¡Listo!', title: 'Entrega de Carta CP 575', desc: 'Te entregamos el documento oficial que el banco te pedirás.' },
    ]
  }

  if (isTaxFilingSlug(slug)) {
    return [
      { day: 'Paso 1', title: 'Recogida de datos', desc: 'Completás el cuestionario fiscal con tus transacciones del año.' },
      { day: 'Paso 2', title: 'Preparación de formularios', desc: 'Nuestro equipo prepara el Form 5472 + 1120 correctamente.' },
      { day: 'Paso 3', title: 'Revisión y firma', desc: 'Revisas y apruebas los documentos antes de la presentación.' },
      { day: 'Paso 4', title: 'Presentación al IRS', desc: 'Enviamos en plazo para evitar la multa de $25,000 USD.' },
    ]
  }

  if (isReporteAnual(slug)) {
    return [
      { day: 'Paso 1', title: 'Recopilación de información', desc: 'Verificamos si hubo cambios en tu LLC durante el último año.' },
      { day: 'Paso 2', title: 'Preparación del reporte', desc: 'Elaboramos el Annual Report cumpliendo con los requisitos de tu estado.' },
      { day: 'Paso 3', title: 'Presentación', desc: 'Pagamos las tasas estatales y enviamos el reporte a las autoridades.' },
      { day: '¡Listo!', title: 'Certificado de Good Standing', desc: 'Te confirmamos que tu LLC sigue activa y en regla por un año más.' },
    ]
  }

  if (isAgenteRegistrado(slug)) {
    return [
      { day: 'Paso 1', title: 'Contratación y Alta', desc: 'Te damos de alta en nuestro sistema para actuar como tu Registered Agent.' },
      { day: 'Paso 2', title: 'Actualización en el Estado', desc: 'Presentamos el cambio de Agente Registrado ante la Secretaría de Estado (si aplica).' },
      { day: 'Ongoing', title: 'Recepción de correspondencia', desc: 'Recibimos notificaciones oficiales, demandas o correo fiscal.' },
      { day: '24 hrs', title: 'Escaneo y Notificación', desc: 'Subimos todos los documentos importantes a tu portal y te avisamos de inmediato.' },
    ]
  }

  if (isConsultoriaFiscal(slug) || slug.includes('consultoria-legal')) {
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

  if (isLaunchBanking(slug)) {
    return [
      { day: 'Paso 1', title: 'Recopilación de datos', desc: 'Nos envías la información de tu empresa y el tipo de cuenta que necesitas.' },
      { day: 'Paso 2', title: 'Preparación de documentos', desc: 'Preparamos toda la documentación usando la dirección del Agente Registrado.' },
      { day: 'Paso 3', title: 'Apertura de la cuenta', desc: 'Enviamos la solicitud a Mercury, Relay o Wise Business.' },
      { day: 'Paso 4', title: '¡Cuenta activa!', desc: 'Recibes acceso a tu nueva cuenta bancaria en dólares.' },
    ]
  }

  return [
    { day: 'Paso 1', title: 'Solicitud', desc: 'Nos proporcionas la información necesaria para el trámite.' },
    { day: 'Paso 2', title: 'Procesamiento', desc: 'Nuestro equipo experto gestiona la solicitud con el organismo correspondiente.' },
    { day: 'Paso 3', title: 'Entrega', desc: 'Recibes el resultado final en tu portal de cliente.' },
  ]
}

function getFAQsForSlug(slug: string) {
  if (isEIN(slug)) {
    return [
      { q: '¿Necesito SSN o ITIN para obtener el EIN?', a: 'No. Si tu LLC tiene al menos un miembro extranjero, podemos obtener el EIN sin SSN ni ITIN. Nos encargamos de todo con el IRS.' },
      { q: '¿Cuánto tarda el proceso?', a: 'Entre 8 y 12 días hábiles desde que presentamos la solicitud. En casos excepcionales puede tardar hasta 15 días.' },
      { q: '¿Puedo usar el EIN para abrir cuenta bancaria?', a: 'Sí. Es el documento clave que bancos como Mercury, Relay y Wise Business te solicitarán para abrir tu cuenta empresarial.' },
    ]
  }

  if (isTaxFilingSlug(slug)) {
    return [
      { q: '¿Qué pasa si no presento estos formularios?', a: 'El IRS impone multas desde $25,000 USD por Form 5472 no presentado o presentado incompleto.' },
      { q: '¿Cuándo es la fecha límite?', a: 'Generalmente el 15 de abril de cada año, para las operaciones del año anterior. Se puede pedir prórroga si se necesita más tiempo.' },
      { q: '¿Necesito pagar impuestos en EE.UU.?', a: 'Si eres extranjero no residente, operas desde fuera de EE.UU. y no tienes presencia física (ETBUS), normalmente no pagas Income Tax, pero sí debes presentar estos formularios de forma informativa.' },
    ]
  }

  if (isReporteAnual(slug)) {
    return [
      { q: '¿Qué es el Reporte Anual?', a: 'Es una actualización obligatoria que exige el estado para mantener tu LLC activa. Suele incluir confirmar la dirección y directores.' },
      { q: '¿El precio incluye las tasas del estado?', a: 'No, este servicio cubre nuestros honorarios por preparación, seguimiento y presentación. Las tasas del estado varían (ej. Wyoming $60, Delaware $300).' },
      { q: '¿Qué pasa si no lo presento?', a: 'El estado añadirá multas de penalización y eventualmente disolverá (cerrará) tu empresa, bloqueando su capacidad legal y cuenta bancaria.' },
    ]
  }

  if (isAgenteRegistrado(slug)) {
    return [
      { q: '¿Es obligatorio tener Agente Registrado?', a: 'Sí. Todos los estados exigen por ley que tengas una dirección física abierta en horario laboral en el estado de formación para recibir notificaciones formales.' },
      { q: '¿El servicio se renueva anualmente?', a: 'Así es, como exige el estado, proveer la dirección oficial y representación es un servicio continuo que se abona por cada año.' },
      { q: '¿Me enviarán también el correo bloqueado o paquetes?', a: 'El Agente Registrado recibe notificaciones oficiales del gobierno o demandas. No es un servicio de buzón virtual (mail forwarding) ordinario para paquetes, sino legal.' },
    ]
  }

  if (isConsultoriaFiscal(slug)) {
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

  if (isLaunchBanking(slug)) {
    return [
      { q: '¿Puedo abrir cuenta sin LLC?', a: 'Sí. Podemos abrir la cuenta con tu pasaporte y dirección del Agente Registrado, aunque aún no tengas la LLC formada.' },
      { q: '¿Qué bancos usáis?', a: 'Principalmente Mercury y Relay (los más usados por no residentes). También Wise Business si prefieres.' },
      { q: '¿Cuánto tarda la apertura?', a: 'Entre 5 y 12 días hábiles desde que enviamos la solicitud.' },
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
  console.log("=== SUPABASE EN DESARROLLO ===");
  console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  const { data: servicio, error } = await supabaseAdmin
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

const ctaHref = isEIN(slug) 
    ? `/servicios/${SERVICE_SLUGS.OBTENCION_EIN}/onboarding`
    : isPaquete && slug !== SERVICE_SLUGS.REPORTE_ANUAL
      ? `/paquetes/${slug}/onboarding`
      : `/servicios/${slug}/onboarding`

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827]">
      {/* Breadcrumbs premium */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex h-14 items-center text-sm">
            <ol className="flex items-center gap-2 text-gray-500">
              <li><Link href="/" className="hover:text-gray-700 transition-colors">Inicio</Link></li>
              <li><ChevronRight size={14} className="text-gray-400" /></li>
              <li><Link href="/servicios" className="hover:text-gray-700 transition-colors">Servicios</Link></li>
              <li><ChevronRight size={14} className="text-gray-400" /></li>
              <li className="font-semibold text-[#111827]">{servicio.nombre}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* ====================== COLUMNA PRINCIPAL ====================== */}
          <div className="lg:col-span-8 space-y-10">

            {/* HERO / CABECERA DEL SERVICIO - MEJORADO CON CTA */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(17,24,39,0.06)] p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
                <div className="flex-shrink-0 mb-6 lg:mb-0">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br from-[#0C2047] to-[#1E3A8A] flex items-center justify-center text-white shadow-lg">
                    <IconHeader size={48} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold tracking-wide ${isPaquete
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-blue-100 text-blue-700'
                      }`}>
                      {isPaquete ? '🔥 Paquete todo incluido' : '⚙️ Servicio individual'}
                    </span>
                    {servicio.requiere_llc && (
                      <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold tracking-wide bg-amber-100 text-amber-700">
                        Requiere LLC activa
                      </span>
                    )}
                  </div>

                  <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4">
                    {servicio.nombre}
                  </h1>

                  <p className="text-lg text-[#4B5563] max-w-2xl leading-relaxed">
                    {servicio.descripcion?.slice(0, 260)}
                    {servicio.descripcion && servicio.descripcion.length > 260 ? '…' : ''}
                  </p>

                  {/* Trust signals */}
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    {[
                      { icon: ShieldCheck, label: 'Garantía de satisfacción' },
                      { icon: Clock, label: 'Trámite urgente disponible' },
                      { icon: Globe, label: '100% online, sin viajar' },
                      { icon: HeadphonesIcon, label: 'Soporte en español' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-[#374151]">
                        <item.icon size={18} className="text-[#1E3A8A]" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA SECUNDARIO EN HERO - Alta conversión */}
                  <div className="mt-8">
                    <Link
                      href={ctaHref}
                      className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#EA580C] to-[#C2410C] px-8 py-3.5 text-[15px] font-extrabold text-white shadow-[0_6px_24px_rgba(234,88,12,0.38)] transition-all hover:brightness-105 active:scale-[0.985]"
                    >
                      Comenzar mi trámite ahora
                      <ArrowRight size={19} />
                    </Link>
                    <p className="mt-2 text-xs text-[#6B7280]">Proceso 100% remoto • Empieza en menos de 2 minutos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PRUEBA SOCIAL CUANTITATIVA - NUEVA (FOMO + Confianza) */}
            <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['A','L','M','R','S'].map((l,i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">{l}</div>
                  ))}
                </div>
                <div>
                  <span className="font-semibold text-[#111827]">+500 emprendedores</span>
                  <span className="text-[#4B5563]"> ya contrataron este servicio este año</span>
                </div>
              </div>
              <div className="text-sm text-emerald-600 font-medium flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                98% lo recomiendan
              </div>
            </div>

            {/* DESCRIPCIÓN COMPLETA */}
            {descripcionLineas.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 p-8 lg:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <BookOpen size={22} className="text-[#1E3A8A]" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">¿Qué esperar de este servicio?</h2>
                </div>

                <div className="prose prose-gray max-w-none text-[15px] leading-relaxed text-[#374151] space-y-4">
                  {descripcionLineas.map((linea: string, i: number) => (
                    <p key={i}>{linea}</p>
                  ))}
                </div>

                {isPaquete && (
                  <div className="mt-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-6">
                    <div className="flex items-center gap-2 mb-4 text-[#1E3A8A] font-semibold">
                      <CheckCircle2 size={20} /> Incluido en el paquete
                    </div>
                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                      {[
                        'Asesoría inicial 1:1',
                        'Revisión de documentos',
                        'Agente Registrado incluido',
                        'Manual de cumplimiento fiscal',
                        'Acceso al Portal del Cliente',
                        'Alertas automáticas de plazos',
                      ].map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={16} className="mt-0.5 text-emerald-600 flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TIMELINE */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 lg:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <Zap size={22} className="text-[#EA580C]" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Línea de tiempo del proceso</h2>
              </div>

              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[13px] top-3 bottom-3 w-px bg-gradient-to-b from-blue-200 to-orange-200" />

                {timeline.map((item, i) => (
                  <div key={i} className="flex gap-4 mb-8 last:mb-0 relative">
                    {/* Circle + Paso label (horizontally aligned) */}
                    <div className="flex items-center gap-2 z-10 flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-white border-2 border-[#1E3A8A] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#1E3A8A]" />
                      </div>
                      <span className="text-sm font-semibold text-[#EA580C] whitespace-nowrap">
                        {item.day}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-0.5">
                      <div className="font-semibold text-lg text-[#111827] mb-1">{item.title}</div>
                      <div className="text-[#4B5563]">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TESTIMONIOS MEJORADOS - 4 visibles + expandable */}
            <div>
              <div className="flex items-center gap-3 mb-6 px-1">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <ShieldCheck size={22} className="text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Lo que dicen otros fundadores</h2>
              </div>

              {/* 4 testimonios visibles */}
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    name: 'Lucía F.',
                    city: 'Bogotá, Colombia',
                    text: 'Al principio me parecía complicado abrir una LLC desde fuera. Con ellos fue todo sencillo y súper rápido. ¡Muy recomendados!',
                    image: '/images/testimonials/testimonio-lucia.webp'
                  },
                  {
                    name: 'Carlos Álvarez',
                    city: 'Valencia, España',
                    text: 'Contraté el paquete completo y todo fue impecable. Me ayudaron con la LLC, el EIN y la apertura de cuenta en Mercury. Muy recomendados.',
                    image: '/images/testimonials/carlos-alvarez.webp'
                  },
                  {
                    name: 'Javier López',
                    city: 'Madrid, España',
                    text: 'El agente registrado y el reporte anual los gestionan de forma impecable. Me avisan de todo y nunca he tenido problemas con el estado.',
                    image: '/images/testimonials/javier-lopez.webp'
                  },
                  {
                    name: 'Sofía Ramírez',
                    city: 'Buenos Aires, Argentina',
                    text: 'Presentaron mis formularios 5472 y 1120 a tiempo y sin errores. Me explicaron todo con mucha claridad. Gran tranquilidad.',
                    image: '/images/testimonials/sofia-ramirez.webp'
                  },
                ].map((t, i) => (
                  <div key={i} className="bg-white rounded-3xl border border-gray-100 p-7 shadow-sm flex flex-col">
                    <div className="text-emerald-500 text-lg mb-4">★★★★★</div>
                    <p className="text-[#374151] leading-relaxed flex-grow">“{t.text}”</p>

                    <div className="flex items-center gap-4 mt-8 pt-6 border-t">
                      {t.image ? (
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 border border-gray-100"
                          width={56}
                          height={56}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500 flex-shrink-0">
                          {t.name[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-sm text-gray-500">{t.city}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Expandable: Ver más testimonios */}
              <details className="mt-6 group">
                <summary className="cursor-pointer list-none flex items-center justify-center gap-2 py-3 text-sm font-medium text-[#1E3A8A] hover:text-[#0C2047] transition-colors">
                  Ver más testimonios (12 más)
                  <span className="transition-transform group-open:rotate-180">↓</span>
                </summary>

                <div className="mt-4 grid md:grid-cols-2 gap-6">
                  {[
                    {
                      name: 'Daniela Rojas',
                      city: 'Ciudad de México',
                      text: 'Obtuve mi EIN en solo 10 días y pude abrir cuenta en Mercury sin complicaciones. El equipo fue muy profesional y atento.',
                      image: '/images/testimonials/daniela-rojas.webp'
                    },
                    {
                      name: 'Andrés Carrasco',
                      city: 'Madrid, España',
                      text: 'Contraté el paquete de formación de LLC y todo el proceso fue mucho más fácil de lo que esperaba. Comunicación excelente.',
                      image: '/images/testimonials/andres-carrasco.webp'
                    },
                    {
                      name: 'Valentina Cruz',
                      city: 'Santiago, Chile',
                      text: 'Me ayudaron a abrir mi cuenta bancaria empresarial en EE.UU. desde Chile. Todo muy claro y sin necesidad de viajar.',
                      image: '/images/testimonials/valentina-cruz.webp'
                    },
                  ].map((t, i) => (
                    <div key={i} className="bg-white rounded-3xl border border-gray-100 p-7 shadow-sm flex flex-col">
                      <div className="text-emerald-500 text-lg mb-4">★★★★★</div>
                      <p className="text-[#374151] leading-relaxed flex-grow">“{t.text}”</p>

                      <div className="flex items-center gap-4 mt-8 pt-6 border-t">
                        {t.image ? (
                          <img
                            src={t.image}
                            alt={t.name}
                            className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 border border-gray-100"
                            width={56}
                            height={56}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500 flex-shrink-0">
                            {t.name[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold">{t.name}</div>
                          <div className="text-sm text-gray-500">{t.city}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>

            {/* GARANTÍA POTENCIADA - Subida de posición */}
            <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-3xl p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
                    <ShieldCheck size={36} />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-xl tracking-tight mb-2 text-emerald-800">
                    Garantía de Tramitación 100% Sin Errores
                  </div>
                  <p className="text-[#374151] leading-relaxed">
                    Si cometemos cualquier error en la gestión de tu trámite, lo corregimos sin coste adicional. 
                    Tu expediente, bien hecho a la primera. <span className="font-semibold">Riesgo cero para ti.</span>
                  </p>
                </div>
              </div>
             </div>

            {/* SECCIÓN DE OBJECIÓN - El verdadero coste de no actuar */}
            <div className="bg-white border border-red-100 rounded-3xl p-8 lg:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-red-100 rounded-xl">
                  <ShieldCheck size={22} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-[#111827]">
                  El verdadero coste de no actuar a tiempo
                </h2>
              </div>

              <div className="space-y-4 text-[#374151] text-[15px] leading-relaxed">
                <p>
                  Muchos emprendedores subestiman lo que puede costar retrasar o no contratar este servicio:
                </p>
                <ul className="space-y-2.5 pl-1">
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">•</span> 
                    Multas del IRS de hasta <span className="font-semibold">$25,000 USD</span> por no presentar el Form 5472 a tiempo.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">•</span> 
                    Dificultad (o imposibilidad) para abrir cuenta bancaria en EE.UU. sin EIN.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">•</span> 
                    Riesgo de que el estado disuelva tu LLC por no mantener el Agente Registrado o no presentar reportes anuales.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">•</span> 
                    Pérdida de oportunidades de negocio, clientes y credibilidad por no poder operar profesionalmente.
                  </li>
                </ul>
                <p className="pt-2 font-medium text-[#111827]">
                  En la mayoría de los casos, el coste de resolver el problema a tiempo es mucho menor que las consecuencias de no hacerlo.
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <div className="flex items-center gap-3 mb-6 px-1">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <HelpCircle size={22} className="text-[#1E3A8A]" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Preguntas frecuentes</h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group bg-white border border-gray-200 rounded-2xl px-6 py-1 shadow-sm open:shadow-md transition-all"
                  >
                    <summary className="flex items-center justify-between py-4 cursor-pointer font-medium text-[#111827] list-none">
                      {faq.q}
                      <span className="text-[#9CA3AF] group-open:rotate-180 transition-transform">↓</span>
                    </summary>
                    <div className="pb-5 text-[#4B5563] leading-relaxed border-t pt-4">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>

          </div>

          {/* ====================== SIDEBAR STICKY ====================== */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-6">

              {/* PRECIO + CTA MEJORADO */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8">
                {isPaquete && (
                  <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold tracking-widest px-4 py-1 rounded-full mb-5">
                    ✦ MEJOR OPCIÓN
                  </div>
                )}

                <div className="text-xs font-semibold tracking-widest text-gray-500 mb-1">PRECIO TOTAL</div>
                <div className="text-5xl font-extrabold tracking-tighter text-[#111827] mb-1">
                  {precioFormateado}
                </div>

                {servicio.precio_recurrente ? (
                  <div className="text-sm text-[#4B5563]">
                    + {servicio.precio_recurrente?.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                    /{servicio.frecuencia_recurrente === 'anual' ? 'año' : 'mes'} (renovación)
                  </div>
                ) : (
                  <div className="text-sm text-emerald-600 font-medium mt-1">
                    Pago único · Sin costes ocultos · 100% deducible
                  </div>
                )}

                {/* CTA PRINCIPAL OPTIMIZADO */}
                <Link
                  href={ctaHref}
                  className="mt-6 w-full inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#EA580C] to-[#C2410C] py-4 text-base font-extrabold text-white shadow-[0_6px_24px_rgba(234,88,12,0.38)] transition-all active:scale-[0.985] hover:brightness-105"
                >
                  Comenzar mi trámite ahora
                  <ArrowRight size={20} />
                </Link>
                <p className="text-center text-xs text-[#6B7280] mt-2">Proceso 100% remoto • Empieza en menos de 2 minutos</p>

                {/* Badges de Confianza mejorados */}
                <div className="mt-6 grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-2.5 rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-[#374151]">
                    <Lock size={15} className="text-emerald-600 flex-shrink-0" />
                    Pago 100% seguro con SSL
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-[#374151]">
                    <ShieldCheck size={15} className="text-emerald-600 flex-shrink-0" />
                    Garantía de tramitación sin errores
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-[#374151]">
                    <HeadphonesIcon size={15} className="text-blue-600 flex-shrink-0" />
                    Soporte prioritario en español
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-[#374151]">
                    <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                    +500 clientes satisfechos
                  </div>
                </div>
              </div>

              {/* GARANTÍA COMPACTA EN SIDEBAR */}
              <div className="bg-white rounded-3xl border border-emerald-100 p-6 text-sm shadow-sm">
                <div className="flex gap-3">
                  <ShieldCheck className="text-emerald-600 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-emerald-800 mb-1">Garantía sin riesgos</div>
                    <p className="text-[#374151] leading-snug">Si hay algún error en tu trámite, lo corregimos gratis. Tu dinero y tu tiempo están protegidos.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ====================== MOBILE STICKY CTA BAR ====================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <Link
          href={ctaHref}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#EA580C] to-[#C2410C] py-3.5 text-base font-extrabold text-white shadow-md active:scale-[0.985]"
        >
          Comenzar mi trámite ahora
          <ArrowRight size={18} />
        </Link>
      </div>

    </div>
  )
}
