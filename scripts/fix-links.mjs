import fs from 'fs';
import path from 'path';

const pagePath = path.resolve(process.cwd(), 'app/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// Replace <Link href="..." onClick={() => analyticsEvents.trackEvent('action', 'cat', 'label')} ...
// with <TrackedLink href="..." trackAction="action" trackCategory="cat" trackLabel="label" ...

content = content.replace(
  /<Link\s+href=([^>]+)onClick=\{[^}]*?analyticsEvents\??\.trackEvent\('([^']+)',\s*'([^']+)',\s*([^\)]+)\)[^}]*\}\s*/g,
  '<TrackedLink\n                href=$1trackAction="$2"\n                trackCategory="$3"\n                trackLabel={$4}\n                '
);

content = content.replace(/<\/Link>/g, '</TrackedLink>');
content = content.replace(/import Link from 'next\/link'\r?\n/g, '');

fs.writeFileSync(pagePath, content);
console.log('Fixed remaining Link tags.');
