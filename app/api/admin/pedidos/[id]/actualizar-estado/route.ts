// app/api/admin/pedidos/[id]/actualizar-estado/route.ts

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

        // Verificar que es admin
        const adminEmails = [process.env.ADMIN_EMAIL, 'josemanuelguerranunez5@gmail.com']
        const isAdmin = adminEmails.includes(user?.emailAddresses[0]?.emailAddress || '')

        if (!isAdmin) {
            return NextResponse.json({ error: 'Acceso denegado - Solo administradores' }, { status: 403 })
        }

        // Obtener datos del body
        const body = await request.json()
        const { paso_actual, estado_tramitacion, notas_admin } = body

        if (paso_actual === undefined) {
            return NextResponse.json({ error: 'Se requiere el campo paso_actual' }, { status: 400 })
        }

        // Obtener pedido actual
        const pedido = await PedidoModel.obtenerCompleto(id, true)

        if (!pedido) {
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
        }

        // Preparar actualización
        const updateData: any = {
            paso_actual,
            updated_at: new Date().toISOString(),
        }

        // Actualizar metadata si se proporcionan datos adicionales
        if (estado_tramitacion || notas_admin) {
            const updatedMetadata = {
                ...pedido.metadata,
                estado_tramitacion: estado_tramitacion || pedido.metadata?.estado_tramitacion,
                notas_admin: notas_admin || pedido.metadata?.notas_admin,
                ultima_actualizacion_admin: new Date().toISOString(),
                actualizado_por: user?.emailAddresses[0]?.emailAddress,
            }
            updateData.metadata = updatedMetadata
        }

        // Actualizar en la base de datos
        const adminClient = createAdminClient()
        const { error: updateError } = await adminClient
            .from('pedidos')
            .update(updateData)
            .eq('id', pedido.id)

        if (updateError) {
            console.error('❌ Error al actualizar estado del pedido:', updateError)
            return NextResponse.json(
                { error: 'Error al actualizar el pedido', details: updateError.message },
                { status: 500 }
            )
        }

        // 4. Notificar al usuario por Email
        try {
            let targetEmail = ''

            // 1. Intentar por profiles de Supabase
            const { data: profile } = await adminClient
                .from('profiles')
                .select('email')
                .eq('user_id', pedido.user_id)
                .single()

            if (profile?.email) {
                targetEmail = profile.email
            } else {
                // 2. Fallback: Intentar obtener desde Clerk directamente
                console.log(`[API Estado] Profile no encontrado para \${pedido.user_id}, intentando Clerk...`)
                try {
                    const { createClerkClient } = await import('@clerk/nextjs/server')
                    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
                    const clerkUser = await clerk.users.getUser(pedido.user_id)
                    targetEmail = clerkUser.emailAddresses[0]?.emailAddress || ''
                } catch (clerkErr) {
                    console.error('❌ Error obteniendo usuario de Clerk:', clerkErr)
                }
            }

            if (targetEmail) {
                const { EmailService } = await import('@/lib/services/email.service')
                const nombreServicio = pedido.paquete?.nombre || pedido.servicio?.nombre || 'Trámite LLC'

                // Mapear estado legible
                const estados: Record<string, string> = {
                    'pendiente': 'Pendiente de Envío',
                    'enviado_irs': 'Enviado al IRS',
                    'en_revision': 'En Revisión por el IRS',
                    'aprobado': 'Aprobado - Trámite Completado',
                    'rechazado': 'Rechazado'
                }

                const estadoLegible = estados[estado_tramitacion] || `Cambio de Estado (Paso \${paso_actual})`

                await EmailService.enviarNotificacionEstado({
                    to: targetEmail,
                    nombreUsuario: pedido.metadata?.member_nombre_completo || 'Emprendedor',
                    nombreServicio,
                    pedidoId: pedido.id,
                    nuevoEstado: estadoLegible,
                    notas: notas_admin
                })
                console.log(`✅ Email de estado enviado a: \${targetEmail}`)
            } else {
                console.warn(`⚠️ No se pudo encontrar email para el usuario \${pedido.user_id}. Notificación no enviada.`)
            }
        } catch (emailErr) {
            console.error('⚠️ [API Actualizar Estado] No se pudo enviar el email de notificación:', emailErr)
        }

        console.log(`✅ Estado actualizado para pedido ${pedido.numero_pedido}: paso ${paso_actual}`)

        return NextResponse.json({
            success: true,
            message: 'Estado actualizado exitosamente y cliente notificado',
            data: {
                pedidoId: pedido.id,
                numeroPedido: pedido.numero_pedido,
                pasoActual: paso_actual,
                estadoTramitacion: estado_tramitacion,
            },
        })
    } catch (error: any) {
        console.error('❌ Error al actualizar estado:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud', details: error.message },
            { status: 500 }
        )
    }
}
