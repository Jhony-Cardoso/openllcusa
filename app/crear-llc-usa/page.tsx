import type { Metadata } from "next"
import Link from "next/link"


export const metadata: Metadata = {
  title: "Crear LLC en Estados Unidos 2026: Guía Completa para No Residentes | Open LLC USA",
  description:
    "Aprende cómo crear una LLC en Estados Unidos siendo no residente: requisitos, estados recomendados (Wyoming, Delaware), proceso paso a paso, costes reales y obligaciones fiscales. 100% online.",
  alternates: {
    canonical: "https://openllcusa.com/crear-llc-usa",
  },
  keywords: [
    "crear LLC en Estados Unidos",
    "abrir LLC en USA",
    "formar LLC no residente",
    "registrar empresa en USA online",
    "LLC para extranjeros",
    "LLC sin visa sin SSN",
  ],
  openGraph: {
    title: "Cómo Crear una LLC en EE.UU. siendo No Residente (Guía 2026)",
    description:
      "Todo lo que necesitas saber para crear tu LLC en Estados Unidos desde cualquier país hispanohablante. Sin visa, sin SSN. Proceso 100% remoto.",
    type: "article",
    url: "https://openllcusa.com/crear-llc-usa",
    images: [
      {
        url: "https://openllcusa.com/images/hero.webp",
        width: 1200,
        height: 630,
        alt: "Crear LLC en Estados Unidos — Open LLC USA",
      },
    ],
  },
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cómo Crear una LLC en Estados Unidos siendo No Residente",
  description: "Proceso completo para registrar una LLC en EE.UU. desde España o Latinoamérica sin visa ni SSN.",
  totalTime: "P7D",
  estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "449" },
  step: [
    { "@type": "HowToStep", position: 1, name: "Elige el estado donde registrar tu LLC", text: "Wyoming es la opción más popular para no residentes por sus bajos costes anuales (~$62) y alta privacidad." },
    { "@type": "HowToStep", position: 2, name: "Elige el nombre de tu LLC", text: "El nombre debe ser único en el estado y terminar en LLC o Limited Liability Company." },
    { "@type": "HowToStep", position: 3, name: "Contratar un agente registrado", text: "Toda LLC necesita un agente registrado en el estado. Lo incluimos en todos nuestros planes." },
    { "@type": "HowToStep", position: 4, name: "Presentar el Articles of Organization", text: "Documento oficial de constitución que registramos ante el estado en tu nombre en 24-48 horas." },
    { "@type": "HowToStep", position: 5, name: "Obtener el EIN", text: "El EIN es el NIF de tu empresa en EE.UU. Lo tramitamos vía Form SS-4 sin que necesites SSN." },
    { "@type": "HowToStep", position: 6, name: "Recibir tu documentación completa", text: "Certificate of Formation, Operating Agreement, EIN y resolución bancaria en tu email en 5-7 días." },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Puedo crear una LLC en EE.UU. sin ser residente ni ciudadano americano?",
      acceptedAnswer: { "@type": "Answer", text: "Sí. Los 50 estados permiten que ciudadanos extranjeros sean propietarios de una LLC. Solo necesitas tu pasaporte vigente y una dirección de contacto." },
    },
    {
      "@type": "Question",
      name: "¿Cuánto cuesta crear una LLC en Estados Unidos?",
      acceptedAnswer: { "@type": "Answer", text: "Con Open LLC USA los planes empiezan desde $349 + tasa estatal (Wyoming ~$100). Sin costes ocultos." },
    },
    {
      "@type": "Question",
      name: "¿Qué es mejor: Wyoming o Delaware para una LLC siendo extranjero?",
      acceptedAnswer: { "@type": "Answer", text: "Para negocios digitales, Wyoming es la mejor opción: tasa anual mínima ($62), alta privacidad y sin impuesto estatal. Delaware es preferible si buscas inversores." },
    },
    {
      "@type": "Question",
      name: "¿Cuánto tiempo tarda crear una LLC?",
      acceptedAnswer: { "@type": "Answer", text: "En Open LLC USA el proceso completo tarda entre 5 y 7 días hábiles." },
    },
    {
      "@type": "Question",
      name: "¿Necesito pagar impuestos en EE.UU. con mi LLC si soy extranjero?",
      acceptedAnswer: { "@type": "Answer", text: "Normalmente no pagas impuesto federal si no tienes presencia física en EE.UU. Sí debes presentar el Formulario 5472 + 1120. No hacerlo implica multa de $25.000." },
    },
    {
      "@type": "Question",
      name: "¿Puedo abrir una cuenta bancaria en EE.UU. para mi LLC sin viajar?",
      acceptedAnswer: { "@type": "Answer", text: "Sí. Mercury, Relay o Wise Business permiten abrir cuentas 100% online para LLCs de no residentes." },
    },
  ],
}

const STEPS = [
  { paso: 1, titulo: "Eliges tu plan y nos das tus datos", tiempo: "Día 1", desc: "Rellenas un formulario sencillo con el nombre de tu LLC, el estado elegido y tus datos. Solo necesitas tu pasaporte.", nota: "Verificamos la disponibilidad del nombre antes de proceder." },
  { paso: 2, titulo: "Registramos tu LLC en el estado", tiempo: "Días 1-2", desc: "Presentamos los Articles of Organization ante el Secretary of State del estado elegido. En Wyoming tarda 24-48 horas.", nota: null },
  { paso: 3, titulo: "Tramitamos tu EIN (número fiscal)", tiempo: "Días 2-5", desc: "Enviamos el Form SS-4 al IRS para obtener tu EIN. Sin EIN no puedes abrir cuentas bancarias. Lo conseguimos sin SSN.", nota: "El IRS tarda entre 1 y 3 días hábiles en asignar el EIN por fax." },
  { paso: 4, titulo: "Preparamos todos tus documentos", tiempo: "Días 3-5", desc: "Redactamos el Operating Agreement, la resolución bancaria y el paquete de documentos para abrir cuentas y firmar contratos.", nota: null },
  { paso: 5, titulo: "Recibes tu LLC lista para operar", tiempo: "Días 5-7", desc: "Toda la documentación llega a tu email: Certificate of Formation, EIN, Operating Agreement y resolución bancaria.", nota: "A partir de aquí puedes abrir tu cuenta en Mercury o Wise Business de forma inmediata." },
]

const ESTADOS = [
  {
    estado: "Wyoming",
    emoji: "🏔️",
    badge: "Nuestra recomendación",
    badgeColor: "bg-green-100 text-green-800",
    border: "border-green-300 ring-2 ring-green-200",
    ventajas: ["Tasa anual mínima: ~$62/año", "Alta privacidad (socios no públicos)", "Sin impuesto estatal sobre la renta", "Sin capital mínimo requerido", "Proceso de registro muy ágil"],
    ideal: "Negocios digitales, SaaS, consultoría, e-commerce, freelancers",
  },
  {
    estado: "Delaware",
    emoji: "🏙️",
    badge: "Para startups con inversores",
    badgeColor: "bg-blue-100 text-blue-800",
    border: "border-blue-200",
    ventajas: ["Preferido por fondos de capital riesgo", "Court of Chancery especializado", "Reconocimiento internacional", "Flexibilidad societaria", "Ideal si buscas rondas de financiación"],
    ideal: "Startups que buscan inversión externa o rondas de capital riesgo",
  },
  {
    estado: "Nuevo México",
    emoji: "🌵",
    badge: "Máximo anonimato",
    badgeColor: "bg-purple-100 text-purple-800",
    border: "border-purple-200",
    ventajas: ["Sin reporte anual obligatorio", "Coste de registro muy bajo", "Mayor privacidad del país", "Proceso simple", "Sin impuesto de franquicia"],
    ideal: "Quienes priorizan la privacidad absoluta sobre el resto de factores",
  },
]

const PLANES = [
  {
    plan: "Starter",
    precio: "$349",
    tasa: "+ ~$100 tasa estatal",
    desc: "Para emprendedores que arrancan y necesitan su LLC lista para operar.",
    incluye: ["Formación de LLC", "EIN (número fiscal)", "Operating Agreement", "Agente Registrado 1er año", "Resolución bancaria"],
    href: "/paquetes/starter/onboarding",
    destacado: false,
  },
  {
    plan: "Professional",
    precio: "$499",
    tasa: "+ ~$100 tasa estatal",
    desc: "El más completo para quienes también necesitan abrir su cuenta bancaria.",
    incluye: ["Todo lo del Starter", "Apertura cuenta Mercury o Wise", "Sesión 1:1 con especialista", "Soporte prioritario 30 días", "BOI Report incluido"],
    href: "/paquetes/professional/onboarding",
    destacado: true,
  },
  {
    plan: "Business",
    precio: "$849",
    tasa: "+ ~$100 tasa estatal",
    desc: "Solución 360° para tenerlo todo en orden desde el primer día.",
    incluye: ["Todo lo del Professional", "Formulario 5472 + 1120", "Dirección física en EE.UU.", "Gestión primer año completo", "Consultoría fiscal incluida"],
    href: "/paquetes/business/onboarding",
    destacado: false,
  },
]

const FAQS = [
  { q: "¿Puedo crear una LLC en EE.UU. sin ser residente ni ciudadano americano?", a: "Sí. Los 50 estados de EE.UU. permiten que ciudadanos extranjeros sean propietarios de una LLC. Solo necesitas tu pasaporte vigente y una dirección de contacto." },
  { q: "¿Cuánto tarda el proceso completo?", a: "En Open LLC USA el proceso completo tarda entre 5 y 7 días hábiles: 1-2 días para el registro estatal y 3-5 días adicionales para el EIN del IRS." },
  { q: "¿Necesito contratar un abogado en EE.UU.?", a: "No. Para crear una LLC estándar no necesitas abogado. Nosotros nos encargamos de todo el proceso legal y administrativo." },
  { q: "¿Puedo tener varios socios en mi LLC siendo todos extranjeros?", a: "Sí. Una LLC puede tener uno o múltiples socios (members), todos extranjeros. Cada socio aparece en el Operating Agreement con su porcentaje de participación." },
  { q: "¿Qué pasa si no presento el Formulario 5472?", a: "El IRS impone una multa automática de $25.000 por cada año fiscal en que no se presenta el 5472 siendo obligatorio. Se aplica aunque la LLC no tenga ingresos." },
  { q: "¿Puedo abrir una cuenta bancaria en EE.UU. para mi LLC sin viajar?", a: "Sí. Mercury, Relay o Wise Business abren cuentas 100% online para LLCs de no residentes con pasaporte y documentación de la LLC." },
  { q: "¿Puedo disolver la LLC si ya no la necesito?", a: "Sí. El proceso de disolución se hace online ante el estado. Es importante hacerlo correctamente para evitar tasas anuales futuras." },
]

export default function CrearLLCUSA() {
  return (
    <main className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#040D1A] via-[#0C2047] to-[#1D4ED8] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full">
              🏛️ Guía Definitiva 2026
            </span>
            <span className="inline-flex items-center gap-1.5 bg-green-500/20 border border-green-400/30 text-green-200 text-xs font-semibold px-3 py-1.5 rounded-full">
              ✅ Sin visa · Sin SSN · 100% online
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-white">
            Cómo Crear una LLC<br className="hidden md:block" /> en Estados Unidos
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl leading-relaxed">
            La guía más completa para emprendedores hispanohablantes: proceso paso a paso, estados recomendados, costes reales y obligaciones fiscales. Listo en{" "}
            <strong className="text-white">5–7 días hábiles</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/agendar" className="inline-block bg-white text-[#1D4ED8] font-bold text-base px-8 py-4 rounded-full shadow-xl hover:bg-blue-50 transition-all hover:scale-105">
              📅 Hablar con un especialista gratis →
            </Link>
            <Link href="/precios" className="inline-block border-2 border-white/40 text-white font-semibold text-base px-8 py-4 rounded-full hover:bg-white/10 transition-all">
              Ver planes desde $349 →
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-8 mt-10 pt-8 border-t border-white/10">
            {[
              { num: "+500", label: "LLCs formadas" },
              { num: "5–7", label: "Días hábiles" },
              { num: "$349", label: "Desde (+ tasa estatal)" },
              { num: "4 países", label: "España, Mx, Ar, Co" },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-white">{num}</div>
                <div className="text-xs text-blue-200">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TABLA DE CONTENIDOS ── */}
      <section className="bg-slate-50 border-b border-slate-200 py-5 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">En esta guía</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {[
              { href: "#que-es-llc", label: "¿Qué es una LLC?" },
              { href: "#ventajas", label: "Ventajas para extranjeros" },
              { href: "#mejor-estado", label: "Wyoming vs Delaware" },
              { href: "#como-crear", label: "Proceso paso a paso" },
              { href: "#costes", label: "Costes reales" },
              { href: "#impuestos", label: "Impuestos" },
              { href: "#faq", label: "Preguntas frecuentes" },
            ].map(({ href, label }) => (
              <a key={href} href={href} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-20">

        {/* ── QUE ES LLC ── */}
        <section id="que-es-llc">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span>🏛️</span> ¿Qué es una LLC en Estados Unidos?
          </h2>
          <p className="text-slate-700 leading-relaxed text-lg mb-6">
            Una <strong>LLC (Limited Liability Company)</strong> es la estructura empresarial más popular de EE.UU. Combina la protección de responsabilidad limitada de una sociedad con la flexibilidad fiscal de una empresa individual. Para un emprendedor extranjero, es la puerta de entrada más práctica al mercado americano.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl mb-8">
            <p className="text-slate-700 font-medium">
              💡 <strong>Dato clave:</strong> Los 50 estados de EE.UU. permiten que ciudadanos extranjeros sean dueños de una LLC. No necesitas ser residente, tener visa ni SSN.
            </p>
          </div>
          <p className="text-slate-700 leading-relaxed">
            A diferencia de lo que muchos creen, crear una LLC siendo extranjero no es más complicado que para un ciudadano americano. El proceso se hace completamente online. Los únicos requisitos básicos son: <strong>pasaporte vigente</strong> y <strong>una dirección de contacto</strong> (puede ser tu dirección en tu país).
          </p>
        </section>

        {/* ── VENTAJAS ── */}
        <section id="ventajas">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <span>🚀</span> Por qué una LLC en EE.UU. como extranjero
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "💳", title: "Acceso a Stripe, PayPal y plataformas globales", desc: "Con una LLC americana puedes activar Stripe US, PayPal Business, Amazon Seller Central y cualquier plataforma de pago global sin restricciones geográficas." },
              { icon: "🏦", title: "Cuenta bancaria en dólares 100% online", desc: "Mercury, Relay o Wise Business abren cuentas para tu LLC sin que tengas que poner un pie en EE.UU. Recibes routing number y account number reales." },
              { icon: "🛡️", title: "Protección de tu patrimonio personal", desc: "La responsabilidad limitada significa que, si tu empresa tiene deudas o problemas legales, tu patrimonio personal queda protegido." },
              { icon: "📊", title: "Ventaja fiscal como extranjero", desc: "Si no tienes presencia física ni empleados en EE.UU., normalmente no tributas el impuesto federal sobre la renta en EE.UU." },
              { icon: "🌍", title: "Credibilidad internacional inmediata", desc: "Una empresa americana proyecta confianza a nivel global. Tus clientes, proveedores e inversores lo perciben desde el primer momento." },
              { icon: "📦", title: "Ideal para e-commerce, Amazon FBA y negocios digitales", desc: "Para vender en Amazon USA, Shopify o marketplaces internacionales, una LLC es el vehículo estándar que usan miles de vendedores hispanos." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── MEJOR ESTADO ── */}
        <section id="mejor-estado">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span>🗺️</span> ¿En qué estado crear tu LLC? Wyoming vs Delaware
          </h2>
          <p className="text-slate-700 leading-relaxed mb-8">
            No necesitas registrar tu LLC donde vives. Para no residentes extranjeros, hay tres opciones principales:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {ESTADOS.map(({ estado, emoji, badge, badgeColor, border, ventajas, ideal }) => (
              <div key={estado} className={`bg-white border-2 rounded-2xl p-6 shadow-sm ${border}`}>
                <div className="text-3xl mb-2">{emoji}</div>
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${badgeColor}`}>{badge}</span>
                <h3 className="text-xl font-bold text-slate-800 mb-4">{estado}</h3>
                <ul className="space-y-2 mb-6">
                  {ventajas.map((v) => (
                    <li key={v} className="flex gap-2 text-slate-600 text-sm">
                      <span className="text-green-500 font-bold flex-shrink-0">✓</span>
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Ideal para:</p>
                  <p className="text-xs text-slate-600">{ideal}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mt-8">
            <p className="text-amber-900 text-sm">
              ⚠️ <strong>Evita California y Florida</strong> si no tienes presencia física allí. California cobra mínimo $800/año en franchise tax independientemente de los ingresos.
            </p>
          </div>
        </section>

        {/* ── PROCESO ── */}
        <section id="como-crear">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <span>📋</span> Proceso para crear tu LLC paso a paso
          </h2>
          <div className="space-y-4">
            {STEPS.map(({ paso, titulo, tiempo, desc, nota }) => (
              <div key={paso} className="flex gap-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-blue-200 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#7C3AED] text-white font-bold text-sm flex items-center justify-center">
                    {paso}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="font-bold text-slate-800">{titulo}</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-full">{tiempo}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
                  {nota && <p className="text-slate-400 text-xs mt-2 italic">ℹ️ {nota}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── COSTES ── */}
        <section id="costes">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <span>💰</span> Cuánto cuesta crear una LLC en EE.UU.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PLANES.map(({ plan, precio, tasa, desc, incluye, href, destacado }) => (
              <div key={plan} className={`relative bg-white rounded-2xl p-6 border-2 shadow-sm flex flex-col ${destacado ? "border-blue-500 ring-4 ring-blue-100" : "border-slate-200"}`}>
                {destacado && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">⭐ Más popular</span>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="font-bold text-slate-800 text-lg">{plan}</h3>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1">{precio}</div>
                  <div className="text-xs text-slate-400">{tasa}</div>
                  <p className="text-slate-600 text-sm mt-3 leading-relaxed">{desc}</p>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {incluye.map((item) => (
                    <li key={item} className="flex gap-2 text-slate-700 text-sm">
                      <span className="text-green-500 font-bold flex-shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href={href} className={`block text-center font-bold py-3 px-6 rounded-full transition-all ${destacado ? "bg-gradient-to-r from-[#1D4ED8] to-[#7C3AED] text-white hover:opacity-90 shadow-lg" : "bg-slate-100 text-slate-800 hover:bg-slate-200"}`}>
                  Empezar con {plan} →
                </Link>
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-xs text-center mt-4">* La tasa estatal se abona directamente al gobierno del estado. Sin costes ocultos.</p>
        </section>

        {/* ── IMPUESTOS ── */}
        <section id="impuestos">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span>🧾</span> Impuestos de tu LLC siendo extranjero
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h3 className="font-bold text-green-800 mb-4">✅ Lo que normalmente NO pagas</h3>
              <ul className="space-y-2">
                {["Impuesto federal sobre la renta en EE.UU.", "Impuesto estatal (Wyoming, Nuevo México)", "IVA / Sales Tax (si vendes fuera de EE.UU.)", "Self-Employment Tax"].map((item) => (
                  <li key={item} className="flex gap-2 text-green-700 text-sm"><span className="font-bold">✓</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <h3 className="font-bold text-red-800 mb-4">⚠️ Lo que SÍ debes presentar</h3>
              <ul className="space-y-2">
                {["Formulario 5472 + 1120 pro forma — multa $25.000", "BOI Report (FinCEN) — multa $500/día", "Reporte anual estatal — varía por estado", "FBAR si la cuenta tiene >$10.000 (algunos casos)"].map((item) => (
                  <li key={item} className="flex gap-2 text-red-700 text-sm"><span className="font-bold">!</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-slate-900 text-white rounded-2xl p-8">
            <h3 className="font-bold text-xl mb-3">¿Y en mi país? ¿Tengo que declarar la LLC?</h3>
            <p className="text-slate-300 text-sm mb-6">Aunque no pagues impuestos en EE.UU., como propietario de la LLC tributas personalmente en tu país de residencia fiscal por los beneficios que recibes:</p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {[
                { pais: "🇪🇸 España", desc: "Los rendimientos de la LLC tributan en IRPF. Posible transparencia fiscal internacional (TFI) si la LLC no tiene actividad real." },
                { pais: "🇲🇽 México", desc: "Los dividendos o ingresos de la LLC se declaran en ISR. Convenio fiscal EE.UU.-México aplicable." },
                { pais: "🇦🇷 Argentina", desc: "Los ingresos del exterior deben declararse en AFIP. La LLC puede considerarse bien del exterior (Bienes Personales)." },
                { pais: "🇨🇴 Colombia", desc: "Los ingresos de fuente extranjera tributan en Colombia. Coordina siempre con un contador local." },
              ].map(({ pais, desc }) => (
                <div key={pais} className="bg-white/10 rounded-xl p-4">
                  <div className="font-semibold text-white mb-1">{pais}</div>
                  <p className="text-slate-300 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <span>❓</span> Preguntas frecuentes sobre crear una LLC
          </h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <details key={i} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-50 transition-colors">
                  <span className="font-bold text-lg text-slate-800 pr-4">{q}</span>
                  <span className="text-slate-400 text-2xl font-light flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-slate-600 leading-relaxed text-base">{a}</p>
                </div>
              </details>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/faq" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline">Ver todas las preguntas frecuentes →</Link>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section>
          <div className="bg-gradient-to-br from-[#040D1A] via-[#0C2047] to-[#1D4ED8] rounded-3xl p-10 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">¿Listo para crear tu LLC en EE.UU.?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              +500 emprendedores hispanos ya confían en Open LLC USA. Proceso 100% remoto, en español, con soporte real durante todo el proceso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/agendar" className="bg-white text-[#1D4ED8] font-bold px-10 py-4 rounded-full shadow-xl hover:bg-blue-50 transition-all hover:scale-105">
                📅 Agendar llamada gratuita
              </Link>
              <Link href="/precios" className="border-2 border-white/40 text-white font-bold px-10 py-4 rounded-full hover:bg-white/10 transition-all">
                Ver planes y precios →
              </Link>
            </div>
          </div>
        </section>

        {/* ── INTERNAL LINKS ── */}
        <section className="border-t border-slate-200 pt-8">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Artículos relacionados</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { href: "/faq", label: "Preguntas frecuentes sobre LLC" },
              { href: "/precios", label: "Planes y precios de formación" },
              { href: "/guia-llc-extranjeros", label: "Guía: LLC en 7 días" },
              { href: "/calculadora-fiscal", label: "Calculadora fiscal LLC" },
              { href: "/contacto", label: "Hablar con un especialista" },
              { href: "/blog", label: "Blog: guías y recursos" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                <span>→</span><span>{label}</span>
              </Link>
            ))}
          </div>
        </section>

      </div>

      {/* ── SCHEMAS JSON-LD ── */}
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  )
}
