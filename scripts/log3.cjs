const fs = require('fs');
const content = `
---
### 📅 Chat Session: ${new Date().toISOString().replace('T', ' ').slice(0,16)}
**Main objective:** Completar TAREA 5 de PROJECT_HANDOVER (Optimizar Calculadora Fiscal)

#### 👤 User Request:
> Optimización de la Calculadora Fiscal (Hacerla más reactiva y ligera para la indexación).

#### 🤖 Agent Solution:
- **Summary:** Se refactorizó la calculadora fiscal (\`app/calculadora-fiscal/page.tsx\`) que era un componente monolítico de más de 700 líneas. Se extrajo toda la lógica interactiva, cálculos y \`useState\` a un componente cliente independiente (\`components/calculator/CalculadoraClient.tsx\`). La página principal (\`/calculadora-fiscal\`) quedó como un React Server Component (RSC), lo que garantiza que los metadatos y el JSON-LD sean inyectados instantáneamente desde el servidor, optimizando drásticamente el SEO y FCP de la herramienta.
- **Files created/modified:**
  - \`app/calculadora-fiscal/page.tsx\`
  - \`components/calculator/CalculadoraClient.tsx\` (NEW)

#### 💻 Key Code:
\`\`\`tsx
// app/calculadora-fiscal/page.tsx (Ahora es un Server Component)
import React from 'react';
import CalculadoraClient from '@/components/calculator/CalculadoraClient';

function CalculatorSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    // ...
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

export default function CalculadoraFiscal() {
  return (
    <>
      <CalculatorSchema />
      <CalculadoraClient />
    </>
  );
}
\`\`\`
`;
fs.appendFileSync('chat_history.md', content, 'utf8');
console.log('Appended to chat_history.md');
