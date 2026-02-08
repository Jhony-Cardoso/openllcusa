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
        const { servicioId } = body

        if (!servicioId) {
            return NextResponse.json({ error: 'Falta servicioId' }, { status: 400 })
        }

        // 1. Asegurar que el usuario existe en profiles
        // El email principal es necesario
        const email = user.emailAddresses[0]?.emailAddress

        // Upsert del perfil para asegurar que existe
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
            console.error('Error sincronizando perfil:', profileError)
            // No detenemos el proceso, a veces puede fallar si ya existe y no hay cambios, 
            // pero si el error es de FK, fallará el pedido igual.
        }

        // 2. ¿Ya existe un borrador para este usuario y servicio?
        const { data: existente } = await supabaseAdmin
            .from('pedidos')
            .select('*')
            .eq('user_id', userId)
            .eq('servicio_id', servicioId)
            .eq('estado_pedido', 'borrador')
            .maybeSingle()

        if (existente) {
            console.log('♻️ Reutilizando pedido borrador:', existente.id)
            return NextResponse.json(existente)
        }

        // 3. Crear el pedido
        const { data: pedido, error: pedidoError } = await supabaseAdmin
            .from('pedidos')
            .insert({
                numero_pedido: `PED-${Date.now()}`,
                user_id: userId,
                servicio_id: servicioId,
                estado_pedido: 'borrador',
                paso_actual: 1
            })
            .select()
            .single()

        if (pedidoError) {
            console.error('Error creando pedido:', pedidoError)
            return NextResponse.json({ error: 'Error al crear el pedido en BD' }, { status: 500 })
        }

        return NextResponse.json(pedido)

    } catch (error) {
        console.error('Excepción creando pedido:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
