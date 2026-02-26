// app/dashboard/page.tsx

import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  FileText,
  CreditCard,
  Package,
  User,
  Repeat,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { PedidoModel } from '@/lib/models/pedido'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()
  const userName = user?.firstName || 'emprendedor'

  // Obtener pedidos reales del usuario
  const pedidosRaw = await PedidoModel.obtenerPorUsuario(userId)

  // Enriquecer pedidos con detalles del paquete/servicio (limitado a los 3 más recientes)
  const pedidos = await Promise.all(
    pedidosRaw.slice(0, 3).map(async (p) => {
      return await PedidoModel.obtenerCompleto(p.id)
    })
  )

  const hasOrders = pedidos.length > 0
  const pendingOrders = pedidos.filter((p: any) => p?.estado_pedido !== 'pagado')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Header de Bienvenida */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          ¡Hola de nuevo, {userName}! 👋
        </h1>
        <p className="text-slate-500 text-lg">
          Bienvenido a tu centro de operaciones para tu LLC en Estados Unidos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* COLUMNA IZQUIERDA: Pedidos y Actividad */}
        <div className="lg:col-span-2 space-y-8">

          {/* Sección de Pedidos Recientes */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Tus Trámites</h2>
              {hasOrders && (
                <Link href="/dashboard/pedidos" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  Ver todos <ChevronRight size={14} />
                </Link>
              )}
            </div>

            {!hasOrders ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="text-slate-300" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Aún no tienes trámites activos</h3>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                  Comienza hoy mismo a formar tu empresa en EE.UU. o contrata servicios individuales.
                </p>
                <Link href="/precios" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                  Lanzar mi empresa
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {pedidos.map((pedido: any) => {
                  if (!pedido) return null
                  const isPaid = pedido.estado_pedido === 'pagado'

                  // Detectar tipo de servicio (prioridad a Tax Filing)
                  const esTaxFiling = pedido.metadata?.tipo_servicio === 'tax_filing_5472' || !!(pedido as any).tax_data

                  const nombre = esTaxFiling
                    ? 'Preparación Formulario 5472 + 1120'
                    : (pedido.paquete?.nombre || pedido.servicio?.nombre || 'Trámite LLC')

                  return (
                    <Link key={pedido.id} href={`/dashboard/pedidos/${pedido.id}`}>
                      <div className="group bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 \${
                          isPaid ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {isPaid ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                              {nombre}
                            </h4>
                            <span className="text-xs font-mono text-slate-400">#{pedido.numero_pedido}</span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">
                            {isPaid ? 'En proceso de gestión' : 'Pendiente de pago / completar datos'}
                          </p>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-slate-500 transition-colors" size={20} />
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </section>

          {/* Banner Informativo / Noticias */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full mb-4 border border-blue-500/30">
                INFO FISCAL
              </span>
              <h3 className="text-2xl font-bold mb-3 text-slate-300">Ya estamos en plazo para presentar el form 5472 al IRS</h3>
              <p className="text-slate-300 mb-6 max-w-md">
                Recuerda que si formaste tu LLC antes del 31 de diciembre, podrías tener que presentar el BOI Report.
              </p>
              <Link href="/blog" className="inline-flex items-center text-sm font-bold text-blue-400 hover:text-blue-300">
                Leer más sobre obligaciones <ChevronRight size={16} />
              </Link>
            </div>
            {/* Elemento decorativo */}
            <FileText className="absolute -right-8 -bottom-8 text-slate-700/50" size={200} />
          </div>

        </div>

        {/* COLUMNA DERECHA: Accesos Rápidos y Ayuda */}
        <div className="space-y-8">

          {/* Accesos Rápidos */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Gestión</h2>
            <div className="grid grid-cols-1 gap-3">
              {[
                { name: 'Documentos', icon: FileText, href: '/dashboard/documentos', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { name: 'Facturación', icon: CreditCard, href: '/dashboard/facturacion', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { name: 'Suscripciones', icon: Repeat, href: '/dashboard/suscripciones', color: 'text-rose-600', bg: 'bg-rose-50' },
                { name: 'Mi Perfil', icon: User, href: '/dashboard/perfil', color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map((item) => (
                <Link key={item.name} href={item.href}>
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 hover:border-blue-200 hover:bg-blue-50/10 transition-all">
                    <div className={`w-10 h-10 \${item.bg} \${item.color} rounded-lg flex items-center justify-center`}>
                      <item.icon size={20} />
                    </div>
                    <span className="font-semibold text-slate-700">{item.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Ayuda y Soporte */}
          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                ?
              </div>
              <div>
                <h4 className="font-bold text-slate-900">¿Tienes dudas?</h4>
                <p className="text-sm text-slate-500">Estamos aquí para ayudarte</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Habla directamente con nuestro equipo de expertos sobre tu proceso de formación.
            </p>
            <Link href="/contacto" className="block w-full text-center py-3 bg-white border border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
              Contactar Soporte
            </Link>
          </div>

          {/* Card de Alerta si hay pedidos pendientes */}
          {pendingOrders.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-600 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-amber-900">Acción Requerida</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Tienes <strong>{pendingOrders.length}</strong> trámite(s) pendientes de pago o completar datos. Podrías sufrir retrasos.
                  </p>
                  <Link href="/dashboard/pedidos" className="inline-block mt-3 text-sm font-bold text-amber-900 underline">
                    Completar ahora
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
