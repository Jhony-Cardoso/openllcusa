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
    reasonSpecifyType?: string
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

// Busca un campo de formulario PDF por su nombre completo o parcial
const findField = (form: any, fullName: string) => {
    try {
        return form.getField(fullName)
    } catch (e) {
        // Fallback: búsqueda por nombre corto (parte final de la ruta)
        const nameParts = fullName.split('.')
        const shortName = nameParts[nameParts.length - 1].replace('[0]', '')
        if (!shortName) return null

        // Búsqueda exhaustiva en todos los campos del PDF
        const allFields = form.getFields()
        const found = allFields.find((f: any) => {
            const n = f.getName()
            return (
                n === shortName ||
                n === shortName + '[0]' ||
                n.endsWith('.' + shortName) ||
                n.endsWith('.' + shortName + '[0]')
            )
        })
        return found || null
    }
}

// Escribe texto en un campo de formulario PDF con sangría de 4 espacios
const fillText = (form: any, fullName: string, val: string | undefined, font: any) => {
    if (!val) return
    const field = findField(form, fullName)

    if (field && field.constructor.name === 'PDFTextField') {
        // Sangría fija de 4 espacios en todos los campos (igual que línea 7a)
        let text = '         ' + val.toUpperCase()

        // Truncar si excede el maxLength del campo
        const maxLength = field.getMaxLength()
        if (maxLength !== undefined && text.length > maxLength) {
            text = val.toUpperCase().substring(0, maxLength)
        }

        try {
            field.setText(text)
            try {
                field.updateAppearances(font)
                field.setFontSize(val.length > 35 ? FONT_SIZE_SMALL : FONT_SIZE_MAIN)
                field.setFontColor(DARK_BLUE)
            } catch (e2) {
                // Ignorar fallo de apariencia — flatten lo resolverá
            }
        } catch (e) {
            console.warn(`[PDF] No se pudo escribir en campo "${fullName}":`, e)
        }
    } else {
        console.warn(`[PDF] Campo no encontrado: "${fullName}"`)
    }
}

// Marca un checkbox de formulario PDF
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

// Nombres EXACTOS de los campos del SS-4 del IRS
// Verificados ejecutando: node scripts/inspect-ss4-fields.mjs
const F = {
    LEGAL_NAME: 'topmostSubform[0].Page1[0].f1_2[0]',                   // Línea 1
    TRADE_NAME: 'topmostSubform[0].Page1[0].f1_3[0]',                   // Línea 2
    EXECUTOR: 'topmostSubform[0].Page1[0].f1_4[0]',                   // Línea 3
    MAILING_ADDRESS: 'topmostSubform[0].Page1[0].Line4ReadOrder[0].f1_5[0]', // Línea 4a
    CITY_STATE_ZIP: 'topmostSubform[0].Page1[0].Line4ReadOrder[0].f1_6[0]', // Línea 4b
    STREET_ADDRESS: 'topmostSubform[0].Page1[0].f1_7[0]',                   // Línea 5a
    CITY_STATE_FOREIGN: 'topmostSubform[0].Page1[0].f1_8[0]',                   // Línea 5b
    COUNTY: 'topmostSubform[0].Page1[0].f1_9[0]',                   // Línea 6
    RESPONSIBLE_PARTY: 'topmostSubform[0].Page1[0].f1_10[0]',                  // Línea 7a
    SSN_ITIN_EIN: 'topmostSubform[0].Page1[0].f1_11[0]',                  // Línea 7b
    LLC_YES: 'topmostSubform[0].Page1[0].c1_1[0]',
    LLC_NO: 'topmostSubform[0].Page1[0].c1_1[1]',
    LLC_MEMBERS: 'topmostSubform[0].Page1[0].f1_12[0]',
    LLC_US_YES: 'topmostSubform[0].Page1[0].c1_2[0]',
    LLC_US_NO: 'topmostSubform[0].Page1[0].c1_2[1]',
    ENTITY_OTHER_CB: 'topmostSubform[0].Page1[0].c1_3[15]',
    ENTITY_OTHER_TEXT: 'topmostSubform[0].Page1[0].f1_19[0]',
    STATE_INCORPORATED: 'topmostSubform[0].Page1[0].f1_18[0]',
    REASON_STARTED_NEW: 'topmostSubform[0].Page1[0].c1_4[0]',
    REASON_STARTED_TYPE: 'topmostSubform[0].Page1[0].f1_25[0]',
    REASON_BANKING: 'topmostSubform[0].Page1[0].c1_4[4]',
    REASON_BANKING_TEXT: 'topmostSubform[0].Page1[0].f1_28[0]',
    REASON_HIRED: 'topmostSubform[0].Page1[0].c1_4[1]',
    REASON_OTHER_CB: 'topmostSubform[0].Page1[0].c1_4[3]',
    REASON_OTHER_TEXT: 'topmostSubform[0].Page1[0].f1_26[0]',
    DATE_STARTED: 'topmostSubform[0].Page1[0].f1_31[0]',
    CLOSING_MONTH: 'topmostSubform[0].Page1[0].f1_32[0]',
    EMPLOYEES_AGRI: 'topmostSubform[0].Page1[0].f1_33[0]',
    EMPLOYEES_HOUSE: 'topmostSubform[0].Page1[0].f1_34[0]',
    EMPLOYEES_OTHER: 'topmostSubform[0].Page1[0].f1_35[0]',
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
            const page = pdfDoc.getPages()[0]

            // --- Identificación (Líneas 1, 2, 3) ---
            fillText(form, F.LEGAL_NAME, data.legalName, fontBold)
            fillText(form, F.TRADE_NAME, data.tradeName, fontBold)
            fillText(form, F.EXECUTOR, data.executorName, fontBold)

            // --- Dirección (Líneas 4a, 4b, 5a, 5b, 6) ---
            fillText(form, F.MAILING_ADDRESS, data.mailingAddress, fontBold)
            fillText(form, F.CITY_STATE_ZIP, data.cityStateZip, fontBold)
            fillText(form, F.STREET_ADDRESS, data.streetAddress, fontBold)
            fillText(form, F.CITY_STATE_FOREIGN, data.cityStateZipForeign, fontBold)
            fillText(form, F.COUNTY, data.county, fontBold)

            // --- Responsable (Líneas 7a, 7b) ---
            fillText(form, F.RESPONSIBLE_PARTY, data.responsiblePartyName, fontBold)
            fillText(form, F.SSN_ITIN_EIN, data.responsiblePartySSN || 'Foreign', fontBold)

            // --- LLC (Línea 8) ---
            fillCheck(form, F.LLC_YES, data.isLLC !== false)
            fillCheck(form, F.LLC_NO, data.isLLC === false)
            fillText(form, F.LLC_MEMBERS, data.llcMemberCount || '1', fontBold)
            fillCheck(form, F.LLC_US_YES, data.llcOrganizedInUS !== false)
            fillCheck(form, F.LLC_US_NO, data.llcOrganizedInUS === false)

            // --- Tipo de Entidad (Línea 9a) ---
            fillCheck(form, F.ENTITY_OTHER_CB)
            fillText(form, F.ENTITY_OTHER_TEXT, 'DISREGARDED ENTITY', fontBold)

            // --- Razón (Línea 10) - Drawtext directo por ser campo especial ---
            fillCheck(form, F.REASON_STARTED_NEW)
            const reasonType = data.reasonSpecifyType || data.principalActivity || 'E-COMMERCE SERVICES'
            page.drawText(reasonType.toUpperCase(), {
                x: 80,
                y: 374,
                size: 8,
                font: fontBold,
                color: DARK_BLUE
            })

            // --- Fechas (Líneas 11, 12) ---
            fillText(form, F.DATE_STARTED, data.startDate, fontBold)
            fillText(form, F.CLOSING_MONTH, data.closingMonth || 'DECEMBER', fontBold)

            // --- Empleados (Línea 13) ---
            fillText(form, F.EMPLOYEES_AGRI, data.employeesAgricultural || '0', fontBold)
            fillText(form, F.EMPLOYEES_HOUSE, data.employeesHousehold || '0', fontBold)
            fillText(form, F.EMPLOYEES_OTHER, data.employeesOther || '0', fontBold)
            fillText(form, F.FIRST_DATE_WAGES, data.firstDateWages || 'N/A', fontBold)

            // --- Actividad (Líneas 16, 17) ---
            fillCheck(form, F.ACTIVITY_OTHER_CB)
            fillText(form, F.ACTIVITY_OTHER_TEXT, data.principalActivity || 'E-COMMERCE SERVICES', fontBold)
            fillText(form, F.PRINCIPAL_LINE, data.principalProduct || 'DIGITAL GOODS AND SERVICES', fontBold)

            // --- EIN Previo (Línea 18) ---
            if (data.hasPreviousEIN) {
                fillCheck(form, F.PREV_EIN_YES)
                fillText(form, F.PREV_EIN, data.previousEIN, fontBold)
            } else {
                fillCheck(form, F.PREV_EIN_NO)
            }

            // --- Tercero Designado ---
            fillText(form, F.DESIGNEE_NAME, data.designeeName || 'ZARA DESIGNS LLC', fontBold)
            fillText(form, F.DESIGNEE_PHONE, data.designeePhone || '307-555-0123', fontBold)
            fillText(form, F.DESIGNEE_ADDRESS, data.designeeAddress || '1603 CAPITOL AVE STE 413, CHEYENNE, WY 82001', fontBold)
            fillText(form, F.DESIGNEE_FAX, data.designeeFax, fontBold)

            // --- Solicitante ---
            fillText(form, F.APPLICANT_NAME, data.applicantNameAndTitle || data.responsiblePartyName, fontBold)
            fillText(form, F.APPLICANT_PHONE, data.applicantPhone, fontBold)
            fillText(form, F.APPLICANT_FAX, data.applicantFax, fontBold)

            // --- Firma digital ---
            if (signatureBase64 && signatureBase64.startsWith('data:image')) {
                try {
                    const base64Data = signatureBase64.split(',')[1]
                    const sigBuffer = Buffer.from(base64Data, 'base64')
                    const sigImage = await pdfDoc.embedPng(sigBuffer)
                    const MAX_W = 160
                    const MAX_H = 34
                    const scale = Math.min(MAX_W / sigImage.width, MAX_H / sigImage.height)
                    page.drawImage(sigImage, {
                        x: 70,
                        y: 35,
                        width: sigImage.width * scale,
                        height: sigImage.height * scale
                    })
                } catch (err) {
                    console.error('Error embedding signature:', err)
                }
            }

            // --- Fecha al pie ---
            const today = new Date()
            const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`
            page.drawText(dateStr, {
                x: 365,
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

    const signature = metadata.firma_digital || metadata.firma_base64
    return await PDFGenerator.generarSS4(data, signature)
}
