import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return jsonError("No autenticado", 401);

    const body = await req.json().catch(() => null);
    const servicio_id: string | undefined = body?.servicio_id;
    const pedido_id: string | null = body?.pedido_id ?? null;

    if (!servicio_id) return jsonError("Falta servicio_id (UUID)");

    // 1) Leer el servicio en Supabase y su Price ID recurrente (price_...)
    const { data: servicio, error: servicioErr } = await supabaseAdmin
      .from("servicios")
      .select("id, stripe_price_id_recurrente")
      .eq("id", servicio_id)
      .single();

    if (servicioErr) return jsonError("No se pudo leer el servicio", 500);

    const priceId = servicio?.stripe_price_id_recurrente;
    if (!priceId || !priceId.startsWith("price_")) {
      return jsonError(
        "El servicio no tiene stripe_price_id_recurrente. Debe ser un ID de Stripe que empieza por price_."
      );
    }

    // 2) Crear/leer profile (para guardar stripe_customer_id y reutilizarlo)
    const clerkUser = await currentUser();
    const email =
      clerkUser?.emailAddresses?.[0]?.emailAddress ??
      clerkUser?.primaryEmailAddress?.emailAddress ??
      null;

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("user_id, stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile) {
      await supabaseAdmin.from("profiles").insert({
        user_id: userId,
        email,
      });
    }

    const { data: profile2 } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: profile2?.stripe_customer_id ?? undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/suscripciones?checkout=success`,
      cancel_url: `${appUrl}/dashboard/suscripciones?checkout=cancel`,
      metadata: {
        user_id: userId,
        servicio_id, // UUID
        pedido_id: pedido_id ?? "",
      },
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (e: any) {
    return jsonError(e?.message ?? "Error desconocido", 500);
  }
}
