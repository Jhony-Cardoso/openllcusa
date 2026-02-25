import { NextResponse } from 'next/server'
import { LeadModel } from '@/lib/models/lead'
import { EmailService } from '@/lib/services/email.service'
import { WebhookService } from '@/lib/services/webhook.service'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { nombre, email, telefono, situacion } = body

        if (!nombre || !email) {
            return NextResponse.json({ error: 'Nombre y email son obligatorios' }, { status: 400 })
        }

        // 1. Guardar en Base de Datos
        const result: any = await LeadModel.registrar({
            nombre,
            email,
            telefono,
            situacion,
            metadata: {
                source: 'lead_form_v1',
                userAgent: req.headers.get('user-agent')
            }
        })

        if (!result.success || !result.lead) {
            throw new Error('Error al guardar el lead en la base de datos')
        }

        // 2. Email de impacto inmediato al Lead
        await EmailService.enviarEmailBienvenidaLead({
            to: email,
            nombre,
            situacion
        })

        // 3. Notificar al equipo (Webhook y Email)
        if (result.lead) {
            // b) Webhook a Make.com
            await WebhookService.notify('nuevo_lead_capturado', {
                id: result.lead.id,
                nombre,
                email,
                telefono,
                situacion
            });

            // c) Email Interno Admin
            if (process.env.ADMIN_EMAIL) {
                await EmailService.notificarEquipo({
                    tipo: 'nuevo_pedido',
                    nombreServicio: 'NUEVO LEAD: ' + nombre,
                    cliente: `${email} (${telefono || 'Sin telf'})`,
                    monto: 0,
                    pedidoId: result.lead.id
                })
            }
        }

        return NextResponse.json({ success: true, leadId: result.lead.id })

    } catch (error: any) {
        console.error('❌ [API Leads] Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
