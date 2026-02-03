import { NextResponse } from 'next/server'
import { TaskService } from '@/lib/services/task.service'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const customEmail = searchParams.get('admin_email')

        // 1. Buscar un pedido real existente para usar de prueba
        // (Necesitamos un ID válido para la foreign key de la tabla tareas)
        const { data: pedido, error: errorPedido } = await supabaseAdmin
            .from('pedidos')
            .select(`
        *,
        servicios (
          nombre,
          slug
        )
      `)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (errorPedido || !pedido) {
            return NextResponse.json({
                success: false,
                error: 'No se encontró ningún pedido en la base de datos para usar de prueba.',
                solucion: 'Por favor, crea un pedido primero (inicia el checkout en la web) para tener un ID válido.'
            }, { status: 404 })
        }

        console.log('🧪 Iniciando prueba de automatización con pedido:', pedido.id)

        // Si se especificó un email custom para la prueba, lo inyectamos temporalmente
        // (Nota: Esto es solo un hack para la prueba, en prod usa process.env.ADMIN_EMAIL)
        if (customEmail) {
            process.env.ADMIN_EMAIL = customEmail
        }

        // 2. Ejecutar la automatización
        const resultado = await TaskService.generarTareasPorPedido(pedido)

        // 3. Obtener las tareas que se acaban de crear para mostrarlas
        const { data: tareasCreadas } = await supabaseAdmin
            .from('tareas')
            .select('*')
            .eq('pedido_id', pedido.id)
            .order('created_at', { ascending: false })
            .limit(3) // Mostrar las últimas

        return NextResponse.json({
            success: resultado.success,
            mensaje: 'Prueba de automatización ejecutada',
            pedido_utilizado: {
                id: pedido.id,
                servicio: pedido.servicios?.nombre,
                cliente: pedido.nombre_empresa
            },
            resultado_automatizacion: resultado,
            tareas_en_db: tareasCreadas,
            email_admin_enviado_a: process.env.ADMIN_EMAIL || 'soporte@openllcusa.com'
        })

    } catch (error) {
        console.error('Error en test-automation:', error)
        return NextResponse.json(
            { error: 'Error interno', detalles: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
