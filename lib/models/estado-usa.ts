// ============================================
// lib/models/estado-usa.ts
// ============================================
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';

type EstadoUsa = Database['public']['Tables']['estados_usa']['Row'];

export class EstadoUsaModel {
  /**
   * Obtener todos los estados activos
   */
  static async obtenerTodos(): Promise<EstadoUsa[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('estados_usa')
      .select('*')
      .eq('activo', true)
      .order('popular', { ascending: false })
      .order('nombre');
    
    if (error) {
      console.error('Error obteniendo estados:', error);
      return [];
    }
    
    return data || [];
  }

  /**
   * Obtener estado por código
   */
  static async obtenerPorCodigo(codigo: string): Promise<EstadoUsa | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('estados_usa')
      .select('*')
      .eq('codigo', codigo)
      .single();
    
    if (error) {
      console.error('Error obteniendo estado:', error);
      return null;
    }
    
    return data;
  }
}
