'use client'

import { useState } from 'react'
import {
    Upload, X, FileText, CheckCircle2,
    AlertCircle, Loader2, Search
} from 'lucide-react'

interface UploadModalProps {
    isOpen: boolean
    onClose: () => void
    pedidos: any[]
}

export default function DocumentUploadModal({ isOpen, onClose, pedidos }: UploadModalProps) {
    const [step, setStep] = useState(1)
    const [selectedPedido, setSelectedPedido] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    if (!isOpen) return null

    const filteredPedidos = pedidos.filter(p =>
        p.numero_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user_id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleUpload = async () => {
        if (!file || !selectedPedido) return

        setUploading(true)
        // Simulación de carga
        await new Promise(resolve => setTimeout(resolve, 2000))
        setUploading(false)
        setStep(3) // Éxito
    }

    const reset = () => {
        setStep(1)
        setSelectedPedido('')
        setFile(null)
        setSearchTerm('')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={reset}
                onKeyDown={(e) => e.key === 'Escape' && reset()}
                tabIndex={-1}
            />

            {/* Modal */}
            <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Subir Documento Final</h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Paso {step} de 3</p>
                    </div>
                    <button
                        onClick={reset}
                        className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-900"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">

                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Seleccionar Pedido Asociado</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Buscar por # pedido o cliente..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-blue-500 transition-all shadow-inner"
                                    />
                                </div>

                                <div className="max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                                    {filteredPedidos.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => setSelectedPedido(p.id)}
                                            className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${selectedPedido === p.id
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-[0.98]'
                                                    : 'bg-white border-slate-100 text-slate-900 hover:border-blue-200'
                                                }`}
                                        >
                                            <div>
                                                <p className="font-black text-sm">#{p.numero_pedido.split('-')[1]}</p>
                                                <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedPedido === p.id ? 'text-blue-100' : 'text-slate-400'}`}>
                                                    {p.paquetes?.nombre || 'Servicio'}
                                                </p>
                                            </div>
                                            {selectedPedido === p.id && <CheckCircle2 size={18} />}
                                        </button>
                                    ))}
                                    {filteredPedidos.length === 0 && (
                                        <p className="text-center py-8 text-slate-400 text-xs font-bold uppercase tracking-widest">No se encontraron pedidos</p>
                                    )}
                                </div>
                            </div>

                            <button
                                disabled={!selectedPedido}
                                onClick={() => setStep(2)}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                            >
                                Siguiente Paso
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cargar Archivo (PDF, JPG)</label>
                                <div
                                    className={`border-2 border-dashed rounded-[2rem] p-12 text-center transition-all ${file ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-slate-50/50 hover:border-blue-200'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 shadow-sm ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-blue-600'
                                            }`}>
                                            {file ? <FileText size={32} /> : <Upload size={32} />}
                                        </div>
                                        <p className="font-black text-slate-900 mb-1">
                                            {file ? file.name : 'Selecciona el documento'}
                                        </p>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">
                                            {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Máximo 10MB'}
                                        </p>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-4 border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all"
                                >
                                    Volver
                                </button>
                                <button
                                    disabled={!file || uploading}
                                    onClick={handleUpload}
                                    className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-blue-200"
                                >
                                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                    {uploading ? 'Subiendo...' : 'Confirmar y Guardar'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="py-12 text-center space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-100 ring-8 ring-emerald-50">
                                <CheckCircle2 size={48} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">¡Documento Subido!</h3>
                                <p className="text-slate-500 font-medium mt-2 max-w-xs mx-auto">
                                    El archivo se ha asociado correctamente al pedido y el cliente ya puede verlo en su Dashboard.
                                </p>
                            </div>
                            <button
                                onClick={reset}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg"
                            >
                                Entendido, volver
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

function ChevronRight({ size, className }: { size?: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}
