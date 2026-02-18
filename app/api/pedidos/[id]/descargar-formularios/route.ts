import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const pedidoId = params.id

        // Obtener pedido
        const adminDb = createAdminClient()
        const { data: pedido, error } = await adminDb
            .from('pedidos')
            .select('*')
            .eq('id', pedidoId)
            .eq('user_id', userId)
            .single()

        if (error || !pedido) {
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
        }

        // Verificar que tenga el PDF
        const pdfUrl = pedido.metadata?.documents?.form_5472_url
        if (!pdfUrl) {
            return NextResponse.json({ error: 'PDF no disponible' }, { status: 404 })
        }

        // Descargar el PDF desde Supabase
        const response = await fetch(pdfUrl)
        if (!response.ok) {
            return NextResponse.json({ error: 'Error descargando PDF' }, { status: 500 })
        }

        const pdfBuffer = await response.arrayBuffer()

        // Devolver el PDF sin exponer la URL interna
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Formularios_5472_1120_${pedido.numero_pedido}.pdf"`,
                'Cache-Control': 'private, max-age=0',
            },
        })

    } catch (error: any) {
        console.error('Error descargando formularios:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
