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

      // Lo que nosotros mandamos en metadata al crear Checkout
      const user_id = session?.metadata?.user_id as string | undefined;
      const servicio_id = session?.metadata?.servicio_id as string | undefined; // UUID
      const pedido_id = (session?.metadata?.pedido_id as string | undefined) || null;

      const stripe_customer_id = session.customer as string | null;
      const stripe_subscription_id = session.subscription as string | null;

      if (!user_id || !servicio_id || !stripe_customer_id || !stripe_subscription_id) {
        return NextResponse.json({ received: true, skipped: "missing metadata/customer/subscription" });
      }

      // Guardar stripe_customer_id en profiles (reutilizable)
      await supabaseAdmin.from("profiles").upsert({
        user_id,
        stripe_customer_id,
      });

      // Para tener status y periodos, leemos la suscripción de Stripe
      const sub = await stripe.subscriptions.retrieve(stripe_subscription_id);

      // Upsert suscripción en Supabase
      await supabaseAdmin.from("suscripciones").upsert(
        {
          user_id,
          pedido_id,
          servicio_id, // UUID
          stripe_subscription_id: sub.id,
          stripe_customer_id,
          estado: sub.status,
          cancel_at_period_end: sub.cancel_at_period_end,
          current_period_start: toIsoFromUnixSeconds(sub.current_period_start),
          current_period_end: toIsoFromUnixSeconds(sub.current_period_end),
        },
        { onConflict: "stripe_subscription_id" }
      );
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
