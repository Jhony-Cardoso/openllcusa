import crypto from 'crypto';

// 1. Generar un JWT Secret aleatorio y ultra seguro (min 32 caracteres)
const jwtSecret = crypto.randomBytes(32).toString('hex');

// Función helper para codificar en Base64Url
function base64url(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// 2. Crear las cabeceras comunes
const header = { alg: 'HS256', typ: 'JWT' };
const encodedHeader = base64url(JSON.stringify(header));

// Tiempos: Emitido ahora, expira en 10 años
const iat = Math.floor(Date.now() / 1000);
const exp = iat + (10 * 365 * 24 * 60 * 60);

// 3. Crear el payload de la clave ANON
const anonPayload = { role: 'anon', iss: 'supabase', iat, exp };
const encodedAnonPayload = base64url(JSON.stringify(anonPayload));

// 4. Crear el payload de la clave SERVICE_ROLE
const servicePayload = { role: 'service_role', iss: 'supabase', iat, exp };
const encodedServicePayload = base64url(JSON.stringify(servicePayload));

// 5. Función para firmar con HMAC-SHA256
function sign(encodedHeader, encodedPayload, secret) {
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${data}.${signature}`;
}

const anonKey = sign(encodedHeader, encodedAnonPayload, jwtSecret);
const serviceRoleKey = sign(encodedHeader, encodedServicePayload, jwtSecret);

console.log('\n========================================================');
console.log('✅ NUEVAS CLAVES GENERADAS CON ÉXITO Y DE FORMA SEGURA');
console.log('========================================================\n');
console.log('1️⃣ Para poner en las VARIABLES DE ENTORNO de DOKPLOY (en la config de Supabase):\n');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`ANON_KEY=${anonKey}`);
console.log(`SERVICE_ROLE_KEY=${serviceRoleKey}`);
console.log('\n---\n');
console.log('2️⃣ Para poner en el archivo .env.local de tu nuevo proyecto (Next.js):\n');
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`);
console.log(`SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`);
console.log('========================================================\n');
