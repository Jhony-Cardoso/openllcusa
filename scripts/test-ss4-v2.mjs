/**
 * TEST LOCAL v2: Genera un SS-4 completo con datos de ejemplo
 * siguiendo el mismo estilo que el modelo ZARA DESIGNS LLC.
 * 
 * Uso: node scripts/test-ss4-v2.mjs
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_PATH = path.join(__dirname, '..', 'public', 'form-ss4.pdf');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'TEST_SS4_v2.pdf');

const DARK_BLUE = rgb(0, 0, 0.55);

// Mapa de campos (same as pdfGenerator.ts)
const F = {
    LEGAL_NAME: 'topmostSubform[0].Page1[0].f1_2[0]',
    TRADE_NAME: 'topmostSubform[0].Page1[0].f1_3[0]',
    EXECUTOR: 'topmostSubform[0].Page1[0].f1_4[0]',
    MAILING_ADDRESS: 'topmostSubform[0].Page1[0].Line4ReadOrder[0].f1_5[0]',
    STREET_ADDRESS: 'topmostSubform[0].Page1[0].Line4ReadOrder[0].f1_6[0]',
    CITY_STATE_ZIP: 'topmostSubform[0].Page1[0].f1_7[0]',
    CITY_STATE_FOREIGN: 'topmostSubform[0].Page1[0].f1_8[0]',
    COUNTY: 'topmostSubform[0].Page1[0].f1_9[0]',
    RESPONSIBLE_PARTY: 'topmostSubform[0].Page1[0].f1_10[0]',
    SSN_ITIN_EIN: 'topmostSubform[0].Page1[0].f1_11[0]',
    LLC_YES: 'topmostSubform[0].Page1[0].c1_1[0]',
    LLC_MEMBERS: 'topmostSubform[0].Page1[0].f1_12[0]',
    LLC_US_YES: 'topmostSubform[0].Page1[0].c1_2[0]',
    ENTITY_OTHER_CB: 'topmostSubform[0].Page1[0].c1_3[6]',
    ENTITY_OTHER_TEXT: 'topmostSubform[0].Page1[0].f1_16[0]',
    STATE_INCORPORATED: 'topmostSubform[0].Page1[0].f1_18[0]',
    REASON_STARTED_NEW: 'topmostSubform[0].Page1[0].c1_4[0]',
    REASON_STARTED_TYPE: 'topmostSubform[0].Page1[0].f1_25[0]',
    DATE_STARTED: 'topmostSubform[0].Page1[0].f1_22[0]',
    CLOSING_MONTH: 'topmostSubform[0].Page1[0].f1_24[0]',
    EMPLOYEES_AGRI: 'topmostSubform[0].Page1[0].f1_30[0]',
    EMPLOYEES_HOUSE: 'topmostSubform[0].Page1[0].f1_31[0]',
    EMPLOYEES_OTHER: 'topmostSubform[0].Page1[0].f1_32[0]',
    FIRST_DATE_WAGES: 'topmostSubform[0].Page1[0].f1_36[0]',
    ACTIVITY_OTHER_CB: 'topmostSubform[0].Page1[0].c1_6[11]',
    ACTIVITY_OTHER_TEXT: 'topmostSubform[0].Page1[0].f1_37[0]',
    PRINCIPAL_LINE: 'topmostSubform[0].Page1[0].f1_38[0]',
    PREV_EIN_NO: 'topmostSubform[0].Page1[0].c1_7[1]',
    DESIGNEE_NAME: 'topmostSubform[0].Page1[0].f1_40[0]',
    DESIGNEE_PHONE: 'topmostSubform[0].Page1[0].f1_41[0]',
    DESIGNEE_ADDRESS: 'topmostSubform[0].Page1[0].f1_42[0]',
    APPLICANT_NAME: 'topmostSubform[0].Page1[0].f1_44[0]',
    APPLICANT_PHONE: 'topmostSubform[0].Page1[0].f1_45[0]',
};

async function testSS4v2() {
    console.log('🧪 Generando SS-4 v2 (estilo ZARA DESIGNS)...\n');

    const pdfBytes = fs.readFileSync(TEMPLATE_PATH);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const setText = (fieldName, text) => {
        if (!text) return;
        try {
            const field = form.getTextField(fieldName);
            const upper = text.toUpperCase();
            const indented = '        ' + upper; // 8 espacios sangría
            field.setText(indented);
            field.updateAppearances(fontBold);
            field.setFontSize(upper.length > 40 ? 8 : 10);
            field.setFontColor(DARK_BLUE);
            console.log(`  ✅ → "${upper}"`);
        } catch (e) {
            console.log(`  ❌ No encontrado: ${fieldName}`);
        }
    };

    const check = (fieldName) => {
        try {
            form.getCheckBox(fieldName).check();
            console.log(`  ☑️ CHECKED`);
        } catch (e) {
            console.log(`  ❌ CB no encontrado: ${fieldName}`);
        }
    };

    // === RELLENAR ===

    console.log('Line 1 - Legal Name:');
    setText(F.LEGAL_NAME, 'Richard Lagarth LLC');

    console.log('Line 3 - Executor:');
    setText(F.EXECUTOR, 'Richard Lagarth');

    console.log('Line 4a - Mailing Address:');
    setText(F.MAILING_ADDRESS, '30 N Gould St Ste R');

    console.log('Line 4b - City, State, ZIP:');
    setText(F.CITY_STATE_ZIP, 'Sheridan, Wyoming 82801');

    console.log('Line 6 - County:');
    setText(F.COUNTY, 'U.S.A. and Wyoming');

    console.log('Line 7a - Responsible Party:');
    setText(F.RESPONSIBLE_PARTY, 'Richard Lagarth');

    console.log('Line 7b - SSN/ITIN:');
    setText(F.SSN_ITIN_EIN, 'Foreign');

    console.log('Line 8a - LLC? Yes:');
    check(F.LLC_YES);

    console.log('Line 8b - LLC Members:');
    setText(F.LLC_MEMBERS, '1');

    console.log('Line 8c - LLC in US? Yes:');
    check(F.LLC_US_YES);

    console.log('Line 9a - Other (specify):');
    check(F.ENTITY_OTHER_CB);
    setText(F.ENTITY_OTHER_TEXT, 'FOREIGN OWNED U.S. DISREGARDED ENTITY');

    console.log('Line 9b - State:');
    setText(F.STATE_INCORPORATED, 'Wyoming');

    console.log('Line 10 - Started new business:');
    check(F.REASON_STARTED_NEW);
    setText(F.REASON_STARTED_TYPE, 'ONLINE CONSULTING SERVICES');

    console.log('Line 11 - Date started:');
    setText(F.DATE_STARTED, '02, 10, 2026');

    console.log('Line 12 - Closing month:');
    setText(F.CLOSING_MONTH, 'DECEMBER');

    console.log('Line 13 - Employees:');
    setText(F.EMPLOYEES_AGRI, '0');
    setText(F.EMPLOYEES_HOUSE, '0');
    setText(F.EMPLOYEES_OTHER, '0');

    console.log('Line 15 - First date wages:');
    setText(F.FIRST_DATE_WAGES, 'N/A');

    console.log('Line 16 - Activity (Other):');
    check(F.ACTIVITY_OTHER_CB);
    setText(F.ACTIVITY_OTHER_TEXT, 'ONLINE CONSULTING SERVICES');

    console.log('Line 17 - Principal line:');
    setText(F.PRINCIPAL_LINE, 'Legal consulting and contract services');

    console.log('Line 18 - Previous EIN? No:');
    check(F.PREV_EIN_NO);

    console.log('Third Party Designee:');
    setText(F.DESIGNEE_NAME, 'Open LLC USA');
    setText(F.DESIGNEE_PHONE, '307-555-0123');
    setText(F.DESIGNEE_ADDRESS, '30 N Gould St Ste R, Sheridan, WY 82801');

    console.log('Applicant:');
    setText(F.APPLICANT_NAME, 'Richard Lagarth');
    setText(F.APPLICANT_PHONE, '505 546 4190');

    // --- Fecha junto a Signature ---
    const page = pdfDoc.getPages()[0];
    const today = new Date();
    const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
    page.drawText(dateStr, {
        x: 430,
        y: 28,
        size: 10,
        font: fontBold,
        color: DARK_BLUE,
    });
    console.log(`\nDate drawn: ${dateStr} at position (430, 28)`);

    // Aplanar
    form.flatten();
    const filledBytes = await pdfDoc.save();
    fs.writeFileSync(OUTPUT_PATH, filledBytes);

    console.log(`\n🎉 PDF v2 generado: ${OUTPUT_PATH}`);
    console.log('➡️  Ábrelo y compara con el modelo de ZARA DESIGNS.');
}

testSS4v2().catch(console.error);
