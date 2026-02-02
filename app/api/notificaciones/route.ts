import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { NotificacionService } from '@/lib/services/notificacion.service'

export async function GET(request: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const limite = parseInt(searchParams.get('limite') || '10')

        const result = await NotificacionService.obtenerPorUsuario(userId, limite)

        if (!result.success) {
            return NextResponse.json(
                { error: 'Error obteniendo notificaciones' },
                { status: 500 }
            )
        }

        return NextResponse.json(result.data)
    } catch (error) {
        console.error('Error en API de notificaciones:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

export async function PATCH(request: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const body = await request.json()
        const { notificacionId, marcarTodasComoLeidas } = body

        if (marcarTodasComoLeidas) {
            const result = await NotificacionService.marcarTodasComoLeidas(userId)

            if (!result.success) {
                return NextResponse.json(
                    { error: 'Error marcando notificaciones' },
                    { status: 500 }
                )
            }

            return NextResponse.json({ success: true })
        }

        if (notificacionId) {
            const result = await NotificacionService.marcarComoLeida(notificacionId, userId)

            if (!result.success) {
                return NextResponse.json(
                    { error: 'Error marcando notificación' },
                    { status: 500 }
                )
            }

            return NextResponse.json({ success: true })
        }

        return NextResponse.json(
            { error: 'Parámetros inválidos' },
            { status: 400 }
        )
    } catch (error) {
        console.error('Error en API de notificaciones:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
