// Script para actualizar estados usando fetch directamente
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 Configuración:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'undefined');
console.log('');

async function updateEstados() {
    console.log('🚀 Actualizando estados...\n');

    // 1. Desactivar Texas
    console.log('1️⃣ Desactivando Texas...');
    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/estados_usa?codigo=eq.TX`, {
        method: 'PATCH',
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({ activo: false })
    });

    if (!updateResponse.ok) {
        const error = await updateResponse.text();
        console.error('❌ Error desactivando Texas:', error);
        return;
    }
    console.log('✅ Texas desactivado\n');

    // 2. Insertar New Mexico
    console.log('2️⃣ Insertando New Mexico...');
    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/estados_usa`, {
        method: 'POST',
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify({
            id: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7',
            codigo: 'NM',
            nombre: 'New Mexico',
            filing_anual: 50.00,
            filing_inicial: 50.00,
            descripcion: 'Estado con costos de mantenimiento muy bajos y proceso de formación simple',
            ventajas: [
                'Costos de filing muy bajos ($50 anual)',
                'Proceso de formación simple',
                'Buena privacidad para los propietarios',
                'Sin impuesto estatal sobre ingresos de LLC'
            ],
            popular: false,
            recomendado: false,
            activo: true
        })
    });

    if (!insertResponse.ok) {
        const error = await insertResponse.text();
        console.error('❌ Error insertando New Mexico:', error);
        return;
    }
    console.log('✅ New Mexico insertado\n');

    // 3. Verificar estados activos
    console.log('3️⃣ Verificando estados activos...');
    const selectResponse = await fetch(`${supabaseUrl}/rest/v1/estados_usa?select=codigo,nombre,activo,filing_anual,filing_inicial&order=nombre`, {
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        }
    });

    if (!selectResponse.ok) {
        const error = await selectResponse.text();
        console.error('❌ Error obteniendo estados:', error);
        return;
    }

    const estados = await selectResponse.json();
    console.log('\n📊 Estados en la base de datos:');
    console.table(estados);
}

updateEstados();
