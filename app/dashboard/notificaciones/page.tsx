import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Bell, ArrowLeft, CheckCircle2, CreditCard, FileText, Sparkles, Clock, Trash2 } from 'lucide-react'
import { NotificacionService } from '@/lib/services/notificacion.service'

export default async function NotificacionesPage() {
    const { userId } = await auth()
    if (!userId) redirect('/sign-in')

    // Obtener notificaciones reales
    const { data: notificaciones } = await NotificacionService.obtenerPorUsuario(userId, 50)

    const getIconoInfo = (tipo: string) => {
        switch (tipo) {
            case 'pago_exitoso':
                return { icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' }
            case 'pedido_completado':
                return { icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' }
            case 'documento_listo':
                return { icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' }
            case 'bienvenida':
                return { icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-50' }
            default:
                return { icon: Bell, color: 'text-slate-600', bg: 'bg-slate-50' }
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

            {/* Header */}
            <div className="mb-10">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors font-medium text-sm group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Volver al Panel
                </Link>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Notificaciones</h1>
                        <p className="text-slate-500 text-lg">Mantente al día con el progreso de tu empresa.</p>
                    </div>
                </div>
            </div>

            {/* Lista */}
            {notificaciones.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Bell className="text-slate-200" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Bandeja de entrada vacía</h2>
                    <p className="text-slate-500 max-w-sm mx-auto">
                        Aquí recibirás actualizaciones sobre tus pagos, documentos y el estado de tu LLC.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notificaciones.map((notif: any) => {
                        const { icon: Icon, color, bg } = getIconoInfo(notif.tipo)
                        return (
                            <div
                                key={notif.id}
                                className={`group relative bg-white border rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 \${
                                    !notif.leido ? 'border-blue-200 bg-blue-50/10' : 'border-slate-100'
                                }`}
                            >
                                <div className="flex gap-5">
                                    {/* Icono Dinámico */}
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 \${bg} \${color} transition-transform group-hover:scale-110`}>
                                        <Icon size={28} />
                                    </div>

                                    {/* Contenido */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-1">
                                            <h3 className={`font-bold text-lg leading-tight \${!notif.leido ? 'text-slate-900' : 'text-slate-700'}`}>
                                                {notif.titulo}
                                            </h3>
                                            <div className="flex items-center gap-2 text-slate-400 text-xs whitespace-nowrap">
                                                <Clock size={14} />
                                                {new Date(notif.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                            </div>
                                        </div>

                                        <p className={`text-sm leading-relaxed mb-4 \${!notif.leido ? 'text-slate-600' : 'text-slate-500'}`}>
                                            {notif.mensaje}
                                        </p>

                                        {/* Acciones */}
                                        <div className="flex items-center justify-between">
                                            {notif.url ? (
                                                <Link
                                                    href={notif.url}
                                                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                                >
                                                    Ver detalles
                                                    <ArrowLeft size={14} className="rotate-180" />
                                                </Link>
                                            ) : (
                                                <div />
                                            )}

                                            <div className="flex items-center gap-3">
                                                {!notif.leido && (
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    <div className="pt-8 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fin de las notificaciones</p>
                    </div>
                </div>
            )}
        </div>
    )
}
