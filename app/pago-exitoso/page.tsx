'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, ArrowRight, FileText, LayoutDashboard, Home } from 'lucide-react'
import Link from 'next/link'

interface PedidoInfo {
  id: string
  numero_pedido: string
  total_pagado?: number
  nombreProducto?: string
}

function PagoExitosoContent() {
  const searchParams = useSearchParams()

  const sessionId = searchParams.get('session_id')
  const pedidoId = searchParams.get('pedido')

  const [verifying, setVerifying] = useState(false)
  const [pedido, setPedido] = useState<PedidoInfo | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending')

  // Resolución robusta del nombre del servicio (nombre, title, metadata, fallback tax filing)
  const resolverNombreProducto = (p: any): string => {
    if (!p) return 'Tu servicio'
    const fromPaquete = p.paquete?.nombre || p.paquete?.title
    const fromServicio = p.servicio?.nombre || p.servicio?.title
    const fromMetadata = p.metadata?.tipo_servicio === 'tax_filing_5472' || p.tipo_servicio === 'tax_filing_5472'
    if (fromPaquete) return fromPaquete
    if (fromServicio) return fromServicio
    if (fromMetadata) return 'Presentación Forms 5472 + 1120'
    return p.nombre || 'Tu servicio'
  }

  // Mostramos éxito INMEDIATAMENTE (Stripe nos redirigió aquí = el pago fue aceptado por Stripe)
  // La verificación del backend se hace en segundo plano
  useEffect(() => {
    if (!sessionId || !pedidoId) {
      setPedido({
        id: 'desconocido',
        numero_pedido: 'N/A',
        nombreProducto: 'Tu servicio',
      })
      return
    }

    // Datos iniciales optimistas (se actualizan en background)
    setPedido({
      id: pedidoId,
      numero_pedido: 'Cargando...',
      nombreProducto: 'Servicio contratado',
    })

    const verificarEnSegundoPlano = async () => {
      setVerifying(true)
      try {
        const res = await fetch('/api/stripe/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, pedidoId }),
        })

        const data = await res.json()

        if (res.ok && data.pedido) {
          const p = data.pedido
          setPedido({
            id: pedidoId,
            numero_pedido: p.numero_pedido || 'N/A',
            total_pagado: p.total_pagado,
            nombreProducto: resolverNombreProducto(p),
          })
          setVerificationStatus('success')
        } else {
          setPedido(prev => ({
            ...prev!,
            numero_pedido: 'Verificando...',
          }))
          setVerificationStatus('failed')
        }
      } catch (err) {
        console.error('Error en verificación en segundo plano:', err)
        setVerificationStatus('failed')
      } finally {
        setVerifying(false)
      }
    }

    verificarEnSegundoPlano()
  }, [sessionId, pedidoId])

  // Siempre mostramos la pantalla de éxito (Stripe nos redirigió aquí)
  // La verificación ocurre en segundo plano
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Success Header - Siempre visible */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 size={48} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3">
            ¡Pago completado con éxito!
          </h1>
          <p className="text-lg text-slate-600">
            Gracias por confiar en Open LLC USA.
          </p>

          {verifying && (
            <p className="text-sm text-blue-600 mt-2 flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> Verificando detalles del pago en segundo plano...
            </p>
          )}

          {verificationStatus === 'failed' && (
            <p className="text-xs text-amber-600 mt-2">
              No pudimos confirmar automáticamente los detalles. Usa el botón "Forzar verificación" si es necesario.
            </p>
          )}
        </div>

        {/* Pedido Summary - Siempre visible */}
        {pedido && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-8">
            <div className="text-center mb-6">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">
                Pedido
              </p>
              <p className="font-mono text-xl font-black text-slate-900">
                #{pedido.numero_pedido}
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-3">
                <span className="text-slate-600">Servicio</span>
                <span className="font-bold text-slate-900">{pedido.nombreProducto}</span>
              </div>
              {pedido.total_pagado && (
                <div className="flex justify-between border-b pb-3">
                  <span className="text-slate-600">Total pagado</span>
                  <span className="font-black text-slate-900">
                    ${pedido.total_pagado} USD
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-1">
                <span className="text-slate-600">Estado</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  <CheckCircle2 size={14} /> Pagado y registrado
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons - Siempre visibles */}
        <div className="space-y-3">
          {pedido && (
            <Link
              href={`/dashboard/pedidos/${pedido.id}`}
              className="flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200"
            >
              Ver detalle de mi pedido
              <ArrowRight size={20} />
            </Link>
          )}

          {/* Botón manual para forzar verificación */}
          {sessionId && pedidoId && (
            <button
              onClick={async () => {
                try {
                  await fetch('/api/stripe/verify-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId, pedidoId }),
                  })
                  window.location.href = `/dashboard/pedidos/${pedidoId}`
                } catch (e) {
                  alert('No se pudo verificar automáticamente. Ve al dashboard.')
                }
              }}
              className="text-sm text-blue-600 hover:underline mt-1 mb-2 w-full text-center"
            >
              Forzar verificación del pago
            </button>
          )}

          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-3 w-full bg-white border border-slate-300 hover:bg-slate-50 font-bold py-4 rounded-2xl transition-all"
          >
            <LayoutDashboard size={20} />
            Ir a mi Dashboard
          </Link>

          <Link
            href="/servicios"
            className="flex items-center justify-center gap-3 w-full text-slate-600 hover:text-slate-900 font-medium py-3"
          >
            <Home size={18} />
            Explorar más servicios
          </Link>
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">
          Recibirás un correo de confirmación en breve.
        </p>
      </div>
    </div>
  )
}

export default function PagoExitosoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    }>
      <PagoExitosoContent />
    </Suspense>
  )
}
