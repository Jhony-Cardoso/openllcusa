'use client'

import { InlineWidget } from 'react-calendly'
import { Mail, Clock, Shield, Calendar, Mic } from 'lucide-react'

export default function ContactoPage() {
  const handleCarlaClick = () => {
    alert('¡Hola! Soy Carla, tu asistente virtual. Pronto estaré disponible para ayudarte 24/7.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-sky-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Agenda tu Consulta Gratuita
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-blue-100">
            Habla con nuestro equipo de expertos y descubre cómo crear tu LLC en EE.UU. 
            en solo 72 horas, sin complicaciones.
          </p>
        </div>
      </section>

      {/* Información de contacto rápida */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 justify-center">
              <Mail className="text-blue-600" size={24} />
              <div>
                <p className="font-semibold">Email</p>
                <a href="mailto:info@openllcusa.com" className="text-gray-600 hover:text-blue-600">
                  info@openllcusa.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center">
              <Clock className="text-blue-600" size={24} />
              <div>
                <p className="font-semibold">Horario</p>
                <p className="text-gray-600">Lun - Vie: 9:00 - 18:00 CET</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center">
              <Shield className="text-blue-600" size={24} />
              <div>
                <p className="font-semibold">Respuesta</p>
                <p className="text-gray-600">En menos de 24h</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Beneficios + Calendly */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Columna izquierda: Beneficios */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  ¿Por qué agendar una consulta?
                </h2>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <Calendar className="text-blue-600 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Asesoramiento personalizado
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Analizamos tu caso específico y te recomendamos la mejor estructura legal y fiscal.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <div className="flex items-start gap-3">
                  <Shield className="text-green-600 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Sin compromiso
                    </h3>
                    <p className="text-gray-600 text-sm">
                      La primera consulta es 100% gratuita. Resolvemos todas tus dudas sin presión.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                <div className="flex items-start gap-3">
                  <Clock className="text-purple-600 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Respuestas inmediatas
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Reuniones de hasta 30 minutos donde respondemos tus preguntas en tiempo real.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  📋 Qué preparar para la reunión:
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Descripción breve de tu negocio o proyecto</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Dudas específicas sobre LLC, fiscalidad o trámites</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Tu situación fiscal actual (España u otro país)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Columna derecha: Widget de Calendly */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-sky-400 text-white p-6">
                  <h2 className="text-2xl font-bold mb-2">
                    Selecciona día y hora
                  </h2>
                  <p className="text-blue-100">
                    Elige el momento que mejor te convenga para hablar con nosotros
                  </p>
                </div>

                {/* Widget de Calendly */}
                <div className="p-6 bg-gray-50">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm" style={{ minHeight: '700px' }}>
                    <InlineWidget 
                      url="https://calendly.com/atlaslegal7/30min"
                      styles={{
                        height: '700px',
                      }}
                      pageSettings={{
                        backgroundColor: 'ffffff',
                        hideEventTypeDetails: false,
                        hideLandingPageDetails: false,
                        primaryColor: '4F46E5',
                        textColor: '1F2937'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Nota de privacidad */}
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                  🔒 Tus datos están seguros. Lee nuestra{' '}
                  <a href="/legal/privacy-policy" className="text-blue-600 hover:underline">
                    Política de Privacidad
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de contacto alternativo con Carla */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            ¿Prefieres contactarnos de otra forma?
          </h2>
          <p className="text-gray-600 mb-8">
            También puedes escribirnos un email o hablar con Carla ahora mismo
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
              <Mail className="text-blue-600 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">Envíanos un email</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Responderemos en menos de 24 horas
              </p>
              <a 
                href="mailto:info@openllcusa.com"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                info@openllcusa.com
              </a>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
              <Mic className="text-purple-600 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">Habla con Carla</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Si no quieres esperar, habla <strong>AHORA</strong> con Carla.<br />Está disponible 24/7
              </p>
              <button 
                onClick={handleCarlaClick}
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors cursor-pointer"
              >
                🎙️ Hablar con Carla
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ rápida */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Preguntas frecuentes sobre la consulta
          </h2>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                ¿Realmente es gratis?
              </h3>
              <p className="text-gray-600">
                Sí, la primera consulta de 30 minutos es 100% gratuita y sin compromiso. 
                Nuestro objetivo es entender tu caso y ver cómo podemos ayudarte.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                ¿Qué pasa si no puedo asistir?
              </h3>
              <p className="text-gray-600">
                No hay problema. Puedes cancelar o reprogramar tu cita directamente desde 
                el email de confirmación que recibirás al agendar.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                ¿La reunión es por videollamada?
              </h3>
              <p className="text-gray-600">
                Sí, utilizamos Google Meet o Zoom (tú eliges). Recibirás el enlace 
                automáticamente al confirmar tu cita.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                ¿Puedo agendar fuera del horario mostrado?
              </h3>
              <p className="text-gray-600">
                Si necesitas un horario especial, escríbenos a info@openllcusa.com y 
                coordinaremos una reunión que se ajuste a tu disponibilidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-sky-400 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para dar el primer paso?
          </h2>
          <p className="text-xl text-blue-100 mb-6">
            Miles de emprendedores ya confiaron en nosotros para crear su LLC en EE.UU.
          </p>
          <a 
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            📅 Agendar mi consulta gratuita
          </a>
        </div>
      </section>
    </div>
  )
}


