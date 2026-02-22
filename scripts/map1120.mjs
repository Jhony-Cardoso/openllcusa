import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function map1120() {
    const projectRoot = process.cwd();
    const pdfPath = path.join(projectRoot, 'public', 'templates', 'irs', 'f1120.pdf');
    if (!fs.existsSync(pdfPath)) {
        console.error('f1120.pdf not found');
        return;
    }
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    const allFields = [];
    for (const field of fields) {
        const name = field.getName();
        const type = field.constructor.name;
        try {
            const widgets = field.acroField.getWidgets();
            if (widgets.length > 0) {
                const rect = widgets[0].getRectangle();
                allFields.push({
                    name,
                    shortName: name.split('.').pop(),
                    type: type.includes('Check') ? 'checkbox' : 'text',
                    x: Math.round(rect.x),
                    y: Math.round(rect.y),
                    w: Math.round(rect.width),
                    h: Math.round(rect.height)
                });
            }
        } catch (e) { }
    }

    fs.writeFileSync('scripts/map1120.json', JSON.stringify(allFields, null, 2));
    console.log('✅ Created scripts/map1120.json');
}

map1120();
