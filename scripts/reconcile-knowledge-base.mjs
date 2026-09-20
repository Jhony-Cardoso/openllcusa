// scripts/reconcile-knowledge-base.mjs
// Deja el índice vectorial EXACTAMENTE igual a los ficheros de knowledge/ (sin web/):
// borra las filas "fantasma" (contenidos de versiones antiguas de los .md que ya no existen)
// y avisa si falta algún fragmento por ingerir.
//   node scripts/reconcile-knowledge-base.mjs            -> simulación
//   node scripts/reconcile-knowledge-base.mjs --apply    -> borra las filas fantasma
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
dotenv.config({ path: '.env.local', quiet: true });

const APPLY = process.argv.includes('--apply');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const EXCLUDED_DIRS = ['web'];

const chunksDe = (c) => c.split('\n## ').map(x => x.startsWith('## ') ? x : (x.includes('# ') ? x : `## ${x}`)).filter(x => x.trim().length > 20).map(x => x.trim());

const walk = (dir, out = []) => {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) { if (!EXCLUDED_DIRS.includes(path.relative(path.join(process.cwd(), 'knowledge'), p).split(path.sep)[0])) walk(p, out); }
    else if (p.endsWith('.md')) out.push(p);
  }
  return out;
};
const ficheros = walk(path.join(process.cwd(), 'knowledge'));
const esperados = new Set();
for (const f of ficheros) for (const c of chunksDe(fs.readFileSync(f, 'utf-8'))) esperados.add(c);
console.log(`Ficheros fuente: ${ficheros.length} | fragmentos esperados: ${esperados.size}`);

const { count } = await supabase.from('knowledge_base').select('*', { count: 'exact', head: true });
const filas = [];
for (let d = 0; d < count; d += 1000) {
  const { data } = await supabase.from('knowledge_base').select('id, title, content').range(d, d + 999);
  filas.push(...data);
}
const enIndice = new Set(filas.map(r => (r.content || '').trim()));
const fantasmas = filas.filter(r => !esperados.has((r.content || '').trim()));
const faltan = [...esperados].filter(c => !enIndice.has(c));
console.log(`Filas en la tabla: ${filas.length} | fantasma (contenido que ya no existe en los .md): ${fantasmas.length} | fragmentos sin ingerir: ${faltan.length}`);

const t = {};
for (const r of fantasmas) t[r.title] = (t[r.title] || 0) + 1;
Object.entries(t).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`   ${v}x  ${k}`));
if (faltan.length) console.log('\n⚠️ Faltan por ingerir (primeros 5):', faltan.slice(0, 5).map(s => s.slice(0, 60)));

if (!APPLY) { console.log('\n🔎 SIMULACIÓN. Aplicar con --apply'); process.exit(0); }

const dir = path.join(process.env.USERPROFILE || process.cwd(), '_backup_openllc_20260919');
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, `knowledge_base_fantasmas_${new Date().toISOString().slice(0, 10)}.json`);
const respaldo = [];
for (let i = 0; i < fantasmas.length; i += 100) {
  const ids = fantasmas.slice(i, i + 100).map(r => r.id);
  const { data } = await supabase.from('knowledge_base').select('id, title, content, embedding').in('id', ids);
  respaldo.push(...data);
}
fs.writeFileSync(file, JSON.stringify(respaldo), 'utf-8');
console.log(`💾 Respaldo: ${file} (${(fs.statSync(file).size / 1048576).toFixed(1)} MB, ${respaldo.length} filas)`);

let borradas = 0;
for (let i = 0; i < fantasmas.length; i += 100) {
  const ids = fantasmas.slice(i, i + 100).map(r => r.id);
  const { error } = await supabase.from('knowledge_base').delete().in('id', ids);
  if (error) console.error('❌', error.message); else borradas += ids.length;
}
const { count: c2 } = await supabase.from('knowledge_base').select('*', { count: 'exact', head: true });
console.log(`🗑️  Filas fantasma borradas: ${borradas} | filas restantes: ${c2}`);
