import type { Metadata } from 'next'
import Link from 'next/link'


// ──────────────────────────────────────────────
// SEO Metadata — Landing No Residentes
// ──────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Crear LLC en USA para No Residentes (Guía Definitiva) | Open LLC USA',
  description:
    'Abre tu LLC en Estados Unidos siendo extranjero sin viajar. Accede a bancos de USA, procesadores como Stripe y paga 0% de impuestos estadounidenses legalmente.',
  alternates: {
    canonical: 'https://openllcusa.com/llc-para-no-residentes',
  },
  keywords: [
    'crear LLC desde extranjero',
    'LLC para no residentes',
    'impuestos LLC extranjero',
    'cuenta bancaria USA extranjero',
    'Stripe para extranjeros',
    'ventajas LLC no residentes',
  ],
  openGraph: {
    title: 'LLC en USA para No Residentes: Tu Pasaporte a la Economía Global',
    description:
      'Factura en dólares, cobra con Stripe y protege tu patrimonio personal operando al 0% de impuestos en EE.UU. (si no tienes presencia física).',
    type: 'article',
    url: 'https://openllcusa.com/llc-para-no-residentes',
    images: [
      {
        url: 'https://openllcusa.com/images/nra-llc.webp',
        width: 1200,
        height: 630,
        alt: 'LLC para No Residentes - Open LLC USA',
      },
    ],
  },
}

// ──────────────────────────────────────────────
// Schema JSON-LD: FAQPage para No Residentes
// ──────────────────────────────────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Tengo que pagar impuestos en USA si vivo en otro país?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Si eres un "Non-Resident Alien" (extranjero no residente), posees una LLC de un solo miembro (Single-Member), y NO tienes Presencia Física (ETBUS) en Estados Unidos (empleados, oficinas o almacenes en USA), no estás sujeto al impuesto sobre la renta estadounidense (0% US Tax). Las ganancias fluyen hacia ti y tributas únicamente en tu país de residencia fiscal.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Necesito un SSN o ITIN para crear una LLC?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'NO. No necesitas Número de Seguro Social (SSN) ni ITIN para registrar tu LLC ni para obtener el EIN (Número de Identificación del Empleador). Nosotros tramitamos tu EIN directamente con el IRS usando tu pasaporte.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Puedo usar Stripe, PayPal y abrir cuentas bancarias en USA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Una vez que tu LLC esté registrada y te entreguemos tu número EIN, tendrás todo lo necesario para abrir cuentas bancarias empresariales en USA (como Mercury, Relay o Wise) de forma 100% online y vincularlas a procesadores de pago como Stripe o PayPal US.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Tengo que viajar a Estados Unidos para abrir la empresa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El proceso es 100% remoto y digital. No necesitas viajar a EE.UU. para constituir la LLC, ni para obtener el EIN, ni para abrir tus cuentas bancarias corporativas. Todo se gestiona desde tu computadora.',
      },
    },
  ],
}

// ──────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────
export default function LlcNoResidentesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-24 px-4 relative overflow-hidden">
        {/* Fondo Fintech / Global */}
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-20"></div>
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 to-transparent"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-950/50 border border-indigo-400/30 text-indigo-100 text-sm font-bold px-5 py-2 rounded-full mb-8 backdrop-blur-md shadow-xl">
            🌍 Globaliza tu Negocio Digital
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg tracking-tight">
            LLC para No Residentes
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            Cobra a clientes en todo el mundo, accede al sistema bancario de EE.UU. y opera con una carga fiscal estadounidense del 0% desde tu país de origen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/precios"
              className="bg-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-full shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:bg-indigo-500 transition-all hover:scale-105"
            >
              Comenzar Trámite
            </Link>
            <Link
              href="/agendar"
              className="bg-transparent border border-indigo-300/30 text-indigo-100 font-bold text-lg px-8 py-4 rounded-full hover:bg-white/10 backdrop-blur-sm transition-colors"
            >
              Hablar con un Experto
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-24">
        
        {/* ── LAS 3 BARRERAS QUE DERRIBA LA LLC ── */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Por qué el mundo entero elige Estados Unidos
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Si vives en Latinoamérica o España, tu principal freno para crecer es el sistema bancario local y los procesadores de pago limitados. Una LLC elimina estas barreras instantáneamente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '💳',
                title: 'Stripe y Pasarelas Premium',
                desc: 'Olvídate de pasarelas de pago locales que rechazan tarjetas internacionales. Con tu LLC y EIN tendrás acceso al Stripe de USA, PayPal corporativo, Shopify Payments y Mercury.',
              },
              {
                icon: '🏦',
                title: 'Banca Corporativa en USD',
                desc: 'Al abrir tu LLC, podrás tener cuentas bancarias en Estados Unidos a nombre de tu empresa. Recibe transferencias ACH, SWIFT y guarda tu capital en dólares fuertes y seguros.',
              },
              {
                icon: '🛡️',
                title: 'Desconexión de Riesgo País',
                desc: 'Tus fondos y tu entidad legal viven en la jurisdicción más segura del mundo. Proteges tu dinero de devaluaciones locales, corralitos o inestabilidad política de tu país de origen.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-indigo-500/30 hover:shadow-xl transition-all">
                <div className="text-4xl mb-4 bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center border border-indigo-100">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── EL SECRETO FISCAL (Disregarded Entity) ── */}
        <section className="bg-slate-900 rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
          {/* Gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
                Optimización Fiscal Legal
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">
                El "Truco" del 0% de Impuestos en USA
              </h2>
              <p className="text-slate-300 mb-6 leading-relaxed text-lg">
                El gobierno de Estados Unidos considera a las LLC de un solo miembro (extranjeros) como <strong>"Disregarded Entities"</strong> (Entidades Transparentes).
              </p>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Esto significa que la empresa en sí misma no paga impuestos corporativos. Las ganancias "pasan" (Pass-Through) directamente a ti. Y aquí viene la magia:
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm mt-8">
                <p className="text-white font-medium mb-3">Si cumples estas 3 reglas, tu LLC no paga impuestos en USA:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-300">
                    <span className="text-green-400">✔</span> Eres No Residente (NRA) de EE.UU.
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <span className="text-green-400">✔</span> Ofreces servicios, productos digitales o E-commerce.
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <span className="text-green-400 shrink-0">✔</span> No tienes Presencia Física (ETBUS) en EE.UU. (no tienes oficinas locales, ni empleados dependientes físicos en suelo americano).
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl relative z-10">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-4">Flujo del Dinero (Ejemplo Práctico)</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                    <div>
                      <h4 className="font-bold text-white">Tu cliente paga en tu web</h4>
                      <p className="text-xs text-slate-400">Cliente de España te compra usando tarjeta vía Stripe (EE.UU.).</p>
                    </div>
                  </div>
                  <div className="w-1 h-8 bg-slate-700 ml-6"></div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                    <div>
                      <h4 className="font-bold text-white">El dinero entra a tu LLC</h4>
                      <p className="text-xs text-slate-400">Stripe liquida los USD en tu cuenta bancaria de Mercury o Relay.</p>
                    </div>
                  </div>
                  <div className="w-1 h-8 bg-slate-700 ml-6"></div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                    <div>
                      <h4 className="font-bold text-white">Retiras a tu país (Cero US Tax)</h4>
                      <p className="text-xs text-slate-400">Te transfieres el dinero a tu banco local en tu país. El IRS no te cobra impuestos sobre esa venta.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pb-8 text-xs text-slate-500 text-center">
                  * Nota Legal: Las ganancias que te transfieres deben tributarse como IRPF (o su equivalente) en tu país de residencia fiscal local.
                </div>
              </div>
              
              {/* Decoraciones de UI */}
              <div className="absolute -right-6 -bottom-6 bg-slate-700 px-4 py-3 rounded-xl shadow-xl border border-slate-600 flex items-center gap-3 z-20">
                <span className="text-2xl">💸</span>
                <div>
                  <div className="text-xs text-slate-400">Tasa IRS (EE.UU)</div>
                  <div className="font-bold text-white text-lg">0.00%</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── IDEAL PARA... ── */}
        <section>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                El vehículo perfecto para negocios 100% online
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Constituir una LLC es la decisión más rentable que puede tomar un emprendedor latinoamericano o español que quiere cobrar en dólares sin perder márgenes brutales en conversiones y bancos ineficientes.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Dropshipping",
                  "Amazon FBA",
                  "Venta de Info-Productos",
                  "Agencias SMMA",
                  "Desarrolladores Freelance",
                  "Agencias OnlyFans (OFM)",
                  "SaaS Founders",
                  "Consultores Online",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 items-center">
                    <span className="text-indigo-600 font-bold">✓</span>
                    <span className="text-slate-700 font-medium text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100">
              <h3 className="text-2xl font-bold text-indigo-950 mb-6">Lo que necesitas (y lo que NO)</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                  <div className="font-bold text-green-700 mb-1 flex items-center gap-2">
                    <span>✔️</span> Sí Necesitas
                  </div>
                  <p className="text-sm text-slate-600">Pasaporte válido de tu país (para el EIN), un nombre para tu empresa y una cuenta en Open LLC USA.</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm opacity-80">
                  <div className="font-bold text-red-700 mb-1 flex items-center gap-2">
                    <span>❌</span> NO Necesitas
                  </div>
                  <p className="text-sm text-slate-600">No necesitas SSN, ni ITIN, ni Visa americana, ni viajar a USA, ni tener un socio estadounidense.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ NO RESIDENTES ── */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Preguntas Frecuentes de Extranjeros
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
      <section className="bg-indigo-900 text-white py-16 text-center px-4 mt-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Cruza fronteras. Abre tu LLC hoy.</h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Todo el trámite es 100% online y guiado por expertos. Obtén tu LLC, tu EIN y tu cuenta bancaria en USA en un solo lugar.
          </p>
          <Link href="/precios" className="inline-block bg-white text-indigo-900 font-bold px-10 py-4 rounded-full hover:scale-105 transition-transform shadow-xl">
            Ver Planes de Registro
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
