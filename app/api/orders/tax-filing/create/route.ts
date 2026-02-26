
import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { PedidoModel } from '@/lib/models/pedido'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
    try {
        const { userId } = await auth()
        const user = await currentUser()

        if (!userId || !user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await req.json()
        const { taxData } = body

        if (!taxData) {
            return NextResponse.json({ error: 'Faltan datos fiscales' }, { status: 400 })
        }

        // Asegurar Email
        const customerEmail = user.emailAddresses?.[0]?.emailAddress
        if (!customerEmail) {
            throw new Error('El usuario no tiene un email válido registrado.')
        }

        // 1. Crear Pedido en BD (PedidoModel.crear espera string)
        const pedido = await PedidoModel.crear(userId, undefined, undefined)

        if (!pedido) {
            throw new Error('Error al crear el pedido en base de datos. Intente más tarde.')
        }

        // 2. Guardar Datos Fiscales (JSON)
        const saved = await PedidoModel.guardarDatosFiscales(pedido.id, taxData)
        if (!saved) {
            throw new Error('Error guardando los datos fiscales.')
        }

        // 3. ACTUALIZAR METADATA (CRÍTICO para identificar el servicio en Dashboard)
        const adminDb = createAdminClient()
        await adminDb.from('pedidos').update({
            metadata: {
                tipo_servicio: 'tax_filing_5472',
                tax_year: taxData.taxYear || new Date().getFullYear() - 1
            }
        }).eq('id', pedido.id)

        // 4. Crear Sesión de Stripe Checkout
        const session = await stripe.checkout.sessions.create({
            customer_email: customerEmail,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Servicio Fiscal: Formulario 5472 + 1120',
                            description: `Preparación y presentación año fiscal ${taxData.taxYear || new Date().getFullYear() - 1}. Incluye Supporting Statements.`,
                        },
                        unit_amount: 24900, // $249.00 USD
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            // Usamos NEXT_PUBLIC_BASE_URL que es la que está definida en .env.local (ngrok o dominio real)
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/pedidos/${pedido.id}?verify_session={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/servicios/form-5472-1120/onboarding?canceled=true`,
            metadata: {
                pedidoId: pedido.id,
                userId: userId,
                tipo_servicio: 'tax_filing_5472'
            },
        })

        // 5. Devolver URL
        return NextResponse.json({ url: session.url })

    } catch (error: any) {
        console.error('Error procesando pedido fiscal:', error)
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 })
    }
}
