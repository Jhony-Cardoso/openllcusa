'use client'

import React from 'react'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Check } from 'lucide-react'

interface OnboardingLayoutProps {
  children: React.ReactNode
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useParams()

  const slug = (params?.slug as string) || ''
  const pedidoId = searchParams.get('pedido')
  const isEIN = slug === 'obtencion-ein'

  const getCurrentStep = () => {
    if (pathname.includes('/completado')) return 6

    if (isEIN) {
      if (pathname.includes('/checkout')) return 2
      if (pathname.includes('/estado')) return 3
      if (pathname.includes('/datos-empresa')) return 4
      if (pathname.includes('/revision')) return 5
      return 1
    }

    if (pathname.includes('/estado')) return 2
    if (pathname.includes('/datos-empresa')) return 3
    if (pathname.includes('/revision')) return 4
    if (pathname.includes('/checkout')) return 5
    return 1
  }

  const currentStep = getCurrentStep()

  const steps = isEIN
    ? [
        { id: 1, name: 'Elegibilidad', path: '' },
        { id: 2, name: 'Pago', path: '/checkout' },
        { id: 3, name: 'LLC', path: '/estado' },
        { id: 4, name: 'Responsible', path: '/datos-empresa' },
        { id: 5, name: 'Revisión', path: '/revision' },
        { id: 6, name: 'Completado', path: '/completado' },
      ]
    : [
        { id: 1, name: 'Servicio', path: '' },
        { id: 2, name: 'Estado', path: '/estado' },
        { id: 3, name: 'Datos', path: '/datos-empresa' },
        { id: 4, name: 'Revisión', path: '/revision' },
        { id: 5, name: 'Pago', path: '/checkout' },
        { id: 6, name: 'Completado', path: '/completado' },
      ]

  const goTo = (path: string) => {
    const base = `/servicios/${slug}/onboarding${path}`
    router.push(pedidoId ? `${base}?pedido=${pedidoId}` : base)
  }

  const handleBack = () => {
    const prev = steps.find((s) => s.id === currentStep - 1)
    if (prev) goTo(prev.path)
    else router.back()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="text-sm text-gray-600 underline"
        >
          ← Atrás
        </button>
        <div className="text-sm text-gray-500">
          Paso {currentStep} de {steps.length}
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto">
        {steps.map((step, idx) => {
          const isDone = step.id < currentStep
          const isActive = step.id === currentStep

          return (
            <div key={step.id} className="flex items-center gap-3">
              <div
                className={[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border',
                  isDone
                    ? 'bg-green-600 text-white border-green-600'
                    : isActive
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-500 border-gray-300',
                ].join(' ')}
                aria-label={step.name}
                title={step.name}
              >
                {isDone ? <Check size={16} /> : step.id}
              </div>

              <div className="text-sm whitespace-nowrap">
                <span className={isActive ? 'font-semibold text-gray-900' : 'text-gray-500'}>
                  {step.name}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div className="w-10 h-[2px] bg-gray-200" />
              )}
            </div>
          )
        })}
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  )
}
