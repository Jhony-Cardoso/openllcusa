// lib/models/suscripcion.ts

import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type SuscripcionRow = Database['public']['Tables']['suscripciones']['Row']
type SuscripcionInsert = Database['public']['Tables']['suscripciones']['Insert']
type SuscripcionUpdate = Database['public']['Tables']['suscripciones']['Update']

export class SuscripcionModel {
  static async upsertPorStripeSubscriptionId(
    stripeSubscriptionId: string,
    patch: Partial<SuscripcionInsert> & { user_id: string }
  ): Promise<SuscripcionRow | null> {
    const supabase = createClient()

    const payload: SuscripcionInsert = {
      user_id: patch.user_id,
      pedido_id: patch.pedido_id ?? null,
      servicio_id: patch.servicio_id ?? null,
      estado: patch.estado ?? 'active',
      stripe_customer_id: patch.stripe_customer_id ?? null,
      stripe_subscription_id: stripeSubscriptionId,
      stripe_price_id: patch.stripe_price_id ?? null,
      cancel_at_period_end: patch.cancel_at_period_end ?? false,
      current_period_start: patch.current_period_start ?? null,
      current_period_end: patch.current_period_end ?? null,
      canceled_at: patch.canceled_at ?? null,
    }

    const { data, error } = await supabase
      .from('suscripciones')
      .upsert(payload, { onConflict: 'stripe_subscription_id' })
      .select('*')
      .single()

    if (error) {
      console.error('Error upsert suscripción:', error)
      return null
    }

    return data
  }

  static async obtenerPorUserId(userId: string): Promise<SuscripcionRow[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('suscripciones')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error obteniendo suscripciones:', error)
      return []
    }

    return data || []
  }

  static async obtenerPorIdParaUsuario(id: string, userId: string): Promise<SuscripcionRow | null> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('suscripciones')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error obteniendo suscripción:', error)
      return null
    }

    return data
  }

  static async actualizar(id: string, patch: Partial<SuscripcionUpdate>): Promise<boolean> {
    const supabase = createClient()

    const { error } = await supabase.from('suscripciones').update(patch).eq('id', id)

    if (error) {
      console.error('Error actualizando suscripción:', error)
      return false
    }

    return true
  }
}
