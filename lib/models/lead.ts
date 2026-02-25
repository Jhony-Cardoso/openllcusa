// @ts-nocheck
// lib/models/lead.ts
import { createAdminClient } from '../supabase/admin'

export interface LeadData {
    nombre: string
    email: string
    telefono?: string
    situacion: string
    metadata?: any
}

export class LeadModel {
    /**
     * Guarda un nuevo prospecto (lead) en la base de datos
     */
    static async registrar(data: LeadData) {
        try {
            const supabase = createAdminClient()

            // @ts-ignore - La tabla leads existe pero puede no estar en los tipos generados
            const { data: lead, error } = await supabase
                .from('leads' as any)
                .insert([{
                    nombre: data.nombre,
                    email: data.email,
                    telefono: data.telefono,
                    situacion: data.situacion,
                    metadata: data.metadata || {},
                    created_at: new Date().toISOString()
                }])
                .select()
                .single()

            if (error) {
                console.error('❌ [LeadModel] Error al registrar lead:', error)
                return { success: false, error }
            }

            return { success: true, lead }
        } catch (error) {
            console.error('💥 [LeadModel] Excepción:', error)
            return { success: false, error }
        }
    }

    /**
     * Actualiza un lead existente
     */
    static async actualizar(id: string, data: Partial<LeadData & { score?: number }>) {
        try {
            const supabase = createAdminClient()

            const { data: lead, error } = await supabase
                .from('leads')
                .update({
                    ...data,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return { success: true, lead }
        } catch (error) {
            console.error('❌ [LeadModel] Error al actualizar lead:', error)
            return { success: false, error }
        }
    }

    /**
     * Obtener los últimos leads (para el panel de admin)
     */
    static async obtenerRecientes(limit = 50) {
        const supabase = createAdminClient()
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) return []
        return data || []
    }
}
