import fs from 'fs';
import path from 'path';

const basePath = process.cwd();

const layouts = [
  {
    dir: 'app/contacto',
    content: `import { Metadata } from 'next';

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
`
  },
  {
    dir: 'app/servicios',
    content: `import { Metadata } from 'next';

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
`
  },
  {
    dir: 'app/quiz',
    content: `import { Metadata } from 'next';

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
`
  },
  {
    dir: 'app/lead-form',
    content: `import { Metadata } from 'next';

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
`
  }
];

layouts.forEach(layout => {
  const layoutPath = path.join(basePath, layout.dir, 'layout.tsx');
  if (!fs.existsSync(layoutPath)) {
    fs.writeFileSync(layoutPath, layout.content, 'utf8');
    console.log('Created layout at ' + layoutPath);
  } else {
    console.log('Layout already exists at ' + layoutPath);
  }
});

// For FAQ page, we need to inject the alternates.canonical into the metadata object.
const faqPagePath = path.join(basePath, 'app/faq/page.tsx');
if (fs.existsSync(faqPagePath)) {
  let content = fs.readFileSync(faqPagePath, 'utf8');
  if (!content.includes('alternates: {')) {
    content = content.replace(
      'export const metadata: Metadata = {',
      \`export const metadata: Metadata = {
  alternates: {
    canonical: 'https://openllcusa.com/faq',
  },\`
    );
    fs.writeFileSync(faqPagePath, content, 'utf8');
    console.log('Added canonical to FAQ page');
  } else {
    console.log('FAQ page already has alternates');
  }
}
