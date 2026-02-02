import { EmailService } from '@/lib/services/email.service'
import { NotificacionService } from '@/lib/services/notificacion.service'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

/**
 * Ruta de prueba para enviar emails y verificar notificaciones
 * 
 * Uso:
 * GET /api/test-email?to=tu-email@gmail.com&tipo=bienvenida
 * GET /api/test-email?to=tu-email@gmail.com&tipo=confirmacion
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const to = searchParams.get('to')
        const tipo = searchParams.get('tipo') || 'bienvenida'

        // Intentar obtener usuario real, si no, usar uno de prueba para logs
        const { userId } = await auth()
        const targetUserId = userId || 'user_prueba_manual'

        if (!to) {
            return NextResponse.json(
                { error: 'Parámetro "to" requerido. Ejemplo: ?to=tu-email@gmail.com' },
                { status: 400 }
            )
        }

        if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('TU_API_KEY')) {
            return NextResponse.json(
                { error: 'RESEND_API_KEY no configurada correctamente en .env.local' },
                { status: 500 }
            )
        }

        let emailResult
        let notifResult

        if (tipo === 'bienvenida') {
            // 1. Enviar email
            emailResult = await EmailService.enviarBienvenida({
                to,
                nombreUsuario: 'Usuario de Prueba'
            })

            // 2. Crear notificación
            notifResult = await NotificacionService.notificarBienvenida(
                targetUserId,
                'Usuario de Prueba'
            )

        } else if (tipo === 'confirmacion') {
            const pedidoId = 'test-' + Date.now()

            // 1. Enviar email
            emailResult = await EmailService.enviarConfirmacionPago({
                to,
                nombreUsuario: 'Usuario de Prueba',
                nombreServicio: 'Obtención de EIN (Test)',
                montoPagado: 197.00,
                pedidoId: pedidoId,
                fechaPago: new Date().toISOString()
            })

            // 2. Crear notificación
            notifResult = await NotificacionService.notificarPagoExitoso(
                targetUserId,
                pedidoId,
                'Obtención de EIN (Test)',
                197.00
            )
        } else {
            return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
        }

        return NextResponse.json({
            success: emailResult.success && notifResult.success,
            email: {
                enviado: emailResult.success,
                id: emailResult.data?.id,
                error: emailResult.error
            },
            notificacion: {
                creada: notifResult.success,
                id: notifResult.data?.id,
                error: notifResult.error,
                userId: targetUserId
            },
            mensaje: 'Prueba completada. Revisa tu email y la tabla de notificaciones.'
        })

    } catch (error) {
        console.error('Error en test:', error)
        return NextResponse.json(
            { error: 'Error interno', detalles: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
