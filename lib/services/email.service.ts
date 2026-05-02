import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_to_bypass_build');

export interface EmailConfirmacionPagoParams {
  to: string
  nombreUsuario: string
  nombreServicio: string
  montoPagado: number
  pedidoId: string           // UUID interno para links
  numeroPedido?: string      // Nº legible (PED-xxxx)
  fechaPago: string
  tipoServicio?: string      // 'reporte-anual' | 'obtencion-ein' | 'tax_filing_5472' | default
  estadoUsa?: string         // Solo para Reporte Anual
}

export interface EmailBienvenidaParams {
  to: string
  nombreUsuario: string
}

export interface EmailLeadParams {
  to: string
  nombre: string
  situacion: string
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
      const { to, nombreUsuario, nombreServicio, montoPagado, pedidoId, fechaPago,
              numeroPedido, tipoServicio, estadoUsa } = params

      const esReporteAnual = tipoServicio === 'reporte-anual'
      const esEIN = tipoServicio === 'obtencion-ein'
      const pedidoDisplay = numeroPedido ? `#${numeroPedido}` : pedidoId.slice(0, 8) + '...'

      // Pasos específicos por servicio
      const pasosHtml = esReporteAnual ? `
        <div style="border-left: 2px solid #e0f2fe; margin-left: 10px; padding-left: 20px; position: relative; margin-bottom: 20px;">
          <div style="position: absolute; left: -6px; top: 0; width: 10px; height: 10px; background-color: #0ea5e9; border-radius: 50%;"></div>
          <p style="margin: 0; font-weight: 700; color: #1e293b;">Paso 1: Revisión de datos</p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">Nuestro equipo revisará los datos de tu LLC registrada en ${estadoUsa || 'el estado seleccionado'} para preparar la presentación.</p>
        </div>
        <div style="border-left: 2px solid #e0f2fe; margin-left: 10px; padding-left: 20px; position: relative; margin-bottom: 20px;">
          <div style="position: absolute; left: -6px; top: 0; width: 10px; height: 10px; background-color: #cbd5e1; border-radius: 50%;"></div>
          <p style="margin: 0; font-weight: 700; color: #1e293b;">Paso 2: Presentación ante el estado de ${estadoUsa || 'EE.UU.'}</p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">Enviamos el reporte anual a la autoridad estatal correspondiente y abonamos la tasa de registro oficial.</p>
        </div>
        <div style="border-left: 2px solid #e0f2fe; margin-left: 10px; padding-left: 20px; position: relative;">
          <div style="position: absolute; left: -6px; top: 0; width: 10px; height: 10px; background-color: #cbd5e1; border-radius: 50%;"></div>
          <p style="margin: 0; font-weight: 700; color: #1e293b;">Paso 3: Confirmación oficial</p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">Recibirás el acuse de presentación y el certificado de cumplimiento en tu dashboard y por email.</p>
        </div>` : esEIN ? `
        <div style="border-left: 2px solid #e0f2fe; margin-left: 10px; padding-left: 20px; position: relative; margin-bottom: 20px;">
          <div style="position: absolute; left: -6px; top: 0; width: 10px; height: 10px; background-color: #0ea5e9; border-radius: 50%;"></div>
          <p style="margin: 0; font-weight: 700; color: #1e293b;">Paso 1: Firma de Autorización (Requiere tu acción)</p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">Accede a tu panel para firmar el documento SS-4 que autoriza a nuestro equipo a solicitar tu EIN ante el IRS.</p>
        </div>
        <div style="border-left: 2px solid #e0f2fe; margin-left: 10px; padding-left: 20px; position: relative; margin-bottom: 20px;">
          <div style="position: absolute; left: -6px; top: 0; width: 10px; height: 10px; background-color: #cbd5e1; border-radius: 50%;"></div>
          <p style="margin: 0; font-weight: 700; color: #1e293b;">Paso 2: Tramitación ante el IRS</p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">Enviamos la solicitud al IRS. El proceso suele tardar 5-7 días hábiles.</p>
        </div>
        <div style="border-left: 2px solid #e0f2fe; margin-left: 10px; padding-left: 20px; position: relative;">
          <div style="position: absolute; left: -6px; top: 0; width: 10px; height: 10px; background-color: #cbd5e1; border-radius: 50%;"></div>
          <p style="margin: 0; font-weight: 700; color: #1e293b;">Paso 3: Entrega de tu EIN</p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">Recibirás tu número EIN oficial con la carta de confirmación del IRS en tu dashboard.</p>
        </div>` : `
        <div style="border-left: 2px solid #e0f2fe; margin-left: 10px; padding-left: 20px; position: relative; margin-bottom: 20px;">
          <div style="position: absolute; left: -6px; top: 0; width: 10px; height: 10px; background-color: #0ea5e9; border-radius: 50%;"></div>
          <p style="margin: 0; font-weight: 700; color: #1e293b;">Paso 1: Configuración Legal (Requiere tu acción)</p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">Entra en tu panel para completar los detalles de tu LLC y adjuntar tu pasaporte. Es esencial para enviar hoy mismo la solicitud.</p>
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
        </div>`

      const ctaLabel = esReporteAnual
        ? 'Ver estado de mi trámite'
        : esEIN
          ? 'Firmar Autorización SS-4'
          : 'Completar Configuración Legal'

      const { data, error } = await resend.emails.send({
        from: 'Open LLC USA <noreply@updates.openllcusa.com>',
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
                                <td style="padding: 8px 0; font-weight: 600;">Servicio</td>
                                <td align="right" style="padding: 8px 0; color: #475569;">${nombreServicio}</td>
                              </tr>
                              ${esReporteAnual && estadoUsa ? `<tr><td style="padding: 8px 0; font-weight: 600;">Estado</td><td align="right" style="padding: 8px 0; color: #475569;">${estadoUsa}</td></tr>` : ''}
                              <tr>
                                <td style="padding: 8px 0; font-weight: 600;">Nº Pedido</td>
                                <td align="right" style="padding: 8px 0; color: #475569; font-family: monospace;">${pedidoDisplay}</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; font-weight: 600;">Total Pagado</td>
                                <td align="right" style="padding: 8px 0; color: #0ea5e9; font-size: 18px; font-weight: 700;">$${montoPagado.toFixed(2)} USD</td>
                              </tr>
                            </table>
                          </div>

                          <!-- Timeline/Pasos -->
                          <h3 style="margin: 30px 0 20px 0; font-size: 18px; color: #1e293b;">🚀 ¿Qué pasa ahora?</h3>
                          <div style="margin-bottom: 30px;">${pasosHtml}</div>

                          <!-- Call to Action -->
                          <div align="center" style="margin: 40px 0;">
                            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/pedidos/${pedidoId}" style="background-color: #0ea5e9; color: #ffffff; padding: 18px 36px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);">${ctaLabel}</a>
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
        from: 'Open LLC USA <noreply@updates.openllcusa.com>',
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
   * Enviar email de impacto inmediato a un nuevo Lead
   */
  static async enviarEmailBienvenidaLead(params: EmailLeadParams) {
    try {
      const { to, nombre, situacion } = params
      const { data, error } = await resend.emails.send({
        from: 'Axel de Open LLC USA <hola@updates.openllcusa.com>',
        to,
        replyTo: 'josemanuel@openllcusa.com',
        subject: `🚀 Hola ${nombre}, aquí tienes tu hoja de ruta para EE.UU.`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px;">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>He recibido tu solicitud. Me alegra mucho ver que estás buscando optimizar tu situación como <strong>${situacion}</strong>.</p>
            
            <p>He empezado a revisar tu perfil para ver cómo podemos ayudarte a eliminar la burocracia y los impuestos innecesarios mediante una estructura legal y segura en Estados Unidos.</p>
            
            <p>Si aún no has terminado de completar los datos de tu diagnóstico, te recomiendo hacerlo ahora desde este enlace:</p>
            <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/quiz" style="color: #0ea5e9; font-weight: bold; text-decoration: underline;">Continuar con mi Diagnóstico Personalizado →</a></p>

            <p>Una vez terminado, podré darte una hoja de ruta exacta para tu caso.</p>

            <p style="margin-top: 30px;">Un saludo,<br><strong>Axel</strong><br>Fundador, Open LLC USA</p>
          </div>
        `
      })
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('❌ Error enviando email de lead:', error)
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
        from: 'Open LLC System <sistema@updates.openllcusa.com>',
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

  /**
   * EMAIL AUTOMATIZADO: TIER 1 - CIERRE (Venta Caliente)
   */
  static async enviarSeguimientoTier1(params: { to: string; nombre: string }) {
    try {
      const { to, nombre } = params
      const { data, error } = await resend.emails.send({
        from: 'Axel de Open LLC USA <hola@updates.openllcusa.com>',
        to,
        replyTo: 'josemanuel@openllcusa.com',
        subject: `Tu estructura en EE.UU. está lista, ${nombre} 🚀`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px;">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>He revisado tu resultado del diagnóstico y tengo buenas noticias: <strong>tu perfil es ideal para operar con una LLC</strong>. En tu situación actual, la optimización fiscal no es solo una opción, sino una necesidad para proteger tu crecimiento.</p>
            
            <p>Como ya tienes cierto volumen, mi consejo es que hablemos 15 minutos. Quiero validar personalmente tu nexo en España y ayudarte a elegir el estado que mejor te encaje.</p>
            
            <p>Puedes elegir el hueco que mejor te venga aquí:</p>
            <p><a href="https://openllcusa.com/contacto" style="color: #0ea5e9; font-weight: bold; text-decoration: underline;">Reservar mi Llamada de Estrategia →</a></p>

            <p>Si prefieres empezar por tu cuenta sin llamada, puedes ver nuestros planes aquí: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/precios">Ver Planes de LLC</a></p>

            <p style="margin-top: 30px;">Un saludo,<br><strong>Axel</strong></p>
          </div>
        `
      })

      if (error) {
        console.error('❌ Error enviando Tier 1 email (Resend):', error)
        return { success: false, error }
      }

      console.log('✅ Email Tier 1 enviado con éxito:', data?.id)
      return { success: true, data }
    } catch (error) {
      console.error('💥 Excepción Tier 1 email:', error)
      return { success: false, error }
    }
  }

  /**
   * EMAIL AUTOMATIZADO: TIER 2 - CONFIANZA (Dudas/Miedo)
   */
  static async enviarSeguimientoTier2(params: { to: string; nombre: string }) {
    try {
      const { to, nombre } = params
      await resend.emails.send({
        from: 'Axel de Open LLC USA <hola@updates.openllcusa.com>',
        to,
        replyTo: 'josemanuel@openllcusa.com',
        subject: `Dudas sobre la LLC en España, ${nombre}?`,
        html: `
          <div style="font-family: sans-serif; color: #1e293b; max-width: 600px;">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Sé que crear una estructura en EE.UU. desde España puede dar respeto. La pregunta que más me hacen es: <em>"¿Es esto legal?"</em>.</p>
            <p>La respuesta corta es <strong>SÍ</strong>, siempre que se haga bien. El 90% de los errores vienen de una mala gestión del nexo o de no presentar los formularios informativos (5472/1120).</p>
            <p>He preparado una guía rápida donde explico cómo operamos nosotros para que duermas tranquilo mientras ahorras impuestos.</p>
            <div align="center" style="margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/blog/guia-legal-espana" style="border: 2px solid #0ea5e9; color: #0ea5e9; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Leer Guía de Seguridad Jurídica →</a>
            </div>
            <p>Cuando estés listo para dar el paso, aquí estaré para ayudarte.</p>
            <p>Un saludo,<br><strong>Axel</strong></p>
          </div>
        `
      })
      return { success: true }
    } catch (error) {
      console.error('Error Tier 2 email:', error)
      return { success: false, error }
    }
  }

  /**
   * EMAIL AUTOMATIZADO: TIER 3 - VALOR (Futuro Cliente)
   */
  static async enviarSeguimientoTier3(params: { to: string; nombre: string }) {
    try {
      const { to, nombre } = params
      await resend.emails.send({
        from: 'Axel de Open LLC USA <hola@updates.openllcusa.com>',
        to,
        subject: `📈 Hoja de ruta para tus primeros 30k€, ${nombre}`,
        html: `
          <div style="font-family: sans-serif; color: #1e293b; max-width: 600px;">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Tras analizar tu diagnóstico, veo que ahora mismo tu prioridad número uno debería ser el <strong>crecimiento</strong>.</p>
            <p>Montar una LLC demasiado pronto puede ser un gasto innecesario si aún no facturas lo suficiente. Mi consejo: céntrate en llegar a los 2.500€/mes.</p>
            <p>Para ayudarte, te envío este recurso sobre cómo escalar servicios digitales y conseguir tus primeros clientes en el mercado USA.</p>
            <p>He guardado tus resultados. Cuando alcances ese hito, escríbeme y montaremos tu estructura para proteger ese crecimiento.</p>
            <p>Un saludo,<br><strong>Axel</strong></p>
          </div>
        `
      })
      return { success: true }
    } catch (error) {
      console.error('Error Tier 3 email:', error)
      return { success: false, error }
    }
  }

  /**
   * EMAIL AUTOMATIZADO: Notificación de Cambio de Estado / Progreso
   */
  static async enviarNotificacionEstado(params: {
    to: string;
    nombreUsuario: string;
    nombreServicio: string;
    pedidoId: string;
    nuevoEstado: string;
    notas?: string;
  }) {
    try {
      const { to, nombreUsuario, nombreServicio, pedidoId, nuevoEstado, notas } = params

      const { data, error } = await resend.emails.send({
        from: 'Axel de Open LLC USA <noreply@updates.openllcusa.com>',
        to,
        replyTo: 'josemanuel@openllcusa.com',
        subject: `Actualización de tu trámite: ${nuevoEstado} 🚀`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px;">
            <p>Hola <strong>${nombreUsuario}</strong>,</p>
            <p>Tenemos novedades sobre tu trámite de <strong>${nombreServicio}</strong> (Pedido #${pedidoId.split('-')[0]}).</p>
            
            <div style="background-color: #f0f9ff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #0ea5e9; font-weight: bold;">Nuevo Estado:</p>
              <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 800; color: #1e293b;">${nuevoEstado}</p>
              ${notas ? `<p style="margin: 12px 0 0 0; font-size: 14px; color: #475569; font-style: italic;">"${notas}"</p>` : ''}
            </div>

            <p>Ya puedes entrar en tu panel para ver los detalles y descargar cualquier documento nuevo si está disponible.</p>

            <div align="center" style="margin: 32px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/pedidos/${pedidoId}" style="background-color: #0ea5e9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Ir a mi Dashboard →</a>
            </div>

            <p style="margin-top: 30px;">Seguimos avanzando,<br><strong>Axel</strong><br>Open LLC USA</p>
          </div>
        `
      })

      if (error) {
        console.error('❌ Error Resend enviando actualización de estado:', error)
        return { success: false, error }
      }
      return { success: true, data }
    } catch (error) {
      console.error('❌ Error enviando email de actualización de estado:', error)
      return { success: false, error }
    }
  }

  /**
   * Enviar borrador de formularios fiscales (5472 + 1120) al cliente con PDF adjunto
   */
  static async enviarBorradorFiscal(params: {
    to: string
    nombreUsuario: string
    pedidoId: string
    numeroPedido: string
    taxYear: string
    llcName: string
    pdfBytes: Uint8Array
    notasAdmin?: string
  }) {
    try {
      const { to, nombreUsuario, pedidoId, numeroPedido, taxYear, llcName, pdfBytes, notasAdmin } = params

      const fileName = `Borrador_Form5472_1120_${taxYear}_${llcName.replace(/\s+/g, '_')}.pdf`
      const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/pedidos/${pedidoId}`

      const { data, error } = await resend.emails.send({
        from: 'Axel de Open LLC USA <axel@updates.openllcusa.com>',
        to,
        replyTo: 'axel@openllcusa.com',
        subject: `📄 Borrador listo para revisar: Form 5472 + 1120 (${taxYear}) — ${llcName}`,
        attachments: [
          {
            filename: fileName,
            content: Buffer.from(pdfBytes).toString('base64'),
          },
        ],
        html: `
          <!DOCTYPE html>
          <html lang="es">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Borrador Formularios Fiscales - Open LLC USA</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f0f4f8; color: #1a202c;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                <tr>
                  <td align="center" style="padding: 40px 16px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.08);">

                      <!-- HEADER GRADIENTE -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 60%, #0ea5e9 100%); padding: 0;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 40px 40px 20px 40px;">
                                <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; letter-spacing: 3px; color: #93c5fd; text-transform: uppercase;">Open LLC USA</p>
                                <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; line-height: 1.2; letter-spacing: -0.5px;">
                                  Tus formularios fiscales están<br>listos para revisar
                                </h1>
                                <p style="margin: 12px 0 0 0; font-size: 15px; color: #bfdbfe; line-height: 1.5;">
                                  Hemos preparado el borrador del <strong style="color: #ffffff;">Form 5472 + 1120</strong> para el año fiscal <strong style="color: #ffffff;">${taxYear}</strong>.
                                </p>
                              </td>
                            </tr>
                            <!-- BADGE PDF ADJUNTO -->
                            <tr>
                              <td style="padding: 0 40px 32px 40px;">
                                <div style="display: inline-block; background-color: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 50px; padding: 8px 18px; margin-top: 12px;">
                                  <span style="font-size: 13px; color: #ffffff; font-weight: 700;">📎 PDF adjunto a este email</span>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- CUERPO PRINCIPAL -->
                      <tr>
                        <td style="padding: 40px;">

                          <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.7; color: #374151;">
                            Hola <strong>${nombreUsuario}</strong>, 👋 adjunto a este email encontrarás el borrador de tus declaraciones informativas ante el IRS. Por favor, revísalos con atención antes de que procedamos a su presentación oficial.
                          </p>

                          <!-- RESUMEN DEL TRÁMITE -->
                          <div style="background: linear-gradient(135deg, #eff6ff, #f0f9ff); border: 1px solid #bfdbfe; border-radius: 14px; padding: 24px; margin-bottom: 28px;">
                            <p style="margin: 0 0 16px 0; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #2563eb;">📋 Resumen del trámite</p>
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding: 8px 0; border-bottom: 1px solid #dbeafe;">
                                  <span style="font-size: 13px; color: #6b7280; font-weight: 500;">LLC / Entidad:</span>
                                </td>
                                <td align="right" style="padding: 8px 0; border-bottom: 1px solid #dbeafe;">
                                  <span style="font-size: 13px; color: #1e40af; font-weight: 700;">${llcName}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; border-bottom: 1px solid #dbeafe;">
                                  <span style="font-size: 13px; color: #6b7280; font-weight: 500;">Año Fiscal:</span>
                                </td>
                                <td align="right" style="padding: 8px 0; border-bottom: 1px solid #dbeafe;">
                                  <span style="font-size: 13px; color: #1e40af; font-weight: 700;">${taxYear}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; border-bottom: 1px solid #dbeafe;">
                                  <span style="font-size: 13px; color: #6b7280; font-weight: 500;">Formularios:</span>
                                </td>
                                <td align="right" style="padding: 8px 0; border-bottom: 1px solid #dbeafe;">
                                  <span style="font-size: 13px; color: #1e40af; font-weight: 700;">Form 5472 + Form 1120</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0;">
                                  <span style="font-size: 13px; color: #6b7280; font-weight: 500;">Nº Pedido:</span>
                                </td>
                                <td align="right" style="padding: 8px 0;">
                                  <span style="font-size: 12px; color: #9ca3af; font-family: monospace; font-weight: 600;">#${numeroPedido}</span>
                                </td>
                              </tr>
                            </table>
                          </div>

                          ${notasAdmin ? `
                          <!-- NOTAS DEL EQUIPO -->
                          <div style="background-color: #fefce8; border: 1px solid #fde68a; border-radius: 14px; padding: 20px; margin-bottom: 28px;">
                            <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #92400e;">💬 Nota de tu gestor</p>
                            <p style="margin: 0; font-size: 14px; color: #78350f; line-height: 1.6; font-style: italic;">"${notasAdmin}"</p>
                          </div>
                          ` : ''}

                          <!-- INSTRUCCIONES -->
                          <div style="margin-bottom: 32px;">
                            <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 700; color: #111827;">¿Qué debes hacer ahora?</p>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                              
                              <div style="display: flex; align-items: flex-start; gap: 16px; padding: 14px; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
                                <div style="min-width: 32px; height: 32px; background: linear-gradient(135deg, #2563eb, #3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; text-align: center; padding-top: 6px;">
                                  <span style="color: #fff; font-weight: 800; font-size: 14px; line-height: 1;">1</span>
                                </div>
                                <div>
                                  <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #111827;">Revisa el PDF adjunto</p>
                                  <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5;">Verifica que todos los datos de tu LLC, las transacciones reportadas y la información del propietario son correctos.</p>
                                </div>
                              </div>

                              <div style="display: flex; align-items: flex-start; gap: 16px; padding: 14px; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
                                <div style="min-width: 32px; height: 32px; background: linear-gradient(135deg, #2563eb, #3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; text-align: center; padding-top: 6px;">
                                  <span style="color: #fff; font-weight: 800; font-size: 14px; line-height: 1;">2</span>
                                </div>
                                <div>
                                  <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #111827;">Confirma o comunícanos cualquier corrección</p>
                                  <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5;">Si todo es correcto, respondenos a este email con tu confirmación. Si ves algún dato incorrecto, indícanos qué debe cambiarse.</p>
                                </div>
                              </div>

                              <div style="display: flex; align-items: flex-start; gap: 16px; padding: 14px; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
                                <div style="min-width: 32px; height: 32px; background: linear-gradient(135deg, #2563eb, #3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; text-align: center; padding-top: 6px;">
                                  <span style="color: #fff; font-weight: 800; font-size: 14px; line-height: 1;">3</span>
                                </div>
                                <div>
                                  <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #111827;">Presentación ante el IRS</p>
                                  <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5;">Una vez recibida tu confirmación, procederemos a la presentación oficial. Te enviaremos el acuse de recibo del IRS en cuanto lo tengamos.</p>
                                </div>
                              </div>

                            </div>
                          </div>

                          <!-- CTA BUTTON -->
                          <div align="center" style="margin: 36px 0;">
                            <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af, #3b82f6); color: #ffffff; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 15px; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35); letter-spacing: 0.3px;">
                              Ver mi expediente en el Dashboard →
                            </a>
                          </div>

                          <!-- DISCLAIMER BORRADOR -->
                          <div style="background-color: #fafafa; border: 1px dashed #d1d5db; border-radius: 12px; padding: 18px; margin-top: 8px;">
                            <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.7; text-align: center;">
                              ⚠️ <strong style="color: #6b7280;">Este es un borrador para revisión.</strong> Los formularios adjuntos <strong>NO han sido presentados ante el IRS</strong> todavía. La presentación oficial se realizará exclusivamente tras tu aprobación expresa. Si tienes cualquier duda, responde a este email o escríbenos a <a href="mailto:josemanuel@openllcusa.com" style="color: #3b82f6; text-decoration: none;">josemanuel@openllcusa.com</a>.
                            </p>
                          </div>

                        </td>
                      </tr>

                      <!-- FOOTER -->
                      <tr>
                        <td style="background-color: #f8fafc; padding: 28px 40px; border-top: 1px solid #e2e8f0;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td>
                                <p style="margin: 0; font-size: 14px; color: #374151; font-weight: 700;">Open LLC USA</p>
                                <p style="margin: 4px 0 0 0; font-size: 12px; color: #9ca3af;">Tu estructura en EE.UU., gestionada con precisión.</p>
                              </td>
                              <td align="right">
                                <p style="margin: 0; font-size: 11px; color: #cbd5e1;">Deadline: April 15, ${taxYear}</p>
                              </td>
                            </tr>
                          </table>
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
        console.error('❌ Error enviando borrador fiscal:', error)
        return { success: false, error }
      }

      console.log('✅ Borrador fiscal enviado:', data?.id)
      return { success: true, data }
    } catch (error) {
      console.error('💥 Excepción enviando borrador fiscal:', error)
      return { success: false, error }
    }
  }

  /**
   * Notificación genérica para el equipo admin
   */
  static async enviarNotificacionAdmin(params: { subject: string; html: string }) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'josemanuel@openllcusa.com'
      const { data, error } = await resend.emails.send({
        from: 'Open LLC System <sistema@updates.openllcusa.com>',
        to: adminEmail,
        subject: params.subject,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
            <h2 style="color: #1e293b;">Notificación Administrativa</h2>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 20px 0;">
              ${params.html}
            </div>
            <p style="font-size: 11px; color: #94a3b8; text-align: center;">Este es un aviso automático de Open LLC USA Control Panel.</p>
          </div>
        `
      })
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('❌ Error enviando notificación admin:', error)
      return { success: false, error }
    }
  }
}
