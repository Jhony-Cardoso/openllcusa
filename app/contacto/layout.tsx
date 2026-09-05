import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contacta con Open LLC USA para resolver tus dudas sobre la creación de tu LLC en Estados Unidos.',
  alternates: {
    canonical: 'https://openllcusa.com/contacto',
  },
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
