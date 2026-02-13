/**
 * TEST LOCAL FINAL: Genera un SS-4 con las correcciones visuales solicitadas.
 * (Size 9, Disregarded Entity, Zara Designs, December, Fecha pie ajustada)
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_PATH = path.join(__dirname, '..', 'public', 'form-ss4.pdf');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'TEST_SS4_FINAL_V2.pdf');
const DARK_BLUE = rgb(0, 0, 0.55);
const FONT_SIZE_MAIN = 9;
const FONT_SIZE_SMALL = 8;

const findField = (form, fullName) => {
    try { return form.getField(fullName) } catch (e) {
        const shortName = fullName.split('.').pop()
        if (shortName && shortName !== fullName) {
            try { return form.getField(shortName) } catch (e2) { return null }
        }
        return null
    }
}

const setText = (form, fullName, val, font) => {
    if (!val) return
    const field = findField(form, fullName)

    if (field && field.constructor.name === 'PDFTextField') {
        let text = val.toUpperCase()
        const maxLength = field.getMaxLength()

        // Sangría condicional (ajustada a +10 chars de margen)
        if (maxLength === undefined || maxLength > (text.length + 10)) {
            text = '        ' + text
        }

        if (maxLength !== undefined && text.length > maxLength) {
            text = val.toUpperCase()
            if (text.length > maxLength) text = text.substring(0, maxLength)
        }

        try {
            field.setText(text)
            try {
                field.updateAppearances(font)
                field.setFontSize(text.length > 35 ? FONT_SIZE_SMALL : FONT_SIZE_MAIN)
                field.setFontColor(DARK_BLUE)
                console.log(`  ✅ ${fullName} -> "${text}"`);
            } catch (e) {
                console.log(`  ⚠️ ${fullName} -> Error updateAppearances (pero texto seteado)`);
            }
        } catch (e) {
            console.log(`  ❌ Error setting text ${fullName}: ${e.message}`);
        }
    } else {
        // console.log(`  ❌ ${fullName} -> No encontrado`);
    }
}

const setCheck = (form, fullName, shouldCheck = true) => {
    if (!shouldCheck) return
    const field = findField(form, fullName)
    if (field && field.constructor.name === 'PDFCheckBox') {
        try {
            field.check()
            console.log(`  ☑️ ${fullName} -> CHECKED`);
        } catch (e) { console.log(`  ⚠️ ${fullName} check error`); }
    }
}

async function run() {
    console.log('🧪 Generando SS-4 FINAL (Correcciones de Usuario)...\n');

    const pdfBytes = fs.readFileSync(TEMPLATE_PATH);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const form = pdfDoc.getForm();
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Identificación
    setText(form, 'topmostSubform[0].Page1[0].f1_2[0]', 'Richard Lagarth LLC', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_4[0]', 'Richard Lagarth', fontBold);

    // L4 (Mailing) - Usamos f1_5 y f1_7
    setText(form, 'topmostSubform[0].Page1[0].Line4ReadOrder[0].f1_5[0]', '30 N Gould St Ste R', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_7[0]', 'Sheridan, WY 82801', fontBold);

    setText(form, 'topmostSubform[0].Page1[0].f1_9[0]', 'U.S.A. and Wyoming', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_10[0]', 'Richard Lagarth', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_11[0]', 'Foreign', fontBold); // SSN

    // Line 8
    setCheck(form, 'topmostSubform[0].Page1[0].c1_1[0]'); // LLC Yes
    setText(form, 'topmostSubform[0].Page1[0].f1_12[0]', '1', fontBold);
    setCheck(form, 'topmostSubform[0].Page1[0].c1_2[0]'); // US Yes

    // Line 9 (Entidad) - CORREGIDO: f1_19
    setCheck(form, 'topmostSubform[0].Page1[0].c1_3[6]'); // Other checkbox
    setText(form, 'topmostSubform[0].Page1[0].f1_19[0]', 'DISREGARDED ENTITY', fontBold);

    // Line 9b (Estado) - CORREGIDO: Vacío
    // (No llamamos setText)

    // Line 10 (Reason) - CORREGIDO: Siempre Started New
    setCheck(form, 'topmostSubform[0].Page1[0].c1_4[0]'); // Started new checkbox
    setText(form, 'topmostSubform[0].Page1[0].f1_25[0]', 'E-COMMERCE SERVICES', fontBold); // Specify type

    // Line 11 (Fecha Inicio) - CORREGIDO: f1_31
    setText(form, 'topmostSubform[0].Page1[0].f1_31[0]', '02, 11, 2026', fontBold);

    // Line 12 (Cierre) - CORREGIDO: f1_32
    setText(form, 'topmostSubform[0].Page1[0].f1_32[0]', 'DECEMBER', fontBold);

    // Empleados - CORREGIDO: f1_33, 34, 35
    setText(form, 'topmostSubform[0].Page1[0].f1_33[0]', '0', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_34[0]', '0', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_35[0]', '0', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_36[0]', 'N/A', fontBold); // Wages

    // Activity
    setCheck(form, 'topmostSubform[0].Page1[0].c1_6[11]'); // Other activity
    setText(form, 'topmostSubform[0].Page1[0].f1_37[0]', 'E-COMMERCE SERVICES', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_38[0]', 'DIGITAL GOODS AND SERVICES', fontBold);

    setCheck(form, 'topmostSubform[0].Page1[0].c1_7[1]'); // Prev EIN No

    // Designee - CORREGIDO: ZARA DESIGNS LLC
    setText(form, 'topmostSubform[0].Page1[0].f1_40[0]', 'ZARA DESIGNS LLC', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_41[0]', '307-555-0123', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_42[0]', '30 N Gould St Ste R, Sheridan, WY 82801', fontBold);

    // Applicant
    setText(form, 'topmostSubform[0].Page1[0].f1_44[0]', 'Richard Lagarth', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_45[0]', '505 546 4190', fontBold);

    // Fecha manual pie - CORREGIDO: Coordenadas ajustadas
    const page = pdfDoc.getPages()[0];
    const dateStr = '02/11/2026';
    page.drawText(dateStr, {
        x: 435, // Ajustado derecha
        y: 44,  // Subido para estar EN la línea
        size: FONT_SIZE_MAIN,
        font: fontBold,
        color: DARK_BLUE
    });

    form.flatten();
    fs.writeFileSync(OUTPUT_PATH, await pdfDoc.save());
    console.log(`\n🎉 PDF FINAL generado: ${OUTPUT_PATH}`);
}

run().catch(console.error);
