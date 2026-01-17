'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

export default function CompletadoPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const slug = (params?.slug as string) || ''
  const isEIN = slug === 'obtencion-ein'

  const sessionId = searchParams.get('session_id')
  const pedidoId = searchParams.get('pedido')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pedido, setPedido] = useState<any>(null)

  useEffect(() => {
    async function verificar() {
      try {
        setLoading(true)
        setError('')

        if (!sessionId && !pedidoId) {
          setError('Falta session_id o pedido en la URL.')
          return
        }

        const res = await fetch('/api/stripe/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, pedidoId }),
        })

        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(json?.error || 'No se pudo verificar el pago.')
          return
        }

        setPedido(json?.pedido || null)
      } catch (e) {
        console.error(e)
        setError('No se pudo verificar el pago. Inténtalo de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    verificar()
  }, [sessionId, pedidoId])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-700">
        <Loader2 className="animate-spin" size={18} />
        Por favor, espera un momento…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
        <div className="flex items-center gap-2 font-semibold">
          <AlertCircle size={18} />
          {error}
        </div>

        <div className="mt-6 flex gap-3 flex-wrap">
          <button
            onClick={() => router.push(`/servicios/${slug}`)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
          >
            Volver a servicios
          </button>

          <button
            onClick={() => router.push('/contacto')}
            className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm"
          >
            Contactar soporte
          </button>
        </div>
      </div>
    )
  }

  // --- EIN: Gracias / Recibido ---
  if (isEIN) {
    return (
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-green-700 font-semibold mb-4">
          <CheckCircle2 size={20} />
          Gracias, pedido recibido
        </div>

        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Hemos recibido tu solicitud de EIN{pedido?.numero_pedido ? ` (#${pedido.numero_pedido})` : ''}.
        </h1>

        <p className="text-gray-600 mb-6">
          Ya está confirmado el pago. Ahora el equipo revisará la información y avanzará con el trámite.
        </p>

        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
          <div className="font-semibold text-gray-900 mb-2">Qué ocurre ahora</div>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Si falta algún dato, te escribiremos al email del pedido.</li>
            <li>El trámite suele tardar 5–7 días hábiles desde que enviamos la solicitud al IRS.</li>
            <li>Podrás ver el estado del pedido desde tu dashboard.</li>
          </ul>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => router.push('/dashboard')}
            className="rounded-lg bg-blue-600 text-white px-5 py-3 text-sm font-semibold"
          >
            Ver tu pedido en dashboard
          </button>

          <button
            onClick={() => router.push('/contacto')}
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm"
          >
            Contactar soporte
          </button>
        </div>
      </div>
    )
  }

  // --- NO EIN: mantener comportamiento general ---
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 text-green-700 font-semibold mb-4">
        <CheckCircle2 size={20} />
        Pago confirmado
      </div>

      <h1 className="text-3xl font-semibold text-gray-900 mb-2">
        Tu pedido {pedido?.numero_pedido ? `#${pedido.numero_pedido}` : ''} ha sido procesado correctamente.
      </h1>

      <p className="text-gray-600 mb-6">
        Recibirás un email con los siguientes pasos y podrás seguir el pedido en tu panel.
      </p>

      <button
        onClick={() => router.push('/dashboard')}
        className="rounded-lg bg-blue-600 text-white px-5 py-3 text-sm font-semibold"
      >
        Ir a mi dashboard
      </button>
    </div>
  )
}
