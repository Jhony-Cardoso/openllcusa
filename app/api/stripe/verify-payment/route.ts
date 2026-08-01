// app/api/stripe/verify-payment/route.ts
// API Route para verificar el pago después de Stripe Checkout

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
        const { sessionId, pedidoId, userId } = body;

        console.log('🔍 [VERIFY] Verificando pago:', { sessionId, pedidoId, userId });

        // Validar datos
        if (!sessionId || !pedidoId || !userId) {
            return NextResponse.json(
                { error: 'Faltan datos requeridos' },
                { status: 400 }
            );
        }

        // Obtener la sesión de Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        console.log('📦 [VERIFY] Sesión de Stripe:', {
            id: session.id,
            payment_status: session.payment_status,
            status: session.status
        });

        // Verificar que el pago fue exitoso
        if (session.payment_status !== 'paid') {
            return NextResponse.json(
                { error: 'El pago no se ha completado' },
                { status: 400 }
            );
        }

        // Obtener el pedido
        const pedido = await PedidoModel.obtenerPorId(pedidoId);

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

        // Calcular el total
        const pedidoCompleto = await PedidoModel.obtenerCompleto(pedidoId);
        const precioPaquete = pedidoCompleto?.paquete?.precio || 0;
        const filingInicial = pedidoCompleto?.estado_usa?.filing_inicial || 0;
        const total = precioPaquete + filingInicial;

        // Actualizar el pedido como pagado
        const actualizado = await PedidoModel.marcarComoPagado(pedidoId, {
            payment_intent_id: session.payment_intent as string,
            session_id: session.id,
            customer_id: session.customer as string,
            amount: total,
        });

        if (!actualizado) {
            console.error('❌ [VERIFY] Error actualizando pedido');
            return NextResponse.json(
                { error: 'Error al actualizar el pedido' },
                { status: 500 }
            );
        }

        console.log('✅ [VERIFY] Pedido marcado como pagado');

        // DISPARAR EMAILS POST-PAGO (solo si no se enviaron ya)
        const metadata = (pedido.metadata as any) || {};
        const emailEnviado = metadata.email_confirmacion_enviado === true;

        if (!emailEnviado) {
            try {
                const { currentUser } = await import('@clerk/nextjs/server');
                const { EmailService } = await import('@/lib/services/email.service');
                const clerkUser = await currentUser();
                const p = pedidoCompleto as any;

                // Determinar si es plan de mantenimiento
                const isMaintenance = p?.paquete?.slug === 'compliance-basico' || p?.paquete?.slug === 'plan-crecimiento';
                const precioMensual = p?.paquete?.precio_mensual || 0;
                const totalReal = isMaintenance ? precioMensual : total;

                const nombreProducto =
                    p?.paquete?.nombre ||
                    p?.servicio?.nombre ||
                    'Servicio Open LLC';

                // Determinar tipo de servicio para la plantilla de email
                const tipoServicio = isMaintenance ? 'maintenance' : undefined;

                // 1. Email al Cliente
                const emailCliente = session.customer_details?.email || clerkUser?.emailAddresses[0]?.emailAddress || '';
                await EmailService.enviarConfirmacionPago({
                    to: emailCliente,
                    nombreUsuario: clerkUser?.firstName || 'Emprendedor',
                    nombreServicio: nombreProducto,
                    montoPagado: totalReal,
                    pedidoId: pedidoCompleto?.numero_pedido || pedidoId,
                    fechaPago: new Date().toISOString(),
                    tipoServicio,
                });

                // 2. Notificación al Equipo
                await EmailService.notificarEquipo({
                    tipo: 'nuevo_pedido',
                    pedidoId: pedidoCompleto?.numero_pedido || pedidoId,
                    nombreServicio: nombreProducto,
                    monto: totalReal,
                    cliente: `${clerkUser?.firstName} ${clerkUser?.lastName} (${emailCliente})`,
                });

                // 3. Marcar en Base de Datos que ya se envió
                const adminClient = await import('@/lib/supabase/admin');
                const supabase = adminClient.createAdminClient();
                await supabase.from('pedidos').update({
                    metadata: { ...metadata, email_confirmacion_enviado: true }
                } as any).eq('id', pedidoId);

                console.log('📬 [VERIFY-PAYMENT] Emails post-pago enviados correctamente');
            } catch (emailError) {
                console.error('❌ [VERIFY-PAYMENT] Error enviando emails (no bloquea el flujo):', emailError);
            }
        } else {
            console.log('📬 [VERIFY-PAYMENT] Email ya enviado previamente. Saltando...');
        }

        return NextResponse.json({
            success: true,
            paymentStatus: 'paid',
            pedidoId: pedido.id,
            numeroPedido: pedido.numero_pedido,
        });

    } catch (error: any) {
        console.error('❌ [VERIFY] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Error al verificar el pago' },
            { status: 500 }
        );
    }
}
