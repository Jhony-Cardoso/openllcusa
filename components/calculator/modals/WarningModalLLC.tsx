'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface WarningModalLLCProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

export default function WarningModalLLC({ 
  isOpen, 
  onClose, 
  onAccept 
}: WarningModalLLCProps) {
  const router = useRouter()

  // Prevenir scroll cuando modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Función para hablar con especialista
  const handleContactSpecialist = () => {
    onClose()
    router.push('/contacto')
  }

  // Función para continuar con el proceso
  const handleContinue = () => {
    onAccept()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto"
      aria-labelledby="modal-warning-llc"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay oscuro */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={onClose}
      />

      {/* Modal - CAMBIO: Añadido padding top/bottom y max-height */}
      <div className="flex min-h-full items-center justify-center p-4 py-8 sm:py-12">
        <div 
          className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-auto overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con degradado */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 sm:px-8 sm:py-6 flex-shrink-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-white rounded-full p-2 sm:p-3 flex-shrink-0">
                <svg 
                  className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  ⚠️ Importante: Considera esto antes de continuar
                </h3>
                <p className="text-orange-100 mt-1 text-sm sm:text-base">
                  LLC con gestión desde España
                </p>
              </div>
            </div>
          </div>

          {/* Contenido del modal - CAMBIO: Añadido overflow-y-auto y tamaño de texto reducido */}
          <div className="px-6 py-4 sm:px-8 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
            {/* Advertencias - CAMBIO: Texto más pequeño */}
            <div className="space-y-3 sm:space-y-4">
              {/* Advertencia 1 */}
              <div className="flex gap-3 p-3 sm:p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                <div className="flex-shrink-0">
                  <span className="text-xl sm:text-2xl">🏢</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                    Puede constituir <strong>establecimiento permanente</strong> según la AEAT
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Tributando como sociedad española (25%)
                  </p>
                </div>
              </div>

              {/* Advertencia 2 */}
              <div className="flex gap-3 p-3 sm:p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                <div className="flex-shrink-0">
                  <span className="text-xl sm:text-2xl">📋</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                    <strong>Obligaciones en 2 jurisdicciones:</strong> IRS (EE.UU.) + AEAT (España)
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Declaraciones fiscales en ambos países
                  </p>
                </div>
              </div>

              {/* Advertencia 3 */}
              <div className="flex gap-3 p-3 sm:p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                <div className="flex-shrink-0">
                  <span className="text-xl sm:text-2xl">💰</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                    Costes de cumplimiento <strong>ligeramente superiores</strong> a una SL española
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Gastos en asesoría fiscal internacional
                  </p>
                </div>
              </div>

              {/* Advertencia 4 */}
              <div className="flex gap-3 p-3 sm:p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                <div className="flex-shrink-0">
                  <span className="text-xl sm:text-2xl">⚖️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                    Riesgo de <strong>doble imposición</strong>
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Si no se estructura correctamente
                  </p>
                </div>
              </div>
            </div>

            {/* Nota informativa - CAMBIO: Texto más pequeño */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-xs sm:text-sm text-blue-800 flex-1">
                  <p className="font-semibold mb-1">💡 Recomendación</p>
                  <p>
                    Te recomendamos <strong>consultar con un asesor fiscal</strong> antes de proceder 
                    para asegurar que una LLC es la mejor opción para tu caso específico.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer con botones */}
          <div className="bg-gray-50 px-6 py-4 sm:px-8 sm:py-6 flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Botón principal: Hablar con especialista */}
              <button 
                onClick={handleContactSpecialist}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Hablar con especialista
              </button>

              {/* Botón secundario: Continuar de todas formas */}
              <button 
                onClick={handleContinue}
                className="flex-1 bg-white text-gray-700 px-4 py-3 sm:px-6 sm:py-4 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Continuar de todas formas
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            {/* Texto pequeño de ayuda */}
            <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-3 sm:mt-4">
              Puedes cerrar este aviso haciendo clic fuera del modal
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}