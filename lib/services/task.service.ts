import { supabaseAdmin } from '@/lib/supabase-admin'
import { EmailService } from './email.service'

export type TareaTipo = 'tramite_ein' | 'formacion_llc' | 'tramite_boi' | 'otro'
export type TareaEstado = 'pendiente' | 'en_proceso' | 'esperando_cliente' | 'completado'
export type TareaPrioridad = 'baja' | 'normal' | 'alta' | 'urgente'

interface CrearTareaParams {
    pedidoId: string
    tipo: TareaTipo
    descripcion?: string
    prioridad?: TareaPrioridad
    metadata?: any
}

export class TaskService {
    /**
     * Crea una nueva tarea administrativa
     */
    static async crear(params: CrearTareaParams) {
        try {
            const { pedidoId, tipo, descripcion, prioridad = 'normal', metadata = {} } = params

            const { data, error } = await supabaseAdmin
                .from('tareas')
                .insert({
                    pedido_id: pedidoId,
                    tipo,
                    descripcion,
                    prioridad,
                    estado: 'pendiente',
                    metadata
                })
                .select()
                .single()

            if (error) throw error

            console.log(`✅ Tarea creada: [${tipo}] para pedido ${pedidoId}`)
            return { success: true, data }
        } catch (error) {
            console.error('❌ Error creando tarea:', error)
            return { success: false, error }
        }
    }

    /**
     * Genera las tareas necesarias automáticamente según el servicio comprado
     */
    static async generarTareasPorPedido(pedido: any) {
        // pedido debe incluir la relación con 'servicios' (pedido.servicios.slug)
        const servicioSlug = pedido.servicios?.slug
        const servicioNombre = pedido.servicios?.nombre
        const clienteNombre = pedido.nombre_empresa || 'Cliente' // O buscar nombre de usuario

        console.log(`🔄 Generando tareas para servicio: ${servicioSlug}`)

        const tareasCreadas = []

        try {
            if (servicioSlug === 'obtencion-ein') {
                // Tarea 1: Tramitar SS-4
                const t1 = await this.crear({
                    pedidoId: pedido.id,
                    tipo: 'tramite_ein',
                    descripcion: `Tramitar EIN para: ${pedido.nombre_empresa || 'Empresa sin nombre'}. Cliente pagó EIN Only.`,
                    prioridad: 'alta'
                })
                tareasCreadas.push(t1)

            } else if (servicioSlug === 'formacion-llc' || servicioSlug === 'formacion-llc-premium') {
                // Tarea 1: Verificar disponibilidad de nombre
                const t1 = await this.crear({
                    pedidoId: pedido.id,
                    tipo: 'formacion_llc',
                    descripcion: `1. Verificar disponibilidad de nombre: ${pedido.nombre_empresa}`,
                    prioridad: 'urgente'
                })
                tareasCreadas.push(t1)

                // Tarea 2: Redactar Articles of Organization
                const t2 = await this.crear({
                    pedidoId: pedido.id,
                    tipo: 'formacion_llc',
                    descripcion: `2. Redactar y enviar Articles of Organization al estado`
                })
                tareasCreadas.push(t2)

                // Tarea 3: EIN (subtarea)
                const t3 = await this.crear({
                    pedidoId: pedido.id,
                    tipo: 'tramite_ein',
                    descripcion: `3. Tramitar EIN una vez aprobada la LLC`
                })
                tareasCreadas.push(t3)

            } else {
                // Tarea genérica por defecto
                const tDefault = await this.crear({
                    pedidoId: pedido.id,
                    tipo: 'otro',
                    descripcion: `Revisar nuevo pedido de: ${servicioNombre}`,
                    prioridad: 'normal'
                })
                tareasCreadas.push(tDefault)
            }

            // Notificar al equipo administrativo
            await EmailService.notificarEquipo({
                tipo: 'nuevo_pedido',
                pedidoId: pedido.id,
                nombreServicio: servicioNombre,
                cliente: pedido.user_id, // Idealmente buscaríamos el email/nombre real
                monto: pedido.total_pagado || 0
            })

            return { success: true, tareas: tareasCreadas }

        } catch (error) {
            console.error('❌ Error generando tareas automáticas:', error)
            return { success: false, error }
        }
    }
}
