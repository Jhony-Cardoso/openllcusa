'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
    FileText, CheckCircle2, ShieldCheck, Loader2, Clock,
    AlertTriangle, ChevronLeft, ChevronRight, ZoomIn, ZoomOut
} from 'lucide-react'

export default function SS4FormViewer({
    pedidoId,
    isApproved,
    isCompleted
}: {
    pedidoId: string
    isApproved: boolean
    isCompleted: boolean
}) {
    const router = useRouter()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const [loading, setLoading] = useState(false)
    const [checked, setChecked] = useState(false)
    const [pdfLoading, setPdfLoading] = useState(true)
    const [pdfError, setPdfError] = useState<string | null>(null)
    const [numPages, setNumPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [scale, setScale] = useState(1.3)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [pdfDoc, setPdfDoc] = useState<any>(null)

    // Cargar PDF.js y el documento
    useEffect(() => {
        let cancelled = false

        const loadPdf = async () => {
            setPdfLoading(true)
            setPdfError(null)
            try {
                // Importar PDF.js dinámicamente (solo en cliente)
                const pdfjsLib = await import('pdfjs-dist')
                pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

                const pdfUrl = `/api/pedidos/${pedidoId}/tax-form-pdf?type=ss4`
                const doc = await pdfjsLib.getDocument({ url: pdfUrl, withCredentials: true }).promise

                if (!cancelled) {
                    setPdfDoc(doc)
                    setNumPages(doc.numPages)
                }
            } catch (err: unknown) {
                if (!cancelled) {
                    console.error('[SS4FormViewer] Error cargando PDF:', err)
                    setPdfError('No se pudo cargar el borrador del SS-4. Inténtalo de nuevo.')
                }
            } finally {
                if (!cancelled) setPdfLoading(false)
            }
        }

        loadPdf()
        return () => { cancelled = true }
    }, [pedidoId])

    // Renderizar la página actual en el canvas
    const renderPage = useCallback(async (pageNum: number, scaleVal: number) => {
        if (!pdfDoc || !canvasRef.current) return
        try {
            const page = await pdfDoc.getPage(pageNum)
            const viewport = page.getViewport({ scale: scaleVal })
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            if (!ctx) return

            canvas.width = viewport.width
            canvas.height = viewport.height

            await page.render({ canvasContext: ctx, viewport }).promise
        } catch (err) {
            console.error('[SS4FormViewer] Error renderizando página:', err)
        }
    }, [pdfDoc])

    useEffect(() => {
        if (pdfDoc) renderPage(currentPage, scale)
    }, [pdfDoc, currentPage, scale, renderPage])

    const handleApprove = async () => {
        if (!checked) return alert('Debes marcar la casilla para confirmar tu revisión.')
        setLoading(true)
        try {
            const res = await fetch(`/api/pedidos/${pedidoId}/approve-ss4`, { method: 'POST' })
            if (res.ok) router.refresh()
            else alert('Hubo un error al aprobar el documento. Inténtalo de nuevo.')
        } catch {
            alert('Error de conexión.')
        } finally {
            setLoading(false)
        }
    }

    const blockContextMenu = (e: React.MouseEvent) => e.preventDefault()

    return (
        <div className="mt-6 pt-6 border-t border-slate-100">
            <div className={`rounded-2xl border-2 overflow-hidden transition-all duration-500 ${isApproved
                ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
                : 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50'
                }`}>

                {/* Header */}
                <div className="p-6 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                        {isApproved
                            ? <CheckCircle2 className="text-green-600" size={22} />
                            : <AlertTriangle className="text-amber-500" size={22} />
                        }
                        <span className={`text-xs font-black uppercase tracking-widest ${isApproved ? 'text-green-700' : 'text-blue-700'
                            }`}>
                            {isApproved ? 'Borrador Aprobado' : 'Acción Requerida — Revisa y Aprueba tu SS-4'}
                        </span>
                    </div>
                    <h4 className={`text-xl font-black mb-1 ${isApproved ? 'text-green-900' : 'text-blue-900'}`}>
                        📄 Formulario SS-4 (Solicitud de EIN)
                    </h4>
                    <p className={`text-sm ${isApproved ? 'text-green-700' : 'text-blue-600'}`}>
                        {!isApproved && 'Revisa que todos los campos sean correctos. Estos son los datos que enviaremos al IRS para solicitar tu EIN.'}
                        {isApproved && !isCompleted && 'Borrador aprobado ✓ Nuestro equipo procederá con la tramitación ante el IRS.'}
                        {isApproved && isCompleted && 'Trámite finalizado. El EIN ha sido emitido y tu carta está disponible.'}
                    </p>
                </div>

                {/* ── Controles de navegación del PDF ── */}
                {!pdfLoading && !pdfError && numPages > 0 && (
                    <div className="mx-4 mb-3 flex items-center gap-3 bg-white/80 border border-slate-200 rounded-xl px-4 py-2 w-fit">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage <= 1}
                            className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-600"
                        ><ChevronLeft size={18} /></button>
                        <span className="text-sm font-medium text-slate-700 min-w-[80px] text-center">
                            Pág. {currentPage} / {numPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
                            disabled={currentPage >= numPages}
                            className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-600"
                        ><ChevronRight size={18} /></button>
                        <div className="w-px h-5 bg-slate-200 mx-1" />
                        <button
                            onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
                        ><ZoomOut size={18} /></button>
                        <span className="text-xs font-mono text-slate-500">{Math.round(scale * 100)}%</span>
                        <button
                            onClick={() => setScale(s => Math.min(3, s + 0.2))}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
                        ><ZoomIn size={18} /></button>
                    </div>
                )}

                {/* ── Canvas ── */}
                <div
                    ref={containerRef}
                    className="mx-4 mb-4 rounded-xl overflow-auto border border-slate-200 bg-slate-100 select-none"
                    style={{ maxHeight: '780px' }}
                    onContextMenu={blockContextMenu}
                >
                    {pdfLoading && (
                        <div className="flex flex-col items-center justify-center h-96 gap-3 text-slate-500">
                            <Loader2 className="animate-spin text-blue-500" size={36} />
                            <span className="text-sm font-medium">Cargando borrador…</span>
                        </div>
                    )}

                    {pdfError && (
                        <div className="flex flex-col items-center justify-center h-96 gap-3 text-red-500 p-8 text-center">
                            <FileText size={40} />
                            <p className="text-sm font-medium">{pdfError}</p>
                        </div>
                    )}

                    {!pdfLoading && !pdfError && (
                        <div className="flex justify-center p-4" onContextMenu={blockContextMenu}>
                            <canvas
                                ref={canvasRef}
                                onContextMenu={blockContextMenu}
                                className="shadow-lg rounded"
                                style={{ maxWidth: '100%', userSelect: 'none' }}
                            />
                        </div>
                    )}
                </div>

                {/* ── Checkbox de aprobación ── */}
                {!isApproved && (
                    <div className="mx-4 mb-6 space-y-4 bg-white p-5 rounded-xl border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="text-blue-600 flex-shrink-0" size={18} />
                            <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">Confirmación de Datos</p>
                        </div>
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="mt-0.5 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0 cursor-pointer"
                                checked={checked}
                                onChange={(e) => setChecked(e.target.checked)}
                            />
                            <span className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                                He revisado el borrador del Formulario SS-4 y confirmo que toda la información es <strong>correcta y veraz</strong>. Autorizo a Open LLC USA a presentar esta solicitud ante el IRS.
                            </span>
                        </label>
                        <button
                            onClick={handleApprove}
                            disabled={!checked || loading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                        >
                            {loading
                                ? <><Loader2 className="animate-spin" size={18} /> Procesando…</>
                                : <><ShieldCheck size={18} /> Aprobar Borrador SS-4</>
                            }
                        </button>
                    </div>
                )}

                {/* ── Estado post-aprobación ── */}
                {isApproved && (
                    <div className="mx-4 mb-6">
                        <div className="flex items-center gap-3 px-5 py-3.5 bg-green-100 text-green-800 rounded-xl font-bold border border-green-200 text-sm">
                            <CheckCircle2 size={18} />
                            Borrador aprobado correctamente
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
