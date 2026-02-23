// lib/models/factura.ts

import { createClient } from '../supabase/client'
import { createAdminClient } from '../supabase/admin'
import type { Database } from '../supabase/database.types'

type FacturaRow = Database['public']['Tables']['facturas']['Row']

export class FacturaModel {
    /**
     * Crear una nueva factura
     * NOTA: El esquema real usa 'estado' (no 'estado_pago') y 'pdf_url' (no 'pdf_path').
     *       No existe 'metodo_pago' en la tabla.
     */
    static async crear(data: {
        pedidoId: string
        userId: string
        numeroFactura: string
        subtotal: number
        impuestos: number
        total: number
        estado?: 'pendiente' | 'pagada' | 'cancelada'
        metadata?: any
    }): Promise<FacturaRow | null> {
        const supabase = createAdminClient()

        const { data: factura, error } = await supabase
            .from('facturas')
            .insert({
                pedido_id: data.pedidoId,
                user_id: data.userId,
                numero_factura: data.numeroFactura,
                subtotal: data.subtotal,
                impuestos: data.impuestos,
                total: data.total,
                estado: data.estado || 'pagada',
                notas: data.metadata ? JSON.stringify(data.metadata) : null,
            } as any)
            .select('*')
            .single()

        if (error) {
            console.error('❌ Error creando factura:', error)
            return null
        }

        return factura
    }

    /**
     * Obtener factura por ID
     */
    static async obtenerPorId(facturaId: string): Promise<FacturaRow | null> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('facturas')
            .select('*')
            .eq('id', facturaId)
            .single()

        if (error) {
            console.error('❌ Error obteniendo factura:', error)
            return null
        }

        return data
    }

    /**
     * Obtener factura por pedido ID
     * Usa maybeSingle() para evitar error PGRST116 cuando no existe factura aún.
     */
    static async obtenerPorPedidoId(pedidoId: string): Promise<FacturaRow | null> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('facturas')
            .select('*')
            .eq('pedido_id', pedidoId)
            .maybeSingle()

        if (error) {
            console.error('❌ Error obteniendo factura por pedido:', error)
            return null
        }

        return data
    }

    /**
     * Listar facturas de un usuario
     */
    static async listarPorUsuario(userId: string): Promise<FacturaRow[]> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('facturas')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('❌ Error listando facturas:', error)
            return []
        }

        return data || []
    }

    /**
     * Actualizar estado de factura
     * Usa 'estado' (campo real en DB, no 'estado_pago')
     */
    static async actualizarEstadoPago(
        facturaId: string,
        estado: 'pendiente' | 'pagada' | 'cancelada',
        _fechaPago?: Date  // Mantenido por compatibilidad con llamadas existentes
    ): Promise<boolean> {
        const supabase = createAdminClient()

        const { error } = await supabase
            .from('facturas')
            .update({ estado } as any)
            .eq('id', facturaId)

        if (error) {
            console.error('❌ Error actualizando estado de factura:', error)
            return false
        }

        return true
    }

    /**
     * Generar número de factura único
     */
    static generarNumeroFactura(): string {
        const año = new Date().getFullYear()
        const timestamp = Date.now()
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
        return `INV-${año}-${timestamp}-${random}`
    }

    /**
     * Actualizar URL del PDF (campo 'pdf_url' según el esquema real de la DB)
     * Nota: El método conserva el nombre 'actualizarPdfPath' por compatibilidad.
     */
    static async actualizarPdfPath(
        facturaId: string,
        pdfUrl: string
    ): Promise<boolean> {
        const supabase = createAdminClient()

        const { error } = await supabase
            .from('facturas')
            .update({ pdf_url: pdfUrl } as any)
            .eq('id', facturaId)

        if (error) {
            console.error('❌ Error actualizando PDF URL:', error)
            return false
        }

        return true
    }
}
