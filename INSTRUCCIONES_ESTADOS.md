# Instrucciones para Actualizar Estados en Supabase Studio

## Problema
El script automático tiene problemas de autenticación con la instancia self-hosted de Supabase.

## Solución Manual

### Paso 1: Acceder a Supabase Studio
1. Abre tu navegador
2. Ve a: `http://89.117.53.55:8001`
3. Inicia sesión en Supabase Studio

### Paso 2: Abrir SQL Editor
1. En el menú lateral, haz clic en "SQL Editor"
2. Haz clic en "New query"

### Paso 3: Ejecutar el siguiente SQL

```sql
-- 1. Desactivar Texas
UPDATE public.estados_usa 
SET activo = false 
WHERE codigo = 'TX';

-- 2. Insertar New Mexico
INSERT INTO public.estados_usa (
  id, 
  codigo, 
  nombre, 
  filing_anual, 
  filing_inicial, 
  descripcion, 
  ventajas, 
  popular, 
  recomendado, 
  activo
)
VALUES (
  'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7', 
  'NM', 
  'New Mexico', 
  50.00, 
  50.00, 
  'Estado con costos de mantenimiento muy bajos y proceso de formación simple', 
  '["Costos de filing muy bajos ($50 anual)", "Proceso de formación simple", "Buena privacidad para los propietarios", "Sin impuesto estatal sobre ingresos de LLC"]'::jsonb, 
  false, 
  false, 
  true
)
ON CONFLICT (id) DO UPDATE SET
  codigo = EXCLUDED.codigo,
  nombre = EXCLUDED.nombre,
  filing_anual = EXCLUDED.filing_anual,
  filing_inicial = EXCLUDED.filing_inicial,
  descripcion = EXCLUDED.descripcion,
  ventajas = EXCLUDED.ventajas,
  popular = EXCLUDED.popular,
  recomendado = EXCLUDED.recomendado,
  activo = EXCLUDED.activo;

-- 3. Verificar los cambios
SELECT codigo, nombre, activo, filing_anual, filing_inicial
FROM public.estados_usa
ORDER BY nombre;
```

### Paso 4: Ejecutar la consulta
1. Haz clic en el botón "Run" (o presiona Ctrl+Enter)
2. Verifica que aparezcan los siguientes estados activos:
   - Delaware (DE)
   - Florida (FL)
   - Nevada (NV)
   - **New Mexico (NM)** ← NUEVO
   - Wyoming (WY)
3. Verifica que Texas (TX) aparezca como `activo = false`

### Resultado Esperado
Deberías ver 6 estados en total:
- 5 activos (DE, FL, NV, NM, WY)
- 1 inactivo (TX)

## Alternativa: Usar la interfaz de Supabase
Si prefieres no usar SQL:

1. Ve a "Table Editor" → "estados_usa"
2. Encuentra la fila de Texas (TX)
3. Haz clic en editar y cambia `activo` a `false`
4. Haz clic en "Insert row" y agrega:
   - id: `a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7`
   - codigo: `NM`
   - nombre: `New Mexico`
   - filing_anual: `50`
   - filing_inicial: `50`
   - descripcion: `Estado con costos de mantenimiento muy bajos y proceso de formación simple`
   - popular: `false`
   - recomendado: `false`
   - activo: `true`
