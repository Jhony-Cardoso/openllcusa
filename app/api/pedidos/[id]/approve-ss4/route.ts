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
            .select('user_id, metadata, id, numero_pedido')
            .eq('id', id)
            .single() as any

        if (fetchError || !pedido) {
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
        }

        if (pedido.user_id !== userId) {
            return NextResponse.json({ error: 'No autorizado para este pedido' }, { status: 403 })
        }

        // 2. Modificar el bloque de metadata para SS-4
        const currentMeta = (pedido.metadata as any) || {}

        const updatedMeta = {
            ...currentMeta,
            borrador_ss4_approved: true,
            borrador_ss4_approved_at: new Date().toISOString()
        }

        // 3. Guardar en base de datos
        const { error: updateError } = await (adminDb
            .from('pedidos') as any)
            .update({ metadata: updatedMeta })
            .eq('id', id)

        if (updateError) {
            throw new Error(updateError.message)
        }

        // Notificar al admin por email
        try {
            const { EmailService } = await import('@/lib/services/email.service')
            await EmailService.enviarNotificacionAdmin({
                subject: `✅ Borrador SS-4 APROBADO - Pedido #${pedido.numero_pedido}`,
                html: `
                    <p>El cliente <strong>${pedido.user_id}</strong> ha aprobado el borrador del Formulario SS-4.</p>
                    <p><strong>Pedido:</strong> #${pedido.numero_pedido}</p>
                    <p>Ya puedes proceder con la tramitación ante el IRS.</p>
                    <div align="center" style="margin-top: 20px;">
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/pedidos/${pedido.id}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Ver Pedido en Admin</a>
                    </div>
                `
            })
        } catch (err) {
            console.error('[ApproveSS4] Error notificando admin:', err)
        }

        return NextResponse.json({ success: true, message: 'Borrador aprobado exitosamente' })
    } catch (error: any) {
        console.error('Error approving SS4:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
