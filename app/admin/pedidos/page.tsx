import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    Package, Search, Filter, ArrowUpRight,
    Clock, CheckCircle2, AlertCircle, MoreHorizontal,
    ChevronRight, CreditCard, User as UserIcon
} from 'lucide-react'
import { PedidoModel } from '@/lib/models/pedido'

export default async function AdminPedidosPage() {
    const pedidos = await PedidoModel.listarTodosAdmin()

    const stats = {
        total: pedidos.length,
        pagados: pedidos.filter(p => p.estado_pedido === 'pagado').length,
        pendientes: pedidos.filter(p => p.estado_pedido !== 'pagado').length,
        onboardingCompletado: pedidos.filter(p => p.paso_actual >= 7).length
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-slate-900">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Pedidos</h1>
                    <p className="text-slate-500 mt-1">Supervisa y tramita todas las compras de la plataforma.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <Filter size={16} />
                        Filtrar
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                        Exportar CSV
                    </button>
                </div>
            </div>

            {/* STATS RAPIDAS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Pedidos', value: stats.total, color: 'blue' },
                    { label: 'Ventas Pagadas', value: stats.pagados, color: 'emerald' },
                    { label: 'Pendientes Pago', value: stats.pendientes, color: 'amber' },
                    { label: 'Checklist Legal Listo', value: stats.onboardingCompletado, color: 'purple' },
                ].map((s) => (
                    <div key={s.label} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                        <p className={`text-3xl font-black text-slate-900`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* TABLA DE PEDIDOS */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
                        <Package className="text-blue-600" size={18} />
                        Listado Reciente
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Pedido</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Servicio / Estado</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Pago</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Onboarding</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.map((p) => {
                                const isPaid = p.estado_pedido === 'pagado'
                                const onboardingDone = p.paso_actual >= 7
                                const servicio = p.paquetes?.nombre || p.servicios?.nombre || 'Servicio'
                                const estadoUsa = p.estados_usa?.codigo || 'N/A'

                                return (
                                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0 group">
                                        <td className="px-6 py-5">
                                            <div className="font-black text-slate-900 leading-tight">#{p.numero_pedido?.split('-')[1]}</div>
                                            <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase">
                                                {new Date(p.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-700">{servicio}</span>
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black rounded-md">{estadoUsa}</span>
                                            </div>
                                            <div className="text-xs text-slate-400 mt-0.5 mt-1 font-medium">{p.user_id?.substring(0, 12)}...</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {isPaid ? (
                                                <div className="flex items-center gap-1.5 text-emerald-600 font-black text-xs uppercase bg-emerald-50 px-3 py-1.5 rounded-full w-fit">
                                                    <CheckCircle2 size={14} />
                                                    Pagado
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-amber-600 font-black text-xs uppercase bg-amber-50 px-3 py-1.5 rounded-full w-fit">
                                                    <Clock size={14} />
                                                    Pendiente
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            {onboardingDone ? (
                                                <div className="flex items-center gap-1.5 text-purple-600 font-black text-xs uppercase bg-purple-50 px-3 py-1.5 rounded-full w-fit">
                                                    <CheckCircle2 size={14} />
                                                    Completado
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-slate-400 font-black text-xs uppercase bg-slate-50 px-3 py-1.5 rounded-full w-fit">
                                                    <AlertCircle size={14} />
                                                    Pendiente
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Link
                                                href={`/admin/pedidos/${p.id}`}
                                                className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-xl group-hover:scale-105 transition-transform"
                                            >
                                                Gestionar
                                                <ChevronRight size={14} />
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })}

                            {pedidos.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                            <Package className="text-slate-200" size={32} />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No hay pedidos disponibles</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
