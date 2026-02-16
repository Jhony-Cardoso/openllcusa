
import { NextResponse } from 'next/server'
import { generateInvoicePDF } from '@/lib/pdf/invoice-generator'

export async function GET() {
    try {
        // Datos de prueba para la previsualización
        const sampleData = {
            numeroFactura: 'INV-PREVIEW-001',
            fechaEmision: new Date(),
            cliente: {
                nombre: 'Juan Pérez (Cliente Ejemplo)',
                email: 'juan@ejemplo.com',
                pais: 'España',
                direccion: 'Calle Principal 123, Madrid'
            },
            items: [
                {
                    descripcion: 'LLC Wyoming - Paquete Completo',
                    cantidad: 1,
                    precioUnitario: 499.00,
                    total: 499.00
                },
                {
                    descripcion: 'Servicio de Agente Registrado (1 año)',
                    cantidad: 1,
                    precioUnitario: 0.00,
                    total: 0.00
                }
            ],
            subtotal: 499.00,
            impuestos: 0.00,
            total: 499.00,
            metodoPago: 'Tarjeta (Stripe)',
            estadoPago: 'pagada',
            fechaPago: new Date()
        }

        const pdfBytes = await generateInvoicePDF(sampleData)
        const buffer = Buffer.from(pdfBytes)

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="Factura_Ejemplo.pdf"',
            },
        })

    } catch (error) {
        console.error('Error generando preview:', error)
        return NextResponse.json({ error: 'Error generando preview' }, { status: 500 })
    }
}
