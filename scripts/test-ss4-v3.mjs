/**
 * TEST LOCAL v3.1: Logica alineada con pdfGenerator final.
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_PATH = path.join(__dirname, '..', 'public', 'form-ss4.pdf');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'TEST_SS4_v3.pdf');
const DARK_BLUE = rgb(0, 0, 0.55);

// --- Helpers ---
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

        // Sangría condicional
        if (maxLength === undefined || maxLength > (text.length + 8)) {
            text = '        ' + text
        }

        // Truncado condicional
        if (maxLength !== undefined && text.length > maxLength) {
            text = val.toUpperCase()
            if (text.length > maxLength) text = text.substring(0, maxLength)
        }

        try {
            field.setText(text)
            try {
                field.updateAppearances(font)
                field.setFontSize(text.length > 40 ? 8 : 10)
                field.setFontColor(DARK_BLUE)
                console.log(`  ✅ ${fullName} -> "${text}"`);
            } catch (e) {
                console.log(`  ⚠️ ${fullName} -> Error updateAppearances (pero texto seteado: "${text}")`);
            }
        } catch (e) {
            console.log(`  ❌ Error setting text ${fullName}: ${e.message}`);
        }
    } else {
        console.log(`  ❌ ${fullName} -> No encontrado`);
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
    } else {
        console.log(`  ❌ ${fullName} -> No encontrado (CB)`);
    }
}

// --- Execution ---
async function run() {
    console.log('🧪 Generando SS-4 v3.1 (Final Logic)...\n');

    const pdfBytes = fs.readFileSync(TEMPLATE_PATH);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const form = pdfDoc.getForm();
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Mismos datos
    setText(form, 'topmostSubform[0].Page1[0].f1_2[0]', 'Richard Lagarth LLC', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_4[0]', 'Richard Lagarth', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].Line4ReadOrder[0].f1_5[0]', '30 N Gould St Ste R', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_7[0]', 'Sheridan, WY 82801', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_9[0]', 'U.S.A. and Wyoming', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_10[0]', 'Richard Lagarth', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_11[0]', 'Foreign', fontBold); // SSN

    // Line 8
    setCheck(form, 'topmostSubform[0].Page1[0].c1_1[0]'); // LLC Yes
    setText(form, 'topmostSubform[0].Page1[0].f1_12[0]', '1', fontBold);
    setCheck(form, 'topmostSubform[0].Page1[0].c1_2[0]'); // US Yes

    // Line 9
    setCheck(form, 'topmostSubform[0].Page1[0].c1_3[6]'); // Other
    setText(form, 'topmostSubform[0].Page1[0].f1_16[0]', 'FOREIGN OWNED U.S. DISREGARDED ENTITY', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_18[0]', 'Wyoming', fontBold);

    // Line 10
    setCheck(form, 'topmostSubform[0].Page1[0].c1_4[0]'); // Started new
    setText(form, 'topmostSubform[0].Page1[0].f1_25[0]', 'ONLINE CONSULTING SERVICES', fontBold);

    // Line 11-13
    setText(form, 'topmostSubform[0].Page1[0].f1_22[0]', '02, 10, 2026', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_24[0]', 'DECEMBER', fontBold);

    setText(form, 'topmostSubform[0].Page1[0].f1_30[0]', '0', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_31[0]', '0', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_32[0]', '0', fontBold);

    setText(form, 'topmostSubform[0].Page1[0].f1_36[0]', 'N/A', fontBold);

    // Activity
    setCheck(form, 'topmostSubform[0].Page1[0].c1_6[11]'); // Other activity
    setText(form, 'topmostSubform[0].Page1[0].f1_37[0]', 'ONLINE CONSULTING SERVICES', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_38[0]', 'Legal consulting and contract services', fontBold);

    setCheck(form, 'topmostSubform[0].Page1[0].c1_7[1]'); // Prev EIN No

    // Designee
    setText(form, 'topmostSubform[0].Page1[0].f1_40[0]', 'Open LLC USA', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_41[0]', '307-555-0123', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_42[0]', '30 N Gould St Ste R, Sheridan, WY 82801', fontBold);

    // Applicant
    setText(form, 'topmostSubform[0].Page1[0].f1_44[0]', 'Richard Lagarth', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_45[0]', '505 546 4190', fontBold);

    // Fecha manual
    const page = pdfDoc.getPages()[0];
    const dateStr = '02/11/2026';
    page.drawText(dateStr, { x: 430, y: 28, size: 10, font: fontBold, color: DARK_BLUE });

    form.flatten();
    fs.writeFileSync(OUTPUT_PATH, await pdfDoc.save());
    console.log(`\n🎉 PDF v3.1 generado: ${OUTPUT_PATH}`);
}

run().catch(console.error);
