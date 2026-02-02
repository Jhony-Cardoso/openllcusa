# Script para configurar Stripe CLI y webhooks locales
# Ejecuta: .\scripts\setup-stripe-webhooks.ps1

Write-Host "🔧 Configurando Stripe Webhooks para Desarrollo Local" -ForegroundColor Cyan
Write-Host ""

# Verificar si Stripe CLI está instalado
$stripeInstalled = Get-Command stripe -ErrorAction SilentlyContinue

if (-not $stripeInstalled) {
    Write-Host "❌ Stripe CLI no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Opciones de instalación:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opción 1: Usar Scoop (recomendado)" -ForegroundColor Green
    Write-Host "  scoop install stripe" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Opción 2: Descargar manualmente" -ForegroundColor Green
    Write-Host "  https://github.com/stripe/stripe-cli/releases/latest" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Después de instalar, ejecuta este script nuevamente." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Stripe CLI está instalado" -ForegroundColor Green
Write-Host ""

# Verificar si está autenticado
Write-Host "🔐 Verificando autenticación..." -ForegroundColor Cyan
$authStatus = stripe config --list 2>&1

if ($authStatus -match "not logged in" -or $authStatus -match "No API key") {
    Write-Host "❌ No estás autenticado en Stripe" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, ejecuta:" -ForegroundColor Yellow
    Write-Host "  stripe login" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Esto abrirá tu navegador para autorizar la CLI." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Autenticado correctamente" -ForegroundColor Green
Write-Host ""

# Mostrar instrucciones
Write-Host "📋 Instrucciones:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Abre una nueva terminal y ejecuta:" -ForegroundColor Yellow
Write-Host "   stripe listen --forward-to localhost:3000/api/stripe/webhook" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Copia el 'webhook signing secret' que aparece (whsec_...)" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Agrégalo a tu archivo .env.local:" -ForegroundColor Yellow
Write-Host "   STRIPE_WEBHOOK_SECRET=whsec_TU_SECRET_AQUI" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Reinicia tu servidor de Next.js:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Para probar, en otra terminal ejecuta:" -ForegroundColor Yellow
Write-Host "   stripe trigger checkout.session.completed" -ForegroundColor Gray
Write-Host ""

# Preguntar si quiere iniciar el listener ahora
Write-Host "¿Quieres iniciar el webhook listener ahora? (s/n): " -ForegroundColor Cyan -NoNewline
$response = Read-Host

if ($response -eq "s" -or $response -eq "S") {
    Write-Host ""
    Write-Host "🚀 Iniciando webhook listener..." -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: Copia el 'webhook signing secret' y agrégalo a .env.local" -ForegroundColor Yellow
    Write-Host ""
    
    # Iniciar el listener
    stripe listen --forward-to localhost:3000/api/stripe/webhook
} else {
    Write-Host ""
    Write-Host "✅ Configuración lista. Ejecuta el comando manualmente cuando estés listo." -ForegroundColor Green
}
