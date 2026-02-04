import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getAllPosts } from '@/lib/blog/posts'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://openllcusa.com'

    // Páginas estáticas
    const staticPages = [
        '',
        '/precios',
        '/calculadora-fiscal',
        '/contacto',
        '/faq',
        '/blog',
        '/recursos',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Páginas de servicios dinámicos
    const supabase = await createClient()
    const { data: servicios } = await supabase.from('servicios').select('slug')

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

    return [...staticPages, ...servicePages, ...blogPages]
}
