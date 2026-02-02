import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

function required(name: string, value: string | undefined) {
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function toIsoFromUnixSeconds(value: number | null | undefined) {
  if (!value) return null;
  return new Date(value * 1000).toISOString();
}

export async function POST(req: Request) {
  const webhookSecret = required("STRIPE_WEBHOOK_SECRET", process.env.STRIPE_WEBHOOK_SECRET);

  // Stripe requiere el body RAW y el header Stripe-Signature para validar la firma. [web:39]
  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

  const rawBody = await req.text();

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature error: ${err.message}` }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      // Determinar si es suscripción o pago único
      const mode = session.mode; // 'subscription' o 'payment'

      if (mode === 'subscription') {
        // ========== MANEJO DE SUSCRIPCIONES ==========
        const user_id = session?.metadata?.user_id as string | undefined;
        const servicio_id = session?.metadata?.servicio_id as string | undefined;
        const pedido_id = (session?.metadata?.pedido_id as string | undefined) || null;

        const stripe_customer_id = session.customer as string | null;
        const stripe_subscription_id = session.subscription as string | null;

        if (!user_id || !servicio_id || !stripe_customer_id || !stripe_subscription_id) {
          return NextResponse.json({ received: true, skipped: "missing metadata/customer/subscription" });
        }

        // Guardar stripe_customer_id en profiles
        await supabaseAdmin.from("profiles").upsert({
          user_id,
          stripe_customer_id,
        });

        // Leer la suscripción de Stripe
        const sub = await stripe.subscriptions.retrieve(stripe_subscription_id);

        // Upsert suscripción en Supabase
        await supabaseAdmin.from("suscripciones").upsert(
          {
            user_id,
            pedido_id,
            servicio_id,
            stripe_subscription_id: sub.id,
            stripe_customer_id,
            estado: sub.status,
            cancel_at_period_end: sub.cancel_at_period_end,
            current_period_start: toIsoFromUnixSeconds(sub.current_period_start),
            current_period_end: toIsoFromUnixSeconds(sub.current_period_end),
          },
          { onConflict: "stripe_subscription_id" }
        );
      } else if (mode === 'payment') {
        // ========== MANEJO DE PAGOS ÚNICOS (PAQUETES) ==========
        const pedidoId = session?.metadata?.pedidoId as string | undefined;
        const userId = session?.metadata?.userId as string | undefined;

        if (!pedidoId || !userId) {
          console.log('⚠️ [WEBHOOK] Pago único sin metadata completa');
          return NextResponse.json({ received: true, skipped: "missing pedidoId or userId" });
        }

        console.log('💳 [WEBHOOK] Procesando pago único para pedido:', pedidoId);

        // Verificar que el pago fue exitoso
        if (session.payment_status === 'paid') {
          // Actualizar el pedido como pagado
          const { error } = await supabaseAdmin
            .from('pedidos')
            .update({
              estado_pedido: 'pagado',
              stripe_session_id: session.id,
              stripe_payment_intent_id: session.payment_intent,
              stripe_customer_id: session.customer,
              total_pagado: session.amount_total / 100, // Convertir de centavos a dólares
              fecha_pago: new Date().toISOString(),
              paso_actual: 6, // Paso completado
              completado_at: new Date().toISOString(),
            })
            .eq('id', pedidoId)
            .eq('user_id', userId); // Seguridad: verificar que pertenece al usuario

          if (error) {
            console.error('❌ [WEBHOOK] Error actualizando pedido:', error);
          } else {
            console.log('✅ [WEBHOOK] Pedido marcado como pagado:', pedidoId);

            // Obtener datos del pedido y servicio para el email
            const { data: pedido } = await supabaseAdmin
              .from('pedidos')
              .select(`
                *,
                servicios (
                  nombre,
                  slug
                )
              `)
              .eq('id', pedidoId)
              .single();

            if (pedido) {
              // Obtener email del usuario desde Clerk
              const userEmail = session.customer_details?.email || session.customer_email;
              const userName = session.customer_details?.name || 'Usuario';

              if (userEmail) {
                // 1. Enviar email de confirmación
                const { EmailService } = await import('@/lib/services/email.service');
                await EmailService.enviarConfirmacionPago({
                  to: userEmail,
                  nombreUsuario: userName,
                  nombreServicio: pedido.servicios?.nombre || 'Servicio',
                  montoPagado: session.amount_total / 100,
                  pedidoId: pedidoId,
                  fechaPago: new Date().toISOString(),
                });
                console.log('📧 [WEBHOOK] Email de confirmación enviado a:', userEmail);
              }

              // 2. Crear notificación en el dashboard
              const { NotificacionService } = await import('@/lib/services/notificacion.service');
              await NotificacionService.notificarPagoExitoso(
                userId,
                pedidoId,
                pedido.servicios?.nombre || 'Servicio',
                session.amount_total / 100
              );
              console.log('🔔 [WEBHOOK] Notificación creada para usuario:', userId);

              // 3. TODO: Iniciar proceso automático según el servicio
              // Por ejemplo, si es "obtención de EIN", crear tarea para el equipo
              // Si es "formación de LLC", iniciar workflow de documentos
            }
          }
        }
      }
    }

    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as any;

      await supabaseAdmin
        .from("suscripciones")
        .update({
          estado: sub.status ?? null,
          cancel_at_period_end: !!sub.cancel_at_period_end,
          current_period_start: toIsoFromUnixSeconds(sub.current_period_start),
          current_period_end: toIsoFromUnixSeconds(sub.current_period_end),
        })
        .eq("stripe_subscription_id", sub.id);
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as any;

      await supabaseAdmin
        .from("suscripciones")
        .update({
          estado: sub.status ?? "canceled",
          cancel_at_period_end: !!sub.cancel_at_period_end,
          current_period_start: toIsoFromUnixSeconds(sub.current_period_start),
          current_period_end: toIsoFromUnixSeconds(sub.current_period_end),
        })
        .eq("stripe_subscription_id", sub.id);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Webhook handler error" }, { status: 500 });
  }
}
