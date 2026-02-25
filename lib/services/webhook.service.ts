// lib/services/webhook.service.ts

export class WebhookService {
    /**
     * Envía datos a un webhook externo (Make/Zapier)
     */
    static async notify(event: string, data: any) {
        const webhookUrl = process.env.MAKE_LEADS_WEBHOOK_URL;

        if (!webhookUrl) {
            console.log('ℹ️ [WebhookService] No se ha configurado MAKE_LEADS_WEBHOOK_URL. Omitiendo notificación externa.');
            return;
        }

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event,
                    timestamp: new Date().toISOString(),
                    ...data
                })
            });

            if (!response.ok) {
                console.error(`❌ [WebhookService] Error al notificar webhook (${response.status}):`, await response.text());
            } else {
                console.log(`✅ [WebhookService] Evento "${event}" enviado con éxito.`);
            }
        } catch (error) {
            console.error('💥 [WebhookService] Error enviando webhook:', error);
        }
    }
}
