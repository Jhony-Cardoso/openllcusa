import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'

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

    console.log('🛒 [checkout-servicio] pedidoId:', pedidoId, 'slug:', slug)

    // 1. Obtener pedido base
    const { data: pedido, error: pedidoError } = await supabaseAdmin
      .from('pedidos')
      .select('*')
      .eq('id', pedidoId)
      .single()

    if (pedidoError || !pedido) {
      console.error('❌ [checkout-servicio] Pedido no encontrado:', pedidoError)
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }

    if (pedido.user_id !== userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // 2. Obtener servicio
    let servicio: any = null
    if (pedido.servicio_id) {
      const { data } = await supabaseAdmin
        .from('servicios')
        .select('*')
        .eq('id', pedido.servicio_id)
        .single()
      servicio = data
    }

    // 3. Obtener estado USA
    let estadoUsa: any = null
    if (pedido.estado_usa_id) {
      const { data } = await supabaseAdmin
        .from('estados_usa')
        .select('*')
        .eq('id', pedido.estado_usa_id)
        .single()
      estadoUsa = data
    }

    console.log('📦 [checkout-servicio] servicio:', servicio?.nombre, 'precio:', servicio?.precio)
    console.log('📍 [checkout-servicio] estado:', estadoUsa?.nombre, 'filing_anual:', estadoUsa?.filing_anual)

    const precioServicio = Number(servicio?.precio ?? 0)
    const isReporteAnual = slug === 'reporte-anual'
    const filingAnual = isReporteAnual ? Number(estadoUsa?.filing_anual ?? 0) : 0

    if (!precioServicio || precioServicio <= 0) {
      console.error('❌ [checkout-servicio] Precio inválido:', precioServicio)
      return NextResponse.json({ error: 'Precio inválido para el servicio' }, { status: 400 })
    }

    const nombreProducto = servicio?.nombre || servicio?.title || 'Servicio'
    const descripcionProducto = servicio?.descripcion || undefined

    // Construir line_items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: nombreProducto,
            ...(descripcionProducto ? { description: descripcionProducto } : {}),
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
            name: `Filing anual estatal — ${estadoUsa?.nombre || 'Estado'}`,
            description: 'Tasa oficial de reporte anual del estado',
          },
          unit_amount: Math.round(filingAnual * 100),
        },
        quantity: 1,
      })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const basePath = slug === 'obtencion-ein' 
      ? `/servicios/impuestos/obtencion-ein` 
      : `/servicios/${slug}`

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${baseUrl}${basePath}/onboarding/completado?pedido=${pedido.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${basePath}/onboarding/checkout?pedido=${pedido.id}&canceled=true`,
      metadata: {
        pedidoId: pedido.id,
        userId,
        slug,
      },
      customer_email: pedido.email_empresa || undefined,
    })

    console.log('✅ [checkout-servicio] Sesión Stripe creada:', session.id)
    return NextResponse.json({ url: session.url })

  } catch (error: any) {
    console.error('💥 [checkout-servicio] Excepción:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}


