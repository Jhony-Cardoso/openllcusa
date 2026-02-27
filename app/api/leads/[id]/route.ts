import { NextResponse } from 'next/server'
import { LeadModel } from '@/lib/models/lead'
import { EmailService } from '@/lib/services/email.service'
import { WebhookService } from '@/lib/services/webhook.service'
import { TelegramService } from '@/lib/services/telegram.service'

// Candado en memoria para evitar colisiones de peticiones casi simultáneas
const processingLeads = new Set<string>();

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Si ya se está procesando este ID en este instante, abortamos
    if (processingLeads.has(id)) {
        console.log(`⏳ [API Leads] Ignorando petición duplicada simultánea para ID: ${id}`);
        return NextResponse.json({ success: true, message: 'Already processing' });
    }

    try {
        processingLeads.add(id);
        const body = await req.json()
        const { score, metadata } = body

        // 0. Obtener estado previo del lead para evitar envíos duplicados
        const adminClient = await import('@/lib/supabase/admin')
        const supabase = adminClient.createAdminClient()
        const { data: previousLead } = await supabase.from('leads').select('metadata').eq('id', id).single()
        const teniaScorePrevio = previousLead?.metadata?.quiz_score !== undefined;

        // 1. Actualizar en Base de Datos
        const result: any = await LeadModel.actualizar(id, {
            ...(score !== undefined && { metadata: { quiz_score: score } }),
            ...(metadata && { metadata })
        })

        if (!result.success || !result.lead) {
            return NextResponse.json({ error: 'Fallo al actualizar el lead' }, { status: 500 })
        }

        const lead = result.lead

        // 2. DISPARAR EMBUDO AUTOMÁTICO (Si hay score y no se había procesado antes)
        const yaEnviado = previousLead?.metadata?.email_seguimiento_enviado === true;

        if (score !== undefined && !teniaScorePrevio && !yaEnviado) {
            console.log(`🚀 [Embudo] Disparando automatización para ${lead.email} (Score: ${score})`)

            // a) Email directo
            if (score >= 80) {
                await EmailService.enviarSeguimientoTier1({ to: lead.email, nombre: lead.nombre })

                // 🔔 Alerta Telegram (Lead VIP)
                await TelegramService.alertarTier1({
                    nombre: lead.nombre,
                    email: lead.email,
                    score: score
                })
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

            // c) Marcar como procesado para evitar duplicados en re-entradas
            await LeadModel.actualizar(id, {
                metadata: { email_seguimiento_enviado: true }
            });
        }

        return NextResponse.json({ success: true, lead: result.lead })
    } catch (error: any) {
        console.error('❌ [API Leads PATCH] Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    } finally {
        // Liberamos el candado después de un tiempo prudencial (2s) por si acaso hay retardos de red
        setTimeout(() => processingLeads.delete(id), 2000);
    }
}
