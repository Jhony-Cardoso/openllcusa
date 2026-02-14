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

    try {
        const field = form.getField('topmostSubform[0].Page1[0].f1_25[0]');
        const widgets = field.acroField.getWidgets();
        if (widgets.length > 0) {
            const rect = widgets[0].getRectangle();
            console.log(`Rectangle f1_25: x=${rect.x}, y=${rect.y}, w=${rect.width}, h=${rect.height}`);
        } else {
            console.log('No widgets for f1_25');
        }
    } catch (e) {
        console.error(e);
    }
}

run();
