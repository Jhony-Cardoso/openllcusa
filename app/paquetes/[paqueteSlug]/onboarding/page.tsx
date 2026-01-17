// ============================================
// app/paquetes/[paqueteSlug]/onboarding/page.tsx
// Paso 1 del onboarding: Presentación del paquete
// ============================================

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { PaqueteModel } from '@/lib/models/paquete';
import { PedidoModel } from '@/lib/models/pedido';
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
  const [error, setError] = useState('');

  const paqueteSlug = params.paqueteSlug as string;

  // ============================================
  // Cargar información del paquete
  // ============================================
  useEffect(() => {
    async function cargarPaquete() {
      try {
        if (!paqueteSlug) {
          setError('No se especificó un paquete');
          setLoading(false);
          return;
        }

        // Obtener paquete por slug
        const paqueteData = await PaqueteModel.obtenerPorSlug(paqueteSlug);

        if (!paqueteData) {
          setError('Paquete no encontrado');
          setLoading(false);
          return;
        }

        setPaquete(paqueteData);
      } catch (err) {
        console.error('Error cargando paquete:', err);
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
      router.push('/sign-in');
      return;
    }

    if (!paquete) {
      setError('No se ha cargado la información del paquete');
      return;
    }

    // Buscar o crear pedido en borrador
    const pedidosUsuario = await PedidoModel.obtenerPorUsuario(user.id);
    
    const pedidoExistente = pedidosUsuario.find(
      (p) =>
        p.paquete_id === paquete.id &&
        (p.estado_pedido === 'borrador' || p.estado_pedido === 'datos_completos')
    );

    let pedidoId: string;

    if (pedidoExistente) {
      pedidoId = pedidoExistente.id;
    } else {
      const nuevoPedido = await PedidoModel.crear(user.id, paquete.id);
      if (!nuevoPedido) {
        setError('Error al crear el pedido. Inténtalo de nuevo.');
        return;
      }
      pedidoId = nuevoPedido.id;
    }

    // Navegar al paso 2 (Estado)
    router.push(`/paquetes/${paqueteSlug}/onboarding/estado?pedido=${pedidoId}`);
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
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          Continuar al siguiente paso
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
