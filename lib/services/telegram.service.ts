// lib/services/telegram.service.ts

export class TelegramService {
    /**
     * Envía un mensaje a un chat de Telegram mediante un Bot
     */
    static async enviarNotificacion(mensaje: string) {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
            console.log('ℹ️ [TelegramService] TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no configurados. Omitiendo mensaje.');
            return;
        }

        try {
            const url = `https://api.telegram.org/bot${token}/sendMessage`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: mensaje,
                    parse_mode: 'Markdown'
                })
            });

            if (!response.ok) {
                console.error(`❌ [TelegramService] Error (${response.status}):`, await response.text());
                return { success: false };
            }

            console.log('✅ [TelegramService] Notificación enviada con éxito.');
            return { success: true };
        } catch (error) {
            console.error('💥 [TelegramService] Excepción:', error);
            return { success: false, error };
        }
    }

    /**
     * Formatea una alerta de Lead Tier 1
     */
    static async alertarTier1(lead: { nombre: string, email: string, score: number }) {
        const msg = `
🔥 *LEAD TIER 1 DETECTADO* 🔥
---------------------------
👤 *Nombre:* ${lead.nombre}
📧 *Email:* ${lead.email}
📊 *Score:* ${lead.score}%
🚀 *Potencial:* Muy alto (Cierre recomendado)

_Acción: El sistema ya ha enviado el email de cierre y agendamiento._
        `.trim();

        return this.enviarNotificacion(msg);
    }
}
