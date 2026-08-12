import type { Metadata } from 'next'
import Link from 'next/link'

// ──────────────────────────────────────────────
// SEO Metadata — Landing Banco USA
// ──────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Abrir Cuenta Bancaria en USA sin Viajar (Para No Residentes) | Open LLC USA',
  description:
    'Abre una cuenta bancaria comercial en EE.UU. (Mercury Bank, Relay, Wise) a través de tu LLC americana. Proceso 100% online, sin SSN ni ITIN.',
  alternates: {
    canonical: 'https://openllcusa.com/abrir-cuenta-bancaria-usa',
  },
  keywords: [
    'abrir cuenta bancaria en usa',
    'cuenta bancaria usa no residentes',
    'mercury bank extranjeros',
    'relay financial llc',
    'cuenta corporativa usa online',
    'cuenta bancaria sin viajar a usa',
  ],
  openGraph: {
    title: 'Abrir Cuenta Bancaria en USA sin Viajar (Para Extranjeros)',
    description:
      'La guía definitiva para abrir cuentas en dólares en Estados Unidos usando tu LLC, sin necesidad de visado, SSN ni viajes a Miami.',
    type: 'article',
    url: 'https://openllcusa.com/abrir-cuenta-bancaria-usa',
    images: [
      {
        url: 'https://openllcusa.com/images/banco-usa.webp',
        width: 1200,
        height: 630,
        alt: 'Abrir Cuenta Bancaria en USA - Open LLC USA',
      },
    ],
  },
}

// ──────────────────────────────────────────────
// Schema JSON-LD: FAQPage para Cuentas Bancarias
// ──────────────────────────────────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Necesito viajar a Estados Unidos para abrir la cuenta?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Al tener una LLC debidamente registrada, bancos Fintech como Mercury y Relay te permiten realizar todo el proceso de apertura (KYC) de forma 100% online, estés donde estés.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué documentos me pedirá el banco?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para abrir una cuenta comercial necesitarás: Los Articles of Organization de tu LLC, tu número EIN oficial emitido por el IRS, y tu pasaporte vigente como documento de identidad.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Me piden un saldo mínimo o depósito inicial?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La gran ventaja de estos bancos Fintech es que puedes abrir la cuenta con $0 y no tienen cuotas de mantenimiento mensual ni saldos mínimos requeridos.',
      },
    },
  ],
}

export default function AbrirCuentaBancoPage() {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 to-slate-800 pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold text-sm mb-6 uppercase tracking-wider border border-blue-400/30">
            Finanzas Globales
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight text-slate-50">
            Abre tu cuenta bancaria en USA <br className="hidden md:block" />
            <span className="text-blue-400">sin salir de casa</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Despídete de los costosos viajes a Miami. Al crear tu LLC americana, desbloqueas el acceso directo a bancos élite en dólares desde tu país, sin SSN ni depósitos iniciales gigantes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/precios"
              className="px-8 py-4 bg-blue-500 text-white rounded-lg font-bold text-lg hover:bg-blue-600 transition shadow-lg shadow-blue-500/30"
            >
              Quiero mi LLC y mi Cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* El Problema vs La Solución */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              El mundo cambió. La banca también.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Camino antiguo */}
            <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
              <h3 className="text-xl font-bold text-red-900 mb-6 flex items-center">
                <span className="text-2xl mr-3">❌</span> El camino antiguo (Individuo)
              </h3>
              <ul className="space-y-4 text-red-800">
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Viajar presencialmente a una sucursal en EE.UU. (gastos de vuelo y hotel).</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Te exigen depósitos iniciales de $10,000 o más.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Altas probabilidades de rechazo por no tener un Número de Seguro Social (SSN).</span>
                </li>
              </ul>
            </div>

            {/* Camino actual */}
            <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
              <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center">
                <span className="text-2xl mr-3">✅</span> La solución (Abrir una LLC)
              </h3>
              <ul className="space-y-4 text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Proceso de aplicación 100% online desde tu laptop.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Depósito inicial de $0 y sin saldos mínimos requeridos.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>No necesitas SSN, solo tu pasaporte y los documentos legales de tu nueva empresa (EIN).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bancos Recomendados */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Plataformas Bancarias Top para Extranjeros
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition">
              <div className="h-16 flex items-center mb-6">
                <span className="text-2xl font-black tracking-tighter text-slate-900">MERCURY</span>
              </div>
              <h3 className="text-lg font-bold mb-3">La opción #1 para Startups</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                Mercury es la plataforma financiera más elegida por e-commerce y empresas digitales. Interfaz moderna, API potente y cero cuotas mensuales.
              </p>
              <ul className="text-sm text-slate-500 space-y-2">
                <li>✓ Sin saldo mínimo</li>
                <li>✓ Tarjetas virtuales ilimitadas</li>
                <li>✓ Wire transfers nacionales gratis</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition">
              <div className="h-16 flex items-center mb-6">
                <span className="text-2xl font-black tracking-tighter text-green-700">Relay</span>
              </div>
              <h3 className="text-lg font-bold mb-3">Control Multi-Cuenta</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                Relay Financial te permite crear hasta 20 cuentas corrientes gratuitas (ideal para separar gastos e impuestos) y emitir hasta 50 tarjetas.
              </p>
              <ul className="text-sm text-slate-500 space-y-2">
                <li>✓ Múltiples cuentas corrientes</li>
                <li>✓ Integración profunda con Xero/QuickBooks</li>
                <li>✓ Sin cuotas de mantenimiento</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition">
              <div className="h-16 flex items-center mb-6">
                <span className="text-2xl font-black tracking-tighter text-blue-500">Wise Business</span>
              </div>
              <h3 className="text-lg font-bold mb-3">El Rey de las Divisas</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                Perfecto para recibir pagos internacionales y retirar dinero a tu banco local en Latinoamérica o Europa con el mejor tipo de cambio del mercado.
              </p>
              <ul className="text-sm text-slate-500 space-y-2">
                <li>✓ Datos bancarios en USD, EUR, GBP</li>
                <li>✓ Tipo de cambio real (mid-market)</li>
                <li>✓ Ideal para pagar a freelancers</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Requisitos y Proceso */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">
            El proceso exacto (Paso a Paso)
          </h2>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-600 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h4 className="font-bold text-lg text-slate-900 mb-2">Crear tu LLC</h4>
                <p className="text-slate-600 text-sm">Registramos tu empresa en el estado que elijas (Wyoming, NM, etc.) y te entregamos los Articles of Organization sellados por el estado.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-600 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h4 className="font-bold text-lg text-slate-900 mb-2">Obtener el EIN</h4>
                <p className="text-slate-600 text-sm">Tramitamos tu número de identificación fiscal (EIN) ante el IRS. Este número es la "cédula" de tu empresa, indispensable para el banco.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-600 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h4 className="font-bold text-lg text-slate-900 mb-2">Aplicación Bancaria</h4>
                <p className="text-slate-600 text-sm">Entras a la web de Mercury o Relay, subes tus documentos de la LLC y una foto de tu pasaporte. En unos días hábiles, tu cuenta está activa.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Descargo de Responsabilidad (Honestidad Radical) */}
      <section className="py-8 bg-slate-100 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-3xl mx-auto uppercase tracking-wide font-medium">
            * Descargo de responsabilidad: Open LLC USA se encarga de estructurar tu empresa legalmente (LLC, EIN, Agente Registrado) para cumplir con todos los requisitos técnicos que exigen las plataformas bancarias. Sin embargo, no somos un banco ni una institución financiera. La aprobación final de cualquier cuenta bancaria está sujeta exclusivamente a los procesos de cumplimiento legal (Compliance y KYC) de la entidad bancaria tercera (Mercury, Relay, etc.), quienes se reservan el derecho de admisión según su evaluación de riesgo y tipo de negocio.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Preguntas Frecuentes
          </h2>
          
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                ¿Puedo tener una tarjeta de débito física?
              </h3>
              <p className="text-slate-600">
                Sí. Aunque desde el minuto uno puedes generar tarjetas virtuales para usar en Apple Pay o compras online, la mayoría de estos bancos te envían tarjetas de débito físicas. Puedes enviarla a la dirección de tu mail forwarding en EE.UU. y de ahí reenviarla a tu país.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                ¿Aceptan a residentes de cualquier país?
              </h3>
              <p className="text-slate-600">
                Aceptan a casi todos los países de Latinoamérica (Argentina, Colombia, México, Chile, Perú, etc.) y España. Los bancos solo bloquean a residentes de países sancionados por EE.UU. (como Cuba, Venezuela, Irán, Rusia, etc.). *Si vives en Venezuela pero tienes residencia legal en otro país (ej. Colombia o España), puedes aplicar utilizando tu residencia actual.*
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-50">
            Construye tu puente financiero hacia EE.UU.
          </h2>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Registra tu LLC hoy mismo y tendrás tu EIN listo en tiempo récord para abrir tu cuenta en dólares.
          </p>
          <Link
            href="/precios"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-xl hover:bg-slate-100 transition shadow-xl"
          >
            Crear LLC ahora
          </Link>
        </div>
      </section>
    </div>
  )
}
