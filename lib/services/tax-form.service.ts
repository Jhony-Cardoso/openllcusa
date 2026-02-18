
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

// Definición de tipos
export interface TaxFormData {
    taxYear: string
    llc: {
        name: string
        ein: string
        address: string
        city: string
        state: string
        zip: string
        formationDate: string // MM/DD/YYYY
        // Part I additional fields
        einAlternate?: string
        countryOfIncorporation: string
        taxResidenceCountries: string
        activityCode: string
        activityDescription: string
        isForeignOwnedDE: boolean
        soleOwnerName: string
        soleOwnerEin?: string
        soleOwnerReferenceId: string
        isDirectOwner: boolean
        isOwnerUSPerson: boolean
        isOwnerForeignPerson: boolean
        totalAssets: number
        hasRelatedPartyTransactions: boolean
    }
    owner: {
        name: string
        address: string
        city: string
        country: string
        taxId: string
        referenceIdType: 'Foreign Tax ID' | 'ITIN'
        // Part II additional fields
        businessCountries: string
        taxResidenceCountries: string
        ownershipType: 'Direct' | 'Indirect'
    }
    // Part III: Related Party
    relatedParty: {
        name: string
        address: string
        city: string
        country: string
        taxId: string
        referenceIdType: string
        businessCountries: string
        taxResidenceCountries: string
        relationship: string
        ownershipType: 'Direct' | 'Indirect'
        isUSPerson: boolean
    }
    financials: {
        capitalContributionCash: number
        capitalContributionProperty: number
        capitalDistributionCash: number
        capitalDistributionProperty: number
        formationCost: number
        otherTransactions?: number
    }
    // Part V: Additional Information
    additionalInfo: {
        hasTradeOrBusiness: boolean
        isDisregardedEntity: boolean
    }
    // Part VII: Additional Questions
    additionalQuestions: {
        paidInterestToRelatedParty: boolean
        paidRentsToRelatedParty: boolean
        paidRoyaltiesToRelatedParty: boolean
        hasCostSharingArrangements: boolean
        paidServicesToRelatedParty: boolean
        receivedServicesFromRelatedParty: boolean
        hasOtherTransactions: boolean
    }
    // Part VIII: Base Erosion
    baseErosion: {
        isBaseErosionTaxpayer: boolean
    }
    signature: {
        signerName: string
        signerTitle: string
        signatureDate: string // YYYY-MM-DD
        signatureDataUrl: string | null // Imagen de firma en base64
    }
}

export class TaxFormService {

    static async generate5472Package(data: TaxFormData): Promise<Uint8Array> {
        // --- PASO 1: Preparar Formulario 1120 (Cover Page) ---
        const form1120Path = path.join(process.cwd(), 'public', 'templates', 'irs', 'f1120.pdf')
        const form1120Bytes = fs.readFileSync(form1120Path)
        const pdfDoc1120 = await PDFDocument.load(form1120Bytes)
        const form1120 = pdfDoc1120.getForm()

        // ========== FORM 1120: MAPEO COMPLETO ==========

        // --- HEADER SECTION ---
        try {
            // Name and Address
            this.setField(form1120, 'topmostSubform[0].Page1[0].PgHeader[0].f1_1[0]', data.llc.name)
            this.setField(form1120, 'topmostSubform[0].Page1[0].PgHeader[0].f1_2[0]', data.llc.address)
            this.setField(form1120, 'topmostSubform[0].Page1[0].PgHeader[0].f1_3[0]', `${data.llc.city}, ${data.llc.state} ${data.llc.zip}`)

            // Box A - Check if consolidated return (No para LLC pasiva)
            // Box B - Employer Identification Number (EIN)
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_4[0]', data.llc.ein)

            // Box C - Date incorporated
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_5[0]', this.formatDateToUS(data.llc.formationDate))

            // Box D - Total assets (from line 15, column (d), Schedule L)
            if (data.llc.totalAssets > 0) {
                this.setField(form1120, 'topmostSubform[0].Page1[0].f1_6[0]', this.formatThousands(data.llc.totalAssets))
            }

            // Box E - Check if initial return, final return, name change, or address change
            // Para primera declaración, marcar "Initial return"
            // this.checkField(form1120, 'topmostSubform[0].Page1[0].c1_1[0]') // Initial return checkbox

            // Box F - Principal business activity code
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_7[0]', data.llc.activityCode)

            // Box G - Principal business activity
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_8[0]', data.llc.activityDescription)

            // Box H - Principal product or service
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_9[0]', data.llc.activityDescription)

        } catch (e) {
            console.warn('Error rellenando campos del header 1120:', e)
        }

        // --- INCOME SECTION (Lines 1-11) ---
        // Para LLC pasiva (disregarded entity), todos los ingresos son $0
        try {
            // Line 1a - Gross receipts or sales
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_10[0]', '0')

            // Line 1c - Balance (1a minus 1b)
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_11[0]', '0')

            // Line 2 - Cost of goods sold
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_12[0]', '0')

            // Line 3 - Gross profit (line 1c minus line 2)
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_13[0]', '0')

            // Lines 4-10 - Other income (all $0 for passive LLC)
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_14[0]', '0') // Line 4 - Dividends
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_15[0]', '0') // Line 5 - Interest
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_16[0]', '0') // Line 6 - Gross rents
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_17[0]', '0') // Line 7 - Gross royalties
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_18[0]', '0') // Line 8 - Capital gain net income
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_19[0]', '0') // Line 9 - Net gain or loss
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_20[0]', '0') // Line 10 - Other income

            // Line 11 - Total income
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_21[0]', '0')
        } catch (e) {
            console.warn('Error rellenando sección de ingresos 1120:', e)
        }

        // --- DEDUCTIONS SECTION (Lines 12-29) ---
        // Para LLC pasiva, solo formation cost como deducción
        try {
            // Line 12 - Compensation of officers
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_22[0]', '0')

            // Lines 13-26 - Various deductions (all $0 except formation cost)
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_23[0]', '0') // Line 13 - Salaries and wages
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_24[0]', '0') // Line 14 - Repairs and maintenance
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_25[0]', '0') // Line 15 - Bad debts
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_26[0]', '0') // Line 16 - Rents
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_27[0]', '0') // Line 17 - Taxes and licenses
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_28[0]', '0') // Line 18 - Interest
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_29[0]', '0') // Line 19 - Charitable contributions
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_30[0]', '0') // Line 20 - Depreciation
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_31[0]', '0') // Line 21 - Depletion
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_32[0]', '0') // Line 22 - Advertising
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_33[0]', '0') // Line 23 - Pension, profit-sharing
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_34[0]', '0') // Line 24 - Employee benefit programs

            // Line 26 - Other deductions (formation cost)
            if (data.financials.formationCost > 0) {
                this.setField(form1120, 'topmostSubform[0].Page1[0].f1_35[0]', this.formatThousands(data.financials.formationCost))
            } else {
                this.setField(form1120, 'topmostSubform[0].Page1[0].f1_35[0]', '0')
            }

            // Line 27 - Total deductions
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_36[0]', this.formatThousands(data.financials.formationCost))

            // Line 28 - Taxable income before NOL and special deductions
            const taxableIncome = 0 - data.financials.formationCost
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_37[0]', this.formatThousands(taxableIncome))

            // Line 30 - Taxable income
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_38[0]', this.formatThousands(taxableIncome))

            // Line 31 - Total tax (Schedule J, Part I, line 11)
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_39[0]', '0')
        } catch (e) {
            console.warn('Error rellenando sección de deducciones 1120:', e)
        }

        // --- SCHEDULE M-3 CHECKBOX ---
        // Check "Yes" if total assets are $10 million or more
        try {
            if (data.llc.totalAssets >= 10000000) {
                this.checkField(form1120, 'topmostSubform[0].Page1[0].c1_10[0]') // Schedule M-3 Yes
            } else {
                this.checkField(form1120, 'topmostSubform[0].Page1[0].c1_11[0]') // Schedule M-3 No
            }
        } catch (e) {
            console.warn('Error marcando Schedule M-3:', e)
        }

        // --- ADDITIONAL INFORMATION (Page 2) ---
        try {
            // Question 1 - Check accounting method
            this.checkField(form1120, 'topmostSubform[0].Page2[0].c2_1[0]') // Cash method (típico para LLC pasiva)

            // Question 2 - Business activity
            this.setField(form1120, 'topmostSubform[0].Page2[0].f2_1[0]', data.llc.activityDescription)

            // Question 3 - Product or service
            this.setField(form1120, 'topmostSubform[0].Page2[0].f2_2[0]', data.llc.activityDescription)

            // Question 4 - Is the corporation a subsidiary in an affiliated group?
            this.checkField(form1120, 'topmostSubform[0].Page2[0].c2_5[0]') // No

            // Question 5 - Foreign financial accounts
            this.checkField(form1120, 'topmostSubform[0].Page2[0].c2_7[0]') // No (típicamente)

            // Question 6 - Foreign shareholders
            this.checkField(form1120, 'topmostSubform[0].Page2[0].c2_8[0]') // Yes (siempre para foreign-owned LLC)

            // Question 7 - Foreign person owns 25% or more
            this.checkField(form1120, 'topmostSubform[0].Page2[0].c2_9[0]') // Yes

        } catch (e) {
            console.warn('Error rellenando información adicional 1120:', e)
        }

        // --- TEXTO SUPERPUESTO PARA GARANTIZAR VISIBILIDAD ---
        const page1120 = pdfDoc1120.getPages()[0]
        const { height: h1120 } = page1120.getSize()
        const fontBold = await pdfDoc1120.embedFont(StandardFonts.HelveticaBold)

        // Texto "Foreign-Owned U.S. DE" en ROJO (muy importante)
        page1120.drawText('Foreign-Owned U.S. DE', {
            x: 180,
            y: h1120 - 40,
            size: 14,
            font: fontBold,
            color: rgb(1, 0, 0) // ROJO
        })

        // Escribir datos clave manualmente sobre la cabecera para asegurar visibilidad
        page1120.drawText(data.llc.name, { x: 45, y: h1120 - 95, size: 10, font: fontBold })
        page1120.drawText(data.llc.address, { x: 45, y: h1120 - 118, size: 10, font: fontBold })
        page1120.drawText(`${data.llc.city}, ${data.llc.state} ${data.llc.zip}`, { x: 45, y: h1120 - 140, size: 10, font: fontBold })
        page1120.drawText(data.llc.ein, { x: 380, y: h1120 - 98, size: 10, font: fontBold })
        page1120.drawText(this.formatDateToUS(data.llc.formationDate), { x: 380, y: h1120 - 120, size: 10, font: fontBold })

        // --- SECCIÓN DE FIRMA (Sign Here) ---
        const fontRegular = await pdfDoc1120.embedFont(StandardFonts.Helvetica)
        const signatureDateFormatted = this.formatDateToUS(data.signature.signatureDate)

        // Firma del oficial (Signature of officer)
        if (data.signature.signatureDataUrl) {
            try {
                const signatureImageBytes = Buffer.from(data.signature.signatureDataUrl.split(',')[1], 'base64')
                const signatureImage = await pdfDoc1120.embedPng(signatureImageBytes)
                page1120.drawImage(signatureImage, {
                    x: 130,
                    y: 98,
                    width: 120,
                    height: 40,
                })
            } catch (error) {
                console.warn('Error insertando imagen de firma, usando texto:', error)
                page1120.drawText(data.signature.signerName || 'Firmado', {
                    x: 130,
                    y: 105,
                    size: 10,
                    font: fontRegular,
                    color: rgb(0, 0, 0)
                })
            }
        } else {
            page1120.drawText(data.signature.signerName || 'Firmado', {
                x: 130,
                y: 105,
                size: 10,
                font: fontRegular,
                color: rgb(0, 0, 0)
            })
        }

        // Fecha (Date)
        page1120.drawText(signatureDateFormatted, {
            x: 350,
            y: 105,
            size: 10,
            font: fontRegular,
            color: rgb(0, 0, 0)
        })

        // Título (Title)
        page1120.drawText(data.signature.signerTitle, {
            x: 480,
            y: 105,
            size: 10,
            font: fontRegular,
            color: rgb(0, 0, 0)
        })


        // --- PASO 2: Preparar Formulario 5472 ---
        const form5472Path = path.join(process.cwd(), 'public', 'templates', 'irs', 'f5472.pdf')
        const form5472Bytes = fs.readFileSync(form5472Path)
        const pdfDoc5472 = await PDFDocument.load(form5472Bytes)
        const form = pdfDoc5472.getForm()

        // --- Relleno de Campos 5472 (Mapeo COMPLETO) ---

        // ========== PART I: Reporting Corporation ==========
        // Aplicamos sangría izquierda (10 espacios) como solicitó el usuario
        const indent = '          '

        // Line 1a - Name, address, and identifying number
        this.setField(form, 'topmostSubform[0].Page1[0].Line1a[0].f1_5[0]', indent + data.llc.name)
        this.setField(form, 'topmostSubform[0].Page1[0].Line1a[0].f1_6[0]', indent + data.llc.address)
        this.setField(form, 'topmostSubform[0].Page1[0].Line1a[0].f1_7[0]', indent + `${data.llc.city}, ${data.llc.state} ${data.llc.zip}`)
        this.setField(form, 'topmostSubform[0].Page1[0].f1_8[0]', data.llc.ein)

        // Line 1b - Alternate EIN (if applicable)
        if (data.llc.einAlternate) {
            this.setField(form, 'topmostSubform[0].Page1[0].f1_9[0]', data.llc.einAlternate)
        }

        // Line 1d - Country of incorporation or organization
        this.setField(form, 'topmostSubform[0].Page1[0].f1_16[0]', data.llc.countryOfIncorporation)

        // Line 1e - Country(ies) of tax residence
        if (data.llc.taxResidenceCountries) {
            this.setField(form, 'topmostSubform[0].Page1[0].f1_18[0]', data.llc.taxResidenceCountries)
        }

        // Line 1f - Total value of gross payments made or received (reported on THIS Form 5472)
        // Para LLC sin actividad comercial, se deja en blanco o '0'
        this.setField(form, 'topmostSubform[0].Page1[0].f1_11[0]', '0')

        // Line 1g - Total number of Forms 5472 filed for the tax year
        this.setField(form, 'topmostSubform[0].Page1[0].f1_10[0]', '1')

        // Line 1h - Total value of gross payments made or received (reported on ALL Forms 5472)
        // Es el mismo valor que 1f cuando solo hay 1 Form 5472
        this.setField(form, 'topmostSubform[0].Page1[0].f1_17[0]', '0')

        // Line 1i - Foreign-owned U.S. DE checkbox (c1_1 en el PDF real)
        if (data.llc.isForeignOwnedDE) {
            this.checkField(form, 'topmostSubform[0].Page1[0].Line1i_ReadOrder[0].c1_1[0]')
        }

        // Line 1j - Initial return checkbox (c1_2)
        if (data.llc.isDirectOwner) {
            this.checkField(form, 'topmostSubform[0].Page1[0].Line1j_ReadOrder[0].c1_2[0]')
        }

        // Line 2 - Check if foreign-owned DE (c1_3)
        if (data.llc.isOwnerForeignPerson) {
            this.checkField(form, 'topmostSubform[0].Page1[0].c1_3[0]')
        }

        // Line 2 - Total assets
        if (data.llc.totalAssets > 0) {
            this.setField(form, 'topmostSubform[0].Page1[0].f1_19[0]', this.formatThousands(data.llc.totalAssets))
        }

        // Line 3 - Check here if foreign-owned domestic disregarded entity (c1_4 = Yes checkbox)
        // Para LLC extranjera de un solo miembro, siempre se marca
        this.checkField(form, 'topmostSubform[0].Page1[0].c1_4[0]')

        // Part II surrogate foreign corporation checkbox (c1_5)
        this.checkField(form, 'topmostSubform[0].Page1[0].c1_5[0]')

        // ========== PART II: 25% Foreign Shareholder ==========
        // Line 4a - Name AND address del shareholder (nombre + dirección en el mismo campo)
        this.setField(form, 'topmostSubform[0].Page1[0].f1_20[0]', `${data.owner.name}, ${data.owner.address}, ${data.owner.city}`)

        // Line 4b(1) - U.S. identifying number (ITIN si aplica, si no VACÍO)
        // 4b(1) es para número de identificación USA - solo si tiene ITIN
        if (data.owner.referenceIdType === 'ITIN') {
            this.setField(form, 'topmostSubform[0].Page1[0].f1_21[0]', data.owner.taxId)
        }
        // Si no tiene ITIN, f1_21 queda vacío

        // Line 4b(2) - Reference ID number (campo separado)
        this.setField(form, 'topmostSubform[0].Page1[0].f1_22[0]', data.owner.referenceIdType !== 'ITIN' ? '' : '')

        // Line 4b(3) - Foreign taxpayer identification number (FTIN)
        if (data.owner.referenceIdType === 'Foreign Tax ID') {
            this.setField(form, 'topmostSubform[0].Page1[0].f1_23[0]', data.owner.taxId)
        }

        // Line 4c - Country(ies) of citizenship, organization, or incorporation
        // (ANTES estaba en 4d - CORREGIDO)
        if (data.owner.businessCountries) {
            this.setField(form, 'topmostSubform[0].Page1[0].f1_24[0]', data.owner.businessCountries)
        }

        // Line 4d - Principal country(ies) where business is conducted
        // (ANTES estaba en 4c - CORREGIDO)
        if (data.owner.taxResidenceCountries) {
            this.setField(form, 'topmostSubform[0].Page1[0].f1_25[0]', data.owner.taxResidenceCountries)
        }

        // Line 4e - Country(ies) under whose laws the direct 25% foreign shareholder files an income tax return as a resident
        // Debe ser el PAÍS DE RESIDENCIA FISCAL del usuario (NO el nombre)
        this.setField(form, 'topmostSubform[0].Page1[0].f1_26[0]', data.owner.taxResidenceCountries || data.owner.country)

        // Lines 5a-5e: SOLO se rellenan si hay un segundo shareholder indirecto
        // Para LLC de un solo miembro, estos campos deben estar VACÍOS
        // (No se mapea nada aquí intencionalmente)

        // Line 4f - Direct or Indirect ownership type
        // En Page2 los checkboxes de Part II son c2_1[0]=Direct, c2_1[1]=Indirect
        if (data.owner.ownershipType === 'Direct') {
            this.checkField(form, 'topmostSubform[0].Page2[0].c2_1[0]')
        } else {
            this.checkField(form, 'topmostSubform[0].Page2[0].c2_1[1]')
        }

        // ========== PART III: Related Party ==========
        // Para una LLC de un solo miembro extranjero, el Related Party ES el propio dueño
        // Line 6a - Name and address of related party
        const relatedPartyName = data.relatedParty.name || data.owner.name
        const relatedPartyAddr = data.relatedParty.address || data.owner.address
        const relatedPartyCity = data.relatedParty.city || data.owner.city
        this.setField(form, 'topmostSubform[0].Page1[0].f1_27[0]', `${relatedPartyName}, ${relatedPartyAddr}, ${relatedPartyCity}`)

        // Line 6b(1) - U.S. identifying number (ITIN si aplica)
        if (data.relatedParty.referenceIdType === 'ITIN' || data.owner.referenceIdType === 'ITIN') {
            this.setField(form, 'topmostSubform[0].Page1[0].f1_28[0]', data.relatedParty.taxId || data.owner.taxId)
        }

        // Line 6b(3) - Foreign taxpayer identification number (FTIN)
        if (data.relatedParty.referenceIdType === 'Foreign Tax ID' || data.owner.referenceIdType === 'Foreign Tax ID') {
            this.setField(form, 'topmostSubform[0].Page1[0].f1_29[0]', data.relatedParty.taxId || data.owner.taxId)
        }

        // Line 6c - Country of citizenship/organization/incorporation
        const relatedPartyCountry = data.relatedParty.businessCountries || data.owner.businessCountries || data.owner.country
        if (relatedPartyCountry) {
            this.setField(form, 'topmostSubform[0].Page1[0].f1_30[0]', relatedPartyCountry)
        }

        // Line 6d - Principal country(ies) where business is conducted
        const relatedPartyTaxRes = data.relatedParty.taxResidenceCountries || data.owner.taxResidenceCountries
        if (relatedPartyTaxRes) {
            this.setField(form, 'topmostSubform[0].Page1[0].f1_31[0]', relatedPartyTaxRes)
        }

        // Line 6e - Country under whose laws the related party files income tax return
        this.setField(form, 'topmostSubform[0].Page1[0].f1_32[0]', relatedPartyTaxRes || relatedPartyCountry || '')

        // Line 6f - Direct or Indirect relationship
        // c2_2[0] = Direct, c2_3[0] = Indirect para Part III
        const relOwnershipType = data.relatedParty.ownershipType || data.owner.ownershipType
        if (relOwnershipType === 'Direct') {
            this.checkField(form, 'topmostSubform[0].Page2[0].c2_2[0]')
        } else {
            this.checkField(form, 'topmostSubform[0].Page2[0].c2_3[0]')
        }

        // Line 6g - U.S. person checkbox (c2_4[0])
        if (data.relatedParty.isUSPerson) {
            this.checkField(form, 'topmostSubform[0].Page2[0].c2_4[0]')
        }

        // ========== PART VII: Additional Questions (Page 3) ==========
        // Cada pregunta tiene par Yes[0] / No[1] en el mismo nombre de campo
        // Question 37 - Import goods from foreign related party?
        this.checkField(form, data.additionalQuestions.paidInterestToRelatedParty
            ? 'topmostSubform[0].Page3[0].c3_1[0]'   // Yes
            : 'topmostSubform[0].Page3[0].c3_1[1]')  // No

        // Question 38a - Inventory cost of goods?
        this.checkField(form, data.additionalQuestions.paidRentsToRelatedParty
            ? 'topmostSubform[0].Page3[0].c3_2[0]'   // Yes
            : 'topmostSubform[0].Page3[0].c3_2[1]')  // No

        // Question 39 - Foreign parent in CSA?
        this.checkField(form, data.additionalQuestions.hasCostSharingArrangements
            ? 'topmostSubform[0].Page3[0].c3_3[0]'   // Yes
            : 'topmostSubform[0].Page3[0].c3_3[1]')  // No

        // Question 40a - Interest or royalty deduction not allowed?
        this.checkField(form, data.additionalQuestions.paidRoyaltiesToRelatedParty
            ? 'topmostSubform[0].Page3[0].c3_4[0]'   // Yes
            : 'topmostSubform[0].Page3[0].c3_4[1]')  // No

        // Question 41a - FDII deduction claimed?
        this.checkField(form, data.additionalQuestions.paidServicesToRelatedParty
            ? 'topmostSubform[0].Page3[0].c3_5[0]'   // Yes
            : 'topmostSubform[0].Page3[0].c3_5[1]')  // No

        // Question 42a - Safe-haven rate loan (100%-130% AFR)?
        this.checkField(form, data.additionalQuestions.receivedServicesFromRelatedParty
            ? 'topmostSubform[0].Page3[0].c3_6[0]'   // Yes
            : 'topmostSubform[0].Page3[0].c3_6[1]')  // No

        // Question 42b - Safe-haven rate loan outside range? (default No)
        this.checkField(form, 'topmostSubform[0].Page3[0].c3_7[1]') // No

        // Question 43a - Covered debt instrument?
        this.checkField(form, data.additionalQuestions.hasOtherTransactions
            ? 'topmostSubform[0].Page3[0].c3_8[0]'   // Yes
            : 'topmostSubform[0].Page3[0].c3_8[1]')  // No

        // ========== PART VIII: Cost Sharing Arrangement (CSA) ==========
        // Question 45 - Did the reporting corporation become a participant in the CSA?
        this.checkField(form, data.baseErosion.isBaseErosionTaxpayer
            ? 'topmostSubform[0].Page3[0].c3_9[0]'   // Yes
            : 'topmostSubform[0].Page3[0].c3_9[1]')  // No

        // Question 46 - Was the CSA in effect before January 5, 2009? (default No)
        this.checkField(form, 'topmostSubform[0].Page3[0].c3_10[1]') // No

        // Question 48c - Stock-based compensation? (default No)
        this.checkField(form, 'topmostSubform[0].Page3[0].c3_11[1]') // No

        // ========== PART V: Attached Statement Checkbox ==========
        // Indicamos que hay un statement adjunto (Supporting Statements)
        this.checkField(form, 'topmostSubform[0].Page2[0].PartV[0].c2_6[0]')

        form.flatten()

        // --- PASO 3: Generar Supporting Statements ---
        // Creamos un Doc temporal para la página de statements
        const pdfDocStatements = await PDFDocument.create()
        const statementPage = pdfDocStatements.addPage()
        const { width, height } = statementPage.getSize()
        const font = await pdfDocStatements.embedFont(StandardFonts.Helvetica)
        const boldFontStatement = await pdfDocStatements.embedFont(StandardFonts.HelveticaBold)

        let y = height - 50
        const margin = 50

        statementPage.drawText('FEDERAL SUPPORTING STATEMENTS', { x: margin, y, size: 14, font: boldFontStatement })
        y -= 20
        statementPage.drawText(`Tax Year: ${data.taxYear}`, { x: margin, y, size: 12, font })
        y -= 30
        statementPage.drawText(`Entity Name: ${data.llc.name}`, { x: margin, y, size: 10, font: boldFontStatement })
        y -= 15
        statementPage.drawText(`EIN: ${data.llc.ein}`, { x: margin, y, size: 10, font: boldFontStatement })
        y -= 30

        const lines = [
            "FORM 5472 - PART V - ADDITIONAL INFORMATION",
            "",
            "THE LLC IS A FOREIGN-OWNED DISREGARDED ENTITY.",
            "THE LLC IS NOT ENGAGED IN U.S. TRADE OR BUSINESS, AND THE LLC DOES NOT",
            "GENERATE ANY U.S. SOURCE OF INCOME THAT IS EFFECTIVELY CONNECTED WITH",
            "A U.S. TRADE OR BUSINESS.",
            "",
            "THE FORM 5472 IS FILED TO DISCLOSE THE CAPITAL CONTRIBUTION/DISTRIBUTION",
            "BETWEEN THE LLC AND SOLE MEMBER AND THE FORMATION COST OF THE LLC.",
            ""
        ]

        lines.forEach(line => {
            statementPage.drawText(line, { x: margin, y, size: 10, font })
            y -= 15
        })
        y -= 15

        statementPage.drawText('REPORTABLE TRANSACTIONS (PARTS IV & V):', { x: margin, y, size: 10, font: boldFontStatement })
        y -= 20

        const financials = [
            ['Capital Contribution (Cash):', `$ ${this.formatThousands(data.financials.capitalContributionCash)}`],
            ['Capital Contribution (Property):', `$ ${this.formatThousands(data.financials.capitalContributionProperty)}`],
            ['Capital Distribution (Cash):', `$ ${this.formatThousands(data.financials.capitalDistributionCash)}`],
            ['Capital Distribution (Property):', `$ ${this.formatThousands(data.financials.capitalDistributionProperty)}`],
            ['Formation Cost:', `$ ${this.formatThousands(data.financials.formationCost)}`]
        ]

        financials.forEach(([label, value]) => {
            statementPage.drawText(label, { x: margin, y, size: 10, font })
            statementPage.drawText(value, { x: margin + 200, y, size: 10, font: boldFontStatement })
            y -= 15
        })

        // --- PASO 4: Unir Todo en Documento Final ---
        const pdfDocFinal = await PDFDocument.create()

        // Copiar Hoja 1 de 1120 (Cover)
        const [coverPage] = await pdfDocFinal.copyPages(pdfDoc1120, [0])
        pdfDocFinal.addPage(coverPage)

        // Copiar todas las hojas de 5472
        const pages5472 = await pdfDocFinal.copyPages(pdfDoc5472, pdfDoc5472.getPageIndices())
        pages5472.forEach(page => pdfDocFinal.addPage(page))

        // Copiar hoja de Statement
        const [statPage] = await pdfDocFinal.copyPages(pdfDocStatements, [0])
        pdfDocFinal.addPage(statPage)

        // Limpiar metadata para eliminar información sensible (IPs, URLs internas, etc.)
        pdfDocFinal.setTitle('IRS Forms 5472 & 1120')
        pdfDocFinal.setAuthor('Tax Filing Service')
        pdfDocFinal.setSubject('Federal Tax Forms')
        pdfDocFinal.setCreator('Tax Filing Service')
        pdfDocFinal.setProducer('Tax Filing Service')
        pdfDocFinal.setKeywords([])

        // Añadir marca de agua en todas las páginas
        const watermarkFont = await pdfDocFinal.embedFont(StandardFonts.HelveticaBold)
        const pages = pdfDocFinal.getPages()
        const watermarkText = 'BORRADOR - PENDIENTE DE PRESENTACIÓN AL IRS'

        for (const page of pages) {
            const { width, height } = page.getSize()

            // Repetir la marca de agua de abajo a arriba cubriendo toda la página
            const watermarkSize = 28
            const spacing = 150 // Espacio vertical entre repeticiones
            const startY = 60   // Empezar desde abajo

            for (let y = startY; y < height + 100; y += spacing) {
                page.drawText(watermarkText, {
                    x: -20,             // Empezar desde el borde izquierdo
                    y: y,
                    size: watermarkSize,
                    font: watermarkFont,
                    color: rgb(0.55, 0.55, 0.55), // Gris más oscuro
                    rotate: degrees(45),
                    opacity: 0.55,      // Más opaco
                })
            }
        }

        return await pdfDocFinal.save()
    }

    private static setField(form: any, name: string, value: string) {
        try {
            const field = form.getTextField(name)
            if (field) field.setText(value)
        } catch (e) {
            console.warn(`Field not found or error setting text: ${name}`)
        }
    }

    private static checkField(form: any, name: string) {
        try {
            const field = form.getCheckBox(name)
            if (field) field.check()
        } catch (e) {
            console.warn(`Checkbox not found or error checking: ${name}`)
        }
    }

    private static formatDateToUS(dateStr: string): string {
        if (!dateStr) return ''
        const parts = dateStr.split('-')
        if (parts.length === 3) {
            const [year, month, day] = parts
            return `${month}/${day}/${year}`
        }
        return dateStr
    }

    /**
     * Formatea un número con separador de miles (punto) y decimales (coma)
     * Ej: 1234.56 -> 1.234,56
     */
    private static formatThousands(amount: number): string {
        return new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount)
    }
}
