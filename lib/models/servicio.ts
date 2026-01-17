// ============================================
// lib/models/servicio.ts
// Modelo para gestionar servicios (individuales y paquetes)
// ============================================

import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';

type Servicio = Database['public']['Tables']['servicios']['Row'];

export class ServicioModel {
  /**
   * Obtener un servicio por su slug
   */
  static async obtenerPorSlug(slug: string): Promise<Servicio | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error obteniendo servicio:', error);
      return null;
    }

    return data;
  }

  /**
   * Obtener todos los servicios activos
   */
  static async obtenerTodos(): Promise<Servicio[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .eq('activo', true)
      .order('orden', { ascending: true });

    if (error) {
      console.error('Error obteniendo servicios:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Obtener servicios por tipo
   */
  static async obtenerPorTipo(tipo: 'paquete' | 'individual'): Promise<Servicio[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .eq('tipo', tipo)
      .eq('activo', true)
      .order('orden', { ascending: true });

    if (error) {
      console.error('Error obteniendo servicios por tipo:', error);
      return [];
    }

    return data || [];
  }
}
