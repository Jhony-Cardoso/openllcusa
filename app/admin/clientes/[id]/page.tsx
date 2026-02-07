import { auth, currentUser, createClerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft, Mail, Calendar, User as UserIcon,
    Package, DollarSign, Clock, CheckCircle2,
    ShieldCheck, Activity, ChevronRight, ExternalLink,
    MapPin, Globe, Briefcase
} from 'lucide-react'
import { PedidoModel } from '@/lib/models/pedido'

export default async function AdminClienteDetallePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    // 1. Seguridad
    const { userId: adminId } = await auth()
    const userAdmin = await currentUser()

    if (!adminId) redirect('/sign-in')

    const adminEmails = [process.env.ADMIN_EMAIL, 'josemanuelguerranunez5@gmail.com']
    const isAdmin = adminEmails.includes(userAdmin?.emailAddresses[0]?.emailAddress || '')
    if (!isAdmin) redirect('/dashboard')

    // 2. Obtener datos del cliente de Clerk
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
    let user = null
    try {
        user = await clerk.users.getUser(id)
    } catch (e) {
        redirect('/admin/clientes')
    }

    // 3. Obtener pedidos del cliente
    // Usamos el modelo admin para ver todos los pedidos de este usuario
    const todosLosPedidos = await PedidoModel.listarTodosAdmin()
    const pedidos = todosLosPedidos.filter(p => p.user_id === id)

    const stats = {
        totalGastado: pedidos.filter(p => p.estado_pedido === 'pagado').reduce((acc, curr) => acc + (curr.total_pagado || 0), 0),
        pedidosTotales: pedidos.length,
        pedidosCompletos: pedidos.filter(p => p.paso_actual >= 7).length
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900">

            {/* NAVEGACIÓN */}
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/clientes"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Volver a Clientes
                </Link>
                <div className="flex items-center gap-3">
                    <a
                        href={`mailto:${user.emailAddresses[0]?.emailAddress}`}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                        <Mail size={16} />
                        Enviar Email
                    </a>
                </div>
            </div>

            {/* CABECERA PERFIL */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                    <div className="w-32 h-32 rounded-[2rem] border-4 border-slate-50 overflow-hidden shadow-xl">
                        <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                {user.firstName} {user.lastName}
                            </h1>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-widest w-fit mx-auto md:mx-0">
                                Cliente Verificado
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                            <Mail size={16} className="text-slate-300" />
                            {user.emailAddresses[0]?.emailAddress}
                        </p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4">
                            <Stat label="Total Invertido" value={`$${stats.totalGastado}`} icon={DollarSign} color="emerald" />
                            <Stat label="Pedidos Realizados" value={stats.pedidosTotales} icon={Package} color="blue" />
                            <Stat label="Checklists Listos" value={stats.pedidosCompletos} icon={CheckCircle2} color="purple" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* HISTORIAL DE PEDIDOS */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
                                <Activity className="text-blue-600" size={18} />
                                Historial de Trámites
                            </h2>
                        </div>

                        <div className="divide-y divide-slate-50">
                            {pedidos.length === 0 ? (
                                <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                    Este cliente no ha realizado ningún pedido todavía.
                                </div>
                            ) : (
                                pedidos.map(p => (
                                    <div key={p.id} className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-100">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 leading-tight">
                                                    #{p.numero_pedido.split('-')[1]} - {p.paquetes?.nombre || p.servicios?.nombre || 'Servicio'}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                    {new Date(p.created_at).toLocaleDateString()} • {p.estado_pedido}
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/admin/pedidos/${p.id}`}
                                            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-900 hover:text-white transition-all"
                                        >
                                            Ver Pedido
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                {/* DETALLES DE CUENTA */}
                <div className="space-y-6">
                    <section className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                        <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-6">Información de Cuenta</h3>
                        <div className="space-y-6">
                            <InfoRow label="ID de Usuario" value={user.id} />
                            <InfoRow label="Fecha de Registro" value={new Date(user.createdAt).toLocaleDateString()} />
                            <InfoRow label="Última Conexión" value={new Date(user.lastSignInAt || 0).toLocaleDateString()} />
                            <div className="pt-4 mt-4 border-t border-slate-50">
                                <button className="w-full py-4 border-2 border-red-50 text-red-500 rounded-2xl text-xs font-black hover:bg-red-50 transition-colors uppercase tracking-widest">
                                    Suspender Cuenta
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

function Stat({ label, value, icon: Icon, color }: any) {
    const colors: any = {
        emerald: 'text-emerald-600',
        blue: 'text-blue-600',
        purple: 'text-purple-600'
    }
    return (
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center ${colors[color]}`}>
                <Icon size={18} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-lg font-black text-slate-900 leading-none">{value}</p>
            </div>
        </div>
    )
}

function InfoRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold text-slate-800 break-all">{value}</p>
        </div>
    )
}
