import type { Metadata } from 'next'
import Link from 'next/link'
import CostCalculator from '@/components/llc-costs/CostCalculator'

// ──────────────────────────────────────────────
// SEO Metadata — Landing Costos
// ──────────────────────────────────────────────
export const metadata: Metadata = {
  title: '¿Cuánto Cuesta Crear una LLC en EE.UU? (Precios Reales 2026)',
  description:
    'Descubre el costo real de abrir y mantener una LLC en Wyoming, Nuevo México y Delaware. Sin letras pequeñas ni tarifas ocultas. Compara precios estatales.',
  alternates: {
    canonical: 'https://openllcusa.com/costo-crear-llc',
  },
  keywords: [
    'costo crear LLC',
    'cuanto cuesta abrir una llc',
    'precio llc wyoming',
    'precio llc delaware',
    'mantenimiento anual llc',
    'costos ocultos llc',
  ],
  openGraph: {
    title: 'El costo real de crear una LLC en EE.UU.',
    description:
      'Transparencia total. Desglosamos las tarifas estatales, los costos de mantenimiento y lo que realmente necesitas para operar sin sorpresas.',
    type: 'article',
    url: 'https://openllcusa.com/costo-crear-llc',
    images: [
      {
        url: 'https://openllcusa.com/images/costo-llc.webp',
        width: 1200,
        height: 630,
        alt: 'Costos de Crear una LLC - Open LLC USA',
      },
    ],
  },
}

// ──────────────────────────────────────────────
// Schema JSON-LD: FAQPage para Costos
// ──────────────────────────────────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta mantener una LLC al año?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Depende del estado. En Wyoming cuesta $62 al estado más la cuota de tu Agente Registrado. En Nuevo México cuesta $0 al estado, solo pagas el Agente. En Delaware cuesta un mínimo de $300 obligatorios.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Tengo que pagar por obtener el número EIN?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El IRS emite el EIN de forma gratuita. Sin embargo, el trámite para extranjeros (sin SSN) requiere llenar y enviar por fax el formulario SS-4. Muchas agencias cobran $100 extra por este servicio, en Open LLC USA viene incluido en todos los paquetes.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Es gratis abrir la cuenta bancaria de EE.UU?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí, bancos Fintech como Mercury o Relay no cobran tarifas de apertura ni comisiones por mantenimiento mensual.',
      },
    },
  ],
}

export default function CostoLlcPage() {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-slate-50 pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-200 text-slate-800 font-bold text-sm mb-6 uppercase tracking-wider">
            Transparencia Total
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
            ¿Cuánto cuesta realmente <br className="hidden md:block" />
            <span className="text-blue-600">abrir y mantener una LLC?</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
            Sin costos sorpresa ni tarifas ocultas. Descubre la verdad sobre los precios estatales, los Agentes Registrados y cómo muchas agencias inflan sus presupuestos.
          </p>
        </div>
      </section>

      {/* Calculadora Section */}
      <section className="py-8 md:py-16 bg-white relative -mt-16 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CostCalculator />
        </div>
      </section>

      {/* Explicando el Mantenimiento */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Desglosando el costo de mantener tu LLC
            </h2>
            <p className="mt-4 text-slate-600 text-lg">
              Crear la LLC es solo el primer paso. Esto es lo que necesitas considerar para el "Año 2" en adelante.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 border border-slate-200 rounded-2xl bg-slate-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 border-b pb-4">
                1. El Reporte Anual (Estado)
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                El "Annual Report" o "Franchise Tax" es una tasa de renovación obligatoria que le pagas directamente al gobierno del estado para mantener tu empresa activa.
              </p>
              <ul className="space-y-3">
                <li className="flex justify-between font-semibold"><span>Wyoming</span> <span>$62</span></li>
                <li className="flex justify-between font-semibold"><span>Nuevo México</span> <span>$0</span></li>
                <li className="flex justify-between font-semibold text-red-500"><span>Delaware</span> <span>$300 min.</span></li>
              </ul>
            </div>

            <div className="p-8 border border-slate-200 rounded-2xl bg-slate-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 border-b pb-4">
                2. El Agente Registrado
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                La ley exige que tengas una dirección física en el estado y una persona disponible en horario laboral para recibir notificaciones legales urgentes.
              </p>
              <p className="text-slate-600 leading-relaxed font-semibold">
                Nuestra tarifa de renovación como tu Agente Registrado es una de las más competitivas del mercado: solo $49 al año.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Los Costos Ocultos (Por qué elegirnos) */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-50">
                Cuidado con la trampa de los <span className="text-orange-400">"Solo $39"</span>
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                Muchas agencias famosas anuncian crear tu LLC por sumas ridículas como $39 o $0 (más tasas estatales). Sin embargo, esto es lo que no te cuentan:
              </p>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 text-xl">✕</span>
                  <span><strong>El EIN no viene incluido.</strong> Te cobran $100+ adicionales al final del proceso.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 text-xl">✕</span>
                  <span><strong>No envían documentos físicos.</strong> Te cobran $50+ si quieres tu carpeta corporativa por DHL/FedEx.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 text-xl">✕</span>
                  <span><strong>El Agente Registrado.</strong> Te lo "regalan" el primer año y el segundo año te llega una factura de $199.</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-4 text-blue-400">En Open LLC USA: Todo Incluido</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Nuestros paquetes incluyen el trámite del EIN, el pago estatal, la dirección comercial y el Agente Registrado por un año entero. Sin sorpresas, el precio que ves es el que pagas.
              </p>
              <Link href="/precios" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
                Ver precios transparentes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Preguntas Frecuentes sobre Precios
          </h2>
          
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                ¿Tengo que pagar impuestos (Taxes) además del mantenimiento?
              </h3>
              <p className="text-slate-600">
                Si eres extranjero sin presencia física en EE.UU. (sin almacenes, sin empleados en EE.UU.) y prestas servicios o vendes online desde tu país, tus ganancias están **exentas de Income Tax** federal. El único costo obligatorio que pagarás será el mantenimiento anual estatal y el agente registrado.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                ¿Es gratis abrir la cuenta bancaria en dólares?
              </h3>
              <p className="text-slate-600">
                Sí. Los bancos Fintech con los que trabajamos (como Mercury o Relay) no cobran comisiones por apertura ni exigen saldo mínimo mensual. La apertura de la cuenta es un proceso gratuito que tú mismo puedes hacer con los documentos de la LLC que te entregamos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-50">
            ¿Listo para arrancar sin sorpresas en el presupuesto?
          </h2>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Elige el estado que mejor se adapte a tu bolsillo y comienza a facturar en el mercado más grande del mundo.
          </p>
          <Link
            href="/precios"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-xl hover:bg-slate-100 transition shadow-xl"
          >
            Ver paquetes y precios
          </Link>
        </div>
      </section>
    </div>
  )
}
