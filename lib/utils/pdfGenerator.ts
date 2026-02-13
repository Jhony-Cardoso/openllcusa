import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

export interface SS4Data {
    legalName: string
    tradeName?: string
    executorName?: string
    mailingAddress: string
    cityStateZip: string
    streetAddress?: string
    cityStateZipForeign?: string
    county?: string
    responsiblePartyName: string
    responsiblePartySSN?: string
    isLLC?: boolean
    llcMemberCount?: string
    llcOrganizedInUS?: boolean
    entityType?: string
    stateOfFormation?: string
    reasonForApplying?: string
    reasonSpecifyType?: string // Este será el campo del dashboard
    startDate?: string
    closingMonth?: string
    employeesAgricultural?: string
    employeesHousehold?: string
    employeesOther?: string
    firstDateWages?: string
    principalActivity?: string
    principalProduct?: string
    hasPreviousEIN?: boolean
    previousEIN?: string
    applicantNameAndTitle?: string
    applicantPhone?: string
    applicantFax?: string
    designeeName?: string
    designeePhone?: string
    designeeAddress?: string
    designeeFax?: string
}

const DARK_BLUE = rgb(0, 0, 0.55)
const FONT_SIZE_MAIN = 9
const FONT_SIZE_SMALL = 8

const findField = (form: any, fullName: string) => {
    try {
        return form.getField(fullName)
    } catch (e) {
        const shortName = fullName.split('.').pop()
        if (shortName && shortName !== fullName) {
            try {
                return form.getField(shortName)
            } catch (e2) {
                return null
            }
        }
        return null
    }
}

const fillText = (form: any, fullName: string, val: string | undefined, font: any) => {
    if (!val) return
    const field = findField(form, fullName)

    if (field && field.constructor.name === 'PDFTextField') {
        let text = val.toUpperCase()

        // Check MaxLength
        const maxLength = field.getMaxLength()

        // Sangría condicional: Solo si hay margen amplio
        if (maxLength === undefined || maxLength > (text.length + 10)) {
            text = '        ' + text
        }

        // Truncar si excede
        if (maxLength !== undefined && text.length > maxLength) {
            text = val.toUpperCase() // Reset sin sangría
            if (text.length > maxLength) {
                text = text.substring(0, maxLength)
            }
        }

        try {
            field.setText(text)
            try {
                field.updateAppearances(font)
                field.setFontSize(text.length > 35 ? FONT_SIZE_SMALL : FONT_SIZE_MAIN)
                field.setFontColor(DARK_BLUE)
            } catch (e) {
                // Ignorar fallo de apariencia, flatten resolverá
            }
        } catch (e) {
            console.warn(`Error setting text for ${fullName}:`, e)
        }
    }
}

const fillCheck = (form: any, fullName: string, shouldCheck: boolean = true) => {
    if (!shouldCheck) return
    const field = findField(form, fullName)
    if (field && field.constructor.name === 'PDFCheckBox') {
        try {
            field.check()
        } catch (e) {
            // Ignorar
        }
    }
}

const F = {
    LEGAL_NAME: 'topmostSubform[0].Page1[0].f1_2[0]',
    TRADE_NAME: 'topmostSubform[0].Page1[0].f1_3[0]',
    EXECUTOR: 'topmostSubform[0].Page1[0].f1_4[0]',
    MAILING_ADDRESS: 'topmostSubform[0].Page1[0].Line4ReadOrder[0].f1_5[0]', // 4a
    STREET_ADDRESS: 'topmostSubform[0].Page1[0].Line4ReadOrder[0].f1_6[0]',  // 5a
    CITY_STATE_ZIP: 'topmostSubform[0].Page1[0].f1_7[0]',               // 4b
    CITY_STATE_FOREIGN: 'topmostSubform[0].Page1[0].f1_8[0]',           // 5b
    COUNTY: 'topmostSubform[0].Page1[0].f1_9[0]',
    RESPONSIBLE_PARTY: 'topmostSubform[0].Page1[0].f1_10[0]',
    SSN_ITIN_EIN: 'topmostSubform[0].Page1[0].f1_11[0]',
    LLC_YES: 'topmostSubform[0].Page1[0].c1_1[0]',
    LLC_NO: 'topmostSubform[0].Page1[0].c1_1[1]',
    LLC_MEMBERS: 'topmostSubform[0].Page1[0].f1_12[0]',
    LLC_US_YES: 'topmostSubform[0].Page1[0].c1_2[0]',
    LLC_US_NO: 'topmostSubform[0].Page1[0].c1_2[1]',
    ENTITY_OTHER_CB: 'topmostSubform[0].Page1[0].c1_3[6]',
    ENTITY_OTHER_TEXT: 'topmostSubform[0].Page1[0].f1_19[0]', // Corregido ID
    STATE_INCORPORATED: 'topmostSubform[0].Page1[0].f1_18[0]',
    REASON_STARTED_NEW: 'topmostSubform[0].Page1[0].c1_4[0]',
    REASON_STARTED_TYPE: 'topmostSubform[0].Page1[0].f1_25[0]',
    REASON_BANKING: 'topmostSubform[0].Page1[0].c1_4[4]',
    REASON_BANKING_TEXT: 'topmostSubform[0].Page1[0].f1_28[0]',
    REASON_HIRED: 'topmostSubform[0].Page1[0].c1_4[1]',
    REASON_OTHER_CB: 'topmostSubform[0].Page1[0].c1_4[3]',
    REASON_OTHER_TEXT: 'topmostSubform[0].Page1[0].f1_26[0]',
    DATE_STARTED: 'topmostSubform[0].Page1[0].f1_31[0]', // Corregido ID
    CLOSING_MONTH: 'topmostSubform[0].Page1[0].f1_32[0]', // Corregido ID
    EMPLOYEES_AGRI: 'topmostSubform[0].Page1[0].f1_33[0]', // Shifted from 30
    EMPLOYEES_HOUSE: 'topmostSubform[0].Page1[0].f1_34[0]', // Shifted from 31
    EMPLOYEES_OTHER: 'topmostSubform[0].Page1[0].f1_35[0]', // Shifted from 32
    FIRST_DATE_WAGES: 'topmostSubform[0].Page1[0].f1_36[0]',
    ACTIVITY_OTHER_CB: 'topmostSubform[0].Page1[0].c1_6[11]',
    ACTIVITY_OTHER_TEXT: 'topmostSubform[0].Page1[0].f1_37[0]',
    PRINCIPAL_LINE: 'topmostSubform[0].Page1[0].f1_38[0]',
    PREV_EIN_YES: 'topmostSubform[0].Page1[0].c1_7[0]',
    PREV_EIN_NO: 'topmostSubform[0].Page1[0].c1_7[1]',
    PREV_EIN: 'topmostSubform[0].Page1[0].f1_39[0]',
    DESIGNEE_NAME: 'topmostSubform[0].Page1[0].f1_40[0]',
    DESIGNEE_PHONE: 'topmostSubform[0].Page1[0].f1_41[0]',
    DESIGNEE_ADDRESS: 'topmostSubform[0].Page1[0].f1_42[0]',
    DESIGNEE_FAX: 'topmostSubform[0].Page1[0].f1_43[0]',
    APPLICANT_NAME: 'topmostSubform[0].Page1[0].f1_44[0]',
    APPLICANT_PHONE: 'topmostSubform[0].Page1[0].f1_45[0]',
    APPLICANT_FAX: 'topmostSubform[0].Page1[0].f1_46[0]',
}

export class PDFGenerator {
    static async generarSS4(data: SS4Data, signatureBase64?: string): Promise<Uint8Array> {
        try {
            const templatePath = path.join(process.cwd(), 'public', 'form-ss4.pdf')
            const pdfBytes = fs.readFileSync(templatePath)
            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
            const form = pdfDoc.getForm()
            const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

            // --- Identification ---
            fillText(form, F.LEGAL_NAME, data.legalName, fontBold)
            fillText(form, F.TRADE_NAME, data.tradeName, fontBold)
            fillText(form, F.EXECUTOR, data.executorName, fontBold)

            // Mapeo Direcciones Corregido (L4a y L4b)
            fillText(form, F.MAILING_ADDRESS, data.mailingAddress, fontBold)
            fillText(form, F.CITY_STATE_ZIP, data.cityStateZip, fontBold)

            // L5a y L5b solo si son diferentes (deben venir vacíos si son iguales)
            fillText(form, F.STREET_ADDRESS, data.streetAddress, fontBold)
            fillText(form, F.CITY_STATE_FOREIGN, data.cityStateZipForeign, fontBold)

            fillText(form, F.COUNTY, data.county, fontBold)
            fillText(form, F.RESPONSIBLE_PARTY, data.responsiblePartyName, fontBold)
            fillText(form, F.SSN_ITIN_EIN, data.responsiblePartySSN || 'Foreign', fontBold)

            // --- LLC (L8) ---
            fillCheck(form, F.LLC_YES, data.isLLC !== false)
            fillCheck(form, F.LLC_NO, data.isLLC === false)
            fillText(form, F.LLC_MEMBERS, data.llcMemberCount || '1', fontBold)
            fillCheck(form, F.LLC_US_YES, data.llcOrganizedInUS !== false)
            fillCheck(form, F.LLC_US_NO, data.llcOrganizedInUS === false)

            // --- Entity Type (L9a) ---
            // REGLA USUARIO: Marcar Other + DISREGARDED ENTITY. Nada más.
            fillCheck(form, F.ENTITY_OTHER_CB)
            fillText(form, F.ENTITY_OTHER_TEXT, 'DISREGARDED ENTITY', fontBold)

            // --- State (L9b) ---
            // REGLA USUARIO: No marcar nada.
            // fillText(form, F.STATE_INCORPORATED, data.stateOfFormation, fontBold)

            // --- Reason (L10) ---
            // REGLA USUARIO: Siempre Started new business.
            fillCheck(form, F.REASON_STARTED_NEW)
            // Tipo específico (vendrá del dashboard)
            const reasonType = data.reasonSpecifyType || data.principalActivity || 'E-COMMERCE SERVICES'
            fillText(form, F.REASON_STARTED_TYPE, reasonType, fontBold)

            // --- Fechas (L11, L12) ---
            fillText(form, F.DATE_STARTED, data.startDate, fontBold)
            // REGLA USUARIO: Siempre DECEMBER
            fillText(form, F.CLOSING_MONTH, 'DECEMBER', fontBold)

            // --- Employees (L13) ---
            fillText(form, F.EMPLOYEES_AGRI, data.employeesAgricultural || '0', fontBold)
            fillText(form, F.EMPLOYEES_HOUSE, data.employeesHousehold || '0', fontBold)
            fillText(form, F.EMPLOYEES_OTHER, data.employeesOther || '0', fontBold)

            fillText(form, F.FIRST_DATE_WAGES, data.firstDateWages || 'N/A', fontBold)

            // --- Activity (L16, L17) ---
            fillCheck(form, F.ACTIVITY_OTHER_CB)
            fillText(form, F.ACTIVITY_OTHER_TEXT, data.principalActivity || 'E-COMMERCE SERVICES', fontBold)
            fillText(form, F.PRINCIPAL_LINE, data.principalProduct || 'DIGITAL GOODS AND SERVICES', fontBold)

            // --- Previous EIN (L18) ---
            if (data.hasPreviousEIN) {
                fillCheck(form, F.PREV_EIN_YES)
                fillText(form, F.PREV_EIN, data.previousEIN, fontBold)
            } else {
                fillCheck(form, F.PREV_EIN_NO)
            }

            // --- Designee (Third Party) ---
            // REGLA USUARIO: Usar entidad legal Zara Designs LLC.
            fillText(form, F.DESIGNEE_NAME, data.designeeName || 'ZARA DESIGNS LLC', fontBold)
            fillText(form, F.DESIGNEE_PHONE, data.designeePhone || '307-555-0123', fontBold)
            fillText(form, F.DESIGNEE_ADDRESS, data.designeeAddress || '30 N Gould St Ste R, Sheridan, WY 82801', fontBold)
            fillText(form, F.DESIGNEE_FAX, data.designeeFax, fontBold)

            // --- Applicant ---
            fillText(form, F.APPLICANT_NAME, data.applicantNameAndTitle || data.responsiblePartyName, fontBold)
            fillText(form, F.APPLICANT_PHONE, data.applicantPhone, fontBold)
            fillText(form, F.APPLICANT_FAX, data.applicantFax, fontBold)

            // --- Incrustar firma ---
            if (signatureBase64 && signatureBase64.startsWith('data:image')) {
                try {
                    const base64Data = signatureBase64.split(',')[1]
                    const sigBuffer = Buffer.from(base64Data, 'base64')
                    const sigImage = await pdfDoc.embedPng(sigBuffer)
                    const page = pdfDoc.getPages()[0]
                    const MAX_W = 150
                    const MAX_H = 35
                    const scale = Math.min(MAX_W / sigImage.width, MAX_H / sigImage.height)
                    page.drawImage(sigImage, {
                        x: 90,
                        y: 28, // Mantener Y de firma
                        width: sigImage.width * scale,
                        height: sigImage.height * scale
                    })
                } catch (err) { }
            }

            // --- Fecha Pie de Página ---
            // REGLA USUARIO: Corregir ubicación.
            const page = pdfDoc.getPages()[0]
            const today = new Date()
            const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`
            page.drawText(dateStr, {
                x: 435, // Ajustado derecha
                y: 44,  // Subido para estar EN la línea
                size: FONT_SIZE_MAIN,
                font: fontBold,
                color: DARK_BLUE
            })

            form.flatten()
            return await pdfDoc.save()

        } catch (error) {
            console.error('Generación SS4 fallida:', error)
            throw error
        }
    }
}
