# Script para instalar Stripe CLI manualmente en Windows
# Ejecuta: .\scripts\install-stripe-cli.ps1

Write-Host "🔧 Instalador de Stripe CLI para Windows" -ForegroundColor Cyan
Write-Host ""

# Definir rutas
$stripeDir = "C:\stripe-cli"
$stripeBinPath = "$stripeDir\stripe.exe"
$downloadUrl = "https://github.com/stripe/stripe-cli/releases/download/v1.21.8/stripe_1.21.8_windows_x86_64.zip"
$zipPath = "$env:TEMP\stripe-cli.zip"

# Verificar si ya está instalado
$stripeInstalled = Get-Command stripe -ErrorAction SilentlyContinue

if ($stripeInstalled) {
    Write-Host "✅ Stripe CLI ya está instalado" -ForegroundColor Green
    Write-Host ""
    stripe --version
    Write-Host ""
    Write-Host "Si quieres reinstalar, desinstala primero o elimina la carpeta $stripeDir" -ForegroundColor Yellow
    exit 0
}

Write-Host "📥 Descargando Stripe CLI..." -ForegroundColor Yellow

try {
    # Descargar el ZIP
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath -UseBasicParsing
    Write-Host "✅ Descarga completada" -ForegroundColor Green
    Write-Host ""

    # Crear directorio si no existe
    if (-not (Test-Path $stripeDir)) {
        New-Item -ItemType Directory -Path $stripeDir -Force | Out-Null
    }

    # Extraer el ZIP
    Write-Host "📦 Extrayendo archivos..." -ForegroundColor Yellow
    Expand-Archive -Path $zipPath -DestinationPath $stripeDir -Force
    Write-Host "✅ Archivos extraídos a $stripeDir" -ForegroundColor Green
    Write-Host ""

    # Verificar que el ejecutable existe
    if (-not (Test-Path $stripeBinPath)) {
        Write-Host "❌ Error: No se encontró stripe.exe en $stripeDir" -ForegroundColor Red
        exit 1
    }

    # Agregar al PATH del usuario
    Write-Host "🔧 Agregando al PATH del usuario..." -ForegroundColor Yellow
    
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    
    if ($userPath -notlike "*$stripeDir*") {
        $newPath = "$userPath;$stripeDir"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        Write-Host "✅ Agregado al PATH" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Ya estaba en el PATH" -ForegroundColor Cyan
    }

    # Actualizar PATH en la sesión actual
    $env:Path = "$env:Path;$stripeDir"

    Write-Host ""
    Write-Host "✅ ¡Stripe CLI instalado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Cierra y vuelve a abrir PowerShell (para que el PATH se actualice)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "2. Verifica la instalación:" -ForegroundColor Yellow
    Write-Host "   stripe --version" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Autentícate con Stripe:" -ForegroundColor Yellow
    Write-Host "   stripe login" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Inicia el webhook listener:" -ForegroundColor Yellow
    Write-Host "   stripe listen --forward-to localhost:3000/api/stripe/webhook" -ForegroundColor Gray
    Write-Host ""

    # Limpiar archivo temporal
    Remove-Item $zipPath -Force -ErrorAction SilentlyContinue

} catch {
    Write-Host "❌ Error durante la instalación: $_" -ForegroundColor Red
    exit 1
}
