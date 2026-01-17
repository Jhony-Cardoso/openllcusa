import Link from 'next/link'
import { ArrowRight, Calculator, BookOpen, MessageCircle } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para dar el siguiente paso?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Agenda tu consulta gratuita y descubre cómo podemos ayudarte
          </p>
          <Link 
            href="/contacto"
            className="bg-white text-purple-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all inline-flex items-center justify-center gap-2 shadow-2xl transform hover:scale-105"
          >
            Agendar Consulta Gratuita
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-5">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Más Legal</h3>
            <p className="text-white/80">
              Nuestros abogados te orientan
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-5">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Soporte Dedicado</h3>
            <p className="text-white/80">
              Atención personalizada en español
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-5">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Videotutoriales Informativos</h3>
            <p className="text-white/80">
              Guías paso a paso para tu LLC
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
