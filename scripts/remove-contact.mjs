import fs from 'fs';
import path from 'path';

const pagePath = path.resolve(process.cwd(), 'app/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Remove the QuickContactSection definition and COUNTRIES_LIST
// We will find the index of "// QUICK CONTACT FORM OPTIMIZADO" and the end of the QuickContactSection function.

const startRegex = /\/\/ ───+\r?\n\/\/ QUICK CONTACT FORM OPTIMIZADO[\s\S]*?\/\/ ───+\r?\n/m;
const endRegex = /        \)\r?\n      \}\r?\n    <\/div>\r?\n  <\/section>\r?\n\)\r?\n\}\r?\n/m;
// Wait, the regex might be fragile. Let's just split the file by lines and remove the range.
const lines = content.split('\n');
let newLines = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('// QUICK CONTACT FORM OPTIMIZADO')) {
    // Also skip the preceding `// ────` line
    if (newLines.length > 0 && newLines[newLines.length - 1].includes('// ────')) {
      newLines.pop();
    }
    skip = true;
    continue;
  }
  
  if (skip) {
    if (line.trim() === '}' && i > 0 && lines[i - 1].includes('</section>')) {
      skip = false;
    }
    continue;
  }
  
  newLines.push(line);
}

content = newLines.join('\n');

// 2. Add the import if it's missing
if (!content.includes("import QuickContactSection from '@/components/home/QuickContactSection'")) {
  content = content.replace(
    /import MobileStickyCTA from '@\/components\/home\/MobileStickyCTA'/,
    "import MobileStickyCTA from '@/components/home/MobileStickyCTA'\nimport QuickContactSection from '@/components/home/QuickContactSection'"
  );
}

fs.writeFileSync(pagePath, content);
console.log('Successfully removed internal QuickContactSection and added import.');
