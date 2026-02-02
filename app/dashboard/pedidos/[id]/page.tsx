import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, Calendar, DollarSign, FileText } from 'lucide-react'

type Props = {
  params: Promise<{ id: string }>
}

export default async function PedidoDetallePage({ params }: Props) {
  // Protección manual de la ruta
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const { id } = await params

  // En producción, buscarías el pedido en la base de datos
  const pedido = {
    id: id,
    numero: `#${id}`,
    servicio: 'Formación LLC completa',
    fecha: '01/11/2025',
    estado: 'Completado',
    monto: '$499',
    descripcion: 'Formación de LLC en Wyoming + Obtención de EIN',
    detalles: [
      { item: 'Registro de LLC', estado: 'Completado', fecha: '01/11/2025' },
      { item: 'Obtención de EIN', estado: 'Completado', fecha: '05/11/2025' },
      { item: 'Operating Agreement', estado: 'Completado', fecha: '06/11/2025' },
      { item: 'Certificado de Formación', estado: 'Completado', fecha: '06/11/2025' },
    ],
    documentos: [
      { nombre: 'Certificado de Formación', tipo: 'PDF' },
      { nombre: 'EIN Letter', tipo: 'PDF' },
      { nombre: 'Operating Agreement', tipo: 'PDF' },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Link
          href="/dashboard/pedidos"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} />
          Volver a Pedidos
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Pedido {pedido.numero}</h1>
              <p className="text-gray-600">{pedido.servicio}</p>
            </div>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
              {pedido.estado}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Fecha de pedido</p>
                <p className="font-semibold">{pedido.fecha}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="text-green-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Monto total</p>
                <p className="font-semibold text-lg">{pedido.monto}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Package className="text-purple-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">ID del pedido</p>
                <p className="font-semibold">{pedido.id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Progreso del Pedido</h2>

              <div className="space-y-4">
                {pedido.detalles.map((detalle, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{detalle.item}</h3>
                      <p className="text-sm text-gray-600">{detalle.fecha}</p>
                    </div>
                    <span className="text-sm text-green-600 font-semibold">
                      {detalle.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-2xl font-semibold mb-4">Información del Servicio</h2>
              <p className="text-gray-700 leading-relaxed">
                {pedido.descripcion}
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Todos los documentos están disponibles en la sección de
                  Documentos de tu panel.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="text-blue-600" size={24} />
                Documentos
              </h2>

              <div className="space-y-3">
                {pedido.documentos.map((doc, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{doc.nombre}</p>
                        <p className="text-sm text-gray-600">{doc.tipo}</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                        Ver
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/dashboard/documentos"
                className="mt-6 w-full block text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Ver todos los documentos
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-2">¿Necesitas ayuda?</h2>
          <p className="text-gray-600 mb-4">
            Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
          </p>
          <Link
            href="/contacto"
            className="inline-block bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            Contactar Soporte
          </Link>
        </div>
      </div>
    </div>
  )
}