# Script para configurar pruebas desde móvil con ngrok
# Autor: Antigravity AI
# Fecha: 2026-01-27

Write-Host "🚀 Configuración de Pruebas Móviles con ngrok" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Función para verificar si un comando existe
function Test-CommandExists {
    param($command)
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

# Paso 1: Verificar si ngrok está instalado
Write-Host "📦 Paso 1: Verificando instalación de ngrok..." -ForegroundColor Yellow
if (Test-CommandExists ngrok) {
    Write-Host "✅ ngrok ya está instalado" -ForegroundColor Green
}
else {
    Write-Host "❌ ngrok no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, instala ngrok con uno de estos métodos:" -ForegroundColor Yellow
    Write-Host "  1. npm install -g ngrok" -ForegroundColor White
    Write-Host "  2. choco install ngrok" -ForegroundColor White
    Write-Host "  3. Descarga desde https://ngrok.com/download" -ForegroundColor White
    Write-Host ""
    $install = Read-Host "¿Quieres instalarlo con npm ahora? (s/n)"
    
    if ($install -eq "s" -or $install -eq "S") {
        Write-Host "Instalando ngrok..." -ForegroundColor Yellow
        npm install -g ngrok
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ ngrok instalado correctamente" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Error al instalar ngrok" -ForegroundColor Red
            exit 1
        }
    }
    else {
        Write-Host "❌ ngrok es necesario para continuar" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Paso 2: Verificar autenticación de ngrok
Write-Host "🔑 Paso 2: Verificando autenticación de ngrok..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Para usar ngrok necesitas una cuenta gratuita:" -ForegroundColor White
Write-Host "  1. Ve a https://dashboard.ngrok.com/signup" -ForegroundColor Cyan
Write-Host "  2. Crea una cuenta (es GRATIS)" -ForegroundColor Cyan
Write-Host "  3. Copia tu authtoken desde https://dashboard.ngrok.com/get-started/your-authtoken" -ForegroundColor Cyan
Write-Host ""

$hasToken = Read-Host "¿Ya tienes tu authtoken de ngrok? (s/n)"

if ($hasToken -eq "s" -or $hasToken -eq "S") {
    $token = Read-Host "Pega tu authtoken aquí"
    
    if ($token) {
        Write-Host "Configurando authtoken..." -ForegroundColor Yellow
        ngrok config add-authtoken $token
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Authtoken configurado correctamente" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Error al configurar authtoken" -ForegroundColor Red
            exit 1
        }
    }
    else {
        Write-Host "❌ Authtoken vacío" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host ""
    Write-Host "⚠️  Por favor, sigue estos pasos:" -ForegroundColor Yellow
    Write-Host "  1. Abre https://dashboard.ngrok.com/signup en tu navegador" -ForegroundColor White
    Write-Host "  2. Crea una cuenta gratuita" -ForegroundColor White
    Write-Host "  3. Copia tu authtoken" -ForegroundColor White
    Write-Host "  4. Ejecuta: ngrok config add-authtoken TU_AUTHTOKEN" -ForegroundColor White
    Write-Host "  5. Vuelve a ejecutar este script" -ForegroundColor White
    Write-Host ""
    exit 0
}

Write-Host ""

# Paso 3: Verificar que el servidor Next.js esté corriendo
Write-Host "🔍 Paso 3: Verificando servidor Next.js..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Servidor Next.js está corriendo en http://localhost:3000" -ForegroundColor Green
}
catch {
    Write-Host "❌ Servidor Next.js no está corriendo" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, inicia el servidor en otra terminal:" -ForegroundColor Yellow
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    $startServer = Read-Host "¿Quieres que lo inicie ahora? (s/n)"
    
    if ($startServer -eq "s" -or $startServer -eq "S") {
        Write-Host "Iniciando servidor Next.js..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
        Write-Host "⏳ Esperando 10 segundos para que el servidor inicie..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
    }
    else {
        Write-Host "❌ El servidor Next.js debe estar corriendo para continuar" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Paso 4: Iniciar ngrok
Write-Host "🌐 Paso 4: Iniciando ngrok..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Iniciando ngrok en el puerto 3000..." -ForegroundColor White

# Iniciar ngrok en segundo plano
$ngrokProcess = Start-Process ngrok -ArgumentList "http", "3000" -PassThru -WindowStyle Normal

Write-Host "⏳ Esperando 5 segundos para que ngrok inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Obtener la URL de ngrok desde la API
try {
    $ngrokApi = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -ErrorAction Stop
    $publicUrl = $ngrokApi.tunnels | Where-Object { $_.proto -eq "https" } | Select-Object -First 1 -ExpandProperty public_url
    
    if ($publicUrl) {
        Write-Host "✅ ngrok está corriendo" -ForegroundColor Green
        Write-Host ""
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
        Write-Host "🌐 URL PÚBLICA DE NGROK:" -ForegroundColor Green
        Write-Host "   $publicUrl" -ForegroundColor Yellow
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
        Write-Host ""
        
        # Extraer solo el dominio (sin https://)
        $domain = $publicUrl -replace "https://", ""
        
        Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "1️⃣  Configurar Clerk Dashboard:" -ForegroundColor Cyan
        Write-Host "   • Ve a https://dashboard.clerk.com/" -ForegroundColor White
        Write-Host "   • Selecciona tu aplicación" -ForegroundColor White
        Write-Host "   • Ve a Configure → Domains" -ForegroundColor White
        Write-Host "   • Click en 'Add domain'" -ForegroundColor White
        Write-Host "   • Pega este dominio: $domain" -ForegroundColor Yellow
        Write-Host "   • Click en 'Add domain'" -ForegroundColor White
        Write-Host ""
        
        Write-Host "2️⃣  Actualizar .env.local:" -ForegroundColor Cyan
        Write-Host "   • Cambia NEXT_PUBLIC_BASE_URL a:" -ForegroundColor White
        Write-Host "     NEXT_PUBLIC_BASE_URL=$publicUrl" -ForegroundColor Yellow
        Write-Host ""
        
        Write-Host "3️⃣  Reiniciar el servidor Next.js:" -ForegroundColor Cyan
        Write-Host "   • Detén el servidor (Ctrl+C)" -ForegroundColor White
        Write-Host "   • Ejecuta: npm run dev" -ForegroundColor White
        Write-Host ""
        
        Write-Host "4️⃣  Probar desde tu móvil:" -ForegroundColor Cyan
        Write-Host "   • Abre esta URL en tu celular:" -ForegroundColor White
        Write-Host "     $publicUrl" -ForegroundColor Yellow
        Write-Host "   • Acepta el aviso de ngrok (Click en 'Visit Site')" -ForegroundColor White
        Write-Host "   • Prueba el login" -ForegroundColor White
        Write-Host ""
        
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
        Write-Host ""
        
        # Copiar URL al portapapeles
        $publicUrl | Set-Clipboard
        Write-Host "✅ URL copiada al portapapeles" -ForegroundColor Green
        Write-Host ""
        
        # Preguntar si quiere actualizar .env.local automáticamente
        $updateEnv = Read-Host "¿Quieres que actualice .env.local automáticamente? (s/n)"
        
        if ($updateEnv -eq "s" -or $updateEnv -eq "S") {
            Write-Host "Actualizando .env.local..." -ForegroundColor Yellow
            
            # Leer el archivo .env.local
            $envContent = Get-Content ".env.local" -Raw
            
            # Reemplazar NEXT_PUBLIC_BASE_URL
            $envContent = $envContent -replace "NEXT_PUBLIC_BASE_URL=.*", "NEXT_PUBLIC_BASE_URL=$publicUrl"
            
            # Guardar el archivo
            $envContent | Set-Content ".env.local" -NoNewline
            
            Write-Host "✅ .env.local actualizado" -ForegroundColor Green
            Write-Host ""
            Write-Host "⚠️  IMPORTANTE: Reinicia el servidor Next.js para aplicar los cambios" -ForegroundColor Yellow
            Write-Host ""
        }
        
        Write-Host "🔗 Panel de control de ngrok:" -ForegroundColor Cyan
        Write-Host "   http://localhost:4040" -ForegroundColor White
        Write-Host ""
        
        Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
        Write-Host "   • Mantén esta ventana abierta mientras pruebes" -ForegroundColor White
        Write-Host "   • Si cierras ngrok, la URL dejará de funcionar" -ForegroundColor White
        Write-Host "   • Cada vez que reinicies ngrok, obtendrás una URL diferente" -ForegroundColor White
        Write-Host ""
        
        Write-Host "Presiona Ctrl+C para detener ngrok cuando termines" -ForegroundColor Yellow
        
        # Mantener el script corriendo
        Wait-Process -Id $ngrokProcess.Id
        
    }
    else {
        Write-Host "❌ No se pudo obtener la URL de ngrok" -ForegroundColor Red
        Write-Host "Verifica que ngrok esté corriendo correctamente" -ForegroundColor Yellow
        exit 1
    }
}
catch {
    Write-Host "❌ Error al conectar con ngrok API" -ForegroundColor Red
    Write-Host "Verifica que ngrok esté corriendo correctamente" -ForegroundColor Yellow
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}
