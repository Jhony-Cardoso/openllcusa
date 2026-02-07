'use client'

import { useState } from 'react'
import {
    FileText, Search, Filter, Upload,
    Download, Clock, CheckCircle2, AlertCircle,
    ChevronRight, ExternalLink, FileDown, MoreHorizontal
} from 'lucide-react'
import Link from 'next/link'
import DocumentUploadModal from '@/components/admin/DocumentUploadModal'

export default function AdminDocumentosClient({ initialPedidos }: { initialPedidos: any[] }) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // Extraer documentos de los pedidos
    const documentos = initialPedidos.flatMap(p => {
        const docs = []
        if (p.metadata?.documento_identidad_path) {
            docs.push({
                id: `${p.id}-id-storage`,
                nombre: p.metadata.documento_identidad_nombre || `ID/Pasaporte - ${p.metadata.member_nombre_completo || 'Cliente'}`,
                tipo: 'Identificación',
                pedido: p.numero_pedido,
                pedidoId: p.id,
                fecha: p.metadata.fecha_subida_id || p.updated_at,
                estado: 'Recibido',
                formato: p.metadata.documento_identidad_nombre?.split('.').pop()?.toUpperCase() || 'PDF',
                path: p.metadata.documento_identidad_path
            })
        }
        return docs
    }).filter(doc =>
        doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.pedido.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-slate-900">

            {/* Modal de Carga */}
            <DocumentUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                pedidos={initialPedidos}
            />

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Centro de Documentación</h1>
                    <p className="text-slate-500 mt-1">Gestiona los archivos legales, IDs de clientes y certificaciones finales.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
                    >
                        <Upload size={16} />
                        Subir Documento
                    </button>
                </div>
            </div>

            {/* BUSCADOR Y FILTROS */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre de archivo o pedido..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-blue-500 outline-none transition-all text-sm shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <Filter size={16} />
                        Tipo
                    </button>
                    <button className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <Clock size={16} />
                        Recientes
                    </button>
                </div>
            </div>

            {/* TABLA DE DOCUMENTOS */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
                        <FileText className="text-blue-600" size={18} />
                        Archivos en el Sistema ({documentos.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Documento</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Tipo / Origen</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documentos.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0 group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 leading-tight">{doc.nombre}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Formato: {doc.formato}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black rounded-md">{doc.tipo}</span>
                                            <Link href={`/admin/pedidos/${doc.pedidoId}`} className="text-xs font-bold text-slate-800 flex items-center gap-1.5 pt-1 hover:text-blue-600 transition-colors">
                                                Pedido {doc.pedido}
                                                <ChevronRight size={10} className="text-slate-300" />
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                                            {new Date(doc.fecha).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase mt-1">
                                            <CheckCircle2 size={10} />
                                            {doc.estado}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 text-slate-900">
                                            <a
                                                href={`/api/admin/pedidos/${doc.pedidoId}/ver-identidad`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                                title="Descargar / Ver"
                                            >
                                                <Download size={16} />
                                            </a>
                                            <a
                                                href={`/api/admin/pedidos/${doc.pedidoId}/ver-identidad`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                                title="Abrir en pestaña nueva"
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {documentos.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-16 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                            <FileDown className="text-slate-200" size={32} />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs leading-relaxed">
                                            Todavía no hay documentos archivados.<br />
                                            Aparecerán aquí conforme los clientes completen sus trámites.
                                        </p>
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
