'use client'

import { useState } from 'react'

export default function StateSelector() {
  const [selectedState, setSelectedState] = useState('Wyoming')

  const states = [
    { name: 'Wyoming', fee: 100 },
    { name: 'Delaware', fee: 150 },
    { name: 'Florida', fee: 125 },
    { name: 'Nevada', fee: 175 },
    { name: 'Texas', fee: 300 }
  ]

  return (
    <div className="max-w-2xl mx-auto mb-12 bg-white p-6 rounded-xl shadow-md">
      <label className="block text-center mb-4">
        <span className="text-lg font-semibold text-gray-900">Selecciona el estado:</span>
      </label>
      <select 
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
        className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:border-blue-500 focus:outline-none cursor-pointer"
      >
        {states.map(state => (
          <option key={state.name} value={state.name}>
            {state.name} (Tasas estatales: ${state.fee})
          </option>
        ))}
      </select>
      <p className="text-sm text-gray-600 text-center mt-3">
        Los precios se actualizarán según el estado seleccionado
      </p>
    </div>
  )
}
