'use client';

import React, { useEffect } from 'react';
import { analyticsEvents } from "../../lib/analytics";

export default function TestAnalyticsPage() {
  useEffect(() => {
    console.log('🧪 Iniciando simulación de evento de compra...');

    // Simulamos un evento de compra de prueba
    analyticsEvents.trackEvent('purchase', 'conversion', 'test_purchase', 197.00);

    console.log('✅ Evento de prueba enviado a GA4');
  }, []);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>🧪 Página de prueba GA4</h1>
      <p>Revisa la consola del navegador (F12) para ver si se enviaron los eventos.</p>
    </div>
  );
}