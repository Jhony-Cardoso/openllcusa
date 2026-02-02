# Script para reiniciar el servidor de desarrollo
# Ejecuta este script cuando hagas cambios en middleware.ts o .env.local

Write-Host "🔄 Reiniciando servidor de desarrollo..." -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Primero detén el servidor actual (Ctrl+C en la terminal donde corre)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Presiona Enter cuando hayas detenido el servidor..." -ForegroundColor Yellow
Read-Host

Write-Host "🧹 Limpiando caché de Next.js..." -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ Caché eliminada" -ForegroundColor Green
}
else {
    Write-Host "ℹ️  No hay caché para limpiar" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🚀 Iniciando servidor..." -ForegroundColor Cyan
npm run dev
