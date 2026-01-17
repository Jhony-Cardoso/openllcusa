// src/app/api/calculator/lead-capture/route.ts
import { NextResponse } from 'next/server';
import { sendToEmailMarketing } from '@/lib/email-marketing';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, nombre, facturacion_anual, scenario_selected } = body;

  // Validación
  if (!email || !nombre) {
    return NextResponse.json(
      { error: 'Email y nombre son obligatorios' },
      { status: 400 }
    );
  }

  // Enviar a ActiveCampaign/Mailchimp
  await sendToEmailMarketing({
    email,
    nombre,
    facturacion_anual,
    scenario_selected,
    tags: ['calculator-user', `scenario-${scenario_selected}`],
    list: 'calculator-leads'
  });

  // Generar PDF
  const pdfUrl = await generatePDF({ email, scenario_selected });

  // Trigger email sequence
  await triggerEmailSequence(email, 'calculator-sequence-6-emails');

  return NextResponse.json({ 
    success: true, 
    pdfUrl,
    message: 'Revisa tu email para el PDF'
  });
}
