
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { FacturaModel } from '@/lib/models/factura'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        const { id } = await params
        const supabase = createAdminClient()

        if (!userId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const factura = await FacturaModel.obtenerPorId(id)

        if (!factura) {
            return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 })
        }

        // Verificar permisos: dueño o admin
        // Admin emails hardcoded temporalmente, idealmente usar roles de clerk o DB
        const adminEmails = [process.env.ADMIN_EMAIL, 'josemanuelguerranunez5@gmail.com']
        const isAdmin = false // TODO: Verificar admin logic correctamente si se requiere auth() user details
        // Por ahora solo dueño recibe la factura via este endpoint. Admin tiene endpoint separado o misma lógica.

        if (factura.user_id !== userId) {
            // Si no es el dueño, verificar si es admin (logic compleja sin request user details completos aquí)
            // Asumimos por ahora solo dueño puede descargar via este link.
            return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
        }

        if (!factura.pdf_path) {
            return NextResponse.json({ error: 'PDF no generado aún' }, { status: 404 })
        }

        const { data: fileData, error: downloadError } = await supabase
            .storage
            .from('facturas') // Usaremos un bucket específico o el de documentos
            .download(factura.pdf_path)

        if (downloadError || !fileData) {
            return NextResponse.json({ error: 'Error descargando archivo' }, { status: 500 })
        }

        const arrayBuffer = await fileData.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Factura_${factura.numero_factura}.pdf"`,
            },
        })

    } catch (error) {
        console.error('Error descarga factura:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
