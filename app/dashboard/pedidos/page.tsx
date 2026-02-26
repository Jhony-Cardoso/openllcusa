import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, ChevronRight, Calendar, DollarSign } from 'lucide-react'
import { PedidoModel } from '@/lib/models/pedido'


export default async function PedidosPage() {
  // Protección manual de la ruta
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Obtener pedidos reales del usuario desde Supabase
  const pedidosRaw = await PedidoModel.obtenerPorUsuario(userId)

  // Enriquecer todos los pedidos
  const pedidos = await Promise.all(
    pedidosRaw.map(async (p) => {
      const completo = await PedidoModel.obtenerCompleto(p.id)
      if (!completo) return null

      return {
        id: completo.id,
        numero: completo.numero_pedido || `#${completo.id.slice(0, 5)}`,
        servicio: (completo.metadata as any)?.tipo_servicio === 'tax_filing_5472' || !!(completo as any).tax_data
          ? 'Presentación Forms 5472 + 1120'
          : (completo.paquete?.nombre || completo.servicio?.nombre || completo.paquete?.title || completo.servicio?.title || 'Servicio Open LLC'),
        descripcion: completo.paquete?.tagline || completo.servicio?.tagline || (completo.paquete_id ? 'Paquete de formación' : 'Servicio individual'),
        fecha: new Date(completo.created_at).toLocaleDateString('es-ES'),
        monto: completo.total_pagado ? `$\${completo.total_pagado}` : '$0',
        estado: completo.estado_pedido === 'pagado' ? 'Completado' : 'En progreso',
        estadoColor: completo.estado_pedido === 'pagado' ? 'green' : 'blue',
      }
    })
  ).then(list => list.filter(item => item !== null))

  const totalPedidos = pedidos.length
  const pedidosCompletados = pedidos.filter(p => p.estado === 'Completado').length
  const totalPagadoNum = pedidos.reduce((sum, p) => sum + parseFloat(p.monto.replace('$', '')), 0)
  const montoTotal = totalPagadoNum.toFixed(2)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mis Pedidos</h1>
          <p className="text-gray-600">
            Gestiona y consulta todos tus servicios contratados
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de pedidos</p>
                <p className="text-3xl font-bold text-gray-900">{totalPedidos}</p>
              </div>
              <Package className="text-blue-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completados</p>
                <p className="text-3xl font-bold text-green-600">{pedidosCompletados}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-2xl font-bold">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monto total</p>
                <p className="text-3xl font-bold text-gray-900">${montoTotal}</p>
              </div>
              <DollarSign className="text-purple-600" size={40} />
            </div>
          </div>
        </div>

        {/* Lista de pedidos */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Historial de pedidos</h2>
          </div>

          <div className="overflow-x-auto">
            <div className="divide-y divide-gray-200">
              {pedidos.map((pedido) => (
                <Link
                  key={pedido.id}
                  href={`/dashboard/pedidos/${pedido.id}`}
                  className="block hover:bg-gray-50 transition-colors"
                >
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Package
                            className={`text-${pedido.estadoColor}-600 flex-shrink-0`}
                            size={24}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {pedido.servicio}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {pedido.descripcion}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Pedido:</span>
                            <span className="font-medium text-gray-900">{pedido.numero}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="text-gray-400" size={16} />
                            <span className="text-gray-600">{pedido.fecha}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <DollarSign className="text-gray-400" size={16} />
                            <span className="font-semibold text-gray-900">{pedido.monto}</span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-6 flex items-center gap-4">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${pedido.estadoColor === 'green'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                            }`}
                        >
                          {pedido.estado}
                        </span>

                        <ChevronRight
                          className="text-gray-400 flex-shrink-0"
                          size={24}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600 text-center">
              Mostrando {pedidos.length} pedidos
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-md p-8 mt-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2 text-blue-100">¿Necesitas más servicios?</h2>
          <p className="mb-6 text-blue-100">
            Consulta nuestros servicios de mantenimiento y asesoría fiscal
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/servicios"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Ver Servicios
            </Link>
            <Link
              href="/contacto"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors border-2 border-white"
            >
              Contactar Soporte
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}