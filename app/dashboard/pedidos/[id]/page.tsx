import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, Calendar, DollarSign, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { PedidoModel } from '@/lib/models/pedido'

type Props = {
  params: Promise<{ id: string }>
}

export default async function PedidoDetallePage({ params }: Props) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { id } = await params

  // Obtener datos reales
  const pedido = await PedidoModel.obtenerCompleto(id)

  if (!pedido || pedido.user_id !== userId) {
    notFound()
  }

  const isPaid = pedido.estado_pedido === 'pagado'
  const nombreProducto = pedido.paquete?.nombre || pedido.servicio?.nombre || pedido.paquete?.title || pedido.servicio?.title || 'Servicio Open LLC'
  const precio = pedido.total_pagado || pedido.paquete?.precio || pedido.servicio?.precio || 0

  // Mapeo de progreso visual
  const pasos = [
    { label: 'Información recibida', completado: true, fecha: new Date(pedido.created_at).toLocaleDateString() },
    { label: 'Pago verificado', completado: isPaid, fecha: isPaid ? 'Confirmado' : 'Pendiente' },
    { label: 'Revisión por expertos', completado: isPaid, fecha: isPaid ? 'En proceso' : 'Esperando pago' },
    { label: 'Presentación gubernamental', completado: false, fecha: '-' },
    { label: 'Documentación entregada', completado: false, fecha: '-' },
  ]

  // Generar URL de checkout si no está pagado
  const checkoutUrl = `/servicios/\${pedido.servicio?.slug || 'pack'}/onboarding/checkout?pedidoId=\${pedido.id}`

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        <Link
          href="/dashboard/pedidos"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors font-medium text-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Volver a Mis Pedidos
        </Link>

        {/* Card Principal */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-6 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">#{pedido.numero_pedido}</span>
                  {isPaid ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100 uppercase tracking-wider">
                      <CheckCircle2 size={12} /> Pagado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100 uppercase tracking-wider">
                      <Clock size={12} /> Pendiente de Pago
                    </span>
                  )}
                </div>
                <h1 className="text-3xl lg:text-4xl font-black text-slate-900">{nombreProducto}</h1>
              </div>

              {!isPaid && (
                <Link
                  href={checkoutUrl}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Completar Pago <ArrowLeft size={18} className="rotate-180" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha</p>
                <p className="font-bold text-slate-700">{new Date(pedido.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Monto</p>
                <p className="font-bold text-slate-700">$\${precio} USD</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estado USA</p>
                <p className="font-bold text-slate-700">{pedido.estado_usa?.nombre || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tipo</p>
                <p className="font-bold text-slate-700">{pedido.paquete_id ? 'Paquete Formación' : 'Servicio Directo'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-slate-900">

          {/* LÍNEA DE TIEMPO DEL PROCESO */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Package className="text-blue-600" size={24} />
                Progreso del trámite
              </h2>

              <div className="space-y-0 relative">
                {pasos.map((paso, idx) => (
                  <div key={idx} className="flex gap-4 pb-10 last:pb-0 relative">
                    {idx !== pasos.length - 1 && (
                      <div className={`absolute left-4 top-8 bottom-0 w-0.5 \${paso.completado ? 'bg-green-200' : 'bg-slate-100'}`}></div>
                    )}
                    <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 \${
                      paso.completado ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-300'
                    }`}>
                      {paso.completado ? <CheckCircle2 size={18} /> : <div className="w-2 h-2 bg-current rounded-full"></div>}
                    </div>
                    <div>
                      <h3 className={`font-bold \${paso.completado ? 'text-slate-800' : 'text-slate-400'}`}>
                        {paso.label}
                      </h3>
                      <p className="text-sm text-slate-500">{paso.fecha}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* DOCUMENTOS Y AYUDA */}
          <div className="space-y-8">
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="text-blue-600" size={20} />
                Documentos
              </h2>

              {!isPaid ? (
                <div className="text-center py-6">
                  <AlertCircle className="mx-auto text-amber-500 mb-2" size={32} />
                  <p className="text-sm text-slate-500">
                    Los documentos estarán disponibles una vez se complete el pago y la gestión.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500 italic">No hay documentos cargados todavía.</p>
                </div>
              )}
            </section>

            <div className="bg-slate-900 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-2">¿Alguna duda?</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Nuestros agentes especializados están listos para revisar tu caso.
              </p>
              <Link href="/contacto" className="block text-center py-3 bg-blue-600 font-bold rounded-xl hover:bg-blue-700 transition-colors">
                Contactar ahora
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
