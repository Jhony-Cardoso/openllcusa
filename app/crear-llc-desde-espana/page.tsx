import type { Metadata } from 'next'
import Link from 'next/link'


// ──────────────────────────────────────────────
// SEO Metadata — Landing España
// ──────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Crear una LLC desde España (Guía 2026 para Españoles) | Open LLC USA',
  description:
    'Descubre cómo abrir una LLC en EE.UU. desde España de forma legal. Optimiza tu fiscalidad, cobra en dólares y opera tu negocio online sin cuotas mensuales abusivas.',
  alternates: {
    canonical: 'https://openllcusa.com/crear-llc-desde-espana',
  },
  keywords: [
    'crear LLC desde España',
    'LLC para españoles',
    'abrir empresa en USA desde España',
    'LLC vs SL España',
    'alternativa a cuota de autónomos',
    'LLC modelo 720',
  ],
  openGraph: {
    title: 'Crear tu LLC en USA desde España',
    description:
      'La alternativa moderna a ser autónomo o crear una SL. Abre tu empresa en Estados Unidos sin viajar y 100% online.',
    type: 'article',
    url: 'https://openllcusa.com/crear-llc-desde-espana',
    images: [
      {
        url: 'https://openllcusa.com/images/espana-llc.webp',
        width: 1200,
        height: 630,
        alt: 'Crear LLC desde España - Open LLC USA',
      },
    ],
  },
}

// ──────────────────────────────────────────────
// Schema JSON-LD: FAQPage para Google España
// ──────────────────────────────────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Es legal tener una LLC en Estados Unidos viviendo en España?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Totalmente legal. Un ciudadano español o residente en España tiene derecho a poseer participaciones en sociedades extranjeras. Lo importante es declarar correctamente su existencia a Hacienda (Agencia Tributaria) mediante modelos informativos como el Modelo 720 (si aplica) y tributar por los beneficios que retires hacia España en tu IRPF.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Tengo que seguir pagando la cuota de autónomos en España si tengo una LLC?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La Seguridad Social en España exige el alta de autónomo a quienes realizan una actividad económica por cuenta propia de forma habitual, personal y directa en territorio español. Si operas tu LLC desde el salón de tu casa en Madrid y es tu medio de vida principal, la jurisprudencia y la Inspección de Trabajo suelen considerar que debes cotizar en el RETA. Consulta siempre con tu asesor fiscal en España sobre tu caso particular.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cómo tributa una LLC americana en España?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A ojos del IRS americano, tu LLC (si es Single-Member) es una "entidad transparente" (disregarded entity). Si no tienes presencia física en USA, no pagas Corporate Tax allí. En España, Hacienda considera a la LLC bajo el régimen de atribución de rentas o transparencia fiscal internacional. Debes declarar los beneficios obtenidos por la LLC en tu IRPF personal, independientemente de si los transfieres a tu banco español o los dejas en EE.UU.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué es el Modelo 720 y cómo afecta a mi LLC?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El Modelo 720 es una declaración informativa sobre bienes y derechos en el extranjero. Si el valor de tu participación en la LLC, o el saldo de las cuentas bancarias de tu LLC en USA (como Mercury o Wise) a final de año supera los 50.000€, estás obligado a presentar este modelo informativo antes del 31 de marzo de cada año.',
      },
    },
  ],
}

// ──────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────
export default function CrearLlcEspanaPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* ── HERO ── */}
      <section className="bg-gradient-to-r from-red-700 via-red-600 to-yellow-600 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-black/30 border border-white/20 text-white text-sm font-bold px-5 py-2 rounded-full mb-8">
            🇪🇸 Diseñado para residentes fiscales en España
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Abre tu LLC en USA desde España
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Sin burocracia interminable, sin notarios y 100% online. Accede al sistema financiero americano y globaliza tu negocio digital.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/precios"
              className="bg-white text-red-700 font-bold text-lg px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform"
            >
              Ver Planes de Formación
            </Link>
            <Link
              href="/agendar"
              className="bg-black/30 backdrop-blur-md border border-white/30 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-black/40 transition-colors"
            >
              Hablar con un asesor (Gratis)
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-24">
        
        {/* ── POR QUE LLC Y NO SL ── */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              ¿Por qué los emprendedores españoles eligen una LLC?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              La Sociedad Limitada (SL) y la figura del Autónomo tienen su lugar, pero para negocios digitales internacionales, la LLC americana es imbatible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Rapidez y Cero Notarios',
                desc: 'Constituir una SL en España requiere notario, Registro Mercantil, modelo 036 y 3.000€ de capital. Tu LLC en USA se crea online en 5 días sin capital mínimo ni burocracia.',
              },
              {
                icon: '💸',
                title: 'Menores Costes de Mantenimiento',
                desc: 'Olvídate de las cuotas mensuales de gestoría para IVA trimestral y libros contables complejos. En estados como Wyoming, el coste estatal anual es de solo $62.',
              },
              {
                icon: '🌍',
                title: 'Banca Internacional',
                desc: 'Abre cuentas en EE.UU. (Mercury, Relay) y cobra en USD o EUR. Trabaja con pasarelas de pago globales como Stripe USA sin bloqueos por ser extranjero.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/blog/llc-vs-sl-espana" className="text-blue-600 font-bold hover:underline">
              Leer comparativa completa: LLC vs SL en España →
            </Link>
          </div>
        </section>

        {/* ── HACIENDA Y LEGALIDAD (Disclaimer amigable pero firme) ── */}
        <section className="bg-slate-900 rounded-3xl p-8 md:p-16 text-white overflow-hidden relative">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Hablemos claro sobre Hacienda
              </h2>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                Tener una LLC en EE.UU. es 100% legal en España, pero <strong>no es un vehículo para evadir impuestos</strong>. Si eres residente fiscal en España, el IRPF es universal: debes declarar tus rentas mundiales.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-slate-300">Debes incluir los beneficios de tu LLC en tu Declaración de la Renta (IRPF).</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-slate-300">Si tu LLC o sus cuentas bancarias superan los 50.000€, debes presentar el Modelo 720.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-slate-300">Disfrutas de cero Corporate Tax (Impuesto de Sociedades) en USA por no ser residente.</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">¿Para quién NO es una LLC?</h3>
              <p className="text-slate-400 mb-6 text-sm">
                Si tu objetivo principal es esconder dinero del fisco español, no abras una LLC. El intercambio automático de información bancaria (FATCA/CRS) existe.
              </p>
              <h3 className="text-xl font-bold text-white mb-4">¿Para quién SÍ es una LLC?</h3>
              <p className="text-slate-400 text-sm">
                Para freelancers, agencias, vendedores de Amazon FBA o dropshippers que buscan <strong>agilidad operativa, privacidad patrimonial pública, y una imagen corporativa americana</strong> sin la burocracia de una SL.
              </p>
            </div>
          </div>
        </section>

        {/* ── COMO FUNCIONA EL PROCESO DESDE ESPAÑA ── */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            El proceso es 100% online
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Elige tu Estado',
                desc: 'Recomendamos Wyoming o Nuevo México para españoles por su bajo coste y alta privacidad pública.',
              },
              {
                step: '2',
                title: 'Registro',
                desc: 'Pagamos las tasas estatales y presentamos los Articles of Organization en el estado.',
              },
              {
                step: '3',
                title: 'EIN sin SSN',
                desc: 'Tramitamos tu EIN (número fiscal) ante el IRS en 2 a 4 semanas, sin que tengas que llamar a USA.',
              },
              {
                step: '4',
                title: 'Cuentas & Stripe',
                desc: 'Te entregamos todo listo para que abras tu cuenta bancaria americana y tu pasarela de pagos.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center relative pt-12 mt-6">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-red-600 text-white font-bold text-xl rounded-full flex items-center justify-center border-4 border-slate-50">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Preguntas Frecuentes (Españoles)
          </h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((item, idx) => (
              <details key={idx} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-50 transition-colors">
                  <span className="font-bold text-lg text-slate-800 pr-4">{item.name}</span>
                  <span className="text-slate-400 text-2xl font-light group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-6 text-slate-600 text-base leading-relaxed">
                  {item.acceptedAnswer.text}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>

      {/* ── SCHEMA JSON-LD ── */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  )
}
