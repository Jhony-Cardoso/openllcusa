import type { Metadata } from 'next'
import Link from 'next/link'


// ──────────────────────────────────────────────
// SEO Metadata — Landing "EIN sin SSN"
// Keyword principal: "EIN sin SSN extranjero", "como obtener EIN sin SSN"
// Intención: Transaccional + Informacional (superar objeciones)
// ──────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Cómo Obtener un EIN sin SSN para Extranjeros (Guía 2026) | Open LLC USA',
  description:
    'Guía completa para obtener el EIN (Employer Identification Number) del IRS para tu LLC sin tener SSN (Social Security Number) ni ITIN. Proceso, tiempos y requisitos para no residentes.',
  alternates: {
    canonical: 'https://openllcusa.com/ein-sin-ssn',
  },
  keywords: [
    'EIN sin SSN extranjero',
    'como obtener EIN sin SSN',
    'SS-4 para extranjeros',
    'EIN para LLC no residente',
    'obtener EIN desde España',
    'obtener EIN desde Latam',
    'EIN IRS sin social security',
  ],
  openGraph: {
    title: 'Cómo Obtener un EIN sin SSN siendo Extranjero',
    description:
      'No necesitas SSN ni visa para tener una empresa en EE.UU. Descubre cómo tramitamos el EIN de tu LLC directamente con el IRS.',
    type: 'article',
    url: 'https://openllcusa.com/ein-sin-ssn',
    images: [
      {
        url: 'https://openllcusa.com/images/hero.webp',
        width: 1200,
        height: 630,
        alt: 'EIN sin SSN para LLC - Open LLC USA',
      },
    ],
  },
}

// ──────────────────────────────────────────────
// Schema JSON-LD: FAQPage
// ──────────────────────────────────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Puedo obtener un EIN si no tengo Social Security Number (SSN)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí, absolutamente. El IRS permite a los ciudadanos extranjeros (no residentes) obtener un EIN para su LLC utilizando el Formulario SS-4, sin necesidad de tener un SSN ni un ITIN.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Para qué sirve el EIN de una LLC?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El EIN (Employer Identification Number) es el equivalente al NIF o RUT de tu empresa en EE.UU. Lo necesitas obligatoriamente para abrir una cuenta bancaria comercial (como Mercury o Wise), abrir cuentas en Stripe o PayPal, y presentar los formularios fiscales anuales (5472 y 1120).',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto tiempo tarda el IRS en asignar el EIN a un extranjero sin SSN?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Al no tener SSN, el trámite no se puede hacer 100% online automatizado. El formulario SS-4 debe enviarse por fax. Debido a los protocolos de revisión manual actuales, el IRS tarda generalmente entre 2 y 4 semanas en procesar el fax y devolver el EIN.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Necesito un ITIN para solicitar el EIN?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Muchos emprendedores confunden ambos números. Para crear tu LLC y obtener el EIN, NO necesitas un ITIN (Individual Taxpayer Identification Number). El EIN es para la empresa, el ITIN es para personas físicas.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Tiene algún costo de mantenimiento el EIN?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. El EIN es asignado gratuitamente por el IRS y no caduca nunca, siempre y cuando la LLC siga existiendo. No hay que pagar cuotas anuales por mantener el EIN.',
      },
    },
  ],
}

// ──────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────
export default function EinSinSsnPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#0C2047] via-[#1D4ED8] to-[#3B82F6] text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-400/30 text-blue-100 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Actualizado para 2026
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Cómo Obtener un EIN<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
              Sin SSN ni Visa
            </span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            El 90% de los emprendedores extranjeros cree que necesita viajar a EE.UU. o tener un número de seguro social para obtener su número fiscal. <strong>Es un mito.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/agendar"
              className="inline-block bg-white text-[#1D4ED8] font-bold text-base px-8 py-4 rounded-full shadow-xl hover:bg-blue-50 transition-all hover:scale-105"
            >
              🚀 Nosotros lo tramitamos por ti
            </Link>
            <Link
              href="#como-funciona"
              className="inline-block border-2 border-white/40 text-white font-semibold text-base px-8 py-4 rounded-full hover:bg-white/10 transition-all"
            >
              Ver cómo funciona ↓
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-20">
        {/* ── QUE ES EL EIN ── */}
        <section id="que-es">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                ¿Qué es el EIN y por qué es vital para tu LLC?
              </h2>
              <p className="text-slate-700 leading-relaxed text-lg mb-6">
                El <strong>Employer Identification Number (EIN)</strong> es un número de 9 dígitos (formato XX-XXXXXXX) asignado por el IRS (la Hacienda americana). Es el equivalente al NIF en España, el CUIT en Argentina o el RFC en México, pero para tu empresa en EE.UU.
              </p>
              <ul className="space-y-3">
                {[
                  'Abrir una cuenta bancaria comercial (Mercury, Wise, Relay)',
                  'Procesar pagos internacionales (Stripe, PayPal, Amazon FBA)',
                  'Contratar servicios y firmar contratos (B2B)',
                  'Presentar los formularios fiscales obligatorios (5472 y 1120)',
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-700">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6">
                <p className="text-red-800 text-sm font-medium">
                  <strong>⚠️ Cuidado:</strong> Una LLC sin EIN no sirve para nada. Es como tener un coche sin motor; existe legalmente, pero no puedes usarla para operar financieramente.
                </p>
              </div>
            </div>
            <div className="flex-1 w-full max-w-sm">
              <div className="bg-white border-2 border-slate-100 rounded-2xl shadow-xl p-6 relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -z-10"></div>
                <div className="text-xs font-mono text-slate-400 mb-2">DEPARTMENT OF THE TREASURY</div>
                <div className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">INTERNAL REVENUE SERVICE</div>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-slate-500 uppercase">Employer Identification Number</div>
                    <div className="text-2xl font-mono font-bold text-slate-900">83-XXXXXXX</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase">Form Assigned</div>
                    <div className="text-sm font-semibold text-slate-800">SS-4 (Application for EIN)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── EL PROBLEMA DEL SSN ── */}
        <section className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              El mito del "Social Security Number" (SSN)
            </h2>
            <p className="text-slate-600 text-lg">
              Si intentas obtener el EIN directamente en la web del IRS, te pedirán obligatoriamente un SSN (Número de Seguro Social) o un ITIN. Como extranjero, no tienes ninguno de los dos. ¿Significa eso que no puedes tener una LLC? <strong>No.</strong>
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-red-500 text-2xl mb-3">❌ La vía online (Solo residentes)</div>
              <p className="text-slate-600 text-sm leading-relaxed">
                El sistema automatizado del IRS en su página web está diseñado <strong>exclusivamente</strong> para ciudadanos americanos o residentes que poseen un SSN. Si pones que eres extranjero (Foreign Alien), el sistema no te dejará avanzar.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border-2 border-blue-500 shadow-md relative">
              <div className="absolute -top-3 -right-3 text-2xl">💡</div>
              <div className="text-blue-600 font-bold text-lg mb-3">✅ La vía para extranjeros (Form SS-4)</div>
              <p className="text-slate-600 text-sm leading-relaxed">
                El IRS tiene un proceso legal específico para solicitantes internacionales. Consiste en rellenar el <strong>Formulario SS-4</strong>, escribir la palabra "Foreign" en la casilla del SSN, y enviarlo por una línea de fax especial dedicada a extranjeros.
              </p>
            </div>
          </div>
        </section>

        {/* ── COMO LO HACEMOS (PROCESO) ── */}
        <section id="como-funciona">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Cómo tramitamos tu EIN en Open LLC USA
          </h2>
          <div className="relative">
            {/* Línea conectora */}
            <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-blue-200 hidden md:block"></div>
            
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: 'Creamos tu LLC en el Estado',
                  desc: 'Antes de pedir el EIN, la empresa debe existir legalmente. Registramos tu LLC (por ejemplo, en Wyoming o Delaware) y obtenemos el Certificate of Formation.',
                },
                {
                  step: 2,
                  title: 'Preparamos el Formulario SS-4',
                  desc: 'Completamos el complejo formulario del IRS por ti. Como extranjero, actuamos como tu "Third Party Designee" (tercero autorizado) para agilizar el trámite.',
                },
                {
                  step: 3,
                  title: 'Envío directo al IRS (Línea Internacional)',
                  desc: 'Enviamos la solicitud junto con tu documento de formación a la línea de fax especial del IRS para solicitantes extranjeros en Ogden, Utah.',
                },
                {
                  step: 4,
                  title: 'Recepción y entrega (2 a 4 semanas)',
                  desc: 'El IRS procesa la solicitud manualmente. En cuanto aprueban la solicitud, recibimos tu Carta de Asignación del EIN (CP575) y te la enviamos inmediatamente en PDF. ¡Tu LLC ya está operativa!',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 items-start relative z-10">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-lg ring-4 ring-white">
                    {item.step}
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 flex-1 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MITOS COMUNES ── */}
        <section className="bg-gradient-to-br from-slate-900 to-[#0C2047] rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            3 Mitos que debes ignorar
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                mito: '"Necesito un ITIN para pedir el EIN"',
                realidad: 'Falso. El ITIN es para declarar impuestos personales. Para crear la LLC y sacar el EIN solo necesitas tu pasaporte.',
              },
              {
                mito: '"Tarda meses en llegar"',
                realidad: 'Falso. Aunque no es inmediato por requerir revisión manual humana, los faxes de extranjeros se están procesando actualmente en un plazo de 2 a 4 semanas.',
              },
              {
                mito: '"Tengo que llamar al IRS en inglés"',
                realidad: 'No si trabajas con nosotros. Como tus representantes, nos encargamos de todo el proceso y comunicación con el IRS.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <div className="text-red-400 font-bold mb-2 flex items-center gap-2">
                  <span>❌</span> Mito
                </div>
                <p className="text-slate-300 text-sm mb-4 font-medium">
                  {item.mito}
                </p>
                <div className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>✅</span> Realidad
                </div>
                <p className="text-white text-sm leading-relaxed">
                  {item.realidad}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <span>❓</span> Preguntas Frecuentes sobre el EIN
          </h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((item, idx) => (
              <details key={idx} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-50 transition-colors">
                  <span className="font-bold text-lg text-slate-800 pr-4">{item.name}</span>
                  <span className="text-slate-400 text-2xl font-light flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-slate-600 leading-relaxed text-base">{item.acceptedAnswer.text}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 text-center text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para obtener tu LLC con EIN incluido?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              En todos nuestros planes de formación (Starter, Professional y Business) el trámite del EIN ante el IRS está <strong>100% incluido</strong>. Sin dolores de cabeza.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/precios"
                className="bg-white text-blue-600 font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                Ver planes desde $349
              </Link>
              <Link
                href="/agendar"
                className="border-2 border-white/50 text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
              >
                Agendar asesoría gratuita
              </Link>
            </div>
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
