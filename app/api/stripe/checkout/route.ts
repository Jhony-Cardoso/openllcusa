// ============================================
// app/api/stripe/create-checkout-session/route.ts
// API Route para crear sesión de Stripe Checkout
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { PedidoModel } from '@/lib/models/pedido';

// Inicializar Stripe con tu clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_dummy_build', {
  apiVersion: '2024-12-18.acacia', // Usa la última versión de la API
});

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación con Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // 2. Obtener datos del body
    const { pedidoId, paqueteSlug } = await request.json();

    if (!pedidoId) {
      return NextResponse.json(
        { error: 'Falta el ID del pedido' },
        { status: 400 }
      );
    }

    // 3. Obtener el pedido completo desde Supabase
    const pedido = await PedidoModel.obtenerCompleto(pedidoId);

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    // 4. Verificar que el pedido pertenece al usuario
    if (pedido.user_id !== userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    // 5. Calcular totales
    const precioPaquete = pedido.paquete?.precio || 0;
    const filingInicial = pedido.estado_usa?.filing_inicial || 0;
    const total = precioPaquete + filingInicial;

    // 6. Crear la sesión de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Aceptar tarjetas
      mode: 'payment', // Pago único (no suscripción)
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: pedido.paquete?.nombre || 'Paquete LLC',
              description: `Incluye: ${pedido.paquete?.descripcion_corta || 'Formación de LLC'}`,
            },
            unit_amount: precioPaquete * 100, // Stripe usa centavos
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Filing inicial - ${pedido.estado_usa?.nombre} (${pedido.estado_usa?.codigo})`,
              description: 'Coste de registro en el estado',
            },
            unit_amount: filingInicial * 100, // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      // URLs de redirección
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/paquetes/${paqueteSlug}/onboarding/completado?session_id={CHECKOUT_SESSION_ID}&pedido=${pedidoId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/paquetes/${paqueteSlug}/onboarding/checkout?pedido=${pedidoId}&canceled=true`,
      // Metadata para el webhook
      metadata: {
        pedidoId: pedido.id,
        userId: userId,
      },
      customer_email: pedido.email_empresa || undefined,
    });

    // 7. Devolver la URL de la sesión
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creando sesión de Stripe:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
