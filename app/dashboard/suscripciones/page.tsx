import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import CancelarRenovacionButton from "./ui/CancelarRenovacionButton";

const AGENTE_SERVICIO_ID = "0489df83-75f2-4a58-add6-8cf78879faed";

function formatDate(value: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  return d.toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default async function SuscripcionesPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const { data: subs } = await supabaseAdmin
    .from("suscripciones")
    .select("servicio_id, estado, cancel_at_period_end, current_period_end")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const agente = subs?.find((s) => s.servicio_id === AGENTE_SERVICIO_ID) ?? null;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1>Suscripciones</h1>

      {!agente ? (
        <div>
          <p>No hay suscripción de Agente registrado.</p>
        </div>
      ) : (
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h2>Agente registrado</h2>
          <p>
            Estado: <b>{agente.estado}</b>
          </p>
          <p>Renovación cancelada: {agente.cancel_at_period_end ? "Sí" : "No"}</p>
          <p>Activo hasta: {formatDate(agente.current_period_end ?? null)}</p>

          {!agente.cancel_at_period_end ? (
            <CancelarRenovacionButton servicioId={AGENTE_SERVICIO_ID} />
          ) : (
            <p>La renovación ya está cancelada. Seguirá activo hasta la fecha indicada.</p>
          )}
        </div>
      )}
    </div>
  );
}
