// app/api/stripe/create-checkout-session/route.ts
// API Route para crear una sesión de Stripe Checkout

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PedidoModel } from '@/lib/models/pedido';

// Inicializar Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_dummy_build', {
    apiVersion: '2025-12-15.clover',
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { pedidoId, userId, slug } = body;

        console.log('🔍 [STRIPE] Creando sesión de checkout:', { pedidoId, userId, slug });

        // Validar datos
        if (!pedidoId || !userId) {
            return NextResponse.json(
                { error: 'Faltan datos requeridos' },
                { status: 400 }
            );
        }

        // Obtener el pedido completo
        const pedido = await PedidoModel.obtenerCompleto(pedidoId);

        if (!pedido) {
            return NextResponse.json(
                { error: 'Pedido no encontrado' },
                { status: 404 }
            );
        }

        // Verificar que el pedido pertenece al usuario
        if (pedido.user_id !== userId) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            );
        }

        console.log('📦 [STRIPE] Pedido obtenido:', {
            id: pedido.id,
            paquete: pedido.paquete?.nombre,
            estado: pedido.estado_usa?.nombre
        });

        // Calcular el total
        const precioPaquete = pedido.paquete?.precio || 0;
        const filingInicial = pedido.estado_usa?.filing_inicial || 0;
        const total = precioPaquete + filingInicial;

        // Crear line items para Stripe
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

        // 1. Paquete principal
        if (pedido.paquete) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: pedido.paquete.nombre,
                        description: pedido.paquete.descripcion_corta || undefined,
                    },
                    unit_amount: Math.round(precioPaquete * 100), // Convertir a centavos
                },
                quantity: 1,
            });
        }

        // 2. Filing inicial del estado
        if (pedido.estado_usa && filingInicial > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Filing Inicial - ${pedido.estado_usa.nombre}`,
                        description: `Costo de registro en ${pedido.estado_usa.nombre}`,
                    },
                    unit_amount: Math.round(filingInicial * 100),
                },
                quantity: 1,
            });
        }

        console.log('💰 [STRIPE] Line items:', lineItems);

        // Crear la sesión de Stripe Checkout
        const session = await stripe.checkout.sessions.create({
            // Métodos de pago habilitados
            payment_method_types: [
                'card',           // Tarjetas de crédito/débito
                'link',           // Stripe Link (pago rápido)
            ],
            // Habilitar wallets digitales (Apple Pay, Google Pay)
            // Stripe los muestra automáticamente según el dispositivo del usuario
            payment_method_options: {
                card: {
                    request_three_d_secure: 'automatic', // 3D Secure para mayor seguridad
                },
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/paquetes/${slug}/onboarding/completado?session_id={CHECKOUT_SESSION_ID}&pedido=${pedidoId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/paquetes/${slug}/onboarding/checkout?pedido=${pedidoId}`,
            metadata: {
                pedidoId: pedido.id,
                userId: pedido.user_id,
                paqueteSlug: slug,
            },
            customer_email: pedido.email_empresa || undefined,
            billing_address_collection: 'auto',
            // Configuración adicional para wallets
            phone_number_collection: {
                enabled: false, // Cambiar a true si quieres recopilar teléfono
            },
        });

        console.log('✅ [STRIPE] Sesión creada:', session.id);

        // Guardar el session_id en el pedido
        await PedidoModel.actualizarPaso(pedidoId, 5, {
            stripe_session_id: session.id,
        });

        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
        });

    } catch (error: any) {
        console.error('❌ [STRIPE] Error creando sesión:', error);
        return NextResponse.json(
            { error: error.message || 'Error al crear la sesión de pago' },
            { status: 500 }
        );
    }
}
