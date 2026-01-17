'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { PedidoModel } from '@/lib/models/pedido'
import { AlertCircle, Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user, isLoaded } = useUser()

  const slug = (params?.slug as string) || ''
  const pedidoId = searchParams.get('pedido')
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

        if (!pedidoId) {
          setError('Falta ?pedido= en la URL.')
          setLoading(false)
          return
        }

        const pedidoData = await PedidoModel.obtenerCompleto(pedidoId)
        if (!pedidoData) {
          setError('No se encontró el pedido.')
          setLoading(false)
          return
        }

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
  }, [isLoaded, user, pedidoId, router])

  const precioBase = useMemo(() => {
    const raw =
      pedido?.paquete?.precio ??
      pedido?.paquete?.price ??
      pedido?.paquete?.precio_unico ??
      pedido?.paquete?.precio_base ??
      0
    const n =
      typeof raw === 'number'
        ? raw
        : Number(String(raw).replace(/[^\d.,]/g, '').replace(',', '.'))
    return Number.isFinite(n) ? n : 0
  }, [pedido])

  const filingInicial = Number(pedido?.estado_usa?.filing_inicial ?? 0)
  const total = isEIN ? precioBase : precioBase + filingInicial

  const handlePagar = async () => {
    if (!pedidoId) return
    setPaying(true)
    setError('')

    try {
      const endpoint = isEIN ? '/api/stripe/checkout-servicio' : '/api/stripe/checkout'

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: isEIN ? JSON.stringify({ pedidoId, slug }) : JSON.stringify({ pedidoId }),
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
          onClick={() => router.back()}
          className="mt-6 text-sm text-gray-600 underline"
        >
          ← Atrás
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <button
        onClick={() =>
          router.push(`/servicios/${slug}/onboarding/${isEIN ? '' : 'revision'}?pedido=${pedidoId}`)
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
          {pedido?.paquete?.title || pedido?.paquete?.nombre || 'Servicio'}
        </div>

        <div className="flex justify-between text-gray-700 mb-2">
          <span>Servicio</span>
          <span>${precioBase}</span>
        </div>

        {!isEIN && (
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Filing inicial ({pedido?.estado_usa?.nombre || 'Estado'})</span>
            <span>${filingInicial}</span>
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
        Al hacer clic en “Pagar”, serás redirigido a Stripe para completar el pago de forma segura.
      </p>
    </div>
  )
}
