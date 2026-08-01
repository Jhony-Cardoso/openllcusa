'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Loader2, AlertCircle } from 'lucide-react'

type DatosLLCForm = {
  nombre_empresa: string
  estado_formacion: string
  ein: string
  fecha_formacion: string
}

const INICIAL: DatosLLCForm = {
  nombre_empresa: '',
  estado_formacion: '',
  ein: '',
  fecha_formacion: '',
}

export default function DatosLLCPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user, isLoaded: isUserLoaded } = useUser()

  const paqueteSlug = (params?.paqueteSlug as string) || ''
  const pedidoId = searchParams.get('pedido')

  const [form, setForm] = useState<DatosLLCForm>(INICIAL)
  const [estados, setEstados] = useState<any[]>([])
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
          setError('No se encontró un pedido en curso.')
          setLoading(false)
          return
        }

        // Cargar estados
        const resEstados = await fetch('/api/estados')
        const dataEstados = await resEstados.json()
        if (Array.isArray(dataEstados)) setEstados(dataEstados)

        // Cargar pedido
        const resPedido = await fetch(`/api/pedidos/obtener?id=${pedidoId}`)
        const dataPedido = await resPedido.json()

        if (!resPedido.ok || !dataPedido.pedido) {
          setError('Pedido no encontrado.')
          setLoading(false)
          return
        }

        const pedido = dataPedido.pedido
        const meta = pedido.metadata || {}

        setForm({
          nombre_empresa: pedido.nombre_empresa || '',
          estado_formacion: meta.estado_formacion || '',
          ein: meta.ein || '',
          fecha_formacion: meta.fecha_formacion || '',
        })
      } catch (e) {
        setError('Error al cargar los datos.')
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [isUserLoaded, user, pedidoId, router])

  const handleBack = () => {
    router.push(`/paquetes/${paqueteSlug}/onboarding?pedido=${pedidoId ?? ''}`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validar = (): string | null => {
    if (!form.nombre_empresa.trim()) return 'El nombre de la LLC es obligatorio.'
    if (!form.estado_formacion.trim()) return 'Debes seleccionar el estado donde formaste tu LLC.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const msg = validar()
    if (msg) {
      setError(msg)
      return
    }

    if (!pedidoId) return

    setSaving(true)
    try {
      const resPedido = await fetch(`/api/pedidos/obtener?id=${pedidoId}`)
      const dataPedido = await resPedido.json()
      const existingMeta = dataPedido.pedido?.metadata || {}

      const res = await fetch('/api/pedidos/actualizar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedidoId,
          paso: 2,
          datos: {
            nombre_empresa: form.nombre_empresa,
            metadata: {
              ...existingMeta,
              estado_formacion: form.estado_formacion,
              ein: form.ein,
              fecha_formacion: form.fecha_formacion,
            }
          },
        }),
      })

      if (!res.ok) throw new Error('Error guardando')
      
      // Siguiente paso: propietario
      router.push(`/paquetes/${paqueteSlug}/onboarding/propietario?pedido=${pedidoId}`)
    } catch (err) {
      setError('Error al guardar. Inténtalo de nuevo.')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="bg-slate-100 min-h-screen py-12">
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Paso 2 de 4</p>
        <h1 className="text-3xl font-bold text-gray-900">Datos de tu LLC</h1>
        <p className="text-gray-600 mt-2">Necesitamos la información básica de la LLC que ya tienes registrada.</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre exacto de tu LLC *</label>
            <input
              type="text"
              name="nombre_empresa"
              value={form.nombre_empresa}
              onChange={handleChange}
              placeholder="Ej: Mi Empresa LLC"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado de formación *</label>
            <select
              name="estado_formacion"
              value={form.estado_formacion}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition bg-white"
              required
            >
              <option value="">Selecciona un estado...</option>
              {estados.map((est) => (
                <option key={est.codigo} value={est.codigo}>{est.nombre} ({est.codigo})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número EIN (Opcional)</label>
              <input
                type="text"
                name="ein"
                value={form.ein}
                onChange={handleChange}
                placeholder="12-3456789"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-1">Si ya lo tienes, inclúyelo.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de formación (Aprox.)</label>
              <input
                type="date"
                name="fecha_formacion"
                value={form.fecha_formacion}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={saving}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition disabled:opacity-50"
            >
              Atrás
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition flex items-center gap-2 disabled:opacity-70"
            >
              {saving ? (
                <>Guardando <Loader2 className="animate-spin h-5 w-5" /></>
              ) : (
                'Continuar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  )
}
