import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import {
  Building2, Calendar, MapPin, CheckCircle2,
  Clock, CreditCard, ArrowLeft, ShieldCheck,
  FileText, Download, MessageSquare, AlertCircle, Package
} from 'lucide-react'
import Link from 'next/link'
import { PedidoModel } from '@/lib/models/pedido'
import OnboardingWizard from '@/components/dashboard/OnboardingWizard'

export default async function PedidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { userId } = await auth()
  const user = await currentUser()
  const { id } = await params

  if (!userId) redirect('/sign-in')

  const pedidoFull = await PedidoModel.obtenerCompleto(id)

  if (!pedidoFull || pedidoFull.user_id !== userId) {
    redirect('/dashboard/pedidos')
  }

  const isPaid = pedidoFull.estado_pedido === 'pagado'
  const isLegalSetupPending = isPaid && (pedidoFull.paso_actual < 7)

  // SI EL PAGO ESTÁ HECHO PERO FALTA EL CHECKLIST LEGAL
  if (isLegalSetupPending) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/dashboard/pedidos"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors font-medium text-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Volver a mis pedidos
        </Link>
        <OnboardingWizard
          pedidoId={pedidoFull.id}
          nombreUsuario={user?.firstName || 'emprendedor'}
        />
      </div>
    )
  }

  const nombreProducto = pedidoFull.paquete?.nombre || pedidoFull.servicio?.nombre || pedidoFull.paquete?.title || pedidoFull.servicio?.title || 'Servicio Open LLC'
  const precio = pedidoFull.total_pagado || pedidoFull.paquete?.precio || pedidoFull.servicio?.precio || 0

  // Mapeo de progreso visual
  const pasos = [
    { id: 1, label: 'Información recibida', date: new Date(pedidoFull.created_at).toLocaleDateString(), completado: pedidoFull.paso_actual >= 1 },
    { id: 2, label: 'Pago verificado', date: isPaid ? 'Verificado' : 'Pendiente', completado: isPaid },
    { id: 7, label: 'Configuración Legal', date: pedidoFull.paso_actual >= 7 ? 'Completado' : 'Pendiente', completado: pedidoFull.paso_actual >= 7 },
    { id: 4, label: 'Presentación gubernamental', date: 'Próximamente', completado: pedidoFull.paso_actual >= 8 },
    { id: 5, label: 'Documentación entregada', date: 'Próximamente', completado: pedidoFull.paso_actual >= 9 },
  ]

  // Generar URL de checkout si no está pagado
  const checkoutUrl = `/servicios/${pedidoFull.servicio?.slug || 'pack'}/onboarding/checkout?pedidoId=${pedidoFull.id}`

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
                  <span className="text-sm font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">#{pedidoFull.numero_pedido}</span>
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
                <p className="font-bold text-slate-700">{new Date(pedidoFull.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Monto</p>
                <p className="font-bold text-slate-700">${precio} USD</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estado USA</p>
                <p className="font-bold text-slate-700">{pedidoFull.estados_usa?.nombre || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tipo</p>
                <p className="font-bold text-slate-700">{pedidoFull.paquete_id ? 'Paquete Formación' : 'Servicio Directo'}</p>
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

              <div className="space-y-0 relative ml-4">
                {pasos.map((paso, idx) => (
                  <div key={idx} className="flex gap-6 pb-10 last:pb-0 relative">
                    {idx !== pasos.length - 1 && (
                      <div className={`absolute left-4 top-8 bottom-0 w-0.5 ${paso.completado ? 'bg-green-200' : 'bg-slate-100'}`}></div>
                    )}
                    <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${paso.completado ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-300'
                      }`}>
                      {paso.completado ? <CheckCircle2 size={18} /> : <div className="w-2 h-2 bg-current rounded-full"></div>}
                    </div>
                    <div>
                      <h3 className={`font-bold ${paso.completado ? 'text-slate-800' : 'text-slate-400'}`}>
                        {paso.label}
                      </h3>
                      <p className="text-sm text-slate-500">{paso.date}</p>
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
                  {pedidoFull.metadata?.documento_identidad_path ? (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200 text-blue-600">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                            {pedidoFull.metadata.documento_identidad_nombre || 'Identificación'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Cargado</p>
                        </div>
                      </div>
                      <a
                        href={`/api/pedidos/${pedidoFull.id}/ver-documento?path=${pedidoFull.metadata.documento_identidad_path}`}
                        target="_blank"
                        className="p-2 hover:bg-white hover:text-blue-600 rounded-lg transition-all text-slate-400"
                        title="Ver Documento"
                      >
                        <Download size={16} />
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No hay documentos cargados todavía.</p>
                  )}

                  {/* Aquí se listarán futuros documentos como el Articles of Organization, etc. */}
                </div>
              )}
            </section>

            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-2 text-slate-300">¿Alguna duda?</h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed font-medium">
                  Nuestros agentes especializados están listos para revisar tu caso.
                </p>
                <Link
                  href="/contacto"
                  className="block text-center py-4 bg-blue-600 text-slate-300 font-black rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                >
                  Contactar ahora
                </Link>
              </div>
              <MessageSquare className="absolute -right-4 -bottom-4 text-white/10" size={140} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
