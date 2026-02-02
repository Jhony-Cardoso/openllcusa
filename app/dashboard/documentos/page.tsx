import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { FileText, Download } from 'lucide-react'

export default async function DocumentosPage() {
  // Protección manual de la ruta
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const documentos = [
    { id: 1, nombre: 'Certificado de Formación LLC', fecha: '10/11/2025', tipo: 'PDF' },
    { id: 2, nombre: 'EIN Confirmation Letter', fecha: '12/11/2025', tipo: 'PDF' },
    { id: 3, nombre: 'Operating Agreement', fecha: '15/11/2025', tipo: 'PDF' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Documentos</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            {documentos.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <FileText className="text-blue-600" size={24} />
                  <div>
                    <h3 className="font-semibold">{doc.nombre}</h3>
                    <p className="text-sm text-gray-600">
                      {doc.tipo} • {doc.fecha}
                    </p>
                  </div>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <Download size={18} />
                  Descargar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}