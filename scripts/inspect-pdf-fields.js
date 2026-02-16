
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function inspectPDF(filename) {
    const filePath = path.join(process.cwd(), 'public', 'templates', 'irs', filename);
    console.log(`\n🔍 Inspeccionando: ${filename}`);

    try {
        if (!fs.existsSync(filePath)) {
            console.error(`❌ El archivo no existe: ${filePath}`);
            return;
        }

        const pdfBytes = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();
        const fields = form.getFields();

        console.log(`✅ Encontrados ${fields.length} campos.`);
        console.log('--- Primeros 20 campos (para verificar) ---');

        fields.slice(0, 20).forEach(f => {
            console.log(`Name: '${f.getName()}' | Type: ${f.constructor.name}`);
        });

        // Guardar lista completa en un archivo para referencia rápida
        const allFields = fields.map(f => `${f.getName()} [${f.constructor.name}]`).join('\n');
        fs.writeFileSync(`scripts/fields_${filename}.txt`, allFields);
        console.log(`📝 Lista completa guardada en scripts/fields_${filename}.txt`);

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

(async () => {
    await inspectPDF('f5472.pdf');
    await inspectPDF('f1120.pdf');
})();
