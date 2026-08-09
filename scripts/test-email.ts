import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(process.cwd(), '.env.local') });

import { EmailService } from '../lib/services/email.service';

async function testEmail() {
  console.log('Sending test email...');
  const res = await EmailService.enviarGuiaGratis({
    to: 'hola@openllcusa.com', // using their own email as test destination
    nombre: 'Test User'
  });
  console.log('Result:', res);
}

testEmail().catch(console.error);
