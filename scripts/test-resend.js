const { Resend } = require('resend');

const resend = new Resend('re_ZjWNjoSN_H9SjSJQ7Pd1SjUxd5Dwsne6C');

async function testEmail() {
    try {
        const data = await resend.emails.send({
            from: 'Open LLC USA <noreply@updates.openllcusa.com>',
            to: 'jrmasol@gmail.com',
            subject: 'Test Email Resend Diagnostics',
            html: '<p>If you receive this, Resend is working successfully.</p>'
        });
        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

testEmail();
