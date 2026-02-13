
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas de archivos
const TEMPLATE_PATH = path.join(__dirname, '..', 'public', 'form-ss4.pdf');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'TEST_SS4_FILLED.pdf');
const SIGNATURE_PATH = path.join(__dirname, '..', 'public', 'signature_test.png'); // Asegúrate de tener una imagen PNG aquí o crearé una básica

async function runPOC() {
    try {
        console.log('--- Iniciando POC de Rellenado SS-4 ---');

        // 1. Cargar PDF
        const pdfBytes = fs.readFileSync(TEMPLATE_PATH);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();
        const fields = form.getFields();

        console.log(`✅ PDF cargado. Campos detectados: ${fields.length}`);

        // 2. Listar campos para mapeo (Solo los primeros 20 para no saturar consola)
        console.log('\n--- Primeros 20 Campos del Formulario ---');
        fields.slice(0, 20).forEach(field => {
            const type = field.constructor.name;
            const name = field.getName();
            console.log(`${type}: ${name}`);
        });
        console.log('-----------------------------------------\n');

        // Mapeo tentativo (Basado en nombres comunes del IRS, se ajustará tras ver el log)
        // Nota: Los nombres pueden variar. Esta es una suposición inicial.
        // Intentaremos encontrar campos por nombre parcial si es necesario.

        const findField = (partialName) => fields.find(f => f.getName().includes(partialName));

        // DATOS DE PRUEBA
        const datos = {
            legalName: 'MI EMPRESA EJEMPLO LLC',
            tradeName: 'Open LLC Demo',
            address: '123 Innovation Dr',
            city: 'Silicon Valley',
            state: 'CA',
            zip: '94000',
            county: 'Santa Clara',
            responsibleParty: 'Juan Pérez',
            ssn: '123-45-6789'
        };

        // 3. Rellenar campos (Intentando adivinar nombres estándar del IRS)
        // Nombre Legal (Línea 1)
        try {
            // En muchos forms IRS es 'topmostSubform[0].Page1[0].LegalName[0]' o 'f1_1[0]'
            const nameField = fields[0]; // A menudo el primero es el nombre
            if (nameField) nameField.setText(datos.legalName);
            console.log(`✏️ Rellenado campo 1 con: ${datos.legalName}`);
        } catch (e) { console.log('Error rellenando nombre:', e.message); }

        // Dirección
        // Aquí normalmente haríamos un mapeo preciso tras inspeccionar los nombres reales

        // 4. Incrustar Firma (Crearemos un PNG al vuelo si no existe, o usaremos uno base64)
        // Para la POC, usaré un cuadrado rojo como "firma" si no hay imagen
        const page = pdfDoc.getPages()[0];
        const { width, height } = page.getSize();

        console.log(`📄 Dimensiones página 1: ${width} x ${height}`);

        // Dibujar un rectángulo rojo donde iría la firma (aprox)
        page.drawRectangle({
            x: 400,
            y: 150,
            width: 150,
            height: 40,
            color: { type: 'RGB', red: 1, green: 0, blue: 0 },
            opacity: 0.3,
        });

        page.drawText('FIRMA DIGITAL AQUÍ', {
            x: 410,
            y: 165,
            size: 10,
        });

        // 5. Guardar PDF
        const pdfBytesFilled = await pdfDoc.save();
        fs.writeFileSync(OUTPUT_PATH, pdfBytesFilled);

        console.log(`\n✅ PDF Generado con éxito: ${OUTPUT_PATH}`);
        console.log('➡️  Abre este archivo para verificar el resultado.');

    } catch (error) {
        console.error('❌ Error en POC:', error);
    }
}

runPOC();
