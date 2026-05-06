// @ts-nocheck
// app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LeadModel } from '@/lib/models/lead';
import { EmailService } from '@/lib/services/email.service';
import { WebhookService } from '@/lib/services/webhook.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, situacion } = body;

    if (!nombre?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Nombre y email son obligatorios' }, { status: 400 });
    }

    console.log('✅ [API Leads] Datos recibidos:', { nombre, email, situacion });

    const result = await LeadModel.registrar({
      nombre,
      email,
      telefono: telefono || undefined,
      situacion,
      metadata: {
        source: 'lead_form_v1',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    if (!result.success || !result.lead) {
      console.error('❌ [API Leads] Error al guardar en Supabase:', result.error);
      throw new Error('Error al guardar el lead en la base de datos');
    }

    const leadId = result.lead.id;

    console.log('✅ [API Leads] Lead guardado correctamente con ID:', leadId);

    await EmailService.enviarEmailBienvenidaLead({ to: email, nombre, situacion });

    await WebhookService.notify('nuevo_lead_capturado', {
      id: leadId,
      nombre,
      email,
      telefono: telefono || 'Sin teléfono',
      situacion,
    });

    if (process.env.ADMIN_EMAIL) {
      await EmailService.notificarEquipo({
        tipo: 'nuevo_pedido',
        nombreServicio: 'NUEVO LEAD desde Calculadora',
        cliente: `${email} (${telefono || 'Sin teléfono'})`,
        monto: 0,
        pedidoId: leadId,
      });
    }

    return NextResponse.json({ success: true, leadId });

  } catch (error: any) {
    console.error('💥 [API Leads] Error completo:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}