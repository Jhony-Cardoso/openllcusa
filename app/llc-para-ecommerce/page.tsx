import type { Metadata } from 'next'
import Link from 'next/link'

// ──────────────────────────────────────────────
// SEO Metadata — Landing E-commerce / FBA
// ──────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Crear LLC para Amazon FBA y E-commerce (Guía 2026) | Open LLC USA',
  description:
    'Vende en Amazon FBA y Shopify desde tu país con una LLC en EE.UU. Abre Stripe, Mercury Bank y paga 0% en impuestos americanos sobre tus ventas online.',
  alternates: {
    canonical: 'https://openllcusa.com/llc-para-ecommerce',
  },
  keywords: [
    'crear LLC para amazon fba',
    'llc para ecommerce',
    'llc para dropshipping',
    'stripe para extranjeros',
    'cuenta bancaria amazon fba',
    'shopify payments llc',
  ],
  openGraph: {
    title: 'Crear LLC para Amazon FBA y E-commerce: La puerta al mercado de EE.UU.',
    description:
      'Abre pasarelas de pago top, cuentas bancarias en dólares y elimina las barreras de Amazon FBA sin vivir en Estados Unidos.',
    type: 'article',
    url: 'https://openllcusa.com/llc-para-ecommerce',
    images: [
      {
        url: 'https://openllcusa.com/images/ecommerce-llc.webp',
        width: 1200,
        height: 630,
        alt: 'Crear LLC para Amazon FBA y E-commerce',
      },
    ],
  },
}

// ──────────────────────────────────────────────
// Schema JSON-LD: FAQPage para E-commerce
// ──────────────────────────────────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Puedo usar Stripe y Shopify Payments siendo extranjero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Totalmente. Al tener una LLC y un EIN (Número de Identificación Patronal), Stripe y Shopify Payments te aceptan aunque no residas en Estados Unidos. Esto dispara tu tasa de conversión porque los clientes pueden pagar directamente con tarjeta de crédito o Apple Pay.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué necesito para vender en Amazon FBA USA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Amazon exige operar como una empresa americana si quieres tener una cuenta sólida que no te bloqueen de inmediato. Necesitarás el EIN de tu LLC, un pasaporte vigente y, crucialmente, una cuenta bancaria comercial en dólares para recibir tus liquidaciones (payouts) quincenales.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Tengo que pagar impuestos en EE.UU. por hacer dropshipping?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Como extranjero sin presencia física en EE.UU., tus ingresos de ventas online (dropshipping) normalmente no están sujetos al pago de Income Tax federal. Sin embargo, si almacenas productos físicos (Nexo Físico) o superas límites de ventas por estado, podrías tener que recaudar Sales Tax. Nosotros te asesoramos sobre este proceso.',
      },
    },
  ],
}

// ──────────────────────────────────────────────
// Componente Principal
// ──────────────────────────────────────────────
export default function LlcEcommercePage() {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      {/* Script para inyectar Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-100 to-blue-50 pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-6 uppercase tracking-wider">
            Ecommerce & Dropshipping
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
            Vende en Amazon FBA y Shopify <br className="hidden md:block" />
            <span className="text-blue-600">desde cualquier país</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
            Desbloquea Stripe, Shopify Payments y Mercury Bank con una LLC en EE.UU.
            Cobra en dólares, evita los bloqueos de PayPal y haz crecer tu tienda online sin pagar impuestos americanos sobre tus ventas globales.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/precios"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30"
            >
              Crear mi LLC ahora
            </Link>
            <Link
              href="/agendar"
              className="px-8 py-4 bg-white text-blue-600 border border-blue-200 rounded-lg font-bold text-lg hover:bg-blue-50 transition"
            >
              Hablar con un experto
            </Link>
          </div>
        </div>
      </section>

      {/* Beneficios E-commerce */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              ¿Por qué los gigantes del E-commerce usan una LLC?
            </h2>
            <p className="mt-4 text-slate-600 text-lg max-w-2xl mx-auto">
              Operar desde Latinoamérica o España a título personal te limita. Una estructura corporativa americana cambia las reglas del juego.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-6">💳</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Acceso a Pasarelas Top</h3>
              <p className="text-slate-600 leading-relaxed">
                Olvídate de comisiones abusivas y bloqueos repentinos. 
                Tener una LLC te permite abrir cuentas en <strong>Stripe USA</strong>, Braintree y Shopify Payments con total normalidad, aumentando tus conversiones de forma drástica.
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-6">🏦</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Cuentas en Dólares (USD)</h3>
              <p className="text-slate-600 leading-relaxed">
                Podrás abrir cuentas corporativas en bancos como <strong>Mercury Bank o Relay</strong> sin pisar Estados Unidos.
                Recibe los pagos de Amazon o Shopify directamente en dólares sin perder en el tipo de cambio.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-6">🛡️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">0% Impuestos en EE.UU.</h3>
              <p className="text-slate-600 leading-relaxed">
                Si no tienes almacenes ni empleados en territorio americano, eres considerado un extranjero no residente. 
                Esto significa que pagarás <strong>$0 de Income Tax</strong> al IRS. Tus ganancias fluyen 100% hacia ti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Casos Específicos: Amazon y Shopify */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-50">
                Dominando <span className="text-orange-400">Amazon FBA</span>
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                Vender en Amazon.com es el sueño de muchos, pero Amazon bloquea rápidamente a los individuos extranjeros que no presentan su documentación perfecta.
              </p>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span><strong>El famoso Utility Bill:</strong> Te enseñamos cómo verificar tu dirección para no caer en bloqueos iniciales.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span><strong>Nexo Físico:</strong> Al usar las bodegas de FBA, tu inventario pisa suelo americano. Te ayudamos a entender las reglas del <em>Sales Tax</em>.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span><strong>Registro de Marca:</strong> La LLC es el vehículo perfecto para registrar tu marca en la USPTO y acceder al Amazon Brand Registry.</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-4 text-green-400">Shopify & Dropshipping</h3>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Si usas el modelo de Dropshipping (enviando productos desde China u otros países), **no tienes almacenes en EE.UU**.
              </p>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Esto te convierte en el escenario fiscal ideal: **Cero Sales Tax** en la mayoría de los casos y **cero Income Tax federal**, mientras cobras como una gran marca americana a través de Shopify Payments.
              </p>
              <Link href="/precios" className="inline-block px-6 py-3 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-100 transition">
                Ver paquetes LLC
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios Humanizados */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Gente real facturando en dólares
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Testimonio 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">
              <div className="absolute top-8 right-8 text-4xl text-blue-100">"</div>
              <p className="text-slate-600 text-lg italic relative z-10 mb-6">
                Llevaba meses renegando con PayPal en Colombia para mi tienda de dropshipping. Los fondos retenidos me mataban el flujo de caja. En cuanto abrí la LLC en Wyoming y conecté Stripe, la conversión subió un 25% y por fin tengo los dólares en Mercury listos para pagar anuncios.
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">D</div>
                <div className="ml-4">
                  <p className="font-bold text-slate-900">David G.</p>
                  <p className="text-sm text-slate-500">Tienda Shopify - Colombia</p>
                </div>
              </div>
            </div>

            {/* Testimonio 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">
              <div className="absolute top-8 right-8 text-4xl text-blue-100">"</div>
              <p className="text-slate-600 text-lg italic relative z-10 mb-6">
                Intenté abrir la cuenta en Amazon FBA como individuo y me rechazaron por los comprobantes de domicilio. El equipo me asesoró para hacerlo todo a través de la LLC. Ahora tengo mi cuenta activa, cobro cada 14 días y mi inventario privado se vende como pan caliente.
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">C</div>
                <div className="ml-4">
                  <p className="font-bold text-slate-900">Carlos M.</p>
                  <p className="text-sm text-slate-500">Vendedor Amazon FBA - España</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Preguntas Frecuentes (E-commerce & FBA)
          </h2>
          
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                ¿Puedo usar Stripe y Shopify Payments siendo extranjero?
              </h3>
              <p className="text-slate-600">
                Totalmente. Al tener una LLC y un EIN, Stripe y Shopify Payments te aceptan aunque no residas en Estados Unidos. Solo necesitas presentar tu pasaporte y los datos de tu empresa. Esto dispara tu tasa de conversión porque la gente paga directo en tu web sin salir a páginas externas.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                ¿Qué necesito para vender en Amazon FBA USA?
              </h3>
              <p className="text-slate-600">
                Amazon exige operar con profesionalismo si no quieres que te bloqueen. Necesitarás el EIN de tu LLC, un pasaporte vigente y una cuenta bancaria comercial en dólares para recibir tus liquidaciones (payouts). Nosotros te ayudamos a sortear la temida fase de verificación.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                ¿Tengo que pagar impuestos en EE.UU. por hacer dropshipping?
              </h3>
              <p className="text-slate-600">
                Como extranjero, si todo tu dropshipping se hace enviando desde fuera a EE.UU. y no tienes oficinas allí, no pagas <em>Income Tax</em> (0%). En cuanto al <em>Sales Tax</em> (IVA americano), dependerá de si superas los límites de facturación en algún estado concreto. Nosotros te lo preparamos todo en la declaración anual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-50">
            Tu tienda online está a punto de dar el salto internacional
          </h2>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Deja los bloqueos y los impuestos injustos en el pasado. Registra tu LLC en Wyoming o Nuevo México en tan solo 5 días hábiles.
          </p>
          <Link
            href="/precios"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-xl hover:bg-slate-100 transition shadow-xl"
          >
            Iniciar el registro de mi LLC
          </Link>
        </div>
      </section>
    </div>
  )
}
