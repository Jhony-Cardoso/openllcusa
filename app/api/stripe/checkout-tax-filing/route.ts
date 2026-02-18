import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
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
        const { pedidoId } = body

        if (!pedidoId) {
            return NextResponse.json({ error: 'Falta pedidoId' }, { status: 400 })
        }

        // Asegurar Email
        const customerEmail = user.emailAddresses?.[0]?.emailAddress
        if (!customerEmail) {
            throw new Error('El usuario no tiene un email válido registrado.')
        }

        // Obtener datos del pedido
        const adminDb = createAdminClient()
        const { data: pedido, error: pedidoError } = await adminDb
            .from('pedidos')
            .select('*, tax_data')
            .eq('id', pedidoId)
            .eq('user_id', userId)
            .single()

        if (pedidoError || !pedido) {
            throw new Error('Pedido no encontrado')
        }

        const taxData = pedido.tax_data || {}

        // Crear Sesión de Stripe Checkout
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
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true&order_id=${pedidoId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/servicios/form-5472-1120/onboarding/checkout?pedidoId=${pedidoId}`,
            metadata: {
                pedidoId: pedidoId,
                userId: userId,
                tipo_servicio: 'tax_filing_5472'
            },
        })

        // Devolver URL
        return NextResponse.json({ url: session.url })

    } catch (error: any) {
        console.error('Error procesando checkout fiscal:', error)
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 })
    }
}
