// Script para ejecutar la migración de estados
// Ejecuta: node scripts/run-migration-006.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://89.117.53.55:8001';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
    console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY no está definida');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    try {
        console.log('🚀 Ejecutando migración 006: Replace Texas with New Mexico...\n');

        // Leer el archivo SQL
        const sqlPath = join(__dirname, '..', 'supabase', 'migrations_self_hosted', '006_replace_texas_with_new_mexico.sql');
        const sql = readFileSync(sqlPath, 'utf-8');

        // Ejecutar la migración
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

        if (error) {
            console.error('❌ Error ejecutando migración:', error);
            process.exit(1);
        }

        console.log('✅ Migración ejecutada exitosamente\n');

        // Verificar los estados activos
        const { data: estados, error: estadosError } = await supabase
            .from('estados_usa')
            .select('codigo, nombre, activo')
            .order('nombre');

        if (estadosError) {
            console.error('❌ Error obteniendo estados:', estadosError);
        } else {
            console.log('📊 Estados en la base de datos:');
            console.table(estados);
        }

    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

runMigration();
