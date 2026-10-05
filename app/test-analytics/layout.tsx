import { Metadata } from 'next';

// Página interna de pruebas: ni se indexa ni se siguen sus enlaces.
export const metadata: Metadata = {
  title: 'Pruebas de analítica',
  description: 'Página interna de pruebas de eventos de analítica.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
