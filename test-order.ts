import { createAdminClient } from '@/lib/supabase/admin'

async function checkOrder() {
    const supabase = createAdminClient()
    const { data } = await supabase
        .from('pedidos')
        .select('id, numero_pedido, metadata, tax_data, servicio_id, paquete_id')
        .eq('numero_pedido', 'PED-1772428764393')
        .single()

    console.log('Order:', JSON.stringify(data, null, 2))
}

checkOrder()
