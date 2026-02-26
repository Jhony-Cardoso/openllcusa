'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, CheckCircle2, ShieldCheck, Loader2, Download, Clock } from 'lucide-react'

export default function TaxFormViewer({
  pedidoId,
  documentUrl,
  isApproved,
  isCompleted
}: {
  pedidoId: string,
  documentUrl: string,
  isApproved: boolean,
  isCompleted: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)

  const handleApprove = async () => {
    if (!checked) return alert('Debes marcar la casilla para confirmar.')
    setLoading(true)
    try {
      const res = await fetch(`/api/pedidos/${pedidoId}/approve-tax-form`, {
        method: 'POST'
      })
      if (res.ok) {
        router.refresh()
      } else {
        alert('Hubo un error al aprobar el documento.')
      }
    } catch (e) {
      alert('Error de conexión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 pt-6 border-t border-slate-100">
      <div className={`border-2 rounded-2xl p-6 relative overflow-hidden transition-all duration-500 ${isApproved ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'}`}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            {isApproved ? <CheckCircle2 className="text-green-600" size={24} /> : <FileText className="text-blue-600" size={24} />}
            <span className={`text-xs font-black uppercase tracking-widest ${isApproved ? 'text-green-700' : 'text-blue-700'}`}>
              {isApproved ? 'DOCUMENTOS APROBADOS' : 'ACCIÓN REQUERIDA'}
            </span>
          </div>
          <h4 className={`text-lg font-black mb-2 ${isApproved ? 'text-green-900' : 'text-blue-900'}`}>📄 Formularios 5472 + 1120</h4>

          <p className={`text-sm mb-4 ${isApproved ? 'text-green-700' : 'text-blue-700'}`}>
            {isApproved && !isCompleted && 'Documentos aprobados exitosamente. Nuestro equipo de contables está procediendo al envío al IRS. Recibirás tu copia sellada aquí en los próximos 1-3 días hábiles.'}
            {isApproved && isCompleted && 'Tus documentos han sido presentados oficialmente ante el IRS y el trámite ha concluido.'}
            {!isApproved && 'Revisa cuidadosamente el documento generado. El IRS impone sanciones muy estrictas (+$25,000 USD) por información incompleta o falsa. Revisa y aprueba tu formulario a continuación.'}
          </p>

          {!isApproved && (
            <div className="mb-6 rounded-xl overflow-hidden border border-slate-300 bg-white h-[600px]">
              <iframe
                src={`/api/pedidos/${pedidoId}/tax-form-pdf`}
                className="w-full h-full"
                title="Formulario 5472/1120"
              />
            </div>
          )}

          {!isApproved ? (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-blue-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
                <span className="text-sm text-slate-700 font-medium leading-relaxed">
                  Declaro bajo pena de perjurio que he examinado la información contenida en estos formularios (5472 y 1120) y sus anexos, y que según mi leal saber y entender, es verdadera, correcta y completa. Autorizo a Open LLC USA a presentarlos ante el IRS.
                </span>
              </label>

              <button
                onClick={handleApprove}
                disabled={!checked || loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                Aprobar Documentos Anti-Multas
              </button>
            </div>
          ) : (
            <div>
              {!isCompleted ? (
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 rounded-xl font-bold border border-green-200">
                  <Clock size={18} />
                  En Proceso de Envío al IRS...
                </div>
              ) : (
                <a href={documentUrl} target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200">
                  <Download size={18} />
                  Descargar Copia Oficial
                </a>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
