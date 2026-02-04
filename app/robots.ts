import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://openllcusa.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/dashboard/',
                '/api/',
                '/sign-in/',
                '/sign-up/',
                '/*/onboarding/', // Evitar indexar pasos de registro/pago parciales
                '/*/checkout/',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
