// ============================================
// app/paquetes/[paqueteSlug]/onboarding/revision/page.tsx
// Paso 4 del onboarding: Revisión de datos antes del pago
// ============================================

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Loader2, AlertCircle, Edit2, CheckCircle2 } from 'lucide-react';

// Tipo para el pedido completo con relaciones (paquete + estado)
type PedidoCompleto = {
  id: string;
  user_id: string;
  paquete_id?: string | null;
  servicio_id?: string | null;
  estado_usa_id?: string | null;
  nombre_empresa?: string | null;
  sector?: string | null;
  descripcion_negocio?: string | null;
  num_socios?: number | null;
  ingresos_estimados?: string | null;
  email_empresa?: string | null;
  telefono_empresa?: string | null;
  paquete?: {
    nombre: string;
    precio: number;
    descripcion_corta?: string | null;
    precio_mensual?: number | null;
  } | null;
  estado_usa?: {
    nombre: string;
    codigo: string;
    descripcion?: string | null;
    filing_inicial?: number | null;
    filing_anual?: number | null;
  } | null;
};

export default function RevisionPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, isLoaded: isUserLoaded } = useUser();

  const [pedido, setPedido] = useState<PedidoCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const paqueteSlug = params.paqueteSlug as string;
  const pedidoId = searchParams.get('pedido');

  // ============================================
  // Cargar el pedido completo con todas las relaciones
  // ============================================
  useEffect(() => {
    async function cargarPedido() {
      try {
        if (!isUserLoaded) return;

        if (!user) {
          router.push('/sign-in');
          return;
        }

        let currentPedidoId = pedidoId;

        // Si no hay ID en URL, buscar borrador vía API segura
        if (!currentPedidoId) {
          console.log('🔍 [PAQUETE REVISION] No hay pedidoId en URL, buscando borrador...');

          const resPaquete = await fetch(`/api/paquetes?slug=${paqueteSlug}`);
          const infoPaquete = await resPaquete.json();
          const targetId = infoPaquete?.id;

          if (targetId) {
            const resBorrador = await fetch(`/api/pedidos/borrador?paqueteId=${targetId}&tipo=paquete`);
            const dataBorrador = await resBorrador.json();

            if (dataBorrador?.pedido?.id) {
              currentPedidoId = dataBorrador.pedido.id;
              console.log('✅ [PAQUETE REVISION] Borrador encontrado:', currentPedidoId);

              const newUrl = `${window.location.pathname}?pedido=${currentPedidoId}`;
              window.history.replaceState({}, '', newUrl);
            }
          }
        }

        if (!currentPedidoId) {
          setError('No se ha encontrado el pedido. Vuelve al inicio del onboarding.');
          setLoading(false);
          return;
        }

        console.log('🔍 [REVISION] Buscando pedido:', currentPedidoId);

        // Usar API segura para obtener pedido completo
        const resPedido = await fetch(`/api/pedidos/completo?id=${currentPedidoId}`);
        const dataPedido = await resPedido.json();

        if (!resPedido.ok || !dataPedido.pedido) {
          console.error('❌ [REVISION] Pedido no encontrado:', dataPedido);
          setError('No se ha encontrado el pedido en la base de datos.');
          setLoading(false);
          return;
        }

        const pedidoData = dataPedido.pedido;
        console.log('📦 [REVISION] Pedido obtenido:', pedidoData);

        setPedido(pedidoData);
      } catch (err) {
        console.error('Error cargando pedido:', err);
        setError('Error al cargar los datos. Por favor, recarga la página.');
      } finally {
        setLoading(false);
      }
    }

    cargarPedido();
  }, [isUserLoaded, user, pedidoId, router]);

  // ============================================
  // Continuar al checkout (paso 5: pago)
  // ============================================
  const handleContinuarAlPago = () => {
    if (!pedidoId) {
      setError('Error: No se encontró el pedido');
      return;
    }

    // Redirigir al checkout
    router.push(`/paquetes/${paqueteSlug}/onboarding/checkout?pedido=${pedidoId}`);
  };

  // ============================================
  // Editar estado (volver al paso 2)
  // ============================================
  const handleEditarEstado = () => {
    if (!pedidoId) return;
    router.push(`/paquetes/${paqueteSlug}/onboarding/estado?pedido=${pedidoId}`);
  };

  // ============================================
  // Editar datos empresa (volver al paso 3)
  // ============================================
  const handleEditarDatos = () => {
    if (!pedidoId) return;
    router.push(`/paquetes/${paqueteSlug}/onboarding/datos-empresa?pedido=${pedidoId}`);
  };

  // ============================================
  // UI: Estados de carga y error
  // ============================================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Cargando resumen de tu pedido...</span>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-red-800">{error || 'No se encontró el pedido'}</p>
        </div>
      </div>
    );
  }

  // Calcular el precio total (paquete + filing del estado)
  const precioPaquete = pedido.paquete?.precio || 0;
  const filingInicial = pedido.estado_usa?.filing_inicial || 0;
  const filingAnual = pedido.estado_usa?.filing_anual || 0;
  const total = precioPaquete + filingInicial;

  // ============================================
  // UI: Resumen del pedido
  // ============================================
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Título */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Revisa tu pedido
        </h1>
        <p className="text-gray-600">
          Verifica que todos los datos sean correctos antes de proceder al pago.
          Puedes editar cualquier sección si es necesario.
        </p>
      </div>

      {/* Card: Paquete Seleccionado */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <CheckCircle2 className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Paquete seleccionado
            </h2>
          </div>
        </div>

        <div className="pl-9">
          <p className="text-lg font-medium text-gray-900 mb-1">
            {pedido.paquete?.nombre || 'Paquete desconocido'}
          </p>
          {pedido.paquete?.descripcion_corta && (
            <p className="text-sm text-gray-600 mb-3">
              {pedido.paquete.descripcion_corta}
            </p>
          )}
          <p className="text-2xl font-bold text-blue-600">
            ${precioPaquete}
            {pedido.paquete?.precio_mensual && (
              <span className="text-base text-gray-500 ml-2">
                o ${pedido.paquete.precio_mensual}/mes
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Card: Estado Seleccionado */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <CheckCircle2 className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Estado de registro
            </h2>
          </div>
          <button
            onClick={handleEditarEstado}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Editar
          </button>
        </div>

        <div className="pl-9">
          <p className="text-lg font-medium text-gray-900 mb-1">
            {pedido.estado_usa?.nombre || 'Estado no seleccionado'}{' '}
            <span className="text-gray-500">({pedido.estado_usa?.codigo})</span>
          </p>
          {pedido.estado_usa?.descripcion && (
            <p className="text-sm text-gray-600 mb-3">
              {pedido.estado_usa.descripcion}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <p className="text-gray-600">Filing inicial:</p>
              <p className="font-semibold text-gray-900">${filingInicial}</p>
            </div>
            <div>
              <p className="text-gray-600">Filing anual:</p>
              <p className="font-semibold text-gray-900">${filingAnual}/año</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card: Datos de la Empresa */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <CheckCircle2 className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Datos de tu empresa
            </h2>
          </div>
          <button
            onClick={handleEditarDatos}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Editar
          </button>
        </div>

        <div className="pl-9 space-y-4">
          {/* Nombre empresa */}
          <div>
            <p className="text-sm font-medium text-gray-600">Nombre de la empresa:</p>
            <p className="text-base text-gray-900">
              {pedido.nombre_empresa || 'No especificado'}
            </p>
          </div>

          {/* Sector */}
          <div>
            <p className="text-sm font-medium text-gray-600">Sector:</p>
            <p className="text-base text-gray-900">{pedido.sector || 'No especificado'}</p>
          </div>

          {/* Descripción */}
          <div>
            <p className="text-sm font-medium text-gray-600">Descripción del negocio:</p>
            <p className="text-base text-gray-900">
              {pedido.descripcion_negocio || 'No especificado'}
            </p>
          </div>

          {/* Socios e ingresos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Número de socios:</p>
              <p className="text-base text-gray-900">{pedido.num_socios || 1}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos estimados:</p>
              <p className="text-base text-gray-900">
                {pedido.ingresos_estimados || 'No especificado'}
              </p>
            </div>
          </div>

          {/* Contacto */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Email:</p>
              <p className="text-base text-gray-900">
                {pedido.email_empresa || 'No especificado'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Teléfono:</p>
              <p className="text-base text-gray-900">
                {pedido.telefono_empresa || 'No especificado'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card: Resumen de Precios */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Resumen de costes
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between text-base text-gray-700">
            <span>Paquete {pedido.paquete?.nombre}:</span>
            <span className="font-medium">${precioPaquete}</span>
          </div>

          <div className="flex justify-between text-base text-gray-700">
            <span>Filing inicial ({pedido.estado_usa?.codigo}):</span>
            <span className="font-medium">${filingInicial}</span>
          </div>

          <div className="border-t border-blue-300 pt-3 mt-3">
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total a pagar hoy:</span>
              <span className="text-blue-600">${total}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-2">
            💡 El filing anual de ${filingAnual} se pagará directamente al estado en el futuro.
          </p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <button
          onClick={() => router.back()}
          className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← Volver atrás
        </button>

        <button
          onClick={handleContinuarAlPago}
          className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          Continuar al pago →
        </button>
      </div>

      {/* Nota de seguridad */}
      <p className="text-center text-sm text-gray-500 mt-6">
        🔒 Pago seguro procesado por Stripe. Tus datos están protegidos.
      </p>
    </div>
  );
}
