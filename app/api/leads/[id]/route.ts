import { NextResponse } from 'next/server'
import { LeadModel } from '@/lib/models/lead'
import { EmailService } from '@/lib/services/email.service'
import { WebhookService } from '@/lib/services/webhook.service'

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await req.json()
        const { score, metadata } = body

        // 1. Actualizar en Base de Datos
        const result: any = await LeadModel.actualizar(id, {
            ...(score !== undefined && { metadata: { quiz_score: score } }),
            ...(metadata && { metadata })
        })

        if (!result.success || !result.lead) {
            return NextResponse.json({ error: 'Fallo al actualizar el lead' }, { status: 500 })
        }

        const lead = result.lead

        // 2. DISPARAR EMBUDO AUTOMÁTICO (Si hay score)
        if (score !== undefined) {
            console.log(`🚀 [Embudo] Disparando automatización para ${lead.email} (Score: ${score})`)

            // a) Email directo
            if (score >= 80) {
                await EmailService.enviarSeguimientoTier1({ to: lead.email, nombre: lead.nombre })
            }
            else if (score >= 60) {
                await EmailService.enviarSeguimientoTier2({ to: lead.email, nombre: lead.nombre })
            }
            else {
                await EmailService.enviarSeguimientoTier3({ to: lead.email, nombre: lead.nombre })
            }

            // b) Notificar a CRM Externo (Make.com)
            await WebhookService.notify('lead_quiz_completed', {
                leadId: lead.id,
                email: lead.email,
                nombre: lead.nombre,
                score,
                tier: score >= 80 ? 1 : score >= 60 ? 2 : 3
            });
        }

        return NextResponse.json({ success: true, lead: result.lead })
    } catch (error: any) {
        console.error('❌ [API Leads PATCH] Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
