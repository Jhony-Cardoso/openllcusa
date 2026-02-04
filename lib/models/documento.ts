// lib/models/documento.ts

import { createClient } from '../supabase/client'
import type { Database } from '../supabase/database.types'

type DocumentoRow = Database['public']['Tables']['documentos']['Row']

export class DocumentoModel {
    static async obtenerPorUsuario(userId: string): Promise<DocumentoRow[]> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('documentos')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error obteniendo documentos del usuario:', error)
            return []
        }

        return data || []
    }

    static async obtenerPorPedido(pedidoId: string): Promise<DocumentoRow[]> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('documentos')
            .select('*')
            .eq('pedido_id', pedidoId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error obteniendo documentos del pedido:', error)
            return []
        }

        return data || []
    }
}
