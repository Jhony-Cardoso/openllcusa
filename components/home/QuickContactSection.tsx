'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { analyticsEvents } from '@/lib/analytics';

const T = {
  // Blues — for hero, footer, accents only
  bd: '#0C2047', b9: '#1E3A8A', b7: '#1D4ED8', b5: '#3B82F6',
  b1: '#DBEAFE', b0: '#EFF6FF',
  // Green — success, checks
  gn: '#10B981', gd: '#059669', gl: '#D1FAE5',
  // CTA — orange
  ct: '#EA580C', ch: '#C2410C',
  // Neutrals
  tx: '#111827', ts: '#4B5563', tm: '#9CA3AF',
  br: '#E5E7EB', wh: '#FFFFFF', sf: '#F8FAFC',
  // Shadows
  shCard: '0 1px 4px rgba(17,24,39,.06), 0 4px 16px rgba(17,24,39,.07)',
  shCta: '0 6px 24px rgba(234,88,12,.38)',
  shBlue: '0 6px 24px rgba(30,58,138,.24)',
} as const;

function Eyebrow({ text, green }: { text: string; green?: boolean }) {
  return (
    <span
      className="inline-block text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full"
      style={{
        background: green ? T.gl : T.b0,
        color: green ? T.gd : T.b7,
      }}
    >
      {text}
    </span>
  )
}

const COUNTRIES_LIST = [
  'España', 'México', 'Colombia', 'Argentina', 'Chile', 'Perú',
  'Paraguay', 'Estados Unidos', 'Venezuela', 'Ecuador', 'Otro país',
];

function QuickContactSection() {
  const [form, setForm] = useState({ name: '', email: '', country: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    analyticsEvents.trackEvent('cta_click', 'asesoria_rapida', 'enviar');
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          country: form.country,
        }),
      });

      if (response.ok) {
        setSent(true);
        analyticsEvents.trackEvent('form_submit_success', 'asesoria_rapida');
      } else {
        alert('Hubo un error al enviar. Inténtalo de nuevo.');
      }
    } catch (error) {
      alert('Error de conexión. Por favor, inténtalo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px', fontSize: 16, color: T.tx,
    background: T.sf, border: `1.5px solid ${T.br}`, borderRadius: 12,
    fontFamily: "'Inter',sans-serif",
  };

  return (
    <section
      id="contacto-rapido"
      style={{
        background: `linear-gradient(135deg, ${T.b0} 0%, #E8F0FF 100%)`,
        padding: '96px 0',
        borderTop: `1px solid ${T.b1}`,
        borderBottom: `1px solid ${T.b1}`,
      }}
    >
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div className="hp-fu text-center mb-11">
          <Eyebrow text="Asesoría rápida" />
          <h2
            className="font-extrabold mt-3.5 mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(26px,3vw,38px)', color: T.b9 }}
          >
            ¿Tienes dudas? Recibe asesoría personalizada en menos de 12 horas
          </h2>
          <p className="text-base mx-auto" style={{ color: T.ts, maxWidth: 520 }}>
            Sin compromiso. Un especialista en español te responderá de forma clara y adaptada a tu situación.
          </p>
        </div>

        {/* Success state */}
        {sent ? (
          <div
            className="text-center rounded-2xl mx-auto"
            style={{ background: T.wh, border: `1.5px solid rgba(16,185,129,.35)`, padding: '48px 36px', boxShadow: T.shCard, maxWidth: 560 }}
          >
            <div className="text-4xl mb-5">✅</div>
            <h3 className="font-bold text-xl mb-2.5" style={{ color: T.tx }}>¡Solicitud recibida!</h3>
            <p className="text-[15.5px]" style={{ color: T.ts }}>
              Un especialista revisará tu caso y te responderá en menos de 12 horas.<br /><br />
              <strong>Si quieres que preparemos mejor tu respuesta</strong>, responde al email que te acabamos de enviar contándonos tu duda principal.
            </p>
          </div>
        ) : (
          /* Formulario simple */
          <form
            onSubmit={handleSubmit}
            className="hp-fu rounded-2xl mx-auto"
            style={{ background: T.wh, border: `1.5px solid ${T.br}`, padding: '40px 36px', boxShadow: T.shCard, maxWidth: 680 }}
          >
            <div className="hp-fgrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: T.ts }}>Nombre completo *</label>
                <input
                  required
                  type="text"
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: T.ts }}>Email *</label>
                <input
                  required
                  type="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[13px] font-semibold mb-1.5" style={{ color: T.ts }}>País de residencia *</label>
              <select
                required
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                style={{ ...inputStyle, color: form.country ? T.tx : T.tm }}
              >
                <option value="" disabled>Selecciona tu país…</option>
                {COUNTRIES_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold text-base rounded-full border-0 cursor-pointer"
              style={{
                background: loading ? T.tm : `linear-gradient(135deg,${T.ct},${T.ch})`,
                color: T.wh,
                padding: '16px 32px',
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                boxShadow: loading ? 'none' : T.shCta,
              }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Enviando…
                </span>
              ) : '✉️ Recibir asesoría gratuita'}
            </button>

            <p className="text-[12.5px] text-center mt-4" style={{ color: T.tm }}>
              🔒 Tus datos están protegidos • Respuesta garantizada en menos de 12 horas • Sin spam
            </p>
          </form>
        )}
      </div>
    </section>
  )
}

export default QuickContactSection;
