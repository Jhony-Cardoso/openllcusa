import type { Metadata } from 'next'
import Link from 'next/link'

// ──────────────────────────────────────────────
// SEO Metadata — Landing Wyoming
// ──────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Crear LLC en Wyoming (Guía 2026 para Extranjeros) | Open LLC USA',
  description:
    'Descubre por qué Wyoming es el mejor estado para tu LLC. Máxima privacidad, sin impuestos estatales y solo $62 de mantenimiento anual. Proceso online en 5 días.',
  alternates: {
    canonical: 'https://openllcusa.com/llc-wyoming',
  },
  keywords: [
    'crear LLC en Wyoming',
    'ventajas LLC Wyoming',
    'Wyoming vs Delaware',
    'costo LLC Wyoming',
    'impuestos Wyoming LLC',
    'privacidad LLC',
  ],
  openGraph: {
    title: 'Crear LLC en Wyoming: La opción #1 para no residentes',
    description:
      'Privacidad total, $62 de coste anual y protección de activos imbatible. Abre tu empresa en Wyoming desde tu país 100% online.',
    type: 'article',
    url: 'https://openllcusa.com/llc-wyoming',
    images: [
      {
        url: 'https://openllcusa.com/images/wyoming-llc.webp',
        width: 1200,
        height: 630,
        alt: 'Crear LLC en Wyoming - Open LLC USA',
      },
    ],
  },
}

// ──────────────────────────────────────────────
// Schema JSON-LD: FAQPage para Wyoming
// ──────────────────────────────────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta mantener una LLC en Wyoming anualmente?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El estado de Wyoming tiene una de las tasas de mantenimiento más bajas de todo Estados Unidos. El reporte anual (Annual Report) cuesta únicamente $62 al año. A esto solo debes sumar la cuota anual del Agente Registrado.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Es cierto que Wyoming ofrece anonimato total?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí, Wyoming es uno de los pocos estados que no requiere incluir los nombres de los miembros o gerentes en los Articles of Organization (documento público de registro). Solo figura el nombre y dirección del Agente Registrado, brindándote privacidad pública total. (Ten en cuenta que sí se debe declarar la propiedad internamente al IRS y FinCEN).',
      },
    },
    {
      '@type': 'Question',
      name: 'Wyoming vs Delaware: ¿Cuál es mejor para extranjeros?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para el 95% de los emprendedores digitales, e-commerce o servicios profesionales que NO buscan financiación de capital de riesgo (Venture Capital), Wyoming es superior. Es más barato mantener ($62 frente a $300 en Delaware) y ofrece mejores leyes de protección de activos para pequeñas empresas. Delaware solo se recomienda si planeas recibir inversión institucional.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Tengo que pagar impuestos estatales en Wyoming?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Wyoming no tiene impuesto estatal sobre la renta (State Income Tax) ni a nivel corporativo ni a nivel individual. Esto simplifica enormemente tu contabilidad si operas como un no residente (Non-Resident Alien).',
      },
    },
  ],
}

// ──────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────
export default function WyomingLlcPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#0b382e] via-[#115e59] to-[#0f766e] text-white py-24 px-4 relative overflow-hidden">
        {/* Fondo decorativo inspirado en montañas/naturaleza de WY */}
        <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-400/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-950/50 border border-emerald-400/30 text-emerald-100 text-sm font-bold px-5 py-2 rounded-full mb-8 backdrop-blur-sm shadow-xl">
            ⛰️ El estado #1 elegido por nómadas digitales
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
            Crear una LLC en Wyoming
          </h1>
          <p className="text-xl md:text-2xl text-emerald-50 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            Privacidad corporativa blindada, cero impuestos estatales y el costo de mantenimiento anual más bajo de Estados Unidos ($62).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/precios"
              className="bg-emerald-500 text-white font-bold text-lg px-8 py-4 rounded-full shadow-2xl hover:bg-emerald-400 transition-all hover:scale-105"
            >
              Ver Planes y Precios
            </Link>
            <Link
              href="/agendar"
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-white/20 transition-colors"
            >
              Consulta Gratuita
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-24">
        
        {/* ── LAS 3 GRANDES VENTAJAS DE WYOMING ── */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              ¿Por qué elegir Wyoming para tu LLC?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Wyoming inventó la figura legal de la LLC en 1977. Hoy sigue teniendo las leyes más favorables para los propietarios de pequeños negocios de todo el mundo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🤫',
                title: 'Privacidad Absoluta',
                desc: 'Tus datos personales no aparecen en el registro público del estado. Solo se publica la dirección de nuestro Agente Registrado. Tu identidad queda protegida de bases de datos públicas y spam.',
              },
              {
                icon: '💰',
                title: 'Costes Imbatibles',
                desc: 'La tasa estatal de renovación anual (Annual Report) es de solo $62. Compáralo con los $300 de Delaware o los $800 de California. Es ideal para mantener gastos bajos.',
              },
              {
                icon: '🛡️',
                title: 'Protección de Activos',
                desc: 'Wyoming tiene las leyes de "Charging Order Protection" más fuertes de EE.UU. Tus activos personales están blindados contra demandas dirigidas a tu empresa, incluso en LLCs de un solo miembro.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-emerald-500/30 hover:shadow-xl transition-all group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMPARATIVA WYOMING VS DELAWARE VS NEW MEXICO ── */}
        <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
          <h2 className="text-3xl font-bold text-white text-center mb-10">La Gran Comparativa de Estados</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="p-4 text-slate-400 font-medium">Característica</th>
                  <th className="p-4 text-emerald-400 font-bold text-lg bg-emerald-900/20 rounded-t-lg">⛰️ Wyoming (Recomendado)</th>
                  <th className="p-4 text-slate-300 font-medium">🏢 Delaware</th>
                  <th className="p-4 text-slate-300 font-medium">🌵 New Mexico</th>
                </tr>
              </thead>
              <tbody className="text-sm md:text-base">
                <tr className="border-b border-slate-800">
                  <td className="p-4 text-slate-400">Tasa Estatal Anual</td>
                  <td className="p-4 bg-emerald-900/20 text-white font-bold">$62 USD</td>
                  <td className="p-4 text-slate-300">$300 USD (Franchise Tax)</td>
                  <td className="p-4 text-slate-300">$0 USD</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="p-4 text-slate-400">Privacidad Pública</td>
                  <td className="p-4 bg-emerald-900/20 text-white font-bold">Total (Nombres ocultos)</td>
                  <td className="p-4 text-slate-300">Total (Nombres ocultos)</td>
                  <td className="p-4 text-slate-300">Total (Nombres ocultos)</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="p-4 text-slate-400">Protección "Charging Order"</td>
                  <td className="p-4 bg-emerald-900/20 text-emerald-400 font-bold">Excelente (Incluso Single-Member)</td>
                  <td className="p-4 text-slate-300">Buena</td>
                  <td className="p-4 text-slate-300">Débil para Single-Member</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="p-4 text-slate-400">Impuesto Estatal (State Tax)</td>
                  <td className="p-4 bg-emerald-900/20 text-white font-bold">0%</td>
                  <td className="p-4 text-slate-300">0% (Si no operas en el estado)</td>
                  <td className="p-4 text-slate-300">0% (Si no operas en el estado)</td>
                </tr>
                <tr>
                  <td className="p-4 text-slate-400">¿Para quién es?</td>
                  <td className="p-4 bg-emerald-900/20 text-white rounded-b-lg">Freelancers, E-commerce, Agencias, Nómadas</td>
                  <td className="p-4 text-slate-300">Startups que buscan Venture Capital (Inversores)</td>
                  <td className="p-4 text-slate-300">Quienes buscan el costo anual absolutamente mínimo ($0)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── IDEAL PARA... ── */}
        <section>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                El ecosistema ideal para Negocios Digitales
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Si tu negocio vive en internet y tus clientes están en cualquier parte del mundo, Wyoming te ofrece el marco legal más sólido y amigable de Estados Unidos sin comerte el margen de beneficio en impuestos y tasas.
              </p>
              <ul className="space-y-4">
                {[
                  "Agencias de Marketing y Consultoría",
                  "Tiendas E-commerce y Dropshipping",
                  "Vendedores de Amazon FBA",
                  "Desarrolladores de Software y SaaS",
                  "Inversores y Protección Patrimonial",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-center">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 relative">
              <div className="absolute top-0 right-0 p-6 opacity-10 text-9xl">🤠</div>
              <h3 className="text-2xl font-bold text-emerald-900 mb-4 relative z-10">¿Sabías qué?</h3>
              <p className="text-emerald-800 leading-relaxed relative z-10 mb-6">
                Wyoming es conocido como el "Estado de la Igualdad". Fue el primer estado de EE.UU. en permitir el voto a las mujeres en 1869, y también **fue el creador de la estructura LLC en 1977**, revolucionando el mundo corporativo americano. Hoy, siguen siendo pioneros incorporando legislación específica para DAOs y criptomonedas.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ WYOMING ── */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Preguntas Frecuentes sobre LLCs en Wyoming
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

      {/* ── SCHEMA JSON-LD ── */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  )
}
