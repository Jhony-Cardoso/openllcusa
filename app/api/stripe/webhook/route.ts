import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { EmailService } from '@/lib/services/email.service';
import { InvoiceService } from '@/lib/services/invoice.service';
import { TaxFormService } from '@/lib/services/tax-form.service';
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

          /* 
            DEBUG: Verificar si la actualización realmente afectó filas.
            Si userId es incorrecto, esto será 0 y no se actualizará nada, 
            pero el código continuará ejecutándose.
          */
          const { error, count } = await supabaseAdmin
            .from('pedidos')
            .update({
              estado_pedido: 'pagado',
              stripe_session_id: session.id,
              stripe_payment_intent_id: session.payment_intent,
              stripe_customer_id: session.customer,
              total_pagado: session.amount_total / 100,
              fecha_pago: new Date().toISOString(),
              paso_actual: 6,
              completado_at: new Date().toISOString(),
            }, { count: 'exact' })
            .eq('id', pedidoId);

          if (error) {
            console.error('❌ [WEBHOOK] Error DB update:', error);
          } else if (count === 0) {
            console.warn('⚠️ [WEBHOOK] Update exitoso pero 0 filas afectadas. PedidoID inexistente.');
            console.warn(`   PedidoID enviado: ${pedidoId}`);
          } else {
            console.log('✅ [WEBHOOK] Pedido marcado como pagado via Webhook. Filas:', count);

            // Validación de seguridad opcional: comprobar si el usuario coincide
            const { data: pCheck } = await supabaseAdmin.from('pedidos').select('user_id').eq('id', pedidoId).single();
            if (pCheck && pCheck.user_id !== userId) {
              console.warn(`🚨 [WEBHOOK] ALERTA DE SEGURIDAD: El pago fue realizado por el usuario ${userId} pero el pedido pertenece a ${pCheck.user_id}`);
            }

            // Obtener datos del pedido y servicio para el email
            const { PedidoModel } = await import('@/lib/models/pedido');
            const pedido = await PedidoModel.obtenerCompleto(pedidoId);

            if (pedido) {
              const userEmail = session.customer_details?.email || session.customer_email;
              const userName = session.customer_details?.name || 'Usuario';

              console.log(`📨 [WEBHOOK] Preparando email para: ${userEmail}`);

              if (userEmail) {
                try {
                  const nombreProducto = pedido.servicio?.nombre || pedido.paquete?.nombre || (session.metadata?.tipo_servicio === 'tax_filing_5472' ? 'Presentación Forms 5472 + 1120' : 'Servicio Open LLC');
                  const importe = session.amount_total ? session.amount_total / 100 : 0;

                  const result = await EmailService.enviarConfirmacionPago({
                    to: userEmail,
                    nombreUsuario: userName,
                    nombreServicio: nombreProducto,
                    montoPagado: importe,
                    pedidoId: pedidoId,
                    fechaPago: new Date().toISOString(),
                  });

                  if (result.success) {
                    console.log('📧 [WEBHOOK] Email enviado EXITOSAMENTE al cliente. ID:', result.data?.id);
                  } else {
                    console.error('❌ [WEBHOOK] Falló envío email al cliente. Error:', result.error);
                  }

                  // 2. Notificación al Admin
                  await EmailService.notificarEquipo({
                    tipo: 'nuevo_pedido',
                    pedidoId: pedidoId,
                    nombreServicio: nombreProducto,
                    monto: importe,
                    cliente: `${userName} (${userEmail})`
                  });
                  console.log('📬 [WEBHOOK] Email de notificación al equipo enviado.');

                } catch (e) {
                  console.error('💥 [WEBHOOK] Excepción crítica enviando emails:', e);
                }
              } else {
                console.warn('⚠️ [WEBHOOK] No hay userEmail en la sesión de Stripe.');
              }

              // --- GENERAR FACTURA ---
              try {
                console.log('🧾 [WEBHOOK] Generando factura...');
                await InvoiceService.generarFacturaParaPedido(pedido, session);
                console.log('✅ [WEBHOOK] Factura generada y pdf guardado.');
              } catch (invoiceError) {
                console.error('❌ [WEBHOOK] Error generando factura:', invoiceError);
              }


              // --- GENERAR FORMULARIO 5472 (Tax Filing) ---
              const tipoServicio = session.metadata?.tipo_servicio;
              if (tipoServicio === 'tax_filing_5472' && pedido) {
                try {
                  console.log('📄 [WEBHOOK] Iniciando generación automática de Form 5472...');

                  // Re-consultar para asegurar que tenemos el tax_data más fresco
                  const { data: pedidoFull } = await supabaseAdmin
                    .from('pedidos')
                    .select('tax_data, metadata')
                    .eq('id', pedidoId)
                    .single();

                  if (pedidoFull?.tax_data) {
                    const taxData = pedidoFull.tax_data;

                    // 1. Generar PDF
                    const pdfBytes = await TaxFormService.generate5472Package(taxData);

                    // 2. Subir a Storage
                    // Ruta: tax-forms/{userId}/{pedidoId}/form-5472-1120.pdf
                    const fileName = `tax-forms/${userId}/${pedidoId}/form-5472-1120-${Date.now()}.pdf`;

                    const { error: uploadError } = await supabaseAdmin.storage
                      .from('documentos')
                      .upload(fileName, pdfBytes, {
                        contentType: 'application/pdf',
                        upsert: true
                      });

                    if (uploadError) {
                      console.error('❌ [WEBHOOK] Falló subida a Storage:', uploadError);
                    } else {
                      // 3. Vincular documento al pedido
                      const currentMeta = (pedidoFull.metadata as any) || {};

                      // Obtener URL pública (o firmada en el futuro)
                      const { data: publicUrldata } = supabaseAdmin.storage
                        .from('documentos')
                        .getPublicUrl(fileName);

                      await supabaseAdmin
                        .from('pedidos')
                        .update({
                          metadata: {
                            ...currentMeta,
                            documents: {
                              ...(currentMeta.documents || {}),
                              form_5472_path: fileName,
                              form_5472_url: publicUrldata.publicUrl,
                              generated_at: new Date().toISOString()
                            }
                          }
                        })
                        .eq('id', pedidoId);

                      console.log('✅ [WEBHOOK] Form 5472 generado y vinculado exitosamente.');
                    }
                  } else {
                    console.warn('⚠️ [WEBHOOK] No se encontró tax_data en el pedido para generar PDF');
                  }
                } catch (taxError) {
                  console.error('❌ [WEBHOOK] Error crítico en proceso TaxForm:', taxError);
                }
              }

              // Notificar Dashboard 
              try {
                const { NotificacionService } = await import('@/lib/services/notificacion.service');
                await NotificacionService.notificarPagoExitoso(
                  userId,
                  pedidoId,
                  pedido.servicios?.nombre || 'Servicio',
                  session.amount_total / 100
                );
                console.log('🔔 [WEBHOOK] Notificación dashboard creada');
              } catch (e) { console.error('Error notificacion:', e); }

              // Tareas
              try {
                const { TaskService } = await import('@/lib/services/task.service');
                await TaskService.generarTareasPorPedido(pedido);
                console.log('⚙️ [WEBHOOK] Tareas generadas');
              } catch (e) { console.error('Error tareas:', e); }
            } else {
              console.error('❌ [WEBHOOK] No se pudo recuperar el pedido actualizado para enviar emails.');
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
