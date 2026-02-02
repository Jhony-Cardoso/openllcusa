# Script para actualizar automáticamente la configuración de Clerk con la URL de ngrok
# Este script ejecuta el script Node.js que actualiza Clerk mediante su API

Write-Host "🔧 Actualizando configuración de Clerk para ngrok..." -ForegroundColor Cyan
Write-Host ""

# Verificar que ngrok está corriendo
Write-Host "📡 Verificando que ngrok está corriendo..." -ForegroundColor Yellow

try {
  $ngrokResponse = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -Method Get -ErrorAction Stop
  $ngrokUrl = $ngrokResponse.tunnels[0].public_url
    
  if (-not $ngrokUrl) {
    Write-Host "❌ Error: No se pudo obtener la URL de ngrok" -ForegroundColor Red
    Write-Host "   Asegúrate de que ngrok está corriendo con: ngrok http 3000" -ForegroundColor Yellow
    exit 1
  }
    
  Write-Host "✅ ngrok está corriendo: $ngrokUrl" -ForegroundColor Green
  Write-Host ""
}
catch {
  Write-Host "❌ Error: ngrok no está corriendo" -ForegroundColor Red
  Write-Host "   Inicia ngrok con: ngrok http 3000" -ForegroundColor Yellow
  Write-Host "   O si ya está corriendo, verifica que el puerto 4040 esté disponible" -ForegroundColor Yellow
  exit 1
}

# Ejecutar el script Node.js
Write-Host "🚀 Ejecutando actualización automática..." -ForegroundColor Yellow
Write-Host ""

try {
  node .\scripts\update-clerk-api.mjs
    
  if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "✅ Proceso completado" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Próximos pasos:" -ForegroundColor Cyan
    Write-Host "   1. Reinicia el servidor de desarrollo (npm run dev)" -ForegroundColor White
    Write-Host "   2. Accede desde tu móvil a: $ngrokUrl" -ForegroundColor White
    Write-Host "   3. Si aún ves errores 404, verifica manualmente en:" -ForegroundColor White
    Write-Host "      https://dashboard.clerk.com → Configure → Domains" -ForegroundColor Blue
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
  }
}
catch {
  Write-Host "❌ Error al ejecutar el script Node.js" -ForegroundColor Red
  Write-Host "   Error: $_" -ForegroundColor Yellow
  Write-Host ""
  Write-Host "💡 Actualiza manualmente en:" -ForegroundColor Cyan
  Write-Host "   https://dashboard.clerk.com → Configure → Domains" -ForegroundColor White
  Write-Host "   Agrega a 'Allowed origins': $ngrokUrl" -ForegroundColor White
  exit 1
}
