import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Shield, Zap, Clock, Building2, MapPin, FileText, ArrowRight } from 'lucide-react';
import Flag from '@/components/Flag';

/* ============================================================================
   /guias/us — Guía de Estados Unidos: elegir estado y crear la LLC.
   Enfoque SEO: intención "qué estado elegir" y "cuánto tarda", sin canibalizar
   las páginas pilar (/crear-llc-usa, /llc-para-no-residentes) ni las landings
   por estado (/llc-wyoming, /llc-delaware, /llc-new-mexico, /llc-florida).
   ============================================================================ */

const CANONICAL = 'https://openllcusa.com/guias/us';

export const metadata: Metadata = {
  title: 'Guía de EE.UU.: elegir estado y crear tu LLC | Open LLC USA',
  description:
    'Comparativa de Wyoming, Nuevo México, Delaware y Florida para crear tu LLC en Estados Unidos: tasas estatales, cuota anual, privacidad y requisitos. Sin viajar y sin SSN.',
  keywords: [
    'crear LLC en Estados Unidos',
    'mejor estado para crear una LLC',
    'LLC Wyoming vs Delaware',
    'LLC Nuevo México ventajas',
    'LLC Florida no residentes',
    'LLC sin SSN',
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Guía de EE.UU.: elegir estado y crear tu LLC | Open LLC USA',
    description:
      'Wyoming, Nuevo México, Delaware o Florida: compara tasas, privacidad y mantenimiento antes de registrar tu LLC en Estados Unidos.',
    url: CANONICAL,
    siteName: 'Open LLC USA',
    locale: 'es_ES',
    type: 'article',
    images: [{ url: '/images/og-image-home.jpg', width: 1200, height: 630, alt: 'Guía para crear una LLC en Estados Unidos' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guía de EE.UU.: elegir estado y crear tu LLC | Open LLC USA',
    description:
      'Wyoming, Nuevo México, Delaware o Florida: compara tasas, privacidad y mantenimiento antes de registrar tu LLC.',
    images: ['/images/og-image-home.jpg'],
  },
};

// Comparativa de estados. Los plazos oficiales de registro por estado se integran
// aquí como columna propia desde el informe de Secretarías de Estado.
const ESTADOS = [
  {
    code: 'wy',
    nombre: 'Wyoming',
    coste: '$100',
    anual: '≈$62 (Annual Report) + agente registrado',
    privacidad: 'Alta: no exige publicar socios ni directores',
    ideal: 'La opción por defecto para no residentes que buscan bajo coste y privacidad.',
    href: '/llc-wyoming',
  },
  {
    code: 'nm',
    nombre: 'Nuevo México',
    coste: '$50',
    anual: 'Sin cuota anual estatal ($0)',
    privacidad: 'Muy alta: no figura el nombre de los propietarios en el registro público',
    ideal: 'Máxima privacidad y el mantenimiento anual más barato.',
    href: '/llc-new-mexico',
  },
  {
    code: 'de',
    nombre: 'Delaware',
    coste: '$110',
    anual: '≈$300 (Franchise Tax anual)',
    privacidad: 'Media: exige agente registrado y datos de directores',
    ideal: 'Proyectos que buscan inversores o que replican el estándar corporativo de EE.UU.',
    href: '/llc-delaware',
  },
  {
    code: 'fl',
    nombre: 'Florida',
    coste: '$125',
    anual: '$138,75 (Annual Report)',
    privacidad: 'Baja: el registro es público',
    ideal: 'Negocios con actividad física real en el estado o clientes locales.',
    href: '/llc-florida',
  },
];

// Plazos y tasas publicados por las Secretarías de Estado (consulta: 19-09-2026).
// Wyoming: FAQ del SOS (online activo al instante; correo hasta 15 días hábiles) y Filing Fee Schedule
// (eff. 01-07-2026). Delaware: Corporate Fee Schedule, Revised August 1, 2026. Florida: Fla. Stat. 605.0213.
// Nuevo México: NMSA 1978, 53-19-63(A); el SOS no publica plazo garantizado.
const PLAZOS = [
  {
    estado: 'Wyoming',
    tasa: '$100 (+2,4% si se paga con tarjeta)',
    plazo: 'Al instante si se presenta online en WyoBiz; hasta 15 días hábiles si se envía por correo (FAQ oficial)',
    via: 'Online sí. Expedited no aplica a la constitución de la LLC',
  },
  {
    estado: 'Nuevo México',
    tasa: '$50',
    plazo: 'La División de Business Services indica 1-2 días hábiles, pero el SOS no lo publica como plazo garantizado',
    via: 'Solo online (no acepta papel). Sin servicio expeditado publicado',
  },
  {
    estado: 'Delaware',
    tasa: '$110',
    plazo: 'Sin plazo publicado: el tiempo regular "varía según el volumen" de expedientes recibidos',
    via: 'No hay constitución online completa. Expidetado: +$50 (24 h), +$100 (mismo día), +$500 (2 h), +$1.000 (1 h)',
  },
  {
    estado: 'Florida',
    tasa: '$125 ($100 + $25 del agente registrado)',
    plazo: 'Sin plazo publicado: procesa por orden de recepción (consulta su página Document Processing Dates)',
    via: 'Online sí (Sunbiz). Sin expeditado publicado para la constitución',
  },
];

const REQUISITOS = [
  { icon: FileText, titulo: 'Pasaporte vigente', desc: 'No necesitas SSN, ITIN ni visa. Con tu pasaporte y una dirección de residencia fuera de EE.UU. es suficiente.' },
  { icon: Building2, titulo: 'Nombre para tu LLC', desc: 'Elige un nombre y 1-2 alternativas. Comprobamos disponibilidad en el registro estatal antes de presentar.' },
  { icon: MapPin, titulo: 'Dirección y agente registrado', desc: 'Todo estado exige una dirección física y un agente registrado en EE.UU. Los incluimos en tu plan.' },
];

const PASOS = [
  { titulo: 'Elige el estado', desc: 'Te ayudamos a decidir entre Wyoming, Nuevo México, Delaware o Florida según tu actividad, tus clientes y tu fiscalidad.' },
  { titulo: 'Registramos la LLC', desc: 'Presentamos los Articles of Organization ante la Secretaría de Estado y te entregamos los documentos oficiales.' },
  { titulo: 'Gestionamos el EIN', desc: 'Solicitamos tu número fiscal federal ante el IRS sin SSN. Es el trámite que marca el plazo total del proceso.' },
  { titulo: 'Preparamos tu banco', desc: 'Te entregamos el paquete documental en orden para abrir tu cuenta en dólares en Mercury, Relay o Wise.' },
];

const FAQS = [
  {
    q: '¿Cuál es el mejor estado para crear una LLC siendo no residente?',
    a: 'Para la mayoría de emprendedores hispanohablantes, Wyoming es la opción más equilibrada: registro económico, mantenimiento anual bajo y sin publicar los socios. Nuevo México es la alternativa si buscas la mayor privacidad y no pagar cuota anual estatal. Delaware tiene sentido si vas a levantar inversión, y Florida si tu negocio opera realmente allí.',
  },
  {
    q: '¿Necesito SSN o visa para registrar una LLC en Estados Unidos?',
    a: 'No. Puedes registrar la LLC con tu pasaporte y dirigirla desde tu país. El EIN se solicita al IRS sin SSN, aunque ese trámite añade semanas al proceso.',
  },
  {
    q: '¿Cuánto tarda el registro de la LLC?',
    a: 'El registro estatal suele resolverse en días: en estados ágiles como Wyoming o Nuevo México en 24-72 horas. Lo que alarga el proceso completo (hasta 7-15 días hábiles o más) es la obtención del EIN cuando se solicita sin SSN, ya que el IRS puede tardar de 2 a 4 semanas.',
  },
  {
    q: '¿Tengo que pagar impuestos en Estados Unidos si vivo fuera?',
    a: 'Depende de tu actividad y de tu residencia fiscal. Una LLC de un solo socio no residente se trata como disregarded entity: si no tienes ingresos con fuente en EE.UU. ni establecimiento permanente, normalmente no tributa en EE.UU., pero sí debe presentar el formulario informativo 5472 + 1120 y declarar en tu país de residencia.',
  },
  {
    q: '¿Puedo abrir una cuenta bancaria sin viajar?',
    a: 'Sí. Con el EIN, el Operating Agreement y los documentos de la LLC puedes abrir cuenta en bancos fintech como Mercury, Relay o Wise de forma 100% online.',
  },
];

export default function UsGuidePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://openllcusa.com' },
          { '@type': 'ListItem', position: 2, name: 'Guías', item: 'https://openllcusa.com/guias' },
          { '@type': 'ListItem', position: 3, name: 'Estados Unidos', item: CANONICAL },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      },
    ],
  };

  return (
    <article className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <header className="bg-gradient-to-br from-slate-50 to-blue-50 border-b border-slate-200 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link href="/guias" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-8">
            <ArrowLeft className="mr-2" size={16} /> Volver a las guías
          </Link>

          <div className="flex justify-center mb-6">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
              <Flag countryCode="us" size="xl" className="w-20 h-20" title="Estados Unidos" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Crear una LLC en <span className="text-blue-600">Estados Unidos</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            La guía de EE.UU. para no residentes: qué estado te conviene, qué cuesta mantenerlo
            y cuánto tarda de verdad el registro y el EIN.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/precios"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
            >
              <Zap size={20} fill="currentColor" /> Ver planes desde $349
            </Link>
            <Link
              href="/agendar"
              className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              Consulta gratuita <ArrowRight size={18} />
            </Link>
          </div>

          <p className="text-sm text-slate-500 mt-6">
            Sin viajar · Sin SSN · Soporte en español · Garantía de tramitación sin errores
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Requisitos */}
        <section>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Qué necesitas para empezar</h2>
          <p className="text-slate-600 mb-8 max-w-2xl">
            Registrar una LLC en Estados Unidos no exige residir allí ni tener número de Seguro Social.
            Esto es todo lo que hace falta:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {REQUISITOS.map(({ icon: Icon, titulo, desc }) => (
              <div key={titulo} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600 mb-4 w-fit">
                  <Icon size={26} />
                </div>
                <h3 className="font-bold mb-2 text-slate-900">{titulo}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparativa de estados */}
        <section className="mt-20">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Qué estado elegir</h2>
          <p className="text-slate-600 mb-8 max-w-2xl">
            Cualquier estado sirve para operar desde tu país, pero no cuesta lo mismo ni protege igual.
            Estos son los cuatro que usan la mayoría de nuestros clientes:
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-5 py-4 font-semibold">Estado</th>
                  <th className="px-5 py-4 font-semibold">Registro estatal</th>
                  <th className="px-5 py-4 font-semibold">Mantenimiento anual</th>
                  <th className="px-5 py-4 font-semibold">Privacidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {ESTADOS.map((estado) => (
                  <tr key={estado.code} className="align-top">
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Flag countryCode="us" size="sm" /> {estado.nombre}
                      </div>
                      <Link href={estado.href} className="text-xs text-blue-600 hover:underline">
                        Ver la guía de {estado.nombre} →
                      </Link>
                    </td>
                    <td className="px-5 py-5 text-slate-700">{estado.coste}</td>
                    <td className="px-5 py-5 text-slate-700">{estado.anual}</td>
                    <td className="px-5 py-5 text-slate-700">
                      {estado.privacidad}
                      <p className="text-xs text-slate-500 mt-1">{estado.ideal}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Importes de referencia del estado. La tasa estatal se suma al precio del plan y se abona a la Secretaría de Estado.
          </p>
        </section>

        {/* Plazos oficiales de registro */}
        <section className="mt-20">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Cuánto tarda el registro según el estado</h2>
          <p className="text-slate-600 mb-8 max-w-2xl">
            Estos son los datos publicados por las propias Secretarías de Estado (consulta: 19 de septiembre de 2026).
            Ojo: la mayoría de estados <strong>no publica un plazo garantizado</strong>, así que aquí distinguimos lo que
            está publicado de lo que no.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-5 py-4 font-semibold">Estado</th>
                  <th className="px-5 py-4 font-semibold">Tasa estatal</th>
                  <th className="px-5 py-4 font-semibold">Plazo publicado</th>
                  <th className="px-5 py-4 font-semibold">Online / expeditado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {PLAZOS.map((p) => (
                  <tr key={p.estado} className="align-top">
                    <td className="px-5 py-5 font-bold text-slate-900">{p.estado}</td>
                    <td className="px-5 py-5 text-slate-700">{p.tasa}</td>
                    <td className="px-5 py-5 text-slate-700">{p.plazo}</td>
                    <td className="px-5 py-5 text-slate-700">{p.via}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Tasas estatales de constitución, sin agente registrado, EIN ni informe anual. Fuentes: sos.wyo.gov,
            sos.nm.gov, corp.delaware.gov y dos.fl.gov. Las tasas estatales cambian: reverifica antes de reutilizar esta tabla.
          </p>
        </section>

        {/* Proceso */}
        <section className="mt-20">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Cómo lo gestionamos nosotros</h2>
          <p className="text-slate-600 mb-8 max-w-2xl">
            Tú aportas los datos; del resto del trámite nos ocupamos nosotros, con soporte en español.
          </p>
          <ol className="space-y-5">
            {PASOS.map((paso, i) => (
              <li key={paso.titulo} className="flex gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-6">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{paso.titulo}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{paso.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2"><Clock size={16} className="text-blue-600" /> Registro estatal en 24-72 horas en estados ágiles</span>
            <span className="inline-flex items-center gap-2"><Shield size={16} className="text-blue-600" /> Garantía: si cometemos un error en tu trámite, lo corregimos gratis</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-600" /> Más de 500 LLCs gestionadas para hispanohablantes</span>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-20">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Preguntas frecuentes sobre EE.UU.</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group bg-white border border-slate-200 rounded-2xl p-6">
                <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between items-center gap-4">
                  {faq.q}
                  <span className="text-blue-600 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="text-slate-600 mt-4 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
          <p className="text-sm text-slate-600 mt-6">
            ¿Buscas la guía de tu país de residencia? Están todas en{' '}
            <Link href="/guias" className="text-blue-600 hover:underline">/guias</Link>: México, Colombia,
            España, Argentina, Perú, Paraguay y más.
          </p>
        </section>

        {/* CTA final */}
        <section className="mt-20 bg-slate-900 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
          <h3 className="text-3xl font-extrabold text-white mb-4">Elige tu estado y arranca hoy</h3>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto text-lg">
            Registramos tu LLC, gestionamos el EIN y te dejamos lista la documentación para tu cuenta
            en dólares. Desde $349 + tasa estatal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/precios"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2"
            >
              <Zap size={20} fill="currentColor" /> Ver planes y precios
            </Link>
            <Link
              href="/agendar"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              Hablar con un especialista <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
