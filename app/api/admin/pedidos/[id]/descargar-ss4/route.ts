// app/api/admin/pedidos/[id]/descargar-ss4/route.ts

import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { PedidoModel } from '@/lib/models/pedido'
import { generarSS4PDF } from '@/lib/utils/pdfGenerator'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        const user = await currentUser()
        const { id } = await params

        if (!userId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Verificar que es admin
        const adminEmails = [process.env.ADMIN_EMAIL, 'josemanuelguerranunez5@gmail.com']
        const isAdmin = adminEmails.includes(user?.emailAddresses[0]?.emailAddress || '')

        if (!isAdmin) {
            return NextResponse.json({ error: 'Acceso denegado - Solo administradores' }, { status: 403 })
        }

        // Obtener pedido completo
        const pedido = await PedidoModel.obtenerCompleto(id, true)

        if (!pedido) {
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
        }

        // Verificar que el pedido tiene datos de SS-4
        if (!pedido.metadata || pedido.paso_actual < 7) {
            return NextResponse.json(
                { error: 'El cliente aún no ha completado el formulario SS-4' },
                { status: 400 }
            )
        }

        // Generar el PDF del SS-4
        const pdfBytes = await generarSS4PDF(pedido.metadata, pedido.id)

        // Devolver el PDF
        return new NextResponse(pdfBytes, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="SS4_${pedido.numero_pedido}_${Date.now()}.pdf"`,
            },
        })
    } catch (error: any) {
        console.error('❌ Error al generar SS-4 para admin:', error)
        return NextResponse.json(
            { error: 'Error al generar el formulario SS-4', details: error.message },
            { status: 500 }
        )
    }
}
