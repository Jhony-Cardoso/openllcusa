// app/api/admin/pedidos/[id]/actualizar-estado/route.ts

import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { PedidoModel } from '@/lib/models/pedido'
import { supabase } from '@/lib/supabase/client'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        const user = await currentUser()
        const { id } = await params

        if (!userId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Verificar que es admin
        const adminEmails = [process.env.ADMIN_EMAIL, 'josemanuelguerranunez5@gmail.com']
        const isAdmin = adminEmails.includes(user?.emailAddresses[0]?.emailAddress || '')

        if (!isAdmin) {
            return NextResponse.json({ error: 'Acceso denegado - Solo administradores' }, { status: 403 })
        }

        // Obtener datos del body
        const body = await request.json()
        const { paso_actual, estado_tramitacion, notas_admin } = body

        if (paso_actual === undefined) {
            return NextResponse.json({ error: 'Se requiere el campo paso_actual' }, { status: 400 })
        }

        // Obtener pedido actual
        const pedido = await PedidoModel.obtenerCompleto(id, true)

        if (!pedido) {
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
        }

        // Preparar actualización
        const updateData: any = {
            paso_actual,
            updated_at: new Date().toISOString(),
        }

        // Actualizar metadata si se proporcionan datos adicionales
        if (estado_tramitacion || notas_admin) {
            const updatedMetadata = {
                ...pedido.metadata,
                estado_tramitacion: estado_tramitacion || pedido.metadata?.estado_tramitacion,
                notas_admin: notas_admin || pedido.metadata?.notas_admin,
                ultima_actualizacion_admin: new Date().toISOString(),
                actualizado_por: user?.emailAddresses[0]?.emailAddress,
            }
            updateData.metadata = updatedMetadata
        }

        // Actualizar en la base de datos
        const { error: updateError } = await supabase
            .from('pedidos')
            .update(updateData)
            .eq('id', pedido.id)

        if (updateError) {
            console.error('❌ Error al actualizar estado del pedido:', updateError)
            return NextResponse.json(
                { error: 'Error al actualizar el pedido', details: updateError.message },
                { status: 500 }
            )
        }

        console.log(`✅ Estado actualizado para pedido ${pedido.numero_pedido}: paso ${paso_actual}`)

        return NextResponse.json({
            success: true,
            message: 'Estado actualizado exitosamente',
            data: {
                pedidoId: pedido.id,
                numeroPedido: pedido.numero_pedido,
                pasoActual: paso_actual,
                estadoTramitacion: estado_tramitacion,
            },
        })
    } catch (error: any) {
        console.error('❌ Error al actualizar estado:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud', details: error.message },
            { status: 500 }
        )
    }
}
