
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function listFields(filePath) {
    try {
        const pdfBytes = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();
        const fields = form.getFields();

        console.log(`\n--- Fields for ${filePath} ---`);
        fields.forEach(field => {
            const type = field.constructor.name;
            const name = field.getName();
            console.log(`${name} (${type})`);
        });
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err);
    }
}

(async () => {
    await listFields('public/templates/irs/f5472.pdf');
    // await listFields('public/templates/irs/f1120.pdf'); // Comentado para no saturar la salida
})();
