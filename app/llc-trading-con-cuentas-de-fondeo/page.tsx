import type { Metadata } from 'next'
import Link from 'next/link'


// ──────────────────────────────────────────────
// SEO Metadata — Landing Trading & Prop Firms
// ──────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Crear LLC para Cuentas de Fondeo y Prop Trading (Guía 2026)',
  description:
    'Retira los payouts de tus cuentas de fondeo sin bloqueos bancarios. Descubre cómo una LLC en EE.UU. te permite recibir pagos en dólares vía Deel y optimizar impuestos.',
  alternates: {
    canonical: 'https://openllcusa.com/llc-trading-con-cuentas-de-fondeo',
  },
  keywords: [
    'llc para trading',
    'llc para cuentas de fondeo',
    'retirar payouts prop firm',
    'impuestos trading forex',
    'ftmo llc',
    'apex funding llc',
    'retiros deel mercury bank',
  ],
  openGraph: {
    title: 'Retira tus Payouts como un Profesional: LLC para Traders',
    description:
      'Firma contratos B2B con prop firms, evita retenciones fiscales y recibe tus ganancias directamente en una cuenta en dólares corporativa.',
    type: 'article',
    url: 'https://openllcusa.com/llc-trading-con-cuentas-de-fondeo',
    images: [
      {
        url: 'https://openllcusa.com/images/trading-llc.webp',
        width: 1200,
        height: 630,
        alt: 'LLC para Cuentas de Fondeo - Open LLC USA',
      },
    ],
  },
}

// ──────────────────────────────────────────────
// Schema JSON-LD: FAQPage para Trading
// ──────────────────────────────────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Las Prop Firms aceptan empresas extranjeras (LLC)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Empresas como FTMO, Apex Funding o Topstep permiten firmar tu contrato B2B como "Independent Contractor" a nombre de tu LLC americana.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué pongo en el Formulario W-8BEN-E?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cuando la Prop Firm (si es americana) o Deel te pida rellenar tus datos fiscales, usarás el formulario W-8BEN-E a nombre de tu LLC. Esto certifica que eres una entidad extranjera y evita la retención (Withholding Tax) del 30% del IRS.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Puedo retirar desde Deel hacia el banco de mi LLC?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutamente. Deel permite vincular cuentas bancarias comerciales americanas (como Mercury Bank o Relay). Al tener tu LLC, el dinero viaja de Prop Firm -> Deel -> Mercury Bank sin bloqueos y 100% en dólares.',
      },
    },
  ],
}

export default function LlcTradingPage() {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-slate-900 pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden text-white border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-sm mb-6 uppercase tracking-wider border border-blue-400/30">
            Prop Firms & Forex
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight text-slate-50">
            Retira tus Payouts como <br className="hidden md:block" />
            <span className="text-blue-400">un Trader Profesional</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Firma tus contratos B2B con FTMO, Apex o Topstep a nombre de tu empresa americana. Recibe tus ganancias en dólares (sin bloqueos bancarios en tu país) y optimiza tu carga fiscal legalmente.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/precios"
              className="px-8 py-4 bg-blue-500 text-white rounded-lg font-bold text-lg hover:bg-blue-400 transition shadow-lg shadow-blue-500/30"
            >
              Crear mi LLC en Wyoming
            </Link>
          </div>
        </div>
      </section>

      {/* El Problema del Trader Individual */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              El infierno de retirar fondos como individuo
            </h2>
            <p className="mt-4 text-slate-600 text-lg max-w-2xl mx-auto">
              Pasar un challenge es difícil, pero retirar tus ganancias a tu país natal sin perder la mitad en el proceso es aún peor.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
              <div className="text-3xl mb-4">🏦</div>
              <h3 className="text-xl font-bold text-red-900 mb-3">Bloqueos Bancarios</h3>
              <p className="text-red-800/80 leading-relaxed">
                Tu banco local congela los giros internacionales SWIFT pidiendo justificar el origen de los fondos, tratándote como un perfil de alto riesgo.
              </p>
            </div>
            
            <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
              <div className="text-3xl mb-4">💸</div>
              <h3 className="text-xl font-bold text-red-900 mb-3">Impuestos Asfixiantes</h3>
              <p className="text-red-800/80 leading-relaxed">
                Al facturar a título personal, tu país puede cobrarte entre un 30% y un 50% de IRPF o Impuesto a las Ganancias sobre cada dólar retirado.
              </p>
            </div>

            <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
              <div className="text-3xl mb-4">⚖️</div>
              <h3 className="text-xl font-bold text-red-900 mb-3">Riesgo Legal</h3>
              <p className="text-red-800/80 leading-relaxed">
                Estás asumiendo toda la responsabilidad jurídica de los contratos de "Independent Contractor" (Contratista) con firmas multinacionales con tu propio nombre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* La Solución Ecosistema LLC */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">El Ecosistema Perfecto</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-6">
                El flujo de dinero inteligente
              </h2>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">1</div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-slate-900">Creas tu LLC en Wyoming</h4>
                    <p className="text-slate-600">Recomendamos Wyoming por su privacidad extrema. Nadie sabrá cuánto facturas ni quién es el dueño de la empresa.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">2</div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-slate-900">Firmas con la Prop Firm</h4>
                    <p className="text-slate-600">Al pasar el challenge, firmas el contrato como tu empresa (Ej: "Alpha Trading LLC"), no como individuo.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">3</div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-slate-900">Conexión mágica con Deel</h4>
                    <p className="text-slate-600">Las grandes firmas usan Deel para pagar. Tú vinculas tu cuenta bancaria de EE.UU. (Mercury Bank) directamente a Deel.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold">4</div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-slate-900">Dólares sin fricción</h4>
                    <p className="text-slate-600">El dinero llega a tu banco corporativo en USD en 24 horas. Listo para reinvertir, hacer gastos de empresa o usar con tu tarjeta Visa.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6 text-center border-b pb-4">
                Firmas Compatibles
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-center font-black text-slate-400 text-xl border border-slate-100">FTMO</div>
                <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-center font-black text-slate-400 text-xl border border-slate-100">Apex Funding</div>
                <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-center font-black text-slate-400 text-xl border border-slate-100">Topstep</div>
                <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-center font-black text-slate-400 text-xl border border-slate-100">MyFundedFX</div>
                <div className="col-span-2 bg-blue-50 p-4 rounded-lg text-center text-sm font-semibold text-blue-700 mt-2">
                  + Cualquier firma que pague vía Deel o Bank Transfer (ACH/Wire)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué Wyoming */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-50">
            Por qué <span className="text-blue-400">Wyoming</span> es el santuario de los Traders
          </h2>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed">
            Como trader, tu mayor activo es tu capital y tu privacidad. Wyoming ofrece las mejores leyes de protección de activos (Asset Protection) de EE.UU. 
            Además, **nadie puede buscar tu nombre en internet** para ver cuánto dinero gestionas, porque los dueños de las LLC en Wyoming son 100% anónimos en el registro público. Todo esto por solo $62 de mantenimiento anual.
          </p>
          <Link
            href="/precios"
            className="inline-block px-8 py-4 bg-white text-slate-900 rounded-lg font-bold text-xl hover:bg-slate-100 transition shadow-xl"
          >
            Fundar mi LLC en Wyoming
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Preguntas Frecuentes (Traders)
          </h2>
          
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                ¿Tengo que pagar impuestos al IRS (Estados Unidos)?
              </h3>
              <p className="text-slate-600">
                Al ser extranjero (Non-Resident Alien) operando una LLC Disregarded y sin oficinas físicas ni empleados en EE.UU., tus ganancias procedentes del trading o los payouts de contratos están **exentas de Income Tax federal (0%)**. Sin embargo, es OBLIGATORIO presentar el formulario informativo 5472 + 1120 proforma cada año (servicio que nosotros cubrimos).
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                ¿Qué pasa con el Formulario W-8BEN o W-9?
              </h3>
              <p className="text-slate-600">
                Las Prop Firms (especialmente las americanas como Apex o Topstep) tienen la obligación de retener impuestos a los residentes de EE.UU. Al usar tu LLC extranjera, te guiaremos para completar el formulario **W-8BEN-E**, demostrando que eres una entidad comercial no estadounidense, librándote así de retenciones automáticas.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                ¿Tengo que ser rentable antes de abrir la LLC?
              </h3>
              <p className="text-slate-600">
                Legalmente no, pero estratégicamente te conviene **tener la LLC creada y la cuenta bancaria lista ANTES** de firmar el contrato tras pasar tu challenge. Si firmas el contrato como individuo, es muy complejo migrar los payouts a la empresa posteriormente.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
