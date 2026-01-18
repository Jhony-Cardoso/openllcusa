'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  Menu,
  X,
  Globe,
  Smartphone,
  Search,
  HelpCircle,
  BookOpen,
  Send
} from 'lucide-react'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

const LogoEdificio = () => (
  <svg width="36" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="14" width="2" height="14" fill="white" />
    <rect x="19" y="14" width="2" height="14" fill="white" />
    <rect x="24" y="14" width="2" height="14" fill="white" />
    <rect x="12" y="13" width="16" height="3" fill="white" />
    <rect x="12" y="28" width="16" height="2" fill="white" />
    <path d="M20 9L24 12H16L20 9Z" fill="#FBBF24" />
  </svg>
)

type CarlaStatus =
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

function CarlaModal({
  open,
  onClose
}: {
  open: boolean
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  const [status, setStatus] = useState<CarlaStatus>('idle')
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [draftUserText, setDraftUserText] = useState<string>('')
  const [assistantStreamingText, setAssistantStreamingText] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const timersRef = useRef<number[]>([])

  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t))
    timersRef.current = []
  }

  const resetState = () => {
    clearTimers()
    setStatus('idle')
    setMessages([])
    setDraftUserText('')
    setAssistantStreamingText('')
    setErrorMsg('')
  }

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
    timersRef.current.push(t)

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      resetState()
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleClose = () => {
    clearTimers()
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

  const startDemoFlow = () => {
    clearTimers()
    setMessages([])
    setDraftUserText('')
    setAssistantStreamingText('')
    setErrorMsg('')

    // En esta fase del proyecto NO pedimos micrófono real: lo simulamos con un demo.
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

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'idle':
        return 'Listo'
      case 'request_permission':
        return 'Activar micrófono'
      case 'permission_denied':
        return 'Micrófono bloqueado'
      case 'connecting':
        return 'Conectando con Carla…'
      case 'listening':
        return 'Escuchando…'
      case 'processing':
        return 'Procesando…'
      case 'speaking':
        return 'Carla está respondiendo…'
      case 'ended':
        return 'Conversación finalizada'
      case 'error':
        return 'Ha ocurrido un error'
      default:
        return 'Listo'
    }
  }, [status])

  if (!open) return null

  return (
    <div className="carla-overlay" aria-hidden={false}>
      <div
        className="carla-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="carla-title"
        onKeyDown={trapFocusOnKeyDown}
      >
        <div className="carla-header">
          <div className="carla-titlewrap">
            <div id="carla-title" className="carla-title">
              Asesoría con Carla
            </div>
            <div className="carla-subtitle">Gratis, 24/7 · Voz + transcripción</div>
          </div>

          <button className="carla-close" onClick={handleClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="carla-status" role="status" aria-live="polite">
          {statusLabel}
          <span className="carla-status-badge">DEMO (voz desactivada)</span>
        </div>

        <div className="carla-body">
          {status === 'idle' && (
            <div className="carla-intro">
              <p className="carla-intro-text">
                Pregunta lo que quieras sobre servicios, precios y el proceso. Esta interfaz ya está lista; la voz
                real se conectará cuando el sitio esté finalizado.
              </p>
              <ul className="carla-intro-list">
                <li>Te ayuda a elegir plan sin perderte.</li>
                <li>Resuelve dudas frecuentes (EIN, estado, pasos, tiempos).</li>
                <li>Te guía a Precios y Servicios con enlaces directos.</li>
              </ul>

              <div className="carla-actions">
                <button className="carla-primary" onClick={startDemoFlow}>
                  Iniciar asesoría por voz
                </button>
                <Link className="carla-secondary" href="/carla" onClick={handleClose}>
                  Abrir en pantalla completa
                </Link>
                <button className="carla-tertiary" onClick={handleClose}>
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {status !== 'idle' && (
            <>
              <div className="carla-chat" aria-label="Transcripción">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`carla-msg ${m.role === 'user' ? 'carla-msg-user' : 'carla-msg-assistant'}`}
                  >
                    <div className="carla-msg-meta">{m.role === 'user' ? 'Tú' : 'Carla'}</div>
                    <div className="carla-msg-text">{m.text || (m.role === 'assistant' ? assistantStreamingText : '')}</div>
                  </div>
                ))}

                {status === 'listening' && (
                  <div className="carla-msg carla-msg-user carla-msg-draft">
                    <div className="carla-msg-meta">Tú (borrador)</div>
                    <div className="carla-msg-text">{draftUserText}</div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="carla-error">
                    <div className="carla-error-title">Error</div>
                    <div className="carla-error-text">{errorMsg || 'No se ha podido iniciar la demo.'}</div>
                  </div>
                )}
              </div>

              <div className="carla-footer">
                <div className="carla-footer-links">
                  <Link href="/precios" onClick={handleClose}>
                    Ir a Precios
                  </Link>
                  <Link href="/servicios" onClick={handleClose}>
                    Ir a Servicios
                  </Link>
                  <Link href="/carla" onClick={handleClose}>
                    Abrir /carla
                  </Link>
                </div>

                <div className="carla-footer-actions">
                  {status !== 'ended' && (
                    <button
                      className="carla-secondary-btn"
                      onClick={() => {
                        clearTimers()
                        setStatus('ended')
                      }}
                    >
                      Finalizar
                    </button>
                  )}

                  {status === 'ended' && (
                    <button className="carla-primary-btn" onClick={startDemoFlow}>
                      Volver a empezar
                    </button>
                  )}

                  <button className="carla-tertiary-btn" onClick={handleClose}>
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
  const [isCarlaOpen, setIsCarlaOpen] = useState(false)

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
          { href: '/servicios/llc', label: 'Formación de LLCs', icon: <Globe size={18} /> },
          { href: '/servicios/inc', label: 'Corporaciones Inc', icon: <Smartphone size={18} /> },
          { href: '/servicios/obtencion-ein', label: 'Obtención de EIN (IRS)', icon: <Search size={18} /> }
        ]
      },
      {
        title: 'CUMPLIMIENTO Y SOPORTE',
        items: [
          { href: '/servicios/registrado', label: 'Agente Registrado', icon: <HelpCircle size={18} /> },
          { href: '/servicios/form-5472-1120', label: 'Impuestos Federales', icon: <BookOpen size={18} /> },
          { href: '/servicios/consultoria-legal', label: 'Consultoría Legal', icon: <Send size={18} /> }
        ]
      }
    ],
    []
  )

  const herramientasItems = useMemo(
    () => [
      { href: '/lead-form', label: 'Calculadora', icon: <Search size={18} /> },
      { href: '/quiz', label: 'Quiz', icon: <BookOpen size={18} /> }
    ],
    []
  )

  return (
    <>
      <header className="site-header">
        <div className="site-header__container">
          <div className="site-header__left">
            <Link href="/" className="header-logo" onClick={closeMobileMenu}>
              <LogoEdificio />
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

              {/* Herramientas dropdown */}
              <div className="header-dropdown-container">
                <Link href="/recursos" className="header-nav-link">
                  Herramientas <ChevronDown size={16} />
                </Link>

                <div className="header-dropdown-content" style={{ minWidth: '320px' }}>
                  <div className="dropdown-column">
                    <h4>HERRAMIENTAS</h4>
                    {herramientasItems.map((it) => (
                      <Link href={it.href} className="dropdown-item" key={it.href}>
                        {it.icon} {it.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/faq" className="header-nav-link">
                FAQ
              </Link>

              <Link href="/blog" className="header-nav-link">
                Blog
              </Link>

              <Link href="/contacto" className="header-nav-link">
                Contacto
              </Link>
            </nav>
          </div>

          <div className="site-header__right">
            {/* CTA Carla (visible siempre) */}
            <button
              className="header-auth-button header-auth-button-signup"
              onClick={() => setIsCarlaOpen(true)}
            >
              Asesoría con Carla
            </button>

            {/* Desktop Auth Buttons */}
            <div className="header-auth-buttons">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="header-auth-button header-auth-button-signin">Iniciar sesión</button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button className="header-auth-button header-auth-button-signup">Registro</button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <Link href="/dashboard" className="header-auth-button header-auth-button-signin">
                  Panel
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>

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

            {/* Herramientas toggle + link */}
            <div className="mobile-section">
              <div className="mobile-toggle-row">
                <Link
                  href="/recursos"
                  style={{ flex: 1, color: 'white', textDecoration: 'none' }}
                  onClick={closeMobileMenu}
                >
                  Herramientas
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
                  aria-label="Abrir herramientas"
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
                  <div className="mobile-category">
                    <h4>HERRAMIENTAS</h4>
                    {herramientasItems.map((it) => (
                      <Link
                        href={it.href}
                        className="mobile-dropdown-item"
                        key={it.href}
                        onClick={closeMobileMenu}
                      >
                        {it.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/faq" className="header-nav-link" onClick={closeMobileMenu}>
              FAQ
            </Link>

            <Link href="/blog" className="header-nav-link" onClick={closeMobileMenu}>
              Blog
            </Link>

            <Link href="/contacto" className="header-nav-link" onClick={closeMobileMenu}>
              Contacto
            </Link>

            <button
              className="mobile-carla-btn"
              onClick={() => {
                setIsCarlaOpen(true)
                closeMobileMenu()
              }}
            >
              Asesoría con Carla
            </button>

            {/* Auth Buttons Mobile */}
            <div className="mobile-auth-section">
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    className="header-auth-button header-auth-button-signin"
                    style={{ width: '100%' }}
                  >
                    Iniciar sesión
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button
                    className="header-auth-button header-auth-button-signup"
                    style={{ width: '100%' }}
                  >
                    Registro
                  </button>
                </SignUpButton>
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

      {/* Modal Carla */}
      <CarlaModal open={isCarlaOpen} onClose={() => setIsCarlaOpen(false)} />
    </>
  )
}
