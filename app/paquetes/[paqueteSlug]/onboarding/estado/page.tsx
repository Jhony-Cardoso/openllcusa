'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import type { Database } from '@/lib/supabase/database.types'
import { AlertCircle, Loader2 } from 'lucide-react'

type EstadoUsa = Database['public']['Tables']['estados_usa']['Row']

export default function EstadoPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user, isLoaded: isUserLoaded } = useUser()

  const paqueteSlug = (params?.paqueteSlug as string) || ''
  const pedidoIdFromUrl = searchParams.get('pedido')

  const [pedidoId, setPedidoId] = useState<string | null>(pedidoIdFromUrl)
  const [estados, setEstados] = useState<EstadoUsa[]>([])
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<EstadoUsa | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        if (!isUserLoaded) return

        if (!user) {
          router.push('/sign-in')
          return
        }

        let currentPedidoId = pedidoIdFromUrl

        // Si no hay ID en URL, buscar borrador vía API segura
        if (!currentPedidoId) {
          console.log('🔍 [PAQUETE ESTADO] No hay pedidoId en URL, buscando borrador...')

          const resPaquete = await fetch(`/api/paquetes?slug=${paqueteSlug}`)
          const infoPaquete = await resPaquete.json()
          const targetId = infoPaquete?.id

          if (targetId) {
            const resBorrador = await fetch(`/api/pedidos/borrador?paqueteId=${targetId}&tipo=paquete`)
            const dataBorrador = await resBorrador.json()

            if (dataBorrador?.pedido?.id) {
              currentPedidoId = dataBorrador.pedido.id
              setPedidoId(currentPedidoId)
              console.log('✅ [PAQUETE ESTADO] Borrador encontrado:', currentPedidoId)

              const newUrl = `${window.location.pathname}?pedido=${currentPedidoId}`
              window.history.replaceState({}, '', newUrl)
            }
          }
        }

        if (!currentPedidoId) {
          setError('No se encontró un pedido en curso. Por favor, vuelve al inicio del proceso.')
          setLoading(false)
          return
        }

        // Cargar estados vía API segura
        console.log('🔍 Cargando estados...')
        const resEstados = await fetch('/api/estados')
        const estadosData = await resEstados.json()
        console.log('📊 Estados obtenidos:', estadosData)

        if (Array.isArray(estadosData)) {
          setEstados(estadosData)
        } else {
          console.error('❌ Estados no es un array:', estadosData)
          setEstados([])
        }

        // Cargar pedido vía API segura
        console.log('🔍 Buscando pedido:', currentPedidoId)
        const resPedido = await fetch(`/api/pedidos/obtener?id=${currentPedidoId}`)
        const dataPedido = await resPedido.json()

        if (!resPedido.ok || !dataPedido.pedido) {
          console.error('❌ Pedido no encontrado:', dataPedido)
          setError('Pedido no encontrado. Vuelve al paso anterior.')
          setLoading(false)
          return
        }

        const pedido = dataPedido.pedido
        console.log('📦 Pedido encontrado:', pedido)

        if (pedido.estado_usa_id && estadosData) {
          const prev = estadosData.find((e: EstadoUsa) => e.id === pedido.estado_usa_id) || null
          setEstadoSeleccionado(prev)
        }
      } catch (e) {
        console.error('❌ Error en cargar():', e)
        setError('Error al cargar los datos. Por favor, recarga la página.')
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [isUserLoaded, user, pedidoIdFromUrl, paqueteSlug, router])

  const handleBack = () => {
    router.push(`/paquetes/${paqueteSlug}/onboarding?pedido=${pedidoId ?? ''}`)
  }

  const handleContinuar = async () => {
    if (!estadoSeleccionado) {
      setError('Por favor, selecciona un estado antes de continuar')
      return
    }
    if (!pedidoId) {
      setError('Falta el pedido en la URL.')
      return
    }

    setSaving(true)
    setError('')
    try {
      console.log('📤 [ESTADO] Guardando estado_usa_id:', estadoSeleccionado.id, 'para pedido:', pedidoId)

      const res = await fetch('/api/pedidos/actualizar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedidoId,
          paso: 2,
          datos: { estado_usa_id: estadoSeleccionado.id }
        })
      })

      let responseData: any = null
      try {
        responseData = await res.json()
      } catch {
        // No JSON en respuesta
      }

      console.log('📥 [ESTADO] Respuesta API:', res.status, responseData)

      if (!res.ok) {
        const mensajeError = responseData?.error || responseData?.message || `Error HTTP ${res.status}`
        console.error('❌ Error guardando estado:', mensajeError, responseData)
        setError(`Error al guardar: ${mensajeError}`)
        return
      }

      router.push(`/paquetes/${paqueteSlug}/onboarding/datos-empresa?pedido=${pedidoId}`)
    } catch (e: any) {
      console.error('💥 Excepción al guardar estado:', e)
      setError(`Error de red: ${e?.message || 'Por favor, recarga la página e inténtalo de nuevo.'}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Cargando…</span>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <button type="button" onClick={handleBack} className="text-sm text-gray-600 underline">
          ← Atrás
        </button>
        <div className="text-sm text-gray-500">Paso 2 de 5</div>
      </div>

      <h1 className="text-3xl font-bold mb-2">Selecciona el estado para tu LLC</h1>

      {error && (
        <div className="border border-red-200 bg-red-50 rounded-lg p-4 mb-6 flex gap-2 items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {estados.length === 0 && !error && (
        <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">No se encontraron estados disponibles.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {estados.map((estado) => {
          const selected = estadoSeleccionado?.id === estado.id
          return (
            <button
              key={estado.id}
              type="button"
              onClick={() => setEstadoSeleccionado(estado)}
              className={[
                'text-left border rounded-xl p-5 transition',
                selected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50',
              ].join(' ')}
            >
              <div className="font-semibold text-lg">{estado.nombre}</div>
              <div className="text-sm text-gray-500">{estado.codigo}</div>
              <div className="mt-4 text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Filing inicial</span>
                  <span>${estado.filing_inicial ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Filing anual</span>
                  <span>${estado.filing_anual ?? 0}/año</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={handleContinuar}
        disabled={saving}
        className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
      >
        {saving ? 'Guardando…' : 'Continuar al siguiente paso →'}
      </button>
    </div>
  )
}
