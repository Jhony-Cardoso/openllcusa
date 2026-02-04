import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { CreditCard, ArrowLeft, ExternalLink, Receipt, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { PedidoModel } from '@/lib/models/pedido'
import BotonPortalStripe from '@/components/dashboard/BotonPortalStripe'

export default async function FacturacionPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  // Obtener pedidos pagados (que son los que generan facturas)
  const pedidosRaw = await PedidoModel.obtenerPorUsuario(userId)
  const facturas = await Promise.all(
    pedidosRaw
      .filter(p => p.estado_pedido === 'pagado')
      .map(async (p) => {
        const completo = await PedidoModel.obtenerCompleto(p.id)
        return {
          id: completo?.id,
          concepto: completo?.paquete?.nombre || completo?.servicio?.nombre || 'Servicio Open LLC',
          monto: completo?.total_pagado || 0,
          fecha: completo?.created_at ? new Date(completo.created_at).toLocaleDateString('es-ES') : '-',
          numero: completo?.numero_pedido
        }
      })
  )

  const hasCustomerRecord = pedidosRaw.some(p => p.stripe_customer_id)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors font-medium text-sm group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Volver al Panel
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Facturación</h1>
          <p className="text-slate-500 text-lg">Gestiona tus pagos, tarjetas y descarga tus facturas oficiales.</p>
        </div>

        {hasCustomerRecord && <BotonPortalStripe />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LISTA DE FACTURAS */}
        <div className="lg:col-span-2">
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Receipt className="text-blue-600" size={20} />
                Historial de Pagos
              </h2>
            </div>

            <div className="p-0">
              {facturas.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="text-slate-300" size={32} />
                  </div>
                  <p className="text-slate-500">Todavía no tienes facturas procesadas.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {facturas.map((factura) => (
                    <div key={factura.id} className="p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                          <CheckCircleIcon />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{factura.concepto}</p>
                          <p className="text-xs font-mono text-slate-400 mt-0.5">{factura.numero} • {factura.fecha}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900 text-lg">${factura.monto} USD</p>
                        <p className="text-xs font-bold text-green-600 uppercase tracking-widest mt-1">Pagada</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* INFO ADICIONAL */}
        <div className="space-y-6">
          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-200">
              <ExternalLink size={20} className="text-slate-200" />
              Portal Self-Service
            </h3>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              Utilizamos <strong>Stripe</strong> para garantizar que tus datos financieros estén protegidos. En el portal podrás:
            </p>
            <ul className="text-sm space-y-3 text-blue-50 mb-4">
              <li className="flex items-center gap-2">✓ Descargar facturas en PDF</li>
              <li className="flex items-center gap-2">✓ Actualizar métodos de pago</li>
              <li className="flex items-center gap-2">✓ Ver tu historial completo</li>
            </ul>
          </div>

          {!hasCustomerRecord && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex gap-4">
              <AlertCircle className="text-amber-600 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-amber-900 text-sm">Registro pendiente</h4>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  El portal de gestión se habilitará automáticamente después de realizar tu primer pago.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CheckCircleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}