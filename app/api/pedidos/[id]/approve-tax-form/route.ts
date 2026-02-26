import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        const { id } = await params

        if (!userId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const adminDb = createAdminClient()

        // 1. Obtener pedido y verificar propiedad
        const { data: pedido, error: fetchError } = await adminDb
            .from('pedidos')
            .select('user_id, metadata, id')
            .eq('id', id)
            .single()

        if (fetchError || !pedido) {
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
        }

        if (pedido.user_id !== userId) {
            return NextResponse.json({ error: 'No autorizado para este pedido' }, { status: 403 })
        }

        // 2. Modificar el bloque documents
        const currentMeta = (pedido.metadata as any) || {}
        const newDocs = {
            ...(currentMeta.documents || {}),
            form_5472_approved: true,
            form_5472_approved_at: new Date().toISOString()
        }

        const updatedMeta = {
            ...currentMeta,
            documents: newDocs
        }

        // 3. Guardar en base de datos
        const { error: updateError } = await adminDb
            .from('pedidos')
            .update({ metadata: updatedMeta })
            .eq('id', id)

        if (updateError) {
            throw new Error(updateError.message)
        }

        return NextResponse.json({ success: true, message: 'Documento aprobado correctamente' })

    } catch (error: any) {
        console.error('[API] Error al aprobar formulario:', error)
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 })
    }
}
