import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, FileText, Landmark, Key, Rocket } from 'lucide-react'

export const metadata: Metadata = {
  title: 'El Proceso: Cómo Creamos tu LLC Paso a Paso | Open LLC USA',
  description: 'Conoce el paso a paso exacto de cómo registramos tu LLC en Estados Unidos, obtenemos el EIN y abrimos tu cuenta bancaria. Proceso 100% online y transparente.',
  alternates: {
    canonical: 'https://openllcusa.com/proceso',
  },
  openGraph: {
    title: 'Cómo Creamos tu LLC Paso a Paso',
    description: 'Conoce el paso a paso exacto de cómo registramos tu LLC en Estados Unidos, obtenemos el EIN y abrimos tu cuenta bancaria.',
    url: 'https://openllcusa.com/proceso',
    images: [{ url: 'https://openllcusa.com/images/hero.webp', width: 1200, height: 630 }],
  }
}

export default function ProcesoPage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Cómo crear una LLC en Estados Unidos desde el extranjero",
    "description": "Proceso paso a paso para abrir una LLC en EE.UU. sin viajar y sin ser residente.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Paso 1: Solicitud y Selección de Estado",
        "text": "Completa el formulario en 5 minutos eligiendo tu estado (ej. Wyoming o Delaware) y nombre de empresa.",
        "url": "https://openllcusa.com/proceso#paso-1"
      },
      {
        "@type": "HowToStep",
        "name": "Paso 2: Registro del Certificate of Formation",
        "text": "Nosotros enviamos los documentos al Secretario de Estado. Aprobación en 24-48 horas en estados como Wyoming.",
        "url": "https://openllcusa.com/proceso#paso-2"
      },
      {
        "@type": "HowToStep",
        "name": "Paso 3: Obtención del EIN ante el IRS",
        "text": "Tramitamos tu Employer Identification Number (EIN) sin necesidad de SSN o ITIN.",
        "url": "https://openllcusa.com/proceso#paso-3"
      },
      {
        "@type": "HowToStep",
        "name": "Paso 4: Apertura de Cuenta Bancaria",
        "text": "Recibes las guías y documentación para abrir tu cuenta en dólares (ej. Mercury o Relay).",
        "url": "https://openllcusa.com/proceso#paso-4"
      }
    ]
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <div className="max-w-4xl mx-auto py-24 px-4 sm:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Nuestro Proceso</h1>
          <p className="text-xl text-slate-600">
            Formar tu LLC en Estados Unidos nunca ha sido tan sencillo. 
            Nos encargamos de todo el papeleo pesado.
          </p>
        </div>

        <div className="space-y-12">
          {/* Paso 1 */}
          <div id="paso-1" className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <FileText size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">1. Solicitud Express</h3>
              <p className="text-slate-600 leading-relaxed">
                Rellenas nuestro formulario inteligente en menos de 5 minutos. 
                Solo necesitamos el nombre deseado para tu LLC y una copia de tu pasaporte.
              </p>
            </div>
          </div>

          {/* Paso 2 */}
          <div id="paso-2" className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Landmark size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">2. Registro Estatal</h3>
              <p className="text-slate-600 leading-relaxed">
                Actuamos como tu Agente Registrado y archivamos el "Certificate of Formation" ante el estado. 
                En estados como Wyoming, suele aprobarse en 24-48 horas.
              </p>
            </div>
          </div>

          {/* Paso 3 */}
          <div id="paso-3" className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
              <Key size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">3. Trámite del EIN</h3>
              <p className="text-slate-600 leading-relaxed">
                Una vez creada la LLC, contactamos al IRS para obtener tu número de identificación fiscal (EIN). 
                Lo conseguimos sin que tengas Número de Seguro Social (SSN).
              </p>
            </div>
          </div>

          {/* Paso 4 */}
          <div id="paso-4" className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              <Rocket size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">4. Apertura Bancaria</h3>
              <p className="text-slate-600 leading-relaxed">
                Te entregamos todos los documentos legales de tu LLC junto con nuestra guía de apertura. 
                Estarás listo para abrir tu cuenta en bancos como Mercury y vincular pasarelas como Stripe.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/precios" className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition">
            Comenzar mi LLC Ahora
          </Link>
        </div>
      </div>
    </main>
  )
}
