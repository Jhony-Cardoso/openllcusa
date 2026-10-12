// ============================================
// app/paquetes/[paqueteSlug]/layout.tsx
// Metadatos y validación del asistente de paquetes.
// ============================================
//
// Las 45 URLs del asistente (9 pasos × 5 paquetes) no son contenido: son un
// flujo funcional. Heredaban el título y la descripción de la portada y se
// declaraban `index, follow` sin canonical, así que Google las reportaba como
// «Duplicada: el usuario no ha indicado ninguna versión canónica».
//
// Este layout es de SERVIDOR a propósito: el de `onboarding/` es de cliente
// ('use client') y un componente de cliente no puede exportar `metadata`.
//
// Además valida el slug aquí: el asistente resuelve el paquete con un `fetch`
// en el navegador, así que /paquetes/<lo-que-sea>/onboarding respondía 200 con
// un «Paquete no encontrado» dentro (un 404 que no era 404, y un espacio
// infinito de URLs). Si el slug no existe se corta con notFound() y se sirve la
// página de app/not-found.tsx.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  // Sin la marca: el layout raiz ya la anade con su plantilla de titulo
  title: 'Completar tu pedido',
  description: 'Completa los datos de tu LLC para empezar el proceso con Open LLC USA.',
  robots: { index: false, follow: true },
}

/**
 * Mismo criterio que /api/paquetes?slug= (busca por slug, sin filtrar por
 * `activo`), para no cambiar el comportamiento de ningún flujo que hoy
 * funciona.
 *
 * Ante cualquier problema (sin credenciales, error de red o de Supabase) se
 * devuelve `true` a propósito: es preferible que la página se pinte y muestre
 * su propio mensaje antes que tumbar un pedido en curso con un 404 falso.
 */
async function existePaquete(slug: string): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return true

  try {
    const respuesta = await fetch(
      `${url}/rest/v1/paquetes?slug=eq.${encodeURIComponent(slug)}&select=slug`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )
    if (!respuesta.ok) return true
    const datos = await respuesta.json()
    return Array.isArray(datos) && datos.length > 0
  } catch {
    return true
  }
}

export default async function PaqueteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ paqueteSlug: string }>
}) {
  const { paqueteSlug } = await params

  if (!(await existePaquete(paqueteSlug))) {
    notFound()
  }

  return <>{children}</>
}
