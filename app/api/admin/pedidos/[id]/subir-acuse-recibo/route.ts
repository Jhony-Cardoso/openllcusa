import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth()
        const user = await currentUser()

        if (!userId || !user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const pedidoId = params.id
        const formData = await req.formData()
        const file = formData.get('acuse_recibo') as File

        if (!file) {
            return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 })
        }

        // Validar que sea PDF
        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'Solo se permiten archivos PDF' }, { status: 400 })
        }

        // Validar tamaño (10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'El archivo es demasiado grande (máx 10MB)' }, { status: 400 })
        }

        const supabaseAdmin = createAdminClient()

        // 1. Obtener el pedido actual
        const { data: pedido, error: pedidoError } = await supabaseAdmin
            .from('pedidos')
            .select('metadata, user_id')
            .eq('id', pedidoId)
            .single()

        if (pedidoError || !pedido) {
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
        }

        // 2. Subir archivo a Supabase Storage
        const fileName = `acuse-recibo-${pedidoId}-${Date.now()}.pdf`
        const fileBuffer = await file.arrayBuffer()

        const { data: uploadData, error: uploadError } = await supabaseAdmin
            .storage
            .from('documentos')
            .upload(`tax-forms/acuses/${fileName}`, fileBuffer, {
                contentType: 'application/pdf',
                upsert: false
            })

        if (uploadError) {
            console.error('Error subiendo acuse de recibo:', uploadError)
            return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 })
        }

        // 3. Obtener URL pública
        const { data: urlData } = supabaseAdmin
            .storage
            .from('documentos')
            .getPublicUrl(`tax-forms/acuses/${fileName}`)

        const acuseUrl = urlData.publicUrl

        // 4. Actualizar metadata del pedido
        const currentMetadata = pedido.metadata || {}
        const { error: updateError } = await supabaseAdmin
            .from('pedidos')
            .update({
                metadata: {
                    ...currentMetadata,
                    acuse_recibo_path: acuseUrl,
                    acuse_recibo_nombre: file.name,
                    acuse_recibo_subida_fecha: new Date().toISOString(),
                    acuse_recibo_subida_por: user.emailAddresses?.[0]?.emailAddress || 'Admin',
                    estado_tramitacion: 'acuse_recibido'
                },
                paso_actual: 9 // Marcar como completado
            })
            .eq('id', pedidoId)

        if (updateError) {
            console.error('Error actualizando metadata:', updateError)
            return NextResponse.json({ error: 'Error actualizando el pedido' }, { status: 500 })
        }

        // 5. TODO: Enviar notificación al cliente
        // Aquí podrías integrar el envío de email al cliente notificándole que su acuse está disponible

        return NextResponse.json({
            success: true,
            message: 'Acuse de recibo subido exitosamente',
            url: acuseUrl
        })

    } catch (error: any) {
        console.error('Error en subir-acuse-recibo:', error)
        return NextResponse.json({
            error: error.message || 'Error interno del servidor'
        }, { status: 500 })
    }
}
