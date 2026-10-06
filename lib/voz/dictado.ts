// Dictado por voz con las APIs del navegador (coste 0, sin proveedores externos).
//
// Vive aquí, y no dentro de un componente, para que el widget de texto y el modal de voz de
// Fase 0 compartan una única fuente de verdad: qué navegadores pueden dictar, qué significan
// sus errores y cómo se configura el reconocimiento. El cerebro sigue siendo /api/chat.

export type SpeechRecognitionLike = {
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

const LOG = '[Zara dictado]'

export function logDictado(...args: any[]) {
  if (typeof console !== 'undefined') console.info(LOG, ...args)
}

export function speechSupported(): boolean {
  if (typeof window === 'undefined') return false
  const w = window as any
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition)
}

// Vivaldi y Brave son Chromium pero sin el servicio de voz de Google: el objeto existe y
// arranca, pero falla al conectar. Mejor saberlo antes de ofrecer el botón.
export function isSpeechlessBrowser(): { es: boolean; motivo: string } {
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

// ── Memoria de los navegadores que no pueden llegar al servicio de voz ──
// Detectar la marca del navegador no es fiable: Vivaldi, por ejemplo, se presenta como Chrome a
// secas (comprobado el 07-10-2026: "… Chrome/152.0.0.0 Safari/537.36"), así que el micro se
// ofrecía y solo fallaba al intentarlo. Por eso, cuando un intento falla porque no se puede
// conectar con el servicio de voz, se apunta y se deja de ofrecer durante un tiempo: mejor no
// ofrecer un botón que no puede funcionar. Un fallo de permiso o de micrófono NO se apunta,
// porque eso sí tiene arreglo (dar permiso o conectar el micrófono).
const CLAVE_SIN_SERVICIO = 'zara_voz_sin_servicio'
const DIAS_SIN_SERVICIO = 30

export function servicioVozDescartado(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const guardado = window.localStorage.getItem(CLAVE_SIN_SERVICIO)
    if (!guardado) return false
    const hasta = Number(guardado)
    if (!Number.isFinite(hasta) || hasta <= 0) return false
    if (Date.now() > hasta) {
      window.localStorage.removeItem(CLAVE_SIN_SERVICIO)
      return false
    }
    return true
  } catch {
    // Navegación privada o almacenamiento bloqueado: sin memoria, pero sin romper nada.
    return false
  }
}

export function marcarServicioVozDescartado() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CLAVE_SIN_SERVICIO, String(Date.now() + DIAS_SIN_SERVICIO * 86400000))
    logDictado(`el servicio de voz no responde: no volveré a ofrecer el micro en ${DIAS_SIN_SERVICIO} días`)
  } catch {
    /* sin almacenamiento disponible: la memoria solo vale para esta visita */
  }
}

// ¿Este error significa «este navegador no puede llegar al servicio de voz»?
export function esFalloDeServicioVoz(codigo: string): boolean {
  return codigo === 'network' || codigo === 'service-not-allowed'
}

export function dictationAvailable(): boolean {
  return speechSupported() && !isSpeechlessBrowser().es && !servicioVozDescartado()
}

export function dictationNote(): string {
  const { es, motivo } = isSpeechlessBrowser()
  if (es) return `${motivo} Prueba con Chrome, Edge o Safari, o escribe tu pregunta.`
  if (!speechSupported()) {
    return 'Este navegador no permite dictado por voz. Prueba con Chrome, Edge o Safari.'
  }
  if (servicioVozDescartado()) {
    return 'El dictado por voz no está disponible en este navegador. Prueba con Chrome, Edge o Safari, o escribe tu pregunta.'
  }
  return ''
}

export const NUDGE_MSG =
  'No te estoy oyendo. Comprueba que el micrófono no esté silenciado, que sea el dispositivo correcto y que hables cerca de él.'

export function describeRecognitionError(code: string): string {
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

// Chrome cierra el reconocimiento en cada pausa aunque se pida continuo, así que quien lo use
// debe reabrirlo desde `onend` mientras el usuario siga dictando.
export function createRecognition(): SpeechRecognitionLike | null {
  if (!speechSupported()) return null
  const w = window as any
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition
  const rec: SpeechRecognitionLike = new Ctor()
  rec.lang = 'es-ES'
  rec.continuous = true
  rec.interimResults = true
  rec.maxAlternatives = 1
  return rec
}
