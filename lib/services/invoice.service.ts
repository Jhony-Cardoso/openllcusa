
import { FacturaModel } from '@/lib/models/factura'
import { generateInvoicePDF } from '@/lib/pdf/invoice-generator'
import { createAdminClient } from '@/lib/supabase/admin'

export class InvoiceService {
    static async generarFacturaParaPedido(pedido: any, sessionStripe: any) {
        try {
            console.log(`🧾 [INVOICE] Generando factura para pedido ${pedido.id}`)

            // 1. Crear registro de factura
            const numeroFactura = FacturaModel.generarNumeroFactura()
            const montoTotal = sessionStripe.amount_total / 100

            const factura = await FacturaModel.crear({
                pedidoId: pedido.id,
                userId: pedido.user_id,
                numeroFactura,
                subtotal: montoTotal, // Asumiendo 0 impuestos por simplicidad inicial
                impuestos: 0,
                total: montoTotal,
                metodoPago: 'stripe',
                estadoPago: 'pagada',
                metadata: {
                    stripe_session_id: sessionStripe.id,
                    stripe_payment_intent: sessionStripe.payment_intent,
                    customer_email: sessionStripe.customer_details?.email,
                    customer_name: sessionStripe.customer_details?.name
                }
            })

            if (!factura) throw new Error('No se pudo crear el registro de factura')

            // 2. Generar PDF
            console.log(`🧾 [INVOICE] Generando PDF...`)
            const pdfBytes = await generateInvoicePDF({
                numeroFactura,
                fechaEmision: new Date(),
                cliente: {
                    nombre: sessionStripe.customer_details?.name || 'Cliente',
                    email: sessionStripe.customer_details?.email || '',
                    pais: sessionStripe.customer_details?.address?.country || '',
                    direccion: [
                        sessionStripe.customer_details?.address?.line1,
                        sessionStripe.customer_details?.address?.city,
                        sessionStripe.customer_details?.address?.postal_code
                    ].filter(Boolean).join(', ')
                },
                items: [{
                    descripcion: pedido.servicios?.nombre || pedido.paquetes?.nombre || 'Servicio Open LLC USA',
                    cantidad: 1,
                    precioUnitario: montoTotal,
                    total: montoTotal
                }],
                subtotal: montoTotal,
                impuestos: 0,
                total: montoTotal,
                metodoPago: 'Stripe',
                estadoPago: 'pagada',
                fechaPago: new Date()
            })

            // 3. Subir PDF a Supabase Storage
            console.log(`🧾 [INVOICE] Subiendo PDF a Storage...`)
            const supabase = createAdminClient()
            const fileName = `${numeroFactura}.pdf`
            const filePath = `${pedido.user_id}/${fileName}`

            const { error: uploadError } = await supabase
                .storage
                .from('facturas')
                .upload(filePath, pdfBytes, {
                    contentType: 'application/pdf',
                    upsert: true
                })

            if (uploadError) {
                console.error('❌ Error subiendo PDF factura:', uploadError)
                // No lanzamos error para no fallar todo el proceso, pero logueamos
            } else {
                // 4. Actualizar registro con path
                await FacturaModel.actualizarPdfPath(factura.id, filePath)
                console.log(`✅ [INVOICE] Factura generada y guardada: ${numeroFactura}`)
            }

            return factura

        } catch (error) {
            console.error('❌ Error general generando factura:', error)
            return null
        }
    }
}
