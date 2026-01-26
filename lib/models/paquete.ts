import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';

type Paquete = Database['public']['Tables']['paquetes']['Row'];

export class PaqueteModel {
  /**
   * Obtener un paquete por su slug
   */
  static async obtenerPorSlug(slug: string): Promise<Paquete | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('paquetes')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error obteniendo paquete:', error);
      return null;
    }

    return data;
  }

  /**
   * Obtener todos los paquetes activos
   */
  static async obtenerTodos(): Promise<Paquete[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('paquetes')
      .select('*')
      .eq('activo', true)
      .order('orden', { ascending: true });

    if (error) {
      console.error('Error obteniendo paquetes:', error);
      return [];
    }

    return data || [];
  }
}
