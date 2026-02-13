/**
 * TEST LOCAL: Genera un SS-4 con datos de ejemplo
 * para verificar que los campos caen en las líneas correctas.
 * 
 * Uso: node scripts/test-ss4-local.mjs
 */

import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_PATH = path.join(__dirname, '..', 'public', 'form-ss4.pdf');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'TEST_SS4_FILLED.pdf');

// Simulamos los datos REALES del pedido de Richard Lagarth
const testData = {
    legalName: 'Richard Lagarth LLC',
    tradeName: '',
    executorName: 'Richard Lagarth',
    mailingAddress: '30 N Gould St Ste R',
    cityStateZip: 'Sheridan, WY 82801',
    county: 'Sheridan, Wyoming',
    responsiblePartyName: 'Richard Lagarth',
    responsiblePartySSN: '',
    isLLC: true,
    llcMemberCount: '1',
    entityType: 'LLC',
    startDate: '02/10/2026',
    closingMonth: 'December',
    principalActivity: 'Consultoría Legal',
    principalProduct: 'Contratos',
    reasonForApplying: 'Started new business',
};

// El mapeo CORREGIDO
const SS4_FIELD_MAP = {
    LEGAL_NAME: 'topmostSubform[0].Page1[0].f1_2[0]',
    TRADE_NAME: 'topmostSubform[0].Page1[0].f1_3[0]',
    EXECUTOR_NAME: 'topmostSubform[0].Page1[0].f1_4[0]',
    MAILING_ADDRESS: 'topmostSubform[0].Page1[0].Line4ReadOrder[0].f1_5[0]',
    STREET_ADDRESS: 'topmostSubform[0].Page1[0].Line4ReadOrder[0].f1_6[0]',
    CITY_STATE_ZIP: 'topmostSubform[0].Page1[0].f1_7[0]',
    CITY_STATE_FOREIGN: 'topmostSubform[0].Page1[0].f1_8[0]',
    COUNTY: 'topmostSubform[0].Page1[0].f1_9[0]',
    RESPONSIBLE_PARTY: 'topmostSubform[0].Page1[0].f1_10[0]',
    SSN_ITIN_EIN: 'topmostSubform[0].Page1[0].f1_11[0]',
    LLC_YES: 'topmostSubform[0].Page1[0].c1_1[0]',
    LLC_NO: 'topmostSubform[0].Page1[0].c1_1[1]',
    LLC_MEMBERS: 'topmostSubform[0].Page1[0].f1_12[0]',
    LLC_US_YES: 'topmostSubform[0].Page1[0].c1_2[0]',
    ENTITY_OTHER_CB: 'topmostSubform[0].Page1[0].c1_3[6]',
    ENTITY_OTHER_TEXT: 'topmostSubform[0].Page1[0].f1_16[0]',
    STATE_INCORP: 'topmostSubform[0].Page1[0].f1_18[0]',
    DATE_STARTED: 'topmostSubform[0].Page1[0].f1_22[0]',
    CLOSING_MONTH: 'topmostSubform[0].Page1[0].f1_24[0]',
    EMPLOYEES: 'topmostSubform[0].Page1[0].f1_25[0]',
    PRINCIPAL_LINE: 'topmostSubform[0].Page1[0].f1_37[0]',
    PREV_EIN_NO: 'topmostSubform[0].Page1[0].c1_7[1]',
    DESIGNEE_NAME: 'topmostSubform[0].Page1[0].f1_40[0]',
    DESIGNEE_PHONE: 'topmostSubform[0].Page1[0].f1_41[0]',
    DESIGNEE_ADDRESS: 'topmostSubform[0].Page1[0].f1_42[0]',
    APPLICANT_NAME: 'topmostSubform[0].Page1[0].f1_44[0]',
    APPLICANT_PHONE: 'topmostSubform[0].Page1[0].f1_45[0]',
};

async function testSS4() {
    console.log('🧪 Generando SS-4 de prueba con datos de Richard Lagarth...\n');

    const pdfBytes = fs.readFileSync(TEMPLATE_PATH);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    const setText = (fieldName, text) => {
        if (!text) return;
        try {
            const field = form.getTextField(fieldName);
            field.setText(text);
            console.log(`  ✅ ${fieldName.split('.').pop()} = "${text}"`);
        } catch (e) {
            console.log(`  ❌ No encontrado: ${fieldName}`);
        }
    };

    const setCheck = (fieldName, checked) => {
        if (!checked) return;
        try {
            form.getCheckBox(fieldName).check();
            console.log(`  ☑️ ${fieldName.split('.').pop()} = CHECKED`);
        } catch (e) {
            console.log(`  ❌ Checkbox no encontrado: ${fieldName}`);
        }
    };

    // RELLENAR
    console.log('--- SECCIÓN IDENTIFICACIÓN ---');
    setText(SS4_FIELD_MAP.LEGAL_NAME, testData.legalName);
    setText(SS4_FIELD_MAP.TRADE_NAME, testData.tradeName);
    setText(SS4_FIELD_MAP.EXECUTOR_NAME, testData.executorName);
    setText(SS4_FIELD_MAP.MAILING_ADDRESS, testData.mailingAddress);
    setText(SS4_FIELD_MAP.CITY_STATE_ZIP, testData.cityStateZip);
    setText(SS4_FIELD_MAP.COUNTY, testData.county);
    setText(SS4_FIELD_MAP.RESPONSIBLE_PARTY, testData.responsiblePartyName);

    console.log('\n--- SECCIÓN LLC ---');
    setCheck(SS4_FIELD_MAP.LLC_YES, testData.isLLC);
    setText(SS4_FIELD_MAP.LLC_MEMBERS, testData.llcMemberCount);
    setCheck(SS4_FIELD_MAP.LLC_US_YES, true);

    console.log('\n--- SECCIÓN ENTIDAD ---');
    setCheck(SS4_FIELD_MAP.ENTITY_OTHER_CB, true);
    setText(SS4_FIELD_MAP.ENTITY_OTHER_TEXT, testData.entityType);
    setText(SS4_FIELD_MAP.STATE_INCORP, 'Wyoming');

    console.log('\n--- SECCIÓN FECHAS ---');
    setText(SS4_FIELD_MAP.DATE_STARTED, testData.startDate);
    setText(SS4_FIELD_MAP.CLOSING_MONTH, testData.closingMonth);
    setText(SS4_FIELD_MAP.EMPLOYEES, '3');

    console.log('\n--- SECCIÓN PRODUCTO ---');
    setText(SS4_FIELD_MAP.PRINCIPAL_LINE, `${testData.principalActivity} - ${testData.principalProduct}`);

    console.log('\n--- SECCIÓN 18 ---');
    setCheck(SS4_FIELD_MAP.PREV_EIN_NO, true);

    console.log('\n--- THIRD PARTY DESIGNEE ---');
    setText(SS4_FIELD_MAP.DESIGNEE_NAME, 'Open LLC USA');
    setText(SS4_FIELD_MAP.DESIGNEE_PHONE, '307-555-0123');
    setText(SS4_FIELD_MAP.DESIGNEE_ADDRESS, '30 N Gould St Ste R, Sheridan, WY 82801');

    console.log('\n--- APLICANTE ---');
    setText(SS4_FIELD_MAP.APPLICANT_NAME, testData.responsiblePartyName);

    // Aplanar y guardar
    form.flatten();
    const filledBytes = await pdfDoc.save();
    fs.writeFileSync(OUTPUT_PATH, filledBytes);

    console.log(`\n🎉 PDF generado exitosamente: ${OUTPUT_PATH}`);
    console.log('➡️  Ábrelo para verificar que todos los datos caen en las líneas correctas.');
}

testSS4().catch(console.error);
