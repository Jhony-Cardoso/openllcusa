// app/faq/page.tsx
import type { Metadata } from 'next'

type FAQItem = {
  question: string
  answer: string
  category: 'general' | 'fiscal' | 'bancaria' | 'operativa'
}

const faqs: FAQItem[] = [
  {
    category: 'general',
    question: '¿Qué es una LLC en Estados Unidos y por qué es interesante para no residentes?',
    answer:
      'Una LLC (Limited Liability Company) es una sociedad de responsabilidad limitada que combina la flexibilidad de una sociedad de personas con la protección patrimonial de una corporación. Para no residentes es especialmente atractiva porque permite vender online, facturar en dólares, proteger tu patrimonio personal y operar globalmente sin necesidad de mudarte a Estados Unidos.'
  },
  {
    category: 'general',
    question: '¿Puedo crear una LLC en Estados Unidos si vivo en Latinoamérica o en España?',
    answer:
      'Sí. No necesitas ser ciudadano ni residente de Estados Unidos para constituir una LLC. La mayoría de los estados permiten que una LLC tenga socios (members) 100 % extranjeros, siempre que cumplas con las normas fiscales y de cumplimiento del estado donde se forma la compañía.'
  },
  {
    category: 'general',
    question: '¿En qué estado me conviene abrir mi LLC si soy no residente?',
    answer:
      'Los estados más habituales para no residentes son Wyoming, Delaware y Florida, porque ofrecen buena protección de privacidad, bajos costos anuales y procesos ágiles. La elección óptima depende de si venderás servicios digitales, e‑commerce, si tendrás socios y si necesitas presencia física o no.'
  },
  {
    category: 'general',
    question: '¿Necesito viajar a Estados Unidos para crear mi LLC?',
    answer:
      'No. El proceso completo de formación de la LLC, obtención del EIN y apertura de cuenta en fintechs o bancos digitales se puede hacer de forma remota con un agente registrado y un proveedor especializado. Solo en casos concretos de banca tradicional pueden pedir presencia física.'
  },
  {
    category: 'fiscal',
    question: '¿La LLC paga impuestos en Estados Unidos si soy no residente?',
    answer:
      'Una LLC de un solo socio no residente suele tratarse como entidad “disregarded” o sociedad de personas y, en muchos casos, no paga impuesto federal estadounidense sobre ingresos de fuente completamente extranjera. Sin embargo, puede haber obligaciones de reporte (formularios informativos) y posibles impuestos estatales según el tipo de actividad.'
  },
  {
    category: 'fiscal',
    question: '¿Tendré que presentar declaraciones ante el IRS si tengo una LLC siendo no residente?',
    answer:
      'Aunque no debas impuesto federal, normalmente sí tendrás obligaciones de reporte ante el IRS, como los formularios 5472/1120 para LLCs de un solo socio extranjero, y otros informes si mantienes cuentas en el exterior. Un error común es pensar que “no pago impuestos, entonces no declaro nada”, lo cual puede generar multas importantes.'
  },
  {
    category: 'fiscal',
    question: '¿Necesito un ITIN o SSN para operar mi LLC?',
    answer:
      'Para formar la LLC y solicitar el EIN no es obligatorio tener SSN o ITIN. Sin embargo, para ciertos bancos tradicionales, procesadores de pago o para presentar declaraciones personales puede ser recomendable u obligatorio tramitar un ITIN como persona física no residente.'
  },
  {
    category: 'fiscal',
    question: '¿Dónde pago impuestos si mi LLC está en Estados Unidos pero yo vivo en otro país?',
    answer:
      'En general, tú tributas personalmente en tu país de residencia fiscal por las ganancias que recibes de la LLC, y la LLC solo puede quedar sujeta a impuestos en Estados Unidos si genera “effectively connected income” o ingresos de fuente estadounidense. Es clave coordinarlo con un asesor fiscal que conozca tanto la normativa de tu país como la de Estados Unidos.'
  },
  {
    category: 'bancaria',
    question: '¿Puedo abrir una cuenta bancaria para mi LLC sin viajar a Estados Unidos?',
    answer:
      'Sí. Muchas fintechs y bancos online permiten abrir cuentas para LLCs de no residentes mediante verificación remota de identidad y documentación de la compañía. En algunos casos se trata de cuentas “US-based” con número de cuenta y routing number, aptas para cobrar en plataformas como Stripe, PayPal o marketplaces.'
  },
  {
    category: 'bancaria',
    question: '¿Qué documentos bancarios me pedirán como no residente con una LLC?',
    answer:
      'Lo habitual es que soliciten el certificado de formación de la LLC, el Operating Agreement, el EIN emitido por el IRS, un documento de identidad vigente (pasaporte) y prueba de domicilio del socio o socios. Algunos bancos pueden requerir información adicional sobre el negocio para cumplir con normas AML y KYC.'
  },
  {
    category: 'operativa',
    question: '¿Qué costos recurrentes tiene una LLC para no residentes?',
    answer:
      'Los principales costos recurrentes suelen ser la renovación anual del estado (annual report o franchise tax, según el estado), el servicio de agente registrado, la contabilidad y preparación de reportes fiscales, y posibles licencias específicas si tu actividad lo requiere. En estados como Wyoming los costos anuales suelen ser muy competitivos.'
  },
  {
    category: 'operativa',
    question: '¿Qué debo hacer cada año para mantener mi LLC en regla?',
    answer:
      'Debes renovar puntualmente tu LLC en el estado donde esté registrada, mantener un agente registrado activo, conservar una contabilidad ordenada, presentar los reportes fiscales federales y estatales que correspondan y actualizar cualquier cambio de socios o dirección cuando sea necesario.'
  },
  {
    category: 'operativa',
    question: '¿Puedo usar mi LLC para vender en Amazon, Shopify u otras plataformas?',
    answer:
      'Sí. Una LLC en Estados Unidos es una de las estructuras más utilizadas para vender en Amazon FBA, Shopify y otros marketplaces globales, porque facilita la integración con pasarelas de pago, mejora la percepción de clientes internacionales y permite facturar en dólares de forma profesional.'
  },
  {
    category: 'operativa',
    question: '¿Puedo tener socios en mi LLC si somos todos no residentes?',
    answer:
      'Sí. Una LLC puede tener uno o varios socios, y todos pueden ser no residentes siempre que se declaren correctamente las participaciones y se cumplan las obligaciones fiscales individuales. Es importante definir bien el porcentaje de cada socio y reflejarlo en el Operating Agreement desde el inicio.'
  }
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
}

export const metadata: Metadata = {
  title: 'Preguntas frecuentes sobre LLC en Estados Unidos para no residentes | Open LLC USA',
  description:
    'Resolvemos las dudas más frecuentes sobre cómo crear una LLC en Estados Unidos siendo no residente: impuestos, banca, requisitos legales y mantenimiento anual.',
  keywords: [
    'LLC en Estados Unidos',
    'LLC para no residentes',
    'crear LLC desde Latinoamérica',
    'formar LLC en USA sin ser residente',
    'impuestos LLC no residentes',
    'abrir cuenta bancaria LLC Estados Unidos',
    'LLC para argentinos',
    'LLC para españoles',
    'company formation USA non resident',
    'abrir empresa en Estados Unidos online'
  ],
  openGraph: {
    title: 'Preguntas frecuentes sobre LLC para no residentes | Open LLC USA',
    description:
      'Guía de preguntas frecuentes para entender cómo crear, mantener y optimizar una LLC en Estados Unidos si vives fuera del país.',
    type: 'website'
  }
}

function groupByCategory(category: FAQItem['category']) {
  return faqs.filter((faq) => faq.category === category)
}

export default function FAQPage() {
  return (
    <main className="section">
      <div className="section-container max-w-5xl">
        <header className="mb-10 text-center">
          <h1 className="mb-4">
            Preguntas frecuentes sobre LLC en Estados Unidos para no residentes
          </h1>
          <p className="section-subtitle">
            Resuelve las dudas clave antes de formar tu LLC: requisitos, impuestos, banco
            y mantenimiento anual, explicados en lenguaje claro para emprendedores que
            viven fuera de Estados Unidos.
          </p>
        </header>

        {/* Bloque General */}
        <section aria-labelledby="faq-general" className="mb-10">
          <h2 id="faq-general" className="mb-4">
            Preguntas generales sobre la LLC
          </h2>
          <p className="text-[color:var(--color-text-secondary)] mb-6">
            Si estás empezando a investigar cómo crear una LLC en Estados Unidos, estas
            preguntas te ayudan a entender los conceptos básicos y a validar si este tipo
            de empresa encaja con tu proyecto.
          </p>
          <div className="space-y-4">
            {groupByCategory('general').map((faq) => (
              <article
                key={faq.question}
                className="rounded-xl border border-[color:var(--color-card-border)] bg-[color:var(--color-surface)] px-5 py-4 shadow-sm"
              >
                <h3 className="mb-2 text-lg font-semibold">{faq.question}</h3>
                <p className="text-sm text-[color:var(--color-text-secondary)]">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Bloque Fiscal */}
        <section aria-labelledby="faq-fiscal" className="mb-10">
          <h2 id="faq-fiscal" className="mb-4">
            Fiscalidad y obligaciones ante el IRS
          </h2>
          <p className="text-[color:var(--color-text-secondary)] mb-6">
            La parte fiscal es el punto más sensible para no residentes: aquí aclaramos
            qué suele pasar con los impuestos federales, los reportes al IRS y la
            coordinación con la tributación de tu país de residencia.
          </p>
          <div className="space-y-4">
            {groupByCategory('fiscal').map((faq) => (
              <article
                key={faq.question}
                className="rounded-xl border border-[color:var(--color-card-border)] bg-[color:var(--color-surface)] px-5 py-4 shadow-sm"
              >
                <h3 className="mb-2 text-lg font-semibold">{faq.question}</h3>
                <p className="text-sm text-[color:var(--color-text-secondary)]">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Bloque Bancario */}
        <section aria-labelledby="faq-bancaria" className="mb-10">
          <h2 id="faq-bancaria" className="mb-4">
            Bancos, cuentas y medios de cobro
          </h2>
          <p className="text-[color:var(--color-text-secondary)] mb-6">
            La apertura de cuentas en dólares y la conexión con pasarelas de pago es
            clave para monetizar tu LLC. Aquí respondemos a las dudas más habituales
            sobre banca para no residentes.
          </p>
          <div className="space-y-4">
            {groupByCategory('bancaria').map((faq) => (
              <article
                key={faq.question}
                className="rounded-xl border border-[color:var(--color-card-border)] bg-[color:var(--color-surface)] px-5 py-4 shadow-sm"
              >
                <h3 className="mb-2 text-lg font-semibold">{faq.question}</h3>
                <p className="text-sm text-[color:var(--color-text-secondary)]">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Bloque Operativo */}
        <section aria-labelledby="faq-operativa" className="mb-10">
          <h2 id="faq-operativa" className="mb-4">
            Operación diaria y mantenimiento de la LLC
          </h2>
          <p className="text-[color:var(--color-text-secondary)] mb-6">
            Una vez creada la LLC, es fundamental tener claro qué costes y trámites
            recurrentes tendrás para mantenerla en regla y escalar tu negocio sin sorpresas.
          </p>
          <div className="space-y-4">
            {groupByCategory('operativa').map((faq) => (
              <article
                key={faq.question}
                className="rounded-xl border border-[color:var(--color-card-border)] bg-[color:var(--color-surface)] px-5 py-4 shadow-sm"
              >
                <h3 className="mb-2 text-lg font-semibold">{faq.question}</h3>
                <p className="text-sm text-[color:var(--color-text-secondary)]">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Llamada a la acción */}
        <section
          aria-label="CTA formación de LLC"
          className="mt-6 rounded-2xl bg-[color:var(--color-bg-8)] px-6 py-6 text-center"
        >
          <h2 className="mb-2 text-2xl font-semibold">
            ¿Listo para crear tu LLC en Estados Unidos?
          </h2>
          <p className="mb-4 text-sm text-[color:var(--color-text-secondary)]">
            Si después de leer estas preguntas sigues con dudas, agenda una sesión o
            completa nuestro formulario y te guiamos paso a paso con la formación de tu
            LLC como no residente.
          </p>
          <a href="/contacto" className="btn btn-primary btn-lg">
            Hablar con un experto
          </a>
        </section>
      </div>

      {/* JSON-LD para SEO (FAQPage) */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  )
}
