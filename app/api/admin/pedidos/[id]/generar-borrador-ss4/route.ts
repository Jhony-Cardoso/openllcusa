// app/api/admin/pedidos/[id]/generar-borrador-ss4/route.ts
import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { PedidoModel } from '@/lib/models/pedido'
import { generarSS4PDF } from '@/lib/utils/pdfGenerator'
import { createAdminClient } from '@/lib/supabase/admin'
import { EmailService } from '@/lib/services/email.service'
import { NotificacionService } from '@/lib/services/notificacion.service'
import { v4 as uuidv4 } from 'uuid'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        const userAdmin = await currentUser()
        const { id } = await params

        if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

        // Verificar admin
        const adminEmails = [process.env.ADMIN_EMAIL, 'josemanuelguerranunez5@gmail.com']
        const isAdmin = adminEmails.includes(userAdmin?.emailAddresses[0]?.emailAddress || '')
        if (!isAdmin) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })

        const pedido = await PedidoModel.obtenerCompleto(id, true)
        if (!pedido) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })

        // Generar PDF
        const pdfBytes = await generarSS4PDF(pedido.metadata, pedido.id)
        const buffer = Buffer.from(pdfBytes)

        // Subir borrador
        const fileName = `SS4_DRAFT_${pedido.numero_pedido}_${uuidv4()}.pdf`
        const storagePath = `pedidos/${pedido.id}/documentos/${fileName}`

        const adminClient = createAdminClient()
        const { error: uploadError } = await adminClient.storage
            .from('documentos')
            .upload(storagePath, buffer, { contentType: 'application/pdf', upsert: true })

        if (uploadError) {
            console.error('❌ Error uploading draft to storage:', uploadError)
            return NextResponse.json({ error: 'Error al subir el borrador' }, { status: 500 })
        }

        // Actualizar metadata con el path del borrador y resetear aprobación
        const updatedMetadata = {
            ...pedido.metadata,
            borrador_ss4_path: storagePath,
            borrador_ss4_approved: false,
            borrador_ss4_fecha: new Date().toISOString()
        }

        const { error: updateError } = await adminClient
            .from('pedidos')
            .update({ metadata: updatedMetadata })
            .eq('id', pedido.id)

        if (updateError) throw updateError

        // Notificar al usuario que tiene un borrador para revisar
        // Notificar al usuario que tiene un borrador para revisar
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
                console.log(`[API Borrador] Profile no encontrado para ${pedido.user_id}, intentando Clerk...`)
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
                console.log(`[API Borrador] Preparando envío de email a: ${targetEmail}`);
                const emailResult = await EmailService.enviarNotificacionEstado({
                    to: targetEmail,
                    nombreUsuario: pedido.metadata?.member_nombre_completo || 'Emprendedor',
                    nombreServicio: pedido.paquete?.nombre || pedido.servicio?.nombre || 'Obtención del EIN',
                    pedidoId: pedido.id,
                    nuevoEstado: '🔍 Borrador SS-4 listo para tu revisión',
                    notas: 'Hemos preparado el borrador del Formulario SS-4. Por favor, revísalo y apruébalo en tu dashboard para que podamos enviarlo al IRS.'
                })
                console.log(`✅ Email de borrador enviado a: ${targetEmail}`, emailResult)
            } else {
                console.warn(`⚠️ No se pudo encontrar email para el usuario ${pedido.user_id}. Notificación no enviada.`)
            }

            // Enviar notificación in-app
            await NotificacionService.crear({
                userId: pedido.user_id,
                pedidoId: pedido.id,
                tipo: 'actualizacion_pedido',
                titulo: '📄 Borrador SS-4 listo',
                mensaje: 'Hemos preparado el borrador de tu Formulario SS-4. Revísalo y apruébalo para continuar.',
                url: `/dashboard/pedidos/${pedido.id}`
            });
            console.log(`✅ Notificación in-app de borrador creada para el usuario ${pedido.user_id}`)
        } catch (emailErr) {
            console.error('⚠️ [API Generar Borrador SS4] No se pudo enviar el email:', emailErr)
        }

        return NextResponse.json({
            success: true,
            message: 'Borrador generado y cliente notificado',
            path: storagePath
        })
    } catch (error: any) {
        console.error('Error generando borrador SS-4:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
