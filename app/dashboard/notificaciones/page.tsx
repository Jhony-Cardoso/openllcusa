import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Bell, ArrowLeft } from 'lucide-react'
import { NotificacionService } from '@/lib/services/notificacion.service'

export default async function NotificacionesPage() {
    const { userId } = await auth()

    if (!userId) {
        redirect('/sign-in')
    }

    // Obtener todas las notificaciones (límite mayor)
    const { data: notificaciones } = await NotificacionService.obtenerPorUsuario(userId, 50)

    const getIconoTipo = (tipo: string) => {
        switch (tipo) {
            case 'pago_exitoso':
                return '💳'
            case 'pedido_completado':
                return '✅'
            case 'documento_listo':
                return '📄'
            case 'bienvenida':
                return '👋'
            default:
                return '🔔'
        }
    }

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
                    >
                        <ArrowLeft size={20} />
                        Volver al Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
                    <p className="text-gray-600 mt-2">
                        Mantente al día con todas las actualizaciones de tus pedidos
                    </p>
                </div>

                {/* Lista de notificaciones */}
                {notificaciones.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <Bell size={64} className="mx-auto mb-4 text-gray-300" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            No tienes notificaciones
                        </h2>
                        <p className="text-gray-600">
                            Cuando tengas actualizaciones, aparecerán aquí
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notificaciones.map((notif: any) => (
                            <div
                                key={notif.id}
                                className={`bg-white rounded-lg shadow p-6 transition-all hover:shadow-md ${!notif.leido ? 'border-l-4 border-blue-500' : ''
                                    }`}
                            >
                                <div className="flex gap-4">
                                    {/* Icono */}
                                    <div className="flex-shrink-0 text-3xl">
                                        {getIconoTipo(notif.tipo)}
                                    </div>

                                    {/* Contenido */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-900">
                                                    {notif.titulo}
                                                </h3>
                                                {!notif.leido && (
                                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                                                        Nueva
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-500 whitespace-nowrap">
                                                {formatearFecha(notif.created_at)}
                                            </span>
                                        </div>

                                        <p className="text-gray-700 mt-2">{notif.mensaje}</p>

                                        {notif.url && (
                                            <Link
                                                href={notif.url}
                                                className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                Ver detalles →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
