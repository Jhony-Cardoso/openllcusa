// Script quirúrgico: añade CTAs a /precios en la sección de precios de homepage
import fs from 'fs';
import path from 'path';

const file = path.resolve(process.cwd(), 'app/page.tsx');
let content = fs.readFileSync(file, 'utf8');

const oldFootnote = `          <p className="text-center text-sm text-gray-500 mt-10">
            ✅ Precio final + tasa estatal según el estado elegido • Sin sorpresas • Garantía de devolución 100%
          </p>
        </div>
      </section>`;

const newFootnote = `          <p className="text-center text-sm text-gray-500 mt-10">
            ✅ Precio final + tasa estatal según el estado elegido • Sin sorpresas • Garantía de devolución 100%
          </p>
          <div className="text-center mt-8 flex flex-wrap gap-4 justify-center">
            <TrackedLink
              href="/precios"
              trackAction="cta_click"
              trackCategory="pricing"
              trackLabel="ver_todos_planes"
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full transition"
              style={{ background: '#EFF6FF', color: '#1E3A8A', border: '1.5px solid #DBEAFE' }}
            >
              Ver todos los planes (Mantener + Optimizar) →
            </TrackedLink>
            <TrackedLink
              href="/precios#comparativa"
              trackAction="cta_click"
              trackCategory="pricing"
              trackLabel="ver_comparativa"
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full transition"
              style={{ background: '#F8FAFC', color: '#4B5563', border: '1.5px solid #E5E7EB' }}
            >
              Comparar con competidores →
            </TrackedLink>
          </div>
        </div>
      </section>`;

if (!content.includes(oldFootnote)) {
  console.error('Target string not found — check line endings or content');
  process.exit(1);
}

content = content.replace(oldFootnote, newFootnote);
fs.writeFileSync(file, content, 'utf8');
console.log('Done — CTAs added to homepage pricing section.');
