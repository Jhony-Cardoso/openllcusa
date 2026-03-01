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

        // 3. Determinar qué tipo de documento buscar
        const { searchParams } = new URL(req.url)
        const type = searchParams.get('type') // '5472' (default) o 'ss4'

        const metadata = (pedido.metadata as any) || {}
        let filePath: string | null = null

        if (type === 'ss4') {
            filePath = metadata.borrador_ss4_path || null
        } else {
            // Comportamiento por defecto: Form 5472
            filePath = metadata.documents?.form_5472_path || null

            // Fallback para pedidos sin form_5472_path (generados antes de esa feature)
            if (!filePath && metadata.documents?.form_5472_url) {
                const url = metadata.documents.form_5472_url as string

                // CASO 1: URL pública formato /object/public/<bucket>/<path>
                const publicMarker = '/object/public/documentos/'
                const publicIdx = url.indexOf(publicMarker)
                if (publicIdx !== -1) {
                    filePath = url.substring(publicIdx + publicMarker.length).split('?')[0]
                }

                // CASO 2: URL firmada formato /object/sign/<bucket>/<path>?token=<jwt>
                if (!filePath) {
                    const signMarker = '/object/sign/documentos/'
                    const signIdx = url.indexOf(signMarker)
                    if (signIdx !== -1) {
                        filePath = url.substring(signIdx + signMarker.length).split('?')[0]
                    }
                }
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
