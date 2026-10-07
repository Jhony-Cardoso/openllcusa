import React from 'react';
import { ArrowRight, CalendarCheck, Check, FileText, Hash, Landmark, MapPin, MessagesSquare } from 'lucide-react';
import TrackedLink from '@/components/home/TrackedLink';
import '../homepage-v4.css';


const paquetes = [ /* ... mismo código de paquetes ... */ ];

const serviciosIndividuales = [
  {
    slug: 'impuestos/declaracion-anual-llc',
    icono: FileText,
    title: 'Declaración de Impuestos',
    price: '$297',
    tagline: 'Presentación anual del Formulario 1120 + 5472 ante el IRS.',
    features: ['Presentación completa', 'Evita multas del IRS', 'Asesoría fiscal incluida', 'Entrega de documentos'],
    highlight: true,
  },
  {
    slug: 'reporte-anual',
    icono: CalendarCheck,
    title: 'Reporte Anual Estatal',
    price: 'Desde $99',
    tagline: 'Mantenimiento obligatorio de tu LLC año tras año.',
    features: ['Presentación ante el estado', 'Evita disolución automática', 'Recordatorios anuales', 'Gestión completa'],
    highlight: true,
  },
  {
    slug: 'impuestos/obtencion-ein',
    icono: Hash,
    title: 'Obtención del EIN',
    price: '$197',
    tagline: 'Número fiscal federal (Tax ID) del IRS, incluso sin SSN.',
    features: ['Trámite rápido ante IRS', 'Válido para bancos', 'Entrega en 24-48h', 'Asesoría básica'],
    highlight: false,
  },
  {
    slug: 'agente-registrado',
    icono: MapPin,
    title: 'Agente Registrado + Dirección Física',
    price: '$149/año',
    tagline: 'Cumple con la ley en EE.UU. sin necesidad de tener dirección física allí.',
    features: ['Agente registrado profesional', 'Dirección física en EE.UU.', 'Recepción y escaneo', 'Notificaciones inmediatas'],
    highlight: false,
  },
  {
    slug: 'launch-banking',
    icono: Landmark,
    title: 'Cuenta Bancaria Empresarial',
    price: '$199',
    tagline: 'Abre tu cuenta en dólares en EE.UU. (Mercury, Wise, Relay, etc.).',
    features: ['Asistencia completa', 'Sin necesidad de viajar', 'Múltiples bancos', 'Soporte para LLC nuevas'],
    highlight: false,
  },
  {
    slug: 'consultoria-fiscal',
    icono: MessagesSquare,
    title: 'Consultoría Fiscal',
    price: '$197',
    tagline: 'Sesiones personalizadas sobre estructura fiscal y optimización.',
    features: ['Análisis de tu caso', 'Estrategia fiscal', 'Resolución de dudas', 'Plan de acción claro'],
    highlight: false,
  },
];

export default function ServiciosPage() {
  return (
    <main>
      {/* Héroe a todo lo ancho: el mismo degradado y resplandor de /precios */}
      <section
        className="relative overflow-hidden text-center px-6 py-24"
        style={{ background: 'linear-gradient(145deg, #0C2047 0%, #1E3A8A 65%, #1a368a 100%)' }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 55% at 80% 50%, rgba(59,130,246,.14) 0%, transparent 70%)' }}
        />
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 mb-6">
            Formación, mantenimiento y cumplimiento
          </span>
          <h1
            className="font-extrabold text-white leading-tight mb-5"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(30px, 4.5vw, 56px)' }}
          >
            Servicios para tu LLC en Estados Unidos
          </h1>
          <p className="mx-auto" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', color: 'rgba(255,255,255,.75)' }}>
            Desde la formación hasta el mantenimiento continuo. Todo lo que necesitas para operar con éxito y tranquilidad.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Servicios Individuales */}
        <section className="bg-slate-50 border border-slate-200 rounded-3xl px-6 py-12 md:px-12 md:py-14">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900">Servicios Individuales</h2>
          <p className="text-slate-600 mt-3">Soluciones específicas para cada necesidad</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {serviciosIndividuales.map((s) => (
            <div
              key={s.slug}
              className={`relative bg-white rounded-3xl p-8 border-2 shadow-[0_12px_32px_-16px_rgba(15,23,42,0.28)] transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl ${
                s.highlight
                  ? 'border-amber-400 hover:border-amber-500'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              {/* Barra de acento: azul en los servicios, ámbar en los recomendados */}
              <span
                aria-hidden="true"
                className={`absolute top-0 left-8 right-8 h-1 rounded-b ${
                  s.highlight ? 'bg-amber-400' : 'bg-blue-600'
                }`}
              />

              {/* Fila superior: icono del servicio a la izquierda, etiqueta a la derecha */}
              <div className="flex items-start justify-between gap-4 mb-5 min-h-[44px]">
                <span aria-hidden="true" className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <s.icono size={22} />
                </span>
                {s.highlight && (
                  <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-sm font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    ⭐ Recomendado
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-4xl font-extrabold text-blue-600 mb-6">{s.price}</p>
              <p className="text-slate-600 mb-8">{s.tagline}</p>

              <ul className="space-y-3 mb-10">
                {s.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="text-green-500 mt-1" size={20} />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <TrackedLink
                href={`/servicios/${s.slug}`}
                trackAction="cta_click"
                trackCategory="servicio"
                trackLabel={s.slug}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-4 rounded-2xl transition-all"
              >
                Ver detalles y contratar →
              </TrackedLink>
            </div>
          ))}
        </div>
        </section>
      </div>
    </main>
  );
}