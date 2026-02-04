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

export interface EmailEquipoParams {
  tipo: 'nuevo_pedido' | 'error_sistema'
  pedidoId?: string
  nombreServicio?: string
  cliente?: string
  monto?: number
  errorDetalle?: string
}

export class EmailService {
  /**
   * Enviar email de confirmación de pago
   */
  static async enviarConfirmacionPago(params: EmailConfirmacionPagoParams) {
    try {
      const { to, nombreUsuario, nombreServicio, montoPagado, pedidoId, fechaPago } = params

      const { data, error } = await resend.emails.send({
        from: 'Open LLC USA <hola@openllcusa.com>', // Cambia esto por tu dominio verificado pronto
        to,
        subject: `¡Confirmado! Ya estamos trabajando en tu ${nombreServicio} 🚀`,
        html: `
          <!DOCTYPE html>
          <html lang="es">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Confirmación de Pago - Open LLC USA</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f9; color: #1a202c;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                <tr>
                  <td align="center" style="padding: 40px 0;">
                    <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                      <!-- Header con gradiente -->
                      <tr>
                        <td align="center" style="background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); padding: 40px 20px;">
                          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Open LLC USA</h1>
                          <p style="color: #e0f2fe; margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Tu puente hacia el mercado estadounidense</p>
                        </td>
                      </tr>

                      <!-- Cuerpo del mensaje -->
                      <tr>
                        <td style="padding: 40px;">
                          <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #1e293b; font-weight: 700;">¡Hola ${nombreUsuario}! 🎉</h2>
                          <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                            Muchas gracias por confiar en Open LLC USA. Hemos recibido tu pago correctamente y el equipo ya ha sido notificado para comenzar con los trámites de tu <strong>${nombreServicio}</strong>.
                          </p>

                          <!-- Resumen de Facturación -->
                          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                            <h3 style="margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Detalles del Pedido</h3>
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding: 8px 0; font-weight: 600;">Producto</td>
                                <td align="right" style="padding: 8px 0; color: #475569;">${nombreServicio}</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; font-weight: 600;">ID Pedido</td>
                                <td align="right" style="padding: 8px 0; color: #475569; font-family: monospace;">${pedidoId}</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; font-weight: 600;">Total Pagado</td>
                                <td align="right" style="padding: 8px 0; color: #0ea5e9; font-size: 18px; font-weight: 700;">$${montoPagado.toFixed(2)} USD</td>
                              </tr>
                            </table>
                          </div>

                          <!-- Timeline/Pasos -->
                          <h3 style="margin: 30px 0 20px 0; font-size: 18px; color: #1e293b;">🚀 ¿Qué pasa ahora?</h3>
                          <div style="margin-bottom: 30px;">
                            <div style="border-left: 2px solid #e0f2fe; margin-left: 10px; padding-left: 20px; position: relative; margin-bottom: 20px;">
                              <div style="position: absolute; left: -6px; top: 0; width: 10px; height: 10px; background-color: #0ea5e9; border-radius: 50%;"></div>
                              <p style="margin: 0; font-weight: 700; color: #1e293b;">Paso 1: Revisión de datos (Inmediato)</p>
                              <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">Nuestro equipo verifica que toda la información sea correcta para evitar retrasos con el IRS.</p>
                            </div>
                            <div style="border-left: 2px solid #e0f2fe; margin-left: 10px; padding-left: 20px; position: relative; margin-bottom: 20px;">
                              <div style="position: absolute; left: -6px; top: 0; width: 10px; height: 10px; background-color: #cbd5e1; border-radius: 50%;"></div>
                              <p style="margin: 0; font-weight: 700; color: #1e293b;">Paso 2: Procesamiento gubernamental</p>
                              <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">Enviamos la solicitud al estado correspondiente o al IRS según el servicio contratado.</p>
                            </div>
                            <div style="border-left: 2px solid #e0f2fe; margin-left: 10px; padding-left: 20px; position: relative;">
                              <div style="position: absolute; left: -6px; top: 0; width: 10px; height: 10px; background-color: #cbd5e1; border-radius: 50%;"></div>
                              <p style="margin: 0; font-weight: 700; color: #1e293b;">Paso 3: Entrega de documentos</p>
                              <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">Recibirás tus documentos digitales oficiales directamente en tu dashboard y por email.</p>
                            </div>
                          </div>

                          <!-- Call to Action -->
                          <div align="center" style="margin: 40px 0;">
                            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" style="background-color: #0ea5e9; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; transition: background-color 0.3s ease;">Ir a mi Panel de Control</a>
                          </div>

                          <p style="margin: 20px 0 0 0; font-size: 14px; color: #94a3b8; text-align: center;">
                            Si tienes alguna duda, responde a este correo o escríbenos a <a href="mailto:soporte@openllcusa.com" style="color: #0ea5e9; text-decoration: none; font-weight: 600;">soporte@openllcusa.com</a>
                          </p>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                          <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 600;">Open LLC USA</p>
                          <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">Helping international founders build the future in the US.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
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
        from: 'Open LLC USA <hola@openllcusa.com>', // Dominio de prueba
        to,
        subject: '¡Bienvenido a Open LLC USA! 🎉',
        html: `
          <!DOCTYPE html>
          <html lang="es">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Bienvenido a Open LLC USA</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f9; color: #1a202c;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                <tr>
                  <td align="center" style="padding: 40px 0;">
                    <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                      <!-- Header -->
                      <tr>
                        <td align="center" style="background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); padding: 40px 20px;">
                          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Open LLC USA</h1>
                          <p style="color: #e0f2fe; margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Tu puente hacia el mercado estadounidense</p>
                        </td>
                      </tr>

                      <!-- Cuerpo del mensaje -->
                      <tr>
                        <td style="padding: 40px;">
                          <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #1e293b; font-weight: 700;">¡Hola ${nombreUsuario}! 🎉</h2>
                          <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                            Estamos encantados de tenerte con nosotros. Has dado el primer paso para globalizar tu negocio y estamos aquí para acompañarte en cada etapa del camino.
                          </p>

                          <h3 style="margin: 30px 0 16px 0; font-size: 18px; color: #1e293b;">¿Qué puedes hacer ahora?</h3>
                          <div style="margin-bottom: 30px;">
                            <div style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                              <span style="font-size: 20px; margin-right: 12px;">🏢</span>
                              <span style="font-weight: 600; color: #1e293b;">Explora nuestros servicios:</span> Formación de LLC en Wyoming, Delaware, Florida y más.
                            </div>
                            <div style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                              <span style="font-size: 20px; margin-right: 12px;">🔢</span>
                              <span style="font-weight: 600; color: #1e293b;">Trámites Fiscales:</span> Obtención de EIN sin necesidad de SSN o ITIN.
                            </div>
                            <div style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                              <span style="font-size: 20px; margin-right: 12px;">📚</span>
                              <span style="font-weight: 600; color: #1e293b;">Guías Gratuitas:</span> Accede a recursos exclusivos para emprendedores internacionales.
                            </div>
                          </div>

                          <!-- Call to Action -->
                          <div align="center" style="margin: 40px 0;">
                            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" style="background-color: #0ea5e9; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block;">Acceder a mi Dashboard</a>
                          </div>

                          <p style="margin: 20px 0 0 0; font-size: 14px; color: #64748b; line-height: 1.6;">
                            Si tienes alguna pregunta inicial, no dudes en escribirnos. Nuestro equipo de expertos está listo para ayudarte a navegar la burocracia de EE.UU.
                          </p>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                          <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 600;">Open LLC USA</p>
                          <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">Helping international founders build the future in the US.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
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

  /**
   * Notificar al equipo interno (Admin)
   */
  static async notificarEquipo(params: EmailEquipoParams) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'soporte@openllcusa.com' // Email donde recibirás las alertas

      let subject = ''
      let contentHtml = ''

      if (params.tipo === 'nuevo_pedido') {
        subject = `🤑 Nueva Venta: ${params.nombreServicio} ($${params.monto})`
        contentHtml = `
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin: 20px 0;">
            <p style="margin: 0 0 16px 0; font-size: 18px; color: #166534; font-weight: 700;">¡Nueva venta confirmada!</p>
            <table width="100%" cellpadding="8" cellspacing="0" style="color: #166534;">
              <tr>
                <td width="140"><strong>Servicio:</strong></td>
                <td>${params.nombreServicio}</td>
              </tr>
              <tr>
                <td><strong>Monto:</strong></td>
                <td style="font-size: 20px; font-weight: 800;">$${params.monto} USD</td>
              </tr>
              <tr>
                <td><strong>ID Pedido:</strong></td>
                <td><code style="background: #ffffff; padding: 2px 6px; border-radius: 4px;">${params.pedidoId}</code></td>
              </tr>
              <tr>
                <td><strong>Cliente:</strong></td>
                <td>${params.cliente}</td>
              </tr>
            </table>
          </div>
          <div align="center" style="margin-top: 24px;">
            <a href="https://dashboard.stripe.com" style="color: #6366f1; text-decoration: underline;">Ver en Stripe</a>
          </div>
        `
      } else {
        subject = `🚨 Error Crítico en el Sistema`
        contentHtml = `
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 24px; margin: 20px 0;">
            <p style="margin: 0 0 16px 0; font-size: 18px; color: #991b1b; font-weight: 700;">Error detectado</p>
            <p style="color: #991b1b; font-family: monospace; white-space: pre-wrap;">${params.errorDetalle}</p>
          </div>
        `
      }

      const { data, error } = await resend.emails.send({
        from: 'Open LLC System <sistema@openllcusa.com>',
        to: adminEmail,
        subject,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
            <h2 style="color: #1e293b;">Notificación de Sistema</h2>
            ${contentHtml}
            <p style="font-size: 12px; color: #94a3b8; margin-top: 40px; text-align: center;">
              Este es un mensaje automático generado por Open LLC USA Cloud System.
            </p>
          </div>
        `
      })

      if (error) {
        console.error('❌ Error notificando al equipo:', error)
      } else {
        console.log('✅ Equipo notificado:', data?.id)
      }

    } catch (error) {
      console.error('💥 Excepción notificando equipo:', error)
    }
  }
}
