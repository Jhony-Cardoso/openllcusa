import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { EmailService } from '@/lib/services/email.service'


export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // 1) CORRECCIÓN: headers() es async en Next.js 15
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Si falta alguna cabecera, error 400
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Leemos el body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // 2) CORRECCIÓN: WEBHOOK_SECRET ya está verificado arriba, TypeScript ya no se queja
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verificamos la firma
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // 3) CORRECCIÓN: Acceso seguro a los datos
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name } = evt.data;
    const email = email_addresses?.[0]?.email_address;

    console.log(`🚀 Nuevo usuario creado: ${id} (${email})`);

    if (email) {
      try {
        await EmailService.enviarBienvenida({
          to: email,
          nombreUsuario: first_name || 'Emprendedor'
        });
        console.log('📬 Email de bienvenida enviado con éxito');
      } catch (err) {
        console.error('❌ Error enviando email de bienvenida:', err);
      }
    }
  }

  return new Response('', { status: 200 })
}
