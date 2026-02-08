import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId: adminId } = await auth()
        const userAdmin = await currentUser()
        const { id: pedidoId } = await params

        if (!adminId) return new NextResponse('Unauthorized', { status: 401 })

        // Seguridad: Solo admin puede ver estos documentos privados
        const adminEmails = [process.env.ADMIN_EMAIL, 'josemanuelguerranunez5@gmail.com']
        const isAdmin = adminEmails.includes(userAdmin?.emailAddresses[0]?.emailAddress || '')
        if (!isAdmin) return new NextResponse('Forbidden', { status: 403 })

        // 1. Obtener los datos del pedido para sacar el path del documento
        const supabase = createAdminClient()
        const { data: pedido, error: pedidoError } = await supabase
            .from('pedidos')
            .select('metadata')
            .eq('id', pedidoId)
            .single()

        if (pedidoError || !pedido?.metadata?.documento_identidad_path) {
            return new NextResponse('Archivo no encontrado', { status: 404 })
        }

        const path = pedido.metadata.documento_identidad_path

        // 2. Descargar el archivo desde Supabase a través del servidor para ocultar la IP
        const { data, error: downloadError } = await supabase.storage
            .from('identificaciones')
            .download(path)

        if (downloadError || !data) {
            console.error('Error descargando archivo:', downloadError)
            return new NextResponse('Error al acceder al archivo', { status: 500 })
        }

        // 3. Devolver el archivo con el tipo de contenido original
        const blob = data
        const headers = new Headers()
        headers.set('Content-Type', blob.type || 'application/octet-stream')
        headers.set('Content-Disposition', `inline; filename="${pedido.metadata.documento_identidad_nombre || 'documento'}"`)
        headers.set('Cache-Control', 'private, max-age=3600')

        return new Response(blob, { headers })

    } catch (error) {
        console.error('View ID Error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
