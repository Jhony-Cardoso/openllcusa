'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './quiz.module.css';

interface QuizAnswer {
  digitalRemote?: string;
  revenue?: string;
  usClients?: string;
  paymentProcessors?: string;
  complexity?: string;
  branding?: string;
  values?: string;
  relocation?: string;
}

// ✅ PREGUNTAS REORDENADAS - Pregunta 1 = Digital/Remoto
const QUESTIONS = [
  {
    id: 1,
    icon: '💻',
    title: '¿Tu negocio es 100% digital/remoto?',
    subtitle: '¿Puedes trabajar desde cualquier lugar?',
    options: [
      {
        value: 'no',
        label: 'No, requiero presencia física en España',
        subtitle: 'Incluso negocios locales están digitalizando. La LLC puede ser tu catalizador'
      },
      {
        value: 'partial',
        label: 'Parcialmente digital',
        subtitle: 'Ya tienes el componente clave. La LLC potencia esa parte'
      },
      {
        value: 'yes',
        label: 'Sí, 100% digital y remoto',
        subtitle: 'Perfecto match. Tu negocio es global, tu estructura también puede serlo'
      }
    ]
  },
  {
    id: 2,
    icon: '💰',
    title: '¿Cuál es tu facturación anual aproximada?',
    subtitle: 'Tus ingresos antes de gastos',
    options: [
      {
        value: 'less-20k',
        label: 'Menos de 20.000€',
        subtitle: 'Estás construyendo tu negocio. La LLC te espera cuando estés listo'
      },
      {
        value: '20k-30k',
        label: '20.000€ - 30.000€',
        subtitle: 'Buen rango inicial. Con planificación, ya es viable'
      },
      {
        value: '30k-50k',
        label: '30.000€ - 50.000€',
        subtitle: 'Perfecto para empezar con una LLC'
      },
      {
        value: '50k-80k',
        label: '50.000€ - 80.000€',
        subtitle: 'Ideal para estructurar internacionalmente'
      },
      {
        value: 'more-80k',
        label: 'Más de 80.000€',
        subtitle: 'Óptimo. Estructurar correctamente es clave'
      }
    ]
  },
  {
    id: 3,
    icon: '🇺🇸',
    title: '¿Qué porcentaje de tus clientes son de Estados Unidos?',
    subtitle: 'El factor más importante para una LLC',
    badge: 'Importante',
    options: [
      {
        value: '0',
        label: '0% (no tengo clientes USA)',
        subtitle: 'La LLC te ayudará a CONSEGUIR esos clientes. Muchos los consiguen después de crearla'
      },
      {
        value: '1-10',
        label: '1-10%',
        subtitle: 'Ya tienes tracción en USA. La LLC multiplicará esas oportunidades'
      },
      {
        value: '11-20',
        label: '11-20%',
        subtitle: 'Excelente base. La LLC será tu catalizador de crecimiento'
      },
      {
        value: '21-40',
        label: '21-40%',
        subtitle: 'Perfecto. La LLC potenciará lo que ya tienes'
      },
      {
        value: 'more-40',
        label: 'Más del 40%',
        subtitle: 'Con esta presencia USA, la LLC es casi obligatoria'
      }
    ]
  },
  {
    id: 4,
    icon: '💳',
    title: '¿Necesitas procesadores de pago estadounidenses?',
    subtitle: 'Stripe USA, PayPal Business USA, etc.',
    options: [
      {
        value: 'no',
        label: 'No, no los necesito',
        subtitle: 'Tenerlos disponibles puede abrir puertas que no imaginas'
      },
      {
        value: 'interested',
        label: 'No los necesito pero me interesaría',
        subtitle: 'Tener la opción es poder. La LLC te la da'
      },
      {
        value: 'yes',
        label: 'Sí, los necesito o necesitaré pronto',
        subtitle: 'La LLC resuelve este problema inmediatamente'
      }
    ]
  },
  {
    id: 5,
    icon: '📋',
    title: '¿Estás dispuesto/a a gestionar más complejidad administrativa?',
    subtitle: 'Nosotros gestionamos el 95%, pero hay papeleos adicionales',
    options: [
      {
        value: 'no',
        label: 'No, quiero algo simple',
        subtitle: 'Nosotros nos encargamos de la complejidad. Tú día a día cambia muy poco'
      },
      {
        value: 'depends',
        label: 'Depende del beneficio',
        subtitle: 'Actitud perfecta y pragmática. Evaluaremos juntos si compensa'
      },
      {
        value: 'yes',
        label: 'Sí, no me importa la complejidad',
        subtitle: 'Sin obstáculos administrativos. Podemos optimizar al máximo'
      }
    ]
  },
  {
    id: 6,
    icon: '🏷️',
    title: '¿Tienes o planeas tener una marca internacional?',
    subtitle: '¿Tu negocio trasciende fronteras o lo planeas?',
    options: [
      {
        value: 'no',
        label: 'No, solo mercado local por ahora',
        subtitle: 'Hoy local, mañana puede ser global. Estar preparado da ventaja'
      },
      {
        value: '1-2-years',
        label: 'Planeo expandir en 1-2 años',
        subtitle: 'Momento perfecto. La LLC construye los fundamentos ahora'
      },
      {
        value: 'yes',
        label: 'Sí, ya trabajo o planeo trabajar internacionalmente',
        subtitle: 'La LLC es esencial para tu estrategia'
      }
    ]
  },
  {
    id: 7,
    icon: '🎯',
    title: '¿Qué valoras más en tu estructura empresarial?',
    subtitle: 'No hay respuesta correcta, solo la tuya',
    options: [
      {
        value: 'simplicity',
        label: 'Simplicidad y bajos costos',
        subtitle: 'Entendemos. Por eso lo hacemos simple y con opciones de pago flexibles'
      },
      {
        value: 'moderate',
        label: 'Optimización fiscal moderada',
        subtitle: 'Balance inteligente. La LLC puede ofrecer eso'
      },
      {
        value: 'professional',
        label: 'Imagen profesional internacional',
        subtitle: 'La LLC te da exactamente esa imagen ante clientes globales'
      },
      {
        value: 'expansion',
        label: 'Flexibilidad para expansión futura',
        subtitle: 'Perfecto. La LLC es infraestructura para crecer sin límites'
      }
    ]
  },
  {
    id: 8,
    icon: '✈️',
    title: '¿Considerarías relocalizarte fuera de España en el futuro?',
    subtitle: 'Esto puede multiplicar los beneficios fiscales',
    options: [
      {
        value: 'no',
        label: 'No, quiero quedarme en España',
        subtitle: 'La LLC desde España tiene beneficios igualmente (imagen, herramientas, clientes)'
      },
      {
        value: 'maybe',
        label: 'Quizá en el futuro',
        subtitle: 'Estar preparado es inteligente. La LLC te da esa flexibilidad'
      },
      {
        value: 'yes',
        label: 'Sí, estoy abierto/a a relocalizarme',
        subtitle: 'Máximas opciones. La LLC es tu pasaporte fiscal internacional'
      }
    ]
  }
];

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({});

  const handleAnswer = (questionId: number, value: string) => {
    // Mapear pregunta a clave correcta
    const questionKey = questionId === 1 ? 'digitalRemote' :
                        questionId === 2 ? 'revenue' :
                        questionId === 3 ? 'usClients' :
                        questionId === 4 ? 'paymentProcessors' :
                        questionId === 5 ? 'complexity' :
                        questionId === 6 ? 'branding' :
                        questionId === 7 ? 'values' : 'relocation';

    const newAnswers = { ...answers, [questionKey]: value };
    setAnswers(newAnswers);

    // Si es la última pregunta, guardar y mostrar resultado
    if (currentQuestion === QUESTIONS.length - 1) {
      localStorage.setItem('quiz-answers', JSON.stringify(newAnswers));
      
      // Calcular score y redirigir a resultado
      const score = calculateScore(newAnswers);
      router.push(`/quiz/resultado?score=${score}`);
    } else {
      // Siguiente pregunta
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const calculateScore = (answers: QuizAnswer): number => {
    let score = 0;
    
    // Scoring benévolo
    if (answers.digitalRemote === 'yes' || answers.digitalRemote === 'partial') score += 15;
    if (answers.revenue === '30k-50k' || answers.revenue === '50k-80k' || answers.revenue === 'more-80k') score += 20;
    if (answers.revenue === '20k-30k') score += 15;
    if (answers.usClients !== '0') score += 20;
    if (answers.usClients === '0') score += 10;
    if (answers.paymentProcessors === 'yes' || answers.paymentProcessors === 'interested') score += 15;
    if (answers.complexity !== 'no') score += 10;
    if (answers.branding === 'yes' || answers.branding === '1-2-years') score += 10;
    if (answers.relocation !== 'no') score += 10;

    return Math.min(score, 100);
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      router.push('/calculadora-fiscal');
    }
  };

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <a href="/calculadora-fiscal" className={styles.backLink}>
          ← Volver a calculadora
        </a>
        <div className={styles.versionBadge}>
          ⭐ Nueva versión 2.0 - Sistema 5 Tiers
        </div>
      </div>

      <div className={styles.mainTitle}>
        <h1>¿Es una LLC USA adecuada para ti?</h1>
        <p className={styles.subtitle}>
          Responde 8 preguntas y descubre cuándo es tu momento ideal
        </p>
        <p className={styles.description}>
          Sistema optimista: Incluso si no estás listo hoy, te mostramos tu camino
        </p>
        <div className={styles.badges}>
          <span className={styles.badge}>⏱️ 2-3 minutos</span>
          <span className={styles.badge}>• Sin compromiso</span>
          <span className={styles.badge}>• 100% gratis</span>
        </div>
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.progressLabel}>
          Pregunta {currentQuestion + 1} de {QUESTIONS.length}
          <span className={styles.progressPercent}>{Math.round(progress)}%</span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className={styles.questionCard}>
        <div className={styles.questionIcon}>{question.icon}</div>
        
        <h2 className={styles.questionTitle}>{question.title}</h2>
        <p className={styles.questionSubtitle}>{question.subtitle}</p>
        
        {question.badge && (
          <span className={styles.importantBadge}>⭐ {question.badge}</span>
        )}

        <div className={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <button
              key={index}
              className={styles.optionButton}
              onClick={() => handleAnswer(question.id, option.value)}
            >
              <div className={styles.optionLabel}>{option.label}</div>
              <div className={styles.optionSubtitle}>{option.subtitle}</div>
            </button>
          ))}
        </div>

        <button onClick={goBack} className={styles.backButton}>
          ← Anterior
        </button>
      </div>
    </div>
  );
}
