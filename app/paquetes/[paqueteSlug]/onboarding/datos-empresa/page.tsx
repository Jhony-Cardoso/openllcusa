'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { PedidoModel } from '@/lib/models/pedido'
import { Loader2, AlertCircle } from 'lucide-react'

type DatosEmpresaForm = {
  nombre_empresa: string
  sector: string
  descripcion_negocio: string
  num_socios: number
  ingresos_estimados: string
  email_empresa: string
  telefono_empresa: string
}

const INICIAL: DatosEmpresaForm = {
  nombre_empresa: '',
  sector: '',
  descripcion_negocio: '',
  num_socios: 1,
  ingresos_estimados: '',
  email_empresa: '',
  telefono_empresa: '',
}

export default function DatosEmpresaPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user, isLoaded: isUserLoaded } = useUser()

  const slug = (params?.slug as string) || ''
  const pedidoId = searchParams.get('pedido')

  const [form, setForm] = useState<DatosEmpresaForm>(INICIAL)
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
          setError('No se ha encontrado el pedido. Vuelve al paso anterior.')
          return
        }

        const pedido = await PedidoModel.obtenerPorId(pedidoId)
        if (!pedido) {
          setError('No se ha encontrado el pedido en la base de datos.')
          return
        }

        if (pedido.user_id !== user.id) {
          setError('No tienes permisos para acceder a este pedido.')
          return
        }

        setForm({
          nombre_empresa: pedido.nombre_empresa || '',
          sector: pedido.sector || '',
          descripcion_negocio: pedido.descripcion_negocio || '',
          num_socios: pedido.num_socios || 1,
          ingresos_estimados: pedido.ingresos_estimados || '',
          email_empresa: pedido.email_empresa || user.emailAddresses?.[0]?.emailAddress || '',
          telefono_empresa: pedido.telefono_empresa || '',
        })
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
    router.push(`/servicios/${slug}/onboarding/estado?pedido=${pedidoId ?? ''}`)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'num_socios' ? Number(value) || 0 : value,
    }))
  }

  const validar = (): string | null => {
    if (!form.nombre_empresa.trim()) return 'El nombre de la empresa es obligatorio.'
    if (!form.sector.trim()) return 'El sector es obligatorio.'
    if (!form.descripcion_negocio.trim()) return 'La descripción del negocio es obligatoria.'
    if (!form.email_empresa.trim()) return 'El email de la empresa es obligatorio.'
    if (!form.telefono_empresa.trim()) return 'El teléfono de la empresa es obligatorio.'
    if (form.num_socios <= 0) return 'El número de socios debe ser al menos 1.'
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

    if (!pedidoId) {
      setError('No se ha encontrado el pedido. Vuelve al paso anterior.')
      return
    }

    setSaving(true)
    try {
      const ok = await PedidoModel.guardarDatosEmpresa(pedidoId, form)
      if (!ok) {
        setError('Error al guardar los datos de la empresa. Inténtalo de nuevo.')
        return
      }

      router.push(`/servicios/${slug}/onboarding/revision?pedido=${pedidoId}`)
    } catch (e) {
      console.error(e)
      setError('Error al guardar los datos. Por favor, inténtalo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Cargando datos de tu empresa…</span>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <button type="button" onClick={handleBack} className="text-sm text-gray-600 underline">
          ← Atrás
        </button>
        <div className="text-sm text-gray-500">Paso 3 de 5</div>
      </div>

      <h1 className="text-3xl font-bold mb-2">Datos de tu empresa</h1>

      {error && (
        <div className="border border-red-200 bg-red-50 rounded-lg p-4 mb-6 flex gap-2 items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="text-red-800">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre de la empresa</label>
          <input
            name="nombre_empresa"
            value={form.nombre_empresa}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sector</label>
          <input name="sector" value={form.sector} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción del negocio</label>
          <textarea
            name="descripcion_negocio"
            value={form.descripcion_negocio}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Número de socios</label>
          <input name="num_socios" type="number" min={1} value={form.num_socios} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ingresos estimados</label>
          <input name="ingresos_estimados" value={form.ingresos_estimados} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="email_empresa" type="email" value={form.email_empresa} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input name="telefono_empresa" value={form.telefono_empresa} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        >
          {saving ? 'Guardando…' : 'Continuar a revisión →'}
        </button>
      </form>
    </div>
  )
}
