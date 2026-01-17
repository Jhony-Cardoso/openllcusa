// ============================================
// lib/hooks/useOnboarding.ts
// Hook personalizado para gestionar el onboarding
// ============================================
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { PedidoModel } from '@/lib/models/pedido';
import { Database } from '@/lib/supabase/database.types';

type Pedido = Database['public']['Tables']['pedidos']['Row'];

export function useOnboarding(pedidoId: string) {
  const { user } = useUser();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pedidoId) return;
    
    cargarPedido();
  }, [pedidoId]);

  const cargarPedido = async () => {
    setLoading(true);
    const data = await PedidoModel.obtenerPorId(pedidoId);
    
    if (data) {
      setPedido(data);
    } else {
      setError('No se pudo cargar el pedido');
    }
    
    setLoading(false);
  };

  const actualizarPaso = async (paso: number, datos?: any) => {
    if (!pedidoId) return false;
    
    const success = await PedidoModel.actualizarPaso(pedidoId, paso, datos);
    
    if (success) {
      await cargarPedido(); // Recargar datos
    }
    
    return success;
  };

  const guardarEstado = async (estadoUsaId: string) => {
    if (!pedidoId) return false;
    
    const success = await PedidoModel.guardarEstado(pedidoId, estadoUsaId);
    
    if (success) {
      await cargarPedido();
    }
    
    return success;
  };

  const guardarDatosEmpresa = async (datos: any) => {
    if (!pedidoId) return false;
    
    const success = await PedidoModel.guardarDatosEmpresa(pedidoId, datos);
    
    if (success) {
      await cargarPedido();
    }
    
    return success;
  };

  return {
    pedido,
    loading,
    error,
    actualizarPaso,
    guardarEstado,
    guardarDatosEmpresa,
    refetch: cargarPedido,
  };
}