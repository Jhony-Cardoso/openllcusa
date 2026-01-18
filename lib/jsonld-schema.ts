// JSON-LD Schema for SEO
export const homePageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        // Organization Schema
        {
            '@type': 'Organization',
            '@id': 'https://openllcusa.com/#organization',
            name: 'Open LLC USA',
            url: 'https://openllcusa.com',
            logo: {
                '@type': 'ImageObject',
                url: 'https://openllcusa.com/logo.png',
                width: 250,
                height: 60,
            },
            contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+1-234-567-890',
                contactType: 'customer service',
                availableLanguage: ['Spanish', 'English'],
                areaServed: 'Worldwide',
            },
            sameAs: [
                'https://facebook.com/openllcusa',
                'https://twitter.com/openllcusa',
                'https://linkedin.com/company/openllcusa',
                'https://instagram.com/openllcusa',
            ],
        },
        // Website Schema
        {
            '@type': 'WebSite',
            '@id': 'https://openllcusa.com/#website',
            url: 'https://openllcusa.com',
            name: 'Open LLC USA',
            description: 'Servicios profesionales para crear tu LLC en Estados Unidos',
            publisher: {
                '@id': 'https://openllcusa.com/#organization',
            },
            inLanguage: 'es-ES',
        },
        // Service Schema
        {
            '@type': 'Service',
            '@id': 'https://openllcusa.com/#service',
            serviceType: 'Registro de LLC en Estados Unidos',
            provider: {
                '@id': 'https://openllcusa.com/#organization',
            },
            areaServed: {
                '@type': 'Country',
                name: 'Worldwide',
            },
            hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Servicios de LLC',
                itemListElement: [
                    {
                        '@type': 'Offer',
                        itemOffered: {
                            '@type': 'Service',
                            name: 'Registro de LLC',
                            description: 'Creación completa de LLC en Wyoming, Delaware, New Mexico o Florida',
                        },
                    },
                    {
                        '@type': 'Offer',
                        itemOffered: {
                            '@type': 'Service',
                            name: 'Obtención de EIN',
                            description: 'Tramitación de EIN sin necesidad de SSN o ITIN',
                        },
                    },
                    {
                        '@type': 'Offer',
                        itemOffered: {
                            '@type': 'Service',
                            name: 'Agente Registrado',
                            description: 'Servicio de agente registrado incluido el primer año',
                        },
                    },
                ],
            },
        },
        // Breadcrumb Schema
        {
            '@type': 'BreadcrumbList',
            '@id': 'https://openllcusa.com/#breadcrumb',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Inicio',
                    item: 'https://openllcusa.com',
                },
            ],
        },
        // Aggregate Rating
        {
            '@type': 'Organization',
            '@id': 'https://openllcusa.com/#organization',
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '500',
                bestRating: '5',
                worstRating: '1',
            },
        },
        // FAQPage Schema
        {
            '@type': 'FAQPage',
            mainEntity: [
                {
                    '@type': 'Question',
                    name: '¿Necesito viajar a Estados Unidos para crear mi LLC?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'No, todo el proceso es 100% online. No necesitas viajar, tener visa ni estar presente en Estados Unidos.',
                    },
                },
                {
                    '@type': 'Question',
                    name: '¿Cuánto tiempo tarda el proceso?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Tu LLC estará lista en 72 horas. Recibirás todos los documentos legales necesarios para operar.',
                    },
                },
                {
                    '@type': 'Question',
                    name: '¿Necesito SSN o ITIN para obtener el EIN?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'No, te ayudamos a obtener tu EIN sin necesidad de SSN ni ITIN. Solo necesitas tu pasaporte.',
                    },
                },
            ],
        },
    ],
} as const;
