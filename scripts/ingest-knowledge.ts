import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import * as dotenv from 'dotenv';

// Cargar variables de entorno locales
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan credenciales de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestKnowledge() {
  const knowledgeDir = path.join(process.cwd(), 'knowledge');
  
  if (!fs.existsSync(knowledgeDir)) {
    console.error(`❌ La carpeta ${knowledgeDir} no existe.`);
    return;
  }

  // Función para obtener archivos recursivamente
  const getFilesRecursively = (dir: string, fileList: string[] = []): string[] => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        getFilesRecursively(filePath, fileList);
      } else if (filePath.endsWith('.md')) {
        fileList.push(filePath);
      }
    }
    return fileList;
  };

  const filePaths = getFilesRecursively(knowledgeDir);
  
  if (filePaths.length === 0) {
    console.log('⚠️ No hay archivos Markdown en la carpeta knowledge.');
    return;
  }

  console.log(`📚 Encontrados ${filePaths.length} archivos para ingestar.`);

  for (const filePath of filePaths) {
    const fileName = path.basename(filePath);
    console.log(`\nProcesando archivo: ${fileName}`);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // División simple por secciones "## " o párrafos dobles
    // Esto es muy básico, para producción usaríamos un text splitter avanzado
    const chunks = content
      .split('\n## ')
      .map(chunk => chunk.startsWith('## ') ? chunk : (chunk.includes('# ') ? chunk : `## ${chunk}`))
      .filter(chunk => chunk.trim().length > 20); // ignorar trozos vacíos o muy cortos

    console.log(`Generando embeddings para ${chunks.length} fragmentos...`);
    
    try {
      // Generar embeddings con Vercel AI SDK
      const { embeddings } = await embedMany({
        model: openai.embedding('text-embedding-3-small'),
        values: chunks,
      });

      console.log(`Guardando en Supabase...`);
      for (let i = 0; i < chunks.length; i++) {
        // Limpiamos el texto un poco
        const titleMatch = chunks[i].match(/^##\s+(.+?)(?:\n|$)/);
        const title = titleMatch ? titleMatch[1] : fileName;
        const cleanContent = chunks[i].trim();

        const { error } = await supabase
          .from('knowledge_base')
          .insert({
            title: title,
            content: cleanContent,
            embedding: embeddings[i],
          });

        if (error) {
          console.error(`❌ Error guardando chunk ${i}:`, error.message);
        }
      }
      console.log(`✅ Archivo ${fileName} procesado y guardado correctamente.`);
    } catch (e) {
      console.error(`❌ Error procesando embeddings para ${fileName}:`, e);
    }
  }

  console.log('\n🎉 Proceso de ingesta finalizado.');
}

ingestKnowledge();
