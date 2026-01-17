"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelarRenovacionButton({ servicioId }: { servicioId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onClick() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servicio_id: servicioId }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "No se pudo cancelar la renovación");
      }

      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={onClick} disabled={loading}>
        {loading ? "Cancelando..." : "Cancelar renovación"}
      </button>
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
    </div>
  );
}
