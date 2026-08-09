import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Guía Gratuita: Crea tu LLC en EE.UU. en 7 Días | Open LLC USA',
  description: 'Guía completa paso a paso para crear tu LLC en Estados Unidos siendo extranjero. Sin SSN, sin visa, desde cualquier país hispanohablante.',
}

export default function GuiaLlcExtranjeros() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0C2047] to-[#1D4ED8] text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            📘 Guía Gratuita · Open LLC USA
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
            Crea tu LLC en EE.UU.<br className="hidden md:block" /> en 7 Días
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            La guía más completa para emprendedores hispanohablantes que quieren crear una empresa en Estados Unidos sin visa, sin SSN y desde cualquier país del mundo.
          </p>
          <Link
            href="/agendar"
            className="inline-block bg-white text-[#1D4ED8] font-bold text-base px-8 py-4 rounded-full shadow-lg hover:bg-blue-50 transition-colors"
          >
            📅 Hablar con un especialista gratis →
          </Link>
        </div>
      </section>

      {/* Contenido de la guía */}
      <section className="max-w-3xl mx-auto px-4 py-16">

        {/* Intro */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl mb-12">
          <p className="text-slate-700 text-base leading-relaxed">
            <strong>Antes de empezar:</strong> Esta guía está pensada para emprendedores latinoamericanos y españoles que quieren operar globalmente con una estructura legal en EE.UU. No necesitas residencia, visa, ni número de seguridad social (SSN). Solo necesitas tu pasaporte y ganas de crecer.
          </p>
        </div>

        {/* Día 1 */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-gradient-to-br from-[#1D4ED8] to-[#7C3AED] text-white text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">1</span>
            <h2 className="text-2xl font-bold text-slate-800">¿Por qué una LLC en EE.UU.?</h2>
          </div>
          <div className="pl-14">
            <p className="text-slate-600 leading-relaxed mb-4">
              Una LLC (<em>Limited Liability Company</em>) es la estructura empresarial más popular en EE.UU. por su sencillez y flexibilidad. Para un emprendedor extranjero ofrece ventajas únicas:
            </p>
            <ul className="space-y-3 text-slate-600">
              <li className="flex gap-3"><span className="text-green-500 font-bold flex-shrink-0">✅</span><span><strong>Credibilidad global:</strong> Una empresa americana abre puertas con Stripe, PayPal, clientes internacionales y plataformas como Amazon o Shopify.</span></li>
              <li className="flex gap-3"><span className="text-green-500 font-bold flex-shrink-0">✅</span><span><strong>Separación de patrimonio:</strong> Tu patrimonio personal queda protegido de las deudas de la empresa.</span></li>
              <li className="flex gap-3"><span className="text-green-500 font-bold flex-shrink-0">✅</span><span><strong>Cero impuestos en EE.UU.:</strong> Si no tienes presencia física ni empleados en USA, como extranjero generalmente no tributas en EE.UU.</span></li>
              <li className="flex gap-3"><span className="text-green-500 font-bold flex-shrink-0">✅</span><span><strong>Cuenta bancaria americana:</strong> Con tu LLC puedes abrir cuentas en Mercury, Relay o Wise Business.</span></li>
            </ul>
          </div>
        </div>

        {/* Día 2 */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-gradient-to-br from-[#1D4ED8] to-[#7C3AED] text-white text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">2</span>
            <h2 className="text-2xl font-bold text-slate-800">Elige el estado: Wyoming, Delaware o Nuevo México</h2>
          </div>
          <div className="pl-14">
            <p className="text-slate-600 leading-relaxed mb-6">El estado donde registres tu LLC afecta los costes anuales, la privacidad y la percepción de los inversores.</p>
            <div className="grid gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-2">🏔️ Wyoming — Nuestra recomendación habitual</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Tasa anual mínima de solo $62. Alta privacidad (los socios no aparecen en registros públicos). Sin impuesto estatal sobre la renta. Perfecto para negocios digitales, consultoría y e-commerce.</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-2">🏙️ Delaware — Para startups con inversores</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Preferido por fondos de capital riesgo e inversores ángeles. Tribunal de Cancillería especializado en disputas empresariales. Tasas anuales más altas (~$300/año mínimo). Recomendable si buscas rondas de financiación.</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-2">🌵 Nuevo México — Máximo anonimato</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Uno de los estados con mayor privacidad del país. Sin tasas anuales obligatorias. Ideal si la confidencialidad es tu prioridad absoluta.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Día 3 */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-gradient-to-br from-[#1D4ED8] to-[#7C3AED] text-white text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">3</span>
            <h2 className="text-2xl font-bold text-slate-800">Qué documentos necesitas (spoiler: solo tu pasaporte)</h2>
          </div>
          <div className="pl-14">
            <p className="text-slate-600 leading-relaxed mb-4">El proceso es más sencillo de lo que imaginas. Esto es todo lo que necesitas preparar:</p>
            <ul className="space-y-3 text-slate-600">
              <li className="flex gap-3"><span className="text-blue-500 font-bold flex-shrink-0">📄</span><span><strong>Pasaporte vigente</strong> (foto de las páginas de datos)</span></li>
              <li className="flex gap-3"><span className="text-blue-500 font-bold flex-shrink-0">📍</span><span><strong>Dirección física</strong> (la tuya en tu país, no necesitas dirección americana)</span></li>
              <li className="flex gap-3"><span className="text-blue-500 font-bold flex-shrink-0">✉️</span><span><strong>Email activo</strong> para recibir toda la documentación oficial</span></li>
              <li className="flex gap-3"><span className="text-blue-500 font-bold flex-shrink-0">💳</span><span><strong>Tarjeta de pago</strong> para las tasas del estado y los servicios de formación</span></li>
            </ul>
            <p className="text-slate-500 text-sm mt-4 italic">No necesitas SSN, ITIN, visa, ser residente ni viajar a EE.UU.</p>
          </div>
        </div>

        {/* Días 4-7 */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-gradient-to-br from-[#1D4ED8] to-[#7C3AED] text-white text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">4-7</span>
            <h2 className="text-2xl font-bold text-slate-800">El proceso de formación: qué ocurre cada día</h2>
          </div>
          <div className="pl-14 space-y-4">
            {[
              { dia: 'Día 1', texto: 'Eliges tu paquete y nos das tus datos. Nuestro equipo verifica la disponibilidad del nombre de tu LLC.' },
              { dia: 'Días 2-3', texto: 'Registramos tu LLC en el estado elegido y tramitamos tu EIN (número fiscal para la empresa, equivalente al NIF).' },
              { dia: 'Días 4-5', texto: 'Preparamos el Operating Agreement (acuerdo operativo), la resolución bancaria y los documentos que necesitarás para abrir cuentas.' },
              { dia: 'Días 6-7', texto: 'Recibes toda la documentación en tu email. Tu LLC está lista para operar, facturar y abrir cuentas.' },
            ].map(({ dia, texto }) => (
              <div key={dia} className="flex gap-4 bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                <span className="text-blue-600 font-bold text-sm flex-shrink-0 pt-0.5">{dia}</span>
                <p className="text-slate-600 text-sm leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Costes */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-gradient-to-br from-[#1D4ED8] to-[#7C3AED] text-white text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">💰</span>
            <h2 className="text-2xl font-bold text-slate-800">Costes reales y transparentes</h2>
          </div>
          <div className="pl-14">
            <div className="grid gap-4">
              {[
                { plan: 'Starter', precio: '$349 + tasa estatal', desc: 'LLC, EIN y documentos básicos para bancos y clientes.', href: '/paquetes/starter/onboarding' },
                { plan: 'Professional', precio: '$499 + tasa estatal', desc: 'Todo lo anterior + apertura de cuenta bancaria y sesión 1:1 con experto.', href: '/paquetes/professional/onboarding' },
                { plan: 'Business', precio: '$849 + tasa estatal', desc: 'Solución completa: formularios fiscales, dirección física real y BOI Report incluidos.', href: '/paquetes/business/onboarding' },
              ].map(({ plan, precio, desc, href }) => (
                <div key={plan} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="font-bold text-slate-800">{plan}</div>
                    <div className="text-blue-600 font-semibold text-sm">{precio}</div>
                    <div className="text-slate-500 text-sm mt-1">{desc}</div>
                  </div>
                  <Link href={href} className="bg-gradient-to-r from-[#1D4ED8] to-[#7C3AED] text-white text-sm font-bold px-5 py-2.5 rounded-full whitespace-nowrap text-center hover:opacity-90 transition-opacity">
                    Empezar →
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-xs mt-4">* La tasa estatal de Wyoming es de ~$100 la primera vez. Sin sorpresas ocultas.</p>
          </div>
        </div>

        {/* Errores comunes */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-gradient-to-br from-[#1D4ED8] to-[#7C3AED] text-white text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">⚠️</span>
            <h2 className="text-2xl font-bold text-slate-800">Los 5 errores más comunes que debes evitar</h2>
          </div>
          <div className="pl-14 space-y-3">
            {[
              'Registrar la LLC en el estado equivocado (ej. Florida o California si no vives allí — las tasas son altísimas).',
              'No obtener el EIN. Sin él no puedes abrir cuentas bancarias ni firmar contratos americanos.',
              'Olvidar presentar el BOI Report (FinCEN). Las multas son de $500 por día de demora.',
              'No presentar el Formulario 5472 + 1120 al IRS. La multa automática es de $25,000.',
              'Mezclar el dinero personal con el de la empresa. Abre una cuenta bancaria separada desde el primer día.',
            ].map((error, i) => (
              <div key={i} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
                <span className="text-red-500 font-bold flex-shrink-0">✗</span>
                <span>{error}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="bg-gradient-to-br from-[#0C2047] to-[#1D4ED8] rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold text-white mb-3">¿Listo para crear tu LLC?</h2>
          <p className="text-blue-100 mb-6">Nuestro equipo de especialistas hispanohablantes puede acompañarte en todo el proceso. Primera consulta totalmente gratuita.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/agendar"
              className="bg-white text-[#1D4ED8] font-bold px-8 py-3.5 rounded-full hover:bg-blue-50 transition-colors"
            >
              📅 Agendar llamada gratuita
            </Link>
            <Link
              href="/precios"
              className="border-2 border-white/50 text-white font-bold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors"
            >
              Ver planes y precios
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
