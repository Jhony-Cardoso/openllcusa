# 🚀 Estrategia de SEO y Metadatos - Open LLC USA

Este documento detalla todas las optimizaciones realizadas para mejorar la visibilidad de Open LLC USA en buscadores (Google, Bing) y la apariencia al compartir en redes sociales.

## 📋 Estado de Implementación

### 1. Configuración Estructural (Layout)
- [x] **Metadata Template**: Configurado en `layout.tsx`.
- [x] **Metadatos Base**: Título, descripción y robots definidos.
- [x] **Sitemap.xml**: Generado automáticamente vía `sitemap.ts`.
- [x] **Robots.txt**: Configurado vía `robots.ts` para optimizar el presupuesto de rastreo.

### 2. Optimización de Páginas Estáticas
- [x] **Home**: Metadatos y rutas de imagen corregidas.
- [x] **Precios**: Metadatos y JSON-LD de servicios profesionales configurados.
- [x] **Calculadora Fiscal**: Metadatos y Schema JSON-LD de aplicación financiera listos.

### 3. SEO Dinámico (Servicios y Blog)
- [x] **Servicios Dinámicos**: Implementado `generateMetadata` en `/servicios/[slug]`.
- [x] **Blog**: Implementado `generateMetadata` y JSON-LD por cada post.

### 4. Visibilidad Social (Open Graph & Twitter)
- [x] **OG Images**: Rutas corregidas para Home y Calculadora.
- [x] **Twitter Cards**: Configuración de `summary_large_image` activa.

---

## 🛠️ Guía de Buenas Prácticas Aplicadas

1.  **Títulos (Title Tags)**: Entre 50-60 caracteres. Incluyen la palabra clave principal al principio.
2.  **Descripciones (Meta Descriptions)**: Entre 140-155 caracteres. Incluyen un Call To Action (CTA).
3.  **Jerarquía H1-H3**: Un solo H1 por página que coincida semánticamente con el título.
4.  **Imágenes**: Alt text descriptivo en todas las imágenes críticas.
5.  **Canónicas**: URLs canónicas para evitar contenido duplicado entre `http` y `https` o con/sin `www`.
