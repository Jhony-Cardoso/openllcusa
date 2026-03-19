
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

        // Obtener URL (puede ser privada o pública, usaremos pública para simplificar el Dashboard Admin por ahora)
        const { data: urlData } = supabaseAdmin
            .storage
            .from('documentos')
            .getPublicUrl(`tax-forms/statements/${pedidoId}/${fileName}`)

        return NextResponse.json({ 
            success: true, 
            url: urlData.publicUrl,
            name: file.name
        })

    } catch (error: any) {
        console.error('Error en upload-bank-statements:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
