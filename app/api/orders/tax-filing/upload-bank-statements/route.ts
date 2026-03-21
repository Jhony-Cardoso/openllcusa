
import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
    try {
        const { userId } = await auth()
        if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

        const formData = await req.formData()
        const file = formData.get('file') as File
        const pedidoId = formData.get('pedidoId') as string

        if (!file || !pedidoId) {
            return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
        }

        const supabaseAdmin = createAdminClient()
        const fileName = `${Date.now()}-${file.name}`
        const fileBuffer = await file.arrayBuffer()

        // Subir a bucket 'documentos'
        const { data: uploadData, error: uploadError } = await supabaseAdmin
            .storage
            .from('documentos')
            .upload(`tax-forms/statements/${pedidoId}/${fileName}`, fileBuffer, {
                contentType: file.type,
                upsert: false
            })

        if (uploadError) {
            console.error('Error subiendo extracto:', uploadError)
            return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 })
        }

        const relativePath = `tax-forms/statements/${pedidoId}/${fileName}`

        // 4. ACTUALIZAR tax_data en el pedido para que el admin vea el link
        const { data: pedido, error: getError } = await createAdminClient()
            .from('pedidos')
            .select('tax_data')
            .eq('id', pedidoId)
            .single()

        if (!getError && pedido) {
            const taxData = (pedido.tax_data as any) || {}
            const statements = (taxData.bankStatements || []) as string[]
            
            // Si el nombre temporal ya está, lo filtramos. Añadimos el PATH relativo.
            const newStatements = [...statements.filter(s => !s.startsWith('http') && s !== file.name), relativePath]
            
            await createAdminClient().from('pedidos' as any)
                .update({ 
                    tax_data: { 
                        ...taxData, 
                        bankStatements: newStatements 
                    } 
                })
                .eq('id', pedidoId)
        }

        return NextResponse.json({ 
            success: true, 
            path: relativePath,
            name: file.name
        })

    } catch (error: any) {
        console.error('Error en upload-bank-statements:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
