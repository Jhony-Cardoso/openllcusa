// components/Flag.tsx
/**
 * Bandera de un país, servida desde el propio dominio: `/banderas/<código>.svg`.
 *
 * POR QUÉ NO SE USA `react-country-flag` DIRECTO:
 * con `svg` ese paquete NO incrusta el dibujo en el HTML, pinta un <img> que se
 * descarga de cdn.jsdelivr.net. Si ese CDN falla o cambia, las banderas desaparecen
 * de la web. Los SVG viven ahora en `public/banderas/` y los sirve Next.
 *
 * POR QUÉ NO UN EMOJI DE BANDERA:
 * Windows no dibuja las banderas emoji: enseña las dos letras del par (o un
 * cuadradito), así que el visitante no veía ninguna bandera.
 *
 * PARA AÑADIR UN PAÍS: `npm run banderas` (lee los códigos de
 * components/CountrySelector/countries.ts y los que aparecen en el código, así que
 * no puede quedarse desincronizado).
 *
 * Los SVG son de lipis/flag-icons (licencia MIT): ver docs/LICENCIA-banderas.md.
 */
type FlagSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface FlagProps {
  countryCode: string
  size?: FlagSize | number
  className?: string
  rounded?: boolean
  title?: string // accesibilidad: nombre del país
}

const TAMANOS: Record<FlagSize, string> = {
  xs: 'w-4 h-3',
  sm: 'w-5 h-4',
  md: 'w-6 h-4',
  lg: 'w-8 h-6',
  xl: 'w-12 h-9',
}

export default function Flag({
  countryCode,
  size = 'md',
  className = '',
  rounded = true,
  title,
}: FlagProps) {
  const code = (countryCode || '').toLowerCase()

  // Sin código válido no se pide ninguna imagen (antes esto lo cubría FlagSafe)
  if (code.length !== 2) {
    return (
      <span
        className={`inline-block w-6 h-4 bg-gray-300 rounded-sm ${className}`}
        aria-hidden="true"
      />
    )
  }

  const nombre = title || code.toUpperCase()
  const redondeo = rounded ? 'rounded-sm' : ''
  const clases =
    typeof size === 'number' ? '' : TAMANOS[size] || TAMANOS.md

  return (
    <img
      src={`/banderas/${code}.svg`}
      alt={`Bandera de ${nombre}`}
      title={nombre}
      width={typeof size === 'number' ? size : undefined}
      height={typeof size === 'number' ? Math.round(size * 0.75) : undefined}
      className={`${clases} ${redondeo} inline-block align-middle drop-shadow-sm ${className}`}
    />
  )
}
