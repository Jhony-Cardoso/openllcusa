# Guía de Despliegue - OpenLLC

## 1. Situación Actual

Actualmente estás trabajando en la rama `feat/mejoras-conversion-servicio-detalle`, donde se encuentran las mejoras de conversión de la página de detalle de servicios.

El botón **Deploy** de Dokploy siempre utiliza la rama configurada en el proyecto (actualmente `main`). Por eso los cambios no se están viendo en producción.

## 2. Pasos para Sacar los Cambios a Producción

### Paso 1: Crear el Pull Request

1. Ve a GitHub y entra a tu repositorio: `https://github.com/Jhony-Cardoso/openllcusa`
2. Haz clic en la pestaña **Pull requests**.
3. Haz clic en el botón verde **New pull request**.
4. En la parte superior, cambia la rama base a `main` (si no está seleccionada).
5. Selecciona como rama comparada: `feat/mejoras-conversion-servicio-detalle`.
6. Haz clic en **Create pull request**.
7. Pon un título claro, por ejemplo:  
   `feat: Mejoras de conversión en páginas de servicios`
8. En la descripción puedes poner un resumen breve de los cambios.
9. Haz clic en **Create pull request**.

### Paso 2: Revisar y Mergear el Pull Request

1. Una vez creado el Pull Request, revísalo para confirmar que los cambios son correctos.
2. Si todo está bien, haz clic en el botón **Merge pull request**.
3. Confirma el merge.
4. Una vez hecho el merge, los cambios ya estarán en la rama `main`.

### Paso 3: Hacer Deploy en Dokploy

1. Entra a tu panel de Dokploy.
2. Localiza tu proyecto.
3. Haz clic en el botón **Deploy**.
4. Espera a que termine el proceso de build y despliegue.
5. Una vez finalizado, verifica los cambios en producción.

**Nota importante:** El botón Deploy siempre usa la rama `main`. Por eso es necesario haber hecho el merge antes.

## 3. Cómo Funcionan los Botones de Dokploy

- **Deploy**: Construye la aplicación desde cero y la despliega. Es el que debes usar cuando hay cambios de código.
- **Reload**: Reinicia el contenedor actual sin reconstruir. Úsalo si solo quieres reiniciar la aplicación.
- **Rebuild**: Reconstruye la imagen pero no siempre reinicia el servicio completo.

Para cambios normales de código, usa **Deploy**.

## 4. Cómo Probar los Cambios en Desarrollo

Si quieres probar los cambios localmente:

1. Cambia a la rama `main` (después del merge).
2. Ejecuta los siguientes comandos en la terminal:

```bash
rm -rf .next
npm run dev
```

3. Abre el navegador y prueba las páginas de servicios (ej: `/servicios/obtencion-ein`).

Si sigues viendo error 404 en todas las páginas de servicios, es probable que los slugs no existan en tu base de datos de Supabase o que haya un problema en la consulta.

## 5. Recomendación sobre los Commits "undefined"

Tienes varios commits con el mensaje "undefined" en el historial. Esto ensucia un poco el historial del proyecto.

**Recomendación:**  
Como es un proyecto personal y no es crítico, puedes dejarlos por ahora. Si en el futuro quieres limpiar el historial, podemos hacerlo con un `git rebase` interactivo (es una operación más avanzada).

## 6. Comandos Git Útiles

Aquí tienes una lista corta de comandos que te pueden servir:

| Comando                        | Para qué sirve                              |
|-------------------------------|---------------------------------------------|
| `git branch --show-current`   | Ver en qué rama estás ahora                 |
| `git checkout main`           | Cambiar a la rama main                      |
| `git checkout -b nombre-rama` | Crear y cambiar a una nueva rama            |
| `git status`                  | Ver el estado de los archivos modificados   |
| `git pull`                    | Actualizar tu rama local con lo de GitHub   |
| `git log --oneline -10`       | Ver los últimos 10 commits                  |

## 7. Flujo Recomendado a Futuro

Para evitar problemas como este en el futuro, sigue este orden:

1. Crear una rama de feature para trabajar.
2. Hacer tus cambios.
3. Crear un Pull Request hacia `main`.
4. Revisar y mergear a `main`.
5. Hacer Deploy en Dokploy (o configurarlo para que sea automático).

Una vez que configura correctamente el Webhook en Dokploy, los deploys deberían hacerse solos cada vez que hagas merge a `main`.

## 8. Preguntas Frecuentes

### ¿Cómo cambiar a la rama `main` después del merge?

Para cambiarte a la rama `main` después de haber mergeado un Pull Request, ejecuta estos comandos en la terminal:

```bash
# 1. Cambiar a la rama main
git checkout main

# 2. Actualizar la rama con los últimos cambios de GitHub
git pull
```

Después de ejecutar estos comandos, puedes probar los cambios localmente con:

```bash
rm -rf .next
npm run dev
```

### ¿Cada vez que haga cambios tengo que crear una rama nueva?

**Respuesta clara y directa:**

No. No se debe crear una rama nueva **para cada cambio** ni usar **una sola rama para todos los futuros cambios**.

**La regla correcta es:**

Se recomienda crear una rama nueva **por cada tarea o conjunto de cambios importante** que tenga sentido agrupar.

Aquí tienes una guía práctica:

| Tipo de trabajo                                      | ¿Crear rama nueva? | Recomendación |
|------------------------------------------------------|--------------------|-------------|
| Cambiar los textos de la página de contacto          | Sí                 | Crear rama `feat/actualizar-textos-contacto` |
| Añadir varias secciones nuevas a una página          | Sí                 | Crear rama `feat/mejoras-pagina-servicios` |
| Corregir un error tipográfico                        | No (casi siempre)  | Puedes hacerlo directamente en `main` |
| Hacer varios cambios pequeños en un mismo día        | Depende            | Si están relacionados → una rama. Si son cosas distintas → varias ramas |
| Trabajar durante varias semanas en diferentes mejoras | Sí                | Crear **varias ramas** (una por cada mejora grande) |

**Recomendación práctica para ti (proyecto personal):**

- **Cambios importantes** o que te lleven más de unas horas → Crea una rama nueva.
- **Cambios muy pequeños** (corregir un texto, cambiar un color, etc.) → Puedes ir directo a `main` si quieres.

### Cómo crear una rama nueva de forma fácil

Para crear una rama nueva y empezar a trabajar en ella, usa este comando:

```bash
git checkout -b nombre-de-la-rama
```

**Ejemplos reales:**

```bash
git checkout -b feat/mejoras-pagina-contacto
git checkout -b fix/error-en-formulario
git checkout -b actualizacion-textos-servicios
```

**Pasos completos para empezar a trabajar en una nueva rama:**

1. Crea y cambia a la nueva rama:
   ```bash
   git checkout -b feat/nombre-del-cambio
   ```

2. Haz tus cambios normalmente.

3. Guarda los cambios en Git:
   ```bash
   git add .
   git commit -m "Descripción corta de lo que hiciste"
   ```

4. Sube la rama a GitHub:
   ```bash
   git push -u origin feat/nombre-del-cambio
   ```

5. Ve a GitHub y crea el Pull Request hacia `main`.

Este es el flujo más seguro y recomendado.
