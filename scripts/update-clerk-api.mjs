#!/usr/bin/env node

/**
 * Script para actualizar automáticamente Clerk con la URL de ngrok
 * Este script se ejecuta automáticamente cuando cambias de URL de ngrok
 */

import fs from 'fs';
import path from 'path';

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function getNgrokUrl() {
  try {
    const response = await fetch('http://localhost:4040/api/tunnels');
    const data = await response.json();

    if (!data.tunnels || data.tunnels.length === 0) {
      throw new Error('No se encontraron túneles activos');
    }

    return data.tunnels[0].public_url;
  } catch (error) {
    throw new Error(`Error al obtener URL de ngrok: ${error.message}`);
  }
}

function getClerkSecretKey() {
  const envPath = path.join(process.cwd(), '.env.local');

  if (!fs.existsSync(envPath)) {
    throw new Error('No se encontró el archivo .env.local');
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/CLERK_SECRET_KEY=(.+)/);

  if (!match) {
    throw new Error('No se encontró CLERK_SECRET_KEY en .env.local');
  }

  return match[1].trim();
}

function updateEnvFile(ngrokUrl) {
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = fs.readFileSync(envPath, 'utf-8');

  // Actualizar NEXT_PUBLIC_BASE_URL
  const baseUrlRegex = /NEXT_PUBLIC_BASE_URL=https:\/\/[^\s]+\.ngrok-free\.dev/;

  if (baseUrlRegex.test(envContent)) {
    envContent = envContent.replace(baseUrlRegex, `NEXT_PUBLIC_BASE_URL=${ngrokUrl}`);
    fs.writeFileSync(envPath, envContent);
    log('✅ .env.local actualizado con la nueva URL de ngrok', 'green');
  } else {
    log('⚠️  No se encontró NEXT_PUBLIC_BASE_URL con ngrok en .env.local', 'yellow');
  }
}

async function updateClerkAllowedOrigins(ngrokUrl, clerkSecretKey) {
  try {
    log('\n🔧 Actualizando configuración de Clerk...', 'cyan');

    // Obtener configuración actual
    const getResponse = await fetch('https://api.clerk.com/v1/instance', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${clerkSecretKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!getResponse.ok) {
      const error = await getResponse.text();
      throw new Error(`Error al obtener configuración: ${error}`);
    }

    const currentConfig = await getResponse.json();
    log('✅ Configuración actual obtenida', 'green');

    // Agregar ngrok URL a allowed_origins
    const allowedOrigins = currentConfig.allowed_origins || [];

    if (!allowedOrigins.includes(ngrokUrl)) {
      allowedOrigins.push(ngrokUrl);

      // Actualizar configuración
      const updateResponse = await fetch('https://api.clerk.com/v1/instance', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${clerkSecretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          allowed_origins: allowedOrigins
        })
      });

      if (!updateResponse.ok) {
        const error = await updateResponse.text();
        throw new Error(`Error al actualizar configuración: ${error}`);
      }

      log('✅ URL de ngrok agregada a Clerk allowed_origins', 'green');
      log(`📋 Allowed origins: ${allowedOrigins.join(', ')}`, 'blue');
    } else {
      log('ℹ️  La URL de ngrok ya está en allowed_origins', 'cyan');
    }

    return true;
  } catch (error) {
    log(`❌ Error al actualizar Clerk: ${error.message}`, 'red');
    log('\n💡 Actualiza manualmente en: https://dashboard.clerk.com', 'yellow');
    log('   Configure → Domains → Allowed origins', 'yellow');
    return false;
  }
}

async function main() {
  try {
    log('\n🚀 Iniciando actualización de Clerk con ngrok...', 'bright');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

    // 1. Obtener URL de ngrok
    log('📡 Obteniendo URL de ngrok...', 'yellow');
    const ngrokUrl = await getNgrokUrl();
    log(`✅ URL obtenida: ${ngrokUrl}`, 'green');

    // 2. Obtener clave de Clerk
    log('\n🔑 Leyendo clave de Clerk...', 'yellow');
    const clerkSecretKey = getClerkSecretKey();
    log('✅ Clave de Clerk encontrada', 'green');

    // 3. Actualizar .env.local
    log('\n📝 Actualizando .env.local...', 'yellow');
    updateEnvFile(ngrokUrl);

    // 4. Actualizar Clerk
    const success = await updateClerkAllowedOrigins(ngrokUrl, clerkSecretKey);

    // 5. Resultado final
    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');

    if (success) {
      log('✅ Configuración completada exitosamente', 'green');
      log(`\n📱 Ahora puedes probar tu aplicación en el móvil:`, 'cyan');
      log(`   ${ngrokUrl}`, 'bright');
    } else {
      log('⚠️  Configuración parcialmente completada', 'yellow');
      log('   Por favor, actualiza Clerk manualmente', 'yellow');
    }

    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    log('\n💡 Asegúrate de que:', 'yellow');
    log('   1. ngrok está corriendo (ngrok http 3000)', 'yellow');
    log('   2. El archivo .env.local existe y tiene CLERK_SECRET_KEY', 'yellow');
    process.exit(1);
  }
}

main();
