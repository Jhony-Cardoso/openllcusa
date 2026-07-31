import fs from 'fs';
import path from 'path';

const pagePath = path.resolve(process.cwd(), 'app/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

const lines = content.split('\n');
let newLines = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('// QUICK CONTACT FORM OPTIMIZADO')) {
    // Remove the preceding comment line 
    if (newLines.length > 0 && newLines[newLines.length - 1].includes('// ──')) {
      newLines.pop();
    }
    skip = true;
    continue;
  }
  
  if (skip) {
    if (line.includes('// CTA FINAL SECTION OPTIMIZADA')) {
      skip = false;
      // We also skipped the preceding `// ───` line of CTA FINAL SECTION OPTIMIZADA, so we should add it back
      newLines.push('// ─────────────────────────────────────────────────────────────────────────────');
      newLines.push(line);
    }
    continue;
  }
  
  newLines.push(line);
}

content = newLines.join('\n');

// Add import QuickContactSection
if (!content.includes("import QuickContactSection")) {
  content = content.replace(
    /import MobileStickyCTA from '@\/components\/home\/MobileStickyCTA'/,
    "import MobileStickyCTA from '@/components/home/MobileStickyCTA'\nimport QuickContactSection from '@/components/home/QuickContactSection'"
  );
}

fs.writeFileSync(pagePath, content);
console.log('Successfully removed QuickContactSection and added import.');
