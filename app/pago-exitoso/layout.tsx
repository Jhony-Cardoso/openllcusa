import { Metadata } from 'next';

// Página de agradecimiento tras el pago: no debe aparecer en buscadores, pero sus enlaces
// al panel y a los siguientes pasos sí pueden seguirse.
export const metadata: Metadata = {
  title: 'Pago completado: siguientes pasos',
  description:
    'Tu pago se ha procesado correctamente. Estos son los siguientes pasos para completar la constitución de tu LLC en Estados Unidos.',
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
