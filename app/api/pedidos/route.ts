import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: Request) {
    try {
        const { userId } = await auth()
        const user = await currentUser()

        if (!userId || !user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await req.json()
        const { servicioId, paqueteId, tipo } = body

        // Aceptamos servicioId (compatibilidad) o paqueteId explícito
        const targetId = servicioId || paqueteId
        const esPaquete = tipo === 'paquete' || !!paqueteId

        if (!targetId) {
            return NextResponse.json({ error: 'Falta servicioId o paqueteId' }, { status: 400 })
        }

        console.log('📦 [PEDIDOS API] Creando/recuperando pedido:')
        console.log('   - userId:', userId)
        console.log('   - targetId:', targetId)
        console.log('   - tipo:', esPaquete ? 'paquete' : 'servicio')

        // 1. Asegurar que el usuario existe en profiles
        const email = user.emailAddresses[0]?.emailAddress

        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                user_id: userId,
                email: email,
                full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                avatar_url: user.imageUrl,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' })

        if (profileError) {
            console.error('⚠️ Error sincronizando perfil:', profileError)
        }

        // 2. ¿Ya existe un borrador para este usuario y servicio/paquete?
        // Buscar en ambos campos (servicio_id y paquete_id)
        const { data: existenteServicio } = await supabaseAdmin
            .from('pedidos')
            .select('*')
            .eq('user_id', userId)
            .eq('servicio_id', targetId)
            .eq('estado_pedido', 'borrador')
            .maybeSingle()

        if (existenteServicio) {
            console.log('♻️ [PEDIDOS API] Reutilizando borrador (servicio_id):', existenteServicio.id)
            return NextResponse.json(existenteServicio)
        }

        const { data: existentePaquete } = await supabaseAdmin
            .from('pedidos')
            .select('*')
            .eq('user_id', userId)
            .eq('paquete_id', targetId)
            .eq('estado_pedido', 'borrador')
            .maybeSingle()

        if (existentePaquete) {
            console.log('♻️ [PEDIDOS API] Reutilizando borrador (paquete_id):', existentePaquete.id)
            return NextResponse.json(existentePaquete)
        }

        // 3. Crear el pedido
        // Determinar si el ID corresponde a un servicio o paquete
        const insertData: any = {
            numero_pedido: `PED-${Date.now()}`,
            user_id: userId,
            estado_pedido: 'borrador',
            paso_actual: 1
        }

        if (esPaquete) {
            insertData.paquete_id = targetId
        } else {
            insertData.servicio_id = targetId
        }

        console.log('📝 [PEDIDOS API] Creando nuevo pedido:', insertData)

        const { data: pedido, error: pedidoError } = await supabaseAdmin
            .from('pedidos')
            .insert(insertData)
            .select()
            .single()

        if (pedidoError) {
            console.error('❌ [PEDIDOS API] Error creando pedido:', pedidoError)
            return NextResponse.json({ error: 'Error al crear el pedido en BD' }, { status: 500 })
        }

        console.log('✅ [PEDIDOS API] Pedido creado:', pedido.id)
        return NextResponse.json(pedido)

    } catch (error) {
        console.error('💥 [PEDIDOS API] Excepción creando pedido:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
