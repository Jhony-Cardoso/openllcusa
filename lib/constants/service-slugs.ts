// Centralized service slugs to avoid hardcoding strings across the codebase.
// Update here when DB slugs change. This improves maintainability and reduces 404 risks.

export const SERVICE_SLUGS = {
  // Impuestos y fiscales
  DECLARACION_ANUAL_LLC: 'impuestos/declaracion-anual-llc',
  REPORTE_ANUAL: 'reporte-anual',
  OBTENCION_EIN: 'impuestos/obtencion-ein',

  // Servicios individuales
  AGENTE_REGISTRADO: 'agente-registrado',
  LAUNCH_BANKING: 'launch-banking',
  CONSULTORIA_FISCAL: 'consultoria-fiscal',
} as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[keyof typeof SERVICE_SLUGS];

// Legacy slugs that may still exist in old pedidos or links (for backward compatibility in detection logic only)
export const LEGACY_TAX_SLUGS = [
  'impuestos-llc-5472-1120',
  'form-5472-1120',
  'impuestos-federales',
  'declaracion-anual-5472',
  'form-5472',
] as const;

// Helper functions for clean conditional logic
export function isTaxFilingSlug(slug: string | undefined | null): boolean {
  if (!slug) return false;
  return slug === SERVICE_SLUGS.DECLARACION_ANUAL_LLC || LEGACY_TAX_SLUGS.includes(slug as any);
}

export function isEIN(slug: string | undefined | null): boolean {
  return slug === SERVICE_SLUGS.OBTENCION_EIN;
}

export function isReporteAnual(slug: string | undefined | null): boolean {
  return slug === SERVICE_SLUGS.REPORTE_ANUAL;
}

export function isAgenteRegistrado(slug: string | undefined | null): boolean {
  return slug === SERVICE_SLUGS.AGENTE_REGISTRADO;
}

export function isLaunchBanking(slug: string | undefined | null): boolean {
  return slug === SERVICE_SLUGS.LAUNCH_BANKING;
}

export function isConsultoriaFiscal(slug: string | undefined | null): boolean {
  return slug === SERVICE_SLUGS.CONSULTORIA_FISCAL;
}

// All current canonical service slugs (useful for validation or sitemaps)
export const ALL_SERVICE_SLUGS: ServiceSlug[] = Object.values(SERVICE_SLUGS);

// Legacy slugs we no longer want to support in new code (for reference)
export const DEPRECATED_SLUGS = [
  ...LEGACY_TAX_SLUGS,
  'llc-esencial',
  'primer-ano-pro',
  'compliance-basico',
  'impuestos-llc-5472-1120', // duplicate for clarity
] as const;
