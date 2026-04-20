import { sendGAEvent } from '@next/third-parties/google';

/**
 * Helper centralizado para enviar eventos a Google Analytics 4
 * Adaptado específicamente para Open LLC USA
 */

export const Analytics = {
    /**
     * Evento cuando el usuario hace clic en el CTA principal "Comenzar mi LLC ahora"
     */
    trackStartLLC: (location: 'hero' | 'pricing' | 'footer' | 'process') => {
        sendGAEvent('event', 'start_llc_click', {
            button_location: location,
            page: 'homepage',
        });
        console.log('📊 [Analytics] start_llc_click →', location);
    },

    /**
     * Evento cuando el usuario hace clic en "Ver cómo funciona"
     */
    trackHowItWorks: (location: 'hero' | 'process_section') => {
        sendGAEvent('event', 'how_it_works_click', {
            button_location: location,
            page: 'homepage',
        });
        console.log('📊 [Analytics] how_it_works_click →', location);
    },

    /**
     * Evento cuando el usuario envía el formulario de Asesoría Rápida
     */
    trackAdvisoryFormSubmit: (formData?: { country?: string }) => {
        sendGAEvent('event', 'advisory_form_submit', {
            form_location: 'advisory_section',
            ...formData,
        });
        console.log('📊 [Analytics] advisory_form_submit');
    },

    /**
     * Evento cuando el formulario se envía exitosamente (muestra mensaje de éxito)
     */
    trackAdvisoryFormSuccess: () => {
        sendGAEvent('event', 'advisory_form_success', {
            form_location: 'advisory_section',
        });
        console.log('📊 [Analytics] advisory_form_success');
    },

    /**
     * Evento genérico para otros clics importantes (opcional)
     */
    trackClick: (eventName: string, params: Record<string, any> = {}) => {
        sendGAEvent('event', eventName, {
            page: 'homepage',
            ...params,
        });
        console.log(`📊 [Analytics] ${eventName}`, params);
    },
};

// Exportamos también los nombres de eventos por si los necesitamos en otros lugares
export const GA_EVENTS = {
    START_LLC: 'start_llc_click',
    HOW_IT_WORKS: 'how_it_works_click',
    ADVISORY_SUBMIT: 'advisory_form_submit',
    ADVISORY_SUCCESS: 'advisory_form_success',
} as const;