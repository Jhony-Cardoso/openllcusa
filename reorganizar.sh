#!/bin/bash

# Script para reorganizar estructura de Next.js
# Mueve components/ y lib/ fuera de app/

echo "🚀 Iniciando reorganización de estructura Next.js..."
echo ""

# Verificar que estamos en la raíz del proyecto
if [ ! -d "app" ]; then
    echo "❌ Error: No se encuentra el directorio 'app/'"
    echo "   Asegúrate de ejecutar este script desde la raíz del proyecto"
    exit 1
fi

# Crear backup
echo "📦 Creando backup..."
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r app "$BACKUP_DIR/"
echo "✅ Backup creado en: $BACKUP_DIR"
echo ""

# Mover components/ si existe
if [ -d "app/components" ]; then
    echo "📁 Moviendo app/components/ a la raíz..."
    if [ -d "components" ]; then
        echo "⚠️  Ya existe un directorio components/ en la raíz"
        echo "   Fusionando contenido..."
        cp -r app/components/* components/
    else
        mv app/components .
    fi
    echo "✅ components/ movido"
else
    echo "ℹ️  No se encontró app/components/"
fi

echo ""

# Mover lib/ si existe
if [ -d "app/lib" ]; then
    echo "📁 Moviendo app/lib/ a la raíz..."
    if [ -d "lib" ]; then
        echo "⚠️  Ya existe un directorio lib/ en la raíz"
        echo "   Fusionando contenido..."
        cp -r app/lib/* lib/
    else
        mv app/lib .
    fi
    echo "✅ lib/ movido"
else
    echo "ℹ️  No se encontró app/lib/"
fi

echo ""
echo "✨ Reorganización completada!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Verifica que tsconfig.json tiene configurado el path alias:"
echo "      \"paths\": { \"@/*\": [\"./*\"] }"
echo ""
echo "   2. Actualiza las importaciones en tus archivos:"
echo "      Antes: import X from '@/components/X'"
echo "      Después: import X from '@/components/X'"
echo ""
echo "   3. Ejecuta: npm run dev"
echo "      y verifica que todo funciona correctamente"
echo ""
echo "   4. Si todo está OK, puedes eliminar el backup:"
echo "      rm -rf $BACKUP_DIR"
echo ""