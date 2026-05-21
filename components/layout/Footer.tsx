'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0f172a] text-slate-300 pt-16 pb-32 md:pb-10">   {/* ← pb-24 en móvil */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-12 gap-x-8">
          
          {/* Columna 1: Marca */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">Open LLC USA</h3>
            <p className="text-slate-400 max-w-md leading-relaxed">
              Ayudamos a emprendedores de España y Latinoamérica a crear y gestionar su LLC en Estados Unidos de forma profesional, rápida y 100% remota.
            </p>
          </div>

          {/* Columna 2: Explorar */}
          <div>
            <h4 className="font-semibold text-white mb-4">Explorar</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/calculadora-fiscal" className="hover:text-white transition-colors">Calculadora Fiscal</Link></li>
              <li><Link href="/quiz" className="hover:text-white transition-colors">Quiz: ¿Es una LLC para ti?</Link></li>
              <li><Link href="/servicios" className="hover:text-white transition-colors">Todos los Servicios</Link></li>
              <li><Link href="/precios" className="hover:text-white transition-colors">Planes y Precios</Link></li>
            </ul>
          </div>

          {/* Columna 3: Servicios */}
          <div>
            <h4 className="font-semibold text-white mb-4">Servicios</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/paquetes/starter/onboarding" className="hover:text-white transition-colors">Crear LLC (Starter)</Link></li>
              <li><Link href="/paquetes/professional/onboarding" className="hover:text-white transition-colors">Professional</Link></li>
              <li><Link href="/paquetes/business/onboarding" className="hover:text-white transition-colors">Business</Link></li>
              <li><Link href="/servicios/obtencion-ein" className="hover:text-white transition-colors">Obtener EIN</Link></li>
              <li><Link href="/servicios/agente-registrado" className="hover:text-white transition-colors">Agente Registrado</Link></li>
            </ul>
          </div>

          {/* Columna 4: Soporte y Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Soporte y Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/faq" className="hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
              <li><Link href="/legal/privacy-policy" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/legal/condiciones-generales" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
            </ul>
          </div>

          {/* Columna 5: Contacto */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="mailto:hola@openllcusa.com" className="hover:text-white transition-colors">
                  hola@openllcusa.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/XXXXXXXXXXX" target="_blank" className="hover:text-white transition-colors">
                  WhatsApp
                </a>
              </li>
              <li className="pt-2 text-xs text-slate-500">
                Soporte en español<br />Respuesta en menos de 12h
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer y Copyright */}
        <div className="mt-16 pt-8 border-t border-slate-700 text-sm text-slate-500">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4">
            <p>
              © {currentYear} Open LLC USA. Todos los derechos reservados.
            </p>
            
            <p className="max-w-2xl text-xs leading-relaxed">
              Open LLC USA no es un bufete de abogados. Actuamos como intermediarios y colaboradores con profesionales y abogados registrados en EE.UU. 
              Todos los servicios se prestan de conformidad con la legislación federal y estatal vigente.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}