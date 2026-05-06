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

        const ahora = new Date().toLocaleString('es-ES', {
            timeZone: 'Europa/Madrid',
            dateStyle: 'full',
            timeStyle: 'short',
        });

        // Email interno para ti (notificación)
        await resend.emails.send({
            from: 'Open LLC USA <no-reply@updates.openllcusa.com>',
            to: 'jrmasol@gmail.com',
            replyTo: email,
            subject: `Nueva solicitud de asesoría rápida- ${name}`,
            html: `<h2>Nueva solicitud de asesoría rápida</h2>
      <p>Nombre: ${name}</p>
      <p>Email: ${email}</p>
      <p>País: ${country}</p>
      <p><strong>Fecha y hora:</strong> ${ahora}</p>`,
        });

        // Email al cliente (versión coherente y honesta)
        await resend.emails.send({
            from: 'Open LLC USA <no-reply@updates.openllcusa.com>',
            replyTo: 'jrmasol@gmail.com',
            to: email,
            subject: `✅ ${name}, hemos recibido tu solicitud de información sobre LLC en USA`,
            html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1E3A8A;">¡Hola ${name}!</h2>
  
  <p>Gracias por tu interés en crear tu LLC en Estados Unidos desde ${country || 'España'}.</p>
  
  <p>Hemos recibido correctamente tu solicitud de **asesoría gratuita**.</p>
  
  <p>Un especialista en español te contactará personalmente en **menos de 12 horas** para darte toda la información clara y los siguientes pasos.</p>
  
  <p><strong>Mientras tanto, aquí tienes lo esencial:</strong></p>
  <ul>
    <li>✅ Crear LLC sin visa ni SSN es posible</li>
    <li>✅ Incluimos EIN (número fiscal USA) gratis</li>
    <li>✅ Agente registrado en USA gratis el primer año</li>
    <li>✅ Todo 100% online y en español</li>
  </ul>
  
  <p style="margin: 30px 0 20px;">
    <a href="https://calendly.com/openllcusa" 
       style="background:#1E3A8A; color:white; padding:16px 28px; text-decoration:none; border-radius:8px; display:inline-block; font-weight:bold;">
      Agendar llamada gratuita de 15 minutos
    </a>
  </p>
  
  <p>Si prefieres escribirnos antes, responde directamente a este email (llegará a nuestro equipo).</p>
  
  <p>Estamos aquí para ayudarte con total transparencia y seguridad.</p>
  
  <p><strong>Equipo Open LLC USA</strong><br>
  Especialistas en LLC para hispanohablantes • Respuesta en < 12h</p>
  
  <hr style="margin: 30px 0; border-color: #eee;">
  <p style="font-size: 13px; color: #666;">
    Este email se envió porque solicitaste información en <a href="https://openllcusa.com">openllcusa.com</a>.<br>
    <a href="{{unsubscribe_url}}" style="color:#666;">Dar de baja</a>
  </p>
</div>`,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}