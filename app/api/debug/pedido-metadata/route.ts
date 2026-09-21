import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { esAdmin, noAutorizado } from '@/lib/admin'

// RUTA DE DIAGNÓSTICO TEMPORAL - BORRAR DESPUÉS
export async function GET(req: Request) {
    // Antes bastaba con tener sesión de cualquier usuario; ahora exige el allowlist de admin.
    if (!(await esAdmin())) return noAutorizado()

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
