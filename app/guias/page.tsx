import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarClock,
  FileText,
  Globe2,
  MapPin,
  Shield,
  Zap,
} from 'lucide-react';
import Flag from '@/components/Flag';
import { allCountries } from '@/components/CountrySelector/countries';

/* ============================================================================
   /guias — Hub de guías por país.
   Esta ruta faltaba: estaba en el sitemap y /guias/us enlazaba a ella desde dos
   sitios, así que devolvía 404 y las guías por país se quedaban sin camino de
   rastreo interno. Aquí se enlazan las 27 guías y las páginas pilar.
   ============================================================================ */

const CANONICAL = 'https://openllcusa.com/guias';

export const metadata: Metadata = {
  title: 'Guías por país para crear tu LLC en EE.UU.',
  description:
    'Elige tu país y consulta los requisitos concretos para crear tu LLC en Estados Unidos: documentación, plazos, costes, obligaciones anuales y cuenta bancaria. Sin viajar y sin SSN.',
  keywords: [
    'crear LLC en Estados Unidos desde mi país',
    'LLC USA para no residentes',
    'guías LLC por país',
    'documentos para crear una LLC en EE.UU.',
    'obligaciones anuales LLC no residente',
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Guías por país para crear tu LLC en EE.UU. | Open LLC USA',
    description:
      'Requisitos, plazos, costes y obligaciones anuales para crear tu LLC en Estados Unidos desde España, Latinoamérica y el resto de Europa.',
    url: CANONICAL,
    siteName: 'Open LLC USA',
    locale: 'es_ES',
    type: 'website',
    images: [{ url: '/images/og-image-home.jpg', width: 1200, height: 630, alt: 'Guías por país para crear tu LLC en EE.UU.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guías por país para crear tu LLC en EE.UU. | Open LLC USA',
    description:
      'Elige tu país y mira los requisitos, plazos y costes reales de crear una LLC en Estados Unidos.',
    images: ['/images/og-image-home.jpg'],
  },
};

// Las guías de /guias/[country] se agrupan por zona para que la lista se lea de un vistazo.
// Cada código existe en allCountries; el orden es el que se muestra en pantalla.
const ZONAS: { titulo: string; descripcion: string; codes: string[] }[] = [
  {
    titulo: 'España y Europa',
    descripcion: 'Desde la UE el trámite es 100 % remoto: no necesitas visado ni número de Seguro Social.',
    codes: ['es', 'pt', 'it', 'fr', 'de', 'gb'],
  },
  {
    titulo: 'Norteamérica y Caribe',
    descripcion: 'Guías pensadas para quienes operan entre su país y Estados Unidos.',
    codes: ['mx', 'do', 'pr', 'cu'],
  },
  {
    titulo: 'Centroamérica',
    descripcion: 'Documentación, plazos y apertura de cuenta bancaria sin viajar.',
    codes: ['gt', 'hn', 'sv', 'ni', 'cr', 'pa'],
  },
  {
    titulo: 'Sudamérica',
    descripcion: 'Incluye las guías más consultadas desde Argentina, Colombia y Chile.',
    codes: ['co', 've', 'ec', 'pe', 'bo', 'cl', 'ar', 'uy', 'py', 'br'],
  },
];

const NOMBRE_POR_CODIGO = new Map(allCountries.map((pais) => [pais.code, pais.name]));

const LO_QUE_TRAE = [
  {
    icon: FileText,
    titulo: 'Qué documentos hacen falta',
    desc: 'El pasaporte y poco más: aquí no se exige residencia ni SSN para registrar la LLC.',
  },
  {
    icon: CalendarClock,
    titulo: 'Plazos reales',
    desc: 'Lo que tarda el registro estatal y, por separado, lo que tarda el EIN cuando se pide sin SSN.',
  },
  {
    icon: MapPin,
    titulo: 'Coste de entrada y mantenimiento',
    desc: 'Tasas estatales, cuota anual y agente registrado, separados para que compares de verdad.',
  },
  {
    icon: Shield,
    titulo: 'Obligaciones fiscales',
    desc: 'La declaración anual 5472 + 1120 y el reporte anual del estado, que hay que presentar cada año.',
  },
];

const PASOS = [
  {
    titulo: '1. Elige tu país',
    desc: 'Abre su guía y mira la documentación y los plazos concretos para tu caso.',
  },
  {
    titulo: '2. Constituye la LLC',
    desc: 'Elige estado y plan: nos ocupamos del registro, del EIN y del Operating Agreement.',
  },
  {
    titulo: '3. Mantenla al día',
    desc: 'Reporte anual del estado y declaración 5472 + 1120 cada ejercicio, con recordatorios.',
  },
];

const OTRAS_UTILES = [
  { titulo: 'Cómo crear una LLC paso a paso', href: '/crear-llc-usa' },
  { titulo: 'Guías y artículos por tema', href: '/guia' },
  { titulo: 'LLC para no residentes', href: '/llc-para-no-residentes' },
  { titulo: 'Qué cuesta mantenerla cada año', href: '/precios' },
  { titulo: 'Calculadora fiscal', href: '/calculadora-fiscal' },
  { titulo: 'Informe del BOI (FinCEN)', href: '/boi-report' },
  { titulo: 'Hablemos de tu caso', href: '/contacto' },
];

export default function GuiasPage() {
  // Una sola lista (la de EE.UU. va primera) para el JSON-LD y para contarla.
  const guias = [
    { code: 'us', nombre: 'Estados Unidos', href: '/guias/us' },
    ...allCountries
      .map((pais) => ({
        code: pais.code,
        nombre: pais.name,
        href: `/guias/${pais.code}`,
      }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')),
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Guías por país para crear tu LLC en EE.UU.',
        description:
          'Requisitos, plazos, costes y obligaciones anuales para crear una LLC en Estados Unidos desde España, Latinoamérica y el resto de Europa.',
        url: CANONICAL,
        inLanguage: 'es',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://openllcusa.com' },
          { '@type': 'ListItem', position: 2, name: 'Guías', item: CANONICAL },
        ],
      },
      {
        '@type': 'ItemList',
        numberOfItems: guias.length,
        itemListElement: guias.map((guia, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `LLC en EE.UU. desde ${guia.nombre}`,
          url: `https://openllcusa.com${guia.href}`,
        })),
      },
    ],
  };

  return (
    <article className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <header className="bg-gradient-to-br from-slate-50 to-blue-50 border-b border-slate-200 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-8"
          >
            <ArrowLeft className="mr-2" size={16} /> Volver al inicio
          </Link>

          <div className="flex justify-center mb-6">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
              <Globe2 size={44} className="text-blue-600" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Guías para crear tu <span className="text-blue-600">LLC en EE.UU.</span> desde tu país
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Elige tu país y mira lo que necesitas de verdad: documentación, plazos, coste de entrada y
            mantenimiento, y las obligaciones que llegan después.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/precios"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
            >
              <Zap size={20} fill="currentColor" /> Ver planes desde $349
            </Link>
            <Link
              href="/agendar"
              className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              Consulta gratuita <ArrowRight size={18} />
            </Link>
          </div>

          <p className="text-sm text-slate-500 mt-6">
            Sin viajar · Sin SSN · Soporte en español · Garantía de tramitación sin errores
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Guía destacada de EE.UU. */}
        <section>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Empieza por la guía de EE.UU.</h2>
          <p className="text-slate-600 mb-8 max-w-2xl">
            Si tu duda principal es qué estado te conviene, esta es la guía que responde a esa pregunta:
            compara Wyoming, Nuevo México, Delaware y Florida con sus tasas y su mantenimiento.
          </p>
          <Link
            href="/guias/us"
            className="group flex items-center gap-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all"
          >
            <span className="bg-blue-50 p-3 rounded-xl flex items-center justify-center">
              <Flag countryCode="us" size="lg" title="Estados Unidos" />
            </span>
            <span className="flex-1">
              <span className="block font-bold text-slate-900">Guía de Estados Unidos: elegir estado y crear tu LLC</span>
              <span className="block text-sm text-slate-600">
                Wyoming, Nuevo México, Delaware o Florida: tasas, privacidad y mantenimiento anual.
              </span>
            </span>
            <ArrowRight className="text-blue-600 group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </section>

        {/* Guías por país, agrupadas por zona */}
        <section className="mt-20">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
            {guias.length} guías por país
          </h2>
          <p className="text-slate-600 mb-10 max-w-2xl">
            Cada guía está escrita para un país concreto: la documentación que se pide allí, los plazos
            reales y las dudas más habituales de nuestros clientes de ese país.
          </p>

          <div className="space-y-12">
            {ZONAS.map((zona) => {
              const paises = zona.codes
                .map((code) => ({ code, nombre: NOMBRE_POR_CODIGO.get(code) }))
                .filter((pais) => Boolean(pais.nombre));

              return (
                <div key={zona.titulo}>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-1">{zona.titulo}</h3>
                  <p className="text-sm text-slate-600 mb-5">{zona.descripcion}</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paises.map((pais) => (
                      <Link
                        key={pais.code}
                        href={`/guias/${pais.code}`}
                        className="group flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all"
                      >
                        <Flag countryCode={pais.code} size="md" title={pais.nombre} />
                        <span className="flex-1 font-semibold text-slate-900">{pais.nombre}</span>
                        <ArrowRight
                          className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all"
                          size={18}
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Qué encontrarás en cada guía */}
        <section className="mt-20">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Qué encontrarás en cada guía</h2>
          <p className="text-slate-600 mb-8 max-w-2xl">
            Nada de plazos genéricos: lo que aplica a tu país y a tu caso, separado por partidas.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {LO_QUE_TRAE.map(({ icon: Icon, titulo, desc }) => (
              <div key={titulo} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600 mb-4 w-fit">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold mb-2 text-slate-900">{titulo}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="mt-20">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Cómo se hace con nosotros</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {PASOS.map((paso) => (
              <div key={paso.titulo} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="bg-white p-3 rounded-full text-blue-600 mb-4 w-fit shadow-sm">
                  <Building2 size={22} />
                </div>
                <h3 className="font-bold mb-2 text-slate-900">{paso.titulo}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{paso.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Otras páginas útiles */}
        <section className="mt-20">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Otras páginas que te pueden servir</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OTRAS_UTILES.map((enlace) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                className="group flex items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all"
              >
                <span className="font-semibold text-slate-900 text-sm">{enlace.titulo}</span>
                <ArrowRight className="text-slate-300 group-hover:text-blue-600 transition-colors" size={18} />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="mt-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4">¿Te ayudamos a elegir?</h2>
          <p className="text-blue-50 max-w-2xl mx-auto mb-8">
            Cuéntanos tu caso y te decimos qué estado, qué plan y qué obligaciones anuales te
            corresponden. Sin compromiso y en español.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/agendar"
              className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors"
            >
              Agendar consulta gratuita
            </Link>
            <Link
              href="/precios"
              className="bg-blue-500/40 border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-500/60 transition-colors"
            >
              Ver planes y precios
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
