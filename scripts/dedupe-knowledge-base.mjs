// scripts/dedupe-knowledge-base.mjs
// Limpia duplicados de knowledge_base (la ingesta insertaba sin deduplicar).
// Conserva UNA fila por contenido exacto (tras trim) y borra las repetidas.
// IMPORTANTE: la API devuelve 1000 filas por defecto, así que aquí se pagina siempre.
// Seguridad: antes de borrar guarda una copia COMPLETA (con embeddings) fuera del repositorio.
//   node scripts/dedupe-knowledge-base.mjs            -> simulación
//   node scripts/dedupe-knowledge-base.mjs --apply    -> borra los duplicados
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
dotenv.config({ path: '.env.local', quiet: true });

const APPLY = process.argv.includes('--apply');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// --- recuento exacto ---
const { count } = await supabase.from('knowledge_base').select('*', { count: 'exact', head: true });
console.log(`Filas reales en knowledge_base: ${count}`);

// --- paginación completa (id + title + content) ---
const filas = [];
const PAGINA = 1000;
for (let desde = 0; desde < count; desde += PAGINA) {
  const { data, error } = await supabase.from('knowledge_base')
    .select('id, title, content').range(desde, desde + PAGINA - 1);
  if (error) { console.error('ERROR:', error.message); process.exit(1); }
  filas.push(...data);
}
console.log(`Leídas: ${filas.length}`);

const grupos = new Map();
for (const r of filas) {
  const k = (r.content || '').trim();
  if (!grupos.has(k)) grupos.set(k, []);
  grupos.get(k).push(r);
}
const sobrantes = [];
for (const [, fs2] of grupos) if (fs2.length > 1) sobrantes.push(...fs2.slice(1));
console.log(`Contenidos únicos: ${grupos.size} | filas duplicadas a borrar: ${sobrantes.length}`);
const peor = Math.max(...[...grupos.values()].map(v => v.length));
console.log(`Grupo más repetido: ${peor} copias`);

if (!APPLY) {
  console.log('\n🔎 SIMULACIÓN. Grupos más grandes:');
  [...grupos.entries()].filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length).slice(0, 10)
    .forEach(([, v]) => console.log(`   ${v.length}x  "${v[0].title}"  (${v[0].content.trim().length} car.)`));
  console.log('\nPara aplicar: node scripts/dedupe-knowledge-base.mjs --apply');
  process.exit(0);
}

// --- copia de seguridad con embeddings, por lotes ---
const backupDir = path.join(process.env.USERPROFILE || process.cwd(), '_backup_openllc_20260919');
fs.mkdirSync(backupDir, { recursive: true });
const backupFile = path.join(backupDir, `knowledge_base_duplicados_${new Date().toISOString().slice(0, 10)}.json`);
const respaldo = [];
for (let i = 0; i < sobrantes.length; i += 100) {
  const ids = sobrantes.slice(i, i + 100).map(r => r.id);
  const { data, error } = await supabase.from('knowledge_base').select('id, title, content, embedding').in('id', ids);
  if (error) { console.error('❌ Error leyendo para el respaldo:', error.message); process.exit(1); }
  respaldo.push(...data);
}
fs.writeFileSync(backupFile, JSON.stringify(respaldo), 'utf-8');
console.log(`💾 Respaldo: ${backupFile} (${(fs.statSync(backupFile).size / 1048576).toFixed(1)} MB, ${respaldo.length} filas)`);

// --- borrado por lotes ---
let borradas = 0;
for (let i = 0; i < sobrantes.length; i += 100) {
  const lote = sobrantes.slice(i, i + 100).map(r => r.id);
  const { error } = await supabase.from('knowledge_base').delete().in('id', lote);
  if (error) console.error('❌ Error borrando lote:', error.message); else borradas += lote.length;
}
console.log(`🗑️  Filas borradas: ${borradas}`);

// --- verificación paginada ---
const { count: c2 } = await supabase.from('knowledge_base').select('*', { count: 'exact', head: true });
const after = [];
for (let d = 0; d < c2; d += PAGINA) {
  const { data } = await supabase.from('knowledge_base').select('id, content').range(d, d + PAGINA - 1);
  after.push(...data);
}
const unicos = new Set(after.map(r => (r.content || '').trim()));
console.log(`\nVERIFICACIÓN -> filas: ${after.length} | únicos: ${unicos.size} | duplicados restantes: ${after.length - unicos.size}`);
