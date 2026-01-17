'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type CarlaStatus = 'idle' | 'connecting' | 'listening' | 'processing' | 'speaking' | 'ended' | 'error'
type ChatMsg = { role: 'user' | 'assistant'; text: string }

export default function CarlaClient() {
  const [status, setStatus] = useState<CarlaStatus>('idle')
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [draftUserText, setDraftUserText] = useState('')
  const [assistantStreamingText, setAssistantStreamingText] = useState('')
  const timersRef = useRef<number[]>([])

  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t))
    timersRef.current = []
  }

  useEffect(() => {
    return () => clearTimers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startDemo = () => {
    clearTimers()
    setMessages([])
    setDraftUserText('')
    setAssistantStreamingText('')
    setStatus('connecting')

    const t1 = window.setTimeout(() => {
      setStatus('listening')

      const demoUserFinal = 'Quiero crear una LLC. ¿Qué plan me conviene para empezar?'
      let i = 0

      const tick = () => {
        i += 1
        setDraftUserText(demoUserFinal.slice(0, i))
        if (i < demoUserFinal.length) {
          const t = window.setTimeout(tick, 18)
          timersRef.current.push(t)
        } else {
          const t = window.setTimeout(() => {
            setDraftUserText('')
            setMessages([{ role: 'user', text: demoUserFinal }])
            setStatus('processing')

            const t2 = window.setTimeout(() => {
              setStatus('speaking')
              const assistantFull =
                'Si quieres validar tu negocio sin complicarte, suele encajar “LLC Esencial”. ' +
                'Si tu prioridad es empezar a cobrar desde el primer mes con acompañamiento, entonces “Launch Banking” suele ser mejor. ' +
                'Si me dices tu país y si ya tienes clientes, te lo afino en 30 segundos.'

              setMessages((prev) => [...prev, { role: 'assistant', text: '' }])

              const words = assistantFull.split(' ')
              let w = 0

              const streamWords = () => {
                w += 1
                const next = words.slice(0, w).join(' ')
                setAssistantStreamingText(next)

                setMessages((prev) => {
                  const copy = [...prev]
                  const lastIdx = copy.map((m) => m.role).lastIndexOf('assistant')
                  if (lastIdx >= 0) copy[lastIdx] = { role: 'assistant', text: next }
                  return copy
                })

                if (w < words.length) {
                  const t = window.setTimeout(streamWords, 70)
                  timersRef.current.push(t)
                } else {
                  setStatus('ended')
                }
              }

              streamWords()
            }, 500)

            timersRef.current.push(t2)
          }, 250)

          timersRef.current.push(t)
        }
      }

      tick()
    }, 650)

    timersRef.current.push(t1)
  }

  const label =
    status === 'idle'
      ? 'Listo'
      : status === 'connecting'
      ? 'Conectando…'
      : status === 'listening'
      ? 'Escuchando…'
      : status === 'processing'
      ? 'Procesando…'
      : status === 'speaking'
      ? 'Carla está respondiendo…'
      : status === 'ended'
      ? 'Conversación finalizada'
      : 'Error'

  return (
    <div
      style={{
        border: '1px solid var(--color-card-border)',
        borderRadius: 16,
        background: 'var(--color-surface)',
        boxShadow: '0 10px 30px rgba(7, 36, 55, 0.12)',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          padding: 18,
          display: 'flex',
          justifyContent: 'space-between',
          gap: 14,
          alignItems: 'center',
          borderBottom: '1px solid var(--color-card-border)',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Carla (demo)</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
            Transcripción en tiempo real (simulada)
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={startDemo}>
            Iniciar demo
          </button>
          <Link className="btn btn-white" href="/contacto">
            Contacto
          </Link>
        </div>
      </div>

      <div
        role="status"
        aria-live="polite"
        style={{
          padding: '10px 18px',
          background: 'rgba(33, 128, 141, 0.06)',
          borderBottom: '1px solid rgba(33, 128, 141, 0.18)',
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          fontWeight: 700
        }}
      >
        {label}
        <span
          style={{
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: '0.06em',
            background: 'rgba(33, 128, 141, 0.12)',
            padding: '3px 8px',
            borderRadius: 999,
            color: 'var(--color-primary)'
          }}
        >
          DEMO
        </span>
      </div>

      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '52vh', overflow: 'auto' }}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              border: '1px solid rgba(94, 82, 64, 0.16)',
              borderRadius: 12,
              padding: 12,
              background: m.role === 'user' ? 'rgba(29, 78, 216, 0.06)' : 'rgba(15, 23, 42, 0.04)',
              borderColor: m.role === 'user' ? 'rgba(29, 78, 216, 0.18)' : 'rgba(94, 82, 64, 0.16)'
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--color-text-secondary)', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>
              {m.role === 'user' ? 'Tú' : 'Carla'}
            </div>
            <div style={{ lineHeight: 1.55 }}>
              {m.text || (m.role === 'assistant' ? assistantStreamingText : '')}
            </div>
          </div>
        ))}

        {status === 'listening' && (
          <div
            style={{
              border: '1px solid rgba(29, 78, 216, 0.18)',
              borderRadius: 12,
              padding: 12,
              background: 'rgba(29, 78, 216, 0.06)',
              opacity: 0.85
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--color-text-secondary)', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>
              Tú (borrador)
            </div>
            <div style={{ lineHeight: 1.55 }}>{draftUserText}</div>
          </div>
        )}
      </div>

      <div style={{ padding: '12px 18px 18px 18px', borderTop: '1px solid var(--color-card-border)', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <Link href="/precios" style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
          Ir a Precios
        </Link>
        <Link href="/servicios" style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
          Ir a Servicios
        </Link>
      </div>
    </div>
  )
}
