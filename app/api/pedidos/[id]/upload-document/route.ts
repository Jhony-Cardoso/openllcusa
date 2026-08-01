import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
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

        // 2. Procesar el FormData
        const formData = await req.formData()
        const file = formData.get('file') as File
        const tipoDocumento = formData.get('tipoDocumento') as string || 'otro'
        const descripcion = formData.get('descripcion') as string || ''

        if (!file) {
            return NextResponse.json({ error: 'No se ha subido ningún archivo' }, { status: 400 })
        }

        const supabase = createAdminClient()

        // 3. Subir archivo al bucket 'documentos_clientes'
        const fileExt = file.name.split('.').pop()
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5)
        const fileName = `${pedidoId}/${tipoDocumento}_${uniqueId}.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('documentos_clientes')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type
            })

        if (uploadError) {
            console.error('Error subiendo a Supabase Storage:', uploadError)
            return NextResponse.json({ error: 'Error al subir el archivo al almacenamiento' }, { status: 500 })
        }

        // 4. Guardar información en documentos_subidos
        // Guardamos un objeto JSON stringificado para tener metadata de cada archivo
        const docInfo = JSON.stringify({
            path: fileName,
            nombre_original: file.name,
            tipo_documento: tipoDocumento,
            descripcion: descripcion,
            fecha_subida: new Date().toISOString()
        })

        const documentosSubidosActuales = pedido.documentos_subidos || []
        const nuevosDocumentos = [...documentosSubidosActuales, docInfo]

        const { error: updateError } = await (supabase as any)
            .from('pedidos')
            .update({ documentos_subidos: nuevosDocumentos })
            .eq('id', pedidoId)

        if (updateError) {
            return NextResponse.json({ error: 'Error al actualizar la base de datos' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            path: fileName,
            docInfo: docInfo
        })

    } catch (error) {
        console.error('Upload Document Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
