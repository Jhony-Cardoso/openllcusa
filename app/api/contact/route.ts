// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, country } = await request.json();

    if (!name || !email || !country) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    // Email interno para ti (simple y claro)
    await resend.emails.send({
      from: 'Open LLC USA <no-reply@updates.openllcusa.com>',
      to: 'jrmasol@gmail.com',
      replyTo: email,
      subject: `Nueva solicitud de asesoría rápida - ${name}`,
      html: `
        <h2>Nueva solicitud de asesoría rápida</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>País:</strong> ${country}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
      `,
    });

    // Email al cliente (versión simple y honesta)
    await resend.emails.send({
      from: 'Open LLC USA <no-reply@updates.openllcusa.com>',
      replyTo: 'jrmasol@gmail.com',
      to: email,
      subject: `✅ ${name}, hemos recibido tu solicitud de información sobre LLC en USA`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1E3A8A;">¡Hola ${name}!</h2>
          <p>Gracias por tu interés en crear tu LLC en Estados Unidos desde ${country}.</p>
          <p>Hemos recibido correctamente tu solicitud de asesoría gratuita.</p>
          <p>Un especialista en español te contactará personalmente en menos de 12 horas.</p>
          
          <p><strong>Mientras tanto, aquí tienes lo esencial:</strong></p>
          <ul>
            <li>✅ Crear LLC sin visa ni SSN es posible</li>
            <li>✅ Incluimos EIN gratis</li>
            <li>✅ Agente registrado gratis el primer año</li>
            <li>✅ Todo 100% online y en español</li>
          </ul>
          
          <p style="margin: 30px 0 20px;">
            <a href="https://calendly.com/openllcusa" style="background:#1E3A8A; color:white; padding:16px 28px; text-decoration:none; border-radius:8px; display:inline-block; font-weight:bold;">
              Agendar llamada gratuita de 15 minutos
            </a>
          </p>
          
          <p>Si prefieres escribirnos, responde directamente a este email.</p>
          <p>Estamos aquí para ayudarte con total transparencia.</p>
          
          <p><strong>Equipo Open LLC USA</strong><br>
          Especialistas en LLC para hispanohablantes • Respuesta en < 12h</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error en /api/contact:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}