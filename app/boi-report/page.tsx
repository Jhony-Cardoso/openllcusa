import { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, ExternalLink, Shield, Zap } from 'lucide-react';

/* ============================================================================
   /boi-report — Página INFORMATIVA (no es un servicio).
   Explica que las entidades creadas en EE.UU. están exentas del BOI desde la
   regla provisional de FinCEN de 26-03-2025 y solo lo deben presentar las
   empresas extranjeras registradas en EE.UU. Sustituye a la antigua URL de
   servicio /servicios/boi-report, que devolvía 404 y a la que apuntaba la base
   de conocimiento del asistente.
   ============================================================================ */

const CANONICAL = 'https://openllcusa.com/boi-report';

export const metadata: Metadata = {
  title: 'BOI Report (FinCEN) 2026: ¿tienes que presentarlo? | Open LLC USA',
  description:
    'Actualizado en 2026: las LLC creadas en Estados Unidos están exentas del BOI Report ante el FinCEN desde marzo de 2025. Te explicamos quién sí debe presentarlo y con qué fuente oficial.',
  keywords: ['BOI Report', 'FinCEN', 'beneficial ownership', 'Corporate Transparency Act', 'BOI obligatorio 2026', 'LLC extranjera BOI'],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'BOI Report (FinCEN) 2026: ¿tienes que presentarlo? | Open LLC USA',
    description:
      'Las LLC creadas en EE.UU. están exentas del BOI desde marzo de 2025. Solo lo presentan las empresas extranjeras registradas en Estados Unidos.',
    url: CANONICAL,
    siteName: 'Open LLC USA',
    locale: 'es_ES',
    type: 'article',
    images: [{ url: '/images/og-image-home.jpg', width: 1200, height: 630, alt: 'BOI Report de FinCEN: obligaciones en 2026' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BOI Report (FinCEN) 2026: ¿tienes que presentarlo? | Open LLC USA',
    description: 'Las LLC creadas en EE.UU. están exentas del BOI desde marzo de 2025.',
    images: ['/images/og-image-home.jpg'],
  },
};

const FAQS = [
  {
    q: '¿Tengo que presentar el BOI Report si mi LLC es americana?',
    a: 'No. La regla provisional de FinCEN del 26 de marzo de 2025 exime a todas las entidades creadas en Estados Unidos y a sus beneficiarios reales. Si tu LLC se constituyó en Wyoming, Nuevo México, Delaware, Florida o cualquier otro estado, no tienes que presentar nada.',
  },
  {
    q: '¿Quién está obligado entonces al BOI?',
    a: 'Las empresas extranjeras (constituidas fuera de EE.UU.) que se registran para hacer negocios en Estados Unidos. Para ellas FinCEN mantiene obligaciones y plazos propios.',
  },
  {
    q: '¿Y si ya lo presenté cuando era obligatorio?',
    a: 'No tienes que hacer nada: ni borrarlo ni actualizarlo. La exención no invalida lo presentado. Lo único útil es guardar el acuse con tu documentación por si un banco lo solicita.',
  },
  {
    q: '¿Me lo pueden cobrar igualmente?',
    a: 'Pueden ofrecértelo, pero no lo necesitas. Antes de pagar cualquier tarifa por el BOI (las habituales rondaban los $99), verifica la situación en la fuente oficial: fincen.gov/boi.',
  },
  {
    q: '¿Qué trámite fiscal sí sigo teniendo cada año?',
    a: 'El Formulario 5472 junto con una portada del 1120 ante el IRS, obligatorio para LLCs de propietarios extranjeros aunque no tengan ingresos ni paguen impuestos en EE.UU. Su plazo habitual es el 15 de abril.',
  },
];

export default function BoiReportPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://openllcusa.com' },
          { '@type': 'ListItem', position: 2, name: 'Recursos', item: 'https://openllcusa.com/recursos' },
          { '@type': 'ListItem', position: 3, name: 'BOI Report (FinCEN)', item: CANONICAL },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      },
    ],
  };

  return (
    <article className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="bg-gradient-to-br from-slate-50 to-blue-50 border-b border-slate-200 py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/recursos" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-8">
            <ArrowLeft className="mr-2" size={16} /> Volver a recursos
          </Link>

          <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5">
            Actualizado en 2026
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
            BOI Report (FinCEN): ¿tienes que <span className="text-blue-600">presentarlo</span>?
          </h1>
          <p className="text-xl text-slate-600">
            Respuesta corta: si tu LLC se constituyó en Estados Unidos, <strong>no</strong>. Y si alguien te lo está
            cobrando, conviene que leas esto antes de pagar.
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-14">
        {/* Aviso principal */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-6 mb-12">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={22} />
            <div>
              <h2 className="font-bold text-slate-900 mb-2">La exención que cambió todo</h2>
              <p className="text-slate-700 text-sm leading-relaxed">
                El <strong>26 de marzo de 2025</strong> FinCEN publicó una regla provisional que exime del BOI a
                <strong> todas las entidades creadas en Estados Unidos</strong> —las que antes se llamaban
                &ldquo;domestic reporting companies&rdquo;— y a sus beneficiarios reales. Traducción práctica: si tu LLC
                está registrada en EE. UU., no tienes ninguna obligación de presentar el BOI.
              </p>
              <a
                href="https://www.fincen.gov/boi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline mt-3"
              >
                Comprobarlo en la web oficial de FinCEN <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Antes / después */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Qué cambió exactamente</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 mb-3">Antes (2024 – marzo 2025)</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Casi todas las LLCs debían declarar sus beneficiarios reales.</li>
                <li>• Plazo: 90 días para las LLC de 2024 y 30 días para las creadas desde 2025.</li>
                <li>• Multas por no presentar: hasta $500 por día de retraso.</li>
                <li>• Las LLCs de extranjeros <strong>no</strong> estaban exentas.</li>
              </ul>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 mb-3">Ahora (desde marzo de 2025)</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-0.5" size={16} /> Entidades creadas en EE. UU.: exentas.</li>
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-0.5" size={16} /> Beneficiarios reales de esas entidades: exentos.</li>
                <li className="flex gap-2"><Shield className="text-emerald-600 flex-shrink-0 mt-0.5" size={16} /> Solo obligadas: empresas extranjeras registradas en EE. UU.</li>
                <li className="flex gap-2"><Shield className="text-emerald-600 flex-shrink-0 mt-0.5" size={16} /> Si ya lo presentaste, no hay nada que corregir.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Qué sí sigue aplicando */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Ojo: el BOI no era el único trámite</h2>
          <p className="text-slate-600 mb-5 leading-relaxed">
            Que el BOI ya no te aplique no significa que tu LLC no tenga obligaciones. La que sigue viva, y con
            multa de hasta $25.000 si se olvida, es el <strong>Formulario 5472 + 1120</strong> ante el IRS: un
            reporte informativo anual obligatorio para LLCs de propietarios extranjeros, incluso si no has tenido
            ingresos ni pagas impuestos en EE. UU.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/servicios/form-5472-1120"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition"
            >
              <Zap size={18} fill="currentColor" /> Presentar mi 5472 + 1120
            </Link>
            <Link
              href="/guias/us"
              className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-900 px-6 py-3 rounded-xl font-bold transition"
            >
              Ver plazos por estado <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Preguntas frecuentes sobre el BOI</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group bg-white border border-slate-200 rounded-2xl p-6">
                <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between items-center gap-4">
                  {faq.q}
                  <span className="text-blue-600 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="text-slate-600 mt-4 leading-relaxed text-sm">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="text-xs text-slate-500 leading-relaxed">
          Este contenido es informativo y no constituye asesoría legal individualizada. La situación puede cambiar:
          verifica siempre la comunicación vigente de FinCEN antes de tomar decisiones.
        </p>
      </div>
    </article>
  );
}
