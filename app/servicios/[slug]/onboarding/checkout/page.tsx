'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { AlertCircle, Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user, isLoaded } = useUser()

  const slug = (params?.slug as string) || ''
  const pedidoIdFromUrl = searchParams.get('pedidoId') || searchParams.get('pedido') // Acepta ambos formatos
  const isEIN = slug === 'obtencion-ein'

  const [pedido, setPedido] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        if (!isLoaded) return

        if (!user) {
          router.push('/sign-in')
          return
        }

        let currentId = pedidoIdFromUrl

        // Si no hay ID en URL, buscar borrador vía API segura
        if (!currentId) {
          console.log('🔍 [CHECKOUT] No hay pedidoId en URL, buscando borrador...')

          // Obtener el servicio por slug
          const resServ = await fetch(`/api/servicios?slug=${slug}`)
          const infoServ = await resServ.json()
          const targetId = infoServ?.id

          if (targetId) {
            // Buscar borrador vía API (server-side, sin problemas de RLS)
            const tipo = infoServ?._tipo || 'servicio'
            const resBorrador = await fetch(`/api/pedidos/borrador?servicioId=${targetId}&tipo=${tipo}`)
            const dataBorrador = await resBorrador.json()

            if (dataBorrador?.pedido?.id) {
              currentId = dataBorrador.pedido.id
              console.log('✅ [CHECKOUT] Borrador encontrado:', currentId)

              // Actualizar URL sin recargar
              const newUrl = `${window.location.pathname}?pedidoId=${currentId}`
              window.history.replaceState({}, '', newUrl)
            }
          }
        }

        if (!currentId) {
          setError('No se encontró un pedido en curso. Por favor, vuelve al inicio del proceso.')
          setLoading(false)
          return
        }

        // Usar API segura para obtener pedido completo
        const resPedido = await fetch(`/api/pedidos/completo?id=${currentId}`)
        const dataPedido = await resPedido.json()

        if (!resPedido.ok || !dataPedido.pedido) {
          setError('No se encontró el pedido en la base de datos.')
          setLoading(false)
          return
        }

        const pedidoData = dataPedido.pedido

        if (pedidoData.user_id !== user.id) {
          setError('No tienes permisos para pagar este pedido.')
          setLoading(false)
          return
        }

        setPedido(pedidoData)
      } catch (e) {
        console.error(e)
        setError('Error al cargar los datos. Por favor, recarga la página.')
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [isLoaded, user, pedidoIdFromUrl, slug, router])

  const precioBase = useMemo(() => {
    // Determinar si es Tax Filing basándose en el slug de la URL
    const esTaxFiling = slug === 'impuestos-llc-5472-1120' || slug === 'form-5472-1120'

    // Si es Tax Filing, leer el precio real del servicio
    if (esTaxFiling) {
      const rawTax = pedido?.servicio?.precio ?? pedido?.servicio?.price ?? 397
      const nTax = typeof rawTax === 'number' ? rawTax : Number(String(rawTax).replace(/[^\d.,]/g, '').replace(',', '.'))
      return Number.isFinite(nTax) && nTax > 0 ? nTax : 397
    }

    // Para otros servicios, buscar en paquete o servicio
    const raw =
      pedido?.paquete?.precio ??
      pedido?.paquete?.price ??
      pedido?.paquete?.precio_unico ??
      pedido?.paquete?.precio_base ??
      pedido?.servicio?.precio ??
      pedido?.servicio?.price ??
      0

    const n =
      typeof raw === 'number'
        ? raw
        : Number(String(raw).replace(/[^\d.,]/g, '').replace(',', '.'))
    return Number.isFinite(n) ? n : 0
  }, [pedido])

  const isReporteAnual = slug === 'reporte-anual'
  
  const stateFeeName = isReporteAnual ? 'Filing estatal anual' : 'Filing estatal inicial'
  const stateFee = isReporteAnual 
    ? Number(pedido?.estado_usa?.filing_anual ?? 0) 
    : Number(pedido?.estado_usa?.filing_inicial ?? 0)

  const total = isEIN ? precioBase : precioBase + stateFee

  // Obtener el ID actual (puede haber cambiado tras recuperación)
  const getCurrentPedidoId = () => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('pedidoId') || urlParams.get('pedido') || pedidoIdFromUrl
  }

  const handlePagar = async () => {
    const currentId = getCurrentPedidoId()
    if (!currentId) {
      setError('No se puede proceder sin un pedido válido.')
      return
    }

    setPaying(true)
    setError('')

    try {
      // Determinar el endpoint basado en el slug de la URL actual
      const esTaxFiling = slug === 'impuestos-llc-5472-1120' || slug === 'form-5472-1120'

      // Seleccionar endpoint según el tipo de servicio
      let endpoint = '/api/stripe/checkout' // Default para paquetes
      let body: any = { pedidoId: currentId }

      if (esTaxFiling) {
        // Para Tax Filing, usar endpoint específico que usa el pedido existente
        endpoint = '/api/stripe/checkout-tax-filing'
        body = { pedidoId: currentId }
      } else if (isEIN || isReporteAnual) {
        // Para EIN y Reporte Anual, usar endpoint de servicios
        endpoint = '/api/stripe/checkout-servicio'
        body = { pedidoId: currentId, slug }
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json?.url) {
        console.error('Respuesta checkout:', json)
        setError('No se pudo iniciar el pago.')
        return
      }

      window.location.href = json.url
    } catch (e) {
      console.error(e)
      setError('Error iniciando el pago. Inténtalo de nuevo.')
    } finally {
      setPaying(false)
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

  if (error || !pedido) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
        <div className="flex items-center gap-2 font-semibold">
          <AlertCircle size={18} />
          {error || 'No se encontró el pedido'}
        </div>

        <button
          onClick={() => router.push(`/servicios/${slug}/onboarding`)}
          className="mt-6 text-sm text-gray-600 underline"
        >
          ← Reiniciar proceso
        </button>
      </div>
    )
  }

  const currentPedidoId = pedidoIdFromUrl

  return (
    <div className="max-w-2xl">
      <button
        onClick={() =>
          router.push(`/servicios/${slug}/onboarding/${isEIN ? '' : 'revision'}?pedido=${currentPedidoId}`)
        }
        className="text-sm text-gray-600 underline"
      >
        ← Atrás
      </button>

      <h1 className="text-3xl font-semibold text-gray-900 mt-4 mb-2">Pago</h1>

      <p className="text-gray-600 mb-6">
        Revisa el resumen y procede al pago seguro con Stripe.
      </p>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 mb-4">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle size={18} />
            {error}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
        <div className="font-semibold text-gray-900 mb-4">
          {pedido?.paquete?.title || pedido?.paquete?.nombre || pedido?.servicio?.nombre || pedido?.servicio?.title || 'Servicio'}
        </div>

        <div className="flex justify-between text-gray-700 mb-2">
          <span>Servicio</span>
          <span>${precioBase}</span>
        </div>

        {!isEIN && (
          <div className="flex justify-between text-gray-700 mb-2">
            <span>{stateFeeName} ({pedido?.estado_usa?.nombre || 'Estado'})</span>
            <span>${stateFee}</span>
          </div>
        )}

        <div className="flex justify-between font-semibold text-gray-900 border-t pt-3 mt-3">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      <button
        onClick={handlePagar}
        disabled={paying}
        className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3"
      >
        {paying ? 'Redirigiendo…' : 'Pagar con Stripe →'}
      </button>

      <p className="text-sm text-gray-500 mt-3">
        Al hacer clic en "Pagar", serás redirigido a Stripe para completar el pago de forma segura.
      </p>
    </div>
  )
}
