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

const LogoMonograma = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Media luna blanca */}
    <path d="M 22 4 A 16 16 0 0 0 22 36 A 12 16 0 0 1 22 4 Z" fill="white" />
    {/* Franjas naranjas */}
    <path d="M 24 4 A 16 16 0 0 1 35.7 15 L 26 15 A 12 16 0 0 0 24 7 Z" fill="#ea580c" />
    <path d="M 36 18 A 16 16 0 0 1 36 22 L 24.5 22 A 12 16 0 0 0 24.5 18 Z" fill="#ea580c" />
    <path d="M 35.7 25 A 16 16 0 0 1 24 36 L 24 33 A 12 16 0 0 0 26 25 Z" fill="#ea580c" />
    {/* Estrellas */}
    <circle cx="15" cy="11" r="1.5" fill="white" />
    <circle cx="11" cy="16" r="1.5" fill="white" />
    <circle cx="19" cy="16" r="1.5" fill="white" />
    <circle cx="15" cy="21" r="1.5" fill="white" />
  </svg>
)

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
        return 'Ha ocurrido un error'
      default:
        return 'Listo'
    }
  }, [status])

  if (!open) return null

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
          <span className="zara-status-badge">DEMO (voz desactivada)</span>
        </div>

        <div className="zara-body">
          {status === 'idle' && (
            <div className="zara-intro">
              <p className="zara-intro-text">
                Pregunta lo que quieras sobre servicios, precios y el proceso. Esta interfaz ya está lista; la voz
                real se conectará cuando el sitio esté finalizado.
              </p>
              <ul className="zara-intro-list">
                <li>Te ayuda a elegir plan sin perderte.</li>
                <li>Resuelve dudas frecuentes (EIN, estado, pasos, tiempos).</li>
                <li>Te guía a Precios y Servicios con enlaces directos.</li>
              </ul>

              <div className="zara-actions">
                <button className="zara-primary" onClick={startDemoFlow}>
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
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`zara-msg ${m.role === 'user' ? 'zara-msg-user' : 'zara-msg-assistant'}`}
                  >
                    <div className="zara-msg-meta">{m.role === 'user' ? 'Tú' : 'Zara'}</div>
                    <div className="zara-msg-text">{m.text || (m.role === 'assistant' ? assistantStreamingText : '')}</div>
                  </div>
                ))}

                {status === 'listening' && (
                  <div className="zara-msg zara-msg-user zara-msg-draft">
                    <div className="zara-msg-meta">Tú (borrador)</div>
                    <div className="zara-msg-text">{draftUserText}</div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="zara-error">
                    <div className="zara-error-title">Error</div>
                    <div className="zara-error-text">{errorMsg || 'No se ha podido iniciar la demo.'}</div>
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
                  {status !== 'ended' && (
                    <button
                      className="zara-secondary-btn"
                      onClick={() => {
                        clearTimers()
                        setStatus('ended')
                      }}
                    >
                      Finalizar
                    </button>
                  )}

                  {status === 'ended' && (
                    <button className="zara-primary-btn" onClick={startDemoFlow}>
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
              <LogoMonograma />
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
