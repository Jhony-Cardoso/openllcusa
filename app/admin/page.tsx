import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    Package, TrendingUp, Users, DollarSign,
    ArrowRight, Clock, CheckCircle2, AlertCircle,
    FileText, Activity, ExternalLink, MousePointer2
} from 'lucide-react'
import { PedidoModel } from '@/lib/models/pedido'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboardPage() {
    const pedidos = await PedidoModel.listarTodosAdmin()

    const stats = {
        totalPedidos: pedidos.length,
        gananciasEstimadas: pedidos.filter(p => p.estado_pedido === 'pagado').reduce((acc, curr) => acc + (curr.total_pagado || 0), 0),
        pedidosPendientes: pedidos.filter(p => p.estado_pedido !== 'pagado').length,
        onboardingPendiente: pedidos.filter(p => p.estado_pedido === 'pagado' && p.paso_actual < 7).length,
        tramitacionPendiente: pedidos.filter(p => p.estado_pedido === 'pagado' && (p.paso_actual === 7 || p.paso_actual === 8)).length
    }

    // Helper: nombre del servicio para cualquier tipo de pedido
    const getNombrePedido = (p: any) => {
        const esTaxFiling = p.metadata?.tipo_servicio === 'tax_filing_5472' ||
            (p.tax_data && Object.keys(p.tax_data).length > 0)
        if (esTaxFiling) return 'Form 5472 + 1120'
        return p.paquetes?.nombre || p.servicios?.nombre || p.paquete?.nombre || p.servicio?.nombre || 'Servicio'
    }

    // Pedidos que requieren atención: flujo normal (paso_actual < 9) + tax filing pagados sin documentos
    const pedidosParaAtencion = pedidos.filter(p => {
        if (p.estado_pedido !== 'pagado') return false
        const esTaxFiling = p.metadata?.tipo_servicio === 'tax_filing_5472' ||
            (p.tax_data && Object.keys(p.tax_data).length > 0)
        if (esTaxFiling) {
            // Aparece si aún no tiene el PDF del form 5472 adjunto
            return !p.metadata?.documents?.form_5472_url
        }
        return p.paso_actual < 9
    })

    const pedidosRecientes = pedidos.slice(0, 5)

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-slate-900">

            {/* SALUDO */}
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Panel de Control</h1>
                <p className="text-slate-500 mt-1">Bienvenido a la administración de Open LLC USA.</p>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Ingresos Totales" value={`$${stats.gananciasEstimadas}`} icon={DollarSign} color="blue" />
                <StatCard label="Ventas Realizadas" value={pedidos.filter(p => p.estado_pedido === 'pagado').length} icon={Package} color="emerald" />
                <StatCard label="Onboarding Pendiente" value={stats.onboardingPendiente} icon={Clock} color="amber" />
                <StatCard label="Total Usuarios" value={stats.totalPedidos} icon={Users} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LISTA DE ACCIONES PENDIENTES */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden text-slate-900">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
                                <Clock className="text-blue-600" size={18} />
                                Pedidos que requieren atención
                            </h2>
                            <Link href="/admin/pedidos" className="text-xs font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest flex items-center gap-1">
                                Ver todos <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="divide-y divide-slate-50">
                            {pedidosParaAtencion.length === 0 ? (
                                <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">¡Todo al día! No hay pedidos pendientes de acción.</div>
                            ) : (
                                pedidosParaAtencion
                                    .sort((a, b) => {
                                        const aTax = a.metadata?.tipo_servicio === 'tax_filing_5472' || (a.tax_data && Object.keys(a.tax_data).length > 0);
                                        const bTax = b.metadata?.tipo_servicio === 'tax_filing_5472' || (b.tax_data && Object.keys(b.tax_data).length > 0);
                                        const aPriority = aTax || a.paso_actual >= 7;
                                        const bPriority = bTax || b.paso_actual >= 7;
                                        if (aPriority && !bPriority) return -1;
                                        if (!aPriority && bPriority) return 1;
                                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                                    })
                                    .slice(0, 10).map(p => {
                                        const esTaxFiling = p.metadata?.tipo_servicio === 'tax_filing_5472' ||
                                            (p.tax_data && Object.keys(p.tax_data).length > 0)
                                        const isWaitingOnboarding = !esTaxFiling && p.paso_actual < 7;
                                        const isReadyForAdmin = esTaxFiling || p.paso_actual === 7;
                                        const isIRSProcessing = !esTaxFiling && p.paso_actual === 8;
                                        const nombre = getNombrePedido(p)

                                        return (
                                            <div key={p.id} className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${isReadyForAdmin ? 'bg-blue-50 text-blue-600' : isIRSProcessing ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                                                        {isReadyForAdmin ? <FileText size={24} /> : isIRSProcessing ? <Activity size={24} /> : <AlertCircle size={24} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 leading-tight">
                                                            #{p.numero_pedido.split('-')[1]} - {nombre}
                                                        </p>
                                                        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isReadyForAdmin ? 'text-blue-600' : isIRSProcessing ? 'text-indigo-600' : 'text-amber-500'}`}>
                                                            {esTaxFiling ? (
                                                                <span className="flex items-center gap-1"><FileText size={10} /> Datos fiscales recibidos — Pendiente preparar documentos</span>
                                                            ) : isReadyForAdmin ? (
                                                                <span className="flex items-center gap-1"><CheckCircle2 size={10} /> Checklist Recibido - Listo para tramitar</span>
                                                            ) : isIRSProcessing ? (
                                                                <span className="flex items-center gap-1"><Activity size={10} /> En tramitación ante el IRS</span>
                                                            ) : (
                                                                <span className="flex items-center gap-1"><Clock size={10} /> Esperando Checklist del cliente</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Link href={`/admin/pedidos/${p.id}`} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100">
                                                    Gestionar
                                                </Link>
                                            </div>
                                        )
                                    })
                            )}
                        </div>
                    </section>

                    {/* ÚLTIMOS PEDIDOS */}
                    <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden text-slate-900">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
                                <Activity className="text-blue-600" size={18} />
                                Actividad Reciente
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-50">
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pedido</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Monto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidosRecientes.map(p => (
                                        <tr key={p.id} className="border-b border-slate-50 last:border-0">
                                            <td className="px-8 py-4">
                                                <p className="font-bold text-slate-900 text-sm">{getNombrePedido(p)}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(p.created_at).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${p.estado_pedido === 'pagado' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                                    }`}>{p.estado_pedido}</span>
                                            </td>
                                            <td className="px-8 py-4 text-right font-black text-slate-900 text-sm">
                                                ${p.total_pagado || 0}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* SIDEBAR DASHBOARD */}
                <div className="space-y-6">
                    <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-2 leading-tight">Acceso Rápido NorthWest</h3>
                            <p className="text-blue-100 text-sm mb-6">Conéctate al portal mayorista para tramitar los certificados de formación.</p>
                            <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-lg">
                                Portal Registered Agent
                                <ExternalLink size={16} />
                            </button>
                        </div>
                        <Building2 className="absolute -right-4 -bottom-4 text-blue-500 opacity-20" size={120} />
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm text-slate-900">
                        <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-6">Soporte y Sistema</h3>
                        <div className="space-y-4">
                            <Link href="/admin/analiticas" className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                                <TrendingUp size={18} className="text-slate-400" />
                                Analíticas de Ventas
                            </Link>
                            <Link href="/admin/leads" className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                                <MousePointer2 size={18} className="text-slate-400" />
                                Gestión de Leads
                            </Link>
                            <Link href="/admin/alertas" className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                                <AlertCircle size={18} className="text-slate-400" />
                                Alertas Críticas
                            </Link>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

function StatCard({ label, value, icon: Icon, color }: any) {
    const colors: any = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        purple: 'bg-purple-50 text-purple-600',
    }
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-all">
            <div className={`w-12 h-12 ${colors[color]} rounded-2xl flex items-center justify-center mb-6`}>
                <Icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-3xl font-black text-slate-900">{value}</p>
        </div>
    )
}

function Building2({ className, size }: { className?: string, size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01" />
            <path d="M16 6h.01" />
            <path d="M12 6h.01" />
            <path d="M12 10h.01" />
            <path d="M12 14h.01" />
            <path d="M16 10h.01" />
            <path d="M16 14h.01" />
            <path d="M8 10h.01" />
            <path d="M8 14h.01" />
        </svg>
    )
}
