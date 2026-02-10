import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json(
                { error: 'Configuración de Supabase no encontrada' },
                { status: 500 }
            )
        }

        // Buscar paquete por slug
        if (slug) {
            const url = `${supabaseUrl}/rest/v1/paquetes?slug=eq.${slug}&select=*`
            console.log('🔍 Buscando paquete:', url)

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

            if (!data || data.length === 0) {
                return NextResponse.json(
                    { error: 'Paquete no encontrado' },
                    { status: 404 }
                )
            }

            console.log('✅ Paquete encontrado:', data[0])
            return NextResponse.json(data[0])
        }

        // Si no hay slug, listar todos los paquetes activos
        const url = `${supabaseUrl}/rest/v1/paquetes?activo=eq.true&select=*&order=orden.asc`
        console.log('🔍 Listando paquetes:', url)

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
        return NextResponse.json(data)

    } catch (error) {
        console.error('💥 Excepción en API paquetes:', error)
        return NextResponse.json(
            {
                error: 'Error interno del servidor',
                message: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}
