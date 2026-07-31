import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Servicios',
  description: 'Conoce todos los servicios que Open LLC USA ofrece para tu LLC en Estados Unidos: creación, mantenimiento, contabilidad y más.',
  alternates: {
    canonical: 'https://openllcusa.com/servicios',
  },
};

export default function ServiciosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
