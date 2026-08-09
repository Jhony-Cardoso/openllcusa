import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { EmailService } from '@/lib/services/email.service';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { nombre, email, telefono, pregunta_inicial, attribution, intent } = data;

    if (!nombre || !email) {
      return NextResponse.json({ error: 'Nombre y email son requeridos' }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await (supabase as any)
      .from('chat_leads')
      .insert([
        {
          nombre,
          email,
          telefono: telefono || null,
          pregunta_inicial: pregunta_inicial || null,
          attribution: attribution || null,
          intent: intent || null,
          status: 'nuevo'
        }
      ]);

    if (error) {
      console.error('Error insertando lead en Supabase:', error);
      return NextResponse.json({ error: 'No se pudo guardar el lead' }, { status: 500 });
    }

    // Si el lead es tibio (warm_lead), enviar la guía gratuita por email
    if (intent === 'warm_lead') {
      try {
        await EmailService.enviarGuiaGratis({ to: email, nombre });
      } catch (emailErr) {
        console.error('Error enviando guía por email:', emailErr);
        // No fallamos la request aunque falle el email
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error procesando el lead:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

