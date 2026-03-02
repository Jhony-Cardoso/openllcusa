import { Resend } from 'resend'

console.log('Sending with API Key length:', process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0);
const resend = new Resend('re_ZjWNjoSN_H9SjSJQ7Pd1SjUxd5Dwsne6C') // using the key directly for testing

async function run() {
    try {
        console.log('Enviando email de prueba...')
        const { data, error } = await resend.emails.send({
            from: 'Axel de Open LLC USA <noreply@updates.openllcusa.com>',
            to: 'josemanuelguerranunez5@gmail.com', // El email del admin/usuario
            subject: 'Prueba de Resend',
            html: '<p>Este es un mensaje de prueba para ver si el API funciona correctamente.</p>'
        })

        if (error) {
            console.error('Error enviando:', error)
        } else {
            console.log('Enviado correctamente:', data)
        }
    } catch (err) {
        console.error('Excepcion enviando:', err)
    }
}

run()
