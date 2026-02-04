// ============================================
// app/api/stripe/verify-session/route.ts
// API Route para verificar sesión de Stripe tras el pago
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { PedidoModel } from '@/lib/models/pedido'
import { EmailService } from '@/lib/services/email.service'


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
      const totalAmount = session.amount_total ? session.amount_total / 100 : 0

      await PedidoModel.marcarComoPagado(pedidoId, {
        payment_intent_id: (session.payment_intent as string) || undefined,
        session_id: sessionId,
        customer_id: (session.customer as string) || undefined,
        amount: totalAmount,
      })

      // DISPARAR EMAILS POST-PAGO
      try {
        const user = await currentUser()
        const pedidoCompleto = await PedidoModel.obtenerCompleto(pedidoId)

        const nombreProducto =
          pedidoCompleto?.paquete?.nombre ||
          pedidoCompleto?.paquete?.title ||
          pedidoCompleto?.servicio?.nombre ||
          pedidoCompleto?.servicio?.title ||
          'Servicio Open LLC'

        // 1. Email al Cliente
        await EmailService.enviarConfirmacionPago({
          to: session.customer_details?.email || user?.emailAddresses[0].emailAddress || '',
          nombreUsuario: user?.firstName || 'Emprendedor',
          nombreServicio: nombreProducto,
          montoPagado: totalAmount,
          pedidoId: pedidoCompleto?.numero_pedido || pedidoId,
          fechaPago: new Date().toISOString()
        })

        // 2. Notificación al Equipo
        await EmailService.notificarEquipo({
          tipo: 'nuevo_pedido',
          pedidoId: pedidoCompleto?.numero_pedido || pedidoId,
          nombreServicio: nombreProducto,
          monto: totalAmount,
          cliente: `${user?.firstName} ${user?.lastName} (${user?.emailAddresses[0].emailAddress})`
        })

        console.log('📬 Emails post-pago enviados correctamente')
      } catch (emailError) {
        console.error('❌ Error enviando emails post-pago:', emailError)
        // No bloqueamos la respuesta al cliente si el email falla
      }
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
