'use client'

import { useState } from 'react'
import { Upload, CheckCircle2, AlertCircle, Loader2, FileText, Download, Clock } from 'lucide-react'

interface AdminDocumentManagerProps {
    pedidoId: string
    numeroPedido: string
    pasoActual: number
    metadata: any
}

export default function AdminDocumentManager({
    pedidoId,
    numeroPedido,
    pasoActual,
    metadata,
}: AdminDocumentManagerProps) {
    const [uploading, setUploading] = useState(false)
    const [updating, setUpdating] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [estadoTramitacion, setEstadoTramitacion] = useState(metadata?.estado_tramitacion || 'pendiente')
    const [notasAdmin, setNotasAdmin] = useState(metadata?.notas_admin || '')

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.type !== 'application/pdf') {
                setMessage({ type: 'error', text: 'Solo se permiten archivos PDF' })
                return
            }
            if (file.size > 10 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'El archivo es demasiado grande (máx 10MB)' })
                return
            }
            setSelectedFile(file)
            setMessage(null)
        }
    }

    const handleUploadCartaEIN = async () => {
        if (!selectedFile) {
            setMessage({ type: 'error', text: 'Selecciona un archivo primero' })
            return
        }

        setUploading(true)
        setMessage(null)

        try {
            const formData = new FormData()
            formData.append('carta_ein', selectedFile)

            const response = await fetch(`/api/admin/pedidos/${pedidoId}/subir-carta-ein`, {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al subir el archivo')
            }

            setMessage({ type: 'success', text: '✅ Carta EIN subida exitosamente. El cliente ha sido notificado.' })
            setSelectedFile(null)

            // Recargar página después de 2 segundos
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setUploading(false)
        }
    }

    const handleUpdateEstado = async (nuevoPaso: number) => {
        setUpdating(true)
        setMessage(null)

        try {
            const response = await fetch(`/api/admin/pedidos/${pedidoId}/actualizar-estado`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paso_actual: nuevoPaso,
                    estado_tramitacion: estadoTramitacion,
                    notas_admin: notasAdmin,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al actualizar el estado')
            }

            setMessage({ type: 'success', text: '✅ Estado actualizado exitosamente' })

            // Recargar página después de 1 segundo
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setUpdating(false)
        }
    }

    const handleGenerarBorrador = async () => {
        setUpdating(true)
        setMessage(null)
        try {
            const res = await fetch(`/api/admin/pedidos/${pedidoId}/generar-borrador-ss4`, { method: 'POST' })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Error al generar borrador')
            setMessage({ type: 'success', text: '✅ Borrador generado y cliente notificado por email.' })
            setTimeout(() => window.location.reload(), 2000)
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setUpdating(false)
        }
    }

    const hasCartaEIN = metadata?.carta_ein_path
    const hasSS4 = pasoActual >= 7
    const hasDraft = metadata?.borrador_ss4_path

    return (
        <div className="space-y-6">
            {/* MENSAJE DE FEEDBACK */}
            {message && (
                <div
                    className={`p-4 rounded-2xl border flex items-start gap-3 ${message.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                        }`}
                >
                    {message.type === 'success' ? (
                        <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                    ) : (
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-bold">{message.text}</p>
                </div>
            )}

            {/* SECCIÓN: DESCARGAR SS-4 Y GENERAR BORRADOR */}
            {hasSS4 && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <FileText size={16} />
                        Gestión Formulario SS-4 (EIN)
                    </h4>
                    <p className="text-xs text-blue-700 mb-4">
                        El cliente completó el checklist legal. Ahora puedes generar el borrador para su revisión o descargar el PDF final.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <a
                            href={`/api/admin/pedidos/${pedidoId}/descargar-ss4`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                        >
                            <Download size={18} />
                            Descargar SS-4
                        </a>

                        <button
                            onClick={handleGenerarBorrador}
                            disabled={updating}
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${hasDraft
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                                }`}
                        >
                            {updating ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                            {hasDraft ? 'Regenerar Borrador para Cliente' : 'Generar Borrador para Cliente'}
                        </button>
                    </div>

                    {hasDraft && (
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                            {metadata.borrador_ss4_approved ? (
                                <span className="text-green-600 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Aprobado por cliente el {new Date(metadata.borrador_ss4_approved_at).toLocaleDateString()}
                                </span>
                            ) : (
                                <span className="text-amber-600 flex items-center gap-1">
                                    <Clock size={12} /> Pendiente de aprobación del cliente
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* SECCIÓN: SUBIR CARTA EIN */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Upload size={16} />
                    Subir Carta EIN del IRS
                </h4>

                {hasCartaEIN ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle2 className="text-green-600" size={20} />
                            <p className="font-bold text-green-900">Carta EIN ya subida</p>
                        </div>
                        <p className="text-xs text-green-700 mb-3">
                            Archivo: <span className="font-mono">{metadata.carta_ein_nombre}</span>
                        </p>
                        <p className="text-[10px] text-green-600">
                            Subida el {new Date(metadata.carta_ein_subida_fecha).toLocaleString()} por{' '}
                            {metadata.carta_ein_subida_por}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="carta-ein-upload"
                            />
                            <label
                                htmlFor="carta-ein-upload"
                                className="cursor-pointer flex flex-col items-center gap-3"
                            >
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                    <Upload className="text-slate-400" size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 mb-1">
                                        {selectedFile ? selectedFile.name : 'Seleccionar archivo PDF'}
                                    </p>
                                    <p className="text-xs text-slate-500">Máximo 10MB</p>
                                </div>
                            </label>
                        </div>

                        <button
                            onClick={handleUploadCartaEIN}
                            disabled={!selectedFile || uploading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Subiendo...
                                </>
                            ) : (
                                <>
                                    <Upload size={18} />
                                    Subir Carta EIN
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* SECCIÓN: ACTUALIZAR ESTADO DE TRAMITACIÓN */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">
                    Estado de Tramitación ante el IRS
                </h4>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">Estado Actual</label>
                        <select
                            value={estadoTramitacion}
                            onChange={(e) => setEstadoTramitacion(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-800 focus:border-blue-500 outline-none"
                        >
                            <option value="pendiente">⏳ Pendiente de Envío</option>
                            <option value="enviado_irs">📤 Enviado al IRS</option>
                            <option value="en_revision">🔍 En Revisión por el IRS</option>
                            <option value="aprobado">✅ Aprobado - EIN Asignado</option>
                            <option value="rechazado">❌ Rechazado</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">Notas Administrativas</label>
                        <textarea
                            value={notasAdmin}
                            onChange={(e) => setNotasAdmin(e.target.value)}
                            rows={3}
                            placeholder="Ej: Enviado al IRS el 13/02/2026 vía fax. Número de confirmación: 123456"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium text-slate-800 focus:border-blue-500 outline-none resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleUpdateEstado(8)}
                            disabled={updating || pasoActual >= 8}
                            className="px-4 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {updating ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Marcar: Tramitando'}
                        </button>
                        <button
                            onClick={() => handleUpdateEstado(9)}
                            disabled={updating || pasoActual >= 9}
                            className="px-4 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {updating ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Marcar: Completado'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
