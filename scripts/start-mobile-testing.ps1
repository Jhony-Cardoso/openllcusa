# 🚀 Script para Iniciar Pruebas Móviles
# Este script automatiza el proceso de configuración de ngrok

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     🚀 Configuración de Pruebas Móviles con ngrok        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar si ngrok está instalado
Write-Host "🔍 Verificando si ngrok está instalado..." -ForegroundColor Yellow

if (-not (Get-Command ngrok -ErrorAction SilentlyContinue)) {
    Write-Host "❌ ngrok no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Instalando ngrok globalmente..." -ForegroundColor Yellow
    npm install -g ngrok
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar ngrok" -ForegroundColor Red
        Write-Host "Por favor, instálalo manualmente desde: https://ngrok.com/download" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✅ ngrok instalado correctamente" -ForegroundColor Green
}
else {
    Write-Host "✅ ngrok ya está instalado" -ForegroundColor Green
}

Write-Host ""

# Verificar si ngrok está autenticado
Write-Host "🔐 Verificando autenticación de ngrok..." -ForegroundColor Yellow

$ngrokConfig = "$env:USERPROFILE\.ngrok2\ngrok.yml"
if (-not (Test-Path $ngrokConfig)) {
    Write-Host "⚠️  ngrok no está autenticado" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para autenticar ngrok:" -ForegroundColor Cyan
    Write-Host "1. Ve a: https://dashboard.ngrok.com/get-started/your-authtoken" -ForegroundColor White
    Write-Host "2. Copia tu authtoken" -ForegroundColor White
    Write-Host "3. Ejecuta: ngrok config add-authtoken TU_AUTHTOKEN" -ForegroundColor White
    Write-Host ""
    
    $response = Read-Host "¿Quieres abrir la página de ngrok ahora? (s/n)"
    if ($response -eq "s" -or $response -eq "S") {
        Start-Process "https://dashboard.ngrok.com/get-started/your-authtoken"
    }
    
    Write-Host ""
    Write-Host "Ejecuta este script nuevamente después de autenticar ngrok." -ForegroundColor Yellow
    exit 0
}

Write-Host "✅ ngrok está autenticado" -ForegroundColor Green
Write-Host ""

# Verificar si Next.js está corriendo
Write-Host "🔍 Verificando si Next.js está corriendo en el puerto 3000..." -ForegroundColor Yellow

$port3000InUse = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

if (-not $port3000InUse) {
    Write-Host "⚠️  Next.js no está corriendo en el puerto 3000" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Por favor, inicia tu aplicación primero:" -ForegroundColor Cyan
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    exit 0
}

Write-Host "✅ Next.js está corriendo en el puerto 3000" -ForegroundColor Green
Write-Host ""

# Iniciar ngrok
Write-Host "🌐 Iniciando ngrok..." -ForegroundColor Yellow
Write-Host ""

# Iniciar ngrok en una nueva ventana de PowerShell
$ngrokProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "ngrok http 3000" -PassThru

# Esperar a que ngrok inicie
Start-Sleep -Seconds 3

# Intentar obtener la URL de ngrok desde la API local
try {
    $ngrokApi = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -ErrorAction Stop
    $publicUrl = $ngrokApi.tunnels[0].public_url
    
    Write-Host "✅ ngrok iniciado correctamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                    🎉 ¡TODO LISTO!                        ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Tu URL pública es:" -ForegroundColor Cyan
    Write-Host "   $publicUrl" -ForegroundColor White -BackgroundColor DarkGreen
    Write-Host ""
    
    # Copiar al portapapeles
    Set-Clipboard -Value $publicUrl
    Write-Host "✅ URL copiada al portapapeles" -ForegroundColor Green
    Write-Host ""
    
    # Extraer el dominio (sin https://)
    $domain = $publicUrl -replace "https://", ""
    
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
    Write-Host "║              📋 PRÓXIMOS PASOS IMPORTANTES                ║" -ForegroundColor Yellow
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1️⃣  Configurar Clerk:" -ForegroundColor Cyan
    Write-Host "   • Ve a: https://dashboard.clerk.com" -ForegroundColor White
    Write-Host "   • Selecciona tu aplicación" -ForegroundColor White
    Write-Host "   • Ve a Configure → Domains" -ForegroundColor White
    Write-Host "   • Agrega este dominio: $domain" -ForegroundColor Green
    Write-Host "   • Marca como 'Development'" -ForegroundColor White
    Write-Host ""
    
    Write-Host "2️⃣  Actualizar .env.local:" -ForegroundColor Cyan
    Write-Host "   • Abre: .env.local" -ForegroundColor White
    Write-Host "   • Cambia NEXT_PUBLIC_BASE_URL a:" -ForegroundColor White
    Write-Host "     NEXT_PUBLIC_BASE_URL=$publicUrl" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "3️⃣  Reiniciar Next.js:" -ForegroundColor Cyan
    Write-Host "   • Presiona Ctrl+C en la terminal de Next.js" -ForegroundColor White
    Write-Host "   • Ejecuta: npm run dev" -ForegroundColor White
    Write-Host ""
    
    Write-Host "4️⃣  Probar en tu celular:" -ForegroundColor Cyan
    Write-Host "   • Abre el navegador en tu celular" -ForegroundColor White
    Write-Host "   • Navega a: $publicUrl" -ForegroundColor Green
    Write-Host "   • Haz clic en 'Visit Site' (primera vez)" -ForegroundColor White
    Write-Host ""
    
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║                    🔗 ENLACES ÚTILES                      ║" -ForegroundColor Magenta
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "• Interfaz web de ngrok: http://127.0.0.1:4040" -ForegroundColor White
    Write-Host "• Clerk Dashboard: https://dashboard.clerk.com" -ForegroundColor White
    Write-Host "• Tu aplicación: $publicUrl" -ForegroundColor White
    Write-Host ""
    
    $response = Read-Host "¿Quieres abrir Clerk Dashboard ahora? (s/n)"
    if ($response -eq "s" -or $response -eq "S") {
        Start-Process "https://dashboard.clerk.com"
    }
    
    Write-Host ""
    Write-Host "💡 Tip: Deja esta ventana abierta. ngrok seguirá corriendo en segundo plano." -ForegroundColor Yellow
    Write-Host ""
    
}
catch {
    Write-Host "⚠️  ngrok está iniciando..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Por favor:" -ForegroundColor Cyan
    Write-Host "1. Ve a: http://127.0.0.1:4040" -ForegroundColor White
    Write-Host "2. Copia la URL HTTPS que aparece" -ForegroundColor White
    Write-Host "3. Sigue los pasos en MOBILE_TESTING_SETUP.md" -ForegroundColor White
    Write-Host ""
}

Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
