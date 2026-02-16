
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createMapPDF(filename) {
    const inputPath = path.join(process.cwd(), 'public', 'templates', 'irs', filename);
    const outputPath = path.join(process.cwd(), 'public', 'debug', `map_${filename}`);

    // Asegurar que existe public/debug
    if (!fs.existsSync(path.join(process.cwd(), 'public', 'debug'))) {
        fs.mkdirSync(path.join(process.cwd(), 'public', 'debug'), { recursive: true });
    }

    try {
        const pdfBytes = fs.readFileSync(inputPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();
        const fields = form.getFields();

        fields.forEach(field => {
            const name = field.getName();
            // Intentar rellenar con el nombre corto (última parte para que quepa)
            // ej: topmostSubform[0].Page1[0].f1_1[0] -> f1_1
            const shortName = name.split('.').pop().replace('[0]', '');

            try {
                if (field.constructor.name === 'PDFTextField') {
                    field.setText(shortName); // Escribimos el nombre en el campo
                    field.setFontSize(6);     // Letra pequeña para que quepa
                } else if (field.constructor.name === 'PDFCheckBox') {
                    // Checkbox no podemos escribir texto, pero podemos marcarlo
                    // field.check(); 
                }
            } catch (e) {
                // Ignorar campos de solo lectura o raros
            }
        });

        const pdfOut = await pdfDoc.save();
        fs.writeFileSync(outputPath, pdfOut);
        console.log(`✅ Mapa generado: ${outputPath}`);

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

(async () => {
    await createMapPDF('f5472.pdf');
    await createMapPDF('f1120.pdf');
})();
