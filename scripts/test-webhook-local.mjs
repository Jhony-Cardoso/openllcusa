/**
 * Simulador de Webhook de Stripe
 * 
 * Uso: node scripts/test-webhook-local.mjs [ID_PEDIDO] [PUERTO]
 */

import crypto from 'crypto';
import dotenv from 'dotenv'; // IMPORTANTE: Cargar variables de entorno
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const PEDIDO_ID = process.argv[2] || 'pedido_12345_test';
const PORT = process.argv[3] || '3000';
const WEBHOOK_URL = `http://localhost:${PORT}/api/stripe/webhook`;

const USER_ID = 'user_39SIVdPgvQY3l9kAWICz7l8OBM9';
// ¡IMPORTANTE! Cambia esto por TU email registrado en Resend (si estás en modo prueba)
const USER_EMAIL = 'josemanuelguerranunez5@gmail.com';

// Ahora sí leerá el secreto correcto
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

if (!STRIPE_WEBHOOK_SECRET || STRIPE_WEBHOOK_SECRET.includes('whsec_...') === false) {
    console.warn('⚠️ ADVERTENCIA: STRIPE_WEBHOOK_SECRET no parece válido o no se cargó.');
    console.warn('   Valor actual:', STRIPE_WEBHOOK_SECRET);
    console.warn('   Asegúrate de que está en .env.local');
}

async function run() {
    console.log(`🚀 Iniciando simulación de Webhook Stripe...`);
    console.log(`TARGET: ${WEBHOOK_URL}`);
    console.log(`PEDIDO ID: ${PEDIDO_ID}`);

    if (!STRIPE_WEBHOOK_SECRET) {
        console.error('❌ Error: Faltan variables de entorno. STRIPE_WEBHOOK_SECRET es requerido.');
        return;
    }

    const payload = {
        id: 'evt_test_webhook_' + Date.now(),
        object: 'event',
        api_version: '2023-10-16',
        created: Math.floor(Date.now() / 1000),
        type: 'checkout.session.completed',
        data: {
            object: {
                id: 'cs_test_' + Date.now(),
                object: 'checkout.session',
                amount_total: 29900,
                currency: 'usd',
                payment_status: 'paid',
                status: 'complete',
                mode: 'payment',
                metadata: {
                    pedidoId: PEDIDO_ID,
                    userId: USER_ID
                },
                customer_details: {
                    email: USER_EMAIL,
                    name: 'Richard Lagarth Test'
                },
                payment_intent: 'pi_test_' + Date.now()
            }
        }
    };

    const payloadString = JSON.stringify(payload, null, 2);

    const timestamp = Math.floor(Date.now() / 1000);
    const signedPayload = `${timestamp}.${payloadString}`;

    const hmac = crypto.createHmac('sha256', STRIPE_WEBHOOK_SECRET);
    hmac.update(signedPayload);
    const signature = hmac.digest('hex');

    const stripeSignatureHeader = `t=${timestamp},v1=${signature}`;

    console.log(`🔑 Firma generada correctamente esperando respuesta...`);

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Stripe-Signature': stripeSignatureHeader
            },
            body: payloadString
        });

        const responseText = await response.text();
        console.log(`\n📡 Respuesta del servidor (${response.status}):`);
        // Limitar la salida si es muy larga (html de error)
        console.log(responseText.length > 500 ? responseText.substring(0, 500) + '...' : responseText);

        if (response.ok) {
            console.log('\n✅ Webhook aceptado por el servidor.');
            console.log('📬 Si el email funciona, deberías verlo en tus logs de backend o en Resend.');
        } else {
            console.log('\n❌ Webhook rechazado por el servidor.');
            console.log('   Causa probable: Secret incorrecto o servidor caído.');
        }

    } catch (error) {
        if (error.cause && error.cause.code === 'ECONNREFUSED') {
            console.error('\n⛔ Error: No se puede conectar al servidor en puerto ' + PORT);
            console.error('   Asegúrate de ejecutar "npm run dev" en otra terminal.');
        } else {
            console.error('\n💥 Error inesperado:', error.message);
        }
    }
}

run();
