import type { Metadata } from 'next'
import Link from 'next/link'

// ──────────────────────────────────────────────
// SEO Metadata — Landing Delaware
// ──────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Crear LLC en Delaware (Guía para Startups y Extranjeros) | Open LLC USA',
  description:
    'Abre tu LLC en Delaware, el estado del Fortune 500. Descubre por qué es el favorito de los inversores de Silicon Valley y si realmente es la mejor opción para tu negocio.',
  alternates: {
    canonical: 'https://openllcusa.com/llc-delaware',
  },
  keywords: [
    'crear LLC en Delaware',
    'ventajas LLC Delaware',
    'impuestos LLC Delaware',
    'Delaware vs Wyoming',
    'Court of Chancery',
    'Franchise Tax Delaware',
  ],
  openGraph: {
    title: 'Crear LLC en Delaware: La opción corporativa por excelencia',
    description:
      'El ecosistema legal más prestigioso de EE.UU. ideal para startups tecnológicas, rondas de inversión (Venture Capital) y corporaciones estructuradas.',
    type: 'article',
    url: 'https://openllcusa.com/llc-delaware',
    images: [
      {
        url: 'https://openllcusa.com/images/delaware-llc.webp',
        width: 1200,
        height: 630,
        alt: 'Crear LLC en Delaware - Open LLC USA',
      },
    ],
  },
}

// ──────────────────────────────────────────────
// Schema JSON-LD: FAQPage para Delaware
// ──────────────────────────────────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta mantener una LLC en Delaware?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Toda LLC registrada en Delaware está obligada a pagar el "Franchise Tax" (Impuesto de Franquicia) de $300 USD anuales. Este impuesto debe pagarse antes del 1 de junio de cada año, independientemente de si la LLC tuvo ingresos o no. A esto debes sumarle el costo de tu Agente Registrado.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Debo tributar impuestos estatales (State Tax) en Delaware?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Si eres un extranjero no residente y tu LLC no opera físicamente (ni tiene empleados ni oficinas) dentro del estado de Delaware, estás exento del impuesto estatal sobre la renta (State Income Tax). Solo deberás pagar el Franchise Tax de $300 anuales.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Por qué las Startups eligen siempre Delaware?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Delaware cuenta con la "Court of Chancery" (Corte de Cancillería), un tribunal especial sin jurados, compuesto por jueces expertos en derecho corporativo. Esto hace que los litigios empresariales se resuelvan rápido y basándose en precedentes comerciales centenarios. Por eso, los inversores (Venture Capital) exigen que la empresa esté en Delaware para proteger su inversión.',
      },
    },
    {
      '@type': 'Question',
      name: 'Si solo tengo un e-commerce, ¿me conviene Delaware?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Generalmente no. Para modelos de negocio unipersonales (Single-Member LLC) como tiendas de Shopify, Amazon FBA, agencias SMMA o servicios freelance, el costo de $300 anuales del Franchise Tax es innecesario. En esos casos, estados como Wyoming o New Mexico (con costos anuales entre $0 y $62) son opciones mucho más eficientes.',
      },
    },
  ],
}

// ──────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────
export default function DelawareLlcPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e3a8a] py-24 px-4 relative overflow-hidden">
        {/* Fondo decorativo corporativo premium */}
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-950/40 border border-blue-400/20 text-blue-100 text-sm font-bold px-5 py-2 rounded-full mb-8 backdrop-blur-md">
            🏛️ El hogar del 68% de las empresas del Fortune 500
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            LLC en Delaware
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            El prestigio institucional corporativo más alto de EE.UU. La opción definitiva si buscas levantar capital riesgo, estructurar filiales complejas o entrar a Silicon Valley.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/precios"
              className="bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:bg-blue-500 transition-all hover:scale-105"
            >
              Consultar Planes
            </Link>
            <Link
              href="/agendar"
              className="bg-transparent border border-slate-600 text-slate-300 font-bold text-lg px-8 py-4 rounded-full hover:bg-slate-800 hover:text-white transition-colors"
            >
              Asesoría de Estructuración
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-24">
        
        {/* ── VENTAJAS INSTITUCIONALES (El PRO de Delaware) ── */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              La Jurisdicción de la Élite Financiera
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              No es casualidad que las empresas más grandes del mundo elijan este pequeño estado de la costa este. Delaware ofrece un entorno legal diseñado 100% para los negocios.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚖️',
                title: 'Court of Chancery',
                desc: 'Un tribunal de equidad exclusivo para asuntos empresariales. Los casos no se deciden por un jurado inexperto, sino por jueces (Chancellors) altamente especializados en derecho corporativo.',
              },
              {
                icon: '🤝',
                title: 'Atractivo para Inversores',
                desc: 'Los fondos de inversión y Angel Investors exigen Delaware. La razón es simple: conocen perfectamente sus leyes y saben que su inversión tiene la máxima seguridad jurídica y previsibilidad.',
              },
              {
                icon: '🏢',
                title: 'Flexibilidad de Gestión',
                desc: 'Permite estructuras de gestión muy complejas, clases de acciones (si pasas a C-Corp) y facilidad extrema para fusiones, adquisiciones y reestructuraciones patrimoniales internacionales.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 border-t-4 border-t-blue-600 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── EL BAÑO DE REALIDAD (Disclaimer HONESTO sobre Delaware) ── */}
        <section className="bg-slate-100 rounded-3xl p-8 md:p-16 border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-200 rounded-full blur-3xl"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                Transparencia Total
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                ¿Delaware es realmente para ti?
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                En Open LLC USA creemos en la honestidad brutal. Muchos asesores te venderán Delaware por su "prestigio", pero ocultan los costes reales a largo plazo que pueden ahogar a un pequeño negocio.
              </p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Si tu objetivo es vender online, ofrecer consultoría o facturar como freelance... <strong className="text-slate-900">Delaware puede ser un error financiero.</strong>
              </p>
              <Link href="/llc-wyoming" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
                Descubre por qué Wyoming es mejor para E-commerce →
              </Link>
            </div>
            
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">El costo real de Delaware</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-700">Franchise Tax Anual</span>
                    <span className="font-bold text-red-600">$300</span>
                  </div>
                  <p className="text-xs text-slate-500">Impuesto estatal obligatorio independiente de tus ingresos. Se paga antes del 1 de Junio.</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-700">Agente Registrado</span>
                    <span className="font-bold text-slate-900">Variable</span>
                  </div>
                  <p className="text-xs text-slate-500">Obligatorio por ley tener una dirección legal operativa en el estado de Delaware.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-600 font-medium">
                    <span className="block text-blue-600 font-bold mb-1">Nuestro veredicto:</span>
                    Úsalo solo si planeas buscar inversión (Venture Capital) a corto/medio plazo, o si operarás en industrias fuertemente reguladas donde la Court of Chancery te ofrezca una ventaja táctica.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ DELAWARE ── */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Preguntas Frecuentes sobre LLCs en Delaware
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
      <section className="bg-blue-600 text-white py-16 text-center px-4 mt-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">¿Tienes dudas sobre qué estado elegir?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            No te la juegues con la estructura legal de tu negocio. Habla con nuestros especialistas y analizaremos tu modelo de negocio de forma gratuita.
          </p>
          <Link href="/agendar" className="inline-block bg-white text-blue-600 font-bold px-10 py-4 rounded-full hover:scale-105 transition-transform shadow-xl">
            Agendar videollamada gratis
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
