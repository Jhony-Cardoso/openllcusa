// DÓNDE: app/components/calculator/VariationRanges.tsx
// PROPÓSITO: Mostrar rango mínimo-máximo de variación

'use client';

interface VariationRangesProps {
  scenario: string;
  baseResult: number;
  income: number;
}

// Configuración de rangos por escenario
const VARIATION_CONFIG = {
  autonomo: {
    min: 0.92,  // -8%
    max: 1.15,  // +15%
    factors: [
      'Deducciones específicas por actividad',
      'Gastos deducibles no contemplados',
      'Bonificaciones autonómicas',
      'Situación personal (hijos, discapacidad)'
    ]
  },
  sl: {
    min: 0.88,  // -12%
    max: 1.22,  // +22%
    factors: [
      'Estrategia de retribución (salario vs dividendos)',
      'Incentivos fiscales por I+D+i',
      'Reserva de capitalización',
      'Diferencias autonómicas en IS'
    ]
  },
  llc_spain: {
    min: 0.75,  // -25%
    max: 1.35,  // +35%
    factors: [
      'Tratado de doble imposición aplicable',
      'Costes de cumplimiento internacional',
      'Riesgo de establecimiento permanente',
      'Fluctuaciones de tipo de cambio'
    ]
  },
  international_nomad: {
    min: 0.65,  // -35%
    max: 1.85,  // +85%
    factors: [
      'Coste de vida en país de destino',
      'Requisitos de sustancia económica',
      'Viajes frecuentes a España (riesgo fiscal)',
      'Corporate Tax según jurisdicción'
    ]
  }
};

export default function VariationRanges({ scenario, baseResult, income }: VariationRangesProps) {
  const config = VARIATION_CONFIG[scenario as keyof typeof VARIATION_CONFIG];
  
  if (!config) return null;

  const minValue = baseResult * config.min;
  const maxValue = baseResult * config.max;
  const minPercentage = ((minValue / income) * 100).toFixed(1);
  const maxPercentage = ((maxValue / income) * 100).toFixed(1);

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mt-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        📊 Rango de Variación Esperado
      </h3>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Mejor escenario</span>
          <span className="text-sm text-gray-600">Peor escenario</span>
        </div>
        
        {/* Barra visual */}
        <div className="relative h-12 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-lg flex items-center justify-between px-4">
          <div className="text-sm font-bold text-green-800">
            {minValue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}
            <div className="text-xs">({minPercentage}%)</div>
          </div>
          <div className="text-sm font-bold text-red-800">
            {maxValue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}
            <div className="text-xs">({maxPercentage}%)</div>
          </div>
        </div>
      </div>

      {/* Factores de variación */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">
          Factores que pueden afectar el resultado:
        </h4>
        <ul className="space-y-1">
          {config.factors.map((factor, index) => (
            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-blue-600">•</span>
              {factor}
            </li>
          ))}
        </ul>
      </div>

      {/* Advertencia */}
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
        <p className="text-xs text-gray-700">
          ⚠️ <strong>Importante:</strong> Tu resultado real puede estar en cualquier punto de este rango 
          (o incluso fuera) dependiendo de tus circunstancias específicas. Consulta con un asesor para un cálculo exacto.
        </p>
      </div>
    </div>
  );
}
