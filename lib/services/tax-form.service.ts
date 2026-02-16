
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
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
        activityCode?: string
        activityDescription?: string
    }
    owner: {
        name: string
        address: string
        city: string
        country: string
        taxId: string
        referenceIdType: 'Foreign Tax ID' | 'ITIN'
    }
    financials: {
        capitalContributionCash: number
        capitalContributionProperty: number
        capitalDistributionCash: number
        capitalDistributionProperty: number
        formationCost: number
        otherTransactions?: number
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
        // Cargar 1120
        const pdfDoc1120 = await PDFDocument.load(form1120Bytes)
        const form1120 = pdfDoc1120.getForm()

        // Rellenar 1120 Header (Mapeo estimado estándar IRS XFA)
        try {
            // Header Infos
            this.setField(form1120, 'topmostSubform[0].Page1[0].PgHeader[0].f1_1[0]', data.llc.name) // Name
            this.setField(form1120, 'topmostSubform[0].Page1[0].PgHeader[0].f1_2[0]', data.llc.address) // Address
            this.setField(form1120, 'topmostSubform[0].Page1[0].PgHeader[0].f1_3[0]', `${data.llc.city}, ${data.llc.state} ${data.llc.zip}`) // City/State

            // Top Right Box
            // Los campos de la derecha (EIN, Date) suelen ser f1_4, f1_5 o similares en el bloque de "Use IRS label"
            // En inspection: NameFieldsReadOrder f1_4 ... f1_10
            // Probamos mapeo directo a campos comunes de derecha
            // Ajuste: f1_6 suele ser EIN en muchos formularios, pero verifiquemos visualmente luego.
            // Intentamos llenar f1_4 a f1_7 con datos clave por si acaso

            // En 1120, EIN suele ser casilla B. Date Inc casilla C.

            // NOTA: Al no tener mapa visual de 1120, escribiremos TEXTO SUPERPUESTO en la cabecera
            // para garantizar que se ve el "Foreign-Owned U.S. DE" y los datos clave si el formulario falla.
        } catch (e) {
            console.warn('Error rellenando 1120', e)
        }

        // Escribir Texto Rojo Requerido "Foreign-Owned U.S. DE" y datos clave manualmente para asegurar
        const page1120 = pdfDoc1120.getPages()[0]
        const { height: h1120 } = page1120.getSize()
        const fontBold = await pdfDoc1120.embedFont(StandardFonts.HelveticaBold)

        page1120.drawText('Foreign-Owned U.S. DE', {
            x: 180,
            y: h1120 - 40,
            size: 14,
            font: fontBold,
            color: rgb(1, 0, 0) // ROJO
        })

        // Escribir EIN y Datos manualmente sobre la cabecera para asegurar visibilidad 
        // (A veces los campos XFA son caprichosos)
        page1120.drawText(data.llc.name, { x: 45, y: h1120 - 95, size: 10, font: fontBold })
        page1120.drawText(data.llc.address, { x: 45, y: h1120 - 118, size: 10, font: fontBold })
        page1120.drawText(`${data.llc.city}, ${data.llc.state} ${data.llc.zip}`, { x: 45, y: h1120 - 140, size: 10, font: fontBold })

        page1120.drawText(data.llc.ein, { x: 380, y: h1120 - 98, size: 10, font: fontBold }) // EIN Position approx
        page1120.drawText(this.formatDateToUS(data.llc.formationDate), { x: 380, y: h1120 - 120, size: 10, font: fontBold }) // Date Inc Position approx

        // --- SECCIÓN DE FIRMA (Sign Here) ---
        // La sección "Sign Here" está en la parte inferior del formulario 1120
        // Posiciones aproximadas basadas en el formulario estándar IRS 1120
        const fontRegular = await pdfDoc1120.embedFont(StandardFonts.Helvetica)

        // Convertir fecha de YYYY-MM-DD a MM/DD/YYYY
        const signatureDateFormatted = this.formatDateToUS(data.signature.signatureDate)

        // Firma del oficial (Signature of officer) - aproximadamente en y=100
        if (data.signature.signatureDataUrl) {
            // Si hay imagen de firma, insertarla
            try {
                const signatureImageBytes = Buffer.from(data.signature.signatureDataUrl.split(',')[1], 'base64')
                const signatureImage = await pdfDoc1120.embedPng(signatureImageBytes)

                page1120.drawImage(signatureImage, {
                    x: 130,
                    y: 98, // Ajustado para que quede justo sobre la línea (antes 85)
                    width: 120,
                    height: 40,
                })
            } catch (error) {
                console.warn('Error insertando imagen de firma, usando texto:', error)
                // Fallback a texto si falla la imagen
                page1120.drawText(data.signature.signerName || 'Firmado', {
                    x: 130,
                    y: 105,
                    size: 10,
                    font: fontRegular,
                    color: rgb(0, 0, 0)
                })
            }
        } else {
            // Si no hay imagen, usar texto como antes
            page1120.drawText(data.signature.signerName || 'Firmado', {
                x: 130,
                y: 105,
                size: 10,
                font: fontRegular,
                color: rgb(0, 0, 0)
            })
        }

        // Fecha (Date) - aproximadamente en y=105, más a la derecha
        page1120.drawText(signatureDateFormatted, {
            x: 350,
            y: 105,
            size: 10,
            font: fontRegular,
            color: rgb(0, 0, 0)
        })

        // Título (Title) - aproximadamente en y=105, extremo derecho
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

        // --- Relleno de Campos 5472 (Mapeo CORREGIDO) ---
        // Parte I: Reporting Corporation
        // Aplicamos sangría izquierda (10 espacios) como solicitó el usuario
        const indent = '          '
        this.setField(form, 'topmostSubform[0].Page1[0].Line1a[0].f1_5[0]', indent + data.llc.name)
        this.setField(form, 'topmostSubform[0].Page1[0].Line1a[0].f1_6[0]', indent + data.llc.address)
        this.setField(form, 'topmostSubform[0].Page1[0].Line1a[0].f1_7[0]', indent + `${data.llc.city}, ${data.llc.state} ${data.llc.zip}`)
        this.setField(form, 'topmostSubform[0].Page1[0].f1_8[0]', data.llc.ein)
        this.setField(form, 'topmostSubform[0].Page1[0].f1_10[0]', data.llc.activityDescription || 'E-Commerce Retail')
        this.setField(form, 'topmostSubform[0].Page1[0].f1_11[0]', data.llc.activityCode || '454110')
        this.setField(form, 'topmostSubform[0].Page1[0].f1_16[0]', 'United States')
        this.setField(form, 'topmostSubform[0].Page1[0].f1_17[0]', this.formatDateToUS(data.llc.formationDate))

        // Parte II: 25% Foreign Shareholder
        this.setField(form, 'topmostSubform[0].Page1[0].f1_20[0]', data.owner.name)
        this.setField(form, 'topmostSubform[0].Page1[0].f1_21[0]', `${data.owner.address}, ${data.owner.city}`)
        if (data.owner.referenceIdType === 'ITIN') {
            this.setField(form, 'topmostSubform[0].Page1[0].f1_22[0]', data.owner.taxId)
        }
        if (data.owner.referenceIdType === 'Foreign Tax ID') {
            this.setField(form, 'topmostSubform[0].Page1[0].f1_23[0]', data.owner.taxId)
        }
        this.setField(form, 'topmostSubform[0].Page1[0].f1_24[0]', data.owner.country)

        // Parte V: Attached Statement Checkbox
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
