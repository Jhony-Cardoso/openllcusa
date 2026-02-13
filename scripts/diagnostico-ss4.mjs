/**
 * SCRIPT DE DIAGNÓSTICO SS-4
 * 
 * Este script rellena CADA campo del formulario con su propio nombre
 * para identificar visualmente qué campo físico corresponde a qué nombre interno.
 * 
 * Ejemplo: Si el campo "f1_5[0]" aparece en la línea "4b" del PDF,
 * veremos el texto "f1_5" impreso encima de la línea "City, State, ZIP".
 */

import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_PATH = path.join(__dirname, '..', 'public', 'form-ss4.pdf');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'DIAGNOSTICO_SS4.pdf');

async function diagnosticar() {
    console.log('--- Diagnóstico de Campos del Formulario SS-4 ---\n');

    const pdfBytes = fs.readFileSync(TEMPLATE_PATH);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    console.log(`Total campos detectados: ${fields.length}\n`);

    // Listamos TODOS los campos con tipo y nombre
    console.log('=== LISTA COMPLETA DE CAMPOS ===');
    fields.forEach((field, index) => {
        const type = field.constructor.name;
        const name = field.getName();
        console.log(`[${String(index).padStart(2, '0')}] ${type.padEnd(16)} → ${name}`);
    });
    console.log('================================\n');

    // Rellenamos cada campo de texto con su propio nombre abreviado
    let textFieldCount = 0;
    let checkboxCount = 0;

    fields.forEach((field, index) => {
        const name = field.getName();
        const type = field.constructor.name;

        if (type === 'PDFTextField') {
            textFieldCount++;
            try {
                const textField = form.getTextField(name);
                // Extraer la parte corta del nombre (f1_1, f1_2, etc.)
                const shortName = name.match(/f\d+_\d+/)?.[0] || `field_${index}`;
                textField.setText(`[${index}] ${shortName}`);
                textField.setFontSize(7);
            } catch (e) {
                console.warn(`  ⚠️ No se pudo escribir en: ${name}`);
            }
        } else if (type === 'PDFCheckBox') {
            checkboxCount++;
            try {
                // Marcamos TODOS los checkboxes para ver dónde caen
                const checkbox = form.getCheckBox(name);
                checkbox.check();
            } catch (e) {
                console.warn(`  ⚠️ No se pudo marcar checkbox: ${name}`);
            }
        }
    });

    console.log(`\n📝 Campos de texto rellenados: ${textFieldCount}`);
    console.log(`☑️ Checkboxes marcados: ${checkboxCount}`);

    // NO aplanar para poder ver los campos editables
    const pdfBytesFilled = await pdfDoc.save();
    fs.writeFileSync(OUTPUT_PATH, pdfBytesFilled);

    console.log(`\n✅ PDF de diagnóstico guardado en: ${OUTPUT_PATH}`);
    console.log('➡️  ABRE ESTE PDF y anota qué número [XX] aparece en cada línea del formulario.');
    console.log('   Esto nos dará el mapeo exacto para corregir pdfGenerator.ts');
}

diagnosticar().catch(console.error);
