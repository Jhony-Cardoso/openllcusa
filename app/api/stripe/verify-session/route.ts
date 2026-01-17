// ============================================
// app/api/stripe/verify-session/route.ts
// API Route para verificar sesión de Stripe tras el pago
// ============================================

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

    const { sessionId, pedidoId } = await request.json()
    if (!sessionId || !pedidoId) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Seguridad: comprobar metadata
    if (session.metadata?.pedidoId !== pedidoId) {
      return NextResponse.json({ error: 'La sesión no corresponde al pedido' }, { status: 400 })
    }
    if (session.metadata?.userId !== userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        paymentStatus: session.payment_status,
        error: 'El pago no se ha completado',
      })
    }

    // Si está pagado, marcar el pedido (solo si aún no lo está)
    const pedido = await PedidoModel.obtenerPorId(pedidoId)
    if (pedido && pedido.estado_pedido !== 'pagado') {
      await PedidoModel.marcarComoPagado(pedidoId, {
        payment_intent_id: (session.payment_intent as string) || undefined,
        session_id: sessionId,
        customer_id: (session.customer as string) || undefined,
        amount: session.amount_total ? session.amount_total / 100 : 0,
      })
    }

    // Devolver pedido completo para UI
    const pedidoCompleto = await PedidoModel.obtenerCompleto(pedidoId)

    return NextResponse.json({
      paymentStatus: 'paid',
      sessionId: session.id,
      customerEmail: session.customer_details?.email,
      pedido: pedidoCompleto,
    })
  } catch (error: any) {
    console.error('Error verificando sesión de Stripe:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
