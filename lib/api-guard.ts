// Protección de la API: límite de peticiones por IP para todas las rutas /api/*.
//
// Decisiones y advertencias:
//  1. El limitador guarda las ventanas EN MEMORIA del proceso. Con un único
//     contenedor (el caso actual en Dokploy) es suficiente; si algún día hay
//     varias instancias detrás del balanceador, habrá que moverlo a Redis
//     (Upstash o similar) o los límites se multiplicarían por instancia.
//  2. Los webhooks (Stripe, Clerk) NO se limitan: vienen de servidores, no de
//     navegadores, y bloquearlos rompería pagos y altas de usuario.
//  3. El CORS se resolvió dejando de enviar la cabecera comodín desde
//     next.config.ts. Al no mandar ninguna cabecera Access-Control-Allow-Origin,
//     ninguna web ajena puede leer respuestas de la API; el propio sitio no
//     necesita CORS porque siempre llama a la misma origin (rutas relativas).

export type GrupoLimitador = 'chat' | 'escritura' | 'sensible' | 'lectura'

// Límites por minuto y por IP. Ajustables sin tocar código con variables de
// entorno: RATE_LIMIT_CHAT, RATE_LIMIT_ESCRITURA, RATE_LIMIT_SENSIBLE, RATE_LIMIT_LECTURA.
const LIMITES: Record<GrupoLimitador, number> = {
  chat: numeroDesdeEntorno('RATE_LIMIT_CHAT', 20),
  escritura: numeroDesdeEntorno('RATE_LIMIT_ESCRITURA', 30),
  sensible: numeroDesdeEntorno('RATE_LIMIT_SENSIBLE', 6),
  lectura: numeroDesdeEntorno('RATE_LIMIT_LECTURA', 120),
}

function numeroDesdeEntorno(nombre: string, porDefecto: number): number {
  const valor = typeof process !== 'undefined' ? process.env?.[nombre] : undefined
  const numero = Number(valor)
  return Number.isFinite(numero) && numero > 0 ? numero : porDefecto
}

// Rutas exentas: webhooks de servicios externos (servidor a servidor).
const EXENTAS = [/^\/api\/stripe\/webhook\/?$/, /^\/api\/webhooks\//]

// Rutas de diagnóstico y pruebas: límite estricto porque no deberían estar
// expuestas al público. Queda pendiente revisarlas con el usuario.
const SENSIBLES = [/^\/api\/debug/, /^\/api\/test/, /^\/api\/test-automation/, /^\/api\/test-email/]

// Rutas que gastan dinero (modelo de lenguaje) o que escriben en base de datos.
const ESCRITURA = [
  /^\/api\/leads/,
  /^\/api\/contact/,
  /^\/api\/calculator\//,
  /^\/api\/chat\/leads/,
  /^\/api\/pedidos/,
  /^\/api\/orders\//,
  /^\/api\/crypto\//,
  /^\/api\/stripe\/(?!webhook)/,
]

export function grupoDeRuta(ruta: string): GrupoLimitador | null {
  if (EXENTAS.some((re) => re.test(ruta))) return null
  if (SENSIBLES.some((re) => re.test(ruta))) return 'sensible'
  if (ruta === '/api/chat' || ruta === '/api/chat/') return 'chat'
  if (ESCRITURA.some((re) => re.test(ruta))) return 'escritura'
  return 'lectura'
}

type Ventana = { inicio: number; conteo: number }

const ventanas = new Map<string, Ventana>()
const VENTANA_MS = 60_000
const MAX_ENTRADAS = 5_000

export type ResultadoLimite = {
  exento: boolean
  permitido: boolean
  limite: number
  restantes: number
  reiniciarEnSegundos: number
}

// Ventana fija de un minuto: sencillo, predecible y suficiente para frenar abusos.
export function comprobarLimite(ruta: string, ip: string, ahora: number = Date.now()): ResultadoLimite {
  const grupo = grupoDeRuta(ruta)
  if (!grupo) {
    return { exento: true, permitido: true, limite: 0, restantes: 0, reiniciarEnSegundos: 0 }
  }

  const limite = LIMITES[grupo]
  const clave = grupo + '|' + ip
  const actual = ventanas.get(clave)
  const ventana: Ventana = !actual || ahora - actual.inicio >= VENTANA_MS ? { inicio: ahora, conteo: 0 } : actual

  ventana.conteo += 1
  ventanas.set(clave, ventana)

  // Limpieza perezosa para que el mapa no crezca sin control.
  if (ventanas.size > MAX_ENTRADAS) {
    for (const [k, v] of ventanas) {
      if (ahora - v.inicio >= VENTANA_MS) ventanas.delete(k)
    }
  }

  return {
    exento: false,
    permitido: ventana.conteo <= limite,
    limite,
    restantes: Math.max(0, limite - ventana.conteo),
    reiniciarEnSegundos: Math.max(1, Math.ceil((ventana.inicio + VENTANA_MS - ahora) / 1000)),
  }
}

// IP del visitante. Detrás de Traefik, el primer valor de X-Forwarded-For es el cliente.
export function ipDePeticion(req: Request): string {
  const cabeceras = req.headers
  const reenviada = cabeceras.get('x-forwarded-for')
  if (reenviada) {
    const primera = reenviada.split(',')[0].trim()
    if (primera) return primera
  }
  return cabeceras.get('x-real-ip') || cabeceras.get('cf-connecting-ip') || 'desconocida'
}
