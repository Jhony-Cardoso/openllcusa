import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { PedidoModel } from '@/lib/models/pedido'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_dummy_build', {
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

    const precioServicio = Number(
      pedido.paquete?.precio ??
      pedido.paquete?.price ??
      pedido.servicio?.precio ??
      pedido.servicio?.price ??
      0
    )

    const isReporteAnual = slug === 'reporte-anual'
    const filingAnual = isReporteAnual ? Number(pedido.estado_usa?.filing_anual ?? 0) : 0

    if (!precioServicio || precioServicio <= 0) {
      console.error('Precio inválido:', { paquete: pedido.paquete, servicio: pedido.servicio })
      return NextResponse.json({ error: 'Precio inválido para el servicio' }, { status: 400 })
    }

    const nombreProducto =
      pedido.paquete?.nombre ||
      pedido.paquete?.title ||
      pedido.servicio?.nombre ||
      pedido.servicio?.title ||
      'Servicio'

    const descripcionProducto =
      pedido.paquete?.descripcion_corta ||
      pedido.paquete?.descripcion ||
      pedido.servicio?.descripcion_corta ||
      pedido.servicio?.descripcion ||
      undefined

    // Construir line_items — para Reporte Anual incluye el filing estatal anual
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: nombreProducto,
            description: descripcionProducto,
          },
          unit_amount: Math.round(precioServicio * 100),
        },
        quantity: 1,
      },
    ]

    if (isReporteAnual && filingAnual > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Filing anual estatal — ${pedido.estado_usa?.nombre || 'Estado'}`,
            description: 'Tasa oficial de reporte anual del estado',
          },
          unit_amount: Math.round(filingAnual * 100),
        },
        quantity: 1,
      })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${baseUrl}/servicios/${slug}/onboarding/completado?pedido=${pedido.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/servicios/${slug}/onboarding/checkout?pedido=${pedido.id}&canceled=true`,
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
