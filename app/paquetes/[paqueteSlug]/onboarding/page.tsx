// ============================================
// app/paquetes/[paqueteSlug]/onboarding/page.tsx
// Paso 1 del onboarding: Presentación del paquete
// ============================================

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Database } from '@/lib/supabase/database.types';
import { Check, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

type Paquete = Database['public']['Tables']['paquetes']['Row'];

export default function OnboardingPaso1Page() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoaded: isUserLoaded } = useUser();

  const [paquete, setPaquete] = useState<Paquete | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const paqueteSlug = params.paqueteSlug as string;

  // Cargar paquete
  useEffect(() => {
    async function cargarPaquete() {
      try {
        if (!paqueteSlug) {
          setError('No se especificó un paquete');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/paquetes?slug=${paqueteSlug}`);
        if (!response.ok) {
          setError('Paquete no encontrado');
          setLoading(false);
          return;
        }

        const paqueteData = await response.json();
        setPaquete(paqueteData);
      } catch (err) {
        setError('Error al cargar el paquete');
      } finally {
        setLoading(false);
      }
    }

    cargarPaquete();
  }, [paqueteSlug]);

  const handleContinuar = async () => {
    if (!isUserLoaded || !user) {
      const returnUrl = `/paquetes/${paqueteSlug}/onboarding`;
      router.push(`/sign-in?redirect_url=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (!paquete) return;

    setCreating(true);
    setError('');

    try {
      const resBorrador = await fetch(`/api/pedidos/borrador?paqueteId=${paquete.id}&tipo=paquete`);
      const dataBorrador = await resBorrador.json();

      let pedidoId = dataBorrador?.pedido?.id;

      if (!pedidoId) {
        const resPedido = await fetch('/api/pedidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paqueteId: paquete.id, tipo: 'paquete' })
        });
        const nuevoPedido = await resPedido.json();
        pedidoId = nuevoPedido.id;
      }

      router.push(`/paquetes/${paqueteSlug}/onboarding/estado?pedido=${pedidoId}`);
    } catch (err) {
      setError('Error al preparar el pedido. Inténtalo de nuevo.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !paquete) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-800">{error || 'Paquete no encontrado'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">{paquete.nombre}</h1>
        {paquete.descripcion_corta && (
          <p className="text-xl text-gray-600 mt-3">{paquete.descripcion_corta}</p>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10">
        {paquete.descripcion && (
          <p className="text-lg text-gray-700 leading-relaxed mb-8">{paquete.descripcion}</p>
        )}

        <h3 className="font-semibold text-2xl mb-6">Este paquete incluye:</h3>
        
        {paquete.caracteristicas && Array.isArray(paquete.caracteristicas) && (
          <ul className="space-y-4 mb-10">
            {(paquete.caracteristicas as string[]).map((caracteristica, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[17px]">
                <Check className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{caracteristica}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500">Precio total (pago único)</p>
          <p className="text-5xl font-bold text-gray-900 mt-1">
            ${paquete.precio} <span className="text-xl font-normal text-gray-500">+ tasa estatal</span>
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mt-8 text-center">
        <p className="text-blue-900">
          En los siguientes pasos te ayudaremos a elegir el estado, completar tus datos y revisar todo.<br />
          <strong>El proceso completo toma aproximadamente 5-10 minutos.</strong>
        </p>
      </div>

      {error && <p className="text-red-600 text-center mt-6">{error}</p>}

      <div className="flex justify-end mt-10">
        <button
          onClick={handleContinuar}
          disabled={creating}
          className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl flex items-center gap-3 text-lg disabled:opacity-70"
        >
          {creating ? (
            <>Procesando <Loader2 className="animate-spin" /></>
          ) : (
            <>Continuar con {paquete.nombre} <ChevronRight /></>
          )}
        </button>
      </div>
    </div>
  );
}