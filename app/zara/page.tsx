'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

type ZaraStatus =
  | 'idle'
  | 'permission_denied'
  | 'connecting'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'ended'
  | 'error'

type ChatMsg = { role: 'user' | 'assistant'; text: string }

// ─── Motor de voz (Fase 0: APIs nativas del navegador, coste 0) ───────────
// Misma implementación que el modal del header: dictado con SpeechRecognition,
// respuesta hablada con speechSynthesis y cerebro en /api/chat (modo voz).
// Cada paso se registra en consola con el prefijo [Zara voz].

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort: () => void
  onstart: (() => void) | null
  onresult: ((event: any) => void) | null
  onerror: ((event: any) => void) | null
  onend: (() => void) | null
}

const LOG = '[Zara voz]'
const NUDGE_MS = 8000
const NUDGE_MSG =
  'No te estoy oyendo. Comprueba que el micrófono no esté silenciado, que sea el dispositivo correcto y que hables cerca de él.'

function logVoice(...args: any[]) {
  if (typeof console !== 'undefined') console.info(LOG, ...args)
}

function speechSupported(): boolean {
  if (typeof window === 'undefined') return false
  const w = window as any
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition)
}

// Vivaldi y Brave son Chromium pero sin el servicio de voz de Google.
function isSpeechlessBrowser(): { es: boolean; motivo: string } {
  if (typeof navigator === 'undefined') return { es: false, motivo: '' }
  const ua = navigator.userAgent || ''
  if (/Vivaldi/i.test(ua)) return { es: true, motivo: 'Vivaldi no incluye el servicio de voz de Google.' }
  if ((navigator as any).brave) return { es: true, motivo: 'Brave no incluye el servicio de voz de Google.' }
  if (/Firefox|FxiOS/i.test(ua)) return { es: true, motivo: 'Firefox no permite el dictado por voz.' }
  return { es: false, motivo: '' }
}

function dictationAvailable(): boolean {
  return speechSupported() && !isSpeechlessBrowser().es
}

function dictationNote(): string {
  // Primero el motivo concreto (Vivaldi, Brave, Firefox) y después el caso genérico.
  const { es, motivo } = isSpeechlessBrowser()
  if (es) return `${motivo} Prueba con Chrome, Edge o Safari, o escribe en el chat de texto.`
  if (!speechSupported()) return 'Este navegador no permite dictado por voz. Prueba con Chrome, Edge o Safari.'
  return ''
}

function describeRecognitionError(code: string): string {
  const { es, motivo } = isSpeechlessBrowser()
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      if (es) {
        return `${motivo} Y en este equipo no tengo permiso para usar el micrófono. Prueba con Chrome, Edge o Safari.`
      }
      return 'Necesito permiso para usar el micrófono. Actívalo en el candado de la barra de direcciones y vuelve a intentarlo.'
    case 'network':
      return `${es ? motivo + ' ' : ''}El dictado de este navegador no ha podido conectar con su servicio de voz. Prueba con Chrome, Edge o Safari.`
    case 'audio-capture':
      return 'No encuentro ningún micrófono disponible en este equipo. Revisa que esté conectado y activo en los ajustes de sonido.'
    case 'no-speech':
      return NUDGE_MSG
    case 'aborted':
      return ''
    default:
      return `El reconocimiento de voz ha fallado (${code}). Prueba con Chrome, Edge o Safari.`
  }
}

function createRecognition(): SpeechRecognitionLike | null {
  if (!speechSupported()) return null
  const w = window as any
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition
  const rec: SpeechRecognitionLike = new Ctor()
  rec.lang = 'es-ES'
  // Chrome cierra el reconocimiento en cada pausa: lo reabrimos desde onend.
  rec.continuous = false
  rec.interimResults = true
  rec.maxAlternatives = 1
  return rec
}

function pickSpanishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices() || []
  return voices.find((v) => /^es([-_]|$)/i.test(v.lang)) || null
}

// Texto tal y como se lee en voz alta: sin Markdown, sin enlaces y sin emojis.
function speakable(text: string): string {
  return (text || '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/^\s*[-\u2022]\s*/gm, '')
    .replace(/^\s*\d+[.)]\s*/gm, '')
    .replace(/([:;.!?\u2026]\s)\d+[.)]\s+/g, '$1')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

// Texto tal y como se pinta en la transcripción.
function readable(text: string): string {
  return (text || '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/^\s*#{1,6}\s*/gm, '')
    .replace(/^\s*[-\u2022]\s*/gm, '')
    .replace(/^\s*\d+[.)]\s*/gm, '')
    .replace(/([:;.!?\u2026]\s)\d+[.)]\s+/g, '$1')
    .replace(/\*+/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

export default function ZaraClient() {
  const [status, setStatus] = useState<ZaraStatus>('idle')
  const [draftUserText, setDraftUserText] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [supported, setSupported] = useState(true)

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const activeRef = useRef(false)
  const listeningRef = useRef(false)
  const speakingRef = useRef(false)
  const spokenCharsRef = useRef(0)
  const heardSomethingRef = useRef(false)
  const restartTimerRef = useRef<number | null>(null)
  const nudgeTimerRef = useRef<number | null>(null)

  const { messages, sendMessage, status: chatStatus, error: chatError, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat', body: { mode: 'voice' } }),
    messages: []
  })

  const chatStatusRef = useRef(chatStatus)
  useEffect(() => {
    chatStatusRef.current = chatStatus
  }, [chatStatus])

  const transcript: ChatMsg[] = useMemo(
    () =>
      messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          text: (((m as any).parts || []) as any[])
            .filter((p) => p.type === 'text')
            .map((p) => p.text)
            .join('')
        })),
    [messages]
  )

  const lastAssistantText = useMemo(() => {
    for (let i = transcript.length - 1; i >= 0; i -= 1) {
      if (transcript[i].role === 'assistant') return transcript[i].text
    }
    return ''
  }, [transcript])

  function clearTimers() {
    if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current)
    if (nudgeTimerRef.current) window.clearTimeout(nudgeTimerRef.current)
    restartTimerRef.current = null
    nudgeTimerRef.current = null
  }

  function scheduleNudge() {
    if (nudgeTimerRef.current) window.clearTimeout(nudgeTimerRef.current)
    nudgeTimerRef.current = window.setTimeout(() => {
      if (!activeRef.current || heardSomethingRef.current) return
      logVoice('8 s escuchando sin captar nada: muestro aviso')
      setErrorMsg(NUDGE_MSG)
    }, NUDGE_MS)
  }

  function cancelSpeech() {
    speakingRef.current = false
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }

  function speak(text: string, reintento = false) {
    const clean = speakable(text)
    if (!clean) return
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      logVoice('sin soporte de síntesis en este navegador')
      setStatus('error')
      setErrorMsg('Tu navegador no puede reproducir voz, pero la transcripción sigue en pantalla.')
      return
    }

    const voice = voiceRef.current || pickSpanishVoice()
    if (voice) voiceRef.current = voice
    if (window.speechSynthesis.paused) window.speechSynthesis.resume()

    const frase = clean
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.lang = 'es-ES'
    if (voice) utterance.voice = voice
    utterance.rate = 1.02
    utterance.pitch = 1
    utterance.onstart = () => {
      speakingRef.current = true
      setStatus('speaking')
      logVoice('locución en curso:', frase.slice(0, 60))
    }
    utterance.onend = () => {
      speakingRef.current = false
      onSpeechIdle()
    }
    utterance.onerror = (event: any) => {
      speakingRef.current = false
      const code = event?.error || 'desconocido'
      logVoice('error de síntesis:', code, reintento ? '(ya reintentado)' : '')
      if (!reintento && code !== 'interrupted' && code !== 'canceled') {
        window.setTimeout(() => speak(clean, true), 350)
        return
      }
      if (!reintento) return
      setErrorMsg(
        'No he podido reproducir la voz de Zara. Revisa el volumen del equipo o prueba con otro navegador: el texto queda en pantalla.'
      )
      onSpeechIdle()
    }
    window.speechSynthesis.speak(utterance)
  }

  function onSpeechIdle() {
    if (!activeRef.current) return
    if (chatStatusRef.current === 'streaming' || chatStatusRef.current === 'submitted') return
    if (spokenCharsRef.current < lastAssistantText.length) return
    startListening()
  }

  function startListening() {
    if (!activeRef.current) return
    const rec = recognitionRef.current
    if (!rec || listeningRef.current) return
    try {
      rec.start()
      logVoice('micro abierto')
    } catch (e: any) {
      const nombre = e?.name || 'error'
      const mensaje = e?.message || String(e)
      logVoice('start() ha lanzado:', nombre, mensaje)
      if (nombre === 'InvalidStateError') return
      activeRef.current = false
      setStatus('error')
      setErrorMsg(`No he podido abrir el micrófono (${nombre}). ${dictationNote()}`.trim())
    }
  }

  function setupRecognition(): SpeechRecognitionLike | null {
    const rec = createRecognition()
    if (!rec) return null

    rec.onstart = () => {
      listeningRef.current = true
      heardSomethingRef.current = false
      if (!speakingRef.current) setStatus('listening')
      scheduleNudge()
      logVoice('reconocimiento iniciado')
    }

    rec.onresult = (event: any) => {
      if (speakingRef.current || window.speechSynthesis?.speaking) {
        cancelSpeech()
        setStatus('listening')
      }
      heardSomethingRef.current = true
      if (nudgeTimerRef.current) {
        window.clearTimeout(nudgeTimerRef.current)
        nudgeTimerRef.current = null
      }
      setErrorMsg((prev) => (prev === NUDGE_MSG ? '' : prev))

      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i]
        if (result.isFinal) final += result[0].transcript
        else interim += result[0].transcript
      }
      if (interim) setDraftUserText(interim)
      if (final.trim()) {
        logVoice('reconocido:', final.trim())
        setDraftUserText('')
        askZara(final.trim())
      }
    }

    rec.onerror = (event: any) => {
      const code = event?.error || 'desconocido'
      logVoice('error de reconocimiento:', code, event?.message || '')
      if (code === 'aborted') return
      if (code === 'no-speech') {
        if (!heardSomethingRef.current) setErrorMsg(NUDGE_MSG)
        return
      }
      const explicacion = describeRecognitionError(code)
      if (!explicacion) return
      activeRef.current = false
      setStatus(code === 'not-allowed' || code === 'service-not-allowed' ? 'permission_denied' : 'error')
      setErrorMsg(explicacion)
    }

    rec.onend = () => {
      listeningRef.current = false
      if (!activeRef.current) return
      if (speakingRef.current) return
      if (chatStatusRef.current === 'streaming' || chatStatusRef.current === 'submitted') return
      if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current)
      restartTimerRef.current = window.setTimeout(() => startListening(), 300)
    }

    return rec
  }

  function askZara(text: string) {
    cancelSpeech()
    spokenCharsRef.current = 0
    setStatus('processing')
    logVoice('envío al endpoint:', text)
    sendMessage({ role: 'user', parts: [{ type: 'text', text }] } as any)
  }

  function startVoice() {
    setErrorMsg('')
    if (!dictationAvailable()) {
      activeRef.current = false
      setStatus('error')
      setErrorMsg(`${dictationNote()} Mientras tanto puedes escribirme en el chat de texto.`.trim())
      return
    }
    setMessages([])
    setDraftUserText('')
    spokenCharsRef.current = 0
    heardSomethingRef.current = false
    activeRef.current = true
    setStatus('connecting')
    logVoice('sesión iniciada')
    // Safari exige un gesto del usuario antes de sintetizar voz.
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel()
        window.speechSynthesis.resume()
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(' '))
      } catch {
        // seguimos: el texto queda en pantalla
      }
    }
    if (!recognitionRef.current) recognitionRef.current = setupRecognition()
    startListening()
  }

  function stopVoice() {
    activeRef.current = false
    listeningRef.current = false
    clearTimers()
    cancelSpeech()
    try {
      recognitionRef.current?.abort()
    } catch {
      /* inocuo */
    }
    logVoice('sesión finalizada por el usuario')
    setDraftUserText('')
    setStatus('ended')
  }

  useEffect(() => {
    setSupported(dictationAvailable())
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const load = () => {
      const voice = pickSpanishVoice()
      if (voice) voiceRef.current = voice
      logVoice('voces disponibles:', window.speechSynthesis.getVoices().length)
    }
    load()
    window.speechSynthesis.addEventListener?.('voiceschanged', load)
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', load)
      // Al salir de la página no dejamos micrófono ni voz abiertos.
      activeRef.current = false
      clearTimers()
      cancelSpeech()
      try {
        recognitionRef.current?.abort()
      } catch {
        /* noop */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Vamos hablando por frases completas mientras el texto llega en streaming.
  useEffect(() => {
    if (!activeRef.current) return
    if (!lastAssistantText) return
    const pending = lastAssistantText.slice(spokenCharsRef.current)

    if (!pending.trim()) {
      if (chatStatus === 'ready' && !speakingRef.current) onSpeechIdle()
      return
    }

    if (chatStatus === 'streaming' || chatStatus === 'submitted') {
      const sentence = pending.match(/^[\s\S]*[.!?\u2026](?=\s|$)/)
      if (sentence && sentence[0].trim().length > 24) {
        spokenCharsRef.current += sentence[0].length
        speak(sentence[0])
      }
      return
    }

    spokenCharsRef.current = lastAssistantText.length
    speak(pending)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastAssistantText, chatStatus])

  useEffect(() => {
    if (!chatError) return
    logVoice('error del endpoint /api/chat:', chatError.message)
    setStatus('error')
    setErrorMsg('No he podido conseguir la respuesta. ¿Lo intentamos otra vez?')
  }, [chatError])

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
      ? 'Zara está respondiendo…'
      : status === 'permission_denied'
      ? 'Micrófono bloqueado'
      : status === 'ended'
      ? 'Conversación finalizada'
      : 'Ha ocurrido un problema'

  const mostrarAviso = status === 'error' || status === 'permission_denied' || (status === 'listening' && errorMsg !== '')

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
          <div style={{ fontSize: 18, fontWeight: 800 }}>Zara (voz)</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
            Habla y te contesto en voz alta, con la transcripción en pantalla
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {status === 'speaking' && (
            <button
              className="btn btn-primary"
              onClick={() => {
                cancelSpeech()
                setStatus('listening')
                startListening()
              }}
            >
              Interrumpir voz
            </button>
          )}
          {status === 'idle' || status === 'ended' ? (
            <button className="btn btn-primary" onClick={startVoice} disabled={!supported}>
              {status === 'ended' ? 'Volver a empezar' : 'Iniciar asesoría por voz'}
            </button>
          ) : (
            <button className="btn btn-white" onClick={stopVoice}>
              Finalizar
            </button>
          )}
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
          VOZ · BETA
        </span>
      </div>

      {!supported && (
        <div
          style={{
            padding: '10px 18px',
            background: 'rgba(179, 38, 30, 0.08)',
            borderBottom: '1px solid rgba(179, 38, 30, 0.25)',
            color: '#b3261e',
            fontWeight: 700
          }}
        >
          {dictationNote()}
        </div>
      )}

      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '52vh', overflow: 'auto' }}>
        {transcript.map((m, idx) => (
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
              {m.role === 'user' ? 'Tú' : 'Zara'}
            </div>
            <div style={{ lineHeight: 1.55 }}>{readable(m.text)}</div>
          </div>
        ))}

        {status === 'idle' && transcript.length === 0 && (
          <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
            Pulsa «Iniciar asesoría por voz» y dime qué necesitas: te ayudo con el plan, el estado de constitución,
            el EIN, los plazos y las obligaciones anuales.
          </div>
        )}

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

        {mostrarAviso && (
          <div
            style={{
              border: '1px solid rgba(179, 38, 30, 0.25)',
              borderRadius: 12,
              padding: 12,
              background: 'rgba(179, 38, 30, 0.06)'
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 900, color: '#b3261e', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>
              {label}
            </div>
            <div style={{ lineHeight: 1.55 }}>{errorMsg}</div>
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
