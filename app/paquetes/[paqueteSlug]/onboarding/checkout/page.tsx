// ============================================
// app/servicios/[slug]/onboarding/checkout/page.tsx
// Paso 5 del onboarding: Pago con Stripe
// ============================================

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Loader2, AlertCircle, Lock, CreditCard, Bitcoin } from 'lucide-react';

// Tipo para el pedido completo
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

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, isLoaded: isUserLoaded } = useUser();

  const [pedido, setPedido] = useState<PedidoCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'crypto_manual'>('stripe');
  const [txid, setTxid] = useState('');

  const paqueteSlug = params.paqueteSlug as string;
  const pedidoIdFromUrl = searchParams.get('pedido');

  // ============================================
  // Cargar el pedido completo
  // ============================================
  useEffect(() => {
    async function cargarPedido() {
      try {
        if (!isUserLoaded) return;

        if (!user) {
          router.push('/sign-in');
          return;
        }

        let currentPedidoId = pedidoIdFromUrl;

        // Si no hay ID en URL, buscar borrador vía API segura
        if (!currentPedidoId) {
          console.log('🔍 [PAQUETE CHECKOUT] No hay pedidoId en URL, buscando borrador...');

          const resPaquete = await fetch(`/api/paquetes?slug=${paqueteSlug}`);
          const infoPaquete = await resPaquete.json();
          const targetId = infoPaquete?.id;

          if (targetId) {
            const resBorrador = await fetch(`/api/pedidos/borrador?paqueteId=${targetId}&tipo=paquete`);
            const dataBorrador = await resBorrador.json();

            if (dataBorrador?.pedido?.id) {
              currentPedidoId = dataBorrador.pedido.id;
              console.log('✅ [PAQUETE CHECKOUT] Borrador encontrado:', currentPedidoId);

              const newUrl = `${window.location.pathname}?pedido=${currentPedidoId}`;
              window.history.replaceState({}, '', newUrl);
            }
          }
        }

        if (!currentPedidoId) {
          setError('No se ha encontrado el pedido.');
          setLoading(false);
          return;
        }

        // Usar API segura para obtener pedido completo
        const resPedido = await fetch(`/api/pedidos/completo?id=${currentPedidoId}`);
        const dataPedido = await resPedido.json();

        if (!resPedido.ok || !dataPedido.pedido) {
          console.error('Error obteniendo pedido:', dataPedido);
          setError('No se ha encontrado el pedido en la base de datos.');
          setLoading(false);
          return;
        }

        const pedidoData = dataPedido.pedido;
        setPedido(pedidoData);
      } catch (err) {
        console.error('Error cargando pedido:', err);
        setError('Error al cargar los datos. Por favor, recarga la página.');
      } finally {
        setLoading(false);
      }
    }

    cargarPedido();
  }, [isUserLoaded, user, pedidoIdFromUrl, paqueteSlug, router]);

  // ============================================
  // Crear sesión de Stripe Checkout y redirigir
  // ============================================
  const handleProcederAlPago = async () => {
    if (!pedido) {
      setError('Error al procesar el pago. Recarga la página.');
      return;
    }

    if (paymentMethod === 'crypto_manual' && !txid.trim()) {
      setError('Por favor, introduce el Hash de la Transacción (TXID).');
      return;
    }

    setProcessingPayment(true);
    setError('');

    try {
      if (paymentMethod === 'stripe') {
        // Llamar a la API route que crea la sesión de Stripe
        const response = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pedidoId: pedido.id,
            userId: user?.id,
            slug: paqueteSlug,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error al crear la sesión de pago');
        }

        // Redirigir a Stripe Checkout
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('No se recibió la URL de pago');
        }
      } else {
        // Pago manual Crypto
        const response = await fetch('/api/crypto/manual-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pedidoId: pedido.id,
            userId: user?.id,
            txid: txid.trim(),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error al procesar el pago manual');
        }

        // Redirigir a la página de éxito
        router.push(`/paquetes/${paqueteSlug}/onboarding/completado?pedido=${pedido.id}&method=crypto_manual`);
      }
    } catch (err: any) {
      console.error('Error procesando pago:', err);
      setError(err.message || 'Error al procesar el pago. Inténtalo de nuevo.');
      setProcessingPayment(false);
    }
  };

  // ============================================
  // UI: Estados de carga y error
  // ============================================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Preparando el pago...</span>
      </div>
    );
  }

  if (error && !pedido) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  // Calcular totales
  const precioPaquete = pedido?.paquete?.precio || 0;
  const filingInicial = pedido?.estado_usa?.filing_inicial || 0;
  const total = precioPaquete + filingInicial;

  // ============================================
  // UI: Página de checkout
  // ============================================
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Título */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Completa tu pedido
        </h1>
        <p className="text-gray-600">
          Estás a un paso de constituir tu LLC. Revisa el resumen y procede al pago
          seguro con Stripe.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda: Resumen del pedido */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Resumen */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
              Resumen del pedido
            </h2>

            <div className="space-y-4">
              {/* Paquete */}
              <div className="flex justify-between items-start pb-4 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">
                    {pedido?.paquete?.nombre}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {pedido?.paquete?.descripcion_corta}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">${precioPaquete}</p>
              </div>

              {/* Estado */}
              <div className="flex justify-between items-start pb-4 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">
                    Filing inicial - {pedido?.estado_usa?.nombre} ({pedido?.estado_usa?.codigo})
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Coste de registro en el estado seleccionado
                  </p>
                </div>
                <p className="font-semibold text-gray-900">${filingInicial}</p>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-2">
                <p className="text-xl font-bold text-gray-900">Total</p>
                <p className="text-2xl font-bold text-blue-600">${total}</p>
              </div>
            </div>
          </div>

          {/* Card: Datos de la empresa */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-3">
              Datos de tu empresa
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Nombre:</p>
                <p className="font-medium text-gray-900">{pedido?.nombre_empresa}</p>
              </div>
              <div>
                <p className="text-gray-600">Sector:</p>
                <p className="font-medium text-gray-900">{pedido?.sector}</p>
              </div>
              <div>
                <p className="text-gray-600">Email:</p>
                <p className="font-medium text-gray-900">{pedido?.email_empresa}</p>
              </div>
              <div>
                <p className="text-gray-600">Teléfono:</p>
                <p className="font-medium text-gray-900">{pedido?.telefono_empresa}</p>
              </div>
            </div>
          </div>

          {/* Información de seguridad */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Lock className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-900 mb-1">Pago 100% seguro</p>
                <p className="text-sm text-blue-800">
                  Tu información de pago está protegida con cifrado SSL de grado
                  bancario. Procesamos los pagos a través de Stripe, una plataforma
                  líder mundial en seguridad de pagos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha: Botón de pago */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">
              Proceder al pago
            </h3>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Total a pagar */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">${precioPaquete}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Filing inicial:</span>
                <span className="font-medium text-gray-900">${filingInicial}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-blue-600">${total}</span>
                </div>
              </div>
            </div>

            {/* Selector de método de pago */}
            <div className="mb-6 space-y-3">
              <p className="font-semibold text-gray-900 text-sm">Método de pago:</p>
              
              <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'stripe' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="stripe" 
                  checked={paymentMethod === 'stripe'} 
                  onChange={() => setPaymentMethod('stripe')}
                  className="mr-3"
                />
                <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
                <span className="font-medium text-gray-900">Tarjeta de Crédito</span>
              </label>

              <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'crypto_manual' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="crypto_manual" 
                  checked={paymentMethod === 'crypto_manual'} 
                  onChange={() => setPaymentMethod('crypto_manual')}
                  className="mr-3"
                />
                <Bitcoin className="h-5 w-5 text-gray-600 mr-2" />
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">Criptomonedas (Sin comisiones)</span>
                  <span className="text-xs text-gray-500">Transfiere USDT, USDC o BTC y verifica</span>
                </div>
              </label>
            </div>

            {/* Panel Info Crypto Manual */}
            {paymentMethod === 'crypto_manual' && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                <p className="text-sm text-blue-900 font-medium">1. Transfiere el importe exacto a una de nuestras billeteras:</p>
                
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-semibold text-gray-700 text-xs mb-1">USDT (Red TRON / TRC-20)</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 break-all select-all font-mono text-xs">TU_BILLETERA_USDT_AQUI</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-semibold text-gray-700 text-xs mb-1">USDC (Red Base o Polygon)</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 break-all select-all font-mono text-xs">TU_BILLETERA_USDC_AQUI</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-semibold text-gray-700 text-xs mb-1">BTC (Bitcoin Network)</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 break-all select-all font-mono text-xs">TU_BILLETERA_BTC_AQUI</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-blue-200">
                  <p className="text-sm text-blue-900 font-medium mb-2">2. Pega el Hash (TXID) de la transacción:</p>
                  <input
                    type="text"
                    value={txid}
                    onChange={(e) => setTxid(e.target.value)}
                    placeholder="Ej. 0x123abc..."
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Botón de pago */}
            <button
              onClick={handleProcederAlPago}
              disabled={processingPayment}
              className={`
                w-full py-3 px-4 rounded-lg font-semibold text-white
                flex items-center justify-center gap-2 transition-all
                ${processingPayment
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                }
              `}
            >
              {processingPayment ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  {paymentMethod === 'stripe' ? `Pagar $${total}` : `Confirmar Transferencia de $${total}`}
                </>
              )}
            </button>

            {/* Nota informativa */}
            <p className="text-xs text-gray-500 text-center mt-4">
              {paymentMethod === 'stripe' 
                ? 'Al hacer clic en "Pagar", serás redirigido a Stripe para completar el pago de forma segura.'
                : 'Al hacer clic en "Confirmar", revisaremos el TXID en la blockchain y activaremos tu pedido.'}
            </p>

            {/* Logos de pago */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">
                Métodos de pago aceptados:
              </p>
              <div className="flex justify-center gap-3 opacity-60">
                <div className="text-2xl">💳</div>
                <div className="text-2xl">🏦</div>
                <div className="text-2xl" title="USDT, USDC, BTC">🪙</div>
              </div>
            </div>
          </div>

          {/* Botón volver */}
          <button
            onClick={() => router.back()}
            className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Volver a revisión
          </button>
        </div>
      </div>
    </div>
  );
}
