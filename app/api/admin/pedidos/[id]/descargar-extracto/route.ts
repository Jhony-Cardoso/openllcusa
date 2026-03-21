
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

        // Seguridad: Solo admin
        const adminEmails = [process.env.ADMIN_EMAIL, 'josemanuelguerranunez5@gmail.com']
        const isAdmin = adminEmails.includes(userAdmin?.emailAddresses[0]?.emailAddress || '')
        if (!isAdmin) return new NextResponse('Forbidden', { status: 403 })

        // 1. Obtener el path del query string
        const { searchParams } = new URL(req.url)
        const path = searchParams.get('path')

        if (!path) return new NextResponse('Path missing', { status: 400 })

        // 2. Descargar el archivo desde Supabase Admin (bucket 'documentos')
        const supabase = createAdminClient()
        const { data, error: downloadError } = await supabase.storage
            .from('documentos')
            .download(path)

        if (downloadError || !data) {
            console.error('Error descargando extracto:', downloadError)
            return new NextResponse('Archivo no encontrado en el bucket', { status: 404 })
        }

        // 3. Devolver el archivo
        const blob = data
        const fileName = path.split('/').pop()?.split('-').slice(1).join('-') || 'extracto-bancario'
        
        const headers = new Headers()
        headers.set('Content-Type', blob.type || 'application/octet-stream')
        headers.set('Content-Disposition', `attachment; filename="${fileName}"`)
        headers.set('Cache-Control', 'private, max-age=3600')

        return new Response(blob, { headers })

    } catch (error) {
        console.error('Download Statement Error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
