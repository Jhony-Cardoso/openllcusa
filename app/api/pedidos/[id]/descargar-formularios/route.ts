import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        const user = await currentUser()

        if (!userId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id: pedidoId } = await params
        const adminDb = createAdminClient()

        // El ADMIN_EMAIL configurado en .env
        const isAdmin = user?.emailAddresses.some(e => e.emailAddress === process.env.ADMIN_EMAIL)

        // Obtener pedido — cast a any para evitar inferencia de tipo 'never' en Supabase sin codegen
        let query = adminDb
            .from('pedidos')
            .select('*')
            .eq('id', pedidoId)

        // Si no es admin, debe ser el dueño del pedido
        if (!isAdmin) {
            query = query.eq('user_id', userId)
        }

        const { data, error } = await query.single()
        const pedido = data as any

        if (error || !pedido) {
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
        }

        // Verificar que tenga el PDF
        const pdfUrl = pedido.metadata?.documents?.form_5472_url
        if (!pdfUrl) {
            return NextResponse.json({ error: 'PDF no disponible' }, { status: 404 })
        }

        // Descargar el PDF desde Supabase (vía servidor para no filtrar IP/Puerto)
        console.log(`🔗 Proxy descarga PDF pedido ${pedido.numero_pedido}`)
        const response = await fetch(pdfUrl)

        if (!response.ok) {
            console.error('❌ Error descargando desde Supabase:', response.statusText)
            return NextResponse.json({ error: 'Error descargando PDF de la base de datos' }, { status: 500 })
        }

        const pdfBuffer = await response.arrayBuffer()

        // Devolver el PDF al cliente — la IP/Puerto del servidor nunca se expone
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Formularios_5472_1120_${pedido.numero_pedido}.pdf"`,
                'Cache-Control': 'private, max-age=0',
            },
        })

    } catch (error: any) {
        console.error('Error en proxy de descarga de formularios:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
