import { Metadata } from 'next';

// Pantalla de acceso: fuera de los buscadores.
export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description:
    'Accede a tu panel de Open LLC USA para seguir el estado de tu LLC, tus pedidos y tus documentos.',
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
