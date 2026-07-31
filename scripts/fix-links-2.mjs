import fs from 'fs';
import path from 'path';

const pagePath = path.resolve(process.cwd(), 'app/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// Replace any remaining <Link and </Link>
content = content.replace(/<Link/g, '<TrackedLink');
content = content.replace(/<\/Link>/g, '</TrackedLink>');

fs.writeFileSync(pagePath, content);
console.log('Replaced all remaining Links.');
