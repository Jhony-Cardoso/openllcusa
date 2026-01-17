import { FileText, CreditCard, Building2, Lock, Users, Briefcase } from 'lucide-react'

export default function BenefitsGrid() {
  const benefits = [
    {
      icon: FileText,
      title: 'LLC sin Mínimo',
      description: 'No requieres capital mínimo ni accionistas locales para constituir tu LLC'
    },
    {
      icon: CreditCard,
      title: 'Cuenta Bancaria',
      description: 'Abrimos tu cuenta bancaria en EE.UU. y obtenemos tu EIN (Tax ID)'
    },
    {
      icon: Building2,
      title: 'Criptomonedas & PayPal',
      description: 'Acepta pagos con criptomonedas, PayPal y procesadores internacionales'
    },
    {
      icon: Lock,
      title: 'Privacidad Anónima',
      description: 'Protege tu identidad con estados que permiten LLCs anónimas'
    },
    {
      icon: Users,
      title: 'Crear y Facturar',
      description: 'Emite facturas profesionales y gestiona tu contabilidad fácilmente'
    },
    {
      icon: Briefcase,
      title: 'Inversiones Inmobiliarias',
      description: 'Compra propiedades en EE.UU. con protección patrimonial completa'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Descubre todas las ventajas de tener una empresa en EE.UU.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
