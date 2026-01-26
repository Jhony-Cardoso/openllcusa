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

  const paqueteSlug = (params?.paqueteSlug as string) || ''
  const pedidoId = searchParams.get('pedido')

  const getCurrentStep = () => {
    if (pathname.includes('/estado')) return 2
    if (pathname.includes('/datos-empresa')) return 3
    if (pathname.includes('/revision')) return 4
    if (pathname.includes('/checkout')) return 5
    return 1
  }

  const currentStep = getCurrentStep()

  const steps = [
    { id: 1, name: 'Servicio', path: '' },
    { id: 2, name: 'Estado', path: '/estado' },
    { id: 3, name: 'Datos', path: '/datos-empresa' },
    { id: 4, name: 'Revisión', path: '/revision' },
    { id: 5, name: 'Pago', path: '/checkout' },
  ]

  const goTo = (path: string) => {
    const base = `/paquetes/${paqueteSlug}/onboarding${path}`
    const url = pedidoId ? `${base}?pedido=${pedidoId}` : base
    router.push(url)
  }

  const handleBack = () => {
    // Back “inteligente”: según el paso actual, va al anterior dentro del onboarding
    if (currentStep === 1) {
      router.push(`/paquetes/${paqueteSlug}`)
      return
    }
    const prev = steps.find((s) => s.id === currentStep - 1)
    if (prev) goTo(prev.path)
    else router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="text-sm text-gray-600 underline"
            >
              ← Atrás
            </button>
            <h1 className="text-2xl font-bold text-blue-600">Open LLC USA</h1>
          </div>

          <span className="text-sm text-gray-500">
            Paso {currentStep} de {steps.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => {
                    // Dejar que el usuario vuelva a pasos anteriores (UX)
                    if (step.id <= currentStep) goTo(step.path)
                  }}
                  className="flex flex-col items-center flex-1"
                >
                  <div
                    className={[
                      'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200',
                      step.id < currentStep
                        ? 'bg-green-500 text-white'
                        : step.id === currentStep
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-gray-200 text-gray-500',
                    ].join(' ')}
                  >
                    {step.id < currentStep ? <Check size={20} /> : step.id}
                  </div>

                  <span
                    className={[
                      'mt-2 text-xs font-medium',
                      step.id === currentStep ? 'text-blue-600' : 'text-gray-500',
                    ].join(' ')}
                  >
                    {step.name}
                  </span>
                </button>

                {index < steps.length - 1 && (
                  <div
                    className={[
                      'flex-1 h-1 mx-4 transition-colors duration-200',
                      step.id < currentStep ? 'bg-green-500' : 'bg-gray-200',
                    ].join(' ')}
                    style={{ marginTop: '-24px' }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main>{children}</main>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between text-sm text-gray-600">
          <span>
            ¿Necesitas ayuda?{' '}
            <a href="/contacto" className="text-blue-600 hover:underline">
              Contáctanos
            </a>
          </span>
          <span className="flex items-center gap-2">
            <span className="text-green-500">●</span> Proceso 100% seguro
          </span>
        </div>
      </div>
    </div>
  )
}
