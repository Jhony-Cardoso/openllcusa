import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getAllPosts } from '@/lib/blog/posts'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://openllcusa.com'

    // Páginas estáticas principales
    const staticPages = [
        '',
        '/crear-llc-usa',      // Página pillar principal — prioridad máxima después de home
        '/llc-para-no-residentes', // Landing pilar internacional
        '/llc-para-ecommerce', // Landing e-commerce y Amazon FBA
        '/costo-crear-llc',    // Landing costo y transparencia
        '/abrir-cuenta-bancaria-usa', // Landing bancos Fintech
        '/llc-trading-con-cuentas-de-fondeo', // Landing Prop Trading
        '/ein-sin-ssn',        // Landing transaccional importante
        '/crear-llc-desde-espana', // Landing geolocalizada importante
        '/llc-wyoming',        // Landing por estado importante
        '/llc-delaware',       // Landing por estado importante
        '/llc-new-mexico',     // Landing por estado importante
        '/llc-florida',        // Landing por estado importante
        '/llc-texas',          // Landing por estado (educativa)
        '/precios',
        '/calculadora-fiscal',
        '/contacto',
        '/faq',
        '/faq-calculadora',
        '/blog',
        '/recursos',
        '/zara',
        '/legal/condiciones-generales',
        '/legal/privacy-policy',
        '/legal/terminos-calculadora',
        '/legal/changelog',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : route === '/crear-llc-usa' ? 0.95 : route === '/llc-para-no-residentes' ? 0.95 : route === '/ein-sin-ssn' ? 0.9 : route === '/llc-wyoming' ? 0.85 : route === '/llc-delaware' ? 0.85 : route === '/llc-new-mexico' ? 0.85 : route === '/llc-florida' ? 0.85 : route === '/crear-llc-desde-espana' ? 0.85 : 0.8,
    }))

    // Páginas de guías y contenido informacional (alta prioridad SEO)
    const guidePages = [
        '/guia-llc-extranjeros',
        '/guia',
        '/guias',
        '/proceso',
        '/quiz',
        '/testimonios',
        '/agendar',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.75,
    }))

    // Páginas de servicios dinámicos y paquetes
    const supabase = await createClient()
    const { data: servicios } = await supabase.from('servicios').select('slug')
    const { data: paquetes } = await supabase.from('paquetes').select('slug')

    const servicePages = (servicios || []).map((servicio) => ({
        url: `${baseUrl}/servicios/${servicio.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    // Páginas de blog
    const posts = getAllPosts()
    const blogPages = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    const paquetePages = (paquetes || []).map((paquete) => ({
        url: `${baseUrl}/paquetes/${paquete.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    }))

    return [...staticPages, ...guidePages, ...servicePages, ...paquetePages, ...blogPages]
}
