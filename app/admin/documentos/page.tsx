import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { PedidoModel } from '@/lib/models/pedido'
import AdminDocumentosClient from './DocumentosClient'

export default async function AdminDocumentosPage() {
    // 1. Seguridad (Lado del Servidor)
    const { userId: adminId } = await auth()
    const userAdmin = await currentUser()

    if (!adminId) redirect('/sign-in')

    const adminEmails = [process.env.ADMIN_EMAIL, 'josemanuelguerranunez5@gmail.com']
    const isAdmin = adminEmails.includes(userAdmin?.emailAddresses[0]?.emailAddress || '')
    if (!isAdmin) redirect('/dashboard')

    // 2. Obtener pedidos (Lado del Servidor)
    const initialPedidos = await PedidoModel.listarTodosAdmin()

    // 3. Renderizar el componente de cliente
    return <AdminDocumentosClient initialPedidos={initialPedidos} />
}
