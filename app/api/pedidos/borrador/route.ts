import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

/**
 * GET /api/pedidos/borrador?servicioId=xxx&paqueteId=yyy
 * 
 * Busca un pedido en estado 'borrador' para el usuario actual.
 * Acepta tanto servicioId como paqueteId (o ambos).
 * Devuelve el pedido si existe, o null si no hay ninguno.
 */
export async function GET(req: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const servicioId = searchParams.get('servicioId')
        const paqueteId = searchParams.get('paqueteId')
        const tipo = searchParams.get('tipo') // 'servicio' o 'paquete'

        if (!servicioId && !paqueteId) {
            return NextResponse.json({ error: 'Falta servicioId o paqueteId' }, { status: 400 })
        }

        console.log('🔍 [BORRADOR API] Buscando borrador para usuario:', userId)
        console.log('   - servicioId:', servicioId)
        console.log('   - paqueteId:', paqueteId)
        console.log('   - tipo:', tipo)

        // Buscar borrador usando admin client (sin RLS)
        // Buscar por servicio_id O paquete_id según el tipo
        let data = null

        // Si es explícitamente un paquete o tenemos paqueteId
        if (tipo === 'paquete' || paqueteId) {
            const targetId = paqueteId || servicioId
            console.log('🔍 [BORRADOR API] Buscando por paquete_id:', targetId)

            const { data: paqueteData, error: paqueteError } = await supabaseAdmin
                .from('pedidos')
                .select('*')
                .eq('user_id', userId)
                .eq('paquete_id', targetId)
                .eq('estado_pedido', 'borrador')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle()

            if (!paqueteError && paqueteData) {
                data = paqueteData
                console.log('✅ [BORRADOR API] Borrador encontrado por paquete_id:', data.id)
            }
        }

        // Si no encontramos por paquete, buscar por servicio
        if (!data && (tipo === 'servicio' || servicioId)) {
            const targetId = servicioId || paqueteId
            console.log('🔍 [BORRADOR API] Buscando por servicio_id:', targetId)

            const { data: servicioData, error: servicioError } = await supabaseAdmin
                .from('pedidos')
                .select('*')
                .eq('user_id', userId)
                .eq('servicio_id', targetId)
                .eq('estado_pedido', 'borrador')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle()

            if (!servicioError && servicioData) {
                data = servicioData
                console.log('✅ [BORRADOR API] Borrador encontrado por servicio_id:', data.id)
            }
        }

        // Si aún no encontramos, buscar cualquier borrador del usuario para ese ID
        if (!data && (servicioId || paqueteId)) {
            const targetId = servicioId || paqueteId
            console.log('🔍 [BORRADOR API] Búsqueda amplia por cualquier campo:', targetId)

            // Búsqueda OR: servicio_id = X OR paquete_id = X
            const { data: anyData, error: anyError } = await supabaseAdmin
                .from('pedidos')
                .select('*')
                .eq('user_id', userId)
                .eq('estado_pedido', 'borrador')
                .or(`servicio_id.eq.${targetId},paquete_id.eq.${targetId}`)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle()

            if (!anyError && anyData) {
                data = anyData
                console.log('✅ [BORRADOR API] Borrador encontrado en búsqueda amplia:', data.id)
            }
        }

        if (!data) {
            console.log('⚠️ [BORRADOR API] No se encontró ningún borrador')
        }

        // Devolver el pedido o null
        return NextResponse.json({ pedido: data })

    } catch (error) {
        console.error('❌ Excepción en /api/pedidos/borrador:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
