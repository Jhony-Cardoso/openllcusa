/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://openllcusa.com',
  generateRobotsTxt: true, // Genera robots.txt automáticamente
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      // Bloquea rutas internas si las tienes (ej: /admin)
      // { userAgent: '*', disallow: '/admin' }
    ],
  },
  // Opcional: excluir rutas
  exclude: ['/gracias/*', '/404'],
}