// scripts/fix-boi-rows.mjs
// Parche puntual de knowledge_base: corrige la información sobre el BOI (FinCEN) sin
// recalcular embeddings (se actualiza solo el texto; el vector sigue siendo válido porque
// el tema de la fila no cambia). Uso:
//   node scripts/fix-boi-rows.mjs            -> simulación (no escribe nada)
//   node scripts/fix-boi-rows.mjs --apply    -> aplica los cambios
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });

const APPLY = process.argv.includes('--apply');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data, error } = await supabase.from('knowledge_base').select('id, title, content');
if (error) { console.error('ERROR:', error.message); process.exit(1); }

const EXENTO = 'Si tu LLC se constituyó en EE. UU., estás EXENTA de presentarlo: la regla provisional de FinCEN del 26 de marzo de 2025 exime a todas las entidades creadas en EE. UU. Solo siguen obligadas las empresas extranjeras registradas para operar en EE. UU.';

// Los espacios se escriben como \s+ porque los fragmentos guardados contienen saltos de línea.
const REPL = [
  [/Es\s+un\s+reporte\s+obligatorio\s+introducido\s+por\s+la\s+Ley\s+de\s+Transparencia\s+Corporativa\s*\(CTA\)\.\s*Obliga\s+a\s+informar\s+al\s+gobierno\s+de\s+EE\.\s*UU\.\s+sobre\s+quiénes\s+son\s+los\s+dueños\s+reales\s*\(Beneficial\s+Owners\)\s+de\s+la\s+empresa\./gi,
   `Es el reporte de beneficiarios reales (Beneficial Owners) que introdujo la Ley de Transparencia Corporativa. ${EXENTO}`],
  [/Las\s+LLC\s+creadas\s+a\s+partir\s+de\s+2024\s+tienen\s+90\s+días\s+desde\s+su\s+formación\s+para\s+presentarlo\.\s*Si\s+no\s+se\s+presenta,\s*las\s+multas\s+son\s+de\s+\$500\s+por\s+día\./gi,
   EXENTO],
  [/Open\s+LLC\s+USA\s+hace\s+este\s+trámite\s+por\s+\$99\.(?:\s*Puedes\s+solicitar\s+el\s*\[BOI\s+Report\s+aquí\]\(\/servicios\/boi-report\)\.)?/gi,
   'Explicación completa y fuente oficial en la [guía sobre el BOI Report](/boi-report).'],
  [/Open\s+LLC\s+USA\s+ofrece\s+el\s+servicio\s+de\s+presentación\s+del\s+BOI\s+Report\.\s*\[Contrata\s+el\s+servicio\s+aquí\]\(\/servicios\/boi-report\)\s+por\s+solo\s+\$99\./gi,
   'Recuerda: si tu LLC se creó en EE. UU., no tienes que presentar el BOI. [Aquí lo explicamos](/boi-report).'],
  [/Open\s+LLC\s+USA\s+presenta\s+el\s+BOI\s+Report\s+por\s+ti\s+de\s+forma\s+segura\.\s*\[Contratar\s+aquí\s+por\s+\$99\]\(\/servicios\/boi-report\)\./gi,
   'Recuerda: si tu LLC se creó en EE. UU., no tienes que presentar el BOI. [Aquí lo explicamos](/boi-report).'],
  [/es\s+un\s+nuevo\s+requisito\s+legal\s+introducido\s+en\s+EE\.UU\.\s+en\s+2024\s+bajo\s+la/gi,
   'es el reporte de beneficiarios reales que introdujo en 2024 la'],
  [/Obliga\s+a\s+la\s+mayoría\s+de\s+LLCs\s+a\s+informar\s+al\s+gobierno\s+de\s+EE\.UU\.\s+sobre\s+quiénes\s+son\s+sus\s+\*\*beneficiarios\s+reales\*\*\s*\(Beneficial\s+Owners\):\s*las\s+personas\s+que\s+poseen\s+o\s+controlan\s+la\s+empresa\s+de\s+forma\s+significativa\./gi,
   'Obligó hasta marzo de 2025 a la mayoría de LLCs a informar sobre sus **beneficiarios reales** (Beneficial Owners). Hoy solo lo presentan las **empresas extranjeras** registradas para operar en EE. UU.'],
  [/\*\*Las\s+LLCs\s+pequeñas\s+de\s+extranjeros\s+NO\s+están\s+exentas\.\*\*/gi,
   '**Cambio importante:** desde el 26 de marzo de 2025 todas las entidades creadas en EE. UU. están exentas del BOI (regla provisional de FinCEN). Solo quedan obligadas las empresas extranjeras registradas en EE. UU.'],
  [/###\s*BOI\s+Report\s*\(FinCEN\):\s*Presentación\s+del\s+reporte\s+de\s+beneficiarios\s+reales\s+ante\s+el\s+FinCEN,?\s*obligatorio\s+desde\s+2024\.\s*\[Contratar\s+aquí\]\(\/servicios\/boi-report\)\./gi,
   '### BOI Report (FinCEN) — no es necesario para tu LLC: no ofrecemos este trámite porque no lo necesitas. Las entidades creadas en EE. UU. están exentas desde marzo de 2025. [Aquí lo explicamos](/boi-report).'],
  [/(\*\*5\.\s*)Presentar\s+el\s+BOI\s+Report\s+ante\s+el\s+FinCEN:(\*\*)\s*-\s*Si\s+tu\s+LLC\s+fue\s+creada\s+desde\s+el\s+1\s+enero\s+2025,\s*tienes\s+\*\*30\s+días\*\*\s+desde\s+la\s+constitución\.\s*(?:-\s*\[Open\s+LLC\s+USA\s+puede\s+gestionarlo\s+por\s+ti\]\(\/servicios\/boi-report\)\.)?/gi,
   '$1Comprobar si tienes obligaciones de reporte ante el FinCEN (BOI):$2 - Si tu LLC se constituyó en EE. UU. estás exenta desde marzo de 2025: no hay nada que presentar ni pagar. - Solo afecta a empresas extranjeras registradas en EE. UU. - [Aquí lo explicamos](/boi-report).'],
  [/###\s*5\.\s*BOI\s+Report\s*\(confirmación\s+de\s+presentación\)\s*Guarda\s+el\s+acuse\s+de\s+recibo\s+del\s+FinCEN\s+confirmando\s+que\s+presentaste\s+el\s+BOI\s+Report\./gi,
   '### 5. Justificantes ante el FinCEN (solo si te obligó) Las LLCs creadas en EE. UU. están exentas del BOI desde marzo de 2025, así que hoy no necesitas ningún acuse.'],
  [/-\s*Si\s+presentaste\s+el\s+BOI\s+Report,\s*tienes\s+\*\*30\s+días\s+para\s+actualizar\*\*\s+tus\s+datos\s+en\s+el\s+FinCEN\./gi,
   '- El BOI Report no aplica a las LLCs creadas en EE. UU. (exentas desde marzo de 2025): no hay que actualizar nada ante el FinCEN.'],
  [/El\s+\*\*BOI\s+Report\*\*\s*\(introducido\s+en\s+2024\)\s+obliga\s+a\s+declarar\s+quién\s+es\s+el\s+\*\*beneficiario\s+real\*\*\s+de\s+la\s+empresa,\s*independientemente\s+de\s+quién\s+aparezca\s+nominalmente\s+en\s+los\s+documentos\./gi,
   'El **BOI Report** obligó entre 2024 y marzo de 2025 a declarar quién era el **beneficiario real**, independientemente de quién apareciera nominalmente en los documentos (hoy las LLCs creadas en EE. UU. están exentas).'],
  [/Tu\s+nombre\s+solo\s+constaría\s+en\s+el\s+Operating\s+Agreement\s*\(documento\s+privado\)\s+y\s+en\s+el\s+BOI\s+Report\s*\(base\s+de\s+datos\s+interna\s+y\s+segura\s+del\s+FinCEN,\s*no\s+pública\)\./gi,
   'Tu nombre solo constaría en el Operating Agreement, que es un documento privado que no se publica en el registro estatal.'],
  [/Se\s+presenta\s+una\s+sola\s+vez\s*\(y\s+cuando\s+hay\s+cambios\)\s+ante\s+el\s+FinCEN\s*\(Financial\s+Crimes\s+Enforcement\s+Network\)\./gi,
   'Desde el 26 de marzo de 2025, las entidades creadas en EE. UU. están exentas de presentarlo: solo lo presentan las empresas extranjeras registradas para operar en EE. UU.'],
  [/(\d)\.\s*\*\*Haber\s+presentado\s+el\s+BOI\s+Report\*\*\s+ante\s+el\s+FinCEN\./gi,
   '$1. **Contabilidad al día:** presentar el Formulario 5472 + 1120 cada año demuestra diligencia.'],
  [/##\s*Multas\s+por\s+incumplimiento:\s*\*\*\$500\s+por\s+día\*\*\s+de\s+retraso,\s*más\s+posibles\s+sanciones\s+penales\s+en\s+casos\s+graves\./gi,
   '## Multas por incumplimiento:\nEste apartado ya no se aplica a tu LLC: las entidades creadas en EE. UU. están exentas del BOI desde el 26 de marzo de 2025.'],
  [/##\s*¿Qué\s+multa\s+tiene\s+no\s+presentarlo\?\s*\*\*\$500\s+por\s+día\s+de\s+retraso\*\*,\s*con\s+posibles\s+sanciones\s+penales\s+adicionales\s+en\s+casos\s+de\s+fraude\./gi,
   '## ¿Qué multa tiene no presentarlo?\nNinguna, en tu caso: las entidades creadas en EE. UU. están exentas del BOI desde el 26 de marzo de 2025.'],
];

let planned = 0; const touched = [];
for (const r of data) {
  let nuevo = r.content; const hits = [];
  for (const [re, val] of REPL) {
    re.lastIndex = 0;
    if (re.test(nuevo)) { nuevo = nuevo.replace(re, val); hits.push(re.source.slice(0, 38) + '…'); }
    re.lastIndex = 0;
  }
  // Si la fila contenía dos afirmaciones obsoletas, el párrafo de exención puede quedar
  // duplicado dentro del mismo fragmento: nos quedamos con la primera aparición.
  const partes = nuevo.split(EXENTO);
  if (partes.length > 2) nuevo = partes[0] + EXENTO + partes.slice(1).join('');
  nuevo = nuevo.replace(/\n{3,}/g, '\n\n').trim();

  if (nuevo !== r.content) {
    planned++; touched.push({ id: r.id, title: r.title, hits });
    if (APPLY) {
      const { error: e2 } = await supabase.from('knowledge_base').update({ content: nuevo }).eq('id', r.id);
      if (e2) console.log('❌', r.id, e2.message);
    }
  }
}
console.log(`${APPLY ? '✅ APLICADO' : '🔎 SIMULACIÓN'} — filas modificadas: ${planned} de ${data.length}`);
const porTitulo = {}; for (const t of touched) porTitulo[t.title] = (porTitulo[t.title] || 0) + 1;
for (const [t, n] of Object.entries(porTitulo).sort((a, b) => b[1] - a[1])) console.log(`   ${n}x  ${t}`);

// comprobación final: no debe quedar ninguna afirmación falsa
const PROHIBIDO = ['/servicios/boi-report', 'por $99', 'NO están exentas', '$500 por día', '$591', 'obligatorio desde 2024', 'Presentar el BOI Report ante el FinCEN', '90 días desde su formación para presentarlo'];
const restos = [];
for (const r of data) {
  const objetivo = APPLY ? null : null; // en simulación evaluamos el resultado previsto
  let contenido = r.content;
  if (!APPLY) { for (const [re, val] of REPL) { re.lastIndex = 0; contenido = contenido.replace(re, val); re.lastIndex = 0; } }
  for (const p of PROHIBIDO) if (contenido.includes(p)) restos.push(`${r.title} :: ${p}`);
}
console.log(`\n${APPLY ? 'RESTOS tras el parche' : 'RESTOS previstos tras el parche'}: ${restos.length}`);
for (const x of [...new Set(restos)]) console.log('   ⚠️', x);
