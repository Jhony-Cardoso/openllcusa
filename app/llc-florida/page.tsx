import type { Metadata } from 'next'
import Link from 'next/link'

// ──────────────────────────────────────────────
// SEO Metadata — Landing Florida
// ──────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Crear LLC en Florida (Guía para Extranjeros) | Open LLC USA',
  description:
    'Abre tu LLC en Florida. El estado favorito de Latinoamérica y España para bienes raíces, importación/exportación y prestigio comercial. Cero impuesto estatal individual.',
  alternates: {
    canonical: 'https://openllcusa.com/llc-florida',
  },
  keywords: [
    'crear LLC en Florida',
    'crear LLC en Miami',
    'ventajas LLC Florida',
    'impuestos LLC Florida',
    'comprar propiedades LLC Florida',
    'LLC Florida para extranjeros',
  ],
  openGraph: {
    title: 'Crear LLC en Florida: Prestigio comercial y puerta a LATAM',
    description:
      'La jurisdicción perfecta para Real Estate, negocios físicos e importadores. Abre tu empresa en Miami desde tu país 100% online.',
    type: 'article',
    url: 'https://openllcusa.com/llc-florida',
    images: [
      {
        url: 'https://openllcusa.com/images/florida-llc.webp',
        width: 1200,
        height: 630,
        alt: 'Crear LLC en Florida - Open LLC USA',
      },
    ],
  },
}

// ──────────────────────────────────────────────
// Schema JSON-LD: FAQPage para Florida
// ──────────────────────────────────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta el mantenimiento anual de una LLC en Florida?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Toda LLC registrada en Florida debe presentar un Reporte Anual (Annual Report) ante el Departamento de Estado. La tasa estatal actual es de $138.75 USD y debe pagarse todos los años antes del 1 de mayo para evitar multas elevadas (que ascienden a $400 USD por retraso).',
      },
    },
    {
      '@type': 'Question',
      name: '¿Las LLC en Florida son anónimas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. A diferencia de Wyoming o New Mexico, el estado de Florida tiene una base de datos pública y transparente (Sunbiz). Los nombres y direcciones de los administradores (Managers) o miembros autorizados deben figurar en el registro público. Si buscas privacidad absoluta, Florida no es tu estado.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Por qué tantos latinos eligen Florida para su LLC?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Florida es la puerta económica a Latinoamérica. Una empresa en Miami genera muchísima confianza comercial para clientes latinoamericanos y europeos. Además, es el estado predilecto para la compra de bienes raíces (Real Estate) por extranjeros y para negocios de importación y logística portuaria.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Hay impuestos estatales (State Tax) en Florida?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Florida es muy atractivo fiscalmente porque no tiene impuesto estatal sobre la renta para individuos (Individual State Income Tax). Como extranjero con una LLC Single-Member (considerada disregarded entity por el IRS), los beneficios fluyen a tu declaración personal, por lo que no pagarás impuestos estatales en Florida.',
      },
    },
  ],
}

// ──────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────
export default function FloridaLlcPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#082f49] via-[#06b6d4] to-[#0ea5e9] py-24 px-4 relative overflow-hidden">
        {/* Fondo decorativo (Coastal / Miami Vibe) */}
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-400/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-950/40 border border-cyan-400/30 text-cyan-50 text-sm font-bold px-5 py-2 rounded-full mb-8 backdrop-blur-md shadow-xl">
            🌴 La jurisdicción estrella para LATAM y España
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-md">
            Crear LLC en Florida
          </h1>
          <p className="text-xl md:text-2xl text-cyan-50 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            El "Sunshine State" ofrece un prestigio comercial inigualable, cero impuestos estatales individuales y es la puerta de entrada para inversiones en bienes raíces e importaciones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/precios"
              className="bg-orange-500 text-white font-bold text-lg px-8 py-4 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:bg-orange-400 transition-all hover:scale-105"
            >
              Constituir LLC Ahora
            </Link>
            <Link
              href="/agendar"
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-white/20 transition-colors"
            >
              Asesoría Especializada
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-24">
        
        {/* ── POR QUE FLORIDA (El Ecosistema) ── */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Mucho más que prestigio en Miami
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tener tu LLC registrada en Florida (Sunbiz) no solo transmite confianza inmediata a tus clientes latinos e hispanohablantes, sino que ofrece ventajas tácticas reales.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏢',
                title: 'Real Estate (Bienes Raíces)',
                desc: 'Si planeas comprar propiedades en EE.UU. como inversión (Flipping, Alquileres), hacerlo a través de una LLC de Florida te protege a nivel personal de cualquier demanda civil (resbalones, accidentes).',
              },
              {
                icon: '🚢',
                title: 'Importación y Logística',
                desc: 'Al ser un hub portuario clave, si tu negocio implica importar mercancía física hacia Latinoamérica, una empresa registrada en Florida facilita enormemente las aduanas y contratos con proveedores.',
              },
              {
                icon: '🤝',
                title: 'Prestigio y Credibilidad',
                desc: 'Para un cliente en Sudamérica o España, enviar dinero a una cuenta de empresa en Miami suena lógico y seguro. Wyoming o New Mexico pueden generar fricción si tu cliente es muy tradicional.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-cyan-500/30 hover:shadow-xl transition-all">
                <div className="text-4xl mb-4 bg-cyan-50 w-16 h-16 rounded-full flex items-center justify-center border border-cyan-100">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CUIDADO CON EL MANTENIMIENTO (Disclaimer) ── */}
        <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 grid md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-3">
              <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
                Ojo al Dato
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">
                El precio de la transparencia
              </h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                A diferencia de los "estados refugio" para nómadas digitales, Florida es un estado de alta visibilidad comercial. Esto tiene dos implicaciones directas que debes conocer antes de decidir:
              </p>
              
              <ul className="space-y-6">
                <li className="flex gap-4 items-start">
                  <span className="w-8 h-8 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-bold flex-shrink-0 mt-1">1</span>
                  <div>
                    <h4 className="font-bold text-white text-lg mb-1">Privacidad Nula (Sunbiz)</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">El registro público de empresas de Florida (Sunbiz) es completamente abierto. El nombre del administrador o dueño aparecerá listado públicamente en internet y será fácilmente buscable en Google.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="w-8 h-8 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-bold flex-shrink-0 mt-1">2</span>
                  <div>
                    <h4 className="font-bold text-white text-lg mb-1">Mantenimiento Elevado</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">Florida exige un Annual Report cada año con un costo estatal de <strong className="text-white">$138.75 USD</strong>. Si te olvidas de pagarlo antes del 1 de mayo, el estado te impondrá una severa multa adicional de $400 USD.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">¿Debería elegir Florida?</h3>
                <div className="space-y-4">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <span className="block text-green-400 font-bold mb-1">SÍ, te conviene si:</span>
                    <p className="text-sm text-slate-300">Vas a comprar propiedades físicas, lidiar con aduanas, importar productos a LATAM, o tus clientes valoran enormemente el prestigio de una oficina en Miami.</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <span className="block text-red-400 font-bold mb-1">NO te conviene si:</span>
                    <p className="text-sm text-slate-300">Eres freelancer, vendes software, haces dropshipping online y solo quieres el menor gasto posible con máxima privacidad (En este caso, elige Wyoming o New Mexico).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ FLORIDA ── */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Preguntas Frecuentes sobre LLCs en Florida
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
      <section className="bg-cyan-900 text-white py-16 text-center px-4 mt-16 border-t-[8px] border-orange-500">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">¿Florida es el estado correcto para ti?</h2>
          <p className="text-cyan-100 mb-8 text-lg">
            Constituimos tu LLC en el estado de Florida, tramitamos tu EIN y te preparamos para abrir tus cuentas bancarias y operar globalmente.
          </p>
          <Link href="/precios" className="inline-block bg-white text-cyan-900 font-bold px-10 py-4 rounded-full hover:scale-105 transition-transform shadow-xl">
            Ver Precios y Comenzar
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
