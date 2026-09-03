'use client'

import { InlineWidget } from 'react-calendly'
import { Shield, Clock, Star } from 'lucide-react'

export default function AgendarPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0C2047] to-[#1D4ED8] text-white py-16 px-4 text-center">
        <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          100% Gratuito · Sin compromiso
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Habla con un especialista en LLC
        </h1>
        <p className="text-blue-100 text-lg max-w-xl mx-auto">
          30 minutos contigo, en español, para resolver todas tus dudas sobre crear tu empresa en EE.UU.
        </p>
      </section>

      {/* Beneficios */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: <Clock className="text-blue-600" size={22} />, title: '30 minutos', desc: 'Una sesión enfocada y sin rodeos, adaptada a tu situación.' },
            { icon: <Star className="text-blue-600" size={22} />, title: 'Especialistas nativos', desc: 'Asesoría en español por expertos en LLC para no residentes.' },
            { icon: <Shield className="text-blue-600" size={22} />, title: 'Sin presión de venta', desc: 'Te damos información honesta. Sin compromisos ni letras pequeñas.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex gap-4">
              <div className="mt-0.5 flex-shrink-0">{icon}</div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Calendly embed */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-br from-[#0C2047] to-[#1E3A8A] text-white p-6 text-center">
            <h2 className="text-xl font-bold text-white">Elige tu fecha y hora</h2>
            <p className="text-blue-100 text-sm mt-1">Recibirás una confirmación por email inmediatamente</p>
          </div>
          <div style={{ minHeight: '700px' }}>
            <InlineWidget
              url="https://calendly.com/openllcusa/30min"
              styles={{ height: '700px' }}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
