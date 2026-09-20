import * as fs from 'fs';
import * as path from 'path';
const knowledgeDir = path.join(process.cwd(), 'knowledge');
const EXCLUDED_DIRS = ['web'];
const walk = (dir, out = []) => {
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      const relDir = path.relative(knowledgeDir, filePath).split(path.sep)[0];
      if (EXCLUDED_DIRS.includes(relDir)) continue;
      walk(filePath, out);
    } else if (filePath.endsWith('.md')) out.push(filePath);
  }
  return out;
};
const inc = walk(knowledgeDir);
const total = [];
const walkAll = (d) => { for (const f of fs.readdirSync(d)) { const p2 = path.join(d, f); fs.statSync(p2).isDirectory() ? walkAll(p2) : (p2.endsWith('.md') && total.push(p2)); } };
walkAll(knowledgeDir);
console.log(`Ficheros que se ingerirían: ${inc.length} | existentes en knowledge/: ${total.length} | excluidos: ${total.length - inc.length}`);
console.log('¿algún fichero de web/ colado?', inc.some(f => f.includes('knowledge' + path.sep + 'web' + path.sep)) ? 'SÍ ⚠️' : 'no');
