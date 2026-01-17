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
        tier: 'TIER 1',
        percentage: '67%',
        title: '¡La LLC es perfecta para ti!',
        description: 'Tu perfil es ideal para una LLC. Ya estás listo para dar el salto internacional.',
        message: 'Los números son claros. Es tu momento.',
        color: '#10b981',
        recommendation: 'NO lo estimes primer año: 414%. Cada mes sin LLC probablemente te cuesta 1.500 - 3.000€ en oportunidades perdidas.'
      };
    } else if (score >= 60) {
      return {
        tier: 'TIER 2',
        percentage: '54%',
        title: '¡Estás muy cerca!',
        description: 'Tu perfil muestra gran potencial. Con algunos ajustes estratégicos, la LLC será perfecta para ti.',
        message: 'Unos pequeños cambios y estarás listo',
        color: '#3b82f6',
        recommendation: 'La LLC puede ser tu catalizador. Analicemos juntos tu situación específica.'
      };
    } else if (score >= 40) {
      return {
        tier: 'TIER 3',
        percentage: '38%',
        title: 'Hay potencial, pero necesitas prepararte',
        description: 'Aún no es tu momento óptimo, pero puedes trabajar hacia ese objetivo.',
        message: 'Prepárate ahora, implementa después',
        color: '#f59e0b',
        recommendation: 'Usa nuestra calculadora para ver números exactos. Podemos crear un plan para cuando estés listo.'
      };
    } else {
      return {
        tier: 'TIER 4-5',
        percentage: '25%',
        title: 'Céntrate en crecer primero',
        description: 'La LLC te espera cuando tu negocio alcance el nivel adecuado. Enfócate en crecimiento.',
        message: 'Tu prioridad ahora: construir y crecer',
        color: '#64748b',
        recommendation: 'Alcanza los 20-30k€ anuales primero. Luego la LLC multiplicará tu impacto.'
      };
    }
  };

  const tierInfo = getTierInfo(score);

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

        {/* CTAs principales */}
        <div className={styles.resultCtas}>
          {score >= 60 ? (
            <>
              <button 
                onClick={() => window.location.href = '/contacto'}
                className={styles.ctaPrimary}
              >
                📞 Agendar Llamada Ahora (15 min)
              </button>
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className={styles.ctaSecondary}
              >
                Ver Precios y Paquetes Detallados
              </button>
            </>
          ) : (
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
