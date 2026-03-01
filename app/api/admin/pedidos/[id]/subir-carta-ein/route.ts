// app/api/admin/pedidos/[id]/subir-carta-ein/route.ts

import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { PedidoModel } from '@/lib/models/pedido'
import { createAdminClient } from '@/lib/supabase/admin'
import { v4 as uuidv4 } from 'uuid'

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

        // Obtener pedido
        const pedido = await PedidoModel.obtenerCompleto(id, true)

        if (!pedido) {
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
        }

        // Obtener el archivo del FormData
        const formData = await request.formData()
        const file = formData.get('carta_ein') as File

        if (!file) {
            return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 })
        }

        // Validar tipo de archivo (PDF)
        if (file.type !== 'application/pdf') {
            return NextResponse.json(
                { error: 'Solo se permiten archivos PDF para la Carta EIN' },
                { status: 400 }
            )
        }

        // Validar tamaño (máx 10MB)
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'El archivo es demasiado grande. Máximo 10MB' },
                { status: 400 }
            )
        }

        // Convertir a buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Generar nombre único para el archivo
        const fileExtension = 'pdf'
        const uniqueFileName = `carta-ein-${pedido.numero_pedido}-${uuidv4()}.${fileExtension}`
        const storagePath = `pedidos/${pedido.id}/documentos/${uniqueFileName}`

        // Subir a Supabase Storage
        const adminClient = createAdminClient()
        const { data: uploadData, error: uploadError } = await adminClient
            .storage
            .from('documentos')
            .upload(storagePath, buffer, {
                contentType: 'application/pdf',
                upsert: false,
            })

        if (uploadError) {
            console.error('❌ Error al subir Carta EIN a Supabase:', uploadError)
            return NextResponse.json(
                { error: 'Error al subir el archivo', details: uploadError.message },
                { status: 500 }
            )
        }

        // Actualizar metadata del pedido
        const updatedMetadata = {
            ...pedido.metadata,
            carta_ein_path: storagePath,
            carta_ein_nombre: file.name,
            carta_ein_subida_fecha: new Date().toISOString(),
            carta_ein_subida_por: user?.emailAddresses[0]?.emailAddress,
        }

        // Actualizar pedido en la base de datos
        const { error: updateError } = await adminClient
            .from('pedidos')
            .update({
                metadata: updatedMetadata,
                paso_actual: 9, // Marcar como completado (EIN entregado)
                updated_at: new Date().toISOString(),
            })
            .eq('id', pedido.id)

        if (updateError) {
            console.error('❌ Error al actualizar pedido:', updateError)
            return NextResponse.json(
                { error: 'Error al actualizar el pedido', details: updateError.message },
                { status: 500 }
            )
        }

        console.log(`✅ Carta EIN subida exitosamente para pedido ${pedido.numero_pedido}`)

        // 4. Notificar al usuario por Email
        try {
            const adminClient = (await import('@/lib/supabase/admin')).createAdminClient()
            const { data: profile } = await adminClient
                .from('profiles')
                .select('email')
                .eq('user_id', pedido.user_id)
                .single()

            if (profile) {
                const { EmailService } = await import('@/lib/services/email.service')
                const nombreServicio = pedido.paquete?.nombre || pedido.servicio?.nombre || 'Obtención del EIN'

                await EmailService.enviarNotificacionEstado({
                    to: profile.email,
                    nombreUsuario: pedido.metadata?.member_nombre_completo || 'Emprendedor',
                    nombreServicio,
                    pedidoId: pedido.id,
                    nuevoEstado: '✅ EIN Entregado y Disponible',
                    notas: 'Ya puedes descargar tu carta oficial del IRS desde el panel de documentos.'
                })
            }
        } catch (emailErr) {
            console.error('⚠️ [API Subir EIN] No se pudo enviar el email de notificación:', emailErr)
        }

        return NextResponse.json({
            success: true,
            message: 'Carta EIN subida exitosamente y cliente notificado',
            data: {
                path: storagePath,
                fileName: file.name,
                pedidoId: pedido.id,
                numeroPedido: pedido.numero_pedido,
            },
        })
    } catch (error: any) {
        console.error('❌ Error al subir Carta EIN:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud', details: error.message },
            { status: 500 }
        )
    }
}
