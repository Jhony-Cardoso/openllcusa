const { Resend } = require('resend');

const resend = new Resend('re_ZjWNjoSN_H9SjSJQ7Pd1SjUxd5Dwsne6C');

async function testEmail() {
    try {
        console.log('Sending deliverability test email...');
        const data = await resend.emails.send({
            from: 'Jose de Open LLC USA <hola@updates.openllcusa.com>',
            to: 'jrmasol@gmail.com',
            reply_to: 'josemanuel@openllcusa.com',
            subject: 'Tu estructura en EE.UU. está lista 🚀 (Deliverability Test)',
            html: `
              <div style="font-family: sans-serif; color: #1e293b; max-width: 600px;">
                <h2 style="color: #0ea5e9;">¡Felicidades por tu resultado! 🚀</h2>
                <p>Hola <strong>Juan de Prueba</strong>,</p>
                <p>Tu diagnóstico indica que eres el perfil ideal para una LLC. En tu situación, la optimización fiscal y la protección de activos no son un lujo, sino una necesidad para dejar de perder dinero cada mes.</p>
                <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; border: 1px solid #bae6fd;">
                  <h3 style="margin-top:0;">Próximo paso recomendado:</h3>
                  <p>Dado tu volumen y tipo de negocio, te sugiero que hablemos 15 minutos para validar tu nexo en España y elegir el estado (Delaware vs Wyoming) que más te conviene.</p>
                  <div align="center">
                    <a href="https://openllcusa.com/contacto" style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Agendar Llamada Estratégica Gratis →</a>
                  </div>
                </div>
                <p style="margin-top: 25px;">Si prefieres empezar ya mismo sin llamada, puedes ver nuestros planes aquí: <a href="https://openllcusa.com/precios">Ver Planes de LLC</a></p>
                <p>Un saludo,<br><strong>Jose Manuel</strong></p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                <p style="font-size: 11px; color: #94a3b8; text-align: center;">Open LLC USA - 2000 PSt, Washington, DC.<br>Hacemos el test DMARC para asegurar bandeja de entrada.</p>
              </div>
            `
        });
        console.log('Result:', data);
    } catch (error) {
        console.error('Error Details:', error);
    }
}

testEmail();
