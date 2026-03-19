
import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId: adminId } = await auth()
        const userAdmin = await currentUser()
        const { id: pedidoId } = await params

        if (!adminId) return new NextResponse('Unauthorized', { status: 401 })

        // Seguridad: Solo admin
        const adminEmails = [process.env.ADMIN_EMAIL, 'josemanuelguerranunez5@gmail.com']
        const isAdmin = adminEmails.includes(userAdmin?.emailAddresses[0]?.emailAddress || '')
        if (!isAdmin) return new NextResponse('Forbidden', { status: 403 })

        const body = await req.json()
        const { taxData } = body

        if (!taxData) {
            return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
        }

        const supabase = createAdminClient()

        // Actualizar el campo tax_data en la tabla pedidos
        const { error } = await supabase
            .from('pedidos' as any)
            .update({ tax_data: taxData })
            .eq('id', pedidoId)

        if (error) {
            console.error('Error actualizando tax_data:', error)
            return NextResponse.json({ error: 'Error actualizando base de datos' }, { status: 500 })
        }

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Update Tax Data Error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
