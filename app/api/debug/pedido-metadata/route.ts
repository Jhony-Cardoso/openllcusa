import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// RUTA DE DIAGNÓSTICO TEMPORAL - BORRAR DESPUÉS
export async function GET(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'not authenticated' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const pedidoId = searchParams.get('id')
    if (!pedidoId) return NextResponse.json({ error: 'falta id' }, { status: 400 })

    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('pedidos')
        .select('id, user_id, metadata, tax_data')
        .eq('id', pedidoId)
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({
        id: data.id,
        user_id: data.user_id,
        metadata: data.metadata,
        has_tax_data: !!data.tax_data,
    })
}
