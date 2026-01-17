'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

export default function PricingCards() {
  const [selectedState, setSelectedState] = useState('Wyoming')

  // Precios base según tu HTML
  const packages = [
    {
      name: 'BASIC',
      subtitle: 'Ideal para arrancar',
      basePrice: 249,
      stateFee: 100,
      features: [
        'Registered Agent (1 año)',
        'Operating Agreement',
        'EIN (Tax ID)',
        'Certificado de constitución',
        'Asesoría inicial en español'
      ],
      popular: false
    },
    {
      name: 'PRO',
      subtitle: 'Todo lo que necesitas',
      basePrice: 399,
      stateFee: 100,
      features: [
        'Todo lo incluido en BASIC',
        'Cuenta bancaria USA (ayuda)',
        'Resoluciones corporativas',
        'Kit de bienvenida digital',
        'Asesoría fiscal básica',
        'Soporte prioritario'
      ],
      popular: true
    },
    {
      name: 'FULL',
      subtitle: 'Servicio completo',
      basePrice: 749,
      stateFee: 100,
      features: [
        'Todo lo incluido en PRO',
        'Gestión de renovaciones',
        'Servicio de mail forwarding',
        'Reportes de cumplimiento',
        'Asesoría fiscal avanzada',
        'Soporte VIP 24/7',
        'Consultoría estratégica'
      ],
      popular: false
    }
  ]

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {packages.map((pkg, index) => {
        const totalPrice = pkg.basePrice + pkg.stateFee
        
        return (
          <div 
            key={index}
            className={`relative rounded-2xl p-8 ${
              pkg.popular 
                ? 'bg-blue-600 text-white shadow-2xl scale-105' 
                : 'bg-white text-gray-900 shadow-lg'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                MÁS POPULAR
              </div>
            )}

            {/* Nombre del paquete */}
            <div className="text-center mb-6">
              <h3 className={`text-2xl font-bold mb-2 ${pkg.popular ? 'text-white' : 'text-gray-900'}`}>
                {pkg.name}
              </h3>
              <p className={`text-sm ${pkg.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                {pkg.subtitle}
              </p>
            </div>

            {/* Precio */}
            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl font-semibold">$</span>
                <span className="text-5xl font-bold">{pkg.basePrice}</span>
              </div>
              <p className={`text-sm mt-2 ${pkg.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                + ${pkg.stateFee} tasas = ${totalPrice}
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-4 mb-8">
              {pkg.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    pkg.popular ? 'text-blue-200' : 'text-green-500'
                  }`} />
                  <span className={`text-sm ${pkg.popular ? 'text-white' : 'text-gray-700'}`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
              pkg.popular
                ? 'bg-white text-blue-600 hover:bg-blue-50'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}>
              Seleccionar {pkg.name}
            </button>
          </div>
        )
      })}
    </div>
  )
}
