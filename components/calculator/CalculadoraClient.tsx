'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/app/calculadora-fiscal/page.module.css';

// Imports de componentes de mitigación de riesgos
import DisclaimerModal from '@/components/calculator/modals/DisclaimerModal';
import WarningModalLLC from '@/components/calculator/modals/WarningModalLLC';


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
  detailedBreakdown?: string[];
  tooltip?: string;
  advantages?: string[];
  disadvantages?: string[];
  requiresConsultation?: boolean;
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
export default function CalculadoraClient() {
  const router = useRouter();
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
  const [isB2C, setIsB2C] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState<number | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // ✅ GATE: Asegurar que el usuario pasó por el lead-form/quiz
  useEffect(() => {
    const leadId = localStorage.getItem('lead-id');
    const quizFlag = localStorage.getItem('came-from-quiz');
    const quizAnswersStr = localStorage.getItem('quiz-answers');

    // Si no hay leadId y no viene del flujo normal (quiz), redirigir al formulario
    // para capturar el dato antes de dar el "premio" (la calculadora)
    if (!leadId) {
      console.log('🔒 Acceso restringido: Redirigiendo a captación de lead...');
      router.push('/lead-form');
      return;
    }

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
    const scenario3 = calculateLLCSpain(netRevenue, isB2C);
    const scenario4 = calculateNomad(netRevenue, isB2C);

    return [scenario1, scenario2, scenario3, scenario4];
  };

  const calculateAutonomo = (netRevenue: number): ScenarioResult => {
    const socialSecurity = 3600;
    const taxableIncome = netRevenue - socialSecurity;
    let irpf = 0;

    // Cálculo IRPF por tramos
    const irpfTramos: string[] = [];
    if (taxableIncome > 0) {
      const t1 = Math.min(taxableIncome, 12450) * 0.19;
      irpfTramos.push(`Tramo 1 (hasta €12.450 al 19%): €${t1.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`);
      if (taxableIncome > 12450) {
        const t2 = Math.min(taxableIncome - 12450, 7750) * 0.24;
        irpfTramos.push(`Tramo 2 (€12.450–€20.200 al 24%): €${t2.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`);
      }
      if (taxableIncome > 20200) {
        const t3 = Math.min(taxableIncome - 20200, 15000) * 0.30;
        irpfTramos.push(`Tramo 3 (€20.200–€35.200 al 30%): €${t3.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`);
      }
      if (taxableIncome > 35200) {
        const t4 = Math.min(taxableIncome - 35200, 24800) * 0.37;
        irpfTramos.push(`Tramo 4 (€35.200–€60.000 al 37%): €${t4.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`);
      }
      if (taxableIncome > 60000) {
        const t5 = (taxableIncome - 60000) * 0.45;
        irpfTramos.push(`Tramo 5 (más de €60.000 al 45%): €${t5.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`);
      }

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
        `Ingresos netos: €${netRevenue.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `Seguridad Social: €${socialSecurity.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `IRPF: €${irpf.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `Beneficio neto: €${netIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
      ],
      detailedBreakdown: [
        `Ingresos Brutos: €${grossIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `(-) Gastos deducibles (${deductibleExpensesPercent}%): €${(grossIncome * deductibleExpensesPercent / 100).toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `(=) Beneficio Bruto: €${netRevenue.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `(-) Seguridad Social (cuota fija): €${socialSecurity.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `(=) Base imponible IRPF: €${taxableIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `--- Desglose IRPF por tramos ---`,
        ...irpfTramos,
        `(=) IRPF Total: €${irpf.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `--- Resultado ---`,
        `Beneficio Bruto (€${netRevenue.toLocaleString('es-ES', { maximumFractionDigits: 0 })}) - SS (€${socialSecurity.toLocaleString('es-ES', { maximumFractionDigits: 0 })}) - IRPF (€${irpf.toLocaleString('es-ES', { maximumFractionDigits: 0 })})`,
        `= Beneficio Neto: €${netIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
      ],
      disadvantages: [
        'Modelos trimestrales obligatorios (IVA/IRPF)',
        'Flujo de caja retenido (Adelanto de IVA)'
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
    const grossDividends = afterTax - salary - ssSalary;
    const dividends = grossDividends * 0.7;
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
        `Salario neto Administrador: €${netSalary.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `Dividendos netos: €${netDividends.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `Seguridad Social empresa: €${ssSalary.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `Beneficio neto: €${netIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
      ],
      detailedBreakdown: [
        `Ingresos Brutos: €${grossIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `(-) Gastos deducibles (${deductibleExpensesPercent}%): €${(grossIncome * deductibleExpensesPercent / 100).toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `(=) Beneficio Bruto: €${netRevenue.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `--- Impuesto de Sociedades ---`,
        `Beneficio Bruto × 15% = €${corporateTax.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `Remanente tras IS: €${afterTax.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `--- Sueldo del Administrador ---`,
        `Sueldo bruto asignado: €${salary.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `(-) IRPF del sueldo: €${irpfSalary.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `(=) Sueldo neto Administrador: €${netSalary.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `--- Seguridad Social Societaria ---`,
        `Sueldo (€${salary.toLocaleString('es-ES', { maximumFractionDigits: 0 })}) × 30% = €${ssSalary.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `--- Dividendos ---`,
        `Sobrante: €${afterTax.toLocaleString('es-ES', { maximumFractionDigits: 0 })} - €${salary.toLocaleString('es-ES', { maximumFractionDigits: 0 })} - €${ssSalary.toLocaleString('es-ES', { maximumFractionDigits: 0 })} = €${grossDividends.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `A repartir (70%): €${dividends.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `(-) Impuesto dividendos (19%): €${dividendTax.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `(=) Dividendos netos: €${netDividends.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `--- Resultado ---`,
        `Sueldo neto (€${netSalary.toLocaleString('es-ES', { maximumFractionDigits: 0 })}) + Dividendos netos (€${netDividends.toLocaleString('es-ES', { maximumFractionDigits: 0 })})`,
        `= Beneficio Neto: €${netIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
      ],
      disadvantages: [
        'Modelos trimestrales obligatorios (IVA/IRPF)',
        'Flujo de caja retenido (Adelanto de IVA)'
      ]
    };
  };

  const calculateLLCSpain = (baseNetRevenue: number, b2c: boolean): ScenarioResult => {
    // Si vende B2C, la LLC gana un 21% extra de margen sobre los INGRESOS BRUTOS al no repercutir IVA
    const extraMargin = b2c ? (grossIncome * 0.21) : 0;
    const netRevenue = baseNetRevenue + extraMargin;

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

    // Desglose IRPF por tramos (para detailedBreakdown)
    const irpfTramosLLC: string[] = [];
    if (taxableIncome > 0) {
      const t1 = Math.min(taxableIncome, 12450) * 0.19;
      irpfTramosLLC.push(`Tramo 1 (hasta €12.450 al 19%): €${t1.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`);
      if (taxableIncome > 12450) {
        const t2 = Math.min(taxableIncome - 12450, 7750) * 0.24;
        irpfTramosLLC.push(`Tramo 2 (€12.450–€20.200 al 24%): €${t2.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`);
      }
      if (taxableIncome > 20200) {
        const t3 = Math.min(taxableIncome - 20200, 15000) * 0.30;
        irpfTramosLLC.push(`Tramo 3 (€20.200–€35.200 al 30%): €${t3.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`);
      }
      if (taxableIncome > 35200) {
        const t4 = Math.min(taxableIncome - 35200, 24800) * 0.37;
        irpfTramosLLC.push(`Tramo 4 (€35.200–€60.000 al 37%): €${t4.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`);
      }
      if (taxableIncome > 60000) {
        const t5 = (taxableIncome - 60000) * 0.45;
        irpfTramosLLC.push(`Tramo 5 (más de €60.000 al 45%): €${t5.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`);
      }
    }

    return {
      name: 'LLC + Residencia España',
      netIncome,
      taxes: irpf,
      socialSecurity,
      effectiveRate,
      requiresConsultation: true,
      breakdown: [
        `Ingresos LLC: €${netRevenue.toLocaleString('es-ES', { maximumFractionDigits: 0 })}${b2c ? ' (Incluye +21% de margen extra B2C)' : ''}`,
        `Cuota autónomos España: €${socialSecurity.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `IRPF España: €${irpf.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `Sin impuestos USA (no residente)`,
        `Beneficio neto: €${netIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
      ],
      detailedBreakdown: [
        `Ingresos Brutos: €${grossIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `(-) Gastos deducibles (${deductibleExpensesPercent}%): €${(grossIncome * deductibleExpensesPercent / 100).toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `(=) Beneficio Bruto Base: €${baseNetRevenue.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        ...(b2c ? [
          `(+) Margen extra B2C (21% de €${grossIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}): €${extraMargin.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
          `(=) Beneficio Bruto LLC: €${netRevenue.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
        ] : []),
        `(-) Cuota autónomos España: €${socialSecurity.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `(=) Base imponible IRPF: €${taxableIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `--- Desglose IRPF por tramos ---`,
        ...irpfTramosLLC,
        `(=) IRPF Total: €${irpf.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `Impuestos USA: €0 (entidad pass-through, no residente)`,
        `--- Resultado ---`,
        `Beneficio Bruto (€${netRevenue.toLocaleString('es-ES', { maximumFractionDigits: 0 })}) - SS (€${socialSecurity.toLocaleString('es-ES', { maximumFractionDigits: 0 })}) - IRPF (€${irpf.toLocaleString('es-ES', { maximumFractionDigits: 0 })})`,
        `= Beneficio Neto: €${netIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
      ],
      advantages: [
        'Sin declaraciones trimestrales de IVA',
        'Flujo de caja 100% libre para reinvertir',
        'Privacidad patrimonial absoluta'
      ]
    };
  };

  const calculateNomad = (baseNetRevenue: number, b2c: boolean): ScenarioResult => {
    const extraMargin = b2c ? (grossIncome * 0.21) : 0;
    const netRevenue = baseNetRevenue + extraMargin;

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
        `Ingresos: €${netRevenue.toLocaleString('es-ES', { maximumFractionDigits: 0 })}${b2c ? ' (Incluye +21% de margen extra B2C)' : ''}`,
        `Impuesto personal: €0 (0%)`,
        netRevenue > 102000
          ? `Impuesto corporativo (9% sobre >€102k): €${corporateTax.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
          : `Impuesto corporativo: €0 (exento hasta €102k)`,
        `Sin Seguridad Social`,
        `Beneficio neto: €${netIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
      ],
      detailedBreakdown: [
        `Ingresos Brutos: €${grossIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `(-) Gastos deducibles (${deductibleExpensesPercent}%): €${(grossIncome * deductibleExpensesPercent / 100).toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        `(=) Beneficio Bruto Base: €${baseNetRevenue.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
        ...(b2c ? [
          `(+) Margen extra B2C (21% de €${grossIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}): €${extraMargin.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
          `(=) Beneficio Bruto LLC: €${netRevenue.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
        ] : []),
        `--- Impuestos ---`,
        `IRPF personal (Dubái): €0 (0%)`,
        `Seguridad Social: €0`,
        netRevenue > 102000
          ? `Impuesto corporativo E.A.U. (9% sobre lo que exceda €102.000): (€${netRevenue.toLocaleString('es-ES', { maximumFractionDigits: 0 })} - €102.000) × 9% = €${corporateTax.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
          : `Impuesto corporativo E.A.U.: €0 (exento hasta €102.000)`,
        `--- Resultado ---`,
        `Beneficio Bruto (€${netRevenue.toLocaleString('es-ES', { maximumFractionDigits: 0 })}) - Impuestos (€${corporateTax.toLocaleString('es-ES', { maximumFractionDigits: 0 })})`,
        `= Beneficio Neto: €${netIncome.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
      ],
      advantages: [
        'Sin declaraciones trimestrales de IVA',
        'Flujo de caja 100% libre para reinvertir',
        'Privacidad patrimonial absoluta'
      ]
    };
  };

  const scenarios = showResults ? calculateScenarios() : [];

  const getCtaText = () => {
    if (scrollPosition < 800) return '🎙️ Hablar con Zara';
    if (scrollPosition < 2000) return '📅 Agendar Cita';
    return '🚀 Crear mi LLC';
  };

  const getCtaLink = () => {
    if (scrollPosition < 800) return '/hablar-con-zara';
    if (scrollPosition < 2000) return '/contacto';
    return '/crear-llc';
  };

  return (
    <>
      {/* ✅ NUEVO: Schema JSON-LD para SEO - ÚNICO CAMBIO */}


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
              href="/legal/terminos-calculadora"
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

          {/* ✅ NUEVO CHECKBOX B2C */}
          <div className={styles.checkboxGroup} style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
            <input
              type="checkbox"
              checked={isB2C}
              onChange={(e) => setIsB2C(e.target.checked)}
              className={styles.checkbox}
              id="b2c-accept"
            />
            <label htmlFor="b2c-accept" className={styles.checkboxLabel} style={{ color: '#0369a1', fontWeight: 500 }}>
              Mis clientes son particulares (B2C) fuera de EE.UU.
              <br />
              <small style={{ fontWeight: 400 }}>Aplica la exención del 21% de IVA como margen extra para la LLC.</small>
            </label>
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
            onClick={() => {
              setShowResults(true);
              setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}
            disabled={!acceptedLegal}
            className={styles.calculateButton}
          >
            Calcular Escenarios Fiscales →
          </button>
        </div>

        {/* Resultados */}
        {showResults && (
          <div className={styles.results} ref={resultsRef}>
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

                  {/* Botón desplegable: Detalle del cálculo */}
                  {scenario.detailedBreakdown && (
                    <div style={{ marginTop: '1rem' }}>
                      <button
                        onClick={() => setExpandedDetails(expandedDetails === index ? null : index)}
                        style={{
                          width: '100%',
                          padding: '0.6rem 1rem',
                          background: expandedDetails === index ? '#f0f9ff' : '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: '#334155',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>🔍 ¿Cómo se obtienen estas cifras?</span>
                        <span style={{ transform: expandedDetails === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                      </button>
                      {expandedDetails === index && (
                        <div style={{
                          marginTop: '0.5rem',
                          padding: '1rem',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          fontSize: '0.8rem',
                          lineHeight: '1.8',
                          color: '#475569'
                        }}>
                          {scenario.detailedBreakdown.map((line, idx) => (
                            <div key={idx} style={{
                              ...(line.startsWith('---') ? { fontWeight: 700, color: '#1e40af', marginTop: '0.75rem', marginBottom: '0.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem' } : {}),
                              ...(line.startsWith('=') ? { fontWeight: 700, color: '#15803d', fontSize: '0.85rem', marginTop: '0.25rem' } : {})
                            }}>
                              {line.startsWith('---') ? line.replace(/---/g, '').trim() : line}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

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

                  {/* ✅ NUEVO: Ventajas / Desventajas Operativas */}
                  {(scenario.advantages || scenario.disadvantages) && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                      <strong style={{ display: 'block', marginBottom: '0.75rem', color: '#334155' }}>⚡ Impacto Operativo (IVA / Flujo de caja)</strong>

                      {scenario.disadvantages?.map((dis, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', color: '#b91c1c' }}>
                          <span style={{ flexShrink: 0 }}>❌</span>
                          <span>{dis}</span>
                        </div>
                      ))}

                      {scenario.advantages?.map((adv, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', color: '#15803d' }}>
                          <span style={{ flexShrink: 0 }}>✅</span>
                          <span>{adv}</span>
                        </div>
                      ))}
                    </div>
                  )}

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
              <li>✅ Los resultados pueden variar de forma ostensible según el escenario</li>
            </ul>

            <p className={styles.legalFooter}>
              <strong>Open LLC USA NO se hace responsable</strong> de decisiones tomadas basándose
              exclusivamente en esta herramienta.
            </p>

            <p className={styles.legalUpdate}>
              <strong>Última actualización:</strong> 2 noviembre 2025 | <strong>Versión:</strong> 2.3.2
              <br />
              <a href="/legal/terminos-calculadora" target="_blank" className={styles.legalLink}>
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
