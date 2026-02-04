import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { FileText, Download, ArrowLeft, Search, Filter, AlertCircle, FileArchive } from 'lucide-react'
import Link from 'next/link'
import { DocumentoModel } from '@/lib/models/documento'

export default async function DocumentosPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  // Obtener documentos reales
  const documentos = await DocumentoModel.obtenerPorUsuario(userId)
  const hasDocuments = documentos.length > 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors font-medium text-sm group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Volver al Panel
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Mis Documentos</h1>
          <p className="text-slate-500 text-lg">Centraliza toda la documentación legal de tu empresa en un solo lugar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* FILTROS / SIDEBAR INTERNO */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Filter size={18} className="text-blue-600" />
              Filtrar por
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold">Todos</button>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-medium">Formación</button>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-medium">Impuestos</button>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-medium">Contratos</button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <h4 className="font-bold mb-2 text-slate-300">¿Falta algo?</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">Si no encuentras un documento, es posible que todavía esté en proceso de gestión.</p>
            <Link href="/contacto" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
              Contactar soporte <ArrowLeft size={12} className="rotate-180" />
            </Link>
          </div>
        </div>

        {/* LISTA DE DOCUMENTOS */}
        <div className="lg:col-span-3">
          {!hasDocuments ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileArchive className="text-slate-300" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Tu archivo está vacío</h2>
              <p className="text-slate-500 max-w-sm mx-auto mb-8">
                Aquí aparecerán tu Certificado de Formación, EIN, Operating Agreement y facturas una vez los hayamos procesado.
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold">
                  <AlertCircle size={16} /> En proceso de gestión
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{documentos.length} Documentos vinculados</span>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Buscar..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {documentos.map((doc) => (
                  <div key={doc.id} className="p-6 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <FileText size={28} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{doc.nombre_archivo}</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                          <span className="uppercase font-bold text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{doc.tipo || 'PDF'}</span>
                          <span>Procesado el {new Date(doc.created_at).toLocaleDateString('es-ES')}</span>
                          {doc.tamanio_bytes && (
                            <>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <span>{(doc.tamanio_bytes / 1024 / 1024).toFixed(2)} MB</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-all active:scale-95 sm:self-center"
                    >
                      <Download size={18} />
                      Descargar
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}