import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ServicioDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const supabase = await createClient()

  const { data: servicio, error } = await supabase
    .from('servicios')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !servicio) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{servicio.title}</h1>
      <p className="text-gray-600 mb-4">{servicio.tagline}</p>
      <p className="text-2xl font-semibold mb-6">{servicio.price}</p>

      <div className="bg-white border rounded-lg p-6 mb-8">
        <p className="whitespace-pre-line">{servicio.descripcion}</p>
      </div>

      <Link
        href={`/servicios/${slug}/onboarding`}
        className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg"
      >
        Continuar al siguiente paso →
      </Link>
    </div>
  )
}
