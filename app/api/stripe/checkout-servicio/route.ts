import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { PedidoModel } from '@/lib/models/pedido'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { pedidoId, slug } = await request.json()
    if (!pedidoId || !slug) {
      return NextResponse.json({ error: 'Faltan datos (pedidoId/slug)' }, { status: 400 })
    }

    const pedido = await PedidoModel.obtenerCompleto(pedidoId)
    if (!pedido) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }

    if (pedido.user_id !== userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const precioServicio = Number(pedido.paquete?.precio || pedido.paquete?.price || 0)
    if (!precioServicio || precioServicio <= 0) {
      return NextResponse.json({ error: 'Precio inválido para el servicio' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: pedido.paquete?.nombre || pedido.paquete?.title || 'Servicio',
              description: pedido.paquete?.descripcion_corta || pedido.paquete?.descripcion || undefined,
            },
            unit_amount: Math.round(precioServicio * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/servicios/${slug}/onboarding/completado?session_id={CHECKOUT_SESSION_ID}&pedido=${pedidoId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/servicios/${slug}/onboarding/checkout?pedido=${pedidoId}&canceled=true`,
      metadata: {
        pedidoId: pedido.id,
        userId,
        slug,
      },
      customer_email: pedido.email_empresa || undefined,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Error creando sesión de Stripe:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
