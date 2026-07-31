import fs from 'fs';
import path from 'path';

const pagePath = path.resolve(process.cwd(), 'app/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// The QuickContactSection is between "const COUNTRIES_LIST" (line ~905) and "function CTAFinalSection" (line ~1068).
// We'll extract it using regex.
const contactSectionRegex = /\/\/ QUICK CONTACT FORM OPTIMIZADO[\s\S]*?function QuickContactSection\(\) \{[\s\S]*?\}\r?\n       \r?\n\r?\n/m;

const match = content.match(contactSectionRegex);
if (!match) {
  console.log("Could not find QuickContactSection");
  process.exit(1);
}

const contactSectionCode = match[0];

// Remove it from page.tsx
content = content.replace(contactSectionRegex, '');

// Import QuickContactSection in page.tsx
content = content.replace(/^import MobileStickyCTA/m, "import MobileStickyCTA from '@/components/home/MobileStickyCTA'\nimport QuickContactSection from '@/components/home/QuickContactSection'");

fs.writeFileSync(pagePath, content);

// Now write QuickContactSection.tsx
const contactComponentPath = path.resolve(process.cwd(), 'components/home/QuickContactSection.tsx');

const componentCode = `'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { analyticsEvents } from '@/lib/analytics';

const T = {
  // Blues — for hero, footer, accents only
  bd: '#0C2047', b9: '#1E3A8A', b7: '#1D4ED8', b5: '#3B82F6',
  b1: '#DBEAFE', b0: '#EFF6FF',
  // Green — success, checks
  gn: '#10B981', gd: '#059669', gl: '#D1FAE5',
  // CTA — orange
  ct: '#EA580C', ch: '#C2410C',
  // Neutrals
  tx: '#111827', ts: '#4B5563', tm: '#9CA3AF',
  br: '#E5E7EB', wh: '#FFFFFF', sf: '#F8FAFC',
  // Shadows
  shCard: '0 1px 4px rgba(17,24,39,.06), 0 4px 16px rgba(17,24,39,.07)',
  shCta: '0 6px 24px rgba(234,88,12,.38)',
  shBlue: '0 6px 24px rgba(30,58,138,.24)',
} as const;

function Eyebrow({ text, green }: { text: string; green?: boolean }) {
  return (
    <span
      className="inline-block text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full"
      style={{
        background: green ? T.gl : T.b0,
        color: green ? T.gd : T.b7,
      }}
    >
      {text}
    </span>
  )
}

` + contactSectionCode + `

export default QuickContactSection;
`;

fs.writeFileSync(contactComponentPath, componentCode);

console.log('QuickContactSection extracted successfully.');
