// DÓNDE: app/api/calculator/log-error/route.ts
// PROPÓSITO: Registrar errores y problemas reportados por usuarios

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      errorType,    // 'calculation' | 'user-report' | 'technical'
      description,
      userEmail,
      scenario,
      timestamp 
    } = body;

    // AQUÍ: Guardar en base de datos
    // Por ahora, solo logueamos en consola
    console.error('[CALCULATOR ERROR]', {
      errorType,
      description,
      userEmail,
      scenario,
      timestamp: new Date().toISOString()
    });

    // TODO: Enviar email a tu equipo si es crítico
    if (errorType === 'user-report') {
      // Enviar notificación email
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging calculator error:', error);
    return NextResponse.json(
      { error: 'Failed to log error' },
      { status: 500 }
    );
  }
}
