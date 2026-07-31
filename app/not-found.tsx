import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Página no encontrada',
  description: 'Lo sentimos, la página que buscas no existe.',
}

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-9xl font-extrabold text-blue-900 mb-6">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Página no encontrada
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Lo sentimos, no hemos podido encontrar la página que buscas. Es posible que el enlace esté roto o la página haya sido eliminada.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold rounded-full px-8 py-4 transition"
            style={{
              background: 'linear-gradient(135deg, #EA580C, #C2410C)',
              color: 'white',
              boxShadow: '0 6px 24px rgba(234,88,12,.38)',
              fontSize: '16px'
            }}
          >
            Volver a la portada <ArrowRight size={18} />
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-700 transition"
          >
            Contactar soporte
          </Link>
        </div>
      </div>
    </div>
  )
}
