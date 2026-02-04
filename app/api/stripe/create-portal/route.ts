import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { PedidoModel } from '@/lib/models/pedido'

export async function POST() {
    try {
        const { userId } = await auth()
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        // Buscar el customer_id en los pedidos del usuario
        const pedidos = await PedidoModel.obtenerPorUsuario(userId)
        const pedidoConCustomer = pedidos.find(p => p.stripe_customer_id)

        if (!pedidoConCustomer || !pedidoConCustomer.stripe_customer_id) {
            return NextResponse.json(
                { error: 'No se encontró un registro de cliente. Realiza un pago primero.' },
                { status: 404 }
            )
        }

        // Crear sesión del portal de Stripe
        const session = await stripe.billingPortal.sessions.create({
            customer: pedidoConCustomer.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/facturacion`,
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('Error creating portal session:', error)
        return NextResponse.json(
            { error: 'Error al conectar con el portal de facturación.' },
            { status: 500 }
        )
    }
}
