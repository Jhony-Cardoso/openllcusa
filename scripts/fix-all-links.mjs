import fs from 'fs';
import path from 'path';

const pagePath = path.resolve(process.cwd(), 'app/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Replace ALL remaining <Link with <TrackedLink
content = content.replace(/<Link\b/g, '<TrackedLink');
content = content.replace(/<\/Link>/g, '</TrackedLink>');

// 2. Remove ALL remaining onClick with analyticsEvents  
content = content.replace(/\s+onClick=\{[^}]*analyticsEvents[^}]*\}/g, '');

// 3. Remove analyticsEvents import if present
content = content.replace(/import \{ analyticsEvents \}.*\r?\n/g, '');

fs.writeFileSync(pagePath, content);

// Verify
const remaining = content.match(/<Link\b/g);
const remainingClose = content.match(/<\/Link>/g);
const remainingAnalytics = content.match(/analyticsEvents/g);
console.log('Remaining <Link:', remaining ? remaining.length : 0);
console.log('Remaining </Link>:', remainingClose ? remainingClose.length : 0);
console.log('Remaining analyticsEvents:', remainingAnalytics ? remainingAnalytics.length : 0);
console.log('Done.');
