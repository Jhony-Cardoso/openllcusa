import fs from 'fs';
import path from 'path';

const file = path.resolve(process.cwd(), 'components/home/QuickContactSection.tsx');
let content = fs.readFileSync(file, 'utf8');

const brokenSection = `{sent ? (
            className="hp-fu rounded-2xl mx-auto"
            style={{ background: T.wh, border: \`1.5px solid \${T.br}\`, padding: '40px 36px', boxShadow: T.shCard, maxWidth: 680 }}
          >
            <div className="hp-fgrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: T.ts }}>Nombre completo *</label>
                <input`;

const fixedSection = `{sent ? (
          <div
            className="text-center rounded-2xl mx-auto"
            style={{ background: T.wh, border: \`1.5px solid rgba(16,185,129,.35)\`, padding: '48px 36px', boxShadow: T.shCard, maxWidth: 560 }}
          >
            <div className="text-4xl mb-5">✅</div>
            <h3 className="font-bold text-xl mb-2.5" style={{ color: T.tx }}>¡Solicitud recibida!</h3>
            <p className="text-[15.5px]" style={{ color: T.ts }}>
              Un especialista revisará tu caso y te responderá en menos de 12 horas.<br /><br />
              <strong>Si quieres que preparemos mejor tu respuesta</strong>, responde al email que te acabamos de enviar contándonos tu duda principal.
            </p>
          </div>
        ) : (
          /* Formulario simple */
          <form
            onSubmit={handleSubmit}
            className="hp-fu rounded-2xl mx-auto"
            style={{ background: T.wh, border: \`1.5px solid \${T.br}\`, padding: '40px 36px', boxShadow: T.shCard, maxWidth: 680 }}
          >
            <div className="hp-fgrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: T.ts }}>Nombre completo *</label>
                <input`;

content = content.replace(brokenSection, fixedSection);
fs.writeFileSync(file, content);
console.log('Restored QuickContactSection properly.');
