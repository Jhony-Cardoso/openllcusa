import fs from 'fs';

const files = [
  'app/llc-para-ecommerce/page.tsx',
  'app/costo-crear-llc/page.tsx',
  'app/abrir-cuenta-bancaria-usa/page.tsx',
  'app/llc-texas/page.tsx',
  'app/llc-trading-con-cuentas-de-fondeo/page.tsx',
  'app/api/chat/route.ts'
];

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/\[ver nuestros planes\]\(\/paquetes\)/g, '[ver nuestros planes](/precios)')
       .replace(/\[revisar nuestros planes\]\(\/paquetes\)/g, '[revisar nuestros planes](/precios)')
       .replace(/href="\/paquetes"/g, 'href="/precios"');
  fs.writeFileSync(f, c);
  console.log('Updated ' + f);
});
