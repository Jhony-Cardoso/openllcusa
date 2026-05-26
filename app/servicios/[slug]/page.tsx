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

// Design Tokens (igual que homepage)
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
  if (slug.includes('llc') || slug.includes('launch') || slug.includes('primer')) return Globe
  if (slug.includes('banking') || slug.includes('launch-banking')) return Smartphone
  if (slug.includes('ein')) return Search
  if (slug.includes('fiscal') || slug.includes('impuestos') || slug.includes('form')) return BookOpen
  if (slug.includes('consultoria')) return HeadphonesIcon
  if (slug.includes('compliance') || slug.includes('agente')) return ShieldCheck
  return Zap
}

function getTimelineForSlug(slug: string) {
  if (slug.includes('starter') || slug.includes('professional') || slug.includes('business')) {
    return [{ day: 'Día 1', title: 'Solicitud y Revisión', desc: 'Analizamos tus datos y preparamos los documentos estatales.' }, { day: 'Día 2–4', title: 'Registro Estatal', desc: 'Tu LLC es aprobada oficialmente por el estado elegido.' }, { day: 'Día 5–15', title: 'Obtención de EIN', desc: 'Tramitamos tu identificación fiscal ante el IRS sin SSN.' }, { day: 'Día 16+', title: '¡Listo para operar!', desc: 'Recibes tu kit documental completo y guía para abrir cuenta bancaria.' }]
  }
  if (slug.includes('ein')) {
    return [{ day: 'Día 1', title: 'Envío de Formulario SS-4', desc: 'Preparamos y enviamos el formulario firmado al IRS en tu nombre.' }, { day: 'Día 3–7', title: 'Gestión con el IRS', desc: 'Mantenemos contacto directo con el agente del IRS asignado.' }, { day: 'Día 8–12', title: 'Confirmación del EIN', desc: 'Recibimos y verificamos tu número fiscal oficial.' }, { day: '¡Listo!', title: 'Entrega de Carta CP 575', desc: 'Te entregamos el documento oficial que el banco te pedirá.' }]
  }
  if (slug.includes('form') || slug.includes('5472') || slug.includes('impuestos')) {
    return [{ day: 'Paso 1', title: 'Recogida de datos', desc: 'Completás el cuestionario fiscal con tus transacciones del año.' }, { day: 'Paso 2', title: 'Preparación de formularios', desc: 'Nuestro equipo prepara el Form 5472 + 1120 correctamente.' }, { day: 'Paso 3', title: 'Revisión y firma', desc: 'Revisas y apruebas los documentos antes de la presentación.' }, { day: 'Paso 4', title: 'Presentación al IRS', desc: 'Enviamos en plazo para evitar la multa de $25,000 USD.' }]
  }
  if (slug.includes('reporte-anual')) {
    return [{ day: 'Paso 1', title: 'Recopilación de información', desc: 'Verificamos si hubo cambios en tu LLC durante el último año.' }, { day: 'Paso 2', title: 'Preparación del reporte', desc: 'Elaboramos el Annual Report cumpliendo con los requisitos de tu estado.' }, { day: 'Paso 3', title: 'Presentación', desc: 'Pagamos las tasas estatales y enviamos el reporte a las autoridades.' }, { day: '¡Listo!', title: 'Certificado de Good Standing', desc: 'Te confirmamos que tu LLC sigue activa y en regla por un año más.' }]
  }
  if (slug.includes('agente-registrado')) {
    return [{ day: 'Paso 1', title: 'Contratación y Alta', desc: 'Te damos de alta en nuestro sistema para actuar como tu Registered Agent.' }, { day: 'Paso 2', title: 'Actualización en el Estado', desc: 'Presentamos el cambio de Agente Registrado ante la Secretaría de Estado (si aplica).' }, { day: 'Ongoing', title: 'Recepción de correspondencia', desc: 'Recibimos notificaciones oficiales, demandas o correo fiscal.' }, { day: '24 hrs', title: 'Escaneo y Notificación', desc: 'Subimos todos los documentos importantes a tu portal y te avisamos de inmediato.' }]
  }
  if (slug.includes('consultoria-legal') || slug.includes('consultoria-fiscal')) {
    return [{ day: 'Paso 1', title: 'Reserva de sesión', desc: 'Programamos la videollamada en el horario que mejor te convenga.' }, { day: 'Paso 2', title: 'Cuestionario Previo', desc: 'Nos envías el contexto y preguntas para aprovechar el tiempo al máximo.' }, { day: 'En vivo', title: 'Videollamada de 1h', desc: 'Sesión personalizada para resolver tus dudas fiscales o societarias.' }, { day: 'Paso 4', title: 'Plan de acción', desc: 'Recibes notas y conclusiones clave al finalizar la asesoría.' }]
  }
  if (slug.includes('compliance')) {
    return [{ day: 'Paso 1', title: 'Auditoría de Estado', desc: 'Verificamos los vencimientos de tu LLC en su estado particular.' }, { day: 'Paso 2', title: 'Renovación Agente Registrado', desc: 'Mantenemos tu dirección y representación oficial activa.' }, { day: 'Paso 3', title: 'Preparación Reporte Anual', desc: 'Generamos y presentamos la memoria obligatoria estatal.' }, { day: '¡Listo!', title: 'Entrega de Good Standing', desc: 'Recibes el comprobante oficial de que tu LLC está en verde probatorio.' }]
  }
  if (slug.includes('launch-banking')) {
    return [{ day: 'Paso 1', title: 'Recopilación de datos', desc: 'Nos envías la información de tu empresa y el tipo de cuenta que necesitas.' }, { day: 'Paso 2', title: 'Preparación de documentos', desc: 'Preparamos toda la documentación usando la dirección del Agente Registrado.' }, { day: 'Paso 3', title: 'Apertura de la cuenta', desc: 'Enviamos la solicitud a Mercury, Relay o Wise Business.' }, { day: 'Paso 4', title: '¡Cuenta activa!', desc: 'Recibes acceso a tu nueva cuenta bancaria en dólares.' }]
  }
  return [{ day: 'Paso 1', title: 'Solicitud', desc: 'Nos proporcionas la información necesaria para el trámite.' }, { day: 'Paso 2', title: 'Procesamiento', desc: 'Nuestro equipo experto gestiona la solicitud con el organismo correspondiente.' }, { day: 'Paso 3', title: 'Entrega', desc: 'Recibes el resultado final en tu portal de cliente.' }]
}

function getFAQsForSlug(slug: string) {
  if (slug.includes('ein')) return [{ q: '¿Necesito SSN o ITIN para obtener el EIN?', a: 'No. Si tu LLC tiene al menos un miembro extranjero, podemos obtener el EIN sin SSN ni ITIN. Nos encargamos de todo con el IRS.' }, { q: '¿Cuánto tarda el proceso?', a: 'Entre 8 y 12 días hábiles desde que presentamos la solicitud. En casos excepcionales puede tardar hasta 15 días.' }, { q: '¿Puedo usar el EIN para abrir cuenta bancaria?', a: 'Sí. Es el documento clave que bancos como Mercury, Relay y Wise Business te solicitarán para abrir tu cuenta empresarial.' }]
  if (slug.includes('form') || slug.includes('5472') || slug.includes('impuestos')) return [{ q: '¿Qué pasa si no presento estos formularios?', a: 'El IRS impone multas desde $25,000 USD por Form 5472 no presentado o presentado incompleto.' }, { q: '¿Cuándo es la fecha límite?', a: 'Generalmente el 15 de abril de cada año, para las operaciones del año anterior. Se puede pedir prórroga si se necesita más tiempo.' }, { q: '¿Necesito pagar impuestos en EE.UU.?', a: 'Si eres extranjero no residente, operas desde fuera de EE.UU. y no tienes presencia física (ETBUS), normalmente no pagas Income Tax, pero sí debes presentar estos formularios de forma informativa.' }]
  if (slug.includes('reporte-anual')) return [{ q: '¿Qué es el Reporte Anual?', a: 'Es una actualización obligatoria que exige el estado para mantener tu LLC activa. Suele incluir confirmar la dirección y directores.' }, { q: '¿El precio incluye las tasas del estado?', a: 'No, este servicio cubre nuestros honorarios por preparación, seguimiento y presentación. Las tasas del estado varían (ej. Wyoming $60, Delaware $300).' }, { q: '¿Qué pasa si no lo presento?', a: 'El estado añadirá multas de penalización y eventualmente disolverá (cerrará) tu empresa, bloqueando su capacidad legal y cuenta bancaria.' }]
  if (slug.includes('agente-registrado')) return [{ q: '¿Es obligatorio tener Agente Registrado?', a: 'Sí. Todos los estados exigen por ley que tengas una dirección física abierta en horario laboral en el estado de formación para recibir notificaciones formales.' }, { q: '¿El servicio se renueva anualmente?', a: 'Así es, como exige el estado, proveer la dirección oficial y representación es un servicio continuo que se abona por cada año.' }, { q: '¿Me enviarán también el correo bloqueado o paquetes?', a: 'El Agente Registrado recibe notificaciones oficiales del gobierno o demandas. No es un servicio de buzón virtual (mail forwarding) ordinario para paquetes, sino legal.' }]
  if (slug.includes('consultoria')) return [{ q: '¿Podremos ver mi caso en particular?', a: 'Totalmente. Estudiaremos tu país, tu modelo de venta y la estructuración de tu LLC para optimizar e ir sobre seguro.' }, { q: '¿Es deducible el costo de la consultoría?', a: 'Sí, la consultoría fiscal y legal es un gasto legítimo directamente imputable a los gastos de funcionamiento de tu LLC.' }]
  if (slug.includes('compliance')) return [{ q: '¿Es obligatorio el compliance básico?', a: 'Sí, no mantener el Agente Registrado activo o no presentar el Reporte Anual lleva al cierre administrativo (disolución) de la LLC.' }, { q: '¿Incluye declaraciones federales del IRS?', a: 'No, este servicio cubre los requisitos mínimos a nivel ESTATAL. Para las obligaciones federales puedes contratar "Impuestos Federales".' }, { q: '¿Cuánto tiempo cubre este paquete?', a: 'Cubre la renovación exigida y el servicio de agente registrado por 1 año calendario completo.' }]
  if (slug.includes('launch-banking')) return [{ q: '¿Puedo abrir cuenta sin LLC?', a: 'Sí. Podemos abrir la cuenta con tu pasaporte y dirección del Agente Registrado, aunque aún no tengas la LLC formada.' }, { q: '¿Qué bancos usáis?', a: 'Principalmente Mercury y Relay (los más usados por no residentes). También Wise Business si prefieres.' }, { q: '¿Cuánto tarda la apertura?', a: 'Entre 5 y 12 días hábiles desde que enviamos la solicitud.' }]
  return [{ q: '¿Necesito estar físicamente en EE.UU.?', a: 'No. Todo el proceso se realiza de forma 100% remota. Nunca necesitarás volar a EE.UU. para crear o gestionar tu LLC.' }, { q: '¿Es legal si no soy residente americano?', a: 'Totalmente legal. La ley de EE.UU. permite a cualquier extranjero ser dueño y gestionar una LLC sin necesidad de visa ni residencia.' }, { q: '¿Qué pasa después del primer año?', a: 'Tendrás obligaciones anuales: renovar el agente registrado, presentar el Annual Report (en algunos estados) y gestionar tus impuestos federales.' }]
}

export default async function ServicioDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
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

  return (
    <main style={{ backgroundColor: T.sf, minHeight: '100vh', paddingBottom: '80px' }}>
      <nav style={{ maxWidth: 1160, margin: '0 auto', padding: '40px 24px 20px' }}>
        <ol className="flex items-center gap-2 text-sm" style={{ color: T.tm }}>
          <li><Link href="/" style={{ color: T.b7 }}>Inicio</Link></li>
          <li><ChevronRight size={14} /></li>
          <li><Link href="/servicios" style={{ color: T.b7 }}>Servicios</Link></li>
          <li><ChevronRight size={14} /></li>
          <li style={{ fontWeight: 700, color: T.tx }}>{servicio.nombre}</li>
        </ol>
      </nav>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 64 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
          {/* Aquí irían Hero, Descripción, Timeline, Testimonios y FAQ */}
          {/* Por longitud del mensaje, dime si quieres que te las añada ahora o primero probamos con esto */}
        </div>

        {/* Sidebar */}
        <div style={{ position: 'sticky', top: 40, alignSelf: 'start' }}>
          <div style={{ backgroundColor: T.wh, borderRadius: 24, padding: 48, boxShadow: '0 1px 4px rgba(17,24,39,.06), 0 4px 16px rgba(17,24,39,.07)' }}>
            {isPaquete && <div style={{ backgroundColor: T.gd, color: 'white', padding: '6px 20px', borderRadius: 9999, display: 'inline-block', marginBottom: 16, fontWeight: 700 }}>✦ Mejor opción</div>}
            
            <p style={{ color: T.tm, fontWeight: 600 }}>Precio total</p>
            <p style={{ fontSize: 56, fontWeight: 800, color: T.tx, margin: '12px 0' }}>{precioFormateado}</p>

            <Link 
              href={slug === 'obtencion-ein' ? '/servicios/impuestos/obtencion-ein/onboarding' : isPaquete && !['reporte-anual'].includes(slug) ? `/paquetes/${slug}/onboarding` : `/servicios/${slug}/onboarding`}
              style={{ display: 'block', marginTop: 40, background: `linear-gradient(135deg, ${T.ct}, ${T.ch})`, color: 'white', fontSize: 21, fontWeight: 700, padding: '24px', borderRadius: 9999, textAlign: 'center', textDecoration: 'none' }}
            >
              Empezar proceso ahora <ArrowRight size={24} style={{ verticalAlign: 'middle' }} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}