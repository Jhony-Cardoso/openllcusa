// lib/analytics.ts
'use client';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Declaración para que TypeScript reconozca gtag
declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}

export const trackEvent = (action: string, category?: string, label?: string, value?: number) => {
  if (typeof window === 'undefined' || !window.gtag || !GA_ID) return;

  window.gtag('event', action, {
    event_category: category || 'engagement',
    event_label: label,
    value: value,
  });
};

// Eventos clave para nuestro funnel
export const analyticsEvents = {
  // Lead-form
  leadFormViewed: () => trackEvent('lead_form_viewed', 'lead', 'calculadora'),
  leadFormStep2: () => trackEvent('lead_form_step2', 'lead', 'continuar_quiz'),
  leadGenerated: () => trackEvent('lead_generated', 'conversion', 'lead_form', 1),

  // Quiz
  quizStarted: () => trackEvent('quiz_started', 'quiz', 'iniciado'),
  quizCompleted: () => trackEvent('quiz_completed', 'quiz', 'finalizado'),

  // CTA generales
  ctaClick: (label: string) => trackEvent('cta_click', 'engagement', label),
};