import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const b = fs.readFileSync(path.join(__dirname, '..', 'public', 'form-ss4.pdf'));
const d = await PDFDocument.load(b);
const fields = d.getForm().getFields();

console.log('=== PRIMEROS 20 CAMPOS ===');
fields.slice(0, 20).forEach((x, i) => {
    console.log(`[${String(i).padStart(2, '0')}] ${x.constructor.name.padEnd(16)} -> ${x.getName()}`);
});
