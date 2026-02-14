// app/api/pedidos/[id]/descargar-carta-ein/route.ts

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { PedidoModel } from '@/lib/models/pedido'
import { supabase } from '@/lib/supabase/client'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        const { id } = await params

        if (!userId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Obtener pedido completo
        const pedido = await PedidoModel.obtenerCompleto(id)

        if (!pedido) {
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
        }

        // Verificar que el pedido pertenece al usuario
        if (pedido.user_id !== userId) {
            return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
        }

        // Verificar que existe la Carta EIN
        const cartaEINPath = pedido.metadata?.carta_ein_path

        if (!cartaEINPath) {
            return NextResponse.json(
                { error: 'La Carta EIN aún no está disponible. Nuestro equipo te notificará cuando esté lista.' },
                { status: 404 }
            )
        }

        // Descargar el archivo desde Supabase Storage
        const { data: fileData, error: downloadError } = await supabase
            .storage
            .from('documentos')
            .download(cartaEINPath)

        if (downloadError || !fileData) {
            console.error('❌ Error al descargar Carta EIN desde Supabase:', downloadError)
            return NextResponse.json(
                { error: 'Error al descargar el documento', details: downloadError?.message },
                { status: 500 }
            )
        }

        // Convertir Blob a Buffer
        const arrayBuffer = await fileData.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Devolver el PDF
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Carta_EIN_${pedido.numero_pedido}.pdf"`,
            },
        })
    } catch (error: any) {
        console.error('❌ Error al descargar Carta EIN:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud', details: error.message },
            { status: 500 }
        )
    }
}
