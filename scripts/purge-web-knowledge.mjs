// scripts/purge-web-knowledge.mjs
// Dos operaciones de preparación para la re-ingesta:
//   1) Respaldo COMPLETO de knowledge_base (con embeddings) fuera del repositorio.
//   2) Purga de las filas procedentes de knowledge/web/ (los scrapes del sitio, que ya no se
//      ingieren pero siguen en el índice desde las ingestas antiguas).
// Recalcula los fragmentos de cada fichero con EXACTAMENTE la misma lógica que
// ingest-knowledge.ts, para no borrar por parecido sino por coincidencia de contenido.
//   node scripts/purge-web-knowledge.mjs           -> simulación (solo informa y respalda si --backup)
//   node scripts/purge-web-knowledge.mjs --apply   -> borra las filas de knowledge/web
//   (--backup se añade automáticamente con --apply)
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
dotenv.config({ path: '.env.local', quiet: true });

const APPLY = process.argv.includes('--apply');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const chunksDe = (content) => content
  .split('\n## ')
  .map(chunk => chunk.startsWith('## ') ? chunk : (chunk.includes('# ') ? chunk : `## ${chunk}`))
  .filter(chunk => chunk.trim().length > 20)
  .map(chunk => chunk.trim());

const WEB_DIR = path.join(process.cwd(), 'knowledge', 'web');
const objetivo = new Set();
for (const f of fs.readdirSync(WEB_DIR).filter(f => f.endsWith('.md'))) {
  for (const c of chunksDe(fs.readFileSync(path.join(WEB_DIR, f), 'utf-8'))) objetivo.add(c);
}
console.log(`Fragmentos calculados para knowledge/web/: ${objetivo.size}`);

// lectura paginada
const { count } = await supabase.from('knowledge_base').select('*', { count: 'exact', head: true });
const filas = [];
for (let d = 0; d < count; d += 1000) {
  const { data } = await supabase.from('knowledge_base').select('id, title, content').range(d, d + 999);
  filas.push(...data);
}
console.log(`Filas en la tabla: ${filas.length}`);

const aBorrar = filas.filter(r => objetivo.has((r.content || '').trim()));
const titulos = {};
for (const r of aBorrar) titulos[r.title] = (titulos[r.title] || 0) + 1;
console.log(`Filas procedentes de knowledge/web/: ${aBorrar.length}`);
console.log('Desglose por título (top 15):');
Object.entries(titulos).sort((a, b) => b[1] - a[1]).slice(0, 15).forEach(([t, n]) => console.log(`   ${n}x  ${t}`));

if (!APPLY) { console.log('\n🔎 SIMULACIÓN (no se ha borrado nada). Aplicar con --apply'); process.exit(0); }

// 1) respaldo completo ANTES de borrar
const dir = path.join(process.env.USERPROFILE || process.cwd(), '_backup_openllc_20260919');
fs.mkdirSync(dir, { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
const file = path.join(dir, `knowledge_base_completo_antes_reingesta_${stamp}.json`);
const todo = [];
for (let d = 0; d < filas.length; d += 100) {
  const ids = filas.slice(d, d + 100).map(r => r.id);
  const { data } = await supabase.from('knowledge_base').select('id, title, content, embedding').in('id', ids);
  todo.push(...data);
}
fs.writeFileSync(file, JSON.stringify(todo), 'utf-8');
console.log(`💾 Respaldo completo: ${file} (${(fs.statSync(file).size / 1048576).toFixed(1)} MB, ${todo.length} filas)`);

// 2) borrado
let borradas = 0;
for (let i = 0; i < aBorrar.length; i += 100) {
  const lote = aBorrar.slice(i, i + 100).map(r => r.id);
  const { error } = await supabase.from('knowledge_base').delete().in('id', lote);
  if (error) console.error('❌', error.message); else borradas += lote.length;
}
const { count: c2 } = await supabase.from('knowledge_base').select('*', { count: 'exact', head: true });
console.log(`🗑️  Borradas ${borradas} filas de knowledge/web/. Filas restantes: ${c2}`);
