import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
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

        const data = await req.json()

        // Verificamos que el pedido pertenezca al usuario
        const pedido = await PedidoModel.obtenerCompleto(pedidoId)
        if (!pedido || pedido.user_id !== userId) {
            return new NextResponse('Forbidden', { status: 403 })
        }

        // Guardamos los datos en el campo metadata y actualizamos el paso
        const success = await PedidoModel.guardarDatosLegales(pedidoId, data)

        if (success) {
            return NextResponse.json({ success: true })
        } else {
            return NextResponse.json({ error: 'Error al actualizar el pedido' }, { status: 500 })
        }
    } catch (error) {
        console.error('Onboarding API Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
