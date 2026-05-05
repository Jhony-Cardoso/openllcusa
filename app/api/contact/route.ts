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

        // Email para ti (notificación interna)
        await resend.emails.send({
            from: 'Open LLC USA <no-reply@updates.openllcusa.com>',
            to: 'jrmasol@gmail.com',
            replyTo: email,
            subject: `Nueva asesoría - ${name} desde ${country}`,
            html: `
                <h2>Nueva solicitud de Asesoría Rápida</h2>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>País:</strong> ${country}</p>
                <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
                <hr>
                <p>Responde directamente a este cliente lo antes posible.</p>
            `,
        });

        // Auto-respuesta al cliente (versión mejorada anti-SPAM)
        await resend.emails.send({
            from: 'Open LLC USA <no-reply@updates.openllcusa.com>',
            to: email,
            subject: `Tu asesoría gratuita de LLC en USA ya está lista ✅ - ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1E3A8A;">¡Hola ${name}!</h2>
                    <p>Gracias por tu interés en crear tu LLC en Estados Unidos desde ${country}.</p>
                    <p>Un especialista en español revisará tu caso y te responderá en menos de 12 horas.</p>
                    
                    <p><strong>Mientras tanto, aquí tienes lo más importante:</strong></p>
                    <ul>
                        <li>✅ Sin visa ni SSN requerido</li>
                        <li>✅ EIN incluido</li>
                        <li>✅ Agente registrado gratis el primer año</li>
                        <li>✅ Todo 100% online y en español</li>
                    </ul>
                    
                    <p>Si tienes prisa, responde a este email contándonos tu situación concreta.</p>
                    <p>También puedes agendar directamente una videollamada gratuita:</p>
                    <p><a href="https://calendly.com/openllcusa" style="background:#1E3A8A; color:white; padding:12px 20px; text-decoration:none; border-radius:6px; display:inline-block;">Agendar llamada gratuita (15 min)</a></p>
                    
                    <p>¡Un abrazo y a construir tu negocio en USA!</p>
                    <p><strong>Equipo Open LLC USA</strong><br>
                    Soporte en español • Respuesta en < 12h</p>
                    
                    <hr style="margin:30px 0;">
                    <p style="font-size: 12px; color: #888;">
                        Este email se envió porque solicitaste información en <a href="https://openllcusa.com">openllcusa.com</a>.<br>
                        <a href="#">Dar de baja</a>
                    </p>
                </div>
            `,
        });

        console.log('✅ Emails enviados correctamente');
        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('❌ Error:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}