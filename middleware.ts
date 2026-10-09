import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { comprobarLimite, ipDePeticion } from '@/lib/api-guard'

// Solo proteger las rutas del dashboard
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/servicios/:slug/onboarding(.*)',
  '/servicios/form-5472-1120/onboarding(.*)',
  '/servicios/impuestos/declaracion-anual-llc/onboarding(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url)
  const hostname = req.headers.get('host') || ''

  // 1. FORZAR REDIRECCIÓN DE WWW A SIN-WWW Y HTTP A HTTPS
  const xForwardedProto = req.headers.get('x-forwarded-proto')
  const esHttp = xForwardedProto === 'http'
  const tieneWww = hostname.startsWith('www.')

  if (tieneWww || esHttp) {
    const cleanHost = hostname.replace('www.', '')
    // Reconstruimos la URL obligando a usar https y el dominio limpio sin www
    const targetUrl = `https://${cleanHost}${url.pathname}${url.search}`
    return NextResponse.redirect(targetUrl, 301)
  }

  // 2. SISTEMA DE LÍMITES DE TU API (Se mantiene intacto)
  const { pathname } = url
  if (pathname.startsWith('/api/')) {
    const limite = comprobarLimite(pathname, ipDePeticion(req))
    if (!limite.exento && !limite.permitido) {
      return NextResponse.json(
        { error: 'Demasiadas peticiones. Espera unos segundos y vuelve a intentarlo.' },
        { status: 429, headers: { 'Retry-After': String(limite.reiniciarEnSegundos), 'Cache-Control': 'no-store' } }
      )
    }
  }

  // 3. PROTECCIÓN DE RUTAS DE CLERK (Se mantiene intacto)
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
