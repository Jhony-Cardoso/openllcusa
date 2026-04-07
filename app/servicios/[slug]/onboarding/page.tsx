'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
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

  // Determinar tipo de flujo basado en _tipo del producto
  // servicio = flujo corto (checkout directo)
  // paquete = flujo completo (estado → datos → revisión → checkout)
  const esServicioSuelto = (servicio as any)?._tipo === 'servicio'
  const esPaquete = (servicio as any)?._tipo === 'paquete'

  // Estado del Paso 1 para servicios sueltos (como EIN)
  const [contactEmail, setContactEmail] = useState('')
  const [confirmaciones, setConfirmaciones] = useState<boolean[]>([false, false, false])

  useEffect(() => {
    async function cargarServicio() {
      try {
        if (!isLoaded) return

        if (!slug) {
          setError('Servicio no encontrado (slug vacío)')
          setLoading(false)
          return
        }

        // === Flujo dedicado: Tax Filing (Form 5472 + 1120) ===
        // Si el slug corresponde a impuestos, redirigir al wizard fiscal específico
        const TAX_SLUGS = ['impuestos-llc-5472-1120', 'form-5472-1120', 'impuestos-federales', 'declaracion-anual-5472']
        if (TAX_SLUGS.includes(slug)) {
          router.replace('/servicios/form-5472-1120/onboarding')
          return
        }

        console.log('🔍 Cargando servicio con slug:', slug)

        // Usar API route en lugar de cliente directo para evitar Mixed Content
        console.log('📡 Consultando API /api/servicios...')
        const response = await fetch(`/api/servicios?slug=${slug}`)

        if (!response.ok) {
          const errorData = await response.json()
          console.error('❌ Error de API:', errorData)
          setError(errorData.error || 'Error al cargar el servicio')
          setLoading(false)
          return
        }

        const data = await response.json()
        console.log('✅ Servicio cargado:', data)

        setServicio(data as Servicio)
        setLoading(false)
      } catch (e) {
        console.error('💥 Excepción al cargar servicio:', e)
        setError(`Error al cargar el servicio: ${e instanceof Error ? e.message : 'Error desconocido'}`)
        setLoading(false)
      }
    }

    cargarServicio()
  }, [isLoaded, slug])

  // Auto-rellenar email del usuario autenticado para servicios sueltos
  useEffect(() => {
    if (isLoaded && user && !contactEmail) {
      const userEmail = user.emailAddresses?.[0]?.emailAddress || ''
      setContactEmail(userEmail)
    }
  }, [isLoaded, user, contactEmail])

  const handleContinuar = async () => {
    setError('')

    if (!user) {
      // Redirigir al usuario de vuelta a esta página después de loguearse
      const currentPath = window.location.pathname
      router.push(`/sign-in?redirect_url=${encodeURIComponent(currentPath)}`)
      return
    }

    if (!servicio) {
      setError('Servicio no encontrado')
      return
    }

    // Validación Paso 1 para servicios sueltos
    if (esServicioSuelto) {
      // Validar email de contacto
      if (!contactEmail || !contactEmail.includes('@')) {
        setError('Introduce un email válido.')
        return
      }
    }

    // Modificación: Usar API route para crear pedido y asegurar sync de perfil
    try {
      const servicioInfo = servicio as any
      const esPaquete = servicioInfo._tipo === 'paquete'

      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          servicioId: servicio.id,
          tipo: servicioInfo._tipo || 'servicio'
        })
      })

      if (!response.ok) {
        throw new Error('Error en la petición de creación de pedido')
      }

      const pedido = await response.json()

      // Flujo según tipo de producto
      if (esServicioSuelto) {
        // Servicios sueltos: guardar email y ir directo a checkout
        await fetch('/api/pedidos/actualizar', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pedidoId: pedido.id,
            paso: 1,
            datos: { email_empresa: contactEmail }
          })
        });

        router.push(`/servicios/${slug}/onboarding/checkout?pedido=${pedido.id}`)
        return
      }

      // Paquetes: flujo completo (estado → datos → revisión → checkout)
      router.push(`/servicios/${slug}/onboarding/estado?pedido=${pedido.id}`)

    } catch (err) {
      console.error('Error creando pedido:', err)
      setError('Error al crear el pedido. Inténtalo de nuevo.')
    }
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

  // === UI Paso 1 para SERVICIOS SUELTOS (flujo corto) ===
  if (esServicioSuelto) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          {servicio.title || servicio.nombre || 'Servicio'}
        </h1>

        <p className="text-gray-600 mb-6">
          {servicio.tagline || servicio.descripcion || 'Completa los datos para continuar con tu compra.'}
        </p>

        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">¿Qué incluye este servicio?</h2>
          <p className="text-gray-700">
            {servicio.descripcion || 'Servicio profesional con soporte en español.'}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
          <div className="mb-2 font-semibold text-gray-900">Email de contacto</div>
          <input
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
          <div className="text-sm text-gray-500 mt-2">
            Te avisaremos aquí del estado del trámite y si necesitamos algún dato adicional.
          </div>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 mb-6">
          <h2 className="font-semibold text-blue-900 mb-2">
            💡 Después del pago te pediremos la documentación necesaria
          </h2>
          <p className="text-sm text-blue-800">
            Este es un proceso simplificado. Primero realizas el pago y luego te guiaremos paso a paso para recopilar la información que necesitemos.
          </p>
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

        <div className="text-sm text-gray-500 mt-3 text-center">
          Pago único. Sin suscripciones.
        </div>
      </div>
    )
  }

  // === UI Paso 1 para PAQUETES (flujo completo) ===
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
