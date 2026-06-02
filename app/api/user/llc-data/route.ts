import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const adminDb = createAdminClient()

        // Buscamos el último trámite de LLC válido (nombre_empresa NO nulo y pagado)
        const { data: lastPedido, error } = await adminDb
            .from('pedidos')
            .select('*, estado_usa:estado_usa_id(*)')
            .eq('user_id', userId)
            .eq('estado_pedido', 'pagado')
            .not('nombre_empresa', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error || !lastPedido) {
            // Si no hay LLC completadas, igual podemos devolver un 200 con { data: null }
            return NextResponse.json({ data: null })
        }

        const { data: profile } = await adminDb
            .from('profiles')
            .select('full_name')
            .eq('user_id', userId)
            .single()

        // Formateamos los datos básicos para que el frontal los procese
        const llcData = {
            name: lastPedido.nombre_empresa,
            ein: (lastPedido.metadata as Record<string, any>)?.ein_number || '',
            state: lastPedido.estado_usa?.nombre || '',
            formationDate: ((lastPedido.metadata as Record<string, any>)?.fecha_formacion as string | undefined) || (lastPedido.created_at ? new Date(lastPedido.created_at).toISOString().split('T')[0] : ''),
            soleOwnerName: profile?.full_name || '',
            address: (lastPedido.metadata as Record<string, any>)?.direccion_empresa || '',
            city: (lastPedido.metadata as Record<string, any>)?.ciudad_empresa || '',
            zip: (lastPedido.metadata as Record<string, any>)?.zip_empresa || '',
        }

        return NextResponse.json({ data: llcData })
    } catch (error: any) {
        console.error('[API] Error al obtener datos LLC:', error)
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 })
    }
}
