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
  Send,
  Package,
  Zap,
  Lock,
  HeadphonesIcon
} from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: servicio } = await supabase
    .from('servicios')
    .select('nombre, tagline, descripcion')
    .eq('slug', slug)
    .single()

  if (!servicio) return {}

  return {
    title: servicio.nombre,
    description: servicio.tagline || servicio.descripcion?.slice(0, 160),
    openGraph: {
      title: `${servicio.nombre} | Open LLC USA`,
      description: servicio.tagline,
    }
  }
}

const getIconForSlug = (slug: string) => {
  if (slug.includes('llc')) return Globe
  if (slug.includes('banking')) return Smartphone
  if (slug.includes('ein')) return Search
  if (slug.includes('fiscal') || slug.includes('impuestos')) return BookOpen
  if (slug.includes('consultoria')) return HeadphonesIcon
  if (slug.includes('compliance')) return ShieldCheck
  return Zap
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
    .single()

  if (error || !servicio) {
    notFound()
  }

  const isPaquete = servicio.tipo === 'paquete'
  const IconHeader = getIconForSlug(slug)

  // Desglosamos la descripción si tiene formato de lista o párrafos
  const descripcionLineas = servicio.descripcion ? servicio.descripcion.split('\n').filter(l => l.trim() !== '') : []

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 mb-8 text-sm text-gray-500">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link></li>
          <ChevronRight size={14} />
          <li><Link href="/servicios" className="hover:text-blue-600 transition-colors">Servicios</Link></li>
          <ChevronRight size={14} />
          <li className="font-medium text-gray-900">{servicio.nombre}</li>
        </ol>
      </nav>

      <main className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12">
        {/* COLUMNA IZQUIERDA: CONTENIDO INFORMATIVO (2/3) */}
        <div className="lg:col-span-2 space-y-12">
          {/* Header del Servicio */}
          <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <IconHeader size={240} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isPaquete ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'
                }`}>
                  {isPaquete ? '🔥 Paquete Todo Incluido' : '⚙️ Servicio Individual'}
                </span>
                {servicio.requiere_llc && (
                  <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    Requiere LLC Activa
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                {servicio.nombre}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                {servicio.tagline}
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: ShieldCheck, text: 'Garantía de satisfacción' },
                  { icon: Clock, text: 'Trámite urgente disponible' },
                  { icon: Globe, text: '100% online (sin viajar)' },
                  { icon: HeadphonesIcon, text: 'Apoyo experto en español' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-700">
                    <item.icon size={20} className="text-blue-600 shrink-0" />
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Detalles Expandidos */}
          <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <BookOpen className="text-blue-600" />
              ¿Qué esperar de este servicio?
            </h2>
            
            <div className="prose prose-blue max-w-none space-y-6 text-gray-700">
              {descripcionLineas.map((linea, idx) => (
                <p key={idx} className="text-lg leading-relaxed">
                  {linea}
                </p>
              ))}
            </div>

            {isPaquete && (
              <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                  <CheckCircle2 className="text-blue-600" />
                  Incluido en el pack:
                </h3>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Asesoría inicial 1:1",
                    "Revision de documentos",
                    "Agente Registrado incluido",
                    "Manual de cumplimiento fiscal",
                    "Acceso al Portal del Cliente",
                    "Alertas automáticas de plazos"
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-blue-800">
                      <CheckCircle2 size={18} className="mt-1 shrink-0 text-blue-600" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Preguntas Frecuentes (FAQ) Dinámicas Estilo Acordeón a modo informativo */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <HelpCircle className="text-blue-600" />
              Preguntas Frecuentes
            </h2>
            <div className="grid gap-4">
              {[
                { q: "¿Necesito estar en EE.UU.?", a: "No, todo el proceso de formación y gestión se realiza de forma 100% remota." },
                { q: "¿Cuánto tiempo tardará?", a: "Depende del estado, pero generalmente entre 5 y 15 días hábiles para el registro estatal." },
                { q: "¿Es legal si no soy residente?", a: "Totalmente. La ley de EE.UU. permite a cualquier extranjero ser dueño y gestionar una LLC." }
              ].map((faq, idx) => (
                <details key={idx} className="group bg-white border border-gray-200 rounded-xl p-6 open:shadow-md transition-all cursor-pointer">
                  <summary className="font-bold text-gray-800 list-none flex justify-between items-center">
                    {faq.q}
                    <ChevronRight size={20} className="group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* COLUMNA DERECHA: CTA Y TARJETA DE PRECIO (1/3) */}
        <div className="space-y-6 lg:sticky lg:top-32 h-fit">
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-600 relative">
            {isPaquete && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1 rounded-full text-xs font-bold uppercase">
                Mejor Opción
              </span>
            )}
            
            <div className="text-center mb-8">
              <p className="text-gray-500 font-medium mb-1">Precio total</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-5xl font-black text-gray-900">{servicio.precio?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('.00', '')}</span>
                {servicio.precio_recurrente && (
                  <span className="text-gray-500 font-medium">/{servicio.frecuencia_recurrente === 'anual' ? 'año' : 'mes'}</span>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-2">Deducible de impuestos</p>
            </div>

            <div className="space-y-4">
              <Link
                href={`/paquetes/${slug}/onboarding`}
                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white rounded-xl py-5 text-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all transform hover:-translate-y-1 active:scale-95"
              >
                Empezar proceso ahora
                <ArrowRight size={20} />
              </Link>
              
              <div className="pt-6 border-t border-gray-100 space-y-4">
                 <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Lock size={16} className="text-green-600" />
                    <span>Pago 100% Seguro cifrado SSL</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-gray-600">
                    <HeadphonesIcon size={16} className="text-blue-600" />
                    <span>Soporte prioritario incluido</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Sugerencia de Trust */}
          <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 text-white shadow-lg overflow-hidden relative group">
            <div className="absolute -bottom-8 -right-8 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
              <ShieldCheck size={160} />
            </div>
            <p className="text-sm font-bold text-blue-300 mb-2 uppercase tracking-widest">¿Por qué elegirnos?</p>
            <h3 className="text-2xl font-bold mb-4 leading-tight" style={{ color: '#fff' }}>Garantía 7 días</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Si el servicio no cumple con lo prometido, te devolvemos tu dinero. Sin preguntas, transparencia total.
            </p>
            <div className="flex -space-x-4">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-800 bg-indigo-100 flex items-center justify-center text-indigo-900 text-[10px] font-bold">
                  U{i}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-indigo-800 bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                +500
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

