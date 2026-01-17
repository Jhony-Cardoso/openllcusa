import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Título principal - 2 líneas */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Crea tu LLC en Estados Unidos
            <span className="block mt-2">en menos de 7 días</span>
          </h1>
          
          {/* Subtítulo - formato específico */}
          <p className="text-xl md:text-2xl mb-10 text-white/95 max-w-3xl mx-auto font-light leading-relaxed">
            Servicio completo en español, sin complicaciones,
            <span className="block mt-1">sin intermediarios y 100% online</span>
          </p>

          {/* CTAs principales */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/servicios/crear-llc"
              className="bg-white text-orange-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all inline-flex items-center justify-center gap-2 shadow-2xl hover:shadow-3xl transform hover:scale-105"
            >
              Comenzar
            </Link>
            <Link 
              href="/contacto"
              className="bg-transparent text-white px-10 py-4 rounded-full font-bold text-lg border-2 border-white hover:bg-white/10 transition-all inline-flex items-center justify-center"
            >
              Contactar Ahora
            </Link>
          </div>

          {/* Beneficios en línea */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span>Sin Proceso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span>100% en línea</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span>Sin costo adicional</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span>Soporte Multilenguaje</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust bar en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-red-500 to-orange-500 py-3">
        <div className="container mx-auto px-4">
          <p className="text-center text-white text-sm">
            🔥 <strong>OFERTA LANZAMIENTO</strong> 30% DE DESCUENTO EN TODOS LOS PAQUETES • 
            <span className="ml-2">Solo disponible hasta el 31 de octubre</span>
          </p>
        </div>
      </div>
    </section>
  )
}
