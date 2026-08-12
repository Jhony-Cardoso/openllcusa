import type { Metadata } from 'next'
import Link from 'next/link'

// ──────────────────────────────────────────────
// SEO Metadata — Landing Texas
// ──────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Crear LLC en Texas (Guía 2026): Requisitos y Costos Reales | Open LLC USA',
  description:
    'Todo sobre crear una LLC en Texas. Ventajas, desventajas (Franchise Tax), cómo proteger tu privacidad y por qué Wyoming podría ser una mejor alternativa.',
  alternates: {
    canonical: 'https://openllcusa.com/llc-texas',
  },
  keywords: [
    'crear llc en texas',
    'abrir llc en texas',
    'ventajas llc texas',
    'franquicia texas llc',
    'costo llc texas',
    'texas vs wyoming llc',
  ],
  openGraph: {
    title: 'Crear LLC en Texas: La Guía Definitiva (Pros y Contras)',
    description:
      'Texas no tiene Income Tax, pero ¿es el mejor estado para tu negocio online? Analizamos los costos reales, la privacidad y alternativas más eficientes.',
    type: 'article',
    url: 'https://openllcusa.com/llc-texas',
    images: [
      {
        url: 'https://openllcusa.com/images/texas-llc.webp',
        width: 1200,
        height: 630,
        alt: 'Crear LLC en Texas - Open LLC USA',
      },
    ],
  },
}

// ──────────────────────────────────────────────
// Schema JSON-LD: FAQPage para Texas
// ──────────────────────────────────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Tengo que viajar a Texas para abrir la empresa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, el proceso de incorporación de una LLC en Texas se puede realizar 100% de forma remota, desde cualquier país del mundo.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta crear una LLC en Texas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El estado de Texas cobra una tarifa de creación (Filing Fee) de $300 USD por el Certificate of Formation, siendo uno de los estados más caros para iniciar (Wyoming cobra $102 y Nuevo México $50).',
      },
    },
    {
      '@type': 'Question',
      name: '¿Hay privacidad corporativa en Texas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. En Texas, los nombres de los Managers (administradores) o Members (dueños) de la LLC son de registro público. Si buscas privacidad para operar tu negocio digital, estados como Wyoming son mucho más recomendables.',
      },
    },
  ],
}

export default function LlcTexasPage() {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-100 to-red-50 pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 text-red-700 font-bold text-sm mb-6 uppercase tracking-wider">
            Análisis de Estado
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
            Crear una LLC en <span className="text-red-600">Texas</span>
            <br className="hidden md:block" /> ¿Es tu mejor opción?
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
            El estado de la "Estrella Solitaria" es famoso por no tener impuestos estatales sobre la renta. Sin embargo, antes de abrir tu empresa aquí, descubre los verdaderos costos y la falta de privacidad.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="#comparativa"
              className="px-8 py-4 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition shadow-lg shadow-red-500/30"
            >
              Ver Comparativa vs Wyoming
            </Link>
          </div>
        </div>
      </section>

      {/* Ventajas Reales */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Lo bueno de Texas
            </h2>
            <p className="mt-4 text-slate-600 text-lg max-w-2xl mx-auto">
              Texas tiene una de las economías más robustas del mundo y es un imán para grandes corporaciones (Tesla, Oracle).
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">0% State Income Tax</h3>
              <p className="text-slate-600">
                Al igual que Wyoming, Florida y Nevada, Texas no cobra impuesto estatal sobre la renta (State Income Tax) a nivel personal.
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <div className="text-3xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Prestigio Comercial</h3>
              <p className="text-slate-600">
                Tener una dirección comercial en Dallas, Austin o Houston otorga una gran presencia física si planeas atraer inversores locales.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Protección de Activos</h3>
              <p className="text-slate-600">
                Las leyes corporativas de Texas (Charging Order Protection) son muy fuertes para proteger los activos personales de los dueños en caso de demandas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* El Bait and Switch Educativo: Desventajas y Alternativa */}
      <section id="comparativa" className="py-16 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-50">
              Por qué el 90% de los emprendedores digitales <br />
              <span className="text-blue-400">eligen Wyoming en lugar de Texas</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Si tienes un negocio online, eres freelancer o vendes en Amazon FBA, las desventajas burocráticas de Texas pesan mucho más que sus beneficios.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Texas (Lo malo) */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-red-500/30">
              <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center">
                <span className="mr-3">⭐</span> Texas LLC
              </h3>
              <ul className="space-y-5 text-slate-300">
                <li>
                  <strong className="text-white block mb-1">Costo de creación elevado ($300):</strong>
                  El estado cobra una tarifa base muy alta solo por procesar los documentos.
                </li>
                <li>
                  <strong className="text-white block mb-1">Cero privacidad (Registro público):</strong>
                  Tu nombre y apellidos aparecerán en internet en la base de datos pública de Texas.
                </li>
                <li>
                  <strong className="text-white block mb-1">El infame Franchise Tax:</strong>
                  Incluso si ganas $0 dólares, estás obligado por ley a contratar a un contable para presentar un reporte anual complejo al estado, generando costos adicionales constantes.
                </li>
              </ul>
            </div>

            {/* Wyoming (La Alternativa) */}
            <div className="bg-blue-600 p-8 rounded-2xl border border-blue-400 shadow-xl relative overflow-hidden">
              <div className="absolute -right-4 -top-4 bg-white text-blue-600 font-black text-xs px-6 py-2 rounded-full rotate-12 shadow-lg">
                RECOMENDADO
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">⛰️</span> Wyoming LLC
              </h3>
              <ul className="space-y-5 text-blue-50">
                <li>
                  <strong className="text-white block mb-1">Creación súper económica ($102):</strong>
                  Ahorras más de $200 de entrada solo en tasas del gobierno.
                </li>
                <li>
                  <strong className="text-white block mb-1">Privacidad Extrema (Anónimo):</strong>
                  Wyoming no publica tu nombre ni tu dirección en ningún registro público de internet.
                </li>
                <li>
                  <strong className="text-white block mb-1">Mantenimiento ridículo ($62/año):</strong>
                  No existe el Franchise Tax de Texas. Solo pagas una pequeña tasa fija de $62 anuales al estado de manera directa y sencilla.
                </li>
              </ul>
              
              <div className="mt-8 pt-6 border-t border-blue-400/50">
                <Link href="/precios" className="block text-center px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-slate-100 transition shadow">
                  Ver paquetes para Wyoming
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Casos de Uso */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            El veredicto: ¿Deberías elegir Texas?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="font-bold text-lg text-slate-900 mb-3 text-center">✅ SÍ, elige Texas si:</h4>
              <ul className="space-y-2 text-slate-600">
                <li>- Te vas a mudar físicamente a vivir a Texas.</li>
                <li>- Vas a comprar propiedades inmobiliarias (Real Estate) en Houston, Dallas o Austin.</li>
                <li>- Tienes oficinas, almacenes o empleados operando dentro de las fronteras de Texas.</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="font-bold text-lg text-slate-900 mb-3 text-center">❌ NO, elige Wyoming si:</h4>
              <ul className="space-y-2 text-slate-600">
                <li>- Eres un extranjero que no vive en Estados Unidos.</li>
                <li>- Haces Dropshipping, Amazon FBA, venta de software (SaaS) o trabajas como Freelancer.</li>
                <li>- Quieres maximizar tu privacidad corporativa y minimizar el papeleo contable.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Preguntas Frecuentes
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                ¿Cuánto cuesta el Certificate of Formation en Texas?
              </h3>
              <p className="text-slate-600">
                El costo exacto que cobra el Secretario de Estado de Texas para crear la LLC es de **$300 USD**. Este es uno de los precios base más altos de todo Estados Unidos, en comparación con Delaware ($90), Wyoming ($102) o Nuevo México ($50).
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                ¿Qué es el Franchise Tax de Texas?
              </h3>
              <p className="text-slate-600">
                Es un impuesto al privilegio de hacer negocios en el estado. Aunque las LLC que facturen menos de $2.47 millones de dólares no pagan dinero por este impuesto, están **obligadas legalmente a presentar el reporte** (No Tax Due Report) anualmente. Si no lo haces, te cierran la LLC y recibes fuertes multas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-50">
            Toma la decisión financiera más inteligente
          </h2>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Evita el papeleo innecesario y el alto costo inicial. Inicia tu negocio digital hoy mismo con la privacidad y protección de Wyoming o Nuevo México.
          </p>
          <Link
            href="/precios"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-xl hover:bg-slate-100 transition shadow-xl"
          >
            Ver paquetes recomendados
          </Link>
        </div>
      </section>
    </div>
  )
}
