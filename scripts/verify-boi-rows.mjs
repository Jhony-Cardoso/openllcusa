import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data } = await supabase.from('knowledge_base').select('id, title, content');

const marcas = ['EXENTA de presentarlo', 'Explicación completa y fuente oficial', 'Recuerda: si tu LLC se creó en EE. UU.',
                'no ofrecemos este trámite', 'Comprobar si tienes obligaciones', 'Justificantes ante el FinCEN',
                'Contabilidad al día', 'no se aplica a tu LLC', 'Ninguna, en tu caso'];
let dup = 0;
for (const r of data) for (const m of marcas) {
  const n = r.content.split(m).length - 1;
  if (n > 1) { console.log(`⚠️ DUPLICADO ${n}x "${m}" en: ${r.title}`); dup++; }
}
console.log(`Marcas duplicadas: ${dup}`);
console.log('\n--- EJEMPLOS FINALES ---');
for (const t of ['q48-boi-report-fincen.md', '¿Quién debe presentarlo?', '¿Qué datos se reportan?', 'q91-despues-de-registrar-llc.md', '¿Qué te protege ante una auditoría?']) {
  const r = data.find(x => x.title === t); if (!r) continue;
  console.log(`\n[${t}] (${r.content.length} car.)`);
  console.log(r.content.replace(/\n+/g, ' | ').slice(0, 430));
}
