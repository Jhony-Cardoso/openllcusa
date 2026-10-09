/**
 * Descarga al propio dominio las banderas que usa el sitio.
 *
 * Por qué existe: hasta ahora las banderas se pintaban con `react-country-flag` en modo
 * `svg`, que NO incrusta el SVG: genera un <img> que se descarga de
 * cdn.jsdelivr.net/gh/lipis/flag-icons. Si ese CDN falla o cambia, las banderas
 * desaparecen. Este script trae los SVG al repo (public/banderas/) y
 * components/Flag.tsx los sirve desde /banderas/<codigo>.svg.
 *
 * Los SVG son de lipis/flag-icons (licencia MIT): ver docs/LICENCIA-banderas.md.
 *
 * Uso:  npm run banderas        (o: node scripts/descarga-banderas.mjs)
 * Cuándo: al añadir un país a components/CountrySelector/countries.ts.
 * Lee los códigos de ese fichero y los del código (countryCode="xx"), así que
 * no puede quedarse desincronizado con la app.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, unlinkSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const DESTINO = join(RAIZ, 'public', 'banderas')
const FUENTE = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@main/flags/4x3'

/** Códigos que no salen de countries.ts pero se usan en pantalla. */
const EXTRA = ['us']

function codigosDeLaApp() {
  const encontrados = new Set(EXTRA)

  const paises = readFileSync(join(RAIZ, 'components', 'CountrySelector', 'countries.ts'), 'utf8')
  for (const m of paises.matchAll(/code:\s*['"]([A-Za-z]{2})['"]/g)) encontrados.add(m[1].toLowerCase())

  const ficheros = []
  const recorre = (dir) => {
    for (const e of readdirSync(join(RAIZ, dir), { withFileTypes: true })) {
      const rel = join(dir, e.name)
      if (e.isDirectory()) recorre(rel)
      else if (/\.tsx?$/.test(e.name)) ficheros.push(rel)
    }
  }
  recorre('app')
  recorre('components')

  for (const f of ficheros) {
    const t = readFileSync(join(RAIZ, f), 'utf8')
    for (const m of t.matchAll(/countryCode=\{?['"]([A-Za-z]{2})['"]/g)) encontrados.add(m[1].toLowerCase())
    for (const m of t.matchAll(/country_code:\s*['"]([A-Za-z]{2})['"]/g)) encontrados.add(m[1].toLowerCase())
    for (const m of t.matchAll(/country:\s*['"]([A-Za-z]{2})['"]/g)) encontrados.add(m[1].toLowerCase())
  }
  return [...encontrados].sort()
}

const codigos = codigosDeLaApp()
mkdirSync(DESTINO, { recursive: true })
console.log(`Códigos detectados en la app: ${codigos.length} -> ${codigos.join(', ')}\n`)

let bajadas = 0
let saltadas = 0
const fallos = []

for (const code of codigos) {
  const destino = join(DESTINO, `${code}.svg`)
  if (existsSync(destino)) {
    saltadas++
    continue
  }
  const url = `${FUENTE}/${code}.svg`
  try {
    const r = await fetch(url)
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const svg = await r.text()
    if (!svg.includes('<svg')) throw new Error('la respuesta no es un SVG')
    writeFileSync(destino, svg, 'utf8')
    bajadas++
    console.log(`  ok   ${code}  ${(svg.length / 1024).toFixed(1)} KB`)
  } catch (e) {
    fallos.push(`${code}: ${e.message}`)
    console.log(`  FALLO ${code}: ${e.message}`)
  }
}

// limpia la carpeta de banderas de países que ya no usa la app
const enDisco = readdirSync(DESTINO).filter((f) => f.endsWith('.svg'))
const sobran = enDisco.filter((f) => !codigos.includes(f.replace('.svg', '')))
for (const f of sobran) {
  unlinkSync(join(DESTINO, f))
  console.log(`  borrada ${f} (ya no se usa)`)
}

console.log(`\nResumen: ${bajadas} descargadas, ${saltadas} ya estaban, ${sobran.length} borradas, ${fallos.length} fallos`)
if (fallos.length) {
  console.error('FALLOS:\n' + fallos.join('\n'))
  process.exit(1)
}
console.log(`Total en public/banderas: ${readdirSync(DESTINO).filter((f) => f.endsWith('.svg')).length} banderas`)
