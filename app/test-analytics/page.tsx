'use client'

import React, { useEffect } from 'react'
import { Analytics } from '@/lib/analytics'

export default function TestAnalyticsPage() {
    useEffect(() => {
        console.log('🧪 Iniciando simulacion de evento de compra...')

        // Simulamos un evento de compra de prueba
        Analytics.trackPurchase({
            transaction_id: 'TEST_PURCHASE_' + Math.floor(Math.random() * 100000),
            currency: 'USD',
            value: 197.00,
            items: [
                {
                    item_id: 'test_ein_001',
                    item_name: 'Obtencion de EIN (Simulacion)',
                    price: 197.00,
                    quantity: 1,
                    item_category: 'Servicio'
                }
            ]
        })

    }, [])

    return (
        <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h1 style={{ color: '#0ea5e9' }}>Simulacion de Analytics Enviada</h1>
            <p>Se ha disparado un evento de compra de prueba.</p>
            <div style={{ marginTop: '20px', padding: '20px', background: '#f8fafc', borderRadius: '12px', display: 'inline-block', textAlign: 'left' }}>
                <p><strong>Para verificar:</strong></p>
                <ol>
                    <li>Abre la consola del navegador (F12).</li>
                    <li>Busca el mensaje que empieza por "[Analytics] purchase".</li>
                    <li>Revisa tu panel de GA4 en Tiempo Real.</li>
                </ol>
            </div>
        </div>
    )
}
