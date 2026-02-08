import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Faltan variables de entorno')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
    console.log('--- Configurando Supabase Storage ---')

    // Intentar crear el bucket
    const { data, error } = await supabase.storage.createBucket('identificaciones', {
        public: false,
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        fileSizeLimit: 10485760 // 10MB
    })

    if (error) {
        if (error.message === 'Bucket already exists') {
            console.log('✅ El bucket "identificaciones" ya existe.')
        } else {
            console.error('❌ Error creando bucket:', error.message)
        }
    } else {
        console.log('✅ Bucket "identificaciones" creado con éxito.')
    }
}

setupStorage()
