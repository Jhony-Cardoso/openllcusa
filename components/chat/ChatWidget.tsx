'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Sparkles, ArrowRight, ChevronDown, User, Phone } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useUser } from '@clerk/nextjs'
import './chat-widget.css'

// ─── Analytics ────────────────────────────────────────────
const trackGAEvent = (eventName: string, params?: any) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params)
  }
}

// ─── Tipos ────────────────────────────────────────────────
type LeadData = {
  nombre: string
  email: string
  telefono?: string
  capturado: boolean
}

type ChatPhase =
  | 'attribution'  // ¿Cómo llegaste?
  | 'intent'       // ¿Qué te trae por aquí?
  | 'hot_lead'     // Formulario lead caliente
  | 'warm_lead'    // Email a cambio de guía
  | 'ai_chat'      // Chat IA libre
  | 'other'        // Texto libre → soporte

type QuickSuggestion = {
  text: string
  icon: string
}

const QUICK_SUGGESTIONS: QuickSuggestion[] = [
  { text: '¿Cuánto cuesta crear una LLC?', icon: '💰' },
  { text: '¿Qué estado me conviene?', icon: '🏛️' },
  { text: '¿Necesito visa o SSN?', icon: '🛂' },
  { text: '¿Cómo abro una cuenta bancaria?', icon: '🏦' },
]

const ATTRIBUTION_OPTIONS = [
  { label: 'Búsqueda en Google', value: 'google', icon: '🔍' },
  { label: 'LinkedIn', value: 'linkedin', icon: '💼' },
  { label: 'Me lo recomendaron', value: 'referral', icon: '👥' },
  { label: 'YouTube / Redes sociales', value: 'youtube', icon: '📹' },
  { label: 'Otro', value: 'other', icon: '🔀' },
]

const INTENT_OPTIONS = [
  { label: 'Quiero crear mi LLC cuanto antes', value: 'hot_lead', icon: '🚀' },
  { label: 'Tengo dudas antes de decidirme', value: 'warm_lead', icon: '💬' },
  { label: 'Solo explorando opciones', value: 'exploring', icon: '📚' },
  { label: 'Tengo una pregunta concreta', value: 'ai_chat', icon: '❓' },
]

// ─── Componente: Renderizar Markdown simple ───────────────
function SimpleMarkdown({ text }: { text?: string }) {
  const lines = (text || '').split('\n')
  return (
    <div className="chat-markdown">
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />
        const parts = line.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
        const rendered = parts.map((part, j) => {
          const boldMatch = part.match(/^\*\*(.+)\*\*$/)
          if (boldMatch) return <strong key={j}>{boldMatch[1]}</strong>
          const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
          if (linkMatch) return <Link key={j} href={linkMatch[2]} className="chat-link" onClick={() => trackGAEvent('chat_purchase', { url: linkMatch[2] })}>{linkMatch[1]}</Link>
          return <span key={j}>{part}</span>
        })
        const listMatch = line.match(/^(\s*)(•|-|[0-9]+️⃣|[0-9]+\.|✅|❌)\s*(.*)$/)
        if (listMatch) {
          return (
            <div key={i} className="chat-list-item">
              <span className="chat-list-bullet">{listMatch[2]}</span>
              <span>{rendered}</span>
            </div>
          )
        }
        return <p key={i} className="chat-paragraph">{rendered}</p>
      })}
    </div>
  )
}

// ─── Componente: Avatar de Zara ───────────────────────────
function ZaraAvatar({ size = 28 }: { size?: number }) {
  return (
    <Image
      src="/images/zara-avatar.png"
      width={size}
      height={size}
      alt="Zara"
      className="chat-avatar chat-avatar--bot"
      style={{ objectFit: 'cover' }}
    />
  )
}

// ─── Componente Principal ─────────────────────────────────
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [phase, setPhase] = useState<ChatPhase>('attribution')
  const [attribution, setAttribution] = useState<string | null>(null)
  const [leadData, setLeadData] = useState<LeadData>({ nombre: '', email: '', telefono: '', capturado: false })
  const [unreadCount, setUnreadCount] = useState(1)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [showScrollDown, setShowScrollDown] = useState(false)
  const [warmLeadSubmitted, setWarmLeadSubmitted] = useState(false)
  const [hotLeadSubmitted, setHotLeadSubmitted] = useState(false)
  const [otherText, setOtherText] = useState('')
  const [otherSent, setOtherSent] = useState(false)

  const chatBodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState('')

  const { user, isSignedIn, isLoaded } = useUser()

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    messages: []
  })
  const isLoading = status === 'streaming' || status === 'submitted'

  // Usuarios logueados: saltar directamente a IA
  useEffect(() => {
    if (isLoaded && isSignedIn && user?.firstName) {
      setPhase('ai_chat')
      setLeadData(prev => ({ ...prev, capturado: true }))
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        parts: [{ type: 'text', text: `¡Hola ${user.firstName}! 👋 Soy Zara, la experta en LLCs de Open LLC USA.\n\nHe visto que ya tienes una cuenta con nosotros. ¿En qué te puedo ayudar hoy?` }]
      }] as any)
    }
  }, [isLoaded, isSignedIn, user?.firstName, setMessages, user?.primaryEmailAddress?.emailAddress])

  // ── Cambio visual del título (Page Visibility API) ─────────
  const originalTitle = useRef('')

  useEffect(() => {
    originalTitle.current = document.title
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        document.title = originalTitle.current
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === 'assistant' && document.hidden) {
      document.title = '(1) Zara te ha respondido - Open LLC USA'
    }
  }, [messages])
  // ─────────────────────────────────────────────────────────

  const scrollToBottom = useCallback(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, isLoading, scrollToBottom])

  const handleScroll = useCallback(() => {
    if (!chatBodyRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current
    setShowScrollDown(scrollHeight - scrollTop - clientHeight > 100)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
      setUnreadCount(0)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen && messages.length > 1 && phase === 'ai_chat') {
      setUnreadCount(prev => prev + 1)
    }
  }, [messages, isOpen, phase])

  // ── Atribución ──────────────────────────────────────────
  const handleAttribution = (value: string) => {
    setAttribution(value)
    setHasInteracted(true)
    setPhase('intent')
  }

  // ── Intención ───────────────────────────────────────────
  const handleIntent = (value: string) => {
    setHasInteracted(true)
    if (value === 'hot_lead') {
      setPhase('hot_lead')
    } else if (value === 'warm_lead') {
      setPhase('warm_lead')
    } else if (value === 'exploring') {
      setPhase('ai_chat')
      setMessages([{
        id: 'welcome-exploring',
        role: 'assistant',
        parts: [{ type: 'text', text: '¡Claro, sin prisa! 😊 Cuéntame, ¿sobre qué aspecto de las LLC quieres aprender primero?' }]
      }] as any)
    } else {
      // ai_chat / pregunta concreta
      setPhase('ai_chat')
      setMessages([{
        id: 'welcome-question',
        role: 'assistant',
        parts: [{ type: 'text', text: '¡Por supuesto! 🤓 Puedo responderte al momento sobre costes, estados, impuestos, requisitos para extranjeros y mucho más. ¿Qué quieres saber?' }]
      }] as any)
    }
  }

  // ── Guardar lead en API ──────────────────────────────────
  const saveLead = async (data: { nombre?: string; email: string; telefono?: string; intent: string }) => {
    try {
      await fetch('/api/chat/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.nombre || data.email,
          email: data.email,
          telefono: data.telefono || null,
          attribution,
          intent: data.intent,
        }),
      })
    } catch (err) {
      console.error('Error guardando lead:', err)
    }
  }

  // ── Lead Caliente ────────────────────────────────────────
  const handleHotLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!leadData.nombre.trim() || !leadData.email.trim()) return
    await saveLead({ nombre: leadData.nombre, email: leadData.email, telefono: leadData.telefono, intent: 'hot_lead' })
    setLeadData(prev => ({ ...prev, capturado: true }))
    setHotLeadSubmitted(true)
    trackGAEvent('lead_captured', { intent: 'hot_lead' })
  }

  // ── Lead Tibio ───────────────────────────────────────────
  const handleWarmLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!leadData.email.trim()) return
    await saveLead({ nombre: leadData.nombre || leadData.email, email: leadData.email, intent: 'warm_lead' })
    setLeadData(prev => ({ ...prev, capturado: true }))
    setWarmLeadSubmitted(true)
    trackGAEvent('lead_captured', { intent: 'warm_lead' })
  }

  // ── Chat IA ──────────────────────────────────────────────
  const onSubmitChat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!(input || '').trim()) return
    sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] } as any)
    setInput('')
  }

  const handleSuggestionClick = (text: string) => {
    sendMessage({ role: 'user', parts: [{ type: 'text', text: text }] } as any)
  }

  // ── Otro ─────────────────────────────────────────────────
  const handleOtherSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otherText.trim()) return
    await saveLead({ nombre: 'Anónimo', email: 'sin-email@openllcusa.com', intent: 'other' })
    setOtherSent(true)
    trackGAEvent('lead_captured', { intent: 'other' })
  }

  const toggleChat = () => {
    setIsOpen(prev => {
      const newState = !prev
      if (newState) trackGAEvent('chat_opened')
      return newState
    })
  }

  // ── Render fases del chat ────────────────────────────────
  const renderChatBody = () => {
    // ─ Fase: Atribución ─
    if (phase === 'attribution') {
      return (
        <div className="chat-phase-container">
          <div className="chat-message chat-message--assistant">
            <div className="chat-message__avatar"><ZaraAvatar /></div>
            <div className="chat-message__bubble chat-bubble--assistant">
              <SimpleMarkdown text={"¡Hola! 👋 Soy **Zara**, especialista en LLC para hispanohablantes.\n\nAntes de empezar, ¿cómo llegaste a nosotros?"} />
            </div>
          </div>
          <div className="chat-phase-buttons">
            {ATTRIBUTION_OPTIONS.map(opt => (
              <button key={opt.value} className="chat-phase-btn" onClick={() => handleAttribution(opt.value)}>
                <span className="chat-phase-btn__icon">{opt.icon}</span>
                <span>{opt.label}</span>
                <ArrowRight size={12} className="chat-phase-btn__arrow" />
              </button>
            ))}
          </div>
        </div>
      )
    }

    // ─ Fase: Intención ─
    if (phase === 'intent') {
      return (
        <div className="chat-phase-container">
          <div className="chat-message chat-message--assistant">
            <div className="chat-message__avatar"><ZaraAvatar /></div>
            <div className="chat-message__bubble chat-bubble--assistant">
              <SimpleMarkdown text={"¡Genial, gracias! 😊\n\n¿Qué te trae por aquí hoy?"} />
            </div>
          </div>
          <div className="chat-phase-buttons">
            {INTENT_OPTIONS.map(opt => (
              <button key={opt.value} className="chat-phase-btn" onClick={() => handleIntent(opt.value)}>
                <span className="chat-phase-btn__icon">{opt.icon}</span>
                <span>{opt.label}</span>
                <ArrowRight size={12} className="chat-phase-btn__arrow" />
              </button>
            ))}
          </div>
        </div>
      )
    }

    // ─ Fase: Lead Caliente ─
    if (phase === 'hot_lead') {
      if (hotLeadSubmitted) {
        return (
          <div className="chat-phase-container">
            <div className="chat-message chat-message--assistant">
              <div className="chat-message__avatar"><ZaraAvatar /></div>
              <div className="chat-message__bubble chat-bubble--assistant">
                <SimpleMarkdown text={`✅ ¡Perfecto, ${leadData.nombre}! Ya tenemos tus datos.\n\nUn especialista te contactará en menos de 2 horas.\n\nMientras tanto, puedes reservar una llamada directamente aquí:`} />
                <Link href="/agendar" className="chat-cta-btn" target="_blank" onClick={() => trackGAEvent('chat_purchase', { url: '/agendar' })}>
                  📅 Reservar llamada gratuita →
                </Link>
              </div>
            </div>
            <div className="chat-phase-buttons" style={{ marginTop: '12px' }}>
              <button className="chat-phase-btn" onClick={() => {
                setPhase('ai_chat')
                setMessages([{ id: 'post-lead', role: 'assistant', parts: [{ type: 'text', text: '¿Tienes alguna duda mientras tanto? ¡Pregúntame lo que quieras!' }] }] as any)
              }}>
                <span className="chat-phase-btn__icon">💬</span>
                <span>Tengo más preguntas para Zara</span>
                <ArrowRight size={12} className="chat-phase-btn__arrow" />
              </button>
            </div>
          </div>
        )
      }
      return (
        <div className="chat-phase-container">
          <div className="chat-message chat-message--assistant">
            <div className="chat-message__avatar"><ZaraAvatar /></div>
            <div className="chat-message__bubble chat-bubble--assistant">
              <SimpleMarkdown text={"¡Perfecto, estás en el lugar correcto! 🎯\n\nDéjame tus datos y un especialista te contactará en menos de **2 horas** para guiarte paso a paso."} />
            </div>
          </div>
          <form className="chat-phase-form" onSubmit={handleHotLeadSubmit}>
            <input
              type="text"
              placeholder="Tu nombre"
              value={leadData.nombre}
              onChange={e => setLeadData(prev => ({ ...prev, nombre: e.target.value }))}
              className="chat-lead-form__input"
              required
            />
            <input
              type="email"
              placeholder="Tu email"
              value={leadData.email}
              onChange={e => setLeadData(prev => ({ ...prev, email: e.target.value }))}
              className="chat-lead-form__input"
              required
            />
            <div className="chat-lead-form__input-row">
              <Phone size={14} className="chat-lead-form__phone-icon" />
              <input
                type="tel"
                placeholder="WhatsApp (opcional)"
                value={leadData.telefono}
                onChange={e => setLeadData(prev => ({ ...prev, telefono: e.target.value }))}
                className="chat-lead-form__input chat-lead-form__input--phone"
              />
            </div>
            <button type="submit" className="chat-lead-form__submit">
              Quiero que me contacten
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      )
    }

    // ─ Fase: Lead Tibio ─
    if (phase === 'warm_lead') {
      if (warmLeadSubmitted) {
        return (
          <div className="chat-phase-container">
            <div className="chat-message chat-message--assistant">
              <div className="chat-message__avatar"><ZaraAvatar /></div>
              <div className="chat-message__bubble chat-bubble--assistant">
                <SimpleMarkdown text={"📧 ¡Enviada! Revisa tu bandeja de entrada en unos minutos.\n\n¿Quieres que Zara te resuelva alguna duda ahora mismo?"} />
              </div>
            </div>
            <div className="chat-phase-buttons" style={{ marginTop: '12px' }}>
              <button className="chat-phase-btn" onClick={() => {
                setPhase('ai_chat')
                setMessages([
                    ...messages,
                    { id: 'post-warm', role: 'assistant', parts: [{ type: 'text', text: '¡Claro! ¿Qué quieres saber sobre las LLC? Pregúntame sin compromiso 😊' }] }
                ] as any)
              }}>
                <span className="chat-phase-btn__icon">💬</span>
                <span>Sí, hablar con Zara ahora</span>
                <ArrowRight size={12} className="chat-phase-btn__arrow" />
              </button>
            </div>
          </div>
        )
      }
      return (
        <div className="chat-phase-container">
          <div className="chat-message chat-message--assistant">
            <div className="chat-message__avatar"><ZaraAvatar /></div>
            <div className="chat-message__bubble chat-bubble--assistant">
              <SimpleMarkdown text={"Entendido, no hay prisa. 😊\n\nTe envío nuestra **Guía Gratuita: Crea tu LLC en 7 días** para que puedas leerla sin prisas.\n\n¿A qué email te la mando?"} />
            </div>
          </div>
          <form className="chat-phase-form" onSubmit={handleWarmLeadSubmit}>
            <input
              type="text"
              placeholder="Tu nombre (opcional)"
              value={leadData.nombre}
              onChange={e => setLeadData(prev => ({ ...prev, nombre: e.target.value }))}
              className="chat-lead-form__input"
            />
            <input
              type="email"
              placeholder="Tu email"
              value={leadData.email}
              onChange={e => setLeadData(prev => ({ ...prev, email: e.target.value }))}
              className="chat-lead-form__input"
              required
            />
            <button type="submit" className="chat-lead-form__submit">
              📘 Enviarme la guía gratis
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      )
    }

    // ─ Fase: IA Chat (modo actual) ─
    if (phase === 'ai_chat') {
      return (
        <>
          {messages.map((msg: any) => (
            <div key={msg.id} className={`chat-message chat-message--${msg.role}`}>
              <div className="chat-message__avatar">
                {msg.role === 'assistant' ? (
                  <ZaraAvatar />
                ) : (
                  <div className="chat-avatar chat-avatar--user">
                    <User size={14} />
                  </div>
                )}
              </div>
              <div className={`chat-message__bubble chat-bubble--${msg.role}`}>
                <SimpleMarkdown text={(msg as any).content || msg.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || ''} />
                <span className="chat-message__time">
                  {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="chat-message chat-message--assistant">
              <div className="chat-message__avatar"><ZaraAvatar /></div>
              <div className="chat-bubble--assistant chat-typing-indicator">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          {/* Sugerencias rápidas si no ha habido interacción */}
          {messages.length <= 1 && !isLoading && (
            <div className="chat-suggestions">
              <p className="chat-suggestions__label">Preguntas frecuentes:</p>
              {QUICK_SUGGESTIONS.map((s, i) => (
                <button key={i} className="chat-suggestion-chip" onClick={() => handleSuggestionClick(s.text)}>
                  <span className="chat-suggestion-chip__icon">{s.icon}</span>
                  <span>{s.text}</span>
                  <ArrowRight size={12} className="chat-suggestion-chip__arrow" />
                </button>
              ))}
            </div>
          )}
        </>
      )
    }

    // ─ Fase: Otro ─
    if (phase === 'other') {
      if (otherSent) {
        return (
          <div className="chat-phase-container">
            <div className="chat-message chat-message--assistant">
              <div className="chat-message__avatar"><ZaraAvatar /></div>
              <div className="chat-message__bubble chat-bubble--assistant">
                <SimpleMarkdown text={"✅ Recibido. Nuestro equipo revisará tu mensaje y te contactará pronto.\n\n¿Necesitas algo más mientras tanto?"} />
              </div>
            </div>
          </div>
        )
      }
      return (
        <div className="chat-phase-container">
          <div className="chat-message chat-message--assistant">
            <div className="chat-message__avatar"><ZaraAvatar /></div>
            <div className="chat-message__bubble chat-bubble--assistant">
              <SimpleMarkdown text={"Sin problema. 😊 Cuéntame brevemente en qué puedo ayudarte y lo trasladaré a nuestro equipo."} />
            </div>
          </div>
          <form className="chat-phase-form" onSubmit={handleOtherSubmit}>
            <textarea
              placeholder="Escribe tu consulta aquí..."
              value={otherText}
              onChange={e => setOtherText(e.target.value)}
              className="chat-lead-form__input chat-lead-form__textarea"
              rows={3}
              required
            />
            <button type="submit" className="chat-lead-form__submit">
              Enviar consulta
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      )
    }

    return null
  }

  return (
    <>
      {/* ═══════════ VENTANA DE CHAT ═══════════ */}
      <div className={`chat-window ${isOpen ? 'chat-window--open' : 'chat-window--closed'}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header__left">
            <div className="chat-header__avatar">
              <Image src="/images/zara-avatar.png" width={32} height={32} alt="Zara" className="chat-avatar-image" style={{ borderRadius: '50%', objectFit: 'cover' }} />
              <span className="chat-header__status-dot" />
            </div>
            <div className="chat-header__info">
              <span className="chat-header__name">Zara · IA Asistente</span>
              <span className="chat-header__status">En línea · Responde al instante</span>
            </div>
          </div>
          <button className="chat-header__close" onClick={toggleChat} aria-label="Cerrar chat">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="chat-body" ref={chatBodyRef} onScroll={handleScroll}>
          {renderChatBody()}
        </div>

        {/* Scroll down button */}
        {showScrollDown && (
          <button className="chat-scroll-down" onClick={scrollToBottom}>
            <ChevronDown size={16} />
          </button>
        )}

        {/* Footer / Input — solo visible en modo IA */}
        {phase === 'ai_chat' && (
          <form className="chat-footer" onSubmit={onSubmitChat}>
            <input
              ref={inputRef}
              type="text"
              className="chat-footer__input"
              placeholder="Escribe tu pregunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="chat-footer__send"
              disabled={!(input || '').trim() || isLoading}
              aria-label="Enviar mensaje"
            >
              <Send size={18} />
            </button>
          </form>
        )}

        {/* Powered by */}
        <div className="chat-powered">
          <Sparkles size={10} />
          <span>Impulsado por IA · Open LLC USA</span>
        </div>
      </div>

      {/* ═══════════ BURBUJA FLOTANTE ═══════════ */}
      <button
        className={`chat-fab ${isOpen ? 'chat-fab--active' : ''}`}
        onClick={toggleChat}
        aria-label={isOpen ? 'Cerrar asistente virtual' : 'Abrir asistente virtual'}
        id="chat-widget-fab"
      >
        <div className="chat-fab__icon-wrapper">
          {isOpen ? (
            <X size={24} className="chat-fab__icon chat-fab__icon--close" />
          ) : (
            <>
              <MessageCircle size={24} className="chat-fab__icon chat-fab__icon--chat" />
              {unreadCount > 0 && (
                <span className="chat-fab__badge">{unreadCount}</span>
              )}
            </>
          )}
        </div>
        {!isOpen && (
          <>
            <span className="chat-fab__pulse" />
            <span className="chat-fab__pulse chat-fab__pulse--delayed" />
          </>
        )}
      </button>

      {/* ═══════════ TOOLTIP ═══════════ */}
      {!isOpen && !hasInteracted && (
        <div className="chat-tooltip" onClick={toggleChat}>
          <span>💬 ¿Tienes dudas? ¡Pregúntame!</span>
          <button
            className="chat-tooltip__close"
            onClick={(e) => {
              e.stopPropagation()
              setHasInteracted(true)
            }}
            aria-label="Cerrar sugerencia"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </>
  )
}
