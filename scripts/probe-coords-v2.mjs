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

    const fields = [
        'c1_4[0]', // Started new business Checkbox (Line 10)
        'f1_44[0]', // Name (Signature block check)
        'f1_45[0]'  // Phone (Signature block check)
    ];

    for (const name of fields) {
        try {
            const field = form.getField('topmostSubform[0].Page1[0].' + name);
            // Note: using prefix from typical structure
            if (field) {
                const widgets = field.acroField.getWidgets();
                if (widgets.length > 0) {
                    const rect = widgets[0].getRectangle();
                    console.log(`${name}: x=${Math.round(rect.x)}, y=${Math.round(rect.y)}, w=${Math.round(rect.width)}`);
                }
            } else {
                // Try short search
                const all = form.getFields();
                const found = all.find(f => f.getName().endsWith(name.split('[')[0]));
                if (found) {
                    const rect = found.acroField.getWidgets()[0].getRectangle();
                    console.log(`${name} (found): x=${Math.round(rect.x)}, y=${Math.round(rect.y)}`);
                }
            }
        } catch (e) {
            console.log(`${name}: Error ${e.message}`);
        }
    }
}

run();
