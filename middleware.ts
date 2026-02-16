import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Solo proteger las rutas del dashboard
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/servicios/form-5472-1120/onboarding(.*)'
])

export default clerkMiddleware(async (auth, req) => {
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
