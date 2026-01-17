// lib/onboarding-flow.ts
export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface OnboardingData {
  // Paso 1
  paquete: 'llc-esencial' | 'launch-banking' | 'primer-ano-pro';
  
  // Paso 2
  estado: string;
  
  // Paso 3
  nombreEmpresa: string;
  sector: string;
  descripcionNegocio: string;
  numSocios: number;
  ingresosEstimados: string;
  emailEmpresa: string;
  telefonoEmpresa: string;
  
  // Paso 4 (revisión - no requiere datos nuevos)
  
  // Paso 5 (checkout)
  stripePaymentIntentId?: string;
  
  // Paso 6 (info adicional - post-pago)
  documentosAdicionales?: File[];
}

// Hook para gestionar el estado del onboarding
export function useOnboarding(pedidoId: string) {
  // Aquí se conectaría con Supabase para guardar/cargar
  // el estado del pedido en tiempo real
}