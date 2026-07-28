'use client';

import { SignIn, useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  // Clerk puede pasar redirect_url o __clerk_redirect_url dependiendo del flujo (protect vs client guard)
  let redirectUrl =
    searchParams.get('redirect_url') ||
    searchParams.get('__clerk_redirect_url') ||
    '/dashboard';

  // Evitar redirect loop si por alguna razón el redirect_url apunta a sign-in
  if (redirectUrl.includes('/sign-in')) {
    redirectUrl = '/dashboard';
  }

  // Si ya está logueado, redirigir inmediatamente (evita quedarse en /sign-in)
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const target = redirectUrl || '/dashboard';
      // Solo redirigir si no estamos ya en el target
      const current = window.location.pathname + window.location.search;
      if (target !== current) {
        window.location.replace(target);
      }
    }
  }, [isLoaded, isSignedIn]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido de nuevo
          </h1>
          <p className="text-gray-600">
            Inicia sesión para acceder a tu panel de control
          </p>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-lg"
            }
          }}
          forceRedirectUrl={redirectUrl}
          fallbackRedirectUrl={redirectUrl}
        />
      </div>
    </div>
  )
}
