'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase/client'
import { PedidoModel } from '@/lib/models/pedido'
import { Loader2, AlertCircle } from 'lucide-react'

type Servicio = {
  id: string
  title?: string
  nombre?: string
  tagline?: string
  descripcion?: string
  descripcion_corta?: string
  precio?: number
  price?: number
}

export default function OnboardingInicioPage() {
  const router = useRouter()
  const params = useParams()
  const slug = (params?.slug as string) || ''
  const { user, isLoaded } = useUser()

  const [servicio, setServicio] = useState<Servicio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isEIN = slug === 'obtencion-ein'

  // Estado del Paso 1 EIN
  const [einEmail, setEinEmail] = useState('')
  const [einC1, setEinC1] = useState(false)
  const [einC2, setEinC2] = useState(false)
  const [einC3, setEinC3] = useState(false)

  useEffect(() => {
    async function cargarServicio() {
      try {
        if (!isLoaded) return

        if (!slug) {
          setError('Servicio no encontrado (slug vacío)')
          setLoading(false)
          return
        }

        const supabase = createClient()
        const { data, error: dbError } = await supabase
          .from('servicios')
          .select('*')
          .eq('slug', slug)
          .single()

        if (dbError || !data) {
          console.error('Error obteniendo servicio:', dbError)
          setError('Servicio no encontrado')
          setLoading(false)
          return
        }

        setServicio(data as Servicio)
        setLoading(false)
      } catch (e) {
        console.error(e)
        setError('Error al cargar el servicio')
        setLoading(false)
      }
    }

    cargarServicio()
  }, [isLoaded, slug])

  const handleContinuar = async () => {
    setError('')

    if (!user) {
      router.push('/sign-in')
      return
    }

    if (!servicio) {
      setError('Servicio no encontrado')
      return
    }

    // Validación Paso 1 EIN
    if (isEIN) {
      if (!einC1 || !einC2 || !einC3) {
        setError('Confirma los 3 puntos para continuar.')
        return
      }
      if (!einEmail || !einEmail.includes('@')) {
        setError('Introduce un email válido.')
        return
      }
    }

    const pedido = await PedidoModel.crear(user.id, servicio.id)
    if (!pedido) {
      setError('Error al crear el pedido')
      return
    }

    // Guardar email en el pedido (para Stripe y para contacto)
    if (isEIN) {
      await PedidoModel.actualizarPaso(pedido.id, 1, { email_empresa: einEmail })
      router.push(`/servicios/${slug}/onboarding/checkout?pedido=${pedido.id}`)
      return
    }

    // Flujo LLC actual
    router.push(`/servicios/${slug}/onboarding/estado?pedido=${pedido.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-700">
        <Loader2 className="animate-spin" size={18} />
        Cargando…
      </div>
    )
  }

  if (error || !servicio) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
        <div className="flex items-center gap-2 font-semibold">
          <AlertCircle size={18} />
          {error || 'Servicio no encontrado'}
        </div>

        <button
          onClick={() => router.back()}
          className="mt-6 text-sm text-gray-600 underline"
        >
          ← Atrás
        </button>
      </div>
    )
  }

  // === UI Paso 1 EIN ===
  if (isEIN) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Empezar solicitud de EIN
        </h1>

        <p className="text-gray-600 mb-6">
          Este servicio es solo para LLCs ya constituidas. En 2 minutos confirmamos que todo encaja y te llevamos al pago.
        </p>

        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Qué vas a recibir</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>EIN para tu LLC (número fiscal federal).</li>
            <li>Carta oficial del IRS (CP 575) con tu EIN.</li>
            <li>Soporte en español y seguimiento durante el trámite.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Antes de seguir, confirma esto</h2>

          <label className="flex gap-3 items-start mb-3 text-gray-700">
            <input type="checkbox" className="mt-1" checked={einC1} onChange={(e) => setEinC1(e.target.checked)} />
            <span>Mi LLC ya está constituida (tengo el documento de formación del estado).</span>
          </label>

          <label className="flex gap-3 items-start mb-3 text-gray-700">
            <input type="checkbox" className="mt-1" checked={einC2} onChange={(e) => setEinC2(e.target.checked)} />
            <span>Mi LLC aún no tiene EIN.</span>
          </label>

          <label className="flex gap-3 items-start mb-4 text-gray-700">
            <input type="checkbox" className="mt-1" checked={einC3} onChange={(e) => setEinC3(e.target.checked)} />
            <span>Soy el Responsible Party o tengo permiso del responsable para tramitarlo.</span>
          </label>

          <div className="mb-2 font-semibold text-gray-900">Email de contacto</div>
          <input
            value={einEmail}
            onChange={(e) => setEinEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
          <div className="text-sm text-gray-500 mt-2">
            Te avisaremos aquí del estado del trámite y si falta algún dato.
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">
            Documentos que vas a necesitar (se suben después del pago)
          </h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Documento de constitución de la LLC: Articles/Certificate (según el estado).</li>
            <li>Pasaporte del Responsible Party (imagen nítida).</li>
            <li>Dirección postal de la LLC (puede ser la del agente registrado si aplica).</li>
          </ul>
          <div className="text-sm text-gray-500 mt-3">
            Formatos aceptados: PDF, JPG o PNG. Ideal: 1 archivo por documento.
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 mb-4">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle size={18} />
              {error}
            </div>
          </div>
        )}

        <button
          onClick={handleContinuar}
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
        >
          Continuar al pago →
        </button>

        <div className="text-sm text-gray-500 mt-3">
          Pago único. Sin suscripciones. Si tu caso no aplica, se detiene el proceso antes de tramitar con el IRS.
        </div>
      </div>
    )
  }

  // === UI Paso 1 normal (LLC) ===
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">
        {servicio.title || servicio.nombre || 'Servicio'}
      </h1>

      {servicio.tagline && (
        <p className="text-gray-600 mb-6">{servicio.tagline}</p>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-2">¿Qué incluye este servicio?</h2>
        <p className="text-gray-700">{servicio.descripcion}</p>
      </div>

      <p className="text-gray-600 mb-6">
        En los siguientes pasos te pediremos seleccionar el estado donde quieres constituir tu LLC
        y los datos de tu empresa. Todo el proceso toma aproximadamente 5-10 minutos.
      </p>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 mb-4">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle size={18} />
            {error}
          </div>
        </div>
      )}

      <button
        onClick={handleContinuar}
        className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
      >
        Continuar al siguiente paso →
      </button>
    </div>
  )
}
