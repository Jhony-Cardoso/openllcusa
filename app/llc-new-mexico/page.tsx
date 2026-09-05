import type { Metadata } from 'next'
import Link from 'next/link'


// ──────────────────────────────────────────────
// SEO Metadata — Landing New Mexico
// ──────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Crear LLC en New Mexico (Nuevo México) | $0 Costo Anual | Open LLC USA',
  description:
    'Abre tu LLC en Nuevo México. El único estado que ofrece privacidad total y $0 de tasas estatales de mantenimiento anual. La opción más económica para no residentes.',
  alternates: {
    canonical: 'https://openllcusa.com/llc-new-mexico',
  },
  keywords: [
    'crear LLC en New Mexico',
    'crear LLC Nuevo México',
    'ventajas LLC New Mexico',
    'costo LLC New Mexico',
    'LLC anónima USA',
    'New Mexico vs Wyoming',
  ],
  openGraph: {
    title: 'Crear LLC en New Mexico (Nuevo México): Privacidad total por $0 al año',
    description:
      'La jurisdicción secreta de Estados Unidos. Mantenimiento estatal gratuito y total anonimato. Ideal para e-commerce y freelancers globales.',
    type: 'article',
    url: 'https://openllcusa.com/llc-new-mexico',
    images: [
      {
        url: 'https://openllcusa.com/images/new-mexico-llc.webp',
        width: 1200,
        height: 630,
        alt: 'Crear LLC en Nuevo México - Open LLC USA',
      },
    ],
  },
}

// ──────────────────────────────────────────────
// Schema JSON-LD: FAQPage para New Mexico
// ──────────────────────────────────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Es cierto que la LLC en New Mexico no tiene costos de mantenimiento?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A nivel estatal, sí. New Mexico es uno de los pocos estados que no exige la presentación de un Reporte Anual (Annual Report) ni cobra una tarifa de franquicia (Franchise Tax). Esto significa que la tarifa estatal de mantenimiento es $0. Tu único costo fijo recurrente será el servicio del Agente Registrado.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cómo funciona la privacidad en Nuevo México?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nuevo México es un "estado anónimo". No requiere que los nombres de los miembros (dueños) o administradores se enumeren en los Artículos de Organización ni en ningún registro público. Solo aparece la información del Agente Registrado, garantizando total privacidad de cara al público (aunque siempre se debe declarar al IRS).',
      },
    },
    {
      '@type': 'Question',
      name: 'New Mexico vs Wyoming: ¿Cuál debería elegir?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ambos son excelentes para no residentes. Wyoming cobra $62 anuales pero tiene mejores leyes de protección de activos corporativos en tribunales. New Mexico cobra $0 anuales. Si buscas el costo más bajo absoluto y anonimato para operar negocios online (Dropshipping, Freelance, Agencias), New Mexico es inigualable.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Puedo abrir una cuenta bancaria en USA con una LLC de Nuevo México?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutamente. Tu LLC en New Mexico obtiene su EIN federal igual que cualquier otra empresa estadounidense. Con este número, puedes abrir cuentas bancarias empresariales en EE.UU. (como Mercury o Relay) y usar plataformas como Stripe y PayPal desde tu país de origen.',
      },
    },
  ],
}

// ──────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────
export default function NewMexicoLlcPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#451a03] via-[#78350f] to-[#b45309] py-24 px-4 relative overflow-hidden">
        {/* Fondo decorativo (Desierto / Terracota) */}
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-[100px]"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-950/50 border border-amber-500/30 text-amber-100 text-sm font-bold px-5 py-2 rounded-full mb-8 backdrop-blur-md">
            🌵 La opción más económica de Estados Unidos
          </div>
          {/* Título SEO Optimizado (Incluye ambas nomenclaturas) */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-md">
            Crear LLC en New Mexico<br/>
            <span className="text-3xl md:text-4xl font-medium text-amber-200 mt-2 block">(Nuevo México)</span>
          </h1>
          <p className="text-xl md:text-2xl text-amber-50 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            El "estado fantasma" corporativo. Disfruta de total anonimato y <strong className="text-white">$0 de tarifas de renovación estatal</strong>. El paraíso para negocios digitales de bajo presupuesto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/precios"
              className="bg-amber-500 text-white font-bold text-lg px-8 py-4 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:bg-amber-400 transition-all hover:scale-105"
            >
              Comenzar Trámite Hoy
            </Link>
            <Link
              href="/agendar"
              className="bg-black/20 backdrop-blur-md border border-white/20 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-black/40 transition-colors"
            >
              Hablar con Asesor
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-24">
        
        {/* ── LOS 3 PILARES DE NEW MEXICO ── */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              ¿Por qué el 40% de los nómadas digitales eligen Nuevo México?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Si tu objetivo es mantener los gastos operativos al mínimo absoluto mientras facturas internacionalmente en dólares, este estado no tiene rival.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '💸',
                title: '$0 Costo Anual Estatal',
                desc: 'Es el mayor atractivo. A diferencia de Delaware ($300) o Florida ($138), Nuevo México NO exige presentar un Reporte Anual estatal. Pagas $0 al gobierno de por vida.',
              },
              {
                icon: '👻',
                title: 'Anonimato Inicial Total',
                desc: 'A la hora de registrar la empresa, los nombres de los dueños NO figuran en los documentos públicos fundacionales. Tu identidad está oculta desde el día 1 en el registro público.',
              },
              {
                icon: '🚀',
                title: 'Burocracia Cero',
                desc: 'Al no tener impuestos estatales para no residentes, ni reporte anual, operar la empresa es extremadamente pasivo. Te centras en vender, no en rellenar formularios estatales.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-amber-500/50 hover:shadow-xl transition-all">
                <div className="text-4xl mb-4 bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center border border-amber-100">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── EL GRAN DEBATE: NEW MEXICO VS WYOMING ── */}
        <section className="bg-slate-900 rounded-3xl p-8 md:p-16 text-white overflow-hidden relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-amber-600/10 to-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">El Debate Final: New Mexico vs Wyoming</h2>
              <p className="text-slate-400">Las dos mejores jurisdicciones para negocios digitales cara a cara.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Card New Mexico */}
              <div className="bg-gradient-to-br from-amber-900/40 to-slate-800 p-8 rounded-2xl border border-amber-700/50 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">🌵</span>
                  <h3 className="text-2xl font-bold text-amber-400">New Mexico</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-slate-300">Renovación Estatal Anual</span>
                    <span className="font-bold text-white bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">$0 USD</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-slate-300">Privacidad</span>
                    <span className="font-bold text-white">Extrema</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-slate-300">Protección en Tribunales</span>
                    <span className="font-bold text-slate-400">Estándar</span>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm text-slate-400">
                      <strong className="text-white block mb-1">El veredicto:</strong>
                      Ideal para iniciarse (Bootstrapping), tiendas de dropshipping, agencias y consultores que quieren la máxima eficiencia de costos a largo plazo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Wyoming */}
              <div className="bg-gradient-to-br from-emerald-900/40 to-slate-800 p-8 rounded-2xl border border-emerald-700/50 shadow-2xl opacity-90">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">⛰️</span>
                  <h3 className="text-2xl font-bold text-emerald-400">Wyoming</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-slate-300">Renovación Estatal Anual</span>
                    <span className="font-bold text-white">$62 USD</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-slate-300">Privacidad</span>
                    <span className="font-bold text-white">Extrema</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-slate-300">Protección en Tribunales</span>
                    <span className="font-bold text-emerald-400">Superior</span>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm text-slate-400">
                      <strong className="text-white block mb-1">El veredicto:</strong>
                      Ideal para quienes priorizan proteger patrimonio o tener propiedades a nombre de la LLC, ya que los tribunales de Wyoming defienden al propietario a capa y espada.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── IDEAL PARA... ── */}
        <section>
          <div className="bg-amber-50 rounded-3xl p-8 md:p-12 border border-amber-100 flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                El ecosistema Start-up de bajo presupuesto
              </h2>
              <p className="text-slate-600 mb-6">
                Crear una LLC en Nuevo México es la forma más rápida y limpia de obtener tu número federal (EIN) y acceder a la banca corporativa global de USA.
              </p>
              <Link href="/precios" className="text-amber-700 font-bold hover:underline flex items-center gap-2">
                Ver planes de formación <span>→</span>
              </Link>
            </div>
            <div className="md:w-2/3 grid grid-cols-2 gap-4">
              {[
                "Tiendas Shopify",
                "Desarrolladores Freelance",
                "Agencias de OnlyFans (OFM)",
                "Diseñadores y Creativos",
                "Afiliados y Bloggers",
                "Youtubers / Creadores",
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span className="text-slate-800 font-medium text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ NUEVO MÉXICO ── */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Preguntas Frecuentes sobre LLCs en Nuevo México
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

      {/* ── CTA FINAL ── */}
      <section className="bg-amber-600 text-white py-16 text-center px-4 mt-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Abre tu LLC en Nuevo México hoy mismo</h2>
          <p className="text-amber-100 mb-8 text-lg">
            Olvídate de papeleos. Nos encargamos del registro estatal, del agente registrado y de obtener tu EIN federal ante el IRS.
          </p>
          <Link href="/precios" className="inline-block bg-white text-amber-700 font-bold px-10 py-4 rounded-full hover:scale-105 transition-transform shadow-xl">
            Seleccionar Plan
          </Link>
        </div>
      </section>

      {/* ── SCHEMA JSON-LD ── */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  )
}
