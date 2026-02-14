import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_PATH = path.join(__dirname, '..', 'public', 'form-ss4.pdf');

async function run() {
    const pdfBytes = fs.readFileSync(TEMPLATE_PATH);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const form = pdfDoc.getForm();

    const fields = ['f1_5[0]', 'f1_6[0]', 'f1_7[0]'];

    for (const name of fields) {
        try {
            const fullName = `topmostSubform[0].Page1[0].${name.startsWith('f1_5') || name.startsWith('f1_6') ? 'Line4ReadOrder[0].' : ''}${name}`;
            // Note: f1_5 and f1_6 are inside Line4ReadOrder per diagnostic list step 2742
            // f1_7 is separate.

            let field;
            try { field = form.getField(fullName); } catch (e) {
                // Try simplified lookup
                const simpleName = name.split('[')[0];
                const allFields = form.getFields();
                field = allFields.find(f => f.getName().endsWith(name));
            }

            if (field) {
                const rect = field.acroField.getWidgets()[0].getRectangle();
                console.log(`${name}: x=${Math.round(rect.x)}, y=${Math.round(rect.y)}`);
            } else {
                console.log(`${name}: Not Found`);
            }
        } catch (e) {
            console.log(`${name}: Error ${e.message}`);
        }
    }
}

run();
