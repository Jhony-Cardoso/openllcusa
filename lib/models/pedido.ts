// lib/models/pedido.ts

import { createClient } from '../supabase/client'
import { createAdminClient } from '../supabase/admin'
import type { Database } from '../supabase/database.types'

type PedidoRow = Database['public']['Tables']['pedidos']['Row']
type PedidoUpdate = Database['public']['Tables']['pedidos']['Update']

export class PedidoModel {
  /**
   * Crear un nuevo pedido
   * @param userId - ID del usuario
   * @param paqueteId - ID del paquete (de la tabla paquetes)
   * @param servicioId - ID del servicio individual (opcional, de la tabla servicios)
   */
  static async crear(
    userId: string,
    paqueteId?: string,
    servicioId?: string
  ): Promise<PedidoRow | null> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('pedidos')
      .insert({
        numero_pedido: `PED-${Date.now()}`,
        user_id: userId,
        paquete_id: paqueteId || null,
        servicio_id: servicioId || null,
        estado_pedido: 'borrador',
        paso_actual: 1,
      })
      .select('*')
      .single()

    if (error) {
      console.error('Error creando pedido:', error)
      return null
    }

    return data
  }

  static async obtenerPorId(pedidoId: string): Promise<PedidoRow | null> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('id', pedidoId)
      .single()

    if (error) {
      console.error('Error obteniendo pedido:', error)
      return null
    }

    return data
  }

  static async obtenerPorUsuario(userId: string): Promise<PedidoRow[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error obteniendo pedidos del usuario:', error)
      return []
    }

    return data || []
  }

  // Para Revisión/Checkout: devuelve pedido + paquete + estado_usa
  // Hacemos consultas separadas porque el join no funciona correctamente
  static async obtenerCompleto(pedidoId: string, isAdmin: boolean = false) {
    const supabase = isAdmin ? createAdminClient() : createClient()

    console.log('🔍 [MODELO] Buscando pedido completo:', pedidoId)

    // 1. Obtener el pedido base
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .select('*')
      .eq('id', pedidoId)
      .single()

    if (pedidoError || !pedido) {
      console.error('❌ [MODELO] Error obteniendo pedido:', pedidoError)
      return null
    }

    console.log('📦 [MODELO] Pedido base obtenido:', pedido)

    // 2. Obtener el paquete si existe
    let paquete = null
    if (pedido.paquete_id) {
      const { data: paqueteData, error: paqueteError } = await supabase
        .from('paquetes')
        .select('*')
        .eq('id', pedido.paquete_id)
        .single()

      if (!paqueteError && paqueteData) {
        paquete = paqueteData
        console.log('📦 [MODELO] Paquete obtenido:', paquete)
      }
    }

    // 3. Obtener el servicio si existe
    let servicio = null
    if (pedido.servicio_id) {
      const { data: servicioData, error: servicioError } = await supabase
        .from('servicios')
        .select('*')
        .eq('id', pedido.servicio_id)
        .single()

      if (!servicioError && servicioData) {
        servicio = servicioData
        console.log('📦 [MODELO] Servicio obtenido:', servicio)
      }
    }

    // 4. Obtener el estado USA si existe
    let estado_usa = null
    if (pedido.estado_usa_id) {
      const { data: estadoData, error: estadoError } = await supabase
        .from('estados_usa')
        .select('*')
        .eq('id', pedido.estado_usa_id)
        .single()

      if (!estadoError && estadoData) {
        estado_usa = estadoData
        console.log('📍 [MODELO] Estado USA obtenido:', estado_usa)
      }
    }

    // 5. Combinar todo
    const resultado = {
      ...pedido,
      paquete,
      servicio,
      estado_usa
    }

    console.log('✅ [MODELO] Pedido completo obtenido:', resultado)
    return resultado
  }

  static async actualizarPaso(
    pedidoId: string,
    paso: number,
    datos: Partial<PedidoUpdate> = {}
  ): Promise<boolean> {
    const supabase = createClient()

    const { error } = await supabase
      .from('pedidos')
      .update({
        paso_actual: paso,
        ...datos,
      })
      .eq('id', pedidoId)

    if (error) {
      console.error('Error actualizando paso:', error)
      return false
    }

    return true
  }

  static async guardarEstado(pedidoId: string, estadoUsaId: string): Promise<boolean> {
    return this.actualizarPaso(pedidoId, 2, { estado_usa_id: estadoUsaId })
  }

  static async guardarDatosEmpresa(
    pedidoId: string,
    datos: {
      nombre_empresa: string
      sector: string
      descripcion_negocio: string
      num_socios: number
      ingresos_estimados: string
      email_empresa: string
      codigo_pais: string
      telefono_empresa: string
    }
  ): Promise<boolean> {
    return this.actualizarPaso(pedidoId, 3, {
      ...datos,
      estado_pedido: 'datos_completos',
    })
  }

  // NUEVO: Guardar datos legales del checklist en metadata
  static async guardarDatosLegales(
    pedidoId: string,
    datosLegales: any
  ): Promise<boolean> {
    const supabase = createAdminClient()

    // 1. Obtener los datos actuales para no sobreescribir otros campos de metadata (como documentos)
    const { data: currentPedido } = await supabase
      .from('pedidos')
      .select('metadata')
      .eq('id', pedidoId)
      .single()

    const currentMetadata = (currentPedido?.metadata as any) || {}

    const { error } = await supabase
      .from('pedidos')
      .update({
        metadata: {
          ...currentMetadata,
          ...datosLegales
        },
        paso_actual: 7, // Hito de configuración legal completada
      } as any)
      .eq('id', pedidoId)

    if (error) {
      console.error('Error guardando datos legales:', error)
      return false
    }

    return true
  }

  // NUEVO: marcar pedido como pagado (Opción B)
  static async marcarComoPagado(
    pedidoId: string,
    opts: {
      payment_intent_id?: string
      session_id?: string
      customer_id?: string
      amount?: number
    }
  ): Promise<boolean> {
    const patch: Partial<PedidoUpdate> = {
      estado_pedido: 'pagado',
      total_pagado: opts.amount ?? null,
      stripe_payment_intent_id: opts.payment_intent_id ?? null,
      stripe_session_id: opts.session_id ?? null,
      stripe_customer_id: opts.customer_id ?? null,
    }

    // paso_actual: lo dejamos igual, o lo ponemos en 6 si lo prefieres
    // patch.paso_actual = 6

    return this.actualizarPaso(pedidoId, 6, patch)
  }

  // NUEVO: Listar todos los pedidos (Solo Admin)
  static async listarTodosAdmin(): Promise<any[]> {
    const supabase = createAdminClient()

    // 1. Obtener todos los pedidos
    const { data: pedidos, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ [ADMIN] Error listando pedidos:', error.message || error)
      return []
    }

    if (!pedidos) return []

    // 2. Enriquecer con datos relacionados manualmente para evitar fallos de joins
    const enrichedPedidos = await Promise.all(pedidos.map(async (p) => {
      let paquetes = null
      let servicios = null
      let estados_usa = null

      if (p.paquete_id) {
        const { data } = await supabase.from('paquetes').select('nombre').eq('id', p.paquete_id).single()
        paquetes = data
      }
      if (p.servicio_id) {
        const { data } = await supabase.from('servicios').select('nombre').eq('id', p.servicio_id).single()
        servicios = data
      }
      if (p.estado_usa_id) {
        const { data } = await supabase.from('estados_usa').select('nombre, codigo').eq('id', p.estado_usa_id).single()
        estados_usa = data
      }

      return {
        ...p,
        paquetes,
        servicios,
        estados_usa
      }
    }))

    return enrichedPedidos
  }
}
