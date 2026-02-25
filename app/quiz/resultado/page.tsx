'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../quiz.module.css';

export default function ResultadoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const score = parseInt(searchParams.get('score') || '0');
  const [showDetails, setShowDetails] = useState(false);

  const getTierInfo = (score: number) => {
    if (score >= 80) {
      return {
        tier: 'TIER 1 - ELITE',
        percentage: '85-100%',
        title: '¡La LLC es tu Mejor Inversión Ahora! 🚀',
        description: 'Tu perfil es 100% óptimo. Cada mes que pasas tributando como autónomo estás perdiendo dinero real y proyección internacional.',
        message: 'Ahorro Fiscal Estimado: >4.500€/año + Expansión USA',
        color: '#10b981',
        recommendation: 'RESULTADO: APTO TOTAL. Recomendamos el Plan Launch para aprovechar la inercia de tus clientes actuales.'
      };
    } else if (score >= 60) {
      return {
        tier: 'TIER 2 - AVANZADO',
        percentage: '65-80%',
        title: '¡Estás a un paso de la Globalización!',
        description: 'Tu negocio tiene la tracción necesaria. Una LLC te daría el empuje definitivo para cerrar clientes en dólares y optimizar tu carga fiscal.',
        message: 'Potencial de Ahorro: 3.000€ - 4.500€/año',
        color: '#3b82f6',
        recommendation: 'RESULTADO: ALTAMENTE RECOMNDABLE. Una consultoría de 15 min despejará tus dudas sobre el nexo en España.'
      };
    } else if (score >= 40) {
      return {
        tier: 'TIER 3 - POTENCIAL',
        percentage: '40-60%',
        title: 'Buen Camino, pero con Matices',
        description: 'Hay potencial, pero tu estructura actual aún aguanta. Podrías beneficiarte de la LLC sobre todo por imagen de marca e infraestructura de pagos.',
        message: 'Enfoque: Crecimiento y Validación USA',
        color: '#f59e0b',
        recommendation: 'RESULTADO: VIABLE. Te sugerimos usar la calculadora para ver si el ahorro compensa el mantenimiento inicial.'
      };
    } else {
      return {
        tier: 'TIER 4 - EMERGENTE',
        percentage: '<40%',
        title: 'Foco en Facturación Primero 📈',
        description: 'La LLC es una herramienta de optimización. Por ahora, tu mejor inversión es el marketing y las ventas para llegar a los 30k€ anuales.',
        message: 'Próximo Hito: 25.000€ de Facturación Anual',
        color: '#64748b',
        recommendation: 'RESULTADO: POSTERGAR. No queremos que gastes en estructuras que aún no necesitas. ¡Sigue creciendo!'
      };
    }
  };

  const tierInfo = getTierInfo(score);

  // ✅ ACTUALIZAR SCORE EN DB
  useEffect(() => {
    const updateLeadScore = async () => {
      const leadId = localStorage.getItem('lead-id');
      if (!leadId) return;

      try {
        await fetch(`/api/leads/${leadId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ score })
        });
        console.log('✅ Lead score sincronizado');
      } catch (err) {
        console.error('Error sincronizando score:', err);
      }
    };

    updateLeadScore();
  }, [score]);

  const handleCalculatorRedirect = () => {
    // Guardar que vino del quiz
    localStorage.setItem('came-from-quiz', 'true');
    router.push('/calculadora-fiscal');
  };

  return (
    <div className={styles.resultContainer}>
      {/* Header */}
      <div className={styles.resultHeader}>
        <a href="/calculadora-fiscal" className={styles.backLink}>
          ← Volver a calculadora
        </a>
        <div className={styles.versionBadge}>
          ⭐ Nueva versión 2.0 - Sistema 5 Tiers
        </div>
      </div>

      <div className={styles.resultCard}>
        {/* Icono celebración */}
        <div className={styles.resultIcon}>✨</div>

        {/* Tier badge */}
        <div
          className={styles.tierBadge}
          style={{ backgroundColor: tierInfo.color }}
        >
          {tierInfo.tier} • Puntuación: {tierInfo.percentage}
        </div>

        {/* Título resultado */}
        <h1 className={styles.resultTitle}>{tierInfo.title}</h1>
        <p className={styles.resultDescription}>
          {tierInfo.description}
        </p>

        {/* Mensaje destacado */}
        <div className={styles.highlightBox} style={{ borderColor: tierInfo.color }}>
          <strong>{tierInfo.message}</strong>
        </div>

        {/* Plan de acción personalizado */}
        <div className={styles.actionPlan}>
          <h3>💡 Tu plan de acción personalizado</h3>

          {score >= 60 ? (
            <div className={styles.benefitsBox}>
              <p><strong>Beneficios para ti:</strong> Ahorro fiscal Q3i - ~800€ + Nuevos contratos USA estimados ~18.000€ + Imagen internacional</p>
              <p><strong>Proceso rápido y profesional:</strong> 6-8 semanas hasta estar 100% operativo • Nosotros gestionamos todo</p>
              <p><strong>Inversión clara:</strong> 4.200€ primer año (o 387€/mes) + Beneficio neto estimado: +17.400€ • ROI: 414%</p>
            </div>
          ) : (
            <div className={styles.growthBox}>
              <p><strong>Pasos hacia la LLC:</strong></p>
              <ul>
                <li>Aumenta facturación a 20-30k€/año</li>
                <li>Valida demanda internacional</li>
                <li>Digitaliza más tu negocio</li>
                <li>Mantente en contacto con nosotros</li>
              </ul>
            </div>
          )}
        </div>

        {/* Información importante */}
        <div className={styles.importantNote}>
          <strong>⚠️ Importante:</strong> Este quiz proporciona orientación general basada en tus respuestas.
          Tu caso específico puede tener particularidades que requieren análisis personalizado.
          La consulta inicial es gratuita y sin compromiso.
        </div>

        {/* CTAs principales - Dinámicos según Score */}
        <div className={styles.resultCtas}>
          {score >= 80 ? (
            /* TIER 1: Venta Directa o Consultoría Hot */
            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={() => window.location.href = '/precios'}
                className={styles.ctaPrimary}
              >
                🚀 Comenzar con mi LLC (Planes)
              </button>
              <button
                onClick={() => window.location.href = '/contacto'}
                className={styles.ctaSecondary}
              >
                📞 Agendar Llamada de Estrategia
              </button>
              <button
                onClick={handleCalculatorRedirect}
                className="text-blue-600 font-bold text-sm underline mt-2 hover:text-blue-800 transition-colors"
              >
                O prefiero ver mi ahorro detallado en la calculadora
              </button>
            </div>
          ) : score >= 60 ? (
            /* TIER 2: Interés alto, necesita un empujón */
            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={() => window.location.href = '/contacto'}
                className={styles.ctaPrimary}
              >
                📞 Agendar Llamada Ahora (15 min)
              </button>
              <button
                onClick={handleCalculatorRedirect}
                className={styles.ctaSecondary}
              >
                🧮 Ver Ahorro en Calculadora Fiscal
              </button>
            </div>
          ) : (
            /* TIER 3/4/5: No apto todavía, el gancho es la calculadora */
            <>
              <button
                onClick={handleCalculatorRedirect}
                className={styles.ctaPrimary}
              >
                🧮 Ir a Calculadora Fiscal
              </button>
              <button
                onClick={() => router.push('/quiz')}
                className={styles.ctaSecondary}
              >
                🔄 Repetir Quiz
              </button>
            </>
          )}
        </div>

        {/* Próximos pasos */}
        <div className={styles.nextSteps}>
          <h3>📚 Tus próximos pasos:</h3>
          <ol>
            <li>Llamada 15 min para confirmar tu situación</li>
            <li>Consulta estratégica 30 min (gratis para TIER 1)</li>
            <li>Comienzo inmediato: LLC operativa en 6-8 semanas</li>
          </ol>
        </div>

        {/* Historias reales */}
        <div className={styles.testimonials}>
          <h3>💬 Historias reales de personas como tú:</h3>

          <div className={styles.testimonialCard}>
            <p>
              "Estaba en TIER 1 (84 puntos). En 4 meses recuperé la inversión con un solo cliente USA.
              Hoy facturo 40% más que antes de la LLC."
            </p>
            <div className={styles.testimonialAuthor}>
              <strong>Carlos M.</strong>
              <span>Consultor Marketing Digital</span>
              <span className={styles.earnings}>De 68€ a 91€/año</span>
            </div>
          </div>

          <div className={styles.testimonialCard}>
            <p>
              "El quiz me dio 72%. En 6 meses conseguí 3 clientes USA que nunca hubiera podido cerrar
              como autónoma."
            </p>
            <div className={styles.testimonialAuthor}>
              <strong>Laura S.</strong>
              <span>Desarrolladora SaaS</span>
              <span className={styles.earnings}>De 58€ a 81€/año</span>
            </div>
          </div>
        </div>

        {/* CTA final */}
        <div className={styles.finalCta}>
          <h3>¿Quieres profundizar en tu caso específico?</h3>
          <p>Usa nuestra <strong>calculadora fiscal</strong> para ver números exactos de tu situación</p>
          <div className={styles.finalButtons}>
            <button
              onClick={handleCalculatorRedirect}
              className={styles.btnCalculator}
            >
              🧮 Ir a Calculadora Fiscal
            </button>
            <button
              onClick={() => router.push('/quiz')}
              className={styles.btnRepeat}
            >
              🔄 Repetir Quiz
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
