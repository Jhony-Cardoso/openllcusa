import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    AlertCircle, Clock, CheckCircle2, XCircle,
    ArrowLeft, Bell, AlertTriangle, Info,
    FileText, Users, Package, TrendingDown
} from 'lucide-react'
import { PedidoModel } from '@/lib/models/pedido'

export default async function AlertasCriticasPage() {
    const { userId } = await auth()
    if (!userId) redirect('/sign-in')

    // Obtener todos los pedidos
    const pedidos = await PedidoModel.listarTodosAdmin()

    // Calcular alertas
    const now = new Date()
    const hace7Dias = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const hace14Dias = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
    const hace30Dias = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // 1. Pedidos pagados sin onboarding completado (más de 7 días)
    const onboardingPendiente = pedidos.filter(p => {
        const fecha = new Date(p.created_at)
        return p.estado_pedido === 'pagado' && p.paso_actual < 7 && fecha < hace7Dias
    })

    // 2. Pedidos con onboarding completado pero sin tramitar (más de 3 días)
    const hace3Dias = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    const sinTramitar = pedidos.filter(p => {
        const fecha = new Date(p.updated_at)
        return p.paso_actual === 7 && fecha < hace3Dias
    })

    // 3. Pedidos en tramitación hace más de 14 días
    const tramitacionLenta = pedidos.filter(p => {
        const fecha = new Date(p.updated_at)
        return p.paso_actual === 8 && fecha < hace14Dias
    })

    // 4. Pedidos pendientes de pago hace más de 30 días
    const pagosPendientes = pedidos.filter(p => {
        const fecha = new Date(p.created_at)
        return p.estado_pedido !== 'pagado' && fecha < hace30Dias
    })

    // 5. Pedidos sin actividad reciente (más de 30 días)
    const sinActividad = pedidos.filter(p => {
        const fecha = new Date(p.updated_at)
        return p.paso_actual < 9 && fecha < hace30Dias
    })

    // 6. Documentos faltantes
    const documentosFaltantes = pedidos.filter(p => {
        return p.estado_pedido === 'pagado' && p.paso_actual >= 7 && !p.metadata?.documento_identidad_path
    })

    const totalAlertas = onboardingPendiente.length + sinTramitar.length + tramitacionLenta.length +
        pagosPendientes.length + sinActividad.length + documentosFaltantes.length

    const alertasCriticas = onboardingPendiente.length + sinTramitar.length + tramitacionLenta.length
    const alertasAdvertencia = pagosPendientes.length + sinActividad.length + documentosFaltantes.length

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
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Bell className="text-red-600" size={36} />
                        Alertas Críticas
                    </h1>
                    <p className="text-slate-500 mt-1">Monitoreo de pedidos que requieren atención inmediata</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-slate-600">Total de Alertas</p>
                    <p className="text-5xl font-black text-slate-900">{totalAlertas}</p>
                </div>
            </div>

            {/* RESUMEN DE ALERTAS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 border-2 border-red-200 rounded-[2.5rem] p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center">
                            <AlertCircle className="text-white" size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Críticas</p>
                            <p className="text-3xl font-black text-red-900">{alertasCriticas}</p>
                        </div>
                    </div>
                    <p className="text-sm text-red-700 font-medium">Requieren acción inmediata</p>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 rounded-[2.5rem] p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center">
                            <AlertTriangle className="text-white" size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Advertencias</p>
                            <p className="text-3xl font-black text-amber-900">{alertasAdvertencia}</p>
                        </div>
                    </div>
                    <p className="text-sm text-amber-700 font-medium">Revisar próximamente</p>
                </div>

                <div className="bg-green-50 border-2 border-green-200 rounded-[2.5rem] p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 className="text-white" size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Al Día</p>
                            <p className="text-3xl font-black text-green-900">{pedidos.length - totalAlertas}</p>
                        </div>
                    </div>
                    <p className="text-sm text-green-700 font-medium">Sin problemas detectados</p>
                </div>
            </div>

            {/* ALERTAS CRÍTICAS */}
            {alertasCriticas > 0 && (
                <div className="bg-white rounded-[2.5rem] border-2 border-red-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-red-100 bg-red-50/50">
                        <h2 className="font-black text-red-900 flex items-center gap-2 uppercase tracking-tight text-sm">
                            <AlertCircle className="text-red-600" size={18} />
                            Alertas Críticas - Acción Inmediata Requerida
                        </h2>
                    </div>
                    <div className="divide-y divide-red-50">
                        {onboardingPendiente.length > 0 && (
                            <AlertSection
                                title="Onboarding Pendiente (+7 días)"
                                description="Clientes que pagaron pero no han completado el checklist legal"
                                pedidos={onboardingPendiente}
                                icon={Clock}
                                color="red"
                            />
                        )}
                        {sinTramitar.length > 0 && (
                            <AlertSection
                                title="Sin Tramitar (+3 días)"
                                description="SS-4 firmado pero no enviado al IRS"
                                pedidos={sinTramitar}
                                icon={FileText}
                                color="red"
                            />
                        )}
                        {tramitacionLenta.length > 0 && (
                            <AlertSection
                                title="Tramitación Lenta (+14 días)"
                                description="Pedidos en tramitación hace más de 2 semanas"
                                pedidos={tramitacionLenta}
                                icon={TrendingDown}
                                color="red"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* ADVERTENCIAS */}
            {alertasAdvertencia > 0 && (
                <div className="bg-white rounded-[2.5rem] border-2 border-amber-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-amber-100 bg-amber-50/50">
                        <h2 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tight text-sm">
                            <AlertTriangle className="text-amber-600" size={18} />
                            Advertencias - Revisar Próximamente
                        </h2>
                    </div>
                    <div className="divide-y divide-amber-50">
                        {pagosPendientes.length > 0 && (
                            <AlertSection
                                title="Pagos Pendientes (+30 días)"
                                description="Pedidos sin pago hace más de un mes"
                                pedidos={pagosPendientes}
                                icon={XCircle}
                                color="amber"
                            />
                        )}
                        {sinActividad.length > 0 && (
                            <AlertSection
                                title="Sin Actividad Reciente (+30 días)"
                                description="Pedidos estancados sin actualizaciones"
                                pedidos={sinActividad}
                                icon={Info}
                                color="amber"
                            />
                        )}
                        {documentosFaltantes.length > 0 && (
                            <AlertSection
                                title="Documentos Faltantes"
                                description="Pedidos pagados sin documento de identidad"
                                pedidos={documentosFaltantes}
                                icon={FileText}
                                color="amber"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* TODO BIEN */}
            {totalAlertas === 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-[2.5rem] p-12 text-center">
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-white" size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-green-900 mb-2">¡Todo al Día!</h3>
                    <p className="text-green-700 font-medium max-w-md mx-auto">
                        No hay alertas críticas ni advertencias. Todos los pedidos están siendo procesados correctamente.
                    </p>
                </div>
            )}
        </div>
    )
}

function AlertSection({ title, description, pedidos, icon: Icon, color }: any) {
    const colors: any = {
        red: {
            bg: 'bg-red-50',
            text: 'text-red-600',
            border: 'border-red-200',
        },
        amber: {
            bg: 'bg-amber-50',
            text: 'text-amber-600',
            border: 'border-amber-200',
        },
    }

    return (
        <div className="p-8">
            <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 ${colors[color].bg} ${colors[color].text} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={24} />
                </div>
                <div className="flex-1">
                    <h3 className="font-black text-slate-900 text-lg mb-1">{title}</h3>
                    <p className="text-sm text-slate-600 font-medium">{description}</p>
                    <p className="text-xs text-slate-400 font-bold mt-1">{pedidos.length} pedido(s) afectado(s)</p>
                </div>
            </div>

            <div className="space-y-3">
                {pedidos.slice(0, 5).map((pedido: any) => {
                    const diasDesde = Math.floor((new Date().getTime() - new Date(pedido.updated_at).getTime()) / (1000 * 60 * 60 * 24))

                    return (
                        <Link
                            key={pedido.id}
                            href={`/admin/pedidos/${pedido.id}`}
                            className={`flex items-center justify-between p-4 ${colors[color].bg} border ${colors[color].border} rounded-xl hover:scale-[1.02] transition-all group`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                                    <Package className="text-slate-400" size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">#{pedido.numero_pedido}</p>
                                    <p className="text-xs text-slate-500 font-medium">
                                        {pedido.paquetes?.nombre || pedido.servicios?.nombre || 'Servicio'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-600">Hace {diasDesde} días</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Paso {pedido.paso_actual}/9</p>
                            </div>
                        </Link>
                    )
                })}
                {pedidos.length > 5 && (
                    <p className="text-center text-xs text-slate-400 font-bold pt-2">
                        Y {pedidos.length - 5} más...
                    </p>
                )}
            </div>
        </div>
    )
}
