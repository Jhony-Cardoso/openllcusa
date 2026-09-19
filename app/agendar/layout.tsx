import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agenda una consulta gratuita | Open LLC USA',
  description:
    'Reserva 30 minutos con un especialista en LLCs para no residentes: resolvemos tus dudas sobre el estado, los impuestos y la cuenta bancaria en EE.UU. Sin compromiso.',
  alternates: { canonical: 'https://openllcusa.com/agendar' },
  openGraph: {
    title: 'Agenda una consulta gratuita | Open LLC USA',
    description:
      'Reserva 30 minutos con un especialista en LLCs para no residentes. 100% gratuito y sin compromiso.',
    url: 'https://openllcusa.com/agendar',
    locale: 'es_ES',
    type: 'website',
  },
};

export default function AgendarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
