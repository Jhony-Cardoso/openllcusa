'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

// Imports de componentes de mitigación de riesgos
import DisclaimerModal from '@/components/calculator/modals/DisclaimerModal';
import WarningModalLLC from '@/components/calculator/modals/WarningModalLLC';

// ===================================
// ✅ NUEVO: SCHEMA JSON-LD PARA SEO
// ===================================
// Este componente añade datos estructurados para buscadores
// Ayuda a Google a entender que es una herramienta/calculadora
function CalculatorSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Calculadora Fiscal España 2025",
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "description": "Calculadora fiscal interactiva para emprendedores en España que permite comparar la carga tributaria entre diferentes estructuras empresariales: autónomo, sociedad limitada (SL) y LLC americana.",
    "url": "https://openllcusa.com/calculadora-fiscal",
    "provider": {
      "@type": "Organization",
      "name": "Open LLC USA",
      "url": "https://openllcusa.com"
    },
    "featureList": [
      "Comparación de impuestos Autónomo vs SL vs LLC",
      "Cálculo de IRPF y Seguridad Social",
      "Estimación de Impuesto de Sociedades",
      "Resultados en tiempo real",
      "Sin necesidad de registro"
    ],
    "screenshot": "https://openllcusa.com/images/calculadora-screenshot.jpg",
    "datePublished": "2024-01-15",
    "dateModified": "2025-11-02",
    "version": "2.3.2",
    "inLanguage": "es-ES",
    "audience": {
      "@type": "Audience",
      "audienceType": "Emprendedores y autónomos en España"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

// ===================================
// INTERFACES Y CONSTANTES (SIN CAMBIOS)
// ===================================
interface ScenarioResult {
  name: string;
  subtitle?: string;
  netIncome: number;
  taxes: number;
  socialSecurity: number;
  effectiveRate: number;
  breakdown: string[];
  requiresConsultation?: boolean;
  tooltip?: string;
}

const ACTIVITIES = [
  'Servicios profesionales',
  'Comercio electrónico',
  'Consultoría',
  'Marketing digital',
  'Desarrollo software',
  'Diseño gráfico',
  'Formación online',
  'Otros servicios digitales'
];

const COMUNIDADES = [
  'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias',
  'Cantabria', 'Castilla y León', 'Castilla-La Mancha', 'Cataluña',
  'Comunidad Valenciana', 'Extremadura', 'Galicia', 'Madrid',
  'Murcia', 'Navarra', 'País Vasco', 'La Rioja'
];

// ===================================
// COMPONENTE PRINCIPAL
// ===================================
export default function CalculadoraFiscal() {
  const [grossIncome, setGrossIncome] = useState(50000);
  const [deductibleExpensesPercent, setDeductibleExpensesPercent] = useState(30);
  const [activity, setActivity] = useState('');
  const [comunidad, setComunidad] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('single');
  const [children, setChildren] = useState(0);
  const [disability, setDisability] = useState('no');
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showLLCWarning, setShowLLCWarning] = useState(false);
  const [cameFromQuiz, setCameFromQuiz] = useState(false);

  // ✅ INTEGRACIÓN CON QUIZ - Cargar datos automáticamente
  useEffect(() => {
    const quizFlag = localStorage.getItem('came-from-quiz');
    const quizAnswersStr = localStorage.getItem('quiz-answers');
    
    if (quizFlag === 'true' && quizAnswersStr) {
      try {
        const answers = JSON.parse(quizAnswersStr);
        setCameFromQuiz(true);
        
        // Pre-llenar facturación según respuesta del quiz
        if (answers.revenue === 'less-20k') setGrossIncome(15000);
        if (answers.revenue === '20k-30k') setGrossIncome(25000);
        if (answers.revenue === '30k-50k') setGrossIncome(40000);
        if (answers.revenue === '50k-80k') setGrossIncome(65000);
        if (answers.revenue === 'more-80k') setGrossIncome(100000);
        
        // Pre-llenar actividad si es digital
        if (answers.digitalRemote === 'yes') {
          setActivity('Servicios profesionales');
        }
        
        // Limpiar flag para que no se recargue en cada visita
        localStorage.removeItem('came-from-quiz');
        
        console.log('✅ Datos cargados desde el quiz:', answers);
      } catch (error) {
        console.error('Error al cargar datos del quiz:', error);
      }
    }
  }, []);

  // Scroll tracking para CTA dinámico
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detectar cuando se calculan escenarios con LLC
  useEffect(() => {
    if (showResults) {
      const scenarios = calculateScenarios();
      const hasLLC = scenarios.some(s => s.name.includes('LLC'));
      
      if (hasLLC && !localStorage.getItem('llc-warning-seen')) {
        setTimeout(() => setShowLLCWarning(true), 1000);
      }
    }
  }, [showResults]);

  const calculateScenarios = (): ScenarioResult[] => {
    const deductibleExpenses = grossIncome * (deductibleExpensesPercent / 100);
    const netRevenue = grossIncome - deductibleExpenses;

    const scenario1 = calculateAutonomo(netRevenue);
    const scenario2 = calculateSL(netRevenue);
    const scenario3 = calculateLLCSpain(netRevenue);
    const scenario4 = calculateNomad(netRevenue);

    return [scenario1, scenario2, scenario3, scenario4];
  };

  const calculateAutonomo = (netRevenue: number): ScenarioResult => {
    const socialSecurity = 3600;
    const taxableIncome = netRevenue - socialSecurity;
    let irpf = 0;

    if (taxableIncome > 0) {
      if (taxableIncome <= 12450) {
        irpf = taxableIncome * 0.19;
      } else if (taxableIncome <= 20200) {
        irpf = 12450 * 0.19 + (taxableIncome - 12450) * 0.24;
      } else if (taxableIncome <= 35200) {
        irpf = 12450 * 0.19 + 7750 * 0.24 + (taxableIncome - 20200) * 0.30;
      } else if (taxableIncome <= 60000) {
        irpf = 12450 * 0.19 + 7750 * 0.24 + 15000 * 0.30 + (taxableIncome - 35200) * 0.37;
      } else {
        irpf = 12450 * 0.19 + 7750 * 0.24 + 15000 * 0.30 + 24800 * 0.37 + (taxableIncome - 60000) * 0.45;
      }
    }

    const netIncome = netRevenue - socialSecurity - irpf;
    const effectiveRate = ((socialSecurity + irpf) / netRevenue) * 100;

    return {
      name: 'Autónomo en España',
      netIncome,
      taxes: irpf,
      socialSecurity,
      effectiveRate,
      breakdown: [
        `Ingresos netos: €${netRevenue.toLocaleString()}`,
        `Seguridad Social: €${socialSecurity.toLocaleString()}`,
        `IRPF: €${irpf.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `Beneficio neto: €${netIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
      ]
    };
  };

  const calculateSL = (netRevenue: number): ScenarioResult => {
    const salary = 30000;
    const corporateTax = netRevenue * 0.15;
    const afterTax = netRevenue - corporateTax;
    const ssSalary = salary * 0.30;

    let irpfSalary = 0;
    if (salary <= 12450) {
      irpfSalary = salary * 0.19;
    } else if (salary <= 20200) {
      irpfSalary = 12450 * 0.19 + (salary - 12450) * 0.24;
    } else {
      irpfSalary = 12450 * 0.19 + 7750 * 0.24 + (salary - 20200) * 0.30;
    }

    const netSalary = salary - irpfSalary;
    const dividends = (afterTax - salary - ssSalary) * 0.7;
    const dividendTax = dividends * 0.19;
    const netDividends = dividends - dividendTax;
    const netIncome = netSalary + netDividends;
    const totalTaxes = corporateTax + irpfSalary + dividendTax;
    const effectiveRate = ((totalTaxes + ssSalary) / netRevenue) * 100;

    return {
      name: 'SL en España',
      netIncome,
      taxes: totalTaxes,
      socialSecurity: ssSalary,
      effectiveRate,
      breakdown: [
        `Impuesto Sociedades (15%): €${corporateTax.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `Salario neto: €${netSalary.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `Dividendos netos: €${netDividends.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `Seguridad Social empresa: €${ssSalary.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
      ]
    };
  };

  const calculateLLCSpain = (netRevenue: number): ScenarioResult => {
    const socialSecurity = 3600;
    const taxableIncome = netRevenue - socialSecurity;
    let irpf = 0;

    if (taxableIncome > 0) {
      if (taxableIncome <= 12450) {
        irpf = taxableIncome * 0.19;
      } else if (taxableIncome <= 20200) {
        irpf = 12450 * 0.19 + (taxableIncome - 12450) * 0.24;
      } else if (taxableIncome <= 35200) {
        irpf = 12450 * 0.19 + 7750 * 0.24 + (taxableIncome - 20200) * 0.30;
      } else if (taxableIncome <= 60000) {
        irpf = 12450 * 0.19 + 7750 * 0.24 + 15000 * 0.30 + (taxableIncome - 35200) * 0.37;
      } else {
        irpf = 12450 * 0.19 + 7750 * 0.24 + 15000 * 0.30 + 24800 * 0.37 + (taxableIncome - 60000) * 0.45;
      }
    }

    const netIncome = netRevenue - socialSecurity - irpf;
    const effectiveRate = ((socialSecurity + irpf) / netRevenue) * 100;

    return {
      name: 'LLC + Residencia España',
      netIncome,
      taxes: irpf,
      socialSecurity,
      effectiveRate,
      requiresConsultation: true,
      breakdown: [
        `Ingresos LLC: €${netRevenue.toLocaleString()}`,
        `Cuota autónomos España: €${socialSecurity.toLocaleString()}`,
        `IRPF España: €${irpf.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `Sin impuestos USA (no residente)`,
        `Beneficio neto: €${netIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
      ]
    };
  };

  const calculateNomad = (netRevenue: number): ScenarioResult => {
    let corporateTax = 0;
    if (netRevenue > 102000) {
      corporateTax = (netRevenue - 102000) * 0.09;
    }

    const personalTax = 0;
    const socialSecurity = 0;
    const netIncome = netRevenue - corporateTax;
    const effectiveRate = (corporateTax / netRevenue) * 100;

    return {
      name: 'LLC + Residencia en otro país / Nómada Digital',
      subtitle: '(En este ejemplo: Dubái, E.A.U.)',
      netIncome,
      taxes: corporateTax,
      socialSecurity,
      effectiveRate,
      tooltip: 'Visa de nómada digital disponible por €550/año • Sin impuestos personales',
      breakdown: [
        `Ingresos: €${netRevenue.toLocaleString()}`,
        `Impuesto personal: €0 (0%)`,
        netRevenue > 102000 
          ? `Impuesto corporativo (9% sobre >€102k): €${corporateTax.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
          : `Impuesto corporativo: €0 (exento hasta €102k)`,
        `Sin Seguridad Social`,
        `Beneficio neto: €${netIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
      ]
    };
  };

  const scenarios = showResults ? calculateScenarios() : [];

  const getCtaText = () => {
    if (scrollPosition < 800) return '🎙️ Hablar con Carla';
    if (scrollPosition < 2000) return '📅 Agendar Cita';
    return '🚀 Crear mi LLC';
  };

  const getCtaLink = () => {
    if (scrollPosition < 800) return '/hablar-con-carla';
    if (scrollPosition < 2000) return '/agendar-cita';
    return '/crear-llc';
  };

  return (
    <>
      {/* ✅ NUEVO: Schema JSON-LD para SEO - ÚNICO CAMBIO */}
      <CalculatorSchema />

      {/* Modal de primera visita */}
      <DisclaimerModal />
      
      {/* Modal de advertencia para LLC */}
      <WarningModalLLC 
        isOpen={showLLCWarning}
        onClose={() => setShowLLCWarning(false)}
        onAccept={() => {
          localStorage.setItem('llc-warning-seen', 'true');
          setShowLLCWarning(false);          
        }}
      />

      {/* Banner sticky superior */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#fef3c7',
        borderBottom: '3px solid #f59e0b',
        padding: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '0.95rem',
            color: '#78350f',
            margin: 0,
            fontWeight: 500
          }}>
            <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>⚠️</span>
            <strong>Información orientativa:</strong> Esta calculadora NO constituye asesoramiento fiscal, legal ni financiero personalizado.{' '}
            <a 
              href="/legal/terms-and-conditions" 
              style={{
                textDecoration: 'underline',
                color: '#92400e',
                fontWeight: 600,
                marginLeft: '0.5rem'
              }}
            >
              Leer más →
            </a>
          </p>
        </div>
      </div>

      <div className={styles.container}>
        
        {/* Header con botón quiz en la esquina */}
        <div className={styles.header}>
          <Link href="/quiz" className={styles.quizButton}>
            🤔 ¿Es una LLC para ti?
          </Link>
          
          <h1 className={styles.title}>🧮 Calculadora Fiscal</h1>
          <p className={styles.subtitle}>
            Compara estructuras empresariales para emprendedores en España
          </p>
          
          {/* Mensaje si vino del quiz */}
          {cameFromQuiz && (
            <div style={{
              background: '#dbeafe',
              border: '2px solid #3b82f6',
              borderRadius: '8px',
              padding: '1rem',
              marginTop: '1rem',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: '#1e40af', fontWeight: 600 }}>
                ✅ Datos cargados desde tu quiz. Ajusta los valores si lo necesitas.
              </p>
            </div>
          )}
        </div>

        {/* Formulario de Datos */}
        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              💰 Ingresos Brutos Anuales (€)
            </label>
            <input
              type="number"
              value={grossIncome}
              onChange={(e) => setGrossIncome(Number(e.target.value))}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              📉 Gastos Deducibles (%)
            </label>
            <input
              type="number"
              value={deductibleExpensesPercent}
              onChange={(e) => setDeductibleExpensesPercent(Number(e.target.value))}
              className={styles.input}
              min="0"
              max="100"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>📋 Actividad</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className={styles.select}
            >
              <option value="">Selecciona tu actividad</option>
              {ACTIVITIES.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>📍 Comunidad Autónoma</label>
            <select
              value={comunidad}
              onChange={(e) => setComunidad(e.target.value)}
              className={styles.select}
            >
              <option value="">Selecciona tu comunidad</option>
              {COMUNIDADES.map(com => (
                <option key={com} value={com}>{com}</option>
              ))}
            </select>
          </div>

          {/* Checkbox Legal */}
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              checked={acceptedLegal}
              onChange={(e) => setAcceptedLegal(e.target.checked)}
              className={styles.checkbox}
              id="legal-accept"
            />
            <label htmlFor="legal-accept" className={styles.checkboxLabel}>
              He leído y acepto que esta calculadora proporciona <strong>estimaciones orientativas</strong> y 
              que debo consultar con un asesor fiscal profesional antes de tomar decisiones.
            </label>
          </div>

          <button
            onClick={() => setShowResults(true)}
            disabled={!acceptedLegal}
            className={styles.calculateButton}
          >
            Calcular Escenarios Fiscales →
          </button>
        </div>

        {/* Resultados */}
        {showResults && (
          <div className={styles.results}>
            <h2 className={styles.resultsTitle}>📊 Comparativa de Escenarios</h2>
            
            <div className={styles.scenariosGrid}>
              {scenarios.map((scenario, index) => (
                <div key={index} className={styles.scenarioCard}>
                  <h3 className={styles.scenarioTitle}>
                    {scenario.name}
                    {scenario.subtitle && (
                      <span className={styles.subtitle}>{scenario.subtitle}</span>
                    )}
                  </h3>

                  {scenario.tooltip && (
                    <div className={styles.tooltip}>
                      ℹ️ {scenario.tooltip}
                    </div>
                  )}

                  <div className={styles.netIncome}>
                    €{scenario.netIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                  </div>
                  <div className={styles.effectiveRate}>
                    Carga fiscal: {scenario.effectiveRate.toFixed(1)}%
                  </div>

                  <div className={styles.breakdown}>
                    {scenario.breakdown.map((item, idx) => (
                      <div key={idx} className={styles.breakdownItem}>
                        {item}
                      </div>
                    ))}
                  </div>
                  
                   {/* ✅ NUEVO: Rango de variación */}
                  <div className={styles.variationRange}>
                    <div className={styles.variationLabel}>
                      📊 Rango de variación real: 
                    <span className={styles.variationValue}>
                      {index === 0 && '±8%'}  {/* Autónomo */}
                      {index === 1 && '±12%'} {/* SL */}
                      {index === 2 && '±25%'} {/* LLC España */}
                      {index === 3 && '±15%'} {/* Nómada */}
                    </span>
                </div>
                <div className={styles.variationBar}>
                  <div className={styles.variationIndicator} />
                </div>
                <p className={styles.variationNote}>
                   Depende de tu situación personal, deducciones aplicables y normativa autonómica
                </p>
              </div> 

                  {scenario.requiresConsultation && (
                    <>
                    <div className={styles.consultationBadge}>
                      ⚠️ Requiere consulta especializada
                    </div>

                    {/* ✅ NUEVO BOTÓN */}
                    <Link 
                      href="/contacto" 
                      className={styles.consultationButton}
                    >
                      <span className={styles.consultationButtonIcon}>📅</span>
                       Agendar consulta
                      <span className={styles.consultationButtonArrow}>→</span>
                   </Link>
                  </>
                )}                   
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Botón para ir a la FAQ completa de la calculadora */}
     <a href="/faq-calculadora" className={styles.faqButton}>
       Ver FAQ completa de esta calculadora
     </a>

        {/* DISCLAIMER LEGAL REFORZADO */}
        <div className={styles.legalNotice}>
          <div className={styles.legalHeader}>
            <span className={styles.warningIcon}>⚠️</span>
            <strong>AVISO LEGAL IMPORTANTE</strong>
          </div>
          
          <div className={styles.legalContent}>
            <p>
              <strong>Esta calculadora proporciona ESTIMACIONES EDUCATIVAS ÚNICAMENTE.</strong>
            </p>
            
            <ul className={styles.legalList}>
              <li>❌ <strong>NO</strong> constituye asesoramiento fiscal, legal ni financiero personalizado</li>
              <li>❌ <strong>NO</strong> garantiza resultados específicos ni exactitud absoluta</li>
              <li>❌ <strong>NO</strong> considera todas las variables de tu situación particular</li>
              <li>✅ Debes <strong>SIEMPRE consultar con un asesor fiscal certificado</strong> antes de decidir</li>
              <li>✅ Los resultados pueden variar entre -8% y +85% según el escenario</li>
            </ul>
            
            <p className={styles.legalFooter}>
              <strong>Open LLC USA NO se hace responsable</strong> de decisiones tomadas basándose 
              exclusivamente en esta herramienta.
            </p>
            
            <p className={styles.legalUpdate}>
              <strong>Última actualización:</strong> 2 noviembre 2025 | <strong>Versión:</strong> 2.3.2
              <br />
              <a href="/legal/terms-and-conditions" target="_blank" className={styles.legalLink}>
                Ver Términos y Condiciones completos →
              </a>
            </p>
          </div>
        </div>

         {/* ← PEGAR AQUÍ: Sección FAQ calculadora */}
        <section
          id="faq-calculadora"
          className={styles.faqSection}
          aria-labelledby="faq-calculadora-title"
        >
          <h2 id="faq-calculadora-title" className={styles.faqTitle}>
            FAQ de la calculadora fiscal
          </h2>
          <p className={styles.faqIntro}>
            Estas preguntas frecuentes explican cómo interpretar los resultados,
            de dónde salen las estimaciones y qué limitaciones tiene la herramienta
            para tu caso concreto.
          </p>

          <div className={styles.faqList}>
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                ¿Los resultados de la calculadora son impuestos reales o solo estimaciones?
              </summary>
              <div className={styles.faqAnswer}>
                <p>
                  Los números que ves son estimaciones aproximadas basadas en supuestos
                  generales de tipos impositivos y tramos habituales. No sustituyen un
                  cálculo fiscal personalizado ni tienen en cuenta todas las deducciones,
                  exenciones o situaciones especiales de tu caso.
                </p>
              </div>
            </details>

            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                ¿Por qué el resultado puede ser distinto al de mi asesor o al de Hacienda?
              </summary>
              <div className={styles.faqAnswer}>
                <p>
                  Tu asesor aplica normativa específica de tu comunidad autónoma, posibles
                  cambios legales recientes y deducciones concretas que esta herramienta
                  no modeliza al detalle. La calculadora está pensada como guía
                  orientativa para comparar estructuras, no como simulador oficial.
                </p>
              </div>
            </details>

            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                ¿Con qué frecuencia actualizáis los tipos impositivos y supuestos?
              </summary>
              <div className={styles.faqAnswer}>
                <p>
                  Revisamos periódicamente los tipos impositivos y supuestos clave para
                  mantener la herramienta lo más alineada posible con la normativa
                  vigente, pero pueden existir desfases temporales. Siempre recomendamos
                  contrastar las decisiones importantes con un profesional fiscal.
                </p>
              </div>
            </details>
          </div>
        </section>
        {/* ← FIN SECCIÓN FAQ */}
   
        {/* CTA Sticky Dinámico */}
        {scrollPosition > 500 && (
          <div className={styles.stickyCta}>
            <Link href={getCtaLink()} className={styles.ctaButton}>
              {getCtaText()}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
