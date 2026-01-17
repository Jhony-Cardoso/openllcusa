// app/faq/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './faq.module.css'

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
      'Una LLC (Limited Liability Company) es una sociedad de responsabilidad limitada creada a nivel estatal que protege tu patrimonio personal y ofrece mucha flexibilidad en la gestión del negocio.' +
      ' Para no residentes suele ser muy atractiva porque permite vender online al mercado estadounidense, facturar en dólares y separar claramente tus finanzas personales de las de la empresa.'
  },
  {
    category: 'general',
    question: '¿Puedo crear una LLC en Estados Unidos si vivo en Latinoamérica o en España?',
    answer:
      'Sí. No necesitas ser ciudadano ni residente para constituir una LLC; la mayoría de estados permiten propietarios 100 % extranjeros siempre que se designe un agente registrado y se cumplan las normas locales.' +
      ' De hecho, muchos emprendedores no residentes utilizan la LLC para acceder al mercado de EE. UU. sin mudarse físicamente al país.'
  },
  {
    category: 'general',
    question: '¿En qué estado me conviene abrir mi LLC si soy no residente?',
    answer:
      'Estados como Wyoming, Nuevo México, Delaware o Florida son muy populares para no residentes por sus costos anuales bajos, buena protección de privacidad y procesos sencillos.' +
      ' La elección óptima depende de si venderás servicios digitales, e‑commerce, si necesitas presencia física o si quieres registrar tu LLC en el mismo estado donde obtendrás clientes o tendrás almacén.'
  },
  {
    category: 'general',
    question: '¿Necesito viajar a Estados Unidos para crear mi LLC?',
    answer:
      'No. El proceso de formación de la LLC y obtención del EIN se puede hacer completamente online trabajando con un agente registrado y un proveedor especializado.' +
      ' Solo ciertos bancos tradicionales podrían pedir presencia física para abrir una cuenta, mientras que muchas fintechs y bancos online permiten verificación remota.'
  },
  {
    category: 'fiscal',
    question: '¿La LLC paga impuestos en Estados Unidos si soy no residente?',
    answer:
      'Cuando la LLC tiene un solo socio no residente suele tratarse como entidad “disregarded” o sociedad de personas, y en muchos casos no paga impuesto federal sobre ingresos de fuente totalmente extranjera.' +
      ' Sin embargo, puede haber impuestos estatales o federales si existe actividad efectivamente conectada con EE. UU., por lo que es clave analizar dónde se generan realmente los ingresos.'
  },
  {
    category: 'fiscal',
    question: '¿Tengo que presentar formularios al IRS aunque no tenga impuestos a pagar?',
    answer:
      'Sí. Una LLC de un solo socio extranjero normalmente debe presentar, como mínimo, un Formulario 5472 junto con un 1120 pro forma cada año cuando es foreign‑owned y tiene transacciones con su propietario.' +
      ' Aunque la LLC no tenga ingresos o impuesto a pagar, no presentar estos reportes puede implicar multas elevadas por incumplimiento formal.'
  },
  {
    category: 'fiscal',
    question: '¿Necesito un ITIN o SSN para operar mi LLC?',
    answer:
      'Para formar la LLC y solicitar el EIN no es obligatorio disponer de SSN o ITIN, ya que el EIN se puede obtener enviando el Form SS‑4 por fax o correo.' +
      ' No obstante, para ciertas pasarelas de pago, bancos tradicionales o para presentar tu declaración personal puede resultar necesario tramitar un ITIN como no residente.'
  },
  {
    category: 'fiscal',
    question: '¿Dónde pago impuestos si mi LLC está en Estados Unidos pero yo vivo en otro país?',
    answer:
      'En general, tributas personalmente en tu país de residencia fiscal por las ganancias que recibes de la LLC, aplicando si corresponde los convenios para evitar la doble imposición.' +
      ' La LLC solo quedará sujeta a impuestos en EE. UU. si genera ingresos de fuente estadounidense o trade or business efectivamente conectado, por lo que conviene coordinar el análisis con un asesor de ambos sistemas.'
  },
  {
    category: 'bancaria',
    question: '¿Puedo abrir una cuenta bancaria para mi LLC sin viajar a Estados Unidos?',
    answer:
      'Sí. Existen bancos online y fintechs que permiten abrir cuentas para LLCs de no residentes mediante verificación remota de identidad y de la documentación de la empresa.' +
      ' En muchos casos obtendrás un número de cuenta y routing number estadounidenses, lo que facilita cobrar por Stripe, PayPal o marketplaces.'
  },
  {
    category: 'bancaria',
    question: '¿Qué documentación bancaria suelen pedirme como no residente?',
    answer:
      'Lo habitual es que el banco solicite los documentos de formación de la LLC (Articles of Organization o equivalente), el Operating Agreement, el EIN y copia de tu pasaporte.' +
      ' También suelen requerir prueba de domicilio reciente y, a veces, una breve descripción del modelo de negocio y volúmenes de transacción previstos.'
  },
  {
    category: 'operativa',
    question: '¿Qué costos recurrentes tiene una LLC para no residentes?',
    answer:
      'Entre los costos más habituales están la tasa anual del estado (annual report o franchise tax), el servicio de registered agent, la preparación de reportes fiscales y, si corresponde, servicios contables.' +
      ' Estados como Wyoming tienen costos anuales muy competitivos, mientras que otros estados pueden ser más caros pero ofrecer ventajas concretas para ciertos modelos de negocio.'
  },
  {
    category: 'operativa',
    question: '¿Qué debo hacer cada año para mantener mi LLC en regla?',
    answer:
      'Debes renovar la LLC en el estado donde esté registrada antes de la fecha límite, mantener un agente registrado activo y conservar libros y registros básicos del negocio.' +
      ' Además, tendrás que presentar los formularios fiscales federales y estatales que apliquen, incluso en años sin actividad si la normativa así lo exige.'
  },
  {
    category: 'operativa',
    question: '¿Puedo usar mi LLC para vender en Amazon, Shopify u otras plataformas?',
    answer:
      'Sí. Una LLC estadounidense es una estructura muy utilizada para vender en Amazon FBA, Shopify y otros marketplaces porque facilita la apertura de cuentas de vendedor y pasarelas de pago.' +
      ' También mejora la percepción de clientes internacionales y permite centralizar los cobros en dólares en una cuenta empresarial.'
  },
  {
    category: 'operativa',
    question: '¿Puedo tener socios si todos somos no residentes?',
    answer:
      'Una LLC puede tener uno o varios socios, y todos pueden ser no residentes siempre que se indiquen correctamente los porcentajes de participación y se reflejen en el Operating Agreement.' +
      ' Cada socio deberá analizar cómo tributa en su país de residencia la parte de beneficios que reciba de la LLC.'
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
    'Resolvemos las dudas más frecuentes sobre cómo crear y mantener una LLC en Estados Unidos siendo no residente: requisitos, impuestos, banca y cumplimiento anual.',
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
    <main className={styles.container}>
      <div className={styles.content}>
        {/* Cabecera */}
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Volver al inicio
          </Link>
          <h1 className={styles.mainTitle}>
            Preguntas frecuentes sobre LLC <br />para no residentes
          </h1>
          <p className={styles.subtitle}>
            Aquí encontrarás respuestas claras a las dudas más habituales sobre cómo crear,
            tributar y operar una LLC en Estados Unidos viviendo fuera del país.
          </p>
        </header>

        {/* Categoría: General */}
        <section className={styles.category} aria-labelledby="faq-general">
          <h2 id="faq-general" className={styles.categoryTitle}>
            Conceptos básicos y elegibilidad
          </h2>
          <div className={styles.questions}>
            {groupByCategory('general').map((faq) => (
              <details key={faq.question} className={styles.faqItem}>
                <summary className={styles.question}>
                  <span className={styles.questionText}>{faq.question}</span>
                  <span className={styles.icon}>+</span>
                </summary>
                <div className={styles.answer}>
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Categoría: Fiscal */}
        <section className={styles.category} aria-labelledby="faq-fiscal">
          <h2 id="faq-fiscal" className={styles.categoryTitle}>
            Impuestos y relación con el IRS
          </h2>
          <div className={styles.questions}>
            {groupByCategory('fiscal').map((faq) => (
              <details key={faq.question} className={styles.faqItem}>
                <summary className={styles.question}>
                  <span className={styles.questionText}>{faq.question}</span>
                  <span className={styles.icon}>+</span>
                </summary>
                <div className={styles.answer}>
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Categoría: Bancaria */}
        <section className={styles.category} aria-labelledby="faq-bancaria">
          <h2 id="faq-bancaria" className={styles.categoryTitle}>
            Bancos, cuentas y cobros en dólares
          </h2>
          <div className={styles.questions}>
            {groupByCategory('bancaria').map((faq) => (
              <details key={faq.question} className={styles.faqItem}>
                <summary className={styles.question}>
                  <span className={styles.questionText}>{faq.question}</span>
                  <span className={styles.icon}>+</span>
                </summary>
                <div className={styles.answer}>
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Categoría: Operativa */}
        <section className={styles.category} aria-labelledby="faq-operativa">
          <h2 id="faq-operativa" className={styles.categoryTitle}>
            Operación diaria y mantenimiento
          </h2>
          <div className={styles.questions}>
            {groupByCategory('operativa').map((faq) => (
              <details key={faq.question} className={styles.faqItem}>
                <summary className={styles.question}>
                  <span className={styles.questionText}>{faq.question}</span>
                  <span className={styles.icon}>+</span>
                </summary>
                <div className={styles.answer}>
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className={styles.cta} aria-label="CTA para crear LLC">
          <h3>¿Listo para crear tu LLC en Estados Unidos?</h3>
          <p>
            Si después de leer estas preguntas aún tienes dudas, agenda una llamada o
            completa nuestro formulario y te guiamos paso a paso con la formación de tu LLC
            siendo no residente.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/contacto" className={styles.primaryButton}>
              Hablar con un experto
            </Link>
            <Link href="/quiz" className={styles.secondaryButton}>
              Hacer el quiz de elegibilidad
            </Link>
          </div>
        </section>
      </div>

      {/* JSON-LD FAQPage para SEO */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  )
}
