import { Resend } from 'resend';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
    console.log('Testing Resend with API Key:', process.env.RESEND_API_KEY?.substring(0, 8) + '...');

    try {
        const { data, error } = await resend.emails.send({
            from: 'Axel de Open LLC USA <noreply@updates.openllcusa.com>',
            to: 'diegohdzoficial@gmail.com', // random email to test or I can use mine
            subject: 'Test email',
            html: '<p>Hi</p>'
        });

        if (error) {
            console.error('Resend error:', error);
        } else {
            console.log('Resend success:', data);
        }
    } catch (err) {
        console.error('Exception:', err);
    }
}

testEmail();
