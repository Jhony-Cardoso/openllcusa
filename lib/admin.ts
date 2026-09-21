// Allowlist de administradores para rutas internas (diagnóstico y pruebas).
//
// Nota: el repositorio repite esta misma comprobación en cada página y ruta de
// /admin (unas diez copias) con el mismo origen de datos: la variable de entorno
// ADMIN_EMAIL más el correo del propietario. Aquí se centraliza para las rutas
// nuevas; si algún día se unifica el resto, este es el sitio de referencia.

import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const ADMIN_FIJO = 'josemanuelguerranunez5@gmail.com'

export function emailsAdmin(): string[] {
  return [process.env.ADMIN_EMAIL, ADMIN_FIJO].filter(Boolean) as string[]
}

export function esEmailAdmin(email: string | null | undefined): boolean {
  const normalizado = (email || '').trim().toLowerCase()
  if (!normalizado) return false
  return emailsAdmin().some((permitido) => permitido.trim().toLowerCase() === normalizado)
}

export async function esAdmin(): Promise<boolean> {
  try {
    const user = await currentUser()
    return esEmailAdmin(user?.emailAddresses?.[0]?.emailAddress)
  } catch {
    return false
  }
}

// Respuesta común para estas rutas: no se anuncia qué existe, solo que no hay permiso.
export function noAutorizado() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
}
