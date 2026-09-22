// Tokenizador mínimo de Markdown en línea para las respuestas de Zara.
// Vive aparte del componente para poder probarlo sin navegador.
//
// Motivo: el modelo envuelve a veces un enlace en negrita (`**[Plan](/paquetes/x)**`). El
// troceado anterior partía la línea por negritas y enlaces, pero al elegir primero la
// negrita mostraba el enlace como texto literal `[Plan](/paquetes/x)`, sin ser clicable.
// Aquí el análisis es recursivo, así que funciona el enlace dentro de la negrita, la
// negrita dentro del enlace y las URL sueltas.

export type TokenMarkdown =
  | { tipo: 'texto'; valor: string }
  | { tipo: 'negrita'; hijos: TokenMarkdown[] }
  | { tipo: 'enlace'; href: string; hijos: TokenMarkdown[] }

const ENLACE = /\[([^\]]+)\]\(([^)]+)\)/
const NEGRITA = /\*\*([^*]+)\*\*/
const URL_SUELTA = /https?:\/\/[^\s<>"'()]+/

// Quita los signos de puntuación que cierran la frase y no forman parte de la dirección.
const limpiarUrl = (url: string): string => url.replace(/[.,;:!?]+$/, '')

export function parseMarkdownEnLinea(texto: string): TokenMarkdown[] {
  if (!texto) return []

  const candidatos = [
    { tipo: 'enlace' as const, encontrado: texto.match(ENLACE) },
    { tipo: 'negrita' as const, encontrado: texto.match(NEGRITA) },
    { tipo: 'url' as const, encontrado: texto.match(URL_SUELTA) },
  ].filter((c) => c.encontrado && c.encontrado.index !== undefined)

  if (candidatos.length === 0) return [{ tipo: 'texto', valor: texto }]

  // Gana el marcador que aparezca antes en la línea.
  const elegido = candidatos.reduce((a, b) => ((a.encontrado!.index! <= b.encontrado!.index!) ? a : b))
  const m = elegido.encontrado!
  const inicio = m.index!
  const antes = texto.slice(0, inicio)
  const resto = texto.slice(inicio + m[0].length)

  const tokens: TokenMarkdown[] = [...parseMarkdownEnLinea(antes)]

  if (elegido.tipo === 'enlace') {
    tokens.push({ tipo: 'enlace', href: m[2], hijos: parseMarkdownEnLinea(m[1]) })
  } else if (elegido.tipo === 'negrita') {
    // El contenido de la negrita se vuelve a analizar: puede llevar un enlace dentro.
    tokens.push({ tipo: 'negrita', hijos: parseMarkdownEnLinea(m[1]) })
  } else {
    const url = limpiarUrl(m[0])
    tokens.push({ tipo: 'enlace', href: url, hijos: [{ tipo: 'texto', valor: url }] })
    const sobrante = m[0].slice(url.length)
    if (sobrante) tokens.push({ tipo: 'texto', valor: sobrante })
  }

  tokens.push(...parseMarkdownEnLinea(resto))
  return tokens
}

// Marcador de lista al principio de la línea (viñeta, guion, número o icono).
export const MARCADOR_LISTA = /^(\s*)(•|-|\d+️⃣|\d+\.|✅|❌)\s*/

// Convierte una línea del chat en texto plano (sin marcadores), para comprobaciones.
export const textoPlano = (tokens: TokenMarkdown[]): string =>
  tokens
    .map((t) => (t.tipo === 'texto' ? t.valor : textoPlano(t.hijos)))
    .join('')
