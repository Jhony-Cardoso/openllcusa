const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Faltan variables de entorno')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
    console.log('--- Configurando Supabase Storage (JS) ---')

    const { data, error } = await supabase.storage.createBucket('identificaciones', {
        public: false
    })

    if (error) {
        if (error.message.includes('already exists')) {
            console.log('✅ El bucket "identificaciones" ya existe.')
        } else {
            console.error('❌ Error creando bucket:', error.message)
        }
    } else {
        console.log('✅ Bucket "identificaciones" creado con éxito.')
    }
}

setupStorage()
