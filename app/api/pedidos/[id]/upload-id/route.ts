import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PedidoModel } from '@/lib/models/pedido'

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        const { id: pedidoId } = await params

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        // 1. Verificar propiedad del pedido
        const pedido = await PedidoModel.obtenerCompleto(pedidoId)
        if (!pedido || pedido.user_id !== userId) {
            return new NextResponse('Forbidden', { status: 403 })
        }

        // 2. Procesar el FormData (archivo + campos)
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No se ha subido ningún archivo' }, { status: 400 })
        }

        // 3. Crear cliente de Supabase
        const supabase = await createClient()

        // 4. Subir archivo al bucket 'identificaciones'
        // El nombre será: {pedidoId}/{timestamp}-{nombre_original}
        const fileExt = file.name.split('.').pop()
        const fileName = `${pedidoId}/${Date.now()}.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('identificaciones')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('Error subiendo a Supabase Storage:', uploadError)
            return NextResponse.json({ error: 'Error al subir el archivo al almacenamiento' }, { status: 500 })
        }

        // 5. Guardar la URL o el path en la metadata del pedido
        // Usamos el path relativo al bucket
        const existingMetadata = pedido.metadata || {}
        const updatedMetadata = {
            ...existingMetadata,
            documento_identidad_path: fileName,
            documento_identidad_nombre: file.name,
            fecha_subida_id: new Date().toISOString()
        }

        // 6. Actualizar el pedido (sin cambiar el paso todavía, o si prefieres subirlo aquí)
        // Por ahora solo guardamos la carga del archivo
        const { error: updateError } = await (await createClient())
            .from('pedidos')
            .update({ metadata: updatedMetadata })
            .eq('id', pedidoId)

        if (updateError) {
            return NextResponse.json({ error: 'Error al actualizar la base de datos' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            path: fileName
        })

    } catch (error) {
        console.error('Upload ID Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
