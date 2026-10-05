import { Metadata } from 'next';

// Los metadatos de /zara viven aquí porque la página es un componente de cliente y no puede
// exportarlos. Antes no tenía `canonical` ni título propios: heredaba los de la home, así que
// competía con ella por el mismo título.
export const metadata: Metadata = {
  title: 'Asesoría con Zara: preguntas sobre tu LLC en EE.UU.',
  description:
    'Pregunta a Zara por voz o por escrito todo lo que necesitas saber sobre tu LLC en Estados Unidos: precios, estados, impuestos, EIN y cuenta bancaria. Respuesta al instante y en español.',
  alternates: { canonical: 'https://openllcusa.com/zara' },
  openGraph: {
    title: 'Asesoría con Zara: preguntas sobre tu LLC en EE.UU. | Open LLC USA',
    description:
      'Precios, estados, impuestos, EIN y cuenta bancaria: pregúntale a Zara por voz o por escrito, sin cita previa.',
    url: 'https://openllcusa.com/zara',
    siteName: 'Open LLC USA',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Asesoría con Zara: preguntas sobre tu LLC en EE.UU. | Open LLC USA',
    description:
      'Precios, estados, impuestos, EIN y cuenta bancaria: pregúntale a Zara por voz o por escrito, sin cita previa.',
  },
};

export default function ZaraLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
