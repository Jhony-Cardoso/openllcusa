// app/dashboard/page.tsx

import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, CreditCard, Package, User, Repeat } from 'lucide-react'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const userName = user.firstName || user.emailAddresses[0]?.emailAddress.split('@')[0] || 'Usuario'

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Hola, {userName}</h1>
      <p className="text-gray-600 mb-8">Gestiona tu LLC desde aquí</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Link
          href="/dashboard/facturacion"
          className="bg-white border rounded-xl p-6 hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <div className="text-lg font-semibold">Facturación</div>
          </div>
          <div className="text-gray-600 text-sm">Consulta tus facturas y pagos</div>
        </Link>

        <Link
          href="/dashboard/pedidos"
          className="bg-white border rounded-xl p-6 hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-6 h-6 text-blue-600" />
            <div className="text-lg font-semibold">Pedidos</div>
          </div>
          <div className="text-gray-600 text-sm">Revisa el estado de tus servicios</div>
        </Link>

        <Link
          href="/dashboard/suscripciones"
          className="bg-white border rounded-xl p-6 hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 mb-2">
            <Repeat className="w-6 h-6 text-blue-600" />
            <div className="text-lg font-semibold">Suscripciones</div>
          </div>
          <div className="text-gray-600 text-sm">Gestiona tu Agente Registrado (anual)</div>
        </Link>

        <Link href="/dashboard/documentos" className="bg-white border rounded-xl p-6 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <div className="text-lg font-semibold">Documentos</div>
          </div>
          <div className="text-gray-600 text-sm">Accede a tus documentos de LLC</div>
        </Link>

        <Link href="/dashboard/perfil" className="bg-white border rounded-xl p-6 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-6 h-6 text-blue-600" />
            <div className="text-lg font-semibold">Perfil</div>
          </div>
          <div className="text-gray-600 text-sm">Actualiza tus datos personales</div>
        </Link>
      </div>
    </div>
  )
}
