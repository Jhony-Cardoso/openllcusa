// DÓNDE: app/legal/terms-and-conditions/page.tsx
// PROPÓSITO: Mostrar T&C en web con diseño mejorado y márgenes correctos

import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import styles from '../shared.module.css';

export const metadata = {
  title: 'Términos y Condiciones | Open LLC USA',
  description: 'Términos y condiciones de uso de la calculadora fiscal de Open LLC USA',
  robots: 'index, follow',
};

async function getTermsContent() {
  const filePath = path.join(process.cwd(), 'legal', 'terms-and-conditions.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  const processedContent = await remark()
    .use(html)
    .process(fileContent);
  
  return processedContent.toString();
}

export default async function TermsAndConditionsPage() {
  const content = await getTermsContent();
  
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header con botón de vuelta */}
        <div className={styles.header}>
          <a href="/calculadora-fiscal" className={styles.backLink}>
            ← Volver a la calculadora
          </a>
        </div>

        {/* Contenido del markdown */}
        <article 
          className={styles.markdownContent}
          dangerouslySetInnerHTML={{ __html: content }} 
        />

        {/* Footer con información adicional */}
        <div className={styles.footer}>
          <div className={styles.footerBox}>
            <h3>⚠️ Recuerda:</h3>
            <p>
              Esta calculadora proporciona <strong>estimaciones educativas orientativas</strong>. 
              Siempre consulta con un asesor fiscal certificado antes de tomar decisiones.
            </p>
          </div>

          <div className={styles.footerActions}>
            <a href="/calculadora-fiscal" className={styles.primaryButton}>
              🧮 Ir a la Calculadora
            </a>
            <a href="/quiz" className={styles.secondaryButton}>
              🤔 Hacer el Quiz
            </a>
          </div>

          <div className={styles.updateInfo}>
            <p>
              <strong>Última actualización:</strong> 4 noviembre 2025 | 
              <strong> Versión:</strong> 2.3.3
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
