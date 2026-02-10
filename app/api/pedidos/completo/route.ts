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

        console.log('🔍 [PEDIDOS/COMPLETO] Buscando pedido:', pedidoId)

        // 1. Obtener pedido base
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

        // 2. Obtener paquete si existe
        let paquete = null
        if (pedido.paquete_id) {
            const { data: paqueteData } = await supabaseAdmin
                .from('paquetes')
                .select('*')
                .eq('id', pedido.paquete_id)
                .single()
            paquete = paqueteData
        }

        // 3. Obtener servicio si existe
        let servicio = null
        if (pedido.servicio_id) {
            const { data: servicioData } = await supabaseAdmin
                .from('servicios')
                .select('*')
                .eq('id', pedido.servicio_id)
                .single()
            servicio = servicioData
        }

        // 4. Obtener estado USA si existe
        let estado_usa = null
        if (pedido.estado_usa_id) {
            const { data: estadoData } = await supabaseAdmin
                .from('estados_usa')
                .select('*')
                .eq('id', pedido.estado_usa_id)
                .single()
            estado_usa = estadoData
        }

        // 5. Combinar resultado
        const resultado = {
            ...pedido,
            paquete,
            servicio,
            estado_usa
        }

        console.log('✅ Pedido completo:', resultado.id)
        return NextResponse.json({ pedido: resultado })

    } catch (error) {
        console.error('💥 [PEDIDOS/COMPLETO] Excepción:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
