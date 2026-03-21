'use client'

import { useState } from 'react'
import { Upload, CheckCircle2, AlertCircle, Loader2, FileText, Download, Send, Activity, Plus, Trash2, Calendar, DollarSign } from 'lucide-react'

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
    const [sendingDraft, setSendingDraft] = useState(false)
    const [showDraftModal, setShowDraftModal] = useState(false)
    const [draftNotes, setDraftNotes] = useState('')
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [estadoTramitacion, setEstadoTramitacion] = useState(metadata?.estado_tramitacion || 'pendiente')
    const [notasAdmin, setNotasAdmin] = useState(metadata?.notas_admin || '')
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState<any>(taxData || {})
    const [saving, setSaving] = useState(false)

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

    const handleSaveTaxData = async () => {
        setSaving(true)
        setMessage(null)
        try {
            // Sincronizar totales AUTOMÁTICAMENTE antes de guardar (Punto 2)
            const txs = editData.financials?.transactions || []
            let capCash = 0, capProp = 0, distCash = 0, distProp = 0
            
            txs.forEach((t: any) => {
                const amount = parseFloat(t.amountUSD) || 0
                if (t.type === 'contribution') {
                    if (t.isMonetary) capCash += amount
                    else capProp += amount
                } else if (t.type === 'distribution') {
                    if (t.isMonetary) distCash += amount
                    else distProp += amount
                }
            })

            const updatedEditData = {
                ...editData,
                financials: {
                    ...editData.financials,
                    capitalContributionCash: capCash,
                    capitalContributionProperty: capProp,
                    capitalDistributionCash: distCash,
                    capitalDistributionProperty: distProp
                }
            }

            const response = await fetch(`/api/admin/pedidos/${pedidoId}/actualizar-datos-fiscales`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taxData: updatedEditData }),
            })

            if (!response.ok) throw new Error('Error al guardar los datos')

            setMessage({ type: 'success', text: '✅ Datos fiscales actualizados. Ya puedes generar el PDF final.' })
            setIsEditing(false)
            // Recargar para sincronizar props y estado interno si es necesario
            setTimeout(() => window.location.reload(), 2000)
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setSaving(false)
        }
    }

    // Gestion de transacciones en el editor
    const addTx = () => {
        const newTx = {
            id: Math.random().toString(36).slice(2),
            date: '',
            type: 'contribution',
            concept: '',
            amountUSD: 0,
            isMonetary: true,
            paymentMethod: '',
            description: ''
        }
        setEditData({
            ...editData,
            financials: {
                ...editData.financials,
                transactions: [...(editData.financials?.transactions || []), newTx]
            }
        })
    }

    const removeTx = (id: string) => {
        setEditData({
            ...editData,
            financials: {
                ...editData.financials,
                transactions: editData.financials.transactions.filter((t: any) => t.id !== id)
            }
        })
    }

    const updateTx = (id: string, field: string, value: any) => {
        setEditData({
            ...editData,
            financials: {
                ...editData.financials,
                transactions: editData.financials.transactions.map((t: any) => 
                    t.id === id ? { ...t, [field]: field === 'amountUSD' ? parseFloat(value) || 0 : value } : t
                )
            }
        })
    }

    const handleSendDraft = async () => {
        setSendingDraft(true)
        setMessage(null)
        setShowDraftModal(false)

        try {
            const response = await fetch(`/api/admin/pedidos/${pedidoId}/enviar-borrador`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notasAdmin: draftNotes || undefined }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al enviar el borrador')
            }

            setMessage({ type: 'success', text: `✅ Borrador enviado correctamente. ${data.message || ''}` })
            setDraftNotes('')
            setTimeout(() => window.location.reload(), 2500)
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setSendingDraft(false)
        }
    }

    const hasFormularios = metadata?.documents?.form_5472_url
    const hasAcuseRecibo = metadata?.acuse_recibo_path
    const borradorEnviadoAt = metadata?.borrador_enviado_at
    const borradorEnviadoA = metadata?.borrador_enviado_a

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

                {/* DETALLES DE ASISTENCIA EXPERTA */}
                {(taxData?.assistedFilling || taxData?.assistedFillingNotes || (taxData?.bankStatements && taxData?.bankStatements.length > 0)) && (
                    <div className="mt-6 pt-6 border-t border-indigo-100 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-800 font-black text-[10px] uppercase tracking-widest">
                            <AlertCircle size={14} /> Modo Asistencia Experta Activo
                        </div>
                        
                        {taxData.assistedFillingNotes && (
                            <div className="bg-white/60 rounded-xl p-4 border border-indigo-100">
                                <p className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-tight">Notas del Cliente:</p>
                                <p className="text-sm text-indigo-900 leading-relaxed italic">"{taxData.assistedFillingNotes}"</p>
                            </div>
                        )}

                        {taxData.bankStatements && taxData.bankStatements.length > 0 && (
                            <div>
                                <p className="text-xs font-bold text-indigo-600 mb-3 uppercase tracking-tight">Extractos Bancarios Adjuntos:</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {taxData.bankStatements.map((value: string, i: number) => {
                                        // Ahora guardamos PATHS relativos, no URLs directas (Punto 1)
                                        const isPath = value.startsWith('tax-forms/')
                                        const isUrl = value.startsWith('http')
                                        
                                        const fileName = (isPath || isUrl)
                                            ? (value.split('/').pop()?.split('-').slice(1).join('-') || `Archivo ${i+1}`)
                                            : value
                                        
                                        const downloadUrl = isPath 
                                            ? `/api/admin/pedidos/${pedidoId}/descargar-extracto?path=${encodeURIComponent(value)}`
                                            : isUrl ? value : null
                                        
                                        return downloadUrl ? (
                                            <a 
                                                key={i} 
                                                href={downloadUrl} 
                                                target="_blank" 
                                                className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-indigo-100 hover:border-indigo-400 transition-colors group"
                                            >
                                                <span className="text-xs font-bold text-indigo-900 truncate max-w-[200px]">{fileName}</span>
                                                <Download size={14} className="text-indigo-400 group-hover:text-indigo-600" />
                                            </a>
                                        ) : (
                                            <div key={i} className="flex items-center justify-between bg-indigo-50/50 px-4 py-3 rounded-xl border border-dashed border-indigo-200">
                                                <span className="text-xs font-bold text-indigo-400 truncate max-w-[200px]">{fileName}</span>
                                                <span className="text-[9px] font-black text-indigo-300 uppercase">Procesando...</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* SECCIÓN: EDITOR DE DATOS (Solo si Alex necesita completar) */}
            {taxData && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                            <Activity size={16} className="text-blue-600" />
                            Completar / Editar Información
                        </h4>
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-xs font-black text-blue-600 hover:underline px-3 py-1 bg-blue-50 rounded-lg"
                        >
                            {isEditing ? 'Cancelar Edición' : 'Editar Datos Fiscales'}
                        </button>
                    </div>

                    {!isEditing ? (
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Si el cliente usó el Modo Asistencia, los campos de transacciones y preguntas adicionales estarán vacíos. Haz clic en <strong>Editar</strong> para completarlos antes de generar el PDF final.
                        </p>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                            {/* Editor de Transacciones Simplicado (Solo Totales para Alex) */}
                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                <div className="col-span-2">
                                    <h5 className="text-[10px] font-black text-slate-400 uppercase mb-3">Totales Supporting Statement (Parte IV)</h5>
                                </div>
                                <EditorItem label="Contribuciones Cash ($)" value={editData.financials?.capitalContributionCash || 0} 
                                    onChange={(v) => setEditData({...editData, financials: {...(editData.financials||{}), capitalContributionCash: parseFloat(v)||0}})} />
                                <EditorItem label="Contribuciones Non-Cash ($)" value={editData.financials?.capitalContributionProperty || 0} 
                                    onChange={(v) => setEditData({...editData, financials: {...(editData.financials||{}), capitalContributionProperty: parseFloat(v)||0}})} />
                                <EditorItem label="Distribuciones Cash ($)" value={editData.financials?.capitalDistributionCash || 0} 
                                    onChange={(v) => setEditData({...editData, financials: {...(editData.financials||{}), capitalDistributionCash: parseFloat(v)||0}})} />
                                <EditorItem label="Distribuciones Non-Cash ($)" value={editData.financials?.capitalDistributionProperty || 0} 
                                    onChange={(v) => setEditData({...editData, financials: {...(editData.financials||{}), capitalDistributionProperty: parseFloat(v)||0}})} />
                            </div>

                            {/* Preguntas Parte VII */}
                            <div className="space-y-3 border-t pt-4">
                                <h5 className="text-[10px] font-black text-slate-400 uppercase mb-2">Preguntas Parte VII (Checkboxes)</h5>
                                <CheckItem label="¿Pagó intereses a la parte relacionada?" checked={editData.additionalQuestions?.importGoods || false} 
                                    onChange={(c) => setEditData({...editData, additionalQuestions: {...(editData.additionalQuestions||{}), importGoods: c}})} />
                                <CheckItem label="¿Pagó alquileres?" checked={editData.additionalQuestions?.documentWarehouse || false} 
                                    onChange={(c) => setEditData({...editData, additionalQuestions: {...(editData.additionalQuestions||{}), documentWarehouse: c}})} />
                                <CheckItem label="¿Tiene Cost Sharing Arrangements?" checked={editData.additionalQuestions?.foreignParentCSA || false} 
                                    onChange={(c) => setEditData({...editData, additionalQuestions: {...(editData.additionalQuestions||{}), foreignParentCSA: c}})} />
                                <CheckItem label="¿Pagó Royalties?" checked={editData.additionalQuestions?.interestRoyaltyDeduction || false} 
                                    onChange={(c) => setEditData({...editData, additionalQuestions: {...(editData.additionalQuestions||{}), interestRoyaltyDeduction: c}})} />
                            </div>

                            {/* Gestión de Transacciones Individuales */}
                            <div className="border-t pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-[10px] font-black text-slate-400 uppercase">Listado de Transacciones Reportables (Part IV)</h5>
                                    <button 
                                        type="button"
                                        onClick={addTx}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-black hover:bg-emerald-100 transition-colors"
                                    >
                                        <Plus size={14} /> Añadir Transacción
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {(!editData.financials?.transactions || editData.financials.transactions.length === 0) ? (
                                        <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-2xl">
                                            <p className="text-xs text-slate-400 font-medium italic">No hay transacciones individuales registradas aún.</p>
                                        </div>
                                    ) : (
                                        editData.financials.transactions.map((tx: any, idx: number) => (
                                            <div key={tx.id || idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative group animate-in zoom-in-95 duration-200">
                                                <button 
                                                    onClick={() => removeTx(tx.id)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-red-200"
                                                >
                                                    <Trash2 size={12} />
                                                </button>

                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div className="md:col-span-1">
                                                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">Fecha</label>
                                                        <input 
                                                            type="date" 
                                                            value={tx.date || ''} 
                                                            onChange={(e) => updateTx(tx.id, 'date', e.target.value)}
                                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-1">
                                                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">Tipo</label>
                                                        <select
                                                            value={tx.type || 'contribution'}
                                                            onChange={(e) => updateTx(tx.id, 'type', e.target.value)}
                                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                                        >
                                                            <option value="contribution">Aportación (+)</option>
                                                            <option value="distribution">Reintegro (-)</option>
                                                        </select>
                                                    </div>
                                                    <div className="md:col-span-1">
                                                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">Importe ($)</label>
                                                        <input 
                                                            type="number" 
                                                            value={tx.amountUSD || 0} 
                                                            onChange={(e) => updateTx(tx.id, 'amountUSD', e.target.value)}
                                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-1">
                                                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">Naturaleza</label>
                                                        <select
                                                            value={tx.isMonetary ? 'monetary' : 'property'}
                                                            onChange={(e) => updateTx(tx.id, 'isMonetary', e.target.value === 'monetary')}
                                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                                        >
                                                            <option value="monetary">Monetaria (Efectivo/Wire)</option>
                                                            <option value="property">No Monetaria (Bienes/PP&E)</option>
                                                        </select>
                                                    </div>
                                                    <div className="md:col-span-2 mt-2">
                                                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">Método de Pago</label>
                                                        <select
                                                            value={tx.paymentMethod || ''}
                                                            onChange={(e) => updateTx(tx.id, 'paymentMethod', e.target.value)}
                                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                                        >
                                                            <option value="">— Sin especificar —</option>
                                                            <option value="Wire">Wire Transfer</option>
                                                            <option value="ACH">ACH Transfer</option>
                                                            <option value="Check">Check</option>
                                                            <option value="Cash">Cash</option>
                                                            <option value="Credit Card">Credit Card</option>
                                                            <option value="Zelle">Zelle</option>
                                                            <option value="Crypto">Cryptocurrency</option>
                                                        </select>
                                                    </div>
                                                    <div className="md:col-span-2 mt-2">
                                                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">Concepto / Descripción</label>
                                                        <input 
                                                            type="text" 
                                                            value={tx.description || tx.concept || ''} 
                                                            onChange={(e) => { updateTx(tx.id, 'description', e.target.value); updateTx(tx.id, 'concept', e.target.value) }}
                                                            placeholder="Ej: Inyección de capital inicial desde cuenta personal..."
                                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <button 
                                onClick={handleSaveTaxData}
                                disabled={saving}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                Guardar Cambios para el PDF
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* SECCIÓN: ENVIAR BORRADOR AL CLIENTE */}
            {taxData && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                <Send size={16} className="text-violet-600" />
                                Enviar Borrador al Cliente
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 font-medium">
                                Genera el PDF en tiempo real y lo envía por email con el PDF adjunto.
                            </p>
                        </div>
                        {borradorEnviadoAt && (
                            <div className="flex-shrink-0 ml-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-full text-[10px] font-black uppercase tracking-wide border border-violet-100">
                                    <CheckCircle2 size={11} />
                                    Enviado
                                </span>
                            </div>
                        )}
                    </div>

                    {borradorEnviadoAt && (
                        <div className="mb-4 p-3 bg-violet-50 border border-violet-100 rounded-xl">
                            <p className="text-[11px] text-violet-700 font-medium">
                                Último envío: <strong>{new Date(borradorEnviadoAt).toLocaleString('es-ES')}</strong> → {borradorEnviadoA}
                            </p>
                        </div>
                    )}

                    {!showDraftModal ? (
                        <button
                            onClick={() => setShowDraftModal(true)}
                            disabled={sendingDraft}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sendingDraft ? (
                                <><Loader2 size={18} className="animate-spin" /> Enviando...</>   
                            ) : (
                                <><Send size={18} /> {borradorEnviadoAt ? 'Re-enviar Borrador' : 'Enviar Borrador al Cliente'}</>
                            )}
                        </button>
                    ) : (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">
                                    Nota opcional para el cliente
                                </label>
                                <textarea
                                    value={draftNotes}
                                    onChange={(e) => setDraftNotes(e.target.value)}
                                    rows={3}
                                    placeholder="Ej: Hemos revisado tus extractos y preparado el borrador. Por favor, verifica los importes de las contribuciones..."
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium text-slate-800 text-sm focus:border-violet-400 outline-none resize-none transition-colors"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSendDraft}
                                    disabled={sendingDraft}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 disabled:opacity-50"
                                >
                                    {sendingDraft ? (
                                        <><Loader2 size={16} className="animate-spin" /> Generando y enviando...</>
                                    ) : (
                                        <><Send size={16} /> Confirmar y Enviar</>
                                    )}
                                </button>
                                <button
                                    onClick={() => { setShowDraftModal(false); setDraftNotes('') }}
                                    className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors text-sm"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

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
                        href={`/api/pedidos/${pedidoId}/descargar-formularios`}
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

function EditorItem({ label, value, onChange }: { label: string, value: any, onChange: (v: string) => void }) {
    return (
        <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1 ml-1">{label}</label>
            <input 
                type="number"
                value={value || 0}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-slate-900 text-sm focus:border-blue-500 outline-none"
            />
        </div>
    )
}

function CheckItem({ label, checked, onChange }: { label: string, checked: boolean, onChange: (c: boolean) => void }) {
    return (
        <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
            <input 
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span className="text-xs font-bold text-slate-700">{label}</span>
        </label>
    )
}
