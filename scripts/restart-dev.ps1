# Script para reiniciar el servidor de desarrollo (Windows-friendly)
# Ejecuta este script cuando hagas cambios en middleware.ts o .env.local

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "[RESTART] Reiniciando servidor de desarrollo..." -ForegroundColor Cyan
Write-Host ""
Write-Host "[IMPORTANTE] Primero detén el servidor actual (Ctrl+C en la terminal donde corre)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Presiona Enter cuando hayas detenido el servidor..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "[CLEAN] Limpiando caché de Next.js..." -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
    Write-Host "[OK] Caché eliminada" -ForegroundColor Green
}
else {
    Write-Host "[INFO] No hay caché para limpiar" -ForegroundColor Gray
}

Write-Host ""
Write-Host "[START] Iniciando servidor con 'npm run dev'..." -ForegroundColor Cyan
npm run dev
