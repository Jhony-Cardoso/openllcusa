'use client'

import { useState } from 'react'

type StateInfo = {
  id: string
  name: string
  creationFee: number
  annualFee: number
  agentFee: number
  hiddenFees: number
  description: string
}

const states: StateInfo[] = [
  {
    id: 'wyoming',
    name: 'Wyoming',
    creationFee: 102,
    annualFee: 62,
    agentFee: 49,
    hiddenFees: 0,
    description: 'El estado #1 para e-commerce. Máxima privacidad, costos anuales muy bajos y sin franquicias ocultas.',
  },
  {
    id: 'new-mexico',
    name: 'Nuevo México',
    creationFee: 50,
    annualFee: 0,
    agentFee: 49,
    hiddenFees: 0,
    description: 'El más económico a largo plazo. No hay tarifa estatal anual de mantenimiento.',
  },
  {
    id: 'delaware',
    name: 'Delaware',
    creationFee: 90,
    annualFee: 300,
    agentFee: 49,
    hiddenFees: 0,
    description: 'Ideal solo para startups buscando rondas de inversión. Su Franchise Tax anual es de $300 obligatorios.',
  },
  {
    id: 'florida',
    name: 'Florida (No recomendado online)',
    creationFee: 125,
    annualFee: 138.75,
    agentFee: 49,
    hiddenFees: 0,
    description: 'Alta exposición pública (cero privacidad) y multas de $400 por retrasos en el reporte anual.',
  },
]

export default function CostCalculator() {
  const [selectedState, setSelectedState] = useState<string>('wyoming')
  
  const currentState = states.find(s => s.id === selectedState) || states[0]

  // Competitor comparison logic
  const competitorCreation = currentState.creationFee + 150 // Competidores suelen inflar $150
  const competitorEIN = 100 // Muchas agencias cobran EIN aparte
  const competitorAgent = 150 // Promedio mercado agente
  const competitorTotalYear1 = competitorCreation + competitorEIN + competitorAgent
  
  const ourPackageBase = 299 // Precio promedio paquete base

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mt-8">
      <div className="bg-slate-900 p-6 text-white">
        <h3 className="text-2xl font-bold mb-2 text-slate-50">Calculadora de Costos (Año 1)</h3>
        <p className="text-slate-300">Descubre cuánto pagarás realmente según el estado.</p>
      </div>
      
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
            1. Selecciona el Estado de tu LLC
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {states.map(state => (
              <button
                key={state.id}
                onClick={() => setSelectedState(state.id)}
                className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 border-2 ${
                  selectedState === state.id 
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                {state.name}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500 bg-slate-50 p-3 rounded border border-slate-100">
            <strong>💡 Nota del experto:</strong> {currentState.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* El Costo Real (Open LLC USA) */}
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 relative">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl uppercase tracking-wider">
              Con Open LLC USA
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-4">Lo que pagas el primer año</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex justify-between text-slate-700">
                <span>Tarifa del Estado ({currentState.name})</span>
                <span className="font-semibold">${currentState.creationFee}</span>
              </li>
              <li className="flex justify-between text-slate-700">
                <span>Agente Registrado (Año 1)</span>
                <span className="font-semibold text-green-600">INCLUIDO</span>
              </li>
              <li className="flex justify-between text-slate-700">
                <span>Gestión EIN y Documentos</span>
                <span className="font-semibold text-green-600">INCLUIDO</span>
              </li>
            </ul>
            <div className="pt-4 border-t border-blue-200 flex justify-between items-center">
              <span className="font-bold text-slate-900">Total transparente:</span>
              <span className="text-3xl font-extrabold text-blue-600">${ourPackageBase}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">*Paquete Base. Incluye los ${currentState.creationFee} del estado.</p>
          </div>

          {/* Agencias Promedio (Competencia) */}
          <div className="bg-red-50/30 p-6 rounded-xl border border-red-100 opacity-90">
            <h4 className="text-lg font-bold text-slate-900 mb-4">Competencia (Costo Oculto)</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex justify-between text-slate-600">
                <span>Tarifa Estado + Trámite</span>
                <span>~${competitorCreation}</span>
              </li>
              <li className="flex justify-between text-slate-600 line-through decoration-red-400">
                <span>Agente Registrado</span>
                <span className="text-red-500">+$150 extra</span>
              </li>
              <li className="flex justify-between text-slate-600 line-through decoration-red-400">
                <span>Trámite EIN (Extranjeros)</span>
                <span className="text-red-500">+$100 extra</span>
              </li>
            </ul>
            <div className="pt-4 border-t border-red-200 flex justify-between items-center">
              <span className="font-bold text-slate-900">Total esperado:</span>
              <span className="text-3xl font-extrabold text-slate-400">~${competitorTotalYear1}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Muchos te atraen con un precio base de $40 y luego suman el resto.</p>
          </div>
        </div>

        {/* Costo de Renovación */}
        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h4 className="font-bold text-slate-900">🔮 Costo de Mantenimiento Anual (Año 2 en adelante)</h4>
            <p className="text-sm text-slate-600">
              Pagarás ${currentState.annualFee} al estado de {currentState.name} + ${currentState.agentFee} por tu Agente Registrado.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 text-right">
            <span className="block text-2xl font-bold text-slate-900">${currentState.annualFee + currentState.agentFee} / año</span>
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">SIN SORPRESAS</span>
          </div>
        </div>
      </div>
    </div>
  )
}
