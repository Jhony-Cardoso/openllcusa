import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

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

        // Usamos el cliente admin para saltar el RLS y obtener el pedido de forma segura
        const supabaseAdmin = createAdminClient()

        // 1. Obtener el pedido y verificar propietario
        const { data: pedido, error: pedidoError } = await supabaseAdmin
            .from('pedidos')
            .select('*')
            .eq('id', pedidoId)
            .single()

        if (pedidoError || !pedido) {
            console.error('[API VIEW] Error obteniendo pedido:', pedidoError)
            return new NextResponse('Pedido no encontrado', { status: 404 })
        }

        if (pedido.user_id !== userId) {
            return new NextResponse('Forbidden', { status: 403 })
        }

        // 2. Verificar que el path solicitado coincide con archivos permitidos en metadata
        const metadata = (pedido.metadata as any) || {}
        const validPath =
            metadata.documents?.form_5472_path === path ||
            metadata.carta_ein_path === path ||
            metadata.documento_identidad_path === path

        if (!validPath) {
            console.warn(`[API VIEW] Acceso denegado. El path "${path}" no coincide con los autorizados en metadata.`)
            return new NextResponse('Access Denied to this file', { status: 403 })
        }

        // 3. Descargar el archivo desde el bucket correspondiente ('documentos' o 'identificaciones')
        const bucket = path.startsWith('tax-forms/') ? 'documentos' : 'identificaciones'
        const { data, error: downloadError } = await supabaseAdmin.storage
            .from(bucket)
            .download(path)

        if (downloadError || !data) {
            console.error('[API VIEW] Error en Storage:', downloadError)
            return new NextResponse('Error generating file access', { status: 500 })
        }

        // 4. Devolver como visualización inline
        const blob = data
        const headers = new Headers()
        headers.set('Content-Type', 'application/pdf')
        headers.set('Content-Disposition', 'inline')
        headers.set('Cache-Control', 'private, max-age=3600')

        return new Response(blob, { headers })

    } catch (error) {
        console.error('[API VIEW] Error crítico:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
