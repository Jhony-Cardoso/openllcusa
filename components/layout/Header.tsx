'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronDown,
  Menu,
  X,
  Globe,
  Smartphone,
  Search,
  HelpCircle,
  BookOpen,
  Send,
  Building
} from 'lucide-react'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

type ZaraStatus =
  | 'idle'
  | 'request_permission'
  | 'permission_denied'
  | 'connecting'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'ended'
  | 'error'

type ChatMsg = { role: 'user' | 'assistant'; text: string }

// ─── Motor de voz (Fase 0: APIs nativas del navegador, coste 0) ───────────
// Escuchamos con SpeechRecognition y hablamos con speechSynthesis. El cerebro
// sigue siendo /api/chat en modo voz, así que Zara conserva su prompt, su RAG
// y sus precios: aquí no hay proveedores externos ni coste por minuto.
// Todo lo que ocurre se registra en la consola del navegador con el prefijo
// [Zara voz] para poder diagnosticar sin adivinar.

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

// Vivaldi y Brave son Chromium pero sin el servicio de voz de Google: el objeto
// existe y arranca, pero falla al conectar. Mejor avisar antes de empezar.
function isSpeechlessBrowser(): { es: boolean; motivo: string } {
  if (typeof navigator === 'undefined') return { es: false, motivo: '' }
  const ua = navigator.userAgent || ''
  if (/Vivaldi/i.test(ua)) {
    return { es: true, motivo: 'Vivaldi no incluye el servicio de voz de Google.' }
  }
  if ((navigator as any).brave) {
    return { es: true, motivo: 'Brave no incluye el servicio de voz de Google.' }
  }
  if (/Firefox|FxiOS/i.test(ua)) {
    return { es: true, motivo: 'Firefox no permite el dictado por voz.' }
  }
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
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // [texto](/ruta) -> texto
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

// Texto tal y como se pinta en la transcripción: quita el formato que el modelo
// pueda haber dejado, pero conserva los saltos para que siga siendo legible.
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

function ZaraModal({
  open,
  onClose
}: {
  open: boolean
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  const [status, setStatus] = useState<ZaraStatus>('idle')
  const [draftUserText, setDraftUserText] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [supported, setSupported] = useState(true)

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const activeRef = useRef(false) // ¿sigue viva la sesión de voz?
  const listeningRef = useRef(false)
  const speakingRef = useRef(false)
  const spokenCharsRef = useRef(0) // cuánto de la respuesta actual ya se ha dicho
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

  // Los mensajes del SDK se convierten al formato que ya pintaba el modal.
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

    // La lista de voces llega tarde: la resolvemos en cada locución, no solo al cargar.
    const voice = voiceRef.current || pickSpanishVoice()
    if (voice) voiceRef.current = voice

    // cancel() puede dejar la cola en pausa: nos aseguramos antes de hablar.
    if (window.speechSynthesis.paused) window.speechSynthesis.resume()

    const prueba = clean
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.lang = 'es-ES'
    if (voice) utterance.voice = voice
    utterance.rate = 1.02
    utterance.pitch = 1
    utterance.onstart = () => {
      speakingRef.current = true
      setStatus('speaking')
      logVoice('locución en curso:', prueba.slice(0, 60))
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
        // Un único reintento: la primera locución falla en algunos equipos.
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

  // Cuando Zara termina de hablar (y no queda texto por leer) reabrimos el micro.
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
      // Antes se tragaba el error y la sesión quedaba muerta en silencio.
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
      // Barge-in: si el usuario empieza a hablar mientras Zara responde, la callamos.
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
        // Un silencio no es un fallo: el rearme lo reintenta. Tras varios, avisamos.
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
    // Safari exige un gesto del usuario antes de sintetizar voz: la desbloqueamos aquí.
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel()
        window.speechSynthesis.resume()
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(' '))
      } catch {
        // si el navegador no lo permite, seguimos: el texto queda en pantalla
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
      /* abort() sobre una instancia ya cerrada es inocuo */
    }
    logVoice('sesión finalizada por el usuario')
    setDraftUserText('')
    setStatus('ended')
  }

  function stopEverything() {
    activeRef.current = false
    listeningRef.current = false
    clearTimers()
    cancelSpeech()
    try {
      recognitionRef.current?.abort()
    } catch {
      /* abort() sobre una instancia ya cerrada es inocuo */
    }
    recognitionRef.current = null
    setDraftUserText('')
  }

  // Voces del sistema: pueden llegar después del primer render.
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
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', load)
  }, [])

  useEffect(() => {
    if (!open) return
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'

    const t = window.setTimeout(() => {
      const el = dialogRef.current
      if (!el) return
      const focusables = el.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      ; (focusables[0] || el).focus()
    }, 0)

    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (open) return
    stopEverything()
    setMessages([])
    setDraftUserText('')
    setErrorMsg('')
    setStatus('idle')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Vamos hablando por frases completas mientras el texto llega en streaming:
  // así Zara no espera a terminar toda la respuesta para contestar.
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

  function handleClose() {
    stopEverything()
    onClose()
    window.setTimeout(() => {
      previouslyFocusedRef.current?.focus?.()
    }, 0)
  }

  const trapFocusOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      handleClose()
      return
    }
    if (e.key !== 'Tab') return

    const el = dialogRef.current
    if (!el) return

    const focusables = Array.from(
      el.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((n) => !n.hasAttribute('disabled') && n.getAttribute('aria-hidden') !== 'true')

    if (focusables.length === 0) return

    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement as HTMLElement | null

    if (e.shiftKey) {
      if (active === first || !el.contains(active)) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (active === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'idle':
        return 'Listo'
      case 'request_permission':
        return 'Activar micrófono'
      case 'permission_denied':
        return 'Micrófono bloqueado'
      case 'connecting':
        return 'Conectando con Zara…'
      case 'listening':
        return 'Escuchando…'
      case 'processing':
        return 'Procesando…'
      case 'speaking':
        return 'Zara está respondiendo…'
      case 'ended':
        return 'Conversación finalizada'
      case 'error':
        return 'Ha ocurrido un problema'
      default:
        return 'Listo'
    }
  }, [status])

  if (!open) return null

  const mostrarAviso = status === 'error' || status === 'permission_denied' || (status === 'listening' && errorMsg !== '')

  return (
    <div className="zara-overlay" aria-hidden={false}>
      <div
        className="zara-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="zara-title"
        onKeyDown={trapFocusOnKeyDown}
      >
        <div className="zara-header">
          <div className="zara-titlewrap">
            <div id="zara-title" className="zara-title">
              Asesoría con Zara
            </div>
            <div className="zara-subtitle">Gratis, 24/7 · Voz + transcripción</div>
          </div>

          <button className="zara-close" onClick={handleClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="zara-status" role="status" aria-live="polite">
          {statusLabel}
          <span className="zara-status-badge">VOZ · BETA</span>
        </div>

        <div className="zara-body">
          {status === 'idle' && (
            <div className="zara-intro">
              <p className="zara-intro-text">
                Háblame y te contesto en voz alta, con la transcripción en pantalla. Te ayudo a elegir plan y a
                resolver dudas de EIN, estado, plazos y obligaciones.
              </p>

              {!supported && (
                <p className="zara-intro-text" style={{ color: '#b3261e', fontWeight: 700 }}>
                  {dictationNote()}
                </p>
              )}

              <ul className="zara-intro-list">
                <li>Dime tu país y si ya tienes clientes y te afino el plan.</li>
                <li>Si quieres cortarme mientras hablo, pulsa «Interrumpir voz» y te escucho.</li>
                <li>Todo lo que hablamos queda escrito aquí y puedes copiarlo.</li>
              </ul>

              <div className="zara-actions">
                <button className="zara-primary" onClick={startVoice} disabled={!supported}>
                  Iniciar asesoría por voz
                </button>
                <Link className="zara-secondary" href="/zara" onClick={handleClose}>
                  Abrir en pantalla completa
                </Link>
                <button className="zara-tertiary" onClick={handleClose}>
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {status !== 'idle' && (
            <>
              <div className="zara-chat" aria-label="Transcripción">
                {transcript.map((m, idx) => (
                  <div
                    key={idx}
                    className={`zara-msg ${m.role === 'user' ? 'zara-msg-user' : 'zara-msg-assistant'}`}
                  >
                    <div className="zara-msg-meta">{m.role === 'user' ? 'Tú' : 'Zara'}</div>
                    <div className="zara-msg-text">{readable(m.text)}</div>
                  </div>
                ))}

                {status === 'listening' && (
                  <div className="zara-msg zara-msg-user zara-msg-draft">
                    <div className="zara-msg-meta">Tú (borrador)</div>
                    <div className="zara-msg-text">{draftUserText}</div>
                  </div>
                )}

                {mostrarAviso && (
                  <div className="zara-error">
                    <div className="zara-error-title">{statusLabel}</div>
                    <div className="zara-error-text">{errorMsg}</div>
                  </div>
                )}
              </div>

              <div className="zara-footer">
                <div className="zara-footer-links">
                  <Link href="/precios" onClick={handleClose}>
                    Ir a Precios
                  </Link>
                  <Link href="/servicios" onClick={handleClose}>
                    Ir a Servicios
                  </Link>
                  <Link href="/zara" onClick={handleClose}>
                    Abrir /zara
                  </Link>
                </div>

                <div className="zara-footer-actions">
                  {status === 'speaking' && (
                    <button
                      className="zara-secondary-btn"
                      onClick={() => {
                        cancelSpeech()
                        setStatus('listening')
                        startListening()
                      }}
                    >
                      Interrumpir voz
                    </button>
                  )}

                  {status !== 'ended' && (
                    <button className="zara-secondary-btn" onClick={stopVoice}>
                      Finalizar
                    </button>
                  )}

                  {status === 'ended' && (
                    <button className="zara-primary-btn" onClick={startVoice}>
                      Volver a empezar
                    </button>
                  )}

                  <button className="zara-tertiary-btn" onClick={handleClose}>
                    Cerrar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServiciosOpen, setIsServiciosOpen] = useState(false)
  const [isHerramientasOpen, setIsHerramientasOpen] = useState(false)
  const [isZaraOpen, setIsZaraOpen] = useState(false)

  const closeMobileMenu = () => {
    setIsMenuOpen(false)
    setIsServiciosOpen(false)
    setIsHerramientasOpen(false)
  }

  const serviciosItems = useMemo(
    () => [
      {
        title: 'CONSTITUCIÓN DE EMPRESAS',
        items: [
          { href: '/servicios/formacion-llc', label: 'Formación de LLCs', icon: <Globe size={18} /> },
          { href: '/servicios/impuestos/obtencion-ein', label: 'Obtención de EIN (IRS)', icon: <Search size={18} /> },
          { href: '/servicios/cuenta-bancaria-empresarial', label: 'Cuenta Bancaria Empresarial', icon: <Building size={18} /> }
        ]
      },
      {
        title: 'CUMPLIMIENTO Y SOPORTE',
        items: [
          { href: '/servicios/agente-registrado', label: 'Agente Registrado', icon: <HelpCircle size={18} /> },
          { href: '/servicios/impuestos/declaracion-anual-llc', label: 'Impuestos Federales', icon: <BookOpen size={18} /> },
          { href: '/servicios/reporte-anual', label: 'Reporte Anual', icon: <HelpCircle size={18} /> },
          { href: '/servicios/consultoria-fiscal', label: 'Consultoría Fiscal', icon: <Send size={18} /> }
        ]
      }
    ],
    []
  )

  const recursosItems = useMemo(
    () => [
      {
        title: 'HERRAMIENTAS',
        items: [
          { href: '/lead-form', label: 'Calculadora Fiscal', icon: <Search size={18} /> },
          { href: '/quiz', label: 'Quiz', icon: <HelpCircle size={18} /> }
        ]
      },
      {
        title: 'APRENDER Y CONTACTO',
        items: [
          { href: '/blog', label: 'Blog', icon: <BookOpen size={18} /> },
          { href: '/guia', label: 'Guías', icon: <BookOpen size={18} /> },
          { href: '/faq', label: 'FAQ', icon: <HelpCircle size={18} /> },
          { href: '/contacto', label: 'Contacto', icon: <Send size={18} /> }
        ]
      }
    ],
    []
  )

  return (
    <>
      <header className="site-header">
        <div className="site-header__container">
          <div className="site-header__left">
            <Link href="/" className="header-logo" onClick={closeMobileMenu}>
              <Image src="/images/logo.png" alt="Open LLC USA Logo" width={32} height={32} className="drop-shadow-sm" />
              <span>Open LLC USA</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="site-header__nav">
              {/* Servicios dropdown */}
              <div className="header-dropdown-container">
                <Link href="/servicios" className="header-nav-link">
                  Servicios <ChevronDown size={16} />
                </Link>

                <div className="header-dropdown-content">
                  {serviciosItems.map((col) => (
                    <div className="dropdown-column" key={col.title}>
                      <h4>{col.title}</h4>
                      {col.items.map((it) => (
                        <Link href={it.href} className="dropdown-item" key={it.href}>
                          {it.icon} {it.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/precios" className="header-nav-link">
                Precios
              </Link>

              {/* Recursos dropdown */}
              <div className="header-dropdown-container">
                <Link href="/recursos" className="header-nav-link">
                  Recursos <ChevronDown size={16} />
                </Link>

                <div className="header-dropdown-content" style={{ minWidth: '400px' }}>
                  {recursosItems.map((col) => (
                    <div className="dropdown-column" key={col.title}>
                      <h4>{col.title}</h4>
                      {col.items.map((it) => (
                        <Link href={it.href} className="dropdown-item" key={it.href}>
                          {it.icon} {it.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </nav>
          </div>

          <div className="site-header__right" style={{ alignItems: 'center' }}>
            <button
              className="header-auth-button header-auth-button-signin header-zara-btn-desktop"
              onClick={() => setIsZaraOpen(true)}
            >
              Asesoría con Zara
            </button>

            {/* Desktop Auth Buttons */}
            <div className="header-auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <SignedOut>
                <SignInButton mode="modal">
                  <button style={{ background: 'transparent', border: 'none', color: '#f8fafc', fontWeight: 500, cursor: 'pointer', padding: '0.5rem' }}>
                    Iniciar sesión
                  </button>
                </SignInButton>

                <Link href="/precios" className="header-auth-button header-auth-button-signup">
                  Empezar
                </Link>
              </SignedOut>

              <SignedIn>
                <Link href="/dashboard" style={{ background: 'transparent', border: 'none', color: '#f8fafc', fontWeight: 500, cursor: 'pointer', padding: '0.5rem', textDecoration: 'none' }}>
                  Panel
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>

            {/* Mobile-only Empezar CTA (visible junto al hamburger) */}
            <SignedOut>
              <Link
                href="/precios"
                className="header-auth-button header-auth-button-signup header-mobile-empezar"
                style={{ display: 'none' }}
              >
                Empezar
              </Link>
            </SignedOut>

            {/* Mobile Menu Button */}
            <button
              className="header-mobile-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menú"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="header-mobile-menu">
            {/* Servicios toggle + link */}
            <div className="mobile-section">
              <div className="mobile-toggle-row">
                <Link
                  href="/servicios"
                  style={{ flex: 1, color: 'white', textDecoration: 'none' }}
                  onClick={closeMobileMenu}
                >
                  Servicios
                </Link>
                <button
                  onClick={() => setIsServiciosOpen(!isServiciosOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  aria-label="Abrir servicios"
                >
                  <ChevronDown
                    size={18}
                    style={{
                      transform: isServiciosOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  />
                </button>
              </div>

              {isServiciosOpen && (
                <div className="mobile-submenu">
                  {serviciosItems.map((col) => (
                    <div className="mobile-category" key={col.title}>
                      <h4>{col.title}</h4>
                      {col.items.map((it) => (
                        <Link
                          href={it.href}
                          className="mobile-dropdown-item"
                          key={it.href}
                          onClick={closeMobileMenu}
                        >
                          {/* icon */}
                          {it.icon && (
                            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                              {it.icon as any}
                            </span>
                          )}
                          {it.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link href="/precios" className="header-nav-link" onClick={closeMobileMenu}>
              Precios
            </Link>

            {/* Recursos toggle + link */}
            <div className="mobile-section">
              <div className="mobile-toggle-row">
                <Link
                  href="/recursos"
                  style={{ flex: 1, color: 'white', textDecoration: 'none' }}
                  onClick={closeMobileMenu}
                >
                  Recursos
                </Link>
                <button
                  onClick={() => setIsHerramientasOpen(!isHerramientasOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  aria-label="Abrir recursos"
                >
                  <ChevronDown
                    size={18}
                    style={{
                      transform: isHerramientasOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  />
                </button>
              </div>

              {isHerramientasOpen && (
                <div className="mobile-submenu">
                  {recursosItems.map((col) => (
                    <div className="mobile-category" key={col.title}>
                      <h4>{col.title}</h4>
                      {col.items.map((it) => (
                        <Link
                          href={it.href}
                          className="mobile-dropdown-item"
                          key={it.href}
                          onClick={closeMobileMenu}
                        >
                          {/* icon */}
                          {it.icon && (
                            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                              {it.icon as any}
                            </span>
                          )}
                          {it.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              className="mobile-zara-btn"
              onClick={() => {
                setIsZaraOpen(true)
                closeMobileMenu()
              }}
              style={{ background: 'transparent', border: '1px solid white', color: 'white' }}
            >
              Asesoría con Zara
            </button>

            {/* Auth Buttons Mobile */}
            <div className="mobile-auth-section">
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    style={{ width: '100%', background: 'transparent', border: 'none', color: '#f8fafc', fontWeight: 500, cursor: 'pointer', padding: '0.5rem' }}
                  >
                    Iniciar sesión
                  </button>
                </SignInButton>

                <Link href="/precios" className="header-auth-button header-auth-button-signup" style={{ width: '100%', textAlign: 'center' }} onClick={closeMobileMenu}>
                  Empezar
                </Link>
              </SignedOut>

              <SignedIn>
                <Link
                  href="/dashboard"
                  className="header-auth-button header-auth-button-signin"
                  style={{ width: '100%', textAlign: 'center' }}
                  onClick={closeMobileMenu}
                >
                  Panel
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        )}
      </header>

      {/* Modal Zara */}
      <ZaraModal open={isZaraOpen} onClose={() => setIsZaraOpen(false)} />
    </>
  )
}
