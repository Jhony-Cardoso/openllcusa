import styles from './faq.module.css';

export const metadata = {
  title: 'FAQ calculadora fiscal para autónomos, SL y LLC | Open LLC USA',
  description:
    'Preguntas frecuentes sobre la calculadora fiscal de Open LLC USA: precisión, limitaciones técnicas, LLC para no residentes, uso del quiz y responsabilidad legal.',
  robots: 'index, follow',
};

// 1) Array de FAQs definido UNA sola vez, fuera de la función
const faqs = [
  {
    category: 'Sobre la Calculadora',
    questions: [
      {
        q: '¿Qué tan precisa es la calculadora fiscal?',
        a: 'La calculadora proporciona estimaciones orientativas con una variación típica de ±8% a ±25% según el escenario. Los resultados reales dependen de múltiples variables como deducciones específicas, normativa autonómica, situación familiar, etc. Siempre debes consultar con un asesor fiscal certificado antes de tomar decisiones.',
      },
      {
        q: '¿Puedo tomar decisiones empresariales basándome solo en la calculadora?',
        a: 'NO. La calculadora es una herramienta educativa que te ayuda a entender aproximadamente las diferencias fiscales entre estructuras, pero NO sustituye el asesoramiento profesional. Cada situación es única y requiere análisis personalizado.',
      },
      {
        q: '¿Con qué frecuencia se actualiza la calculadora?',
        a: 'Actualizamos la calculadora cuando hay cambios significativos en la legislación fiscal española. Sin embargo, pueden existir retrasos entre cambios normativos y su implementación en la herramienta. La versión actual es 2.3.3 (noviembre 2025).',
      },
    ],
  },
  {
    category: 'Limitaciones Técnicas',
    questions: [
      {
        q: '¿Qué NO considera la calculadora?',
        a: 'La calculadora NO considera: deducciones específicas por discapacidad, familia numerosa, alquiler de vivienda habitual, inversiones en empresas de nueva creación, planes de pensiones, situaciones especiales de expatriados, beneficios fiscales autonómicos específicos, ni circunstancias personales complejas.',
      },
      {
        q: '¿Por qué los resultados varían tanto entre escenarios?',
        a: 'Cada estructura empresarial tiene ventajas e inconvenientes fiscales según tu situación. La variación puede llegar al 85% entre el mejor y peor escenario para tu caso. Por eso es crucial analizar tu situación específica con un profesional.',
      },
      {
        q: '¿La calculadora guarda mis datos?',
        a: 'Los cálculos se realizan 100% en tu navegador. NO enviamos tus datos financieros a nuestros servidores. Solo guardamos localmente (en tu dispositivo) las respuestas del quiz y la aceptación de términos, usando localStorage.',
      },
    ],
  },
  {
    category: 'LLC y Estructuras Internacionales',
    questions: [
      {
        q: '¿Por qué la LLC requiere consulta especializada?',
        a: 'Una LLC desde España puede constituir "establecimiento permanente" según la AEAT, lo que cambia completamente la tributación. Además, implica obligaciones en dos jurisdicciones (IRS + AEAT) y costes de cumplimiento 3-5x superiores. Cada caso requiere análisis específico.',
      },
      {
        q: '¿Es cierto que con una LLC pago menos impuestos?',
        a: 'Depende. Residiendo en España, una LLC tributa similar a ser autónomo. Las ventajas fiscales reales aparecen al combinar la LLC con residencia fiscal en otro país (ej: Portugal NHR, Dubai, etc.), pero esto implica mudarse y cumplir requisitos de residencia.',
      },
      {
        q: '¿Cuánto cuesta realmente mantener una LLC?',
        a: 'Costes anuales típicos: Agente registrado ($100-300), declaraciones IRS ($500-1.500), asesor fiscal español ($1.200-3.000), contabilidad ($1.200-2.400). Total: €3.000-7.000/año. Solo vale la pena si facturas >€60-80k anuales con clientes internacionales.',
      },
    ],
  },
  {
    category: 'Sobre el Quiz',
    questions: [
      {
        q: '¿Qué mide realmente el quiz de cualificación?',
        a: 'El quiz evalúa si tu perfil se beneficiaría de una LLC USA considerando: facturación actual, presencia en mercado USA, tipo de negocio, disposición a complejidad administrativa y objetivos de expansión. Es benévolo intencionalmente: queremos ayudarte incluso si aún no estás listo.',
      },
      {
        q: '¿Mi puntuación del quiz es definitiva?',
        a: 'NO. Es orientativa. Una puntuación baja no significa que nunca puedas tener una LLC, solo que quizás no es tu momento óptimo ahora. Tu situación puede cambiar en 6-12 meses.',
      },
      {
        q: '¿Qué pasa con mis respuestas del quiz?',
        a: 'Se guardan solo en tu navegador (localStorage). NO se envían a nuestros servidores. Las usamos para pre-llenar la calculadora y personalizar tu experiencia, pero permanecen privadas en tu dispositivo.',
      },
    ],
  },
  {
    category: 'Legal y Responsabilidad',
    questions: [
      {
        q: '¿Qué responsabilidad tiene Open LLC USA sobre los resultados?',
        a: 'NINGUNA. Como se indica en nuestros Términos y Condiciones, NO nos hacemos responsables de decisiones tomadas basándose exclusivamente en esta herramienta. Es tu responsabilidad consultar con asesores certificados.',
      },
      {
        q: '¿Puedo confiar en los cálculos para planificación fiscal?',
        a: 'Solo como punto de partida educativo. Los cálculos usan fórmulas simplificadas y datos públicos. Para planificación fiscal real, necesitas un asesor que conozca tu situación completa y actualizada.',
      },
      {
        q: '¿Qué debo hacer si encuentro un error en la calculadora?',
        a: 'Contáctanos inmediatamente a info@openllcusa.com. Aunque nos esforzamos por mantener la precisión, pueden existir errores. Tu feedback nos ayuda a mejorar.',
      },
    ],
  },
];

// 2) JSON-LD generado a partir del mismo array
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.flatMap((category) =>
    category.questions.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  ),
};

export default function FAQPage() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <a href="/calculadora-fiscal" className={styles.backLink}>
              ← Volver a la calculadora
            </a>
          </div>

          <h1 className={styles.mainTitle}>❓ Preguntas Frecuentes</h1>
          <p className={styles.subtitle}>
            Todo lo que necesitas saber sobre la calculadora fiscal, sus limitaciones y cómo usarla correctamente
          </p>

          {/* FAQs por categoría */}
          {faqs.map((category) => (
            <section key={category.category} className={styles.category}>
              <h2 className={styles.categoryTitle}>{category.category}</h2>

              <div className={styles.questions}>
                {category.questions.map((item) => (
                  <details key={item.q} className={styles.faqItem}>
                    <summary className={styles.question}>
                      <span className={styles.questionText}>{item.q}</span>
                      <span className={styles.icon}>+</span>
                    </summary>
                    <div className={styles.answer}>{item.a}</div>
                  </details>
                ))}
              </div>
            </section>
          ))}

          {/* CTA final */}
          <div className={styles.cta}>
            <h3>¿Aún tienes dudas?</h3>
            <p>
              Si tu pregunta no está aquí, contáctanos directamente. Estamos para ayudarte.
            </p>
            <div className={styles.ctaButtons}>
              <a href="mailto:info@openllcusa.com" className={styles.primaryButton}>
                📧 Enviar Consulta
              </a>
              <a href="/calculadora-fiscal" className={styles.secondaryButton}>
                🧮 Ir a Calculadora
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD para rich snippets de FAQ */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
