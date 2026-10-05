import { Metadata } from 'next';

// Pantalla de registro: fuera de los buscadores.
export const metadata: Metadata = {
  title: 'Crear cuenta',
  description:
    'Crea tu cuenta en Open LLC USA para constituir y gestionar tu LLC en Estados Unidos desde tu panel.',
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
