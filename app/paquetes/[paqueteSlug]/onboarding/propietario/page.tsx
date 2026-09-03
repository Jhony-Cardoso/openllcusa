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
  email_corporativo: string
  // Wyoming Communications Contact
  es_mismo_contacto_wy: boolean
  wy_contacto_nombre: string
  wy_contacto_direccion: string
  wy_contacto_telefono: string
}

const INICIAL: PropietarioForm = {
  nombre: '',
  apellidos: '',
  pasaporte: '',
  direccion: '',
  email_personal: '',
  email_corporativo: '',
  es_mismo_contacto_wy: true,
  wy_contacto_nombre: '',
  wy_contacto_direccion: '',
  wy_contacto_telefono: '',
}

export default function PropietarioPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user, isLoaded: isUserLoaded } = useUser()

  const paqueteSlug = (params?.paqueteSlug as string) || ''
  const pedidoIdFromUrl = searchParams.get('pedido')

  const [form, setForm] = useState<PropietarioForm>(INICIAL)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [esWyoming, setEsWyoming] = useState(false)

  useEffect(() => {
    async function cargar() {
      try {
        if (!isUserLoaded) return

        if (!user) {
          router.push('/sign-in')
          return
        }

        let pedidoId = pedidoIdFromUrl

        // Si no hay ID en URL, buscar el borrador del usuario en Supabase
        if (!pedidoId) {
          console.log('🔍 [PAQUETE PROPIETARIO] No hay pedidoId en URL, buscando borrador...')

          const resPaquete = await fetch(`/api/paquetes?slug=${paqueteSlug}`)
          const infoPaquete = await resPaquete.json()
          const targetId = infoPaquete?.id

          if (targetId) {
            const resBorrador = await fetch(`/api/pedidos/borrador?paqueteId=${targetId}&tipo=paquete`)
            const dataBorrador = await resBorrador.json()

            if (dataBorrador?.pedido?.id) {
              pedidoId = dataBorrador.pedido.id
              setResolvedPedidoId(pedidoId)
              console.log('✅ [PAQUETE PROPIETARIO] Borrador encontrado:', pedidoId)

              const newUrl = `${window.location.pathname}?pedido=${pedidoId}`
              window.history.replaceState({}, '', newUrl)
            }
          }
        }

        if (!pedidoId) {
          setError('No se encontró un pedido en curso. Por favor, vuelve al inicio del proceso.')
          setLoading(false)
          return
        }

        setResolvedPedidoId(pedidoId)

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

        // Comprobar si el estado es Wyoming
        if (pedido.estado_usa_id) {
          const resEstados = await fetch('/api/estados')
          if (resEstados.ok) {
            const estados = await resEstados.json()
            const estadoPedido = estados.find((e: any) => e.id === pedido.estado_usa_id)
            if (estadoPedido && estadoPedido.codigo === 'WY') {
              setEsWyoming(true)
            }
          }
        }

        setForm({
          nombre: meta.owner_name || user.firstName || '',
          apellidos: meta.owner_lastname || user.lastName || '',
          pasaporte: meta.passport || '',
          direccion: meta.owner_address || '',
          email_personal: meta.personal_email || user.emailAddresses?.[0]?.emailAddress || '',
          email_corporativo: meta.corporate_email || '',
          es_mismo_contacto_wy: meta.wy_is_same_contact ?? true,
          wy_contacto_nombre: meta.wy_contact_name || '',
          wy_contacto_direccion: meta.wy_contact_address || '',
          wy_contacto_telefono: meta.wy_contact_phone || '',
        })
      } catch (e) {
        setError('Error al cargar los datos.')
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [isUserLoaded, user, pedidoIdFromUrl, router])

  // Ref al pedidoId resuelto (puede venir de URL o del borrador encontrado)
  const [resolvedPedidoId, setResolvedPedidoId] = useState<string | null>(pedidoIdFromUrl)

  const handleBack = () => {
    router.push(`/paquetes/${paqueteSlug}/onboarding/datos-llc?pedido=${resolvedPedidoId ?? ''}`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setForm((prev) => ({ ...prev, [name]: checked }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const validar = (): string | null => {
    if (!form.nombre.trim()) return 'El nombre es obligatorio.'
    if (!form.apellidos.trim()) return 'Los apellidos son obligatorios.'
    if (!form.pasaporte.trim()) return 'El número de pasaporte (o DNI) es obligatorio.'
    if (!form.direccion.trim()) return 'La dirección es obligatoria.'
    if (!form.email_personal.trim()) return 'El email es obligatorio.'
    
    if (esWyoming && !form.es_mismo_contacto_wy) {
      if (!form.wy_contacto_nombre.trim()) return 'El nombre del Contacto de Comunicaciones es obligatorio para Wyoming.'
      if (!form.wy_contacto_direccion.trim()) return 'La dirección del Contacto de Comunicaciones es obligatoria para Wyoming.'
      if (!form.wy_contacto_telefono.trim()) return 'El teléfono del Contacto de Comunicaciones es obligatorio para Wyoming.'
    }
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

    if (!resolvedPedidoId) return

    setSaving(true)
    try {
      const resPedido = await fetch(`/api/pedidos/obtener?id=${resolvedPedidoId}`)
      const dataPedido = await resPedido.json()
      const existingMeta = dataPedido.pedido?.metadata || {}
      
      const metadatosUpdate: any = {
        ...existingMeta,
        owner_name: form.nombre,
        owner_lastname: form.apellidos,
        passport: form.pasaporte,
        owner_address: form.direccion,
        personal_email: form.email_personal,
        corporate_email: form.email_corporativo,
      }
      
      if (esWyoming) {
        metadatosUpdate.wy_is_same_contact = form.es_mismo_contacto_wy
        if (!form.es_mismo_contacto_wy) {
          metadatosUpdate.wy_contact_name = form.wy_contacto_nombre
          metadatosUpdate.wy_contact_address = form.wy_contacto_direccion
          metadatosUpdate.wy_contact_phone = form.wy_contacto_telefono
        } else {
          // Limpiar si eligió usar sus propios datos
          metadatosUpdate.wy_contact_name = ''
          metadatosUpdate.wy_contact_address = ''
          metadatosUpdate.wy_contact_phone = ''
        }
      }

      const res = await fetch('/api/pedidos/actualizar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedidoId: resolvedPedidoId,
          paso: 3,
          datos: {
            metadata: metadatosUpdate
          },
        }),
      })

      if (!res.ok) throw new Error('Error guardando')
      
      const isCrecimiento = paqueteSlug === 'plan-crecimiento'
      const nextStep = isCrecimiento ? 'documentos' : 'revision'
      
      router.push(`/paquetes/${paqueteSlug}/onboarding/${nextStep}?pedido=${resolvedPedidoId}`)
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Corporativo / de la LLC <span className="text-gray-400 font-normal">(Opcional)</span></label>
            <input
              type="email"
              name="email_corporativo"
              value={form.email_corporativo}
              onChange={handleChange}
              placeholder="info@millc.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition"
            />
          </div>

          {esWyoming && (
            <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-2xl p-5 md:p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Requisito para Wyoming: Contacto de Comunicaciones</h3>
              <p className="text-sm text-blue-800/80 mb-4">
                La normativa del estado de Wyoming exige designar a una persona física (natural person) con dirección física y teléfono, para que figure en los registros internos del Agente Registrado. No se hace público.
              </p>
              
              <label className="flex items-center space-x-3 cursor-pointer p-3 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition">
                <input
                  type="checkbox"
                  name="es_mismo_contacto_wy"
                  checked={form.es_mismo_contacto_wy}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium text-sm md:text-base">
                  Seré yo mismo el Contacto de Comunicaciones para esta LLC.
                </span>
              </label>

              {!form.es_mismo_contacto_wy && (
                <div className="mt-5 space-y-5 animate-in slide-in-from-top-2 fade-in duration-200 bg-white p-5 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-600 font-medium">Introduce los datos del tercero designado:</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre y Apellidos completos *</label>
                    <input
                      type="text"
                      name="wy_contacto_nombre"
                      value={form.wy_contacto_nombre}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección física completa *</label>
                    <textarea
                      name="wy_contacto_direccion"
                      value={form.wy_contacto_direccion}
                      onChange={handleChange}
                      rows={2}
                      placeholder="No se permiten apartados de correos (P.O. Box)"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                    <input
                      type="tel"
                      name="wy_contacto_telefono"
                      value={form.wy_contacto_telefono}
                      onChange={handleChange}
                      placeholder="Ej: +34 600 000 000"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

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
