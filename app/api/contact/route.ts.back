// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, country } = await request.json();

    // Validación básica
    if (!name || !email || !country) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'Open LLC USA <no-reply@openllcusa.com>',   // Cambia si tienes un dominio verificado en Resend
      to: 'jrmasol@gmail.com',   // ← CAMBIA ESTO por tu email personal
      replyTo: email,
      subject: `Nueva solicitud de asesoría - ${name}`,
      html: `
        <h2>Nueva solicitud de Asesoría Rápida</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>País:</strong> ${country}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
        <hr>
        <p>Responde desde tu bandeja de entrada o desde el panel de Resend.</p>
      `,
    });

    return NextResponse.json({ success: true, message: 'Email enviado correctamente' });

  } catch (error: any) {
    console.error('Error enviando email con Resend:', error);
    return NextResponse.json({ 
      error: 'Error al enviar el email', 
      details: error.message 
    }, { status: 500 });
  }
}