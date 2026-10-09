import Link from 'next/link'
import { allCountries, featuredCountries } from '@/components/CountrySelector/countries'

type Pais = { code: string; name: string }

/**
 * Bloque contextual de enlazado interno hacia las guías por país.
 *
 * Lo usan las páginas de dinero para repartir enlaces internos hacia /guias/<pais> (hasta ahora no
 * enlazaban ninguna) y para dar salida al visitante que todavía no es de Estados Unidos.
 *
 * Los países NO se escriben aquí: salen de components/CountrySelector/countries.ts, que es la fuente
 * única de la que también comen las guías, los selectores de país y el sitemap. El contador de guías
 * se calcula con allCountries.length, así que no se queda desfasado al añadir un país.
 */
export default function EnlazadoPaises({
  titulo = '¿Vienes de fuera de Estados Unidos?',
  entradilla = 'No hace falta viajar ni residir allí: lo que cambia según tu país es la documentación que hay que preparar. Estas guías lo explican país por país.',
  className = 'bg-slate-50 border border-slate-200',
  paises = featuredCountries,
}: {
  titulo?: string
  entradilla?: string
  className?: string
  paises?: Pais[]
}) {
  return (
    <section className={`rounded-3xl px-6 py-10 md:px-10 md:py-12 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{titulo}</h2>
      <p className="text-slate-600 mb-7 max-w-3xl">{entradilla}</p>

      <ul className="flex flex-wrap gap-3 mb-7">
        {paises.map((pais) => (
          <li key={pais.code}>
            <Link
              href={`/guias/${pais.code}`}
              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-700"
            >
              LLC desde {pais.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link
          href="/guias"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          Ver las {allCountries.length} guías por país →
        </Link>
        <p className="text-sm text-slate-500">
          ¿Tu país no está en la lista?{' '}
          <Link href="/contacto" className="font-semibold text-blue-700 hover:text-blue-900">
            Escríbenos
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
