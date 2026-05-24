'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { analyticsEvents } from '@/lib/analytics';

const paquetes = [
  {
    slug: 'starter',
    title: 'Starter',
    price: '$597',
    tagline: 'Todo lo necesario para lanzar tu empresa en EE.UU.',
    destacado: false,
  },
  {
    slug: 'professional',
    title: 'Professional',
    price: '$897',
    tagline: 'Formación completa + apoyo para abrir cuenta bancaria.',
    destacado: true,
  },
  {
    slug: 'business',
    title: 'Business',
    price: '$1397',
    tagline: 'Primer año casi todo resuelto. Gestión fiscal y soporte.',
    destacado: false,
  },
];

const serviciosIndividuales = [
  {
    slug: 'impuestos/declaracion-anual-llc',
    title: 'Declaración de Impuestos',
    price: '$397',
    tagline: 'Presentación anual del Formulario 1120 + 5472 ante el IRS.',
    features: ['Presentación completa', 'Evita multas del IRS', 'Asesoría fiscal incluida', 'Entrega de documentos'],
    highlight: true,
  },
  {
    slug: 'reporte-anual',
    title: 'Reporte Anual Estatal',
    price: 'Desde $99',
    tagline: 'Mantenimiento obligatorio de tu LLC año tras año.',
    features: ['Presentación ante el estado', 'Evita disolución automática', 'Recordatorios anuales', 'Gestión completa'],
    highlight: true,
  },
  {
    slug: 'impuestos/obtencion-ein',
    title: 'Obtención del EIN',
    price: '$197',
    tagline: 'Número fiscal federal (Tax ID) del IRS, incluso sin SSN.',
    features: ['Trámite rápido ante IRS', 'Válido para bancos', 'Entrega en 24-48h', 'Asesoría básica'],
    highlight: false,
  },
  {
    slug: 'agente-registrado',
    title: 'Agente Registrado + Dirección Física',
    price: '$149/año',
    tagline: 'Cumple con la ley en EE.UU. sin necesidad de tener dirección física allí.',
    features: ['Agente registrado profesional', 'Dirección física en EE.UU.', 'Recepción y escaneo', 'Notificaciones inmediatas'],
    highlight: false,
  },
  {
    slug: 'launch-banking',
    title: 'Cuenta Bancaria Empresarial',
    price: '$199',
    tagline: 'Abre tu cuenta en dólares en EE.UU. (Mercury, Wise, Relay, etc.).',
    features: ['Asistencia completa', 'Sin necesidad de viajar', 'Múltiples bancos', 'Soporte para LLC nuevas'],
    highlight: false,
  },
  {
    slug: 'consultoria-fiscal',
    title: 'Consultoría Fiscal',
    price: '$197',
    tagline: 'Sesiones personalizadas sobre estructura fiscal y optimización.',
    features: ['Análisis de tu caso', 'Estrategia fiscal', 'Resolución de dudas', 'Plan de acción claro'],
    highlight: false,
  },
];

export default function ServiciosPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Servicios para tu LLC en Estados Unidos
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Desde la formación hasta el mantenimiento continuo. Todo lo que necesitas para operar con éxito y tranquilidad.
        </p>
      </div>

      {/* Paquetes */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Paquetes Recomendados</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {paquetes.map((p) => (
            <Link
              key={p.slug}
              href={`/paquetes/${p.slug}/onboarding`}
              className={`group bg-white border-2 rounded-3xl p-8 hover:shadow-2xl transition-all ${p.destacado ? 'border-purple-600 scale-[1.03]' : 'border-gray-200 hover:border-blue-600'}`}
            >
              {p.destacado && (
                <div className="text-purple-600 text-sm font-bold mb-4">★ MÁS POPULAR</div>
              )}
              <h3 className="text-3xl font-bold mb-2">{p.title}</h3>
              <p className="text-5xl font-extrabold text-blue-600 mb-4">{p.price}</p>
              <p className="text-gray-600 mb-8">{p.tagline}</p>
              <div className="text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3">
                Ver plan completo <ArrowRight />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Servicios Individuales */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Servicios Individuales</h2>
          <p className="text-gray-600 mt-3">Soluciones específicas para cada necesidad</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {serviciosIndividuales.map((s) => (
            <div
              key={s.slug}
              className={`bg-white border-2 rounded-3xl p-8 hover:shadow-xl transition-all ${s.highlight ? 'border-amber-400' : 'border-gray-200'}`}
            >
              {s.highlight && (
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-sm font-bold px-4 py-1 rounded-full mb-6">
                  ⭐ Recomendado
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{s.title}</h3>
              <p className="text-4xl font-extrabold text-green-600 mb-6">{s.price}</p>
              <p className="text-gray-600 mb-8">{s.tagline}</p>

              <ul className="space-y-3 mb-10">
                {s.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="text-green-500 mt-1" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/servicios/${s.slug}`}
                onClick={() => analyticsEvents.trackEvent('cta_click', 'servicio_individual', s.slug)}
                className="block w-full bg-gray-900 hover:bg-black text-white text-center font-semibold py-4 rounded-2xl transition-all"
              >
                Ver detalles y contratar →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}