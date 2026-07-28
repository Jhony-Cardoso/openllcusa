// ============================================
// app/api/admin/pedidos/[id]/notificar/route.ts
// Notificar al cliente desde Resumen Ejecutivo (botón real)
// ============================================

import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { PedidoModel } from '@/lib/models/pedido'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const user = await currentUser()
    const { id } = await params

    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar admin
    const adminEmails = [process.env.ADMIN_EMAIL, 'josemanuelguerranunez5@gmail.com']
    const isAdmin = adminEmails.includes(user?.emailAddresses[0]?.emailAddress || '')

    if (!isAdmin) {
      return NextResponse.json({ error: 'Acceso denegado - Solo administradores' }, { status: 403 })
    }

    const body = await request.json().catch(() => ({})) as { mensaje?: string }
    const mensaje = body.mensaje || 'Actualización de tu trámite'

    const pedido = await PedidoModel.obtenerCompleto(id, true)
    if (!pedido) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }

    // Obtener email del cliente (mismo patrón que actualizar-estado)
    let targetEmail = ''
    const adminClient = createAdminClient()

    const { data: profile } = await adminClient
      .from('profiles')
      .select('email')
      .eq('user_id', pedido.user_id)
      .single()

    if (profile?.email) {
      targetEmail = profile.email
    } else {
      try {
        const { createClerkClient } = await import('@clerk/nextjs/server')
        const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
        const clerkUser = await clerk.users.getUser(pedido.user_id)
        targetEmail = clerkUser.emailAddresses[0]?.emailAddress || ''
      } catch (clerkErr) {
        console.error('❌ Error obteniendo usuario de Clerk para notificación:', clerkErr)
      }
    }

    const nombreServicio =
      pedido.paquete?.nombre ||
      pedido.servicio?.nombre ||
      (pedido as any).metadata?.tipo_servicio ||
      'Trámite Open LLC USA'

    const nombreUsuario =
      pedido.metadata?.member_nombre_completo ||
      pedido.metadata?.cliente_nombre ||
      'Emprendedor'

    let emailEnviado = false

    if (targetEmail) {
      try {
        const { EmailService } = await import('@/lib/services/email.service')
        await EmailService.enviarNotificacionEstado({
          to: targetEmail,
          nombreUsuario,
          nombreServicio,
          pedidoId: pedido.id,
          nuevoEstado: mensaje,
          notas: `Paso actual: ${pedido.paso_actual ?? 0}. Notificación manual desde Panel Admin.`
        })
        emailEnviado = true
        console.log(`✅ [NOTIFICAR] Email enviado a ${targetEmail} para pedido ${pedido.numero_pedido}`)
      } catch (emailErr) {
        console.error('⚠️ [NOTIFICAR] Error enviando email:', emailErr)
      }
    } else {
      console.warn(`⚠️ [NOTIFICAR] No se encontró email para user_id ${pedido.user_id}`)
    }

    // Actualizar metadata: marcar enviado + append a step_history
    const now = new Date().toISOString()
    const currentMetadata = (pedido.metadata || {}) as Record<string, any>
    const currentHistory = Array.isArray(currentMetadata.step_history) ? currentMetadata.step_history : []

    const newEntry = {
      paso: pedido.paso_actual ?? 0,
      fecha: now,
      tipo: 'notificacion_cliente',
      descripcion: mensaje,
      admin: user?.emailAddresses[0]?.emailAddress || 'admin',
    }

    const updatedMetadata = {
      ...currentMetadata,
      email_recordatorio_enviado: true,
      ultima_notificacion_at: now,
      step_history: [...currentHistory, newEntry].slice(-10), // mantener últimos 10
    }

    // Guardar en DB
    const { error: updateError } = await adminClient
      .from('pedidos')
      .update({
        metadata: updatedMetadata,
        updated_at: now,
      })
      .eq('id', pedido.id)

    if (updateError) {
      console.error('❌ Error actualizando metadata tras notificación:', updateError)
    }

    return NextResponse.json({
      success: true,
      emailEnviado,
      targetEmail: targetEmail || null,
      stepHistoryEntry: newEntry,
      mensajeEnviado: mensaje,
    })
  } catch (error: any) {
    console.error('❌ Error en /notificar:', error)
    return NextResponse.json(
      { error: 'Error interno al enviar notificación', details: error.message },
      { status: 500 }
    )
  }
}
