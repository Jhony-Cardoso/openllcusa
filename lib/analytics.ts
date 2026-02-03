import { sendGAEvent } from '@next/third-parties/google'

/**
 * Helper para enviar eventos a Google Analytics 4
 * Documentación de eventos recomendados: https://developers.google.com/analytics/devguides/collection/ga4/reference/events
 */

export const Analytics = {
    /**
     * Se dispara cuando el usuario inicia el pago
     */
    trackBeginCheckout: (params: {
        currency: string
        value: number
        items: Array<{
            item_id: string
            item_name: string
            price: number
            quantity: number
            item_category?: string
        }>
    }) => {
        sendGAEvent('event', 'begin_checkout', params)
        console.log('📊 [Analytics] begin_checkout', params)
    },

    /**
     * Se dispara cuando la compra se completa exitosamente
     */
    trackPurchase: (params: {
        transaction_id: string
        currency: string
        value: number
        tax?: number
        shipping?: number
        items: Array<{
            item_id: string
            item_name: string
            price: number
            quantity: number
            item_category?: string
        }>
    }) => {
        sendGAEvent('event', 'purchase', params)
        console.log('📊 [Analytics] purchase', params)
    },

    /**
     * Se dispara cuando el usuario inicia sesión o se registra (si queremos trackear leads)
     */
    trackLogin: (method: string = 'clerk') => {
        sendGAEvent('event', 'login', { method })
    },

    trackSignUp: (method: string = 'clerk') => {
        sendGAEvent('event', 'sign_up', { method })
    }
}
