import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function toIsoFromUnixSeconds(value: number | null | undefined) {
  if (!value) return null;
  return new Date(value * 1000).toISOString();
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return jsonError("No autenticado", 401);

    const body = await req.json().catch(() => null);
    const servicio_id: string | undefined = body?.servicio_id; // UUID

    if (!servicio_id) return jsonError("Falta servicio_id (UUID)");

    // 1) Buscar la suscripción del usuario para ese servicio UUID
    const { data: row, error } = await supabaseAdmin
      .from("suscripciones")
      .select("stripe_subscription_id, cancel_at_period_end, estado")
      .eq("user_id", userId)
      .eq("servicio_id", servicio_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return jsonError("Error leyendo suscripciones", 500);
    if (!row?.stripe_subscription_id) return jsonError("No se encontró suscripción", 404);

    if (row.cancel_at_period_end) {
      return NextResponse.json({ ok: true, already: true });
    }

    // 2) Pedir a Stripe que cancele al final del periodo
    const updated = await stripe.subscriptions.update(row.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // 3) Guardar en Supabase (y el webhook lo confirmará también)
    await supabaseAdmin
      .from("suscripciones")
      .update({
        estado: updated.status,
        cancel_at_period_end: updated.cancel_at_period_end,
        current_period_start: toIsoFromUnixSeconds(updated.current_period_start),
        current_period_end: toIsoFromUnixSeconds(updated.current_period_end),
      })
      .eq("stripe_subscription_id", updated.id);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return jsonError(e?.message ?? "Error desconocido", 500);
  }
}
