
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib'
import { format } from 'date-fns'
import * as fs from 'fs'
import * as path from 'path'

interface InvoiceData {
    numeroFactura: string
    fechaEmision: Date
    cliente: {
        nombre: string
        email: string
        pais?: string
        direccion?: string
    }
    items: {
        descripcion: string
        cantidad: number
        precioUnitario: number
        total: number
    }[]
    subtotal: number
    impuestos: number
    total: number
    metodoPago: string
    estadoPago: string
    fechaPago?: Date
}

/**
 * Loads a PNG image from the public/stamps directory and embeds it in the PDF.
 * Returns null if the file cannot be loaded (graceful degradation).
 */
async function loadStampImage(doc: PDFDocument, filename: string) {
    try {
        const stampPath = path.join(process.cwd(), 'public', 'stamps', filename)
        const imageBytes = fs.readFileSync(stampPath)
        return await doc.embedPng(imageBytes)
    } catch {
        console.warn(`[invoice-generator] Could not load stamp: ${filename}`)
        return null
    }
}

/**
 * Draws a simple decorative rubric/flourish below a given point.
 * Uses bezier-like line segments to simulate a calligraphic signature.
 */
function drawRubric(page: ReturnType<PDFDocument['addPage']>, originX: number, originY: number) {
    const blue = rgb(0.102, 0.302, 0.620) // deep navy blue, like real ink

    // Stroke 1: main sweeping flourish (left arc)
    page.drawLine({
        start: { x: originX - 18, y: originY },
        end:   { x: originX + 8,  y: originY + 8 },
        thickness: 1.4,
        color: blue,
        opacity: 0.75,
    })
    // Stroke 2: counter-stroke going right
    page.drawLine({
        start: { x: originX + 8,  y: originY + 8 },
        end:   { x: originX + 32, y: originY - 3 },
        thickness: 1.0,
        color: blue,
        opacity: 0.65,
    })
    // Stroke 3: tail loop
    page.drawLine({
        start: { x: originX + 32, y: originY - 3 },
        end:   { x: originX + 20, y: originY - 10 },
        thickness: 0.7,
        color: blue,
        opacity: 0.55,
    })
    page.drawLine({
        start: { x: originX + 20, y: originY - 10 },
        end:   { x: originX + 40, y: originY - 8 },
        thickness: 0.5,
        color: blue,
        opacity: 0.45,
    })
    // Stroke 4: underline accent
    page.drawLine({
        start: { x: originX - 20, y: originY - 14 },
        end:   { x: originX + 44, y: originY - 14 },
        thickness: 0.6,
        color: blue,
        opacity: 0.35,
    })
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Uint8Array> {
    // Crear documento
    const doc = await PDFDocument.create()
    const page = doc.addPage([595.28, 841.89]) // A4
    const { width, height } = page.getSize()

    // Fuentes
    const fontRegular = await doc.embedFont(StandardFonts.Helvetica)
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

    // Colores
    const blueColor = rgb(0.145, 0.388, 0.922) // #2563eb
    const grayDark = rgb(0.2, 0.2, 0.2)
    const grayLight = rgb(0.5, 0.5, 0.5)

    // --- HEADER ---
    // Marca principal — grande y dominante
    page.drawText('Open LLC USA', {
        x: 50,
        y: height - 48,
        size: 22,
        font: fontBold,
        color: blueColor,
    })
    // Entidad mercantil — pequeña, discreta, debajo de la marca
    page.drawText('Zara Designs LLC', {
        x: 50,
        y: height - 64,
        size: 7.5,
        font: fontRegular,
        color: grayLight,
    })

    // Título FACTURA
    page.drawText('FACTURA', {
        x: width - 200,
        y: height - 50,
        size: 24,
        font: fontBold,
        color: grayDark,
    })

    // Detalles Factura (Derecha)
    const headerRightX = width - 200
    let currentY = height - 80

    page.drawText(`Nº Factura: ${data.numeroFactura}`, {
        x: headerRightX,
        y: currentY,
        size: 10,
        font: fontRegular,
        color: grayDark,
    })
    currentY -= 15
    page.drawText(`Fecha: ${format(data.fechaEmision, 'dd/MM/yyyy')}`, {
        x: headerRightX,
        y: currentY,
        size: 10,
        font: fontRegular,
        color: grayDark,
    })

    // --- INFO EMPRESA (Izquierda) ---
    currentY = height - 120
    const leftMargin = 50

    page.drawText('DE:', {
        x: leftMargin,
        y: currentY,
        size: 10,
        font: fontBold,
        color: grayLight,
    })
    currentY -= 15
    page.drawText('Open LLC USA', { x: leftMargin, y: currentY, size: 10, font: fontBold, color: grayDark })
    currentY -= 11
    page.drawText('(Zara Designs LLC)', { x: leftMargin, y: currentY, size: 7.5, font: fontRegular, color: grayLight })
    currentY -= 12
    page.drawText('123 Business Street', { x: leftMargin, y: currentY, size: 10, font: fontRegular, color: grayDark })
    currentY -= 12
    page.drawText('Miami, FL 33101, USA', { x: leftMargin, y: currentY, size: 10, font: fontRegular, color: grayDark })
    currentY -= 12
    page.drawText('Tax ID: 12-3456789', { x: leftMargin, y: currentY, size: 10, font: fontRegular, color: grayDark })
    currentY -= 12
    page.drawText('info@openllcusa.com', { x: leftMargin, y: currentY, size: 10, font: fontRegular, color: grayDark })

    // --- INFO CLIENTE (Derecha) ---
    currentY = height - 120
    const rightColumnX = width / 2 + 50

    page.drawText('FACTURAR A:', {
        x: rightColumnX,
        y: currentY,
        size: 10,
        font: fontBold,
        color: grayLight,
    })
    currentY -= 15
    page.drawText(data.cliente.nombre, { x: rightColumnX, y: currentY, size: 10, font: fontBold, color: grayDark })
    currentY -= 12
    page.drawText(data.cliente.email, { x: rightColumnX, y: currentY, size: 10, font: fontRegular, color: grayDark })
    if (data.cliente.direccion) {
        currentY -= 12
        page.drawText(data.cliente.direccion, { x: rightColumnX, y: currentY, size: 10, font: fontRegular, color: grayDark })
    }
    if (data.cliente.pais) {
        currentY -= 12
        page.drawText(data.cliente.pais, { x: rightColumnX, y: currentY, size: 10, font: fontRegular, color: grayDark })
    }

    // --- TABLA DE ITEMS ---
    currentY = height - 250
    const tableHeaderY = currentY

    // Background Header
    page.drawRectangle({
        x: 40,
        y: tableHeaderY - 5,
        width: width - 80,
        height: 25,
        color: rgb(0.95, 0.95, 0.95),
    })

    // Headers
    page.drawText('DESCRIPCIÓN', { x: 50, y: tableHeaderY + 2, size: 9, font: fontBold, color: grayDark })
    page.drawText('CANT.', { x: 350, y: tableHeaderY + 2, size: 9, font: fontBold, color: grayDark })
    page.drawText('PRECIO', { x: 420, y: tableHeaderY + 2, size: 9, font: fontBold, color: grayDark })
    page.drawText('TOTAL', { x: 500, y: tableHeaderY + 2, size: 9, font: fontBold, color: grayDark })

    currentY -= 25

    // Rows
    for (const item of data.items) {
        page.drawText(item.descripcion, { x: 50, y: currentY, size: 9, font: fontRegular, color: grayDark })
        page.drawText(item.cantidad.toString(), { x: 360, y: currentY, size: 9, font: fontRegular, color: grayDark })
        page.drawText(`$${item.precioUnitario.toFixed(2)}`, { x: 420, y: currentY, size: 9, font: fontRegular, color: grayDark })
        page.drawText(`$${item.total.toFixed(2)}`, { x: 500, y: currentY, size: 9, font: fontRegular, color: grayDark })

        // Línea separadora
        page.drawLine({
            start: { x: 50, y: currentY - 5 },
            end: { x: width - 50, y: currentY - 5 },
            thickness: 0.5,
            color: grayLight,
            opacity: 0.3
        })

        currentY -= 25
    }

    // Guardamos la Y justo debajo de la última fila de items (para colocar sello PAID aquí)
    const tableBottomY = currentY

    // --- TOTALES ---
    currentY -= 20
    const totalsX = 400
    const totalsValueX = 500

    page.drawText('Subtotal:', { x: totalsX, y: currentY, size: 10, font: fontRegular, color: grayDark })
    page.drawText(`$${data.subtotal.toFixed(2)}`, { x: totalsValueX, y: currentY, size: 10, font: fontRegular, color: grayDark })

    currentY -= 20
    page.drawText('Impuestos (0%):', { x: totalsX, y: currentY, size: 10, font: fontRegular, color: grayDark })
    page.drawText(`$${data.impuestos.toFixed(2)}`, { x: totalsValueX, y: currentY, size: 10, font: fontRegular, color: grayDark })

    currentY -= 20
    page.drawText('TOTAL:', { x: totalsX, y: currentY, size: 12, font: fontBold, color: blueColor })
    page.drawText(`$${data.total.toFixed(2)}`, { x: totalsValueX, y: currentY, size: 12, font: fontBold, color: blueColor })

    // --- FOOTER ---
    const footerY = 100

    // Detalles del Pago
    page.drawText(`Método de Pago: ${data.metodoPago}`, { x: 50, y: footerY - 20, size: 9, font: fontRegular, color: grayDark })
    if (data.fechaPago) {
        page.drawText(`Fecha de Pago: ${format(data.fechaPago, 'dd/MM/yyyy HH:mm')}`, { x: 50, y: footerY - 35, size: 9, font: fontRegular, color: grayDark })
    }

    // Mensaje Final
    page.drawText('Gracias por confiar en Open LLC USA', {
        x: width / 2 - 80,
        y: 60,
        size: 10,
        font: fontBold,
        color: blueColor,
    })

    // Disclaimer Legal (No-ETBUS / Foreign-Source Income)
    const disclaimer1 = "LEGAL NOTICE: Zara Designs LLC is a foreign-owned disregarded entity. All services invoiced herein are performed exclusively"
    const disclaimer2 = "outside the United States. The company maintains no US trade or business (ETBUS) and no physical presence in the US."
    const disclaimer3 = "Accordingly, this income is foreign-source and not subject to US federal income tax or withholding."

    page.drawText(disclaimer1, { x: 50, y: 35, size: 6, font: fontRegular, color: grayLight })
    page.drawText(disclaimer2, { x: 50, y: 28, size: 6, font: fontRegular, color: grayLight })
    page.drawText(disclaimer3, { x: 50, y: 21, size: 6, font: fontRegular, color: grayLight })

    // ============================================================
    // SELLOS — solo se estampan en facturas PAGADAS
    // ============================================================
    if (data.estadoPago === 'pagada') {

        // --- SELLO 1: INVOICE PAID ---
        // Posición: izquierda, justo debajo de la tabla de items
        // Tamaño: 120 x 76 pts (~42mm x 27mm), rotado +15°
        const selloPaidImg = await loadStampImage(doc, 'sello-paid.png')
        if (selloPaidImg) {
            const paidW = 120
            const paidH = 76
            // El pivot de rotación en pdf-lib es bottom-left del bounding box.
            // Para centrar el sello visualmente en x=120, y=tableBottomY-45:
            const paidX = 50
            const paidY = tableBottomY - 60

            page.drawImage(selloPaidImg, {
                x: paidX,
                y: paidY,
                width: paidW,
                height: paidH,
                rotate: degrees(15),   // oblicuo hacia la derecha
                opacity: 0.82,
            })
        }

        // --- SELLO 2: ZARA DESIGNS (circular) + rúbrica ---
        // Posición: parte inferior derecha
        // Tamaño: 90 x 90 pts (~32mm), rotado -8°
        const selloZaraImg = await loadStampImage(doc, 'sello-zara.png')
        if (selloZaraImg) {
            const zaraSize = 90
            const zaraX = width - 160
            const zaraY = 130   // zona inferior derecha

            page.drawImage(selloZaraImg, {
                x: zaraX,
                y: zaraY,
                width: zaraSize,
                height: zaraSize,
                rotate: degrees(-8),
                opacity: 0.80,
            })

            // Rúbrica decorativa debajo del sello
            drawRubric(page, zaraX + zaraSize / 2 - 12, zaraY - 14)
        }
    }

    const pdfBytes = await doc.save()
    return pdfBytes
}
