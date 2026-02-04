import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, ChevronDown, Menu, X } from 'lucide-react';
import SectionCalculadora from '@/components/SectionCalculadora';
import CountrySelector from '@/components/CountrySelector/CountrySelector';
import FloatingButtons from '@/components/FloatingButtons';
import { homePageJsonLd } from '@/lib/jsonld-schema';

// Metadata para SEO
export const metadata: Metadata = {
  title: 'Open LLC USA - Abre tu LLC en EE.UU. en 72 horas sin visa ni SSN',
  description: 'Crea tu LLC en Estados Unidos 100% online desde cualquier país. Incluye EIN, agente registrado y asesoría fiscal. +500 emprendedores confían en nosotros. Desde $199.',
  keywords: [
    'crear LLC en USA',
    'abrir LLC Estados Unidos',
    'LLC sin visa',
    'LLC sin SSN',
    'EIN para extranjeros',
    'agente registrado USA',
    'LLC para no residentes',
    'empresa en Estados Unidos',
    'LLC desde México',
    'LLC desde Colombia',
    'LLC desde España',
    'LLC desde Argentina',
    'registro de LLC',
    'Wyoming LLC',
    'Delaware LLC',
    'New Mexico LLC',
    'Florida LLC'
  ],
  authors: [{ name: 'Open LLC USA' }],
  creator: 'Open LLC USA',
  publisher: 'Open LLC USA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://openllcusa.com'), // Cambia por tu dominio real
  alternates: {
    canonical: '/',
    languages: {
      'es': '/',
      'en': '/en',
    },
  },
  openGraph: {
    title: 'Open LLC USA - Abre tu LLC en 72 horas sin visa ni SSN',
    description: 'Crea tu empresa en Estados Unidos 100% online. EIN incluido, agente registrado gratis el primer año. Más de 500 emprendedores ya confiaron en nosotros.',
    url: 'https://openllcusa.com',
    siteName: 'Open LLC USA',
    images: [
      {
        url: '/images/og-image-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Open LLC USA - Servicios de creación de LLC',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open LLC USA - Abre tu LLC en 72 horas sin visa',
    description: 'Crea tu empresa en Estados Unidos 100% online. EIN incluido, agente registrado gratis.',
    images: ['/images/og-image-home.jpg'],
    creator: '@openllcusa', // Cambia por tu handle real
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google', // Añade tu código real
    // yandex: 'codigo-yandex',
    // bing: 'codigo-bing',
  },
};

export default function HomePage() {

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd) }}
      />

      <section className="hero bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="hero-container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Abre tu LLC en EE.UU. en 72 horas <br />sin visa, sin SSN y desde cualquier país
          </h1>
          <p className="hero-subtitle text-xl mb-8 max-w-3xl mx-auto">
            Open LLC USA te guía paso a paso para crear una empresa legal en Estados Unidos, incluso si eres extranjero. Incluimos agente registrado, obtención de EIN y asesoría fiscal básica. Todo en español o inglés, según prefieras.
          </p>
          <a href="#comenzar" className="btn btn-primary btn-lg bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
            👉 Comenzar mi LLC ahora
          </a>
          <p className="trust-badge mt-4">✅ Más de 500 emprendedores ya confiaron en nosotros</p>
        </div>
      </section>

      <section className="section py-16 bg-gray-50">
        <div className="section-container max-w-6xl mx-auto px-4">
          <div className="section-header text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">La forma más rápida y segura de tener tu LLC en EE.UU.</h2>
          </div>
          <div className="benefits-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[
              { title: "100% en línea", desc: "Sin viajar, sin visa, sin complicaciones" },
              { title: "EIN incluido", desc: "Te ayudamos a obtener tu número de identificación fiscal (sin SSN ni ITIN)" },
              { title: "Agente registrado gratuito el primer año", desc: "Requisito legal en EE.UU." },
              { title: "Soporte en español e inglés", desc: "Respuestas en menos de 12 horas" },
              { title: "Precios transparentes", desc: "Sin costos ocultos. Todo incluido desde $199" }
            ].map((item, i) => (
              <div key={i} className="benefit-item bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="benefit-icon w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="benefit-content">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="comparison-note bg-blue-50 p-4 rounded-lg text-center">
            <strong>💡 Compara con la competencia:</strong> muchos cobran extra por EIN o agente registrado. Nosotros lo incluimos todo desde el inicio.
          </div>
        </div>
      </section>

      <SectionCalculadora />

      <section id="servicios" className="section services-section py-16 bg-white">
        <div className="section-container max-w-6xl mx-auto px-4">
          <div className="section-header text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Servicios hechos para emprendedores internacionales</h2>
          </div>
          <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🏢', title: "Registro de LLC en EE.UU.", desc: "Crea tu empresa en Wyoming, New Mexico, Delaware o Florida. Listo para operar globalmente.", link: "/servicios/crear-llc", text: "Ver detalles" },
              { icon: '🔢', title: "Obtén tu EIN sin SSN", desc: "Necesario para abrir cuenta bancaria, contratar y pagar impuestos.", link: "/servicios/ein", text: "Solicitar EIN" },
              { icon: '📋', title: "Agente registrado confiable", desc: "Cumple con los requisitos legales de tu estado. Incluido el primer año.", link: "/servicios/agente-registrado", text: "Más información" },
              { icon: '🏦', title: "Cuenta bancaria empresarial", desc: "Te conectamos con bancos que aceptan LLCs de no residentes.", link: "/servicios/cuenta-bancaria", text: "Explorar opciones" }
            ].map((service, i) => (
              <div key={i} className="service-card bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="service-icon text-4xl mb-4">{service.icon}</div>
                <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.desc}</p>
                <Link href={service.link} className="service-link text-blue-600 font-medium hover:underline">
                  {service.text} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section countries-section py-16 bg-gray-50">
        <div className="section-container max-w-4xl mx-auto px-4">
          <div className="section-header text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Creamos LLCs para emprendedores de +50 países</h2>
            <p className="section-subtitle text-gray-600 max-w-2xl mx-auto">
              No importa desde dónde estés: ya hemos ayudado a fundadores de México, Colombia, Chile, España, Argentina, Perú y más a establecer su presencia legal en EE.UU.
            </p>
          </div>
          <CountrySelector />
        </div>
      </section>

      <section id="como-funciona" className="section py-16 bg-white">
        <div className="section-container max-w-6xl mx-auto px-4">
          <div className="section-header text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tu LLC lista en 3 simples pasos</h2>
          </div>
          <div className="steps-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: 1, title: "Completa el formulario", desc: "5 minutos. Solo necesitas tu pasaporte." },
              { num: 2, title: "Nosotros hacemos el trabajo", desc: "Registro estatal + EIN + Agente registrado." },
              { num: 3, title: "Recibe tus documentos", desc: "En 72 horas. Listo para operar." }
            ].map((step) => (
              <div key={step.num} className="step-card bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
                <div className="step-number w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <a href="#comenzar" className="btn btn-primary btn-lg bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors">
              Iniciar ahora
            </a>
          </div>
        </div>
      </section>

      <section id="testimonios" className="section testimonials-section py-16 bg-gray-50">
        <div className="section-container max-w-6xl mx-auto px-4">
          <div className="section-header text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Confían en nosotros cientos de emprendedores globales</h2>
          </div>
          <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { text: "Gracias a Open LLC USA, ahora tengo mi LLC en Delaware y una cuenta en Mercury. Todo en 4 días.", name: "Carlos M.", role: "Fundador desde Colombia" },
              { text: "El proceso fue sorprendentemente simple. El equipo respondió todas mis dudas en español y obtuve mi EIN sin complicaciones.", name: "Ana G.", role: "Emprendedora desde México" },
              { text: "Perfecto para iniciar mi negocio digital. Soporte excepcional y precios justos.", name: "Miguel R.", role: "Freelancer desde España" }
            ].map((testimonial, i) => (
              <div key={i} className="testimonial-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <p className="testimonial-text text-gray-700 italic mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="testimonial-author flex items-center">
                  <div>
                    <div className="author-name font-bold">{testimonial.name}</div>
                    <div className="author-role text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="guarantee-box bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-center max-w-2xl mx-auto">
            <h3 className="font-bold text-xl mb-2">🛡️ Garantía de satisfacción</h3>
            <p>Si no estás satisfecho en los primeros 7 días, te devolvemos el 100%.</p>
          </div>
        </div>
      </section>

      <section className="section cta-section py-20 bg-blue-600 text-white">
        <div className="section-container max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para dar el salto a EE.UU.?</h2>
          <p className="text-xl mb-8">
            No dejes que la burocracia frene tu negocio global.<br />
            Miles de emprendedores ya lo hicieron. Ahora te toca a ti.
          </p>
          <a href="#comenzar" className="btn btn-white btn-lg bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-block">
            👉 Crear mi LLC en 3 minutos
          </a>
          <p className="cta-note mt-4">Sin compromiso. Sin tarjeta de crédito para empezar.</p>
        </div>
      </section>

      {/* Botones flotantes */}
      <FloatingButtons />
    </>
  );
}