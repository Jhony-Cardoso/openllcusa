import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

export const createAdminClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
        console.error('❌ [ADMIN CLIENT] Faltan variables de entorno de Supabase')
    }

    return createClient<Database>(
        url!,
        key!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )
}
