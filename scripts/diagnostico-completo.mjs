import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
    const templatePath = path.join(__dirname, '..', 'public', 'form-ss4.pdf');
    const buffer = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    console.log('--- CAMPOS DETECTADOS ---');
    console.log('INDICE | TIPO | NOMBRE | MAX_LEN | DEFAULT');

    fields.forEach((f, i) => {
        const name = f.getName();
        const type = f.constructor.name.replace('PDF', '').replace('Field', '');
        let maxLen = '-';
        let defVal = '-';

        if (type === 'Text') {
            maxLen = f.getMaxLength() || 'Inf';
            defVal = f.getText() || '';
        } else if (type === 'CheckBox') {
            defVal = f.isChecked() ? 'Checked' : 'Unchecked';
        }

        console.log(`${String(i).padStart(3)} | ${type.padEnd(10)} | ${name.padEnd(45)} | ${String(maxLen).padEnd(5)} | ${defVal}`);
    });

    // Generar PDF de Mapeo Visual
    console.log('\n--- GENERANDO MAPA VISUAL ---');
    fields.forEach((f) => {
        if (f.constructor.name === 'PDFTextField') {
            try {
                // Poner el nombre corto (última parte) en el campo
                const shortName = f.getName().split('.').pop().replace('[0]', '');
                f.setText(shortName);
                f.setFontSize(6); // Fuente diminuta para que quepa
            } catch (e) { }
        }
    });

    const outPath = path.join(__dirname, '..', 'public', 'DEBUG_MAP.pdf');
    fs.writeFileSync(outPath, await pdfDoc.save());
    console.log(`✅ Mapa visual generado en: ${outPath}`);
}

run().catch(console.error);
