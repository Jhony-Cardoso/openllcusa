import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json(
                { error: 'Configuración de Supabase no encontrada' },
                { status: 500 }
            )
        }

        // Construir URL según si hay slug o no
        const url = slug
            ? `${supabaseUrl}/rest/v1/servicios?slug=eq.${slug}&select=*`
            : `${supabaseUrl}/rest/v1/servicios?select=id,slug,nombre,precio&limit=10`

        console.log('🔍 Consultando Supabase:', url)

        // Hacer la petición desde el servidor (evita problemas de Mixed Content)
        const response = await fetch(url, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const error = await response.text()
            console.error('❌ Error de Supabase:', error)
            return NextResponse.json(
                { error: 'Error al consultar Supabase', details: error },
                { status: response.status }
            )
        }

        const data = await response.json()
        console.log('✅ Datos obtenidos:', data)

        // Si buscamos por slug, devolver el primer resultado
        if (slug) {
            if (!data || data.length === 0) {
                return NextResponse.json(
                    { error: 'Servicio no encontrado' },
                    { status: 404 }
                )
            }
            return NextResponse.json(data[0])
        }

        // Si listamos todos, devolver el array
        return NextResponse.json(data)
    } catch (error) {
        console.error('💥 Excepción en API:', error)
        return NextResponse.json(
            {
                error: 'Error interno del servidor',
                message: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}
