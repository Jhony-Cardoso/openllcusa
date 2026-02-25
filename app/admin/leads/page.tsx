// app/admin/leads/page.tsx
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    Users, Search, Mail, Calendar,
    ChevronRight, MousePointer2, Briefcase,
    ArrowLeft, Bell, Trash2, TrendingUp
} from 'lucide-react'
import { LeadModel } from '@/lib/models/lead'

// Función auxiliar para el badge del tier
const getTierBadge = (score?: number) => {
    if (score === undefined || score === 0) return <span className="text-slate-300 italic text-[10px]">Pendiente</span>
    if (score >= 80) return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black uppercase">Tier 1</span>
    if (score >= 60) return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-black uppercase">Tier 2</span>
    return <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase">Tier 3/4</span>
}

export default async function AdminLeadsPage() {
    // 1. Verificar Admin
    const { userId: adminId } = await auth()
    const userAdmin = await currentUser()

    if (!adminId) redirect('/sign-in')

    const adminEmails = [process.env.ADMIN_EMAIL, 'josemanuelguerranunez5@gmail.com']
    const isAdmin = adminEmails.includes(userAdmin?.emailAddresses[0]?.emailAddress || '')
    if (!isAdmin) redirect('/dashboard')

    // 2. Obtener leads de la base de datos
    const leads = await LeadModel.obtenerRecientes(100)

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-slate-900">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm mb-4 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Volver al Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Leads</h1>
                    <p className="text-slate-500 mt-1">Sigue el interés de los usuarios que han completado el formulario de captación.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por email o situación..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all text-sm shadow-sm"
                    />
                </div>
            </div>

            {/* TABLA DE LEADS */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
                        <MousePointer2 className="text-blue-600" size={18} />
                        Prospectos Capturados ({leads.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Contacto</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Score / Tier</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Situación Fiscal</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead: any) => (
                                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0 group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold">
                                                {lead.nombre.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 leading-tight">{lead.nombre}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">{lead.email}</div>
                                                {lead.telefono && (
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tight">{lead.telefono}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="text-sm font-black text-slate-900">
                                                {lead.score || lead.metadata?.quiz_score || 0}%
                                            </div>
                                            {getTierBadge(lead.score || lead.metadata?.quiz_score)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold w-fit border border-slate-200">
                                            <Briefcase size={12} className="text-slate-400" />
                                            {lead.situacion}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                            <Calendar size={14} className="text-slate-300" />
                                            {new Date(lead.created_at).toLocaleDateString()}
                                            <span className="text-slate-300">•</span>
                                            {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <a
                                                href={`mailto:${lead.email}`}
                                                className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                                                title="Contactar por Email"
                                            >
                                                <Mail size={16} />
                                            </a>
                                            <div className="w-[1px] h-6 bg-slate-100 mx-1"></div>
                                            <button
                                                className="p-2.5 text-slate-300 hover:text-red-500 transition-all"
                                                title="Eliminar (No funcional)"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {leads.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                        No hay leads capturados todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TIP COMERCIAL */}
            <div className="bg-blue-600 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-100">
                <div>
                    <h3 className="text-xl font-black mb-1">¿Sabías que la conversión aumenta un 41%?</h3>
                    <p className="text-blue-100 opacity-90 text-sm">Contactar a un lead en los primeros 15 minutos marca la diferencia.</p>
                </div>
                <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-black text-sm hover:scale-105 transition-transform">
                    Ver Guía de Ventas
                </button>
            </div>
        </div>
    )
}
