import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        const { id: pedidoId } = await params

        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        // Usamos el cliente admin para saltar RLS
        const supabaseAdmin = createAdminClient()

        // 1. Obtener el pedido directamente con el admin client
        const { data: pedidoRaw, error: pedidoError } = await supabaseAdmin
            .from('pedidos')
            .select('id, user_id, metadata')
            .eq('id', pedidoId)
            .single()

        if (pedidoError || !pedidoRaw) {
            console.error('[TAX-FORM-PDF] Pedido no encontrado:', pedidoError)
            return new NextResponse('Pedido no encontrado', { status: 404 })
        }

        const pedido = pedidoRaw as { id: string; user_id: string; metadata: any }

        // 2. Verificar que el pedido pertenece al usuario autenticado
        if (pedido.user_id !== userId) {
            return new NextResponse('Forbidden', { status: 403 })
        }

        // 3. Obtener el path del archivo desde metadata
        const metadata = (pedido.metadata as any) || {}
        let filePath = metadata.documents?.form_5472_path

        // Fallback para pedidos antiguos que solo tienen form_5472_url (sin form_5472_path)
        if (!filePath && metadata.documents?.form_5472_url) {
            const url = metadata.documents.form_5472_url as string
            // La URL de Supabase Storage tiene el formato:
            // https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path...>
            const storageMarker = '/object/public/documentos/'
            const markerIdx = url.indexOf(storageMarker)
            if (markerIdx !== -1) {
                filePath = url.substring(markerIdx + storageMarker.length).split('?')[0]
                console.log('[TAX-FORM-PDF] Path extraído de URL (fallback para pedido antiguo):', filePath)
            }
        }

        if (!filePath) {
            console.warn('[TAX-FORM-PDF] No hay PDF generado para el pedido:', pedidoId)
            return new NextResponse('PDF no disponible todavía', { status: 404 })
        }

        console.log('[TAX-FORM-PDF] Descargando archivo:', filePath)

        // 4. Descargar desde el bucket 'documentos'
        const { data, error: downloadError } = await supabaseAdmin.storage
            .from('documentos')
            .download(filePath)

        if (downloadError || !data) {
            console.error('[TAX-FORM-PDF] Error en Storage:', downloadError)
            return new NextResponse('Error al descargar el archivo', { status: 500 })
        }

        // 5. Servir el PDF inline para visualización en iframe
        const headers = new Headers()
        headers.set('Content-Type', 'application/pdf')
        headers.set('Content-Disposition', 'inline; filename="formulario-5472-1120.pdf"')
        headers.set('Cache-Control', 'private, max-age=3600')
        headers.set('X-Frame-Options', 'SAMEORIGIN')

        return new Response(data, { headers })

    } catch (error) {
        console.error('[TAX-FORM-PDF] Error crítico:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
