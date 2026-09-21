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
  const { pathname } = new URL(req.url)

  // Límite de peticiones en toda la API. Solo se cortocircuita cuando se supera el
  // límite: el resto del tráfico sigue su curso normal, sin devolver respuesta, para
  // no interferir con Clerk (que decora la petición con sus cabeceras) ni con los
  // route handlers. Los webhooks de Stripe y Clerk quedan exentos dentro del guardián.
  if (pathname.startsWith('/api/')) {
    const limite = comprobarLimite(pathname, ipDePeticion(req))
    if (!limite.exento && !limite.permitido) {
      return NextResponse.json(
        { error: 'Demasiadas peticiones. Espera unos segundos y vuelve a intentarlo.' },
        { status: 429, headers: { 'Retry-After': String(limite.reiniciarEnSegundos), 'Cache-Control': 'no-store' } }
      )
    }
  }

  // Solo proteger si es una ruta del dashboard
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
