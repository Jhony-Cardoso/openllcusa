import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    TrendingUp, TrendingDown, DollarSign, Package,
    Users, Calendar, Download, ArrowLeft,
    BarChart3, PieChart, Activity, Clock
} from 'lucide-react'
import { PedidoModel } from '@/lib/models/pedido'

export default async function AnaliticasPage() {
    const { userId } = await auth()
    if (!userId) redirect('/sign-in')

    // Obtener todos los pedidos
    const pedidos = await PedidoModel.listarTodosAdmin()

    // Calcular métricas
    const now = new Date()
    const mesActual = now.getMonth()
    const añoActual = now.getFullYear()
    const mesAnterior = mesActual === 0 ? 11 : mesActual - 1
    const añoMesAnterior = mesActual === 0 ? añoActual - 1 : añoActual

    const pedidosMesActual = pedidos.filter(p => {
        const fecha = new Date(p.created_at)
        return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual
    })

    const pedidosMesAnterior = pedidos.filter(p => {
        const fecha = new Date(p.created_at)
        return fecha.getMonth() === mesAnterior && fecha.getFullYear() === añoMesAnterior
    })

    const pedidosPagados = pedidos.filter(p => p.estado_pedido === 'pagado')
    const pedidosPagadosMesActual = pedidosMesActual.filter(p => p.estado_pedido === 'pagado')
    const pedidosPagadosMesAnterior = pedidosMesAnterior.filter(p => p.estado_pedido === 'pagado')

    const ingresosMesActual = pedidosPagadosMesActual.reduce((acc, p) => acc + (p.total_pagado || 0), 0)
    const ingresosMesAnterior = pedidosPagadosMesAnterior.reduce((acc, p) => acc + (p.total_pagado || 0), 0)
    const ingresosTotal = pedidosPagados.reduce((acc, p) => acc + (p.total_pagado || 0), 0)

    const tasaConversionMesActual = pedidosMesActual.length > 0
        ? (pedidosPagadosMesActual.length / pedidosMesActual.length) * 100
        : 0

    const crecimientoIngresos = ingresosMesAnterior > 0
        ? ((ingresosMesActual - ingresosMesAnterior) / ingresosMesAnterior) * 100
        : 0

    const crecimientoPedidos = pedidosMesAnterior.length > 0
        ? ((pedidosMesActual.length - pedidosMesAnterior.length) / pedidosMesAnterior.length) * 100
        : 0

    // Calcular tiempo promedio de tramitación
    const pedidosCompletados = pedidos.filter(p => p.paso_actual >= 9)
    const tiemposPromedio = pedidosCompletados.map(p => {
        const inicio = new Date(p.created_at)
        const fin = new Date(p.updated_at)
        return (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24) // días
    })
    const tiempoPromedioTramitacion = tiemposPromedio.length > 0
        ? tiemposPromedio.reduce((a, b) => a + b, 0) / tiemposPromedio.length
        : 0

    // Distribución por estado
    const distribucionEstados = {
        pendiente: pedidos.filter(p => p.estado_pedido !== 'pagado').length,
        pagado: pedidosPagados.length,
        tramitando: pedidos.filter(p => p.paso_actual >= 7 && p.paso_actual < 9).length,
        completado: pedidosCompletados.length,
    }

    // Últimos 6 meses de ventas
    const ventasPorMes = Array.from({ length: 6 }, (_, i) => {
        const mes = new Date(añoActual, mesActual - i, 1)
        const pedidosMes = pedidos.filter(p => {
            const fecha = new Date(p.created_at)
            return fecha.getMonth() === mes.getMonth() && fecha.getFullYear() === mes.getFullYear()
        })
        const ingresosMes = pedidosMes
            .filter(p => p.estado_pedido === 'pagado')
            .reduce((acc, p) => acc + (p.total_pagado || 0), 0)

        return {
            mes: mes.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
            pedidos: pedidosMes.length,
            ingresos: ingresosMes,
        }
    }).reverse()

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-slate-900">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm mb-4 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Volver al Dashboard
                    </Link>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Analíticas de Ventas</h1>
                    <p className="text-slate-500 mt-1">Métricas y tendencias de tu negocio</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    <Download size={18} />
                    Exportar Reporte
                </button>
            </div>

            {/* MÉTRICAS PRINCIPALES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    label="Ingresos Este Mes"
                    value={`$${ingresosMesActual.toLocaleString()}`}
                    change={crecimientoIngresos}
                    icon={DollarSign}
                    color="blue"
                />
                <MetricCard
                    label="Pedidos Este Mes"
                    value={pedidosMesActual.length}
                    change={crecimientoPedidos}
                    icon={Package}
                    color="emerald"
                />
                <MetricCard
                    label="Tasa de Conversión"
                    value={`${tasaConversionMesActual.toFixed(1)}%`}
                    change={null}
                    icon={TrendingUp}
                    color="purple"
                />
                <MetricCard
                    label="Tiempo Promedio"
                    value={`${tiempoPromedioTramitacion.toFixed(0)} días`}
                    change={null}
                    icon={Clock}
                    color="amber"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* GRÁFICO DE VENTAS */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
                            <BarChart3 className="text-blue-600" size={18} />
                            Tendencia de Ventas (Últimos 6 Meses)
                        </h2>
                    </div>
                    <div className="p-8">
                        <div className="space-y-4">
                            {ventasPorMes.map((mes, idx) => {
                                const maxIngresos = Math.max(...ventasPorMes.map(m => m.ingresos))
                                const porcentaje = maxIngresos > 0 ? (mes.ingresos / maxIngresos) * 100 : 0

                                return (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-bold text-slate-600">{mes.mes}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs text-slate-400 font-bold">{mes.pedidos} pedidos</span>
                                                <span className="font-black text-slate-900">${mes.ingresos.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                                                style={{ width: `${porcentaje}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* DISTRIBUCIÓN POR ESTADO */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
                                <PieChart className="text-blue-600" size={18} />
                                Distribución de Pedidos
                            </h2>
                        </div>
                        <div className="p-8 space-y-4">
                            <EstadoBar label="Pendientes" value={distribucionEstados.pendiente} total={pedidos.length} color="amber" />
                            <EstadoBar label="Pagados" value={distribucionEstados.pagado} total={pedidos.length} color="green" />
                            <EstadoBar label="Tramitando" value={distribucionEstados.tramitando} total={pedidos.length} color="blue" />
                            <EstadoBar label="Completados" value={distribucionEstados.completado} total={pedidos.length} color="emerald" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200">
                        <h3 className="text-xl font-black mb-2">Ingresos Totales</h3>
                        <p className="text-4xl font-black mb-4">${ingresosTotal.toLocaleString()}</p>
                        <p className="text-blue-100 text-sm font-medium">
                            De {pedidosPagados.length} pedidos completados
                        </p>
                    </div>
                </div>
            </div>

            {/* TABLA DE RESUMEN */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
                        <Activity className="text-blue-600" size={18} />
                        Resumen Comparativo
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Período</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Pedidos</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Pagados</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ingresos</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Conversión</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-50">
                                <td className="px-8 py-4 font-bold text-slate-900">Este Mes</td>
                                <td className="px-8 py-4 text-right font-bold text-slate-900">{pedidosMesActual.length}</td>
                                <td className="px-8 py-4 text-right font-bold text-slate-900">{pedidosPagadosMesActual.length}</td>
                                <td className="px-8 py-4 text-right font-bold text-slate-900">${ingresosMesActual.toLocaleString()}</td>
                                <td className="px-8 py-4 text-right font-bold text-green-600">{tasaConversionMesActual.toFixed(1)}%</td>
                            </tr>
                            <tr className="border-b border-slate-50">
                                <td className="px-8 py-4 font-bold text-slate-600">Mes Anterior</td>
                                <td className="px-8 py-4 text-right font-bold text-slate-600">{pedidosMesAnterior.length}</td>
                                <td className="px-8 py-4 text-right font-bold text-slate-600">{pedidosPagadosMesAnterior.length}</td>
                                <td className="px-8 py-4 text-right font-bold text-slate-600">${ingresosMesAnterior.toLocaleString()}</td>
                                <td className="px-8 py-4 text-right font-bold text-slate-600">
                                    {pedidosMesAnterior.length > 0 ? ((pedidosPagadosMesAnterior.length / pedidosMesAnterior.length) * 100).toFixed(1) : 0}%
                                </td>
                            </tr>
                            <tr>
                                <td className="px-8 py-4 font-black text-slate-900">Total Histórico</td>
                                <td className="px-8 py-4 text-right font-black text-slate-900">{pedidos.length}</td>
                                <td className="px-8 py-4 text-right font-black text-slate-900">{pedidosPagados.length}</td>
                                <td className="px-8 py-4 text-right font-black text-slate-900">${ingresosTotal.toLocaleString()}</td>
                                <td className="px-8 py-4 text-right font-black text-slate-900">
                                    {pedidos.length > 0 ? ((pedidosPagados.length / pedidos.length) * 100).toFixed(1) : 0}%
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function MetricCard({ label, value, change, icon: Icon, color }: any) {
    const colors: any = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        purple: 'bg-purple-50 text-purple-600',
        amber: 'bg-amber-50 text-amber-600',
    }

    const isPositive = change !== null && change > 0
    const isNegative = change !== null && change < 0

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-all">
            <div className={`w-12 h-12 ${colors[color]} rounded-2xl flex items-center justify-center mb-6`}>
                <Icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-3xl font-black text-slate-900 mb-2">{value}</p>
            {change !== null && (
                <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-slate-400'}`}>
                    {isPositive ? <TrendingUp size={16} /> : isNegative ? <TrendingDown size={16} /> : null}
                    {change !== null && `${change > 0 ? '+' : ''}${change.toFixed(1)}%`}
                </div>
            )}
        </div>
    )
}

function EstadoBar({ label, value, total, color }: any) {
    const porcentaje = total > 0 ? (value / total) * 100 : 0
    const colors: any = {
        amber: 'bg-amber-500',
        green: 'bg-green-500',
        blue: 'bg-blue-500',
        emerald: 'bg-emerald-500',
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-600">{label}</span>
                <span className="font-black text-slate-900">{value}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                    className={`${colors[color]} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${porcentaje}%` }}
                ></div>
            </div>
        </div>
    )
}
