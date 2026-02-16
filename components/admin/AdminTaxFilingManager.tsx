'use client'

import { useState } from 'react'
import { Upload, CheckCircle2, AlertCircle, Loader2, FileText, Download, Send } from 'lucide-react'

interface AdminTaxFilingManagerProps {
    pedidoId: string
    numeroPedido: string
    metadata: any
    taxData: any
}

export default function AdminTaxFilingManager({
    pedidoId,
    numeroPedido,
    metadata,
    taxData,
}: AdminTaxFilingManagerProps) {
    // DEBUG: Ver qué datos estamos recibiendo
    console.log('🔍 [AdminTaxFilingManager] Props recibidos:', {
        pedidoId,
        numeroPedido,
        metadata,
        taxData
    })

    const [uploading, setUploading] = useState(false)
    const [generating, setGenerating] = useState(false)
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

    const handleGenerateForms = async () => {
        setGenerating(true)
        setMessage(null)

        try {
            const response = await fetch(`/api/admin/pedidos/${pedidoId}/generar-formularios-fiscales`, {
                method: 'POST',
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al generar los formularios')
            }

            setMessage({ type: 'success', text: '✅ Formularios 5472 + 1120 generados exitosamente' })

            // Recargar página después de 2 segundos
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setGenerating(false)
        }
    }

    const handleUploadAcuseRecibo = async () => {
        if (!selectedFile) {
            setMessage({ type: 'error', text: 'Selecciona un archivo primero' })
            return
        }

        setUploading(true)
        setMessage(null)

        try {
            const formData = new FormData()
            formData.append('acuse_recibo', selectedFile)

            const response = await fetch(`/api/admin/pedidos/${pedidoId}/subir-acuse-recibo`, {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al subir el archivo')
            }

            setMessage({ type: 'success', text: '✅ Acuse de recibo subido exitosamente. El cliente ha sido notificado.' })
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

    const hasFormularios = metadata?.documents?.form_5472_url
    const hasAcuseRecibo = metadata?.acuse_recibo_path

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

            {/* INFORMACIÓN DEL TRÁMITE FISCAL */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
                <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FileText size={16} />
                    Datos del Formulario 5472 + 1120
                </h4>
                {taxData ? (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-xs font-bold text-indigo-600 mb-1">Año Fiscal</p>
                            <p className="font-bold text-indigo-900">{taxData?.taxYear || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-indigo-600 mb-1">Nombre LLC</p>
                            <p className="font-bold text-indigo-900">{taxData?.llcName || taxData?.llc?.name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-indigo-600 mb-1">EIN</p>
                            <p className="font-bold text-indigo-900">{taxData?.llcEin || taxData?.llc?.ein || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-indigo-600 mb-1">Estado</p>
                            <p className="font-bold text-indigo-900">{taxData?.llcState || taxData?.llc?.state || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-indigo-600 mb-1">Dueño</p>
                            <p className="font-bold text-indigo-900">{taxData?.ownerName || taxData?.owner?.name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-indigo-600 mb-1">País del Dueño</p>
                            <p className="font-bold text-indigo-900">{taxData?.ownerCountry || taxData?.owner?.country || 'N/A'}</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={18} />
                            <div>
                                <p className="font-bold text-yellow-900 text-sm">Datos fiscales no encontrados</p>
                                <p className="text-xs text-yellow-700 mt-1">
                                    Los datos fiscales no fueron guardados correctamente durante el checkout.
                                    El cliente necesita completar el formulario nuevamente.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* SECCIÓN: GENERAR FORMULARIOS */}
            {!hasFormularios && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <FileText size={16} />
                        Generar Formularios 5472 + 1120
                    </h4>
                    <p className="text-xs text-slate-600 mb-4">
                        Genera automáticamente los formularios fiscales basados en los datos proporcionados por el cliente.
                    </p>
                    <button
                        onClick={handleGenerateForms}
                        disabled={generating}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {generating ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Generando...
                            </>
                        ) : (
                            <>
                                <FileText size={18} />
                                Generar Formularios
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* SECCIÓN: DESCARGAR FORMULARIOS GENERADOS */}
            {hasFormularios && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
                    <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <FileText size={16} />
                        Formularios Generados
                    </h4>
                    <div className="bg-white border border-indigo-200 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle2 className="text-indigo-600" size={20} />
                            <p className="font-bold text-indigo-900">Formularios 5472 + 1120 listos</p>
                        </div>
                        <p className="text-xs text-indigo-700 mb-3">
                            Los formularios han sido generados y están listos para presentar al IRS.
                        </p>
                    </div>
                    <a
                        href={metadata.documents.form_5472_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                    >
                        <Download size={18} />
                        Descargar Formularios
                    </a>
                </div>
            )}

            {/* SECCIÓN: SUBIR ACUSE DE RECIBO */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Upload size={16} />
                    Subir Acuse de Recibo del IRS
                </h4>

                {hasAcuseRecibo ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle2 className="text-green-600" size={20} />
                            <p className="font-bold text-green-900">Acuse de Recibo ya subido</p>
                        </div>
                        <p className="text-xs text-green-700 mb-3">
                            Archivo: <span className="font-mono">{metadata.acuse_recibo_nombre}</span>
                        </p>
                        <p className="text-[10px] text-green-600">
                            Subido el {new Date(metadata.acuse_recibo_subida_fecha).toLocaleString()} por{' '}
                            {metadata.acuse_recibo_subida_por}
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
                                id="acuse-recibo-upload"
                            />
                            <label
                                htmlFor="acuse-recibo-upload"
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
                            onClick={handleUploadAcuseRecibo}
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
                                    Subir Acuse de Recibo
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* SECCIÓN: ESTADO DE TRAMITACIÓN */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">
                    Estado de Presentación ante el IRS
                </h4>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">Estado Actual</label>
                        <select
                            value={estadoTramitacion}
                            onChange={(e) => setEstadoTramitacion(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-800 focus:border-blue-500 outline-none"
                        >
                            <option value="pendiente">⏳ Pendiente de Presentación</option>
                            <option value="formularios_generados">📄 Formularios Generados</option>
                            <option value="enviado_irs">📤 Presentado ante el IRS</option>
                            <option value="acuse_recibido">✅ Acuse de Recibo Obtenido</option>
                            <option value="completado">🎉 Trámite Completado</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">Notas Administrativas</label>
                        <textarea
                            value={notasAdmin}
                            onChange={(e) => setNotasAdmin(e.target.value)}
                            rows={3}
                            placeholder="Ej: Presentado ante el IRS el 15/02/2026 vía fax. Número de confirmación: 123456"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium text-slate-800 focus:border-blue-500 outline-none resize-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
