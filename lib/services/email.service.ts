import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailConfirmacionPagoParams {
  to: string
  nombreUsuario: string
  nombreServicio: string
  montoPagado: number
  pedidoId: string
  fechaPago: string
}

export interface EmailBienvenidaParams {
  to: string
  nombreUsuario: string
}

export class EmailService {
  /**
   * Enviar email de confirmación de pago
   */
  static async enviarConfirmacionPago(params: EmailConfirmacionPagoParams) {
    try {
      const { to, nombreUsuario, nombreServicio, montoPagado, pedidoId, fechaPago } = params

      const { data, error } = await resend.emails.send({
        from: 'Open LLC USA <onboarding@resend.dev>', // Dominio de prueba (cambiar a tu dominio cuando esté verificado)
        to,
        subject: `✅ Pago confirmado - ${nombreServicio}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Confirmación de Pago</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              
              <!-- Header -->
              <div style="text-align: center; padding: 20px 0; border-bottom: 3px solid #0ea5e9;">
                <h1 style="color: #0ea5e9; margin: 0;">🏛️ Open LLC USA</h1>
              </div>

              <!-- Contenido Principal -->
              <div style="padding: 30px 0;">
                <h2 style="color: #0ea5e9; margin-bottom: 20px;">¡Pago Confirmado! 🎉</h2>
                
                <p>Hola <strong>${nombreUsuario}</strong>,</p>
                
                <p>Hemos recibido tu pago exitosamente. Aquí están los detalles:</p>

                <!-- Detalles del Pago -->
                <div style="background: #f8fafc; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0; border-radius: 4px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #64748b;"><strong>Servicio:</strong></td>
                      <td style="padding: 8px 0; text-align: right;">${nombreServicio}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #64748b;"><strong>Monto:</strong></td>
                      <td style="padding: 8px 0; text-align: right; font-size: 20px; color: #0ea5e9; font-weight: bold;">$${montoPagado.toFixed(2)} USD</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #64748b;"><strong>Fecha:</strong></td>
                      <td style="padding: 8px 0; text-align: right;">${new Date(fechaPago).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #64748b;"><strong>ID de Pedido:</strong></td>
                      <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 12px;">${pedidoId}</td>
                    </tr>
                  </table>
                </div>

                <!-- Próximos Pasos -->
                <h3 style="color: #334155; margin-top: 30px;">📋 Próximos Pasos</h3>
                <ol style="color: #64748b; padding-left: 20px;">
                  <li style="margin-bottom: 10px;">Recibirás un email cuando tu pedido esté en proceso</li>
                  <li style="margin-bottom: 10px;">Puedes seguir el estado de tu pedido en tu dashboard</li>
                  <li style="margin-bottom: 10px;">Te notificaremos cuando esté completado</li>
                </ol>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/pedidos/${pedidoId}" 
                     style="display: inline-block; background: #0ea5e9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    Ver Mi Pedido
                  </a>
                </div>

                <!-- Soporte -->
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #92400e;">
                    <strong>💡 ¿Necesitas ayuda?</strong><br>
                    Contáctanos en <a href="mailto:soporte@openllcusa.com" style="color: #0ea5e9;">soporte@openllcusa.com</a>
                  </p>
                </div>

                <p style="color: #64748b; margin-top: 30px;">
                  Gracias por confiar en nosotros,<br>
                  <strong>El equipo de Open LLC USA</strong>
                </p>
              </div>

              <!-- Footer -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center; color: #94a3b8; font-size: 12px;">
                <p>Open LLC USA - Formación de empresas en Estados Unidos</p>
                <p>
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #0ea5e9; text-decoration: none;">Sitio Web</a> • 
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" style="color: #0ea5e9; text-decoration: none;">Dashboard</a> • 
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contacto" style="color: #0ea5e9; text-decoration: none;">Contacto</a>
                </p>
              </div>

            </body>
          </html>
        `,
      })

      if (error) {
        console.error('❌ Error enviando email de confirmación:', error)
        return { success: false, error }
      }

      console.log('✅ Email de confirmación enviado:', data?.id)
      return { success: true, data }
    } catch (error) {
      console.error('💥 Excepción enviando email:', error)
      return { success: false, error }
    }
  }

  /**
   * Enviar email de bienvenida
   */
  static async enviarBienvenida(params: EmailBienvenidaParams) {
    try {
      const { to, nombreUsuario } = params

      const { data, error } = await resend.emails.send({
        from: 'Open LLC USA <onboarding@resend.dev>', // Dominio de prueba
        to,
        subject: '¡Bienvenido a Open LLC USA! 🎉',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              
              <div style="text-align: center; padding: 20px 0;">
                <h1 style="color: #0ea5e9;">🏛️ Open LLC USA</h1>
              </div>

              <div style="padding: 30px 0;">
                <h2 style="color: #0ea5e9;">¡Bienvenido, ${nombreUsuario}! 🎉</h2>
                
                <p>Estamos emocionados de tenerte con nosotros. En Open LLC USA te ayudamos a formar y gestionar tu empresa en Estados Unidos de manera fácil y profesional.</p>

                <h3 style="color: #334155;">¿Qué puedes hacer ahora?</h3>
                <ul style="color: #64748b;">
                  <li>Explorar nuestros servicios de formación de LLC</li>
                  <li>Obtener tu EIN (número fiscal federal)</li>
                  <li>Acceder a guías y recursos gratuitos</li>
                  <li>Contactar con nuestro equipo de soporte</li>
                </ul>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" 
                     style="display: inline-block; background: #0ea5e9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    Ir a Mi Dashboard
                  </a>
                </div>

                <p style="color: #64748b;">
                  Si tienes alguna pregunta, no dudes en contactarnos.<br>
                  Estamos aquí para ayudarte.
                </p>
              </div>

              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center; color: #94a3b8; font-size: 12px;">
                <p>Open LLC USA</p>
              </div>

            </body>
          </html>
        `,
      })

      if (error) {
        console.error('❌ Error enviando email de bienvenida:', error)
        return { success: false, error }
      }

      console.log('✅ Email de bienvenida enviado:', data?.id)
      return { success: true, data }
    } catch (error) {
      console.error('💥 Excepción enviando email:', error)
      return { success: false, error }
    }
  }
}
