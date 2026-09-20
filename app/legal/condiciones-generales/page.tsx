import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import styles from '../shared.module.css';


export const metadata = {
  alternates: { canonical: 'https://openllcusa.com/legal/condiciones-generales' },
  title: 'Condiciones Generales',
  description: 'Condiciones generales de contratación y uso del portal web Open LLC USA',
  robots: 'index, follow',
};

async function getGeneralTermsContent() {
  const filePath = path.join(process.cwd(), 'legal', 'general-terms.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  const processedContent = await remark()
    .use(html)
    .process(fileContent);

  // remark-html no genera ids en los encabezados: se lo añadimos a la sección 8 para poder
  // enlazar directamente desde la nota del hero (/#seccion-8).
  return processedContent
    .toString()
    .replace(/<h2>(8\.\s*Plazos)/, '<h2 id="seccion-8">$1');
}

export default async function CondicionesGeneralesPage() {
  const content = await getGeneralTermsContent();
  
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header con botón de vuelta estándar */}
        <div className={styles.header}>
          <a href="/" className={styles.backLink}>
            ← Volver a inicio
          </a>
        </div>

        {/* Contenido del markdown */}
        <article 
          className={styles.markdownContent}
          dangerouslySetInnerHTML={{ __html: content }} 
        />
        
        {/* Footer legal genérico */}
        <div className={styles.footer}>
           <div className={styles.updateInfo}>
            <p>Zara Designs LLC — Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
