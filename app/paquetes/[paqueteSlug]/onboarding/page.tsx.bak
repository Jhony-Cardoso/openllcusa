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

// Tipo de dato para paquetes
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

  // ============================================
  // Cargar información del paquete vía API segura
  // ============================================
  useEffect(() => {
    async function cargarPaquete() {
      try {
        if (!paqueteSlug) {
          setError('No se especificó un paquete');
          setLoading(false);
          return;
        }

        console.log('🔍 [PAQUETE ONBOARDING] Cargando paquete:', paqueteSlug);

        // Usar API segura en lugar de modelo directo (evita RLS)
        const response = await fetch(`/api/paquetes?slug=${paqueteSlug}`);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ Error cargando paquete:', errorData);
          setError(errorData.error || 'Paquete no encontrado');
          setLoading(false);
          return;
        }

        const paqueteData = await response.json();
        console.log('✅ Paquete cargado:', paqueteData);
        setPaquete(paqueteData);
      } catch (err) {
        console.error('💥 Error cargando paquete:', err);
        setError('Error al cargar el paquete. Por favor, recarga la página.');
      } finally {
        setLoading(false);
      }
    }

    cargarPaquete();
  }, [paqueteSlug]);

  // ============================================
  // Continuar al siguiente paso (Estado)
  // ============================================
  const handleContinuar = async () => {
    // Si el usuario no está autenticado, redirigir al login
    if (!isUserLoaded || !user) {
      const returnUrl = `/paquetes/${paqueteSlug}/onboarding`;
      router.push(`/sign-in?redirect_url=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (!paquete) {
      setError('No se ha cargado la información del paquete');
      return;
    }

    setCreating(true);
    setError('');

    try {
      // Buscar borrador existente vía API segura
      console.log('🔍 Buscando borrador para paquete:', paquete.id);
      const resBorrador = await fetch(`/api/pedidos/borrador?paqueteId=${paquete.id}&tipo=paquete`);
      const dataBorrador = await resBorrador.json();

      let pedidoId: string;

      if (dataBorrador?.pedido?.id) {
        // Reutilizar borrador existente
        pedidoId = dataBorrador.pedido.id;
        console.log('♻️ Reutilizando borrador:', pedidoId);
      } else {
        // Crear nuevo pedido vía API segura
        console.log('📝 Creando nuevo pedido para paquete:', paquete.id);
        const resPedido = await fetch('/api/pedidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paqueteId: paquete.id,
            tipo: 'paquete'
          })
        });

        if (!resPedido.ok) {
          throw new Error('Error al crear el pedido');
        }

        const nuevoPedido = await resPedido.json();
        pedidoId = nuevoPedido.id;
        console.log('✅ Nuevo pedido creado:', pedidoId);
      }

      // Navegar al paso 2 (Estado)
      router.push(`/paquetes/${paqueteSlug}/onboarding/estado?pedido=${pedidoId}`);
    } catch (err) {
      console.error('Error creando/recuperando pedido:', err);
      setError('Error al crear el pedido. Inténtalo de nuevo.');
    } finally {
      setCreating(false);
    }
  };

  // ============================================
  // UI: Loading
  // ============================================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Cargando información del paquete...</span>
      </div>
    );
  }

  // ============================================
  // UI: Error
  // ============================================
  if (error || !paquete) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-red-800">{error || 'Paquete no encontrado'}</p>
        </div>
      </div>
    );
  }

  // ============================================
  // UI: Contenido principal
  // ============================================
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Título */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {paquete.nombre}
        </h1>
        {paquete.descripcion_corta && (
          <p className="text-lg text-gray-600">{paquete.descripcion_corta}</p>
        )}
      </div>

      {/* Card: Información del paquete */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        {/* Descripción completa */}
        {paquete.descripcion && (
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{paquete.descripcion}</p>
          </div>
        )}

        {/* Características */}
        {paquete.caracteristicas && Array.isArray(paquete.caracteristicas) && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-3">
              Este paquete incluye:
            </h3>
            <ul className="space-y-2">
              {(paquete.caracteristicas as string[]).map((caracteristica, idx) => (
                <li key={idx} className="flex items-start text-gray-700">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{caracteristica}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Precio */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-blue-600">${paquete.precio}</span>
            {paquete.precio_mensual && (
              <span className="text-gray-600">
                o ${paquete.precio_mensual}/mes
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900">
          📋 En los siguientes pasos te pediremos seleccionar el estado donde quieres
          constituir tu LLC y los datos de tu empresa. Todo el proceso toma
          aproximadamente <strong>5-10 minutos</strong>.
        </p>
      </div>

      {/* Mensaje de error al continuar */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Botón continuar */}
      <div className="flex justify-end">
        <button
          onClick={handleContinuar}
          disabled={creating}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          {creating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Preparando...
            </>
          ) : (
            <>
              Continuar al siguiente paso
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
