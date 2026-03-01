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
        // Fallback: tratar de buscar por nombre corto y variaciones (f1_2 vs f1_02)
        const nameParts = fullName.split('.')
        let shortName = nameParts[nameParts.length - 1].replace('[0]', '')

        if (!shortName) return null

        // Intento 1: buscar directamente por el nombre corto
        try {
            return form.getField(shortName)
        } catch (e2) { }

        // Intento 2: buscar variaciones con/sin cero inicial (f1_02 vs f1_2)
        const variations = []
        if (shortName.startsWith('f1_')) {
            const num = shortName.replace('f1_', '')
            if (num.length === 1) variations.push(`f1_0\${num}`)
            if (num.startsWith('0')) variations.push(`f1_\${num.substring(1)}`)
        }

        for (const name of variations) {
            try { return form.getField(name) } catch (e) { }
            try { return form.getField(`\${name}[0]`) } catch (e) { }
        }

        // Intento 3: Búsqueda exhaustiva por sufijo (la más robusta)
        const allFields = form.getFields()
        const found = allFields.find((f: any) => {
            const n = f.getName()
            return n === shortName || n.endsWith('.' + shortName) || n.endsWith('.' + shortName + '[0]') || n === shortName + '[0]'
        })

        if (found) return found

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
    LEGAL_NAME: 'f1_02', // 1
    TRADE_NAME: 'f1_03', // 2
    EXECUTOR: 'f1_04',   // 3
    MAILING_ADDRESS: 'f1_05', // 4a
    STREET_ADDRESS: 'f1_07',  // 5a
    CITY_STATE_ZIP: 'f1_06',  // 4b
    CITY_STATE_FOREIGN: 'f1_08', // 5b
    COUNTY: 'f1_09', // 6
    RESPONSIBLE_PARTY: 'f1_10',
    SSN_ITIN_EIN: 'f1_11',
    LLC_YES: 'c1_1[0]',
    LLC_NO: 'c1_1[1]',
    LLC_MEMBERS: 'f1_12',
    LLC_US_YES: 'c1_2[0]',
    LLC_US_NO: 'c1_2[1]',
    ENTITY_OTHER_CB: 'c1_3[15]',
    ENTITY_OTHER_TEXT: 'f1_19',
    STATE_INCORPORATED: 'f1_18',
    REASON_STARTED_NEW: 'c1_4[0]',
    REASON_STARTED_TYPE: 'f1_25',
    REASON_BANKING: 'c1_4[4]',
    REASON_BANKING_TEXT: 'f1_28',
    REASON_HIRED: 'c1_4[1]',
    REASON_OTHER_CB: 'c1_4[3]',
    REASON_OTHER_TEXT: 'f1_26',
    DATE_STARTED: 'f1_31',
    CLOSING_MONTH: 'f1_32',
    EMPLOYEES_AGRI: 'f1_33',
    EMPLOYEES_HOUSE: 'f1_34',
    EMPLOYEES_OTHER: 'f1_35',
    FIRST_DATE_WAGES: 'f1_36',
    ACTIVITY_OTHER_CB: 'c1_6[11]',
    ACTIVITY_OTHER_TEXT: 'f1_37',
    PRINCIPAL_LINE: 'f1_38',
    PREV_EIN_YES: 'c1_7[0]',
    PREV_EIN_NO: 'c1_7[1]',
    PREV_EIN: 'f1_39',
    DESIGNEE_NAME: 'f1_40',
    DESIGNEE_PHONE: 'f1_41',
    DESIGNEE_ADDRESS: 'f1_42',
    DESIGNEE_FAX: 'f1_43',
    APPLICANT_NAME: 'f1_44',
    APPLICANT_PHONE: 'f1_45',
    APPLICANT_FAX: 'f1_46',
}

export class PDFGenerator {
    static async generarSS4(data: SS4Data, signatureBase64?: string): Promise<Uint8Array> {
        try {
            const templatePath = path.join(process.cwd(), 'public', 'form-ss4.pdf')
            const pdfBytes = fs.readFileSync(templatePath)
            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
            const form = pdfDoc.getForm()
            const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
            const page = pdfDoc.getPages()[0]

            // --- Identification ---
            fillText(form, F.LEGAL_NAME, data.legalName, fontBold)
            fillText(form, F.TRADE_NAME, data.tradeName, fontBold)
            fillText(form, F.EXECUTOR, data.executorName, fontBold)

            // Mapeo Direcciones Corregido (L4a y L4b)
            fillText(form, F.MAILING_ADDRESS, data.mailingAddress, fontBold)
            fillText(form, F.CITY_STATE_ZIP, data.cityStateZip, fontBold)

            // L5a y L5b solo si son diferentes
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
            fillCheck(form, F.ENTITY_OTHER_CB)
            fillText(form, F.ENTITY_OTHER_TEXT, 'DISREGARDED ENTITY', fontBold)

            // --- Reason (L10) ---
            fillCheck(form, F.REASON_STARTED_NEW)
            const reasonType = data.reasonSpecifyType || data.principalActivity || 'E-COMMERCE SERVICES'
            page.drawText(reasonType, {
                x: 80,
                y: 374,
                size: 8,
                font: fontBold,
                color: DARK_BLUE
            })

            // --- Fechas (L11, L12) ---
            fillText(form, F.DATE_STARTED, data.startDate, fontBold)
            fillText(form, F.CLOSING_MONTH, data.closingMonth || 'DECEMBER', fontBold)

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
            fillText(form, F.DESIGNEE_NAME, data.designeeName || 'ZARA DESIGNS LLC', fontBold)
            fillText(form, F.DESIGNEE_PHONE, data.designeePhone || '307-555-0123', fontBold)
            fillText(form, F.DESIGNEE_ADDRESS, data.designeeAddress || '1603 CAPITOL AVE STE 413, CHEYENNE, WY 82001', fontBold)
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
                    const MAX_W = 160
                    const MAX_H = 40
                    const scale = Math.min(MAX_W / sigImage.width, MAX_H / sigImage.height)
                    page.drawImage(sigImage, {
                        x: 110, // Más a la izquierda para estar pegado a "Signature"
                        y: 42,  // Altura adecuada
                        width: sigImage.width * scale,
                        height: sigImage.height * scale
                    })
                } catch (err) {
                    console.error('Error embedding signature:', err)
                }
            }

            // --- Fecha Pie de Página ---
            const today = new Date()
            const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`
            page.drawText(dateStr, {
                x: 375,
                y: 40,
                size: 9,
                font: fontBold,
                color: DARK_BLUE,
            })

            form.flatten()
            return await pdfDoc.save()

        } catch (error) {
            console.error('Generación SS4 fallida:', error)
            throw error
        }
    }
}

/**
 * Función auxiliar para generar el PDF del SS-4 desde la API
 */
export async function generarSS4PDF(metadata: any, pedidoId: string): Promise<Uint8Array> {
    const data: SS4Data = {
        legalName: metadata.ss4_legal_name || metadata.empresa_nombre || metadata.member_nombre_completo || 'N/A',
        tradeName: metadata.ss4_trade_name || metadata.empresa_nombre_alternativo || '',
        executorName: '',
        mailingAddress: metadata.member_direccion || metadata.empresa_direccion || 'N/A',
        cityStateZip: metadata.ss4_city_state_zip || metadata.empresa_ciudad_estado_zip || '',
        streetAddress: metadata.empresa_calle || '',
        cityStateZipForeign: '',
        county: metadata.ss4_county || metadata.empresa_condado || 'FOREIGN',
        responsiblePartyName: metadata.member_nombre_completo || 'N/A',
        responsiblePartySSN: metadata.member_tax_id_valor || metadata.member_ssn_itin || 'FOREIGN',
        isLLC: true,
        llcMemberCount: metadata.empresa_num_socios || '1',
        llcOrganizedInUS: true,
        entityType: metadata.ss4_tipo_entidad || 'Other',
        stateOfFormation: metadata.empresa_estado_usa || 'WYOMING',
        reasonForApplying: metadata.ss4_razon_solicitud || 'Started new business',
        reasonSpecifyType: metadata.ss4_actividad_principal || metadata.empresa_actividad || 'E-COMMERCE',
        startDate: metadata.ss4_fecha_inicio || metadata.empresa_fecha_inicio || new Date().toLocaleDateString(),
        closingMonth: metadata.ss4_cierre_fiscal || 'DECEMBER',
        principalActivity: metadata.ss4_actividad_principal || metadata.empresa_actividad || 'E-COMMERCE',
        principalProduct: metadata.ss4_principal_producto || metadata.empresa_producto || 'DIGITAL SERVICES',
        applicantNameAndTitle: (metadata.member_nombre_completo || 'N/A') + ', MANAGING MEMBER',
        applicantPhone: metadata.member_telefono || '',
        designeeName: 'ZARA DESIGNS LLC',
        designeePhone: '307-555-0123',
        designeeAddress: '1603 CAPITOL AVE STE 413, CHEYENNE, WY 82001'
    }

    const signature = metadata.firma_digital || metadata.firma_base64;
    return await PDFGenerator.generarSS4(data, signature)
}

