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

        // Si hay slug, buscar en ambas tablas (servicios y paquetes)
        if (slug) {
            // 1. Buscar primero en servicios
            const serviciosUrl = `${supabaseUrl}/rest/v1/servicios?slug=eq.${slug}&select=*`
            console.log('🔍 Buscando en servicios:', serviciosUrl)

            const serviciosResponse = await fetch(serviciosUrl, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                },
            })

            if (serviciosResponse.ok) {
                const serviciosData = await serviciosResponse.json()
                if (serviciosData && serviciosData.length > 0) {
                    console.log('✅ Encontrado en servicios:', serviciosData[0])
                    return NextResponse.json({
                        ...serviciosData[0],
                        _tipo: 'servicio'
                    })
                }
            }

            // 2. Si no está en servicios, buscar en paquetes
            const paquetesUrl = `${supabaseUrl}/rest/v1/paquetes?slug=eq.${slug}&select=*`
            console.log('🔍 Buscando en paquetes:', paquetesUrl)

            const paquetesResponse = await fetch(paquetesUrl, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                },
            })

            if (paquetesResponse.ok) {
                const paquetesData = await paquetesResponse.json()
                if (paquetesData && paquetesData.length > 0) {
                    console.log('✅ Encontrado en paquetes:', paquetesData[0])
                    return NextResponse.json({
                        ...paquetesData[0],
                        _tipo: 'paquete'
                    })
                }
            }

            // 3. No encontrado en ninguna tabla
            return NextResponse.json(
                { error: 'Servicio no encontrado' },
                { status: 404 }
            )
        }

        // Si no hay slug, listar todos los servicios
        const url = `${supabaseUrl}/rest/v1/servicios?select=id,slug,nombre,precio&limit=10`
        console.log('🔍 Listando servicios:', url)

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
