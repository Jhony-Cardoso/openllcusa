// Script para crear productos y precios en Stripe (Modo Test)
// Ejecuta: node scripts/create-stripe-products.mjs

import Stripe from 'stripe';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey || !stripeSecretKey.startsWith('sk_test_')) {
    console.error('❌ Error: STRIPE_SECRET_KEY no está configurada o no es una clave de test');
    console.error('Por favor, configura STRIPE_SECRET_KEY en .env.local con tu clave de test (sk_test_...)');
    process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-12-18.acacia',
});

// Productos a crear
const productos = [
    {
        name: 'LLC Esencial',
        description: 'Paquete básico para crear tu LLC en Estados Unidos. Incluye constitución, EIN y documentación esencial.',
        price: 597.00,
        slug: 'llc-esencial'
    },
    {
        name: 'Launch + Banking',
        description: 'Paquete completo con soporte bancario. Todo lo de LLC Esencial más acompañamiento para abrir cuenta bancaria.',
        price: 897.00,
        slug: 'launch-banking'
    },
    {
        name: 'Primer Año Pro',
        description: 'Paquete premium con todo incluido. Gestión completa del primer año incluyendo BOIR y compliance.',
        price: 1397.00,
        slug: 'primer-ano-pro'
    }
];

async function crearProductos() {
    console.log('🚀 Creando productos en Stripe (Modo Test)...\n');

    const resultados = [];

    for (const producto of productos) {
        try {
            console.log(`📦 Creando producto: ${producto.name}...`);

            // 1. Crear el producto
            const stripeProduct = await stripe.products.create({
                name: producto.name,
                description: producto.description,
                metadata: {
                    slug: producto.slug
                }
            });

            console.log(`   ✅ Producto creado: ${stripeProduct.id}`);

            // 2. Crear el precio
            const stripePrice = await stripe.prices.create({
                product: stripeProduct.id,
                unit_amount: Math.round(producto.price * 100), // Convertir a centavos
                currency: 'usd',
                metadata: {
                    slug: producto.slug
                }
            });

            console.log(`   ✅ Precio creado: ${stripePrice.id}`);
            console.log(`   💰 Precio: $${producto.price} USD\n`);

            resultados.push({
                slug: producto.slug,
                name: producto.name,
                product_id: stripeProduct.id,
                price_id: stripePrice.id,
                price: producto.price
            });

        } catch (error) {
            console.error(`   ❌ Error creando ${producto.name}:`, error.message);
        }
    }

    // Mostrar resumen
    console.log('\n' + '='.repeat(80));
    console.log('📊 RESUMEN DE PRODUCTOS CREADOS');
    console.log('='.repeat(80) + '\n');

    console.table(resultados);

    console.log('\n📝 SQL para actualizar Supabase:\n');
    console.log('-- Ejecuta este SQL en Supabase Studio para actualizar los stripe_price_id\n');

    resultados.forEach(r => {
        console.log(`UPDATE public.paquetes SET stripe_price_id = '${r.price_id}' WHERE slug = '${r.slug}';`);
    });

    console.log('\n✅ ¡Productos creados exitosamente en Stripe!');
    console.log('🔗 Revisa tus productos en: https://dashboard.stripe.com/test/products');
}

crearProductos().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});
