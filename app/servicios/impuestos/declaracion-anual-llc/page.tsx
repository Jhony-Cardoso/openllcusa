import ServicioDetallePage, { generateMetadata as baseGenerateMetadata } from '@/app/servicios/[slug]/page'

const SLUG = 'impuestos/declaracion-anual-llc'

export async function generateMetadata() {
  return baseGenerateMetadata({ params: Promise.resolve({ slug: SLUG }) })
}

export default function DeclaracionAnualPage() {
  return <ServicioDetallePage params={Promise.resolve({ slug: SLUG })} />
}
