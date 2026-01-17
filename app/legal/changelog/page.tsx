import styles from '../shared.module.css';

export const metadata = {
  title: 'Historial de Cambios | Open LLC USA',
  description: 'Registro de actualizaciones y mejoras de la calculadora fiscal',
  robots: 'index, follow',
};

export default function ChangelogPage() {
  const versions = [
    {
      version: '2.3.3',
      date: '4 Noviembre 2025',
      type: 'minor',
      changes: [
        {
          category: 'Añadido',
          items: [
            'Sistema completo de cookies banner con gestión de consentimiento',
            'Política de privacidad detallada cumpliendo GDPR',
            'FAQ extendido con 15+ preguntas sobre limitaciones',
            'Changelog público para transparencia de versiones',
            'Indicadores de variación en cada escenario fiscal (VariationRanges)',
          ]
        },
        {
          category: 'Mejorado',
          items: [
            'Márgenes y padding en página de términos y condiciones',
            'Diseño responsive del banner de disclaimer',
            'Integración entre quiz y calculadora (pre-llenado automático)',
          ]
        }
      ]
    },
    {
      version: '2.3.2',
      date: '2 Noviembre 2025',
      type: 'minor',
      changes: [
        {
          category: 'Añadido',
          items: [
            'Quiz de cualificación con 8 preguntas para determinar idoneidad de LLC',
            'Sistema de puntuación benévola en el quiz (scoring flexible)',
            'Página de resultados personalizada según tier del usuario',
            'Botón flotante "¿Es una LLC para ti?" en esquina superior derecha',
          ]
        },
        {
          category: 'Mejorado',
          items: [
            'Ancho máximo de formularios y tarjetas para mejor legibilidad',
            'Centrado de elementos en la interfaz',
            'Espaciado entre botón de cálculo y aviso legal',
          ]
        }
      ]
    },
    {
      version: '2.3.1',
      date: '1 Noviembre 2025',
      type: 'major',
      changes: [
        {
          category: 'Añadido',
          items: [
            'DisclaimerModal: Modal de primera visita con términos completos',
            'DisclaimerBanner: Banner amarillo sticky con aviso permanente',
            'WarningModalLLC: Modal específico para estructuras LLC + España',
            'Checkbox obligatorio para aceptar limitaciones antes de calcular',
            'Aviso legal reforzado en footer de calculadora',
          ]
        },
        {
          category: 'Legal',
          items: [
            'Implementado plan completo de mitigación de riesgos legales',
            'Disclaimers en múltiples puntos del flujo de usuario',
            'Términos y condiciones detallados',
            'Avisos contextuales en escenarios complejos',
          ]
        }
      ]
    },
    {
      version: '2.3.0',
      date: '1 Noviembre 2025',
      type: 'major',
      changes: [
        {
          category: 'Añadido',
          items: [
            'Calculadora fiscal comparativa con 4 escenarios',
            'Escenario 1: Autónomo en España',
            'Escenario 2: SL en España',
            'Escenario 3: LLC + Residencia España',
            'Escenario 4: LLC + Nómada Digital (ej: Dubai)',
            'Cálculos de IRPF progresivo según tramos 2025',
            'Cálculos de Impuesto de Sociedades',
            'Sistema de dividendos y salarios mixtos para SL',
          ]
        },
        {
          category: 'Funcionalidad',
          items: [
            'Inputs para ingresos brutos, gastos deducibles, actividad y comunidad',
            'Cálculo de carga fiscal efectiva para cada escenario',
            'Breakdown detallado de impuestos y seguridad social',
            'Comparativa visual con tarjetas de resultados',
            'Diseño responsive para móviles y tablets',
          ]
        }
      ]
    },
    {
      version: '2.0.0',
      date: '15 Octubre 2025',
      type: 'major',
      changes: [
        {
          category: 'Añadido',
          items: [
            'Migración completa a Next.js 14 con App Router',
            'Sistema de componentes modulares',
            'CSS Modules para estilos aislados',
            'Arquitectura base del proyecto',
          ]
        }
      ]
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <a href="/calculadora-fiscal" className={styles.backLink}>
            ← Volver a la calculadora
          </a>
        </div>

        <h1 className={styles.mainTitle}>📜 Historial de Cambios</h1>
        <p className={styles.subtitle}>
          Registro completo de actualizaciones, mejoras y correcciones de la calculadora fiscal
        </p>

        {/* Versión actual */}
        <div className={styles.currentVersion}>
          <span className={styles.versionBadge}>Versión Actual</span>
          <h2>{versions[0].version}</h2>
          <p>Actualizada el {versions[0].date}</p>
        </div>

        {/* Lista de versiones */}
        <div className={styles.timeline}>
          {versions.map((version, idx) => (
            <div key={idx} className={styles.versionBlock}>
              {/* Header de versión */}
              <div className={styles.versionHeader}>
                <div className={styles.versionInfo}>
                  <h3 className={styles.versionNumber}>
                    v{version.version}
                    <span className={`${styles.typeBadge} ${styles[version.type]}`}>
                      {version.type === 'major' ? 'Mayor' : 'Menor'}
                    </span>
                  </h3>
                  <p className={styles.versionDate}>{version.date}</p>
                </div>
              </div>

              {/* Cambios por categoría */}
              <div className={styles.changes}>
                {version.changes.map((category, cIdx) => (
                  <div key={cIdx} className={styles.changeCategory}>
                    <h4 className={styles.categoryTitle}>
                      {category.category === 'Añadido' && '✨'}
                      {category.category === 'Mejorado' && '🔧'}
                      {category.category === 'Legal' && '⚖️'}
                      {category.category === 'Funcionalidad' && '🚀'}
                      {' '}{category.category}
                    </h4>
                    <ul className={styles.itemList}>
                      {category.items.map((item, iIdx) => (
                        <li key={iIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer informativo */}
        <div className={styles.footer}>
          <div className={styles.infoBox}>
            <h3>🔔 Actualizaciones Futuras</h3>
            <p>
              Trabajamos constantemente en mejorar la calculadora. Si tienes sugerencias o 
              encuentras errores, contáctanos en{' '}
              <a href="mailto:info@openllcusa.com">info@openllcusa.com</a>
            </p>
          </div>

          <div className={styles.versioningInfo}>
            <h4>📊 Sistema de Versionado</h4>
            <ul>
              <li><strong>Mayor (X.0.0):</strong> Cambios significativos, nuevas funcionalidades principales</li>
              <li><strong>Menor (0.X.0):</strong> Mejoras, nuevas características secundarias</li>
              <li><strong>Parche (0.0.X):</strong> Correcciones de bugs, ajustes menores</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
