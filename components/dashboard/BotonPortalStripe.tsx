'use client'

import { useState } from 'react'
import { ExternalLink, Loader2 } from 'lucide-react'

export default function BotonPortalStripe() {
    const [loading, setLoading] = useState(false)

    const handleOpenPortal = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/stripe/create-portal', {
                method: 'POST',
            })
            const data = await res.json()

            if (data.url) {
                window.location.href = data.url
            } else {
                alert(data.error || 'No se pudo abrir el portal de facturación.')
            }
        } catch (err) {
            console.error('Error opening portal:', err)
            alert('Ocurrió un error al intentar conectar con Stripe.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleOpenPortal}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {loading ? (
                <>
                    <Loader2 className="animate-spin" size={18} />
                    Conectando...
                </>
            ) : (
                <>
                    <ExternalLink size={18} />
                    Gestionar Pagos y Facturas
                </>
            )}
        </button>
    )
}
