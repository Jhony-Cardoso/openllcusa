import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
dotenv.config({ path: '.env.local', quiet: true });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const { count } = await supabase.from('knowledge_base').select('*', { count: 'exact', head: true });
const filas = [];
for (let d = 0; d < count; d += 1000) {
  const { data } = await supabase.from('knowledge_base').select('id, title, content').range(d, d + 999);
  filas.push(...data);
}
const unicos = new Set(filas.map(r => (r.content || '').trim()));
console.log(`FILAS: ${filas.length} | ÚNICOS: ${unicos.size} | DUPLICADOS: ${filas.length - unicos.size}`);

// ¿queda algún fragmento del scrape de knowledge/web?
const chunksDe = (c) => c.split('\n## ').map(x => x.startsWith('## ') ? x : (x.includes('# ') ? x : `## ${x}`)).filter(x => x.trim().length > 20).map(x => x.trim());
const web = new Set();
for (const f of fs.readdirSync(path.join(process.cwd(), 'knowledge', 'web')).filter(f => f.endsWith('.md')))
  for (const c of chunksDe(fs.readFileSync(path.join(process.cwd(), 'knowledge', 'web', f), 'utf-8'))) web.add(c);
const restos = filas.filter(r => web.has((r.content || '').trim()));
console.log(`Filas procedentes de knowledge/web/: ${restos.length}`);

// BOI: afirmaciones obsoletas y presencia de la exención
const PROHIBIDO = ['/servicios/boi-report', 'por $99', 'NO están exentas', '$500 por día', '$591', 'obligatorio desde 2024', 'BOIR incluido', 'Checklist BOIR'];
let malos = 0;
for (const r of filas) for (const p of PROHIBIDO) if (r.content.includes(p)) { console.log('⚠️', r.title, '::', p); malos++; }
console.log(`Afirmaciones obsoletas del BOI: ${malos}`);
const conExencion = filas.filter(r => /exent/i.test(r.content) && /BOI|Beneficial/i.test(r.content));
console.log(`Filas que explican la exención del BOI: ${conExencion.length}`);
console.log('\nEjemplo:', conExencion[0] ? conExencion[0].content.replace(/\n+/g, ' ').slice(0, 230) : '—');
