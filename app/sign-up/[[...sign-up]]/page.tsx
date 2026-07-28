'use client';

import { SignUp, useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  // Clerk puede pasar redirect_url o __clerk_redirect_url dependiendo del flujo (protect vs client guard)
  let redirectUrl =
    searchParams.get('redirect_url') ||
    searchParams.get('__clerk_redirect_url') ||
    '/dashboard';

  if (redirectUrl.includes('/sign-in') || redirectUrl.includes('/sign-up')) {
    redirectUrl = '/dashboard';
  }

  // Si ya está logueado (después de signup), redirigir
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      sessionStorage.setItem('just_signed_in', 'true');
      window.location.replace(redirectUrl);
    }
  }, [isLoaded, isSignedIn]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crea tu cuenta
          </h1>
          <p className="text-gray-600">
            Comienza a gestionar tu LLC en minutos
          </p>
        </div>

        <SignUp
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
