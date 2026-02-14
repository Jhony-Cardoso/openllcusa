
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

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
    // Logo (Simulado con texto por ahora, idealmente cargar imagen)
    page.drawText('Open LLC USA', {
        x: 50,
        y: height - 50,
        size: 24,
        font: fontBold,
        color: blueColor,
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

    // Estado del Pago
    if (data.estadoPago === 'pagada') {
        page.drawRectangle({
            x: 50,
            y: footerY,
            width: 100,
            height: 25,
            color: rgb(0.86, 0.97, 0.88), // Verde claro
            borderColor: rgb(0.1, 0.6, 0.2),
            borderWidth: 1,
        })
        page.drawText('PAGADA', {
            x: 75,
            y: footerY + 8,
            size: 10,
            font: fontBold,
            color: rgb(0.1, 0.6, 0.2),
        })
    }

    // Detalles del Pago
    page.drawText(`Método de Pago: ${data.metodoPago}`, { x: 50, y: footerY - 20, size: 9, font: fontRegular, color: grayDark })
    if (data.fechaPago) {
        page.drawText(`Fecha de Pago: ${format(data.fechaPago, 'dd/MM/yyyy HH:mm')}`, { x: 50, y: footerY - 35, size: 9, font: fontRegular, color: grayDark })
    }

    // Mensaje Final
    page.drawText('Gracias por confiar en Open LLC USA', {
        x: width / 2 - 80,
        y: 50,
        size: 10,
        font: fontBold,
        color: blueColor,
    })

    const pdfBytes = await doc.save()
    return pdfBytes
}
