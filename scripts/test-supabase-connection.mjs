// Script para verificar la conexión a Supabase self-hosted
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde .env.local
config({ path: join(__dirname, '..', '.env.local') });

console.log('🔍 Verificando conexión a Supabase...\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('📍 URL:', supabaseUrl);
// Debug de la clave para detectar espacios invisibles
console.log(`🔑 Anon Key Longitud: ${supabaseAnonKey?.length}`);
console.log(`🔑 Anon Key Inicio: [${supabaseAnonKey?.substring(0, 5)}...]`);
console.log(`🔑 Anon Key Fin: [...${supabaseAnonKey?.substring(supabaseAnonKey?.length - 5)}]`);

if (supabaseAnonKey?.trim() !== supabaseAnonKey) {
    console.error('⚠️  ALERTA: La clave parece tener espacios en blanco al inicio o final.');
}
console.log('');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Error: Faltan variables de entorno');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    try {
        console.log('⏳ Probando conexión...');

        // Probamos /rest/v1/ que es la raíz de la API PostgREST
        const targetUrl = `${supabaseUrl}/rest/v1/`;
        console.log(`📡 Fetching: ${targetUrl}`);

        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`
            }
        });

        console.log(`📡 Status HTTP: ${response.status}`);

        // Intentar obtener el cuerpo de la respuesta
        const textBody = await response.text();
        console.log(`📝 BODY COMPLETO DE RESPUESTA:\n${textBody}\n`);

        if (!response.ok) {
            console.error('❌ Error de conexión detectado.');
            return false;
        }

        console.log('✅ ¡Conexión exitosa a Supabase!');
        return true;
    } catch (err) {
        console.error('❌ Error inesperado:', err.message);
        return false;
    }
}

testConnection().then(success => {
    if (success) {
        console.log('\n🎉 Todo configurado correctamente!');
        process.exit(0);
    } else {
        console.log('\n⚠️  Hay problemas de conexión. Revisa la configuración.');
        process.exit(1);
    }
});
