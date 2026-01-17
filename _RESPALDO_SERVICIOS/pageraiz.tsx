import React from 'react';
import Link from 'next/link';
import { Globe, Smartphone, Search, HelpCircle, BookOpen, Send, Package } from 'lucide-react';

// CATEGORÍAS DE SERVICIOS
const paquetes = [
  {
    slug: 'llc-esencial',
    title: 'LLC Esencial',
    price: '$597',
    tagline: 'Todo lo necesario para lanzar tu empresa en EE.UU.',      
    icon: Globe,
    destacado: false,
  },
  {
    slug: 'launch-banking',
    title: 'Launch + Banking',
    price: '$897',
    tagline: 'Formación completa + apoyo para abrir cuenta bancaria.',
    icon: Smartphone,
    destacado: true, // Este es el más popular
  },
  {
    slug: 'plan-compliance',
    title: 'Plan Compliance Básico',
    price: '$49/mes',
    tagline: 'Mantén tu LLC al día con reportes anuales y agente.',
    icon: Package,
    destacado: false,
  },
];

const serviciosSueltos = [
  {
    slug: 'obtencion-ein',
    title: 'Obtención de EIN',
    price: '$197',
    tagline: 'Número fiscal federal para tu empresa (IRS).',
    icon: Search,
  },
  {
    slug: 'impuestos-federales',
    title: 'Declaración de Impuestos',
    price: '$297',
    tagline: 'Presentación anual del Formulario 1120 + 5472.',
    icon: BookOpen,
  },
  {
    slug: 'consultoria-legal',
    title: 'Consultoría Legal',
    price: '$150/hora',
    tagline: 'Sesiones personalizadas sobre estructura y compliance.',
    icon: Send,
  },
];

export const metadata = {
  title: 'Todos los Servicios | OpenLLC',
  description: 'Descubre nuestros paquetes completos y servicios individuales para formar y mantener tu empresa en Estados Unidos.',
};

export default function ServiciosPage() {
  // Schema ItemList combinado (ambas categorías)
  const todosLosServicios = [...paquetes, ...serviciosSueltos];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Servicios de Formación de LLCs',
    description: 'Catálogo completo de paquetes y servicios individuales',
    itemListElement: todosLosServicios.map((servicio, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: servicio.title,
        description: servicio.tagline,
        url: `https://openllc.com/servicios/${servicio.slug}`,
        offers: {
          '@type': 'Offer',
          price: servicio.price.replace(/[^0-9.]/g, ''),
          priceCurrency: 'USD',
        },
      },
    })),
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      {/* Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Encabezado Principal */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Nuestros Servicios
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Desde la formación hasta el cumplimiento fiscal continuo. Elige el paquete perfecto para tu negocio internacional.
        </p>
      </div>

      {/* ========== SECCIÓN 1: PAQUETES COMPLETOS ========== */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-12 bg-blue-600 rounded"></div>
          <h2 className="text-3xl font-bold text-gray-900">Paquetes Completos</h2>
        </div>
        <p className="text-gray-600 mb-8 text-lg">
          Soluciones todo incluido diseñadas para cada etapa de tu empresa.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paquetes.map((paquete) => {
            const Icon = paquete.icon;
            return (
              <Link
                key={paquete.slug}
                href={`/servicios/${paquete.slug}`}
                className={`group relative bg-white border-2 rounded-xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                  paquete.destacado ? 'border-yellow-400' : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                {/* Badge "Más Popular" */}
                {paquete.destacado && (
                  <div className="absolute -top-3 -right-3 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    ⭐ Más Popular
                  </div>
                )}

                <div className="flex items-center justify-center w-14 h-14 bg-blue-50 rounded-lg mb-4 group-hover:bg-blue-100 transition-colors">
                  <Icon className="text-blue-600" size={28} />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {paquete.title}
                </h3>
                <p className="text-3xl font-extrabold text-blue-600 mb-3">
                  {paquete.price}
                </p>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {paquete.tagline}
                </p>

                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                  Ver detalles
                  <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========== SECCIÓN 2: SERVICIOS INDIVIDUALES ========== */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-12 bg-green-600 rounded"></div>
          <h2 className="text-3xl font-bold text-gray-900">Servicios Individuales</h2>
        </div>
        <p className="text-gray-600 mb-8 text-lg">
          Servicios puntuales para necesidades específicas. Combínalos a tu medida.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviciosSueltos.map((servicio) => {
            const Icon = servicio.icon;
            return (
              <Link
                key={servicio.slug}
                href={`/servicios/${servicio.slug}`}
                className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-2xl hover:border-green-500 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-14 h-14 bg-green-50 rounded-lg mb-4 group-hover:bg-green-100 transition-colors">
                  <Icon className="text-green-600" size={28} />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {servicio.title}
                </h3>
                <p className="text-3xl font-extrabold text-green-600 mb-3">
                  {servicio.price}
                </p>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {servicio.tagline}
                </p>

                <div className="flex items-center text-green-600 font-semibold group-hover:gap-2 transition-all">
                  Ver detalles
                  <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Final */}
      <div className="text-center mt-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-12">
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#dbeafe' }}>
          ¿No estás seguro cuál elegir?
        </h2>
        <p className="text-xl mb-6 opacity-90">
          Agenda una consulta gratuita y te ayudamos a diseñar tu estructura ideal.
        </p>
        <Link href="/contacto" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
          Contactar ahora
        </Link>
      </div>
    </main>
  );
}
