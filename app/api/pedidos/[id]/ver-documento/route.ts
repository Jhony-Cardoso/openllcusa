import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PedidoModel } from '@/lib/models/pedido'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        const { id: pedidoId } = await params
        const { searchParams } = new URL(req.url)
        const path = searchParams.get('path')

        if (!userId) return new NextResponse('Unauthorized', { status: 401 })
        if (!path) return new NextResponse('Path missing', { status: 400 })

        // 1. Verificar que el pedido pertenece al usuario
        const pedido = await PedidoModel.obtenerCompleto(pedidoId)
        if (!pedido || pedido.user_id !== userId) {
            return new NextResponse('Forbidden', { status: 403 })
        }

        // 2. Verificar que el path solicitado coincide con el guardado en metadata
        // Esto evita que un usuario intente ver archivos de otros cambiando el path en la URL
        if (pedido.metadata?.documento_identidad_path !== path) {
            return new NextResponse('Access Denied to this file', { status: 403 })
        }

        // 3. Descargar el archivo a través del servidor
        const supabase = createAdminClient()
        const { data, error: downloadError } = await supabase.storage
            .from('identificaciones')
            .download(path)

        if (downloadError || !data) {
            console.error('Error descargando archivo para cliente:', downloadError)
            return new NextResponse('Error generating file access', { status: 500 })
        }

        // 4. Devolver como stream
        const blob = data
        const headers = new Headers()
        headers.set('Content-Type', blob.type || 'application/octet-stream')
        headers.set('Content-Disposition', `inline; filename="${pedido.metadata?.documento_identidad_nombre || 'identificacion'}"`)
        headers.set('Cache-Control', 'private, max-age=3600')

        return new Response(blob, { headers })

    } catch (error) {
        console.error('Client View Doc Error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
