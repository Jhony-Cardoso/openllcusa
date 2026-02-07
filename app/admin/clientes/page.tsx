import { auth, currentUser, createClerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    Users, Search, Mail, Calendar,
    ArrowUpRight, Package, DollarSign,
    MoreHorizontal, ChevronRight, User as UserIcon
} from 'lucide-react'
import { PedidoModel } from '@/lib/models/pedido'

export default async function AdminClientesPage() {
    // 1. Verificar Admin
    const { userId: adminId } = await auth()
    const userAdmin = await currentUser()

    if (!adminId) redirect('/sign-in')

    const adminEmails = [process.env.ADMIN_EMAIL, 'josemanuelguerranunez5@gmail.com']
    const isAdmin = adminEmails.includes(userAdmin?.emailAddresses[0]?.emailAddress || '')
    if (!isAdmin) redirect('/dashboard')

    // 2. Obtener datos de Clerk (Usuarios)
    // Nota: El SDK de Clerk permite listar usuarios. 
    // Usamos el cliente de backend de Clerk.
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
    const { data: users } = await clerk.users.getUserList({
        limit: 100,
        orderBy: '-created_at'
    })

    // 3. Obtener todos los pedidos para cruzar datos (estadísticas por cliente)
    const todosLosPedidos = await PedidoModel.listarTodosAdmin()

    // 4. Mapear usuarios con sus estadísticas
    const clientes = users.map(user => {
        const userPedidos = todosLosPedidos.filter(p => p.user_id === user.id)
        const totalGastado = userPedidos
            .filter(p => p.estado_pedido === 'pagado')
            .reduce((acc, curr) => acc + (curr.total_pagado || 0), 0)

        return {
            id: user.id,
            nombre: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Sin nombre',
            email: user.emailAddresses[0]?.emailAddress || 'Sin email',
            imagen: user.imageUrl,
            fechaRegistro: user.createdAt,
            numPedidos: userPedidos.length,
            totalGastado
        }
    })

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-slate-900">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Clientes</h1>
                    <p className="text-slate-500 mt-1">Administra los usuarios registrados y consulta su historial de actividad.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all text-sm shadow-sm"
                    />
                </div>
            </div>

            {/* TABLA DE CLIENTES */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
                        <Users className="text-blue-600" size={18} />
                        Usuarios Registrados ({clientes.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Contacto</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Actividad / Inversión</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0 group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 flex-shrink-0">
                                                <img src={c.imagen} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 leading-tight">{c.nombre}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tight">ID: {c.id.substring(0, 12)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                                            <Mail size={14} className="text-slate-300" />
                                            {c.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase w-fit">
                                                <Package size={12} />
                                                {c.numPedidos} Pedidos
                                            </div>
                                            <div className="font-black text-slate-900 text-sm mt-1">${c.totalGastado} Invertidos</div>
                                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                                <Calendar size={10} />
                                                Registrado el {new Date(c.fechaRegistro).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <a
                                                href={`mailto:${c.email}`}
                                                className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                                                title="Enviar Email"
                                            >
                                                <Mail size={16} />
                                            </a>
                                            <Link
                                                href={`/admin/clientes/${c.id}`}
                                                className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2.5 rounded-xl group-hover:scale-105 transition-transform shadow-sm"
                                            >
                                                Ver Perfil
                                                <ChevronRight size={14} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {clientes.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                        No hay clientes registrados todavía.
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
