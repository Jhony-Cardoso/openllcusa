import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const pedidoId = searchParams.get('id')

        if (!pedidoId) {
            return NextResponse.json({ error: 'Falta id del pedido' }, { status: 400 })
        }

        console.log('🔍 [PEDIDOS/OBTENER] Buscando pedido:', pedidoId)

        // Obtener pedido
        const { data: pedido, error: pedidoError } = await supabaseAdmin
            .from('pedidos')
            .select('*')
            .eq('id', pedidoId)
            .single()

        if (pedidoError || !pedido) {
            console.error('❌ Pedido no encontrado:', pedidoError)
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
        }

        // Verificar que pertenece al usuario
        if (pedido.user_id !== userId) {
            console.error('❌ Pedido no pertenece al usuario')
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        console.log('✅ Pedido encontrado:', pedido.id)
        return NextResponse.json({ pedido })

    } catch (error) {
        console.error('💥 [PEDIDOS/OBTENER] Excepción:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
