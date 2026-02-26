
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
        isInitialReturn: boolean  // true si es el primer año que se presenta
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
        importGoods: boolean               // Q37
        documentWarehouse: boolean         // Q38a
        foreignParentCSA: boolean          // Q39
        interestRoyaltyDeduction: boolean  // Q40a
        fdiiDeduction: boolean            // Q41a
        safeHavenInterest: boolean         // Q42a
        safeHavenOutsideRange: boolean     // Q42b
        coveredDebtInstrument: boolean     // Q43a
    }
    // Part VIII: Cost Sharing Arrangement
    baseErosion: {
        csaParticipant: boolean            // Q45
        csaBefore2009: boolean            // Q46
        stockBasedCompensation: boolean    // Q48c
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

        // ========== FORM 1120: MAPEO COMPLETO (SÓLO HEADER Y FOOTER) ==========

        try {
            // --- TAX YEAR DATES (Header) ---
            // Basado en el PDF irs/f1120.pdf:
            // f1_1 (MM/DD) beginning, f2 (MM/DD) ending, f3 (YY) ending
            const currentTaxYear = data.taxYear || new Date().getFullYear().toString()
            const yearShort = currentTaxYear.substring(2)

            this.setField(form1120, 'topmostSubform[0].Page1[0].PgHeader[0].f1_1[0]', '01/01')
            this.setField(form1120, 'topmostSubform[0].Page1[0].PgHeader[0].f1_2[0]', '12/31')
            this.setField(form1120, 'topmostSubform[0].Page1[0].PgHeader[0].f1_3[0]', yearShort)

            // --- NAME AND ADDRESS (Box A) ---
            // Campos descubiertos: f1_4 (Name), f1_5 (Address), f1_7 (City), f1_8 (State), f1_10 (ZIP)
            this.setField(form1120, 'topmostSubform[0].Page1[0].NameFieldsReadOrder[0].f1_4[0]', data.llc.name)
            this.setField(form1120, 'topmostSubform[0].Page1[0].NameFieldsReadOrder[0].f1_5[0]', data.llc.address)
            this.setField(form1120, 'topmostSubform[0].Page1[0].NameFieldsReadOrder[0].f1_7[0]', data.llc.city) // Solo ciudad, sin estado ni ZIP
            this.setField(form1120, 'topmostSubform[0].Page1[0].NameFieldsReadOrder[0].f1_8[0]', data.llc.state)
            this.setField(form1120, 'topmostSubform[0].Page1[0].NameFieldsReadOrder[0].f1_10[0]', data.llc.zip)

            // --- BOX B: EIN ---
            const einFormatted = data.llc.ein.replace(/\D/g, '').replace(/^(\d{2})(\d{7}).*/, '$1-$2')
            this.setField(form1120, 'topmostSubform[0].Page1[0].f1_11[0]', einFormatted)

            // Si el campo anterior falló por ser strict, intentamos sin guion
            if (!form1120.getTextField('topmostSubform[0].Page1[0].f1_11[0]').getText()) {
                this.setField(form1120, 'topmostSubform[0].Page1[0].f1_11[0]', data.llc.ein.replace(/\D/g, ''))
            }

            // --- BOX E: Checkboxes ---
            if (data.llc.isInitialReturn) {
                this.checkField(form1120, 'topmostSubform[0].Page1[0].c1_6[0]') // (1) Initial return
            }

            // Aplanamos el formulario para asegurar que los campos se rendericen
            form1120.flatten()
        } catch (e) {
            console.warn('Error rellenando header 1120:', e)
        }

        // --- TEXTO SUPERPUESTO Y ELEMENTOS VISUALES ---
        const page1120 = pdfDoc1120.getPages()[0]
        const { height: h1120, width: w1120 } = page1120.getSize()
        const fontBold = await pdfDoc1120.embedFont(StandardFonts.HelveticaBold)
        const fontRegular = await pdfDoc1120.embedFont(StandardFonts.Helvetica)

        // Color azul oscuro uniforme para todos los datos del usuario (igual que los campos del formulario)
        const IRS_BLUE = rgb(0.063, 0.216, 0.631)

        // "Foreign-Owned U.S. DE" en ROJO — colocado como sello diagonal en la esquina superior izquierda
        // del área del header para evitar solaparse con el título principal del formulario
        page1120.drawText('Foreign-Owned U.S. DE', {
            x: 300,
            y: 687, // Entre el título y la línea "For calendar year..."
            size: 14,
            font: fontBold,
            color: rgb(1, 0, 0), // ROJO
            rotate: degrees(8)   // Ligera inclinación de sello para distinguirlo del texto impreso
        })

        // NOTA: Los campos Name, Address, City, EIN ya se renderizan mediante form.flatten() arriba.
        // NO se vuelven a dibujar manualmente para evitar texto duplicado/superpuesto.

        // --- SECCIÓN DE FIRMA (Footer) ---
        const signatureDateFormatted = this.formatDateToUS(data.signature.signatureDate)

        // Dibujo manual del Pie de firma (Footer)
        // footerY ligeramente más bajo para que la firma quede por debajo de la línea horizontal
        const footerY = 84

        // Title ("sole member") — desplazado más a la derecha, en azul oscuro
        page1120.drawText(data.signature.signerTitle || 'sole member', {
            x: 355,
            y: footerY + 10,
            size: 10,
            font: fontRegular,
            color: IRS_BLUE
        })

        // Signature (en azul oscuro si no hay imagen)
        if (data.signature.signatureDataUrl) {
            try {
                const signatureImageBytes = Buffer.from(data.signature.signatureDataUrl.split(',')[1], 'base64')
                const signatureImage = await pdfDoc1120.embedPng(signatureImageBytes)
                page1120.drawImage(signatureImage, {
                    x: 130,
                    y: footerY - 5, // Firma un poco más abajo
                    width: 100,
                    height: 25,
                })
            } catch (error) {
                page1120.drawText(data.signature.signerName || 'Firmado', { x: 125, y: footerY, size: 10, font: fontRegular, color: IRS_BLUE })
            }
        } else {
            page1120.drawText(data.signature.signerName || 'Firmado', { x: 125, y: footerY, size: 10, font: fontRegular, color: IRS_BLUE })
        }

        // Date — en azul oscuro
        page1120.drawText(signatureDateFormatted, {
            x: 270,
            y: footerY + 10,
            size: 10,
            font: fontRegular,
            color: IRS_BLUE
        })


        // --- PASO 2: Preparar Formulario 5472 ---
        const form5472Path = path.join(process.cwd(), 'public', 'templates', 'irs', 'f5472.pdf')
        const form5472Bytes = fs.readFileSync(form5472Path)
        const pdfDoc5472 = await PDFDocument.load(form5472Bytes)
        const form = pdfDoc5472.getForm()

        // --- Relleno de Campos 5472 (Mapeo basado en coordenadas REALES del PDF) ---
        // MAPA DE CAMPOS VERIFICADO CON COORDENADAS:
        // Header: f1_1(x285,w53)=begin_monthday, f1_2(x343,w21)=begin_year, f1_3(x407,w53)=end_monthday, f1_4(x466,w20)=end_year
        // Part I:
        //   f1_5-f1_7 = 1a (nombre, dirección, ciudad)  |  f1_8 = 1b (EIN)  |  f1_9 = 1c (total assets)
        //   f1_10(x151,Y588) = 1d (activity description) | f1_11(x511,Y588) = 1e (activity code)
        //   f1_12(x50,Y552)  = 1f (gross this form)      | f1_13(x239,Y552) = 1g (num forms) | f1_14(x389,Y552) = 1h (gross all)
        //   c1_1 = 1i checkbox  |  c1_2 = 1j checkbox
        //   f1_15(x318,Y516) = 1k (num Parts VIII)       | f1_16(x440,Y516) = 1l (country of incorporation)
        //   f1_17(x36,Y480)  = 1m (date of incorporation)| f1_18(x152,Y480) = 1n (tax residence countries) | f1_19(x368,Y480) = 1o (business countries)
        // Part II (Page1):
        //   f1_20 = 4a | f1_21-23 = 4b(1-3) | f1_24-26 = 4c-4e
        //   f1_27-47 = Secciones 5a-7e (VACÍOS para LLC single-member)
        // Part III (Page2):
        //   f2_1 = 8a (nombre+dirección) | f2_2-f2_4 = 8b(1-3) | f2_5 = 8c (activity) | f2_6 = 8d (code)
        //   Checkboxes: c2_2/c2_3 = Direct/Indirect | c2_4 = U.S. person

        // ========== HEADER: Fecha inicio y fin del año fiscal ==========
        // 4 campos separados: f1_1=begin month/day, f1_2=begin year, f1_3=end month/day, f1_4=end year
        const taxYearNum = parseInt(data.taxYear)
        const formationDateObj = new Date(data.llc.formationDate)

        if (formationDateObj.getFullYear() === taxYearNum) {
            // LLC formada en el año fiscal: fecha inicio = fecha de incorporación
            const parts = data.llc.formationDate.includes('-')
                ? data.llc.formationDate.split('-')
                : data.llc.formationDate.split('/')
            let month: string, day: string, year: string
            if (data.llc.formationDate.includes('-')) {
                [year, month, day] = parts
            } else {
                [month, day, year] = parts
            }
            this.setField(form, 'topmostSubform[0].Page1[0].Pg1Header[0].f1_1[0]', `${month}/${day}`)
            this.setField(form, 'topmostSubform[0].Page1[0].Pg1Header[0].f1_2[0]', year)
        } else {
            // Año fiscal estándar: 1 de enero
            this.setField(form, 'topmostSubform[0].Page1[0].Pg1Header[0].f1_1[0]', '01/01')
            this.setField(form, 'topmostSubform[0].Page1[0].Pg1Header[0].f1_2[0]', String(taxYearNum))
        }
        // Fecha fin siempre 31 de diciembre
        this.setField(form, 'topmostSubform[0].Page1[0].Pg1Header[0].f1_3[0]', '12/31')
        this.setField(form, 'topmostSubform[0].Page1[0].Pg1Header[0].f1_4[0]', String(taxYearNum))

        // ========== PART I: Reporting Corporation ==========
        const indent = '          '

        // 1a - Name, address, city/state/zip
        this.setField(form, 'topmostSubform[0].Page1[0].Line1a[0].f1_5[0]', indent + data.llc.name)
        this.setField(form, 'topmostSubform[0].Page1[0].Line1a[0].f1_6[0]', indent + data.llc.address)
        this.setField(form, 'topmostSubform[0].Page1[0].Line1a[0].f1_7[0]', indent + `${data.llc.city}, ${data.llc.state} ${data.llc.zip}`)

        // 1b - EIN
        const ein5472 = data.llc.ein.replace(/\D/g, '').replace(/^(\d{2})(\d{7}).*/, '$1-$2')
        this.setField(form, 'topmostSubform[0].Page1[0].f1_8[0]', ein5472)

        // 1c - Total assets
        if (data.llc.totalAssets > 0) {
            this.setField(form, 'topmostSubform[0].Page1[0].f1_9[0]', this.formatThousands(data.llc.totalAssets))
        }

        // 1d - Principal business activity (DESCRIPTION) → f1_10 (x=151, Y=588, w=222)
        this.setField(form, 'topmostSubform[0].Page1[0].f1_10[0]', data.llc.activityDescription)

        // 1e - Principal business activity CODE → f1_11 (x=511, Y=588, w=65)
        this.setField(form, 'topmostSubform[0].Page1[0].f1_11[0]', data.llc.activityCode)

        // 1f - Total value gross payments THIS form → campo calculado automáticamente
        // Fórmula IRS: SUM(all gross amounts reported on this 5472)
        // Para una DE: suma de todos los importes brutos del statement adjunto (sin nettear)
        const total1f =
            (data.financials.capitalContributionCash ?? 0) +
            (data.financials.capitalContributionProperty ?? 0) +
            (data.financials.capitalDistributionCash ?? 0) +
            (data.financials.capitalDistributionProperty ?? 0) +
            (data.financials.formationCost ?? 0) +
            (data.financials.otherTransactions ?? 0)

        // Los campos 1f y 1h NO usan setField (el PDF los alinea a la derecha)
        // Los dibujamos manualmente centrados dentro del campo
        // (1f y 1h se rellenan DESPUÉS del flatten, en el paso visual más abajo)

        // 1g - Total number of Forms 5472 filed → f1_13
        this.setField(form, 'topmostSubform[0].Page1[0].f1_13[0]', '1')

        // 1i - Consolidated filing checkbox (c1_1) → NO marcar para LLC single-member

        // 1j - Initial year: marcar SOLO si es la primera declaración (isInitialReturn)
        if (data.llc.isInitialReturn) {
            this.checkField(form, 'topmostSubform[0].Page1[0].Line1j_ReadOrder[0].c1_2[0]')
        }

        // 1k - Total number of Parts VIII → f1_15 (x=318, Y=516)
        this.setField(form, 'topmostSubform[0].Page1[0].f1_15[0]', '0')

        // 1l - Country of incorporation → f1_16 (x=440, Y=516)
        this.setField(form, 'topmostSubform[0].Page1[0].f1_16[0]', 'United States')

        // 1m - Date of incorporation → f1_17 (x=36, Y=480)
        this.setField(form, 'topmostSubform[0].Page1[0].f1_17[0]', this.formatDateToUS(data.llc.formationDate))

        // 1n - Country(ies) under whose laws the corp files income tax → f1_18 (x=152, Y=480)
        this.setField(form, 'topmostSubform[0].Page1[0].f1_18[0]', data.owner.taxResidenceCountries || data.owner.country)

        // 1o - Principal country(ies) where business is conducted → f1_19 (x=368, Y=480)
        const businessCountries = data.owner.businessCountries || data.owner.country
        this.setField(form, 'topmostSubform[0].Page1[0].f1_19[0]', businessCountries)

        // Line 2 - Foreign-owned domestic DE checkbox (c1_3) → siempre marcar
        this.checkField(form, 'topmostSubform[0].Page1[0].c1_3[0]')

        // Line 3 - Foreign-owned DE treated as corp (c1_4) → siempre marcar
        this.checkField(form, 'topmostSubform[0].Page1[0].c1_4[0]')

        // c1_5: surrogate foreign corporation → NO marcar

        // ========== PART II: 25% Foreign Shareholder (Page1) ==========
        // Sección 4: Direct 25% foreign shareholder
        // 4a - Name and address → f1_20 (x=36, Y=372, w=540)
        // Sangría generosa + dirección completa incluyendo país (igual que campo 8a)
        const indent4 = '                ' // Sangría generosa (~16 espacios)
        this.setField(form, 'topmostSubform[0].Page1[0].f1_20[0]', `${indent4}${data.owner.name}     ${data.owner.address}, ${data.owner.city}, ${data.owner.country}`)

        // 4b(1) - U.S. identifying number → f1_21 (x=36, Y=336)
        if (data.owner.referenceIdType === 'ITIN') {
            this.setField(form, 'topmostSubform[0].Page1[0].f1_21[0]', data.owner.taxId)
        }
        // 4b(2) - Reference ID → f1_22 (vacío)
        // 4b(3) - Foreign TIN → f1_23 (x=354, Y=336)
        if (data.owner.referenceIdType === 'Foreign Tax ID') {
            this.setField(form, 'topmostSubform[0].Page1[0].f1_23[0]', data.owner.taxId)
        }

        // 4c - Principal country(ies) where business is conducted → f1_24 (x=36, Y=300)
        this.setField(form, 'topmostSubform[0].Page1[0].f1_24[0]', businessCountries)

        // 4d - Country of organization/incorporation → f1_25 (x=181, Y=300)
        this.setField(form, 'topmostSubform[0].Page1[0].f1_25[0]', data.owner.country)

        // 4e - Country(ies) where files income tax as resident → f1_26 (x=325, Y=300)
        this.setField(form, 'topmostSubform[0].Page1[0].f1_26[0]', data.owner.taxResidenceCountries || data.owner.country)

        // *** Secciones 5a-7e (f1_27 a f1_47) = VACÍAS para LLC single-member ***
        // NO escribir nada en estos campos

        // Direct/Indirect checkbox (Page2 top) → c2_1[0]=Direct, c2_1[1]=Indirect
        if (data.owner.ownershipType === 'Direct') {
            this.checkField(form, 'topmostSubform[0].Page2[0].c2_1[0]')
        } else {
            this.checkField(form, 'topmostSubform[0].Page2[0].c2_1[1]')
        }

        // ========== PART III: Related Party - Section 8 (Page2) ==========
        // Los campos de Part III están en PAGE 2, NO en Page1
        // f2_1 = 8a (name+address) → (x=36, Y=696, w=540)
        const relatedPartyName = data.relatedParty.name || data.owner.name
        const relatedPartyAddr = data.relatedParty.address || data.owner.address
        const relatedPartyCity = data.relatedParty.city || data.owner.city
        const relatedPartyCountry = data.relatedParty.country || data.owner.country
        // 8a: Sangría generosa, dirección completa incluyendo país
        const indent8 = '                ' // Sangría generosa (~16 espacios)
        this.setField(form, 'topmostSubform[0].Page2[0].f2_1[0]', `${indent8}${relatedPartyName}     ${relatedPartyAddr}, ${relatedPartyCity}, ${relatedPartyCountry}`)

        // 8b(1) - U.S. identifying number → f2_2 (x=36, Y=672)
        if ((data.relatedParty.referenceIdType || data.owner.referenceIdType) === 'ITIN') {
            this.setField(form, 'topmostSubform[0].Page2[0].f2_2[0]', data.relatedParty.taxId || data.owner.taxId)
        }
        // 8b(2) - Reference ID → f2_3 (vacío normalmente)
        // 8b(3) - Foreign TIN → f2_4 (x=354, Y=672)
        if ((data.relatedParty.referenceIdType || data.owner.referenceIdType) === 'Foreign Tax ID') {
            this.setField(form, 'topmostSubform[0].Page2[0].f2_4[0]', data.relatedParty.taxId || data.owner.taxId)
        }

        // 8c - Principal Business Activity (descripción) → f2_5 (x=151, Y=660, w=222)
        this.setField(form, 'topmostSubform[0].Page2[0].f2_5[0]', data.llc.activityDescription)

        // 8d - Principal Business Activity Code → f2_6 (x=511, Y=660, w=65)
        this.setField(form, 'topmostSubform[0].Page2[0].f2_6[0]', data.llc.activityCode)

        // MAPEO REAL VERIFICADO POR SCREENSHOT:
        // f2_7 → campo 8f (Principal country where business is conducted)
        // f2_8 → campo 8g (Country where files income tax as resident)
        // f2_9 → campo 9 de PART IV (NO hay que rellenarlo aquí)
        // NOTA: Campo 8e usa checkboxes (c2_2/c2_3/c2_4), no tiene campo de texto f2_x propio.

        // 8f - Principal country(ies) where business is conducted → f2_7
        // Debe ser el mismo valor que el campo 4c
        const relBusinessCountries = data.relatedParty?.businessCountries || businessCountries
        this.setField(form, 'topmostSubform[0].Page2[0].f2_7[0]', relBusinessCountries)

        // 8g - Country(ies) where files income tax as resident → f2_8
        // Mismo valor que campo 4e (tax residence countries)
        const taxResCountry = data.owner.taxResidenceCountries || data.owner.country
        this.setField(form, 'topmostSubform[0].Page2[0].f2_8[0]', taxResCountry)

        // NOTA: f2_9 corresponde al campo 9 de Part IV — NO asignar aquí

        // Direct/Indirect checkbox for Part III → c2_2[0]=Direct, c2_3[0]=Indirect
        const relOwnershipType = data.relatedParty.ownershipType || data.owner.ownershipType
        if (relOwnershipType === 'Direct') {
            this.checkField(form, 'topmostSubform[0].Page2[0].c2_2[0]')
        } else {
            this.checkField(form, 'topmostSubform[0].Page2[0].c2_3[0]')
        }

        // U.S. person checkbox → c2_4[0]
        if (data.relatedParty.isUSPerson) {
            this.checkField(form, 'topmostSubform[0].Page2[0].c2_4[0]')
        }

        // ========== PART VII: Additional Questions (Page 3) ==========
        // Reglas para Foreign-Owned U.S. DE:
        //   - Q37: No se marca (No importa bienes de parte relacionada)
        //   - Q38a: NO SE MARCA (ni Yes ni No) — aplica solo si Q37=Yes
        //   - Q38c: NO SE MARCA (ni Yes ni No)
        //   - Q39, Q40a, Q41a, Q42a, Q42b, Q43a: siempre NO ✅

        // Question 37 - Import goods from foreign related party? → No
        this.checkField(form, 'topmostSubform[0].Page3[0].c3_1[1]')   // No

        // Question 38a - Forzar VACÍO (no aplica si Q37=No)
        this.uncheckField(form, 'topmostSubform[0].Page3[0].c3_2[0]')   // Yes - vacío
        this.uncheckField(form, 'topmostSubform[0].Page3[0].c3_2[1]')   // No  - vacío

        // Question 38c - Forzar VACÍO
        this.uncheckField(form, 'topmostSubform[0].Page3[0].c3_3[0]')   // Yes - vacío
        this.uncheckField(form, 'topmostSubform[0].Page3[0].c3_3[1]')   // No  - vacío

        // Question 39 → No
        this.checkField(form, 'topmostSubform[0].Page3[0].c3_4[1]')   // No

        // Question 40a → No
        this.checkField(form, 'topmostSubform[0].Page3[0].c3_5[1]')   // No

        // Question 41a → No
        this.checkField(form, 'topmostSubform[0].Page3[0].c3_6[1]')   // No

        // Question 42a → No
        this.checkField(form, 'topmostSubform[0].Page3[0].c3_7[1]')   // No

        // Question 42b → No
        this.checkField(form, 'topmostSubform[0].Page3[0].c3_8[1]')   // No

        // Question 43a → No
        this.checkField(form, 'topmostSubform[0].Page3[0].c3_9[1]')   // No

        // ========== PART VIII: Cost Sharing Arrangement (CSA) ==========
        // Solo se marca el campo 45 con NO ✅. El resto NO SE MARCA.
        // Question 45 → No (c3_10 al desplazar un campo por Q38c)
        this.checkField(form, 'topmostSubform[0].Page3[0].c3_10[1]')   // No

        // Questions 46, 48c → NO SE MARCA (se dejan en blanco)

        // ========== PART V: Attached Statement Checkbox ==========
        // Indicamos que hay un statement adjunto (Supporting Statements)
        this.checkField(form, 'topmostSubform[0].Page2[0].PartV[0].c2_6[0]')

        form.flatten()

        // --- DIBUJO MANUAL DE LOS CAMPOS 1f y 1h CENTRADOS (en azul oscuro, igual que los demás campos) ---
        const page1_5472 = pdfDoc5472.getPages()[0]
        const fontReg5472 = await pdfDoc5472.embedFont(StandardFonts.Helvetica)
        const formattedTotal1f = this.formatThousands(total1f)
        const IRS_BLUE_5472 = rgb(0.063, 0.216, 0.631) // Mismo azul oscuro uniforme IRS

        // Campo 1f: x=50, Y=552, width aprox 180
        page1_5472.drawText(formattedTotal1f, {
            x: 50 + (180 / 2) - (formattedTotal1f.length * 3), // Centrado aproximado
            y: 556,
            size: 10,
            font: fontReg5472,
            color: IRS_BLUE_5472
        })

        // Campo 1h: x=389, Y=552, width aprox 180
        page1_5472.drawText(formattedTotal1f, {
            x: 389 + (180 / 2) - (formattedTotal1f.length * 3), // Centrado aproximado
            y: 556,
            size: 10,
            font: fontReg5472,
            color: IRS_BLUE_5472
        })

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

        statementPage.drawText('REPORTABLE TRANSACTIONS (PART V):', { x: margin, y, size: 10, font: boldFontStatement })
        y -= 20

        const financials: [string, string][] = [
            ['Capital Contribution (Cash):', `$ ${this.formatThousands(data.financials.capitalContributionCash)}`],
            ['Capital Contribution (Property):', `$ ${this.formatThousands(data.financials.capitalContributionProperty)}`],
            ['Capital Distribution (Cash):', `$ ${this.formatThousands(data.financials.capitalDistributionCash)}`],
            ['Capital Distribution (Property):', `$ ${this.formatThousands(data.financials.capitalDistributionProperty)}`],
            ['Formation Cost:', `$ ${this.formatThousands(data.financials.formationCost)}`]
        ]

        if (data.financials.otherTransactions && data.financials.otherTransactions > 0) {
            financials.push(['Other Reportable Transactions:', `$ ${this.formatThousands(data.financials.otherTransactions)}`]);
        }

        financials.forEach(([label, value]) => {
            statementPage.drawText(label, { x: margin, y, size: 10, font })
            statementPage.drawText(value, { x: margin + 300, y, size: 10, font: boldFontStatement }) // Movido x a 300 para más espacio
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

        // La marca de agua ha sido eliminada a petición para permitir la visualización limpia en el visor (Aprobación Anti-Multas)

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

    private static uncheckField(form: any, name: string) {
        try {
            const field = form.getCheckBox(name)
            if (field) field.uncheck()
        } catch (e) {
            console.warn(`Checkbox not found or error unchecking: ${name}`)
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
     * Formatea fecha en formato largo para el header del 5472
     * Ej: '2025-05-24' -> 'May 24, 2025'
     */
    private static formatDateLong(dateStr: string): string {
        if (!dateStr) return ''
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December']
        // Soporta formatos: YYYY-MM-DD y MM/DD/YYYY
        let year: string, month: number, day: string
        if (dateStr.includes('-')) {
            const parts = dateStr.split('-')
            year = parts[0]; month = parseInt(parts[1]); day = parts[2]
        } else if (dateStr.includes('/')) {
            const parts = dateStr.split('/')
            month = parseInt(parts[0]); day = parts[1]; year = parts[2]
        } else {
            return dateStr
        }
        return `${months[month - 1]} ${parseInt(day)}, ${year}`
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
