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

        // 2. Generar una URL firmada de corta duración (60 segundos)
        const { data, error: signedError } = await supabase.storage
            .from('identificaciones')
            .createSignedUrl(path, 60)

        if (signedError || !data?.signedUrl) {
            console.error('Error generando URL firmada:', signedError)
            return new NextResponse('Error al generar acceso al archivo', { status: 500 })
        }

        // Redirigir directamente a la URL firmada
        return NextResponse.redirect(data.signedUrl)

    } catch (error) {
        console.error('View ID Error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
