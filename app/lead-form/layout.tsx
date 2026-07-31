import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formulario de Contacto',
  description: 'Déjanos tus datos y nos pondremos en contacto contigo a la brevedad posible.',
  alternates: {
    canonical: 'https://openllcusa.com/lead-form',
  },
};

export default function LeadFormLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
