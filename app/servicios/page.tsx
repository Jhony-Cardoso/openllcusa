'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { analyticsEvents } from '@/lib/analytics';

const SERVICES = [
  {
    title: "Registro de LLC",
    slug: "registro-llc",
    price: "Desde $349",
    description: "Constitución completa de tu LLC en EE.UU. en 72 horas. Incluye documentos oficiales, EIN y todo lo necesario.",
    features: [
      "Registro estatal oficial",
      "Obtención de EIN",
      "Acuerdo operativo",
      "Soporte en español",
      "Garantía de aprobación"
    ],
    cta: "Ver planes de LLC",
    href: "/#precios",
    highlight: true
  },
  {
    title: "Obtención del EIN",
    slug: "obtencion-ein",
    price: "$149",
    description: "Obtén tu EIN (Tax ID) del IRS de forma rápida y segura, incluso sin SSN.",
    features: [
      "Trámite ante el IRS",
      "Válido para bancos y contratos",
      "Entrega en 24-48 horas",
      "Asesoría fiscal básica"
    ],
    cta: "Solicitar EIN",
    href: "/servicios/obtencion-ein"
  },
  {
    title: "Agente Registrado + Dirección Física",
    slug: "agente-registrado",
    price: "$99/año",
    description: "Cumple con todos los requisitos legales de EE.UU. sin necesidad de viajar.",
    features: [
      "Agente registrado profesional",
      "Dirección física en EE.UU.",
      "Recepción y escaneo de documentos",
      "Notificaciones inmediatas"
    ],
    cta: "Contratar Agente",
    href: "/servicios/agente-registrado"
  },
  {
    title: "Cuenta Bancaria Empresarial",
    slug: "launch-banking",
    price: "$299",
    description: "Abre tu cuenta bancaria en dólares en EE.UU. (Mercury, Wise, Relay, etc.).",
    features: [
      "Asistencia completa en apertura",
      "Sin necesidad de viajar",
      "Múltiples bancos disponibles",
      "Soporte para LLC nuevas"
    ],
    cta: "Abrir Cuenta Bancaria",
    href: "/servicios/launch-banking"
  }
];

export default function ServiciosPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Servicios para tu LLC en EE.UU.
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10">
            Todo lo que necesitas para constituir, operar y hacer crecer tu empresa americana de forma 100% legal y remota.
          </p>
          <Link
            href="#paquetes"
            onClick={() => analyticsEvents.trackEvent('cta_click', 'servicios_hero', 'ver_paquetes')}
            className="inline-flex items-center gap-3 bg-white text-[#1e3a8a] font-bold text-lg px-10 py-4 rounded-full hover:bg-gray-100 transition-all"
          >
            Ver planes recomendados
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>

      {/* PAQUETES RECOMENDADOS */}
      <section id="paquetes" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-purple-600 font-semibold">PAQUETES COMPLETOS</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3">Elige el plan perfecto para ti</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Aquí irían los 3 paquetes - Starter, Professional, Business */}
            {/* Por ahora dejo placeholder para que tú decidas si reutilizamos los de la homepage */}
          </div>
        </div>
      </section>

      {/* SERVICIOS INDIVIDUALES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-purple-600 font-semibold">SERVICIOS ADICIONALES</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3">Servicios Individuales</h2>
            <p className="text-xl text-gray-600 mt-4">Soluciones específicas para necesidades concretas</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {SERVICES.map((service, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl p-8 border ${service.highlight ? 'border-purple-500 shadow-xl' : 'border-gray-200'} hover:shadow-2xl transition-all group`}
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                  <span className="text-2xl font-bold text-purple-600">{service.price}</span>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed">{service.description}</p>

                <ul className="space-y-3 mb-10">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="text-green-500 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={service.href}
                  onClick={() => analyticsEvents.trackEvent('cta_click', 'servicio', service.slug)}
                  className="group flex items-center justify-center gap-2 w-full bg-[#1e3a8a] hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition-all"
                >
                  {service.cta}
                  <ArrowRight className="group-hover:translate-x-1 transition" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">¿Listo para dar el siguiente paso?</h2>
          <p className="text-xl mb-10">Nuestro equipo te ayudará a elegir la mejor opción para tu situación.</p>
          
          <Link
            href="/#asesoria"
            onClick={() => analyticsEvents.trackEvent('cta_click', 'servicios_final', 'asesoria')}
            className="inline-flex items-center gap-3 bg-white text-[#1e3a8a] font-bold text-lg px-12 py-5 rounded-full hover:bg-gray-100 transition-all"
          >
            Solicitar asesoría personalizada
            <ArrowRight size={26} />
          </Link>
        </div>
      </section>
    </main>
  );
}