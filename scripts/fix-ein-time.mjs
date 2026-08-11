import { createClient } from '@supabase/supabase-js';
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

async function fixEinTime() {
  console.log('🔍 Buscando fragmentos con tiempos incorrectos en Supabase...');
  
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('id, content');

  if (error) {
    console.error('❌ Error obteniendo datos:', error);
    return;
  }

  let updatedCount = 0;

  for (const row of data) {
    // Si contiene la frase incorrecta
    if (row.content.includes('1 a 5') || row.content.includes('1 y 5')) {
      let newContent = row.content;
      // Reemplazar diferentes variaciones
      newContent = newContent.replace(/1 a 5 días hábiles/g, '2 a 4 semanas');
      newContent = newContent.replace(/1 y 5 días hábiles/g, '2 y 4 semanas');
      newContent = newContent.replace(/1 a 5 días/g, '2 a 4 semanas');
      newContent = newContent.replace(/1 y 5 días/g, '2 y 4 semanas');
      // Fix specific to q92 time
      newContent = newContent.replace(/5 y 7 días hábiles/g, '3 y 5 semanas');
      newContent = newContent.replace(/5 a 7 días hábiles/g, '3 a 5 semanas');
      newContent = newContent.replace(/5 y 7 días/g, '3 y 5 semanas');
      newContent = newContent.replace(/5 a 7 días/g, '3 a 5 semanas');

      if (newContent !== row.content) {
        console.log(`✏️ Actualizando ID: ${row.id}`);
        const { error: updateError } = await supabase
          .from('knowledge_base')
          .update({ content: newContent })
          .eq('id', row.id);

        if (updateError) {
          console.error(`❌ Error actualizando ID ${row.id}:`, updateError);
        } else {
          updatedCount++;
        }
      }
    }
  }

  console.log(`✅ Finalizado. Se actualizaron ${updatedCount} fragmentos en la base de datos.`);
}

fixEinTime();
