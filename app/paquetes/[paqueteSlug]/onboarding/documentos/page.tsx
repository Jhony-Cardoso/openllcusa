'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Loader2, AlertCircle, FileText, Upload, Trash2, CheckCircle2 } from 'lucide-react'

type UploadedFile = {
  path: string
  nombre_original: string
  tipo_documento: string
  descripcion: string
  fecha_subida: string
}

export default function DocumentosPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user, isLoaded: isUserLoaded } = useUser()

  const paqueteSlug = (params?.paqueteSlug as string) || ''
  const pedidoIdFromUrl = searchParams.get('pedido')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [documentosSubidos, setDocumentosSubidos] = useState<UploadedFile[]>([])
  
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [tipoDocumento, setTipoDocumento] = useState('extracto_bancario')
  const [descripcion, setDescripcion] = useState('')
  const [resolvedPedidoId, setResolvedPedidoId] = useState<string | null>(pedidoIdFromUrl)

  useEffect(() => {
    async function cargar() {
      try {
        if (!isUserLoaded) return

        if (!user) {
          router.push('/sign-in')
          return
        }

        let pedidoId = pedidoIdFromUrl

        // Si no hay ID en URL, buscar el borrador del usuario en Supabase
        if (!pedidoId) {
          console.log('🔍 [PAQUETE DOCUMENTOS] No hay pedidoId en URL, buscando borrador...')

          const resPaquete = await fetch(`/api/paquetes?slug=${paqueteSlug}`)
          const infoPaquete = await resPaquete.json()
          const targetId = infoPaquete?.id

          if (targetId) {
            const resBorrador = await fetch(`/api/pedidos/borrador?paqueteId=${targetId}&tipo=paquete`)
            const dataBorrador = await resBorrador.json()

            if (dataBorrador?.pedido?.id) {
              pedidoId = dataBorrador.pedido.id
              setResolvedPedidoId(pedidoId)
              console.log('✅ [PAQUETE DOCUMENTOS] Borrador encontrado:', pedidoId)

              const newUrl = `${window.location.pathname}?pedido=${pedidoId}`
              window.history.replaceState({}, '', newUrl)
            }
          }
        }

        if (!pedidoId) {
          setError('No se encontró un pedido en curso. Por favor, vuelve al inicio del proceso.')
          setLoading(false)
          return
        }

        setResolvedPedidoId(pedidoId)

        // Cargar pedido para ver documentos ya subidos
        const resPedido = await fetch(`/api/pedidos/obtener?id=${pedidoId}`)
        const dataPedido = await resPedido.json()

        if (!resPedido.ok || !dataPedido.pedido) {
          setError('Pedido no encontrado.')
          setLoading(false)
          return
        }

        const pedido = dataPedido.pedido
        if (pedido.documentos_subidos && pedido.documentos_subidos.length > 0) {
          const docs = pedido.documentos_subidos.map((d: string) => {
            try {
              return JSON.parse(d)
            } catch {
              return null
            }
          }).filter(Boolean)
          setDocumentosSubidos(docs)
        }
      } catch (e) {
        setError('Error al cargar los datos.')
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [isUserLoaded, user, pedidoIdFromUrl, router])

  const handleBack = () => {
    router.push(`/paquetes/${paqueteSlug}/onboarding/propietario?pedido=${resolvedPedidoId ?? ''}`)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !resolvedPedidoId) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('tipoDocumento', tipoDocumento)
    formData.append('descripcion', descripcion)

    try {
      const res = await fetch(`/api/pedidos/${resolvedPedidoId}/upload-document`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Error al subir documento')
      }

      const data = await res.json()
      
      // Actualizar lista local
      const newDoc = JSON.parse(data.docInfo)
      setDocumentosSubidos(prev => [...prev, newDoc])
      
      // Reset form
      setSelectedFile(null)
      setDescripcion('')
    } catch (err) {
      setError('Hubo un error al subir el archivo. Inténtalo de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  const handleContinuar = async () => {
    if (!resolvedPedidoId) return
    router.push(`/paquetes/${paqueteSlug}/onboarding/revision?pedido=${resolvedPedidoId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="bg-slate-100 min-h-screen py-12">
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Paso 4 de 5</p>
        <h1 className="text-3xl font-bold text-gray-900">Documentación</h1>
        <p className="text-gray-600 mt-2">Sube los extractos bancarios y documentos contables necesarios para tu plan de crecimiento.</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Lista de documentos ya subidos */}
      {documentosSubidos.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Documentos Subidos</h3>
          <ul className="space-y-3">
            {documentosSubidos.map((doc, idx) => (
              <li key={idx} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 line-clamp-1">{doc.nombre_original}</p>
                    <p className="text-sm text-gray-500 capitalize">{doc.tipo_documento.replace('_', ' ')}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-6 text-lg">Subir Nuevo Documento</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de documento *</label>
            <select
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition bg-white"
            >
              <option value="extracto_bancario">Extracto Bancario</option>
              <option value="movimientos_contables">Movimientos Contables (Excel/CSV)</option>
              <option value="otro">Otro Documento</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción breve (Opcional)</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Mes de Enero 2026"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Archivo *</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Sube un archivo</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PDF, Excel, Word o Imágenes (Máx 10MB)</p>
                {selectedFile && (
                  <p className="text-sm font-medium text-blue-700 mt-2 bg-blue-50 py-1 px-3 rounded-full inline-block">
                    Seleccionado: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <>Subiendo <Loader2 className="animate-spin h-5 w-5" /></>
            ) : (
              'Subir Documentos'
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={handleContinuar}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition flex items-center gap-2"
        >
          Ir a Revisión
        </button>
      </div>
    </div>
    </div>
  )
}
