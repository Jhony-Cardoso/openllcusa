
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    console.log('Conectando a Supabase en:', supabaseUrl);

    // Intentar leer una fila para ver las columnas devueltas
    const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error consultando la tabla pedidos:', error);
        return;
    }

    if (data && data.length > 0) {
        const keys = Object.keys(data[0]);
        console.log('\nColumnas detectadas en la tabla "pedidos":');
        console.log(keys.join(', '));

        if (keys.includes('tax_data')) {
            console.log('\n✅ LA COLUMNA "tax_data" EXISTE y es visible para la API.');
        } else {
            console.log('\n❌ LA COLUMNA "tax_data" NO APARECE en la respuesta de la API.');
        }
    } else {
        console.log('La tabla "pedidos" está vacía o no se devolvieron filas.');
        // Si está vacía, no podemos ver las columnas con select *.
        // Intentaremos un insert dummy si es necesario, pero mejor confiar en el SQL anterior.
    }
}

checkColumns();
