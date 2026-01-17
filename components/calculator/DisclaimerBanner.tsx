// DÓNDE: app/components/calculator/DisclaimerBanner.tsx
// CUÁNDO CREAR: Ahora (Prioridad 1)
// PROPÓSITO: Banner sticky siempre visible

'use client';

export default function DisclaimerBanner() {
  return (
    <div className="sticky top-0 z-50 bg-yellow-100 border-b-2 border-yellow-500 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm text-center text-gray-800">
          <span className="font-semibold">⚠️ Información orientativa:</span> Esta calculadora NO constituye asesoramiento fiscal, legal ni financiero personalizado. 
          <a href="/legal/disclaimer-calculator" className="underline ml-2 hover:text-yellow-800">
            Leer más
          </a>
        </p>
      </div>
    </div>
  );
}
