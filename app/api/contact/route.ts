// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const { name, email, country } = await request.json();

        if (!name || !email || !country) {
            console.error('❌ Datos incompletos');
            return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: 'Open LLC USA <no-reply@updates.openllcusa.com>',   // ← Cambiado al subdominio verificado
            to: 'jrmasol@gmail.com',                         // ← Tu email real
            replyTo: email,
            subject: `Nueva solicitud de asesoría - ${name}`,
            html: `
        <h2>Nueva solicitud de Asesoría Rápida</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>País:</strong> ${country}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
        <hr>
        <p>Responde directamente a este cliente.</p>
      `,
        });

        if (error) {
            console.error('❌ Error de Resend al notificarte a ti:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Auto-respuesta al cliente
        await resend.emails.send({
            from: 'Open LLC USA <no-reply@updates.openllcusa.com>',
            to: email,
            subject: `Hola ${name}, bienvenido a Open LLC USA`,
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #1E3A8A;">¡Hola ${name}!</h2>
          <p>Hemos recibido tu solicitud de asesoría desde ${country}.</p>
          <p>Entendemos que dar el salto y abrir una LLC en Estados Unidos puede generar muchas dudas (impuestos, bancos, cuentas...). Estamos aquí para ayudarte a que el proceso sea totalmente transparente y seguro.</p>
          <p><strong>¿Qué dudas concretas tienes sobre la creación de tu empresa?</strong></p>
          <p>Responde a este correo contándonos tu caso y te asesoraremos sin ningún compromiso.</p>
          <p>Si prefieres que hablemos cara a cara, <a href="https://calendly.com/openllcusa">haz clic aquí para agendar una videollamada gratuita de 15 minutos con nosotros.</a></p>
          <br/>
          <p>Un saludo,</p>
          <p><strong>Axel</strong><br/>El equipo de Open LLC USA</p>
        </div>
      `,
        });

        console.log('✅ Email enviado correctamente con Resend');
        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('❌ Error general:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}