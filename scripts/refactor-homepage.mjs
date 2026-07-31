import fs from 'fs';
import path from 'path';

const pagePath = path.resolve(process.cwd(), 'app/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Remove 'use client'
content = content.replace(/'use client'\r?\n/g, '');

// 2. Clean imports
content = content.replace(/import \{ Metadata \} from 'next'\r?\n/g, '');
content = content.replace(/import \{ analyticsEvents \}.*\r?\n/g, '');

const importsToAdd = `import { Metadata } from 'next'
import TrackedLink from '@/components/home/TrackedLink'
import ScrollObserver from '@/components/home/ScrollObserver'
import MobileStickyCTA from '@/components/home/MobileStickyCTA'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://openllcusa.com',
  },
}

`;
content = content.replace(/^import /m, importsToAdd + 'import ');

// 3. Remove useFadeUp definition
content = content.replace(/\/\/ ───+\r?\n\/\/ SCROLL ANIMATION HOOK\r?\n\/\/ ───+\r?\nfunction useFadeUp\(\) \{[\s\S]*?\}, \[\]\)\r?\n\}\r?\n/g, '');

// 4. Remove floating benefits section
content = content.replace(/\{\/\* =+ NUEVA SECCIÓN DE BENEFICIOS OPTIMIZADA =+ \*\/\}[\s\S]*?\{\/\* =+ FIN SECCIÓN BENEFICIOS =+ \*\/\}[\s\S]*?\r?\n/g, '');

// 5. Remove duplicated pricing section
content = content.replace(/\{\/\* =+ SECCIÓN PRECIOS OPTIMIZADA =+ \*\/\}[\s\S]*?<section className="py-20 bg-white" id="precios">[\s\S]*?✅ Precio final\. Sin sorpresas\. Garantía de devolución 100\%\.\r?\n    <\/p>\r?\n  <\/div>\r?\n<\/section>/g, '');

// 6. Remove MobileStickyCTA function
content = content.replace(/function MobileStickyCTA\(\) \{[\s\S]*?return \([\s\S]*?<\/div>\r?\n  \)\r?\n\}\r?\n/g, '');

// 7. Update HomePage function
content = content.replace(/export default function HomePage\(\) \{\r?\n  useFadeUp\(\)\r?\n\r?\n  return \(\r?\n    <main>/g, 'export default function HomePage() {\n  return (\n    <main>\n      <ScrollObserver />');

// 8. Fix JSON-LD
content = content.replace(/"telephone": "\+34-XXX-XXX-XXX",/g, '"email": "hola@openllcusa.com",');
content = content.replace(/"contactType": "customer service",/g, '"contactType": "customer support",');

// 9. Fix Analytics links
// Hero link
content = content.replace(/<Link\s+href="#precios"\s+onClick=\{[^\}]+\}\s+className="([^"]+)"\s+style=\{([^}]+)\}\s*>\s*Ver planes desde \$349\s*<\/Link>/g, 
  '<TrackedLink href="#precios" trackAction="cta_click" trackCategory="hero" trackLabel="ver_precios" className="$1" style={$2}>\n                Ver planes desde $349\n              </TrackedLink>');

// Service cards
content = content.replace(/<Link\s+href=\{`\/servicios\/\$\{service\.slug\}`\}\s+onClick=\{[^\}]+\}\s+className="([^"]+)"\s*>\s*Ver servicio\s*<\/Link>/g,
  '<TrackedLink href={`/servicios/${service.slug}`} trackAction="cta_click" trackCategory="servicios" trackLabel={service.title} className="$1">\n                  Ver servicio\n                </TrackedLink>');

// Process section
content = content.replace(/<a\s+href="#comenzar"\s+onClick=\{[^\}]+\}\s+className="([^"]+)"\s*>\s*Iniciar mi LLC ahora\s*<\/a>/g,
  '<TrackedLink href="#comenzar" trackAction="cta_click" trackCategory="process" trackLabel="iniciar_llc" className="$1">\n            Iniciar mi LLC ahora\n          </TrackedLink>');

// CTA Final
content = content.replace(/<Link\s+href="\/paquetes\/starter\/onboarding"\s+onClick=\{[^\}]+\}\s+className="([^"]+)"\s*>\s*Crear mi LLC ahora\s*<\/Link>/g,
  '<TrackedLink href="/paquetes/starter/onboarding" trackAction="cta_click" trackCategory="final_cta" trackLabel="crear_llc" className="$1">\n            Crear mi LLC ahora\n          </TrackedLink>');

// Pricing section CTA
content = content.replace(/<Link\s+href="\/paquetes\/starter\/onboarding"\s+onClick=\{[^\}]+\}\s+className="([^"]+)"\s*>\s*Elegir Starter\s*<\/Link>/g,
  '<TrackedLink href="/paquetes/starter/onboarding" trackAction="cta_click" trackCategory="pricing" trackLabel="starter" className="$1">\n                Elegir Starter\n              </TrackedLink>');

content = content.replace(/<Link\s+href="\/paquetes\/professional\/onboarding"\s+onClick=\{[^\}]+\}\s+className="([^"]+)"\s*>\s*Elegir Professional\s*<\/Link>/g,
  '<TrackedLink href="/paquetes/professional/onboarding" trackAction="cta_click" trackCategory="pricing" trackLabel="professional" className="$1">\n                Elegir Professional\n              </TrackedLink>');

content = content.replace(/<Link\s+href="\/paquetes\/business\/onboarding"\s+onClick=\{[^\}]+\}\s+className="([^"]+)"\s*>\s*Elegir Business\s*<\/Link>/g,
  '<TrackedLink href="/paquetes/business/onboarding" trackAction="cta_click" trackCategory="pricing" trackLabel="business" className="$1">\n                Elegir Business\n              </TrackedLink>');


fs.writeFileSync(pagePath, content);
console.log('Homepage refactored successfully.');
