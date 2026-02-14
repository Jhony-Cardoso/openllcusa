/**
 * TEST LOCAL FINAL V7: Genera un SS-4 DEFINITIVO.
 * (Fecha corregida a la derecha +45 unidades)
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_PATH = path.join(__dirname, '..', 'public', 'form-ss4.pdf');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'TEST_SS4_FINAL_V7.pdf');
const DARK_BLUE = rgb(0, 0, 0.55);
const FONT_SIZE_MAIN = 9;
const FONT_SIZE_SMALL = 8;

const findField = (form, fullName) => {
    try { return form.getField(fullName) } catch (e) {
        const shortName = fullName.split('.').pop()
        if (shortName && shortName !== fullName) {
            const allFields = form.getFields();
            const found = allFields.find(f => f.getName().endsWith(shortName));
            if (found) return found;
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
        if (maxLength === undefined || maxLength > (text.length + 10)) { text = '        ' + text }
        if (maxLength !== undefined && text.length > maxLength) { text = text.substring(0, maxLength) }
        try {
            field.setText(text)
            field.updateAppearances(font)
            field.setFontSize(text.length > 35 ? FONT_SIZE_SMALL : FONT_SIZE_MAIN)
            field.setFontColor(DARK_BLUE)
        } catch (e) { }
    }
}

const setCheck = (form, fullName, shouldCheck = true) => {
    if (!shouldCheck) return
    const field = findField(form, fullName)
    if (field && field.constructor.name === 'PDFCheckBox') { try { field.check() } catch (e) { } }
}

async function run() {
    console.log('🧪 Generando SS-4 FINAL V7 (DEFINITIVO)...\n');

    const pdfBytes = fs.readFileSync(TEMPLATE_PATH);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const form = pdfDoc.getForm();
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const page = pdfDoc.getPages()[0];

    setText(form, 'topmostSubform[0].Page1[0].f1_2[0]', 'Richard Lagarth LLC', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_4[0]', 'Richard Lagarth', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].Line4ReadOrder[0].f1_5[0]', '30 N Gould St Ste R', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].Line4ReadOrder[0].f1_6[0]', 'Sheridan, WY 82801', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_7[0]', '', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_9[0]', 'U.S.A. and Wyoming', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_10[0]', 'Richard Lagarth', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_11[0]', 'Foreign', fontBold);
    setCheck(form, 'topmostSubform[0].Page1[0].c1_1[0]'); // LLC Yes
    setText(form, 'topmostSubform[0].Page1[0].f1_12[0]', '1', fontBold);
    setCheck(form, 'topmostSubform[0].Page1[0].c1_2[0]'); // US Yes

    setCheck(form, 'topmostSubform[0].Page1[0].c1_3[15]'); // Other Checkbox
    setText(form, 'topmostSubform[0].Page1[0].f1_19[0]', 'DISREGARDED ENTITY', fontBold);

    setCheck(form, 'topmostSubform[0].Page1[0].c1_4[0]');
    setText(form, 'topmostSubform[0].Page1[0].f1_25[0]', '', fontBold);
    page.drawText('E-COMMERCE SERVICES', {
        x: 80,
        y: 374,
        size: 8,
        font: fontBold,
        color: DARK_BLUE
    });

    setText(form, 'topmostSubform[0].Page1[0].f1_31[0]', '02, 11, 2026', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_32[0]', 'DECEMBER', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_33[0]', '0', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_34[0]', '0', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_35[0]', '0', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_36[0]', 'N/A', fontBold);
    setCheck(form, 'topmostSubform[0].Page1[0].c1_6[11]');
    setText(form, 'topmostSubform[0].Page1[0].f1_37[0]', 'E-COMMERCE SERVICES', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_38[0]', 'DIGITAL GOODS AND SERVICES', fontBold);
    setCheck(form, 'topmostSubform[0].Page1[0].c1_7[1]');

    setText(form, 'topmostSubform[0].Page1[0].f1_40[0]', 'ZARA DESIGNS LLC', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_41[0]', '307-555-0123', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_42[0]', 'pendiente', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_44[0]', 'Richard Lagarth', fontBold);
    setText(form, 'topmostSubform[0].Page1[0].f1_45[0]', '505 546 4190', fontBold);

    // Fecha Final (Corrected)
    const dateStr = '02/11/2026';
    page.drawText(dateStr, {
        x: 375,  // Nueva Posición Calculada (+45u)
        y: 40,
        size: 9,
        font: fontBold,
        color: DARK_BLUE
    });

    form.flatten();
    fs.writeFileSync(OUTPUT_PATH, await pdfDoc.save());
    console.log(`\n🎉 PDF DEFINITIVO generado: ${OUTPUT_PATH}`);
}

run().catch(console.error);
