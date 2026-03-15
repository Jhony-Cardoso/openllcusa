import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PATCH(req: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await req.json()
        const { pedidoId, paso, datos } = body

        if (!pedidoId) {
            return NextResponse.json({ error: 'Falta pedidoId' }, { status: 400 })
        }

        console.log('📝 [PEDIDOS ACTUALIZAR] Actualizando pedido:', pedidoId)
        console.log('   - paso:', paso)
        console.log('   - datos:', datos)

        // Verificar que el pedido pertenece al usuario
        const { data: pedidoExistente, error: checkError } = await supabaseAdmin
            .from('pedidos')
            .select('id, user_id')
            .eq('id', pedidoId)
            .single()

        if (checkError || !pedidoExistente) {
            console.error('❌ Pedido no encontrado:', checkError)
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
        }

        if (pedidoExistente.user_id !== userId) {
            console.error('❌ Pedido no pertenece al usuario')
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        // Preparar datos para actualizar
        const updateData: any = {
            updated_at: new Date().toISOString()
        }

        if (paso !== undefined) {
            updateData.paso_actual = paso
        }

        if (datos) {
            Object.assign(updateData, datos)
        }

        // Actualizar
        console.log('📝 [PEDIDOS ACTUALIZAR] updateData:', JSON.stringify(updateData))
        const { data: pedidoActualizado, error: updateError } = await supabaseAdmin
            .from('pedidos')
            .update(updateData)
            .eq('id', pedidoId)
            .select()
            .single()

        if (updateError) {
            console.error('❌ Error actualizando pedido:', updateError)
            return NextResponse.json(
                { error: `Error al actualizar: ${updateError.message}`, details: updateError },
                { status: 500 }
            )
        }

        console.log('✅ Pedido actualizado:', pedidoActualizado.id)
        return NextResponse.json(pedidoActualizado)

    } catch (error) {
        console.error('💥 [PEDIDOS ACTUALIZAR] Excepción:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
