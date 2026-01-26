import jwt from 'jsonwebtoken';

const JWT_SECRET = 'v2ppnsafyflhhwrshsr4cyroq8mu1qb6';

// Generar ANON_KEY
const anonPayload = {
    iss: 'supabase',
    ref: 'open-llc-usa-supabase-6c3b04-89-117-53-55',
    role: 'anon',
    iat: 1737463711,
    exp: 2053039711
};

const anonKey = jwt.sign(anonPayload, JWT_SECRET, { algorithm: 'HS256' });

// Generar SERVICE_ROLE_KEY
const servicePayload = {
    iss: 'supabase',
    ref: 'open-llc-usa-supabase-6c3b04-89-117-53-55',
    role: 'service_role',
    iat: 1737463711,
    exp: 2053039711
};

const serviceRoleKey = jwt.sign(servicePayload, JWT_SECRET, { algorithm: 'HS256' });

console.log('=== CLAVES GENERADAS ===\n');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=' + anonKey);
console.log('');
console.log('SUPABASE_SERVICE_ROLE_KEY=' + serviceRoleKey);
