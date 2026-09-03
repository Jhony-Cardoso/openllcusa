import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import {
  Building2, Calendar, MapPin, CheckCircle2,
  Clock, CreditCard, ArrowLeft, ShieldCheck,
  FileText, Download, MessageSquare, AlertCircle, Package
} from 'lucide-react'
import Link from 'next/link'
import { PedidoModel } from '@/lib/models/pedido'
import { FacturaModel } from '@/lib/models/factura'
import OnboardingWizard from '@/components/dashboard/OnboardingWizard'
import TaxFormViewer from '@/components/dashboard/TaxFormViewer'
import SS4FormViewer from '@/components/dashboard/SS4FormViewer'
import { isEIN, isReporteAnual, isTaxFilingSlug } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function PedidoDetallePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ verify_session?: string }>
}) {
  const { userId } = await auth()
  const user = await currentUser()
  const { id } = await params
  const resolvedSearchParams = await searchParams
  const verifySessionId = resolvedSearchParams?.verify_session || resolvedSearchParams?.session_id

  if (!userId) redirect('/sign-in')

  let pedidoFull = await PedidoModel.obtenerCompleto(id)

  if (!pedidoFull || pedidoFull.user_id !== userId) {
    redirect('/dashboard/pedidos')
  }

  // --- Verificación invisible síncrona ---
  // Si venimos de Stripe con éxito, intentamos marcar como pagado DE INMEDIATO
  let shouldRedirect = false
  if (verifySessionId && pedidoFull.estado_pedido !== 'pagado') {
    try {
      const { stripe } = await import('@/lib/stripe')
      const session = await stripe.checkout.sessions.retrieve(verifySessionId)

      if (session.payment_status === 'paid' && session.metadata?.pedidoId === pedidoFull.id) {
        console.log(`[Dashboard] Verificación síncrona exitosa para pedido: ${pedidoFull.id}`)

        const { supabaseAdmin } = await import('@/lib/supabase-admin')
        const { error: updError, count } = await supabaseAdmin
          .from('pedidos')
          .update({
            estado_pedido: 'pagado',
            stripe_session_id: verifySessionId,
            stripe_payment_intent_id: session.payment_intent as string || null,
            total_pagado: session.amount_total ? session.amount_total / 100 : 0,
            fecha_pago: new Date().toISOString(),
            paso_actual: 6,
            completado_at: new Date().toISOString()
          }, { count: 'exact' })
          .eq('id', pedidoFull.id)

        if (!updError && count && count > 0) {
          console.log('✅ Pedido actualizado a pagado via Sync Check.')
          shouldRedirect = true
        } else {
          console.error('❌ No se pudo actualizar el pedido en Sync Check:', updError)
        }
      }
    } catch (e) {
      console.error('[Dashboard] Error verificando sesión de Stripe (Sync):', e)
    }
  }

  if (shouldRedirect) {
    redirect(`/dashboard/pedidos/${pedidoFull.id}`)
  }

  // TODO: Implementar FacturaModel correctamente
  const factura = null
  // const factura = await FacturaModel.obtenerPorPedidoId(id)

  if (!pedidoFull || pedidoFull.user_id !== userId) {
    redirect('/dashboard/pedidos')
  }

  const isPaid = pedidoFull.estado_pedido === 'pagado'
  const isLegalSetupPending = isPaid && (pedidoFull.paso_actual ?? 0) < 7

  // Detectar tipo de trámite de forma robusta
  const p = pedidoFull as any
  const esEIN = isEIN(p.servicio?.slug) || p.paquete?.slug === 'ein-express'

  // Tax Filing se detecta por: 
  // 1. Slug específico
  // 2. Metadata explícita
  // 3. Opcionalmente tax_data PERO solo si tiene campos reales (evitando el default '{}')
  const taxDataObj = ((pedidoFull as any).tax_data ?? (pedidoFull as any).metadata?.taxData ?? {}) as Record<string, any>
  const hasRealTaxData = Object.keys(taxDataObj).length > 0
  const metadata = (pedidoFull.metadata ?? {}) as Record<string, any>;

  const esTaxFiling =
    isTaxFilingSlug(p.servicio?.slug) ||
    metadata.tipo_servicio === 'tax_filing_5472' ||
    hasRealTaxData

  const esReporteAnual = isReporteAnual(p.servicio?.slug)

  const nombreProducto = esTaxFiling
    ? 'Presentación Forms 5472 + 1120'
    : esReporteAnual
      ? 'Reporte Anual Estatal'
      : (pedidoFull.paquete?.nombre || pedidoFull.servicio?.nombre || 'Trámite LLC')

  // SI EL PAGO ESTÁ HECHO PERO FALTA EL CHECKLIST LEGAL
  // Excepción: Tax Filing y Reporte Anual no requieren wizard posterior
  const showWizard = isPaid && !esTaxFiling && !esReporteAnual && (pedidoFull.paso_actual ?? 0) < 7

  if (showWizard) {
    // Obtener el código del estado para pasar al wizard (ej: 'WY', 'DE', etc.)
    const estadoCodigo = (pedidoFull as any).estado_usa?.codigo || null

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
          esEIN={esEIN}
          estadoCodigo={estadoCodigo}
        />
      </div>
    )
  }

  const precio = pedidoFull.total_pagado || pedidoFull.paquete?.precio || pedidoFull.servicio?.precio || 0

  const safeDate = (d: string | null | undefined) => d ? new Date(d).toLocaleDateString() : '—'

  // Mapeo de progreso visual (Adaptado para EIN vs LLC vs Impuestos)
  const pasos = esTaxFiling ? [
    { id: 1, label: 'Datos Recibidos', date: safeDate(pedidoFull.created_at), completado: true },
    { id: 2, label: 'Pago Verificado', date: isPaid ? 'Completado' : 'Pendiente', completado: isPaid },
    { id: 3, label: 'Documentos Preparados', date: metadata.documents?.form_5472_url ? (metadata.documents?.form_5472_approved ? 'Completado - Copia oficial lista' : 'Pendiente de tu revisión y aprobación') : 'En proceso de preparación por nuestro equipo', completado: !!metadata.documents?.form_5472_url },
    { id: 4, label: 'Presentación al IRS', date: 'Pendiente - Nuestro equipo lo enviará próximamente', completado: false },
    { id: 5, label: 'Acuse de Recibo del IRS', date: 'Pendiente - Se enviará cuando esté disponible', completado: false },
  ] : esReporteAnual ? [
    { id: 1, label: 'Solicitud recibida', date: safeDate(pedidoFull.created_at), completado: true },
    { id: 2, label: 'Pago verificado', date: isPaid ? 'Verificado' : 'Pendiente', completado: isPaid },
    { id: 3, label: `Presentación ante ${(pedidoFull as any).estado_usa?.nombre || 'el estado'}`, date: (pedidoFull.paso_actual ?? 0) >= 8 ? 'Completado' : 'Nuestro equipo lo gestionará a la mayor brevedad', completado: (pedidoFull.paso_actual ?? 0) >= 8 },
    { id: 4, label: 'Confirmación oficial del estado', date: (pedidoFull.paso_actual ?? 0) >= 9 ? 'Completado' : 'Próximamente', completado: (pedidoFull.paso_actual ?? 0) >= 9 },
  ] : esEIN ? [
    { id: 1, label: 'Solicitud Recibida', date: safeDate(pedidoFull.created_at), completado: (pedidoFull.paso_actual ?? 0) >= 1 },
    { id: 2, label: 'Pago Confirmado', date: isPaid ? 'Completado' : 'Pendiente', completado: isPaid },
    { id: 7, label: 'Autorización Firmada', date: (pedidoFull.paso_actual ?? 0) >= 7 ? 'Completado' : 'Pendiente', completado: (pedidoFull.paso_actual ?? 0) >= 7 },
    { id: 4, label: 'Tramitación ante IRS', date: (pedidoFull.paso_actual ?? 0) >= 8 ? (metadata.borrador_ss4_path ? (metadata.borrador_ss4_approved ? 'Borrador Aprobado - Enviando al IRS' : 'Borrador listo - Revísalo abajo') : 'Preparando borrador') : 'En espera', completado: (pedidoFull.paso_actual ?? 0) >= 8 },
    { id: 5, label: 'EIN Entregado', date: 'Próximamente', completado: (pedidoFull.paso_actual ?? 0) >= 9 },
  ] : [
    { id: 1, label: 'Información recibida', date: safeDate(pedidoFull.created_at), completado: (pedidoFull.paso_actual ?? 0) >= 1 },
    { id: 2, label: 'Pago verificado', date: isPaid ? 'Verificado' : 'Pendiente', completado: isPaid },
    { id: 7, label: 'Configuración Legal', date: (pedidoFull.paso_actual ?? 0) >= 7 ? 'Completado' : 'Pendiente', completado: (pedidoFull.paso_actual ?? 0) >= 7 },
    { id: 4, label: 'Presentación gubernamental', date: 'Próximamente', completado: (pedidoFull.paso_actual ?? 0) >= 8 },
    { id: 5, label: 'Documentación entregada', date: 'Próximamente', completado: (pedidoFull.paso_actual ?? 0) >= 9 },
  ]

  // Generar URL de checkout si no está pagado
  // Determinar el slug correcto según el tipo de servicio
  let slugParaCheckout = 'pack' // fallback por defecto

  if (esTaxFiling) {
    // Para Tax Filing, usar el slug específico
    slugParaCheckout = 'impuestos/declaracion-anual-llc'
  } else if (pedidoFull.paquete?.slug) {
    // Si tiene paquete, usar su slug
    slugParaCheckout = (pedidoFull.paquete as any).slug
  } else if (pedidoFull.servicio?.slug) {
    // Si tiene servicio, usar su slug
    slugParaCheckout = (pedidoFull.servicio as any).slug
  }

  const checkoutUrl = `/servicios/${slugParaCheckout}/onboarding/checkout?pedidoId=${pedidoFull.id}`

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
                 <p className="font-bold text-slate-700">{safeDate(pedidoFull.created_at)}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Monto</p>
                <p className="font-bold text-slate-700">${precio} USD</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estado USA</p>
                <p className="font-bold text-slate-700">{(pedidoFull as any).estado_usa?.nombre || 'N/A'}</p>
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
                  {/* FACTURA DE COMPRA */}
                  {factura && (factura as any).pdf_path && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100 group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-blue-200 text-blue-600">
                          <CreditCard size={16} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-900 truncate">
                             Factura {(factura as any).numero_factura}
                           </p>
                          <p className="text-[10px] text-blue-500 font-bold uppercase">Disponible</p>
                        </div>
                      </div>
                      <a
                         href={`/api/facturas/${(factura as any).id}/descargar`}
                        target="_blank"
                        className="p-2 bg-white text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        <Download size={16} />
                      </a>
                    </div>
                  )}

                  {metadata.documento_identidad_path ? (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200 text-blue-600">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                            {metadata.documento_identidad_nombre || 'Identificación'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Cargado</p>
                        </div>
                      </div>
                      <a
                        href={`/api/pedidos/${pedidoFull.id}/ver-documento?path=${metadata.documento_identidad_path}`}
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

                  {/* CARTA EIN DEL IRS */}
                  {metadata.carta_ein_path && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 className="text-green-600" size={24} />
                            <span className="text-xs font-black text-green-700 uppercase tracking-widest">¡Completado!</span>
                          </div>
                          <h4 className="text-lg font-black text-green-900 mb-2">🎉 Tu Número EIN ha sido Aprobado</h4>
                          <p className="text-sm text-green-700 mb-4">
                            El IRS ha procesado tu solicitud exitosamente. Descarga tu Carta de Confirmación oficial.
                          </p>
                          <a
                            href={`/api/pedidos/${pedidoFull.id}/descargar-carta-ein`}
                            target="_blank"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200"
                          >
                            <Download size={18} />
                            Descargar Carta EIN del IRS
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
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

        {/* VISOR COMPLETO — fuera de la grilla para máximo ancho */}
        {esTaxFiling && metadata.documents?.form_5472_url && isPaid && (
          <TaxFormViewer
            pedidoId={pedidoFull.id}
            isApproved={!!metadata.documents?.form_5472_approved}
            isCompleted={pedidoFull.estado_pedido === 'completado'}
          />
        )}

        {/* VISOR SS-4 — para trámites de EIN */}
        {esEIN && metadata.borrador_ss4_path && isPaid && (
          <SS4FormViewer
            pedidoId={pedidoFull.id}
            isApproved={!!metadata.borrador_ss4_approved}
            isCompleted={(pedidoFull.paso_actual ?? 0) >= 9}
          />
        )}

      </div>
    </div>
  )
}
