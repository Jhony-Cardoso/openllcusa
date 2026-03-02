import { createAdminClient } from '@/lib/supabase/admin'

export interface CrearNotificacionParams {
    userId: string
    pedidoId?: string
    tipo: 'pago_exitoso' | 'pedido_completado' | 'documento_listo' | 'actualizacion_pedido' | 'bienvenida'
    titulo: string
    mensaje: string
    url?: string
}

export class NotificacionService {
    /**
     * Crear una nueva notificación
     */
    static async crear(params: CrearNotificacionParams) {
        try {
            const { userId, pedidoId, tipo, titulo, mensaje, url } = params

            const supabaseAdmin = createAdminClient()
            const { data, error } = await supabaseAdmin
                .from('notificaciones')
                .insert({
                    user_id: userId,
                    pedido_id: pedidoId || null,
                    tipo,
                    titulo,
                    mensaje,
                    url: url || null,
                    leido: false,
                })
                .select()
                .single()

            if (error) {
                console.error('❌ Error creando notificación:', error)
                return { success: false, error }
            }

            console.log('✅ Notificación creada:', data.id)
            return { success: true, data }
        } catch (error) {
            console.error('💥 Excepción creando notificación:', error)
            return { success: false, error }
        }
    }

    /**
     * Crear notificación de pago exitoso
     */
    static async notificarPagoExitoso(userId: string, pedidoId: string, nombreServicio: string, monto: number) {
        return this.crear({
            userId,
            pedidoId,
            tipo: 'pago_exitoso',
            titulo: '¡Pago confirmado! 🎉',
            mensaje: `Tu pago de $${monto.toFixed(2)} USD por "${nombreServicio}" ha sido procesado exitosamente.`,
            url: `/dashboard/pedidos/${pedidoId}`,
        })
    }

    /**
     * Crear notificación de pedido completado
     */
    static async notificarPedidoCompletado(userId: string, pedidoId: string, nombreServicio: string) {
        return this.crear({
            userId,
            pedidoId,
            tipo: 'pedido_completado',
            titulo: '✅ Pedido completado',
            mensaje: `Tu pedido "${nombreServicio}" ha sido completado. Ya puedes descargar tus documentos.`,
            url: `/dashboard/pedidos/${pedidoId}`,
        })
    }

    /**
     * Crear notificación de documento listo
     */
    static async notificarDocumentoListo(userId: string, pedidoId: string, nombreDocumento: string) {
        return this.crear({
            userId,
            pedidoId,
            tipo: 'documento_listo',
            titulo: '📄 Documento disponible',
            mensaje: `El documento "${nombreDocumento}" está listo para descargar.`,
            url: `/dashboard/documentos`,
        })
    }

    /**
     * Crear notificación de bienvenida
     */
    static async notificarBienvenida(userId: string, nombreUsuario: string) {
        return this.crear({
            userId,
            tipo: 'bienvenida',
            titulo: `¡Bienvenido, ${nombreUsuario}! 👋`,
            mensaje: 'Gracias por unirte a Open LLC USA. Estamos aquí para ayudarte a formar tu empresa en Estados Unidos.',
            url: '/dashboard',
        })
    }

    /**
     * Marcar notificación como leída
     */
    static async marcarComoLeida(notificacionId: string, userId: string) {
        try {
            const supabaseAdmin = createAdminClient()
            const { error } = await supabaseAdmin
                .from('notificaciones')
                .update({ leido: true, updated_at: new Date().toISOString() })
                .eq('id', notificacionId)
                .eq('user_id', userId)

            if (error) {
                console.error('❌ Error marcando notificación como leída:', error)
                return { success: false, error }
            }

            return { success: true }
        } catch (error) {
            console.error('💥 Excepción marcando notificación:', error)
            return { success: false, error }
        }
    }

    /**
     * Marcar todas las notificaciones como leídas
     */
    static async marcarTodasComoLeidas(userId: string) {
        try {
            const supabaseAdmin = createAdminClient()
            const { error } = await supabaseAdmin
                .from('notificaciones')
                .update({ leido: true, updated_at: new Date().toISOString() })
                .eq('user_id', userId)
                .eq('leido', false)

            if (error) {
                console.error('❌ Error marcando todas las notificaciones:', error)
                return { success: false, error }
            }

            return { success: true }
        } catch (error) {
            console.error('💥 Excepción marcando notificaciones:', error)
            return { success: false, error }
        }
    }

    /**
     * Obtener notificaciones de un usuario
     */
    static async obtenerPorUsuario(userId: string, limite: number = 10) {
        try {
            const supabaseAdmin = createAdminClient()
            const { data, error } = await supabaseAdmin
                .from('notificaciones')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limite)

            if (error) {
                console.error('❌ Error obteniendo notificaciones:', error)
                return { success: false, error, data: [] }
            }

            return { success: true, data: data || [] }
        } catch (error) {
            console.error('💥 Excepción obteniendo notificaciones:', error)
            return { success: false, error, data: [] }
        }
    }

    /**
     * Contar notificaciones no leídas
     */
    static async contarNoLeidas(userId: string) {
        try {
            const supabaseAdmin = createAdminClient()
            const { count, error } = await supabaseAdmin
                .from('notificaciones')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('leido', false)

            if (error) {
                console.error('❌ Error contando notificaciones:', error)
                return { success: false, error, count: 0 }
            }

            return { success: true, count: count || 0 }
        } catch (error) {
            console.error('💥 Excepción contando notificaciones:', error)
            return { success: false, error, count: 0 }
        }
    }
}
