import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { EmailService } from '@/lib/services/email.service';
import { PedidoModel } from '@/lib/models/pedido';

export async function POST(req: Request) {
  try {
    const { pedidoId, userId, txid } = await req.json();

    if (!pedidoId || !userId || !txid) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    // 1. Obtener el pedido actual para preservar metadata
    const { data: pedido, error: fetchError } = await supabaseAdmin
      .from('pedidos')
      .select('*')
      .eq('id', pedidoId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !pedido) {
      return NextResponse.json({ error: 'Pedido no encontrado o no autorizado' }, { status: 404 });
    }

    const currentMetadata = typeof pedido.metadata === 'object' && pedido.metadata !== null 
      ? pedido.metadata 
      : {};

    // 2. Actualizar el pedido
    const newMetadata = {
      ...currentMetadata,
      crypto_txid: txid,
      metodo_pago: 'crypto_manual',
      fecha_notificacion_pago: new Date().toISOString()
    };

    const { error: updateError } = await supabaseAdmin
      .from('pedidos')
      .update({
        estado_pedido: 'pendiente_pago', // Lo dejamos en pendiente de pago, pero con el TXID guardado para revisión
        metadata: newMetadata,
        paso_actual: 6 // Lo movemos al paso final
      })
      .eq('id', pedidoId);

    if (updateError) {
      console.error('Error actualizando pedido en checkout manual crypto:', updateError);
      return NextResponse.json({ error: 'Error al actualizar el pedido' }, { status: 500 });
    }

    // 3. Obtener info completa para el email
    const pedidoCompleto = await PedidoModel.obtenerCompleto(pedidoId);
    
    // 4. Enviar notificación al Admin
    try {
      const nombreServicio = pedidoCompleto?.paquete?.nombre || 'Servicio Open LLC';
      const importe = (pedidoCompleto?.paquete?.precio || 0) + (pedidoCompleto?.estado_usa?.filing_inicial || 0);
      
      await EmailService.notificarEquipo({
        tipo: 'nuevo_pedido',
        pedidoId: pedidoId,
        nombreServicio: `${nombreServicio} (CRYPTO MANUAL PENDIENTE)`,
        monto: importe,
        cliente: `Usuario ID: ${userId} - TXID aportado: ${txid}`
      });
      console.log('📬 Email de notificación al equipo enviado para pago crypto manual.');
    } catch (e) {
      console.error('💥 Excepción enviando email al admin:', e);
      // No bloqueamos la respuesta al cliente por un fallo en el email interno
    }

    // Devolvemos success para que el frontend redirija
    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('Error en /api/crypto/manual-checkout:', err);
    return NextResponse.json({ error: err.message || 'Error interno del servidor' }, { status: 500 });
  }
}
