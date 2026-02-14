// lib/models/factura.ts

import { createClient } from '../supabase/client'
import { createAdminClient } from '../supabase/admin'
import type { Database } from '../supabase/database.types'

type FacturaRow = Database['public']['Tables']['facturas']['Row']
type FacturaInsert = Database['public']['Tables']['facturas']['Insert']

export class FacturaModel {
    /**
     * Crear una nueva factura
     */
    static async crear(data: {
        pedidoId: string
        userId: string
        numeroFactura: string
        subtotal: number
        impuestos: number
        total: number
        metodoPago: string
        estadoPago: 'pendiente' | 'pagada' | 'cancelada'
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
                metodo_pago: data.metodoPago,
                estado_pago: data.estadoPago,
                metadata: data.metadata || {},
            })
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
     */
    static async obtenerPorPedidoId(pedidoId: string): Promise<FacturaRow | null> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('facturas')
            .select('*')
            .eq('pedido_id', pedidoId)
            .single()

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
     * Actualizar estado de pago
     */
    static async actualizarEstadoPago(
        facturaId: string,
        estadoPago: 'pendiente' | 'pagada' | 'cancelada',
        fechaPago?: Date
    ): Promise<boolean> {
        const supabase = createAdminClient()

        const updateData: any = {
            estado_pago: estadoPago,
        }

        if (fechaPago) {
            updateData.fecha_pago = fechaPago.toISOString()
        }

        const { error } = await supabase
            .from('facturas')
            .update(updateData)
            .eq('id', facturaId)

        if (error) {
            console.error('❌ Error actualizando estado de pago:', error)
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
     * Actualizar ruta del PDF
     */
    static async actualizarPdfPath(
        facturaId: string,
        pdfPath: string
    ): Promise<boolean> {
        const supabase = createAdminClient()

        const { error } = await supabase
            .from('facturas')
            .update({ pdf_path: pdfPath })
            .eq('id', facturaId)

        if (error) {
            console.error('❌ Error actualizando PDF path:', error)
            return false
        }

        return true
    }
}
