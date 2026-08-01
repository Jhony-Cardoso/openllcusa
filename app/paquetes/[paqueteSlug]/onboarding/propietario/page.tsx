'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Loader2, AlertCircle } from 'lucide-react'

type PropietarioForm = {
  nombre: string
  apellidos: string
  pasaporte: string
  direccion: string
  email_personal: string
}

const INICIAL: PropietarioForm = {
  nombre: '',
  apellidos: '',
  pasaporte: '',
  direccion: '',
  email_personal: '',
}

export default function PropietarioPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user, isLoaded: isUserLoaded } = useUser()

  const paqueteSlug = (params?.paqueteSlug as string) || ''
  const pedidoId = searchParams.get('pedido')

  const [form, setForm] = useState<PropietarioForm>(INICIAL)
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
          nombre: meta.owner_name || user.firstName || '',
          apellidos: meta.owner_lastname || user.lastName || '',
          pasaporte: meta.passport || '',
          direccion: meta.owner_address || '',
          email_personal: meta.personal_email || user.emailAddresses?.[0]?.emailAddress || '',
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
    router.push(`/paquetes/${paqueteSlug}/onboarding/datos-llc?pedido=${pedidoId ?? ''}`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validar = (): string | null => {
    if (!form.nombre.trim()) return 'El nombre es obligatorio.'
    if (!form.apellidos.trim()) return 'Los apellidos son obligatorios.'
    if (!form.pasaporte.trim()) return 'El número de pasaporte (o DNI) es obligatorio.'
    if (!form.direccion.trim()) return 'La dirección es obligatoria.'
    if (!form.email_personal.trim()) return 'El email es obligatorio.'
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
          paso: 3,
          datos: {
            metadata: {
              ...existingMeta,
              owner_name: form.nombre,
              owner_lastname: form.apellidos,
              passport: form.pasaporte,
              owner_address: form.direccion,
              personal_email: form.email_personal,
            }
          },
        }),
      })

      if (!res.ok) throw new Error('Error guardando')
      
      const isCrecimiento = paqueteSlug === 'plan-crecimiento'
      const nextStep = isCrecimiento ? 'documentos' : 'revision'
      
      router.push(`/paquetes/${paqueteSlug}/onboarding/${nextStep}?pedido=${pedidoId}`)
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Paso 3 de {paqueteSlug === 'plan-crecimiento' ? '5' : '4'}</p>
        <h1 className="text-3xl font-bold text-gray-900">Datos del Propietario</h1>
        <p className="text-gray-600 mt-2">Introduce los datos del dueño principal de la LLC.</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s) *</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
              <input
                type="text"
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pasaporte o DNI *</label>
              <input
                type="text"
                name="pasaporte"
                value={form.pasaporte}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Personal *</label>
              <input
                type="email"
                name="email_personal"
                value={form.email_personal}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de residencia (Completa) *</label>
            <textarea
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              rows={3}
              placeholder="Calle, Número, Ciudad, Código Postal, País"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition resize-none"
              required
            />
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
  )
}
