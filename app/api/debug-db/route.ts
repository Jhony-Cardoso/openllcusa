import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const pedidoId = searchParams.get('pedido')

    // 1. Listar Servicios
    const { data: servicios } = await supabaseAdmin.from('servicios').select('*')

    // 2. Ver Pedido (si hay ID)
    let pedidoData = null
    if (pedidoId) {
        const { data } = await supabaseAdmin.from('pedidos').select('*').eq('id', pedidoId).single()
        pedidoData = data
    }

    // 3. Ver último pedido (si no hay ID específico)
    let ultimoPedido = null
    if (!pedidoId) {
        const { data } = await supabaseAdmin.from('pedidos').select('*').order('created_at', { ascending: false }).limit(1).single()
        ultimoPedido = data
    }

    return NextResponse.json({
        servicios,
        pedido_solicitado: pedidoData,
        ultimo_pedido: ultimoPedido
    })
}
