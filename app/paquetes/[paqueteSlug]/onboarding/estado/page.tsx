'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { EstadoUsaModel } from '@/lib/models/estado-usa'
import { PedidoModel } from '@/lib/models/pedido'
import type { Database } from '@/lib/supabase/database.types'
import { AlertCircle, Loader2 } from 'lucide-react'

type EstadoUsa = Database['public']['Tables']['estados_usa']['Row']

export default function EstadoPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user, isLoaded: isUserLoaded } = useUser()

  const slug = (params?.slug as string) || ''
  const pedidoId = searchParams.get('pedido')

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

        if (!pedidoId) {
          setError('Falta el parámetro ?pedido= en la URL. Vuelve al paso anterior.')
          return
        }

        const estadosData = await EstadoUsaModel.obtenerTodos()
        setEstados(estadosData)

        const pedido = await PedidoModel.obtenerPorId(pedidoId)
        if (!pedido) {
          setError('Pedido no encontrado. Vuelve al paso anterior.')
          return
        }

        if (pedido.user_id !== user.id) {
          setError('No tienes permisos para acceder a este pedido.')
          return
        }

        if (pedido.estado_usa_id) {
          const prev = estadosData.find((e) => e.id === pedido.estado_usa_id) || null
          setEstadoSeleccionado(prev)
        }
      } catch (e) {
        console.error(e)
        setError('Error al cargar los datos. Por favor, recarga la página.')
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [isUserLoaded, user, pedidoId, router])

  const handleBack = () => {
    router.push(`/servicios/${slug}/onboarding?pedido=${pedidoId ?? ''}`)
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
      const ok = await PedidoModel.guardarEstado(pedidoId, estadoSeleccionado.id)
      if (!ok) {
        setError('Error al guardar el estado. Inténtalo de nuevo.')
        return
      }
      router.push(`/servicios/${slug}/onboarding/datos-empresa?pedido=${pedidoId}`)
    } catch (e) {
      console.error(e)
      setError('Error al guardar. Por favor, inténtalo de nuevo.')
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
