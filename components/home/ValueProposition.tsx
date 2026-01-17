import { Shield, Zap, Globe, Award } from 'lucide-react'

export default function ValueProposition() {
  const benefits = [
    {
      icon: Shield,
      title: 'Separación Completa',
      description: 'Protege tus activos personales de responsabilidades empresariales y asegura tu patrimonio',
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Zap,
      title: 'Estructura Fiscal',
      description: 'Estructura de impuestos que te ofrece la oportunidad de incrementar tus ganancias netas',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Globe,
      title: 'Presencia Global',
      description: 'Accede a mercados internacionales y sistemas de pago que solo aceptan empresas de EE.UU.',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Award,
      title: 'Imagen Corporativa',
      description: 'Genera mayor confianza en tus clientes y socios comerciales con una empresa estadounidense',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tu socio de confianza para expandir tu negocio a Estados Unidos
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div 
                key={index}
                className="text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-6 ${benefit.bgColor} rounded-2xl flex items-center justify-center`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
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
