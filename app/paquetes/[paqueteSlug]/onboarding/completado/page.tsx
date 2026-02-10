// ============================================
// app/servicios/[slug]/onboarding/completado/page.tsx
// Paso 6 (final): Confirmación tras pago exitoso
// ============================================

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { CheckCircle2, Loader2, AlertCircle, Download, Mail, ArrowRight } from 'lucide-react';

type PedidoCompleto = {
  id: string;
  user_id: string;
  numero_pedido?: string | null;
  total_pagado?: number | null;
  email_empresa?: string | null;
  nombre_empresa?: string | null;
  sector?: string | null;
  estado_usa?: { nombre: string; codigo: string; filing_inicial?: number | null } | null;
  paquete?: { nombre: string; descripcion_corta?: string | null; precio: number } | null;
};

export default function CompletadoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded: isUserLoaded } = useUser();

  const [pedido, setPedido] = useState<PedidoCompleto | null>(null);
  const [verificando, setVerificando] = useState(true);
  const [error, setError] = useState('');
  const [pagoVerificado, setPagoVerificado] = useState(false);

  const sessionId = searchParams.get('session_id');
  const pedidoId = searchParams.get('pedido');

  // ============================================
  // Verificar el pago y cargar el pedido
  // ============================================
  useEffect(() => {
    async function verificarPago() {
      try {
        if (!isUserLoaded) return;

        if (!user) {
          router.push('/sign-in');
          return;
        }

        if (!sessionId || !pedidoId) {
          setError('Falta información de la sesión de pago.');
          setVerificando(false);
          return;
        }

        // 1. Verificar la sesión de Stripe con nuestra API
        const response = await fetch('/api/stripe/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            pedidoId,
            userId: user.id,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error al verificar el pago');
        }

        // 2. Si el pago fue exitoso, marcar como verificado
        if (data.paymentStatus === 'paid') {
          setPagoVerificado(true);

          // 3. Obtener el pedido completo actualizado vía API segura
          const resPedido = await fetch(`/api/pedidos/completo?id=${pedidoId}`);
          const dataPedido = await resPedido.json();

          if (resPedido.ok && dataPedido.pedido) {
            setPedido(dataPedido.pedido);
          }
        } else {
          setError('El pago no se ha completado correctamente.');
        }
      } catch (err: any) {
        console.error('Error verificando pago:', err);
        setError(err.message || 'Error al verificar el pago. Contacta con soporte.');
      } finally {
        setVerificando(false);
      }
    }

    verificarPago();
  }, [isUserLoaded, user, sessionId, pedidoId, router]);

  // ============================================
  // UI: Verificando pago
  // ============================================
  if (verificando) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Verificando tu pago...
        </h2>
        <p className="text-gray-600">Por favor, espera un momento.</p>
      </div>
    );
  }

  // ============================================
  // UI: Error en la verificación
  // ============================================
  if (error || !pagoVerificado) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-red-900 mb-2">
                Error al verificar el pago
              </h2>
              <p className="text-red-800 mb-4">{error || 'No se pudo verificar el pago.'}</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Ir al panel de control
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // UI: Pago exitoso - Confirmación
  // ============================================
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Icono de éxito */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          ¡Pago completado con éxito!
        </h1>
        <p className="text-lg text-gray-600">
          Tu pedido <span className="font-semibold">#{pedido?.numero_pedido}</span> ha sido
          procesado correctamente.
        </p>
      </div>

      {/* Card: Resumen del pedido */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Resumen de tu pedido
        </h2>

        <div className="space-y-4">
          {/* Paquete */}
          <div className="flex justify-between items-start pb-4 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">{pedido?.paquete?.nombre}</p>
              <p className="text-sm text-gray-600 mt-1">
                {pedido?.paquete?.descripcion_corta}
              </p>
            </div>
            <p className="font-semibold text-gray-900">${pedido?.paquete?.precio}</p>
          </div>

          {/* Estado */}
          <div className="flex justify-between items-start pb-4 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">
                {pedido?.estado_usa?.nombre} ({pedido?.estado_usa?.codigo})
              </p>
              <p className="text-sm text-gray-600 mt-1">Filing inicial</p>
            </div>
            <p className="font-semibold text-gray-900">
              ${pedido?.estado_usa?.filing_inicial}
            </p>
          </div>

          {/* Total pagado */}
          <div className="flex justify-between items-center pt-2">
            <p className="text-lg font-bold text-gray-900">Total pagado:</p>
            <p className="text-2xl font-bold text-green-600">
              ${pedido?.total_pagado || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Card: Datos de la empresa */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-3">
          Datos de tu LLC
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Nombre de la empresa:</p>
            <p className="font-medium text-gray-900">{pedido?.nombre_empresa}</p>
          </div>
          <div>
            <p className="text-gray-600">Estado de registro:</p>
            <p className="font-medium text-gray-900">
              {pedido?.estado_usa?.nombre} ({pedido?.estado_usa?.codigo})
            </p>
          </div>
          <div>
            <p className="text-gray-600">Sector:</p>
            <p className="font-medium text-gray-900">{pedido?.sector}</p>
          </div>
          <div>
            <p className="text-gray-600">Email:</p>
            <p className="font-medium text-gray-900">{pedido?.email_empresa}</p>
          </div>
        </div>
      </div>

      {/* Card: Próximos pasos */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white mb-6">
        <h3 className="text-xl font-semibold mb-4">📋 ¿Qué sigue ahora?</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <Mail className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Recibirás un email de confirmación</p>
              <p className="text-blue-100 text-sm">
                En las próximas 24 horas te enviaremos los detalles de tu pedido a{' '}
                {pedido?.email_empresa}
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <Download className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Prepararemos tu documentación</p>
              <p className="text-blue-100 text-sm">
                Nuestro equipo comenzará a preparar todos los documentos legales de tu LLC
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <ArrowRight className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Seguimiento en tu dashboard</p>
              <p className="text-blue-100 text-sm">
                Podrás ver el estado de tu pedido y descargar documentos desde tu panel
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => router.push('/dashboard')}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          Ir a mi panel de control
        </button>
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
        >
          Volver al inicio
        </button>
      </div>

      {/* Nota de soporte */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          ¿Tienes alguna duda?{' '}
          <a
            href="mailto:soporte@openllcusa.com"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Contacta con nuestro equipo de soporte
          </a>
        </p>
      </div>
    </div>
  );
}
