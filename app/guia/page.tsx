import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, ArrowRight, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Guías y Recursos sobre LLCs en Estados Unidos | Open LLC USA',
  description: 'Aprende todo sobre cómo abrir y mantener tu LLC desde el extranjero. Guías paso a paso sobre estados, cuentas bancarias, LLC vs Corporation e impuestos.',
}

const guides = [
  {
    slug: 'como-abrir-llc-desde-el-extranjero',
    title: 'Cómo abrir una LLC desde el extranjero (Guía Definitiva)',
    desc: 'Todo lo que necesitas saber para crear tu empresa en Estados Unidos sin tener visa, ni SSN, de forma 100% online.',
    readTime: '8 min'
  },
  {
    slug: 'que-estado-elegir-para-tu-llc',
    title: '¿Qué estado elegir para tu LLC? Wyoming vs Delaware vs New Mexico',
    desc: 'Compara costos, anonimato y ventajas competitivas de los mejores estados para no residentes.',
    readTime: '6 min'
  },
  {
    slug: 'llc-vs-corporation-no-residentes',
    title: 'LLC vs C-Corporation para Extranjeros: ¿Cuál te conviene?',
    desc: 'Diferencias clave en impuestos, rondas de inversión y gestión diaria. Descubre qué estructura necesita tu negocio.',
    readTime: '7 min'
  },
  {
    slug: 'cuenta-bancaria-llc-sin-ssn',
    title: 'Cómo abrir una cuenta bancaria empresarial en EE.UU. sin SSN',
    desc: 'Las mejores opciones bancarias y fintechs (Mercury, Relay, Wise) para LLCs de dueños extranjeros.',
    readTime: '5 min'
  },
  {
    slug: 'obligaciones-fiscales-llc-extranjero',
    title: 'Obligaciones Fiscales del IRS para LLCs de No Residentes',
    desc: 'Evita multas de $25,000. Conoce los formularios obligatorios como el Form 5472 y 1120, incluso si no tienes ingresos.',
    readTime: '10 min'
  }
]

export default function GuiasIndexPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Guías y Recursos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Aprende a estructurar, abrir y escalar tu negocio en Estados Unidos con nuestra biblioteca de conocimiento para fundadores internacionales.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {guides.map((guide, i) => (
            <Link 
              key={i} 
              href={`/guia/${guide.slug}`}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col md:flex-row gap-6 items-start md:items-center"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <BookOpen size={28} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2 font-medium">
                  <span className="flex items-center gap-1"><Clock size={14} /> {guide.readTime} de lectura</span>
                  <span className="flex items-center gap-1"><User size={14} /> Equipo Legal</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {guide.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {guide.desc}
                </p>
              </div>
              <div className="shrink-0 hidden md:flex items-center justify-center text-blue-600 bg-blue-50 p-4 rounded-full group-hover:bg-blue-100 transition-colors">
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  )
}
