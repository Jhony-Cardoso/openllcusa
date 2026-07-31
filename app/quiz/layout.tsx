import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diagnóstico Gratuito',
  description: 'Responde este breve cuestionario para saber si una LLC en Estados Unidos es la estructura adecuada para tu negocio.',
  alternates: {
    canonical: 'https://openllcusa.com/quiz',
  },
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
