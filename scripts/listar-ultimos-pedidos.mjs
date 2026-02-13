
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Faltan variables de entorno de Supabase')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function listarPedidos() {
    console.log('📦 Conectando a Supabase para listar últimos pedidos...')
    const { data, error } = await supabase
        .from('pedidos')
        .select('id, created_at, estado_pedido, user_id, numero_pedido')
        .order('created_at', { ascending: false })
        .limit(5)

    if (error) {
        console.error('❌ Error listando pedidos:', error.message)
        return
    }

    if (!data || data.length === 0) {
        console.log('⚠️ No se encontraron pedidos.')
        return
    }

    console.log('\n✅ Últimos 5 pedidos encontrados:')
    data.forEach(p => {
        console.log(`- ID: ${p.id}`)
        console.log(`  User ID: ${p.user_id}`)
        console.log(`  Nº: ${p.numero_pedido} | Estado: ${p.estado_pedido} | Creado: ${new Date(p.created_at).toLocaleString()}`)
        console.log('---------------------------------------------------')
    })

    console.log('\n👉 Usa uno de estos IDs para probar el webhook:')
    console.log('   node scripts/test-webhook-local.mjs [ID_PEDIDO]')
}

listarPedidos()
