import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { CreditCard } from 'lucide-react'

export default async function FacturacionPage() {
  // Protección manual de la ruta
  const { userId } = await auth()

  if (!userId) {
    redirect('/auth/sign-in')
  }

  const facturas = [
    { id: 1, concepto: 'Formación LLC + EIN', monto: '$499', fecha: '01/11/2025', estado: 'Pagada' },
    { id: 2, concepto: 'Renovación anual', monto: '$150', fecha: '15/03/2026', estado: 'Pendiente' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Facturación</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            {facturas.map((factura) => (
              <div
                key={factura.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <CreditCard className="text-green-600" size={24} />
                  <div>
                    <h3 className="font-semibold">{factura.concepto}</h3>
                    <p className="text-sm text-gray-600">{factura.fecha}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{factura.monto}</p>
                  <p className={`text-sm \${factura.estado === 'Pagada' ? 'text-green-600' : 'text-orange-600'}`}>
                    {factura.estado}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}