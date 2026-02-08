'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { PedidoModel } from '@/lib/models/pedido'
import { AlertCircle, Loader2 } from 'lucide-react'

export default function RevisionPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user, isLoaded } = useUser()

  const slug = (params?.slug as string) || ''
  const isEIN = slug === 'obtencion-ein'
  const pedidoId = searchParams.get('pedido')

  const [pedido, setPedido] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        if (!isLoaded) return

        if (!user) {
          router.push('/sign-in')
          return
        }

        let currentId = pedidoId

        if (!currentId && user) {
          const resServ = await fetch(`/api/servicios?slug=${slug}`)
          const infoServ = await resServ.json()
          const targetId = infoServ?.id
          if (targetId) {
            const borradores = await PedidoModel.obtenerPorUsuario(user.id)
            const miBorrador = borradores.find(p => p.estado_pedido === 'borrador' && (p.servicio_id === targetId || p.paquete_id === targetId))
            if (miBorrador) {
              currentId = miBorrador.id
              const newUrl = `${window.location.pathname}?pedido=${miBorrador.id}`
              window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl)
            }
          }
        }

        if (!currentId) {
          setError('Falta el identificador del pedido. Por favor, vuelve al paso anterior.')
          setLoading(false)
          return
        }

        const pedidoData = await PedidoModel.obtenerCompleto(currentId)
        if (!pedidoData) {
          setError('No se encontró el pedido.')
          setLoading(false)
          return
        }

        if (pedidoData.user_id !== user.id) {
          setError('No tienes permisos para ver este pedido.')
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

  const precioServicio = useMemo(() => {
    const raw =
      pedido?.paquete?.precio ??
      pedido?.paquete?.price ??
      pedido?.paquete?.precio_unico ??
      pedido?.paquete?.precio_base ??
      pedido?.servicio?.precio ??
      0

    const n =
      typeof raw === 'number'
        ? raw
        : Number(String(raw).replace(/[^\d.,]/g, '').replace(',', '.'))

    return Number.isFinite(n) ? n : 0
  }, [pedido])

  const einData = useMemo(() => {
    if (!isEIN) return null
    try {
      const obj = pedido?.descripcion_negocio ? JSON.parse(pedido.descripcion_negocio) : {}
      return obj?.ein || null
    } catch {
      return null
    }
  }, [isEIN, pedido])

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

        <button onClick={() => router.back()} className="mt-6 text-sm text-gray-600 underline">
          ← Atrás
        </button>
      </div>
    )
  }

  // EIN
  if (isEIN) {
    const rp = einData?.responsible_party || {}
    const yaPagado = pedido?.estado_pedido === 'pagado'

    return (
      <div className="max-w-2xl">
        <button
          onClick={() => router.push(`/servicios/${slug}/onboarding/datos-empresa?pedido=${pedidoId}`)}
          className="text-sm text-gray-600 underline"
        >
          ← Atrás
        </button>

        <h1 className="text-3xl font-semibold text-gray-900 mt-4 mb-2">Revisión</h1>
        <p className="text-gray-600 mb-6">
          Verifica que todo esté correcto antes de finalizar.
        </p>

        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
          <div className="font-semibold text-gray-900 mb-2">Servicio</div>
          <div className="text-gray-900">
            {pedido.paquete?.title || pedido.paquete?.nombre || 'Servicio'}
          </div>
          <div className="text-gray-600">
            {pedido.paquete?.tagline || pedido.paquete?.descripcion_corta || ''}
          </div>

          <div className="mt-4 flex justify-between text-gray-700">
            <span>Precio</span>
            <span>${precioServicio}</span>
          </div>

          <div className="mt-2 flex justify-between text-gray-700">
            <span>Estado del pago</span>
            <span className="font-semibold">{yaPagado ? 'Pagado' : 'Pendiente'}</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
          <div className="font-semibold text-gray-900 mb-3">Datos de la LLC</div>
          <div className="text-sm text-gray-700">
            <div><span className="text-gray-500">Nombre legal:</span> {pedido.nombre_empresa || '-'}</div>
            <div><span className="text-gray-500">Estado:</span> {einData?.llc_state || '-'}</div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
          <div className="font-semibold text-gray-900 mb-3">Responsible Party</div>
          <div className="text-sm text-gray-700">
            <div><span className="text-gray-500">Nombre:</span> {rp?.rp_full_name || '-'}</div>
            <div>
              <span className="text-gray-500">Pasaporte:</span>{' '}
              {[rp?.rp_passport_country, rp?.rp_passport_number].filter(Boolean).join(' - ') || '-'}
            </div>
          </div>
        </div>

        {yaPagado ? (
          <button
            onClick={() =>
              router.push(`/servicios/${slug}/onboarding/completado?pedido=${pedidoId}`)
            }
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
          >
            Finalizar →
          </button>
        ) : (
          <button
            onClick={() => router.push(`/servicios/${slug}/onboarding/checkout?pedido=${pedidoId}`)}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
          >
            Ir al pago →
          </button>
        )}
      </div>
    )
  }

  // NO EIN (LLC): mantener tu comportamiento actual
  const filingInicial = Number(pedido?.estado_usa?.filing_inicial ?? 0)
  const filingAnual = Number(pedido?.estado_usa?.filing_anual ?? 0)

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => router.push(`/servicios/${slug}/onboarding/datos-empresa?pedido=${pedidoId}`)}
        className="text-sm text-gray-600 underline"
      >
        ← Atrás
      </button>

      <h1 className="text-3xl font-semibold text-gray-900 mt-4 mb-2">Revisión</h1>
      <p className="text-gray-600 mb-6">
        Verifica que todos los datos sean correctos antes de proceder al pago.
      </p>

      <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
        <div className="flex justify-between text-gray-700 mb-2">
          <span>Precio del servicio</span>
          <span>${precioServicio}</span>
        </div>
        <div className="flex justify-between text-gray-700 mb-2">
          <span>Filing inicial</span>
          <span>${filingInicial}</span>
        </div>
        <div className="text-sm text-gray-600 mt-2">
          💡 El filing anual de ${filingAnual} se pagará directamente al estado en el futuro.
        </div>
      </div>

      <button
        onClick={() => router.push(`/servicios/${slug}/onboarding/checkout?pedido=${pedidoId}`)}
        className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
      >
        Ir al pago →
      </button>
    </div>
  )
}
