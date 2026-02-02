'use client'

import { useEffect, useState } from 'react'
import { Bell, Check, X } from 'lucide-react'
import Link from 'next/link'

interface Notificacion {
    id: string
    tipo: string
    titulo: string
    mensaje: string
    leido: boolean
    url?: string
    created_at: string
}

export default function NotificacionesWidget() {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
    const [mostrar, setMostrar] = useState(false)
    const [cargando, setCargando] = useState(false)
    const [noLeidas, setNoLeidas] = useState(0)

    const cargarNotificaciones = async () => {
        setCargando(true)
        try {
            const response = await fetch('/api/notificaciones?limite=5')
            if (response.ok) {
                const data = await response.json()
                setNotificaciones(data)
                setNoLeidas(data.filter((n: Notificacion) => !n.leido).length)
            }
        } catch (error) {
            console.error('Error cargando notificaciones:', error)
        } finally {
            setCargando(false)
        }
    }

    const marcarComoLeida = async (notificacionId: string) => {
        try {
            const response = await fetch('/api/notificaciones', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificacionId }),
            })

            if (response.ok) {
                setNotificaciones(prev =>
                    prev.map(n => n.id === notificacionId ? { ...n, leido: true } : n)
                )
                setNoLeidas(prev => Math.max(0, prev - 1))
            }
        } catch (error) {
            console.error('Error marcando notificación:', error)
        }
    }

    const marcarTodasComoLeidas = async () => {
        try {
            const response = await fetch('/api/notificaciones', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ marcarTodasComoLeidas: true }),
            })

            if (response.ok) {
                setNotificaciones(prev => prev.map(n => ({ ...n, leido: true })))
                setNoLeidas(0)
            }
        } catch (error) {
            console.error('Error marcando todas:', error)
        }
    }

    useEffect(() => {
        cargarNotificaciones()
        // Recargar cada 30 segundos
        const interval = setInterval(cargarNotificaciones, 30000)
        return () => clearInterval(interval)
    }, [])

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
        const ahora = new Date()
        const notif = new Date(fecha)
        const diff = ahora.getTime() - notif.getTime()
        const minutos = Math.floor(diff / 60000)
        const horas = Math.floor(diff / 3600000)
        const dias = Math.floor(diff / 86400000)

        if (minutos < 1) return 'Ahora'
        if (minutos < 60) return `Hace ${minutos}m`
        if (horas < 24) return `Hace ${horas}h`
        if (dias < 7) return `Hace ${dias}d`
        return notif.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    }

    return (
        <div className="relative">
            {/* Botón de notificaciones */}
            <button
                onClick={() => setMostrar(!mostrar)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Notificaciones"
            >
                <Bell size={20} className="text-gray-600" />
                {noLeidas > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                        {noLeidas > 9 ? '9+' : noLeidas}
                    </span>
                )}
            </button>

            {/* Panel de notificaciones */}
            {mostrar && (
                <>
                    {/* Overlay para cerrar al hacer clic fuera */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setMostrar(false)}
                    />

                    {/* Panel */}
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                            <div className="flex items-center gap-2">
                                {noLeidas > 0 && (
                                    <button
                                        onClick={marcarTodasComoLeidas}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        Marcar todas como leídas
                                    </button>
                                )}
                                <button
                                    onClick={() => setMostrar(false)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <X size={18} className="text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Lista de notificaciones */}
                        <div className="overflow-y-auto flex-1">
                            {cargando ? (
                                <div className="p-8 text-center text-gray-500">
                                    Cargando...
                                </div>
                            ) : notificaciones.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Bell size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>No tienes notificaciones</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {notificaciones.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`p-4 hover:bg-gray-50 transition-colors ${!notif.leido ? 'bg-blue-50' : ''
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                {/* Icono */}
                                                <div className="flex-shrink-0 text-2xl">
                                                    {getIconoTipo(notif.tipo)}
                                                </div>

                                                {/* Contenido */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="font-semibold text-sm text-gray-900">
                                                            {notif.titulo}
                                                        </h4>
                                                        {!notif.leido && (
                                                            <button
                                                                onClick={() => marcarComoLeida(notif.id)}
                                                                className="flex-shrink-0 p-1 hover:bg-white rounded"
                                                                title="Marcar como leída"
                                                            >
                                                                <Check size={16} className="text-blue-600" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {notif.mensaje}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-xs text-gray-400">
                                                            {formatearFecha(notif.created_at)}
                                                        </span>
                                                        {notif.url && (
                                                            <Link
                                                                href={notif.url}
                                                                onClick={() => {
                                                                    marcarComoLeida(notif.id)
                                                                    setMostrar(false)
                                                                }}
                                                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                            >
                                                                Ver detalles →
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notificaciones.length > 0 && (
                            <div className="p-3 border-t border-gray-200 text-center">
                                <Link
                                    href="/dashboard/notificaciones"
                                    onClick={() => setMostrar(false)}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Ver todas las notificaciones
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
