import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

// Configuramos Turndown
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;
const OUTPUT_DIR = path.join(process.cwd(), 'knowledge', 'web');

async function scrapeWebsite() {
  console.log(`🔍 Iniciando rastreo de la web: ${BASE_URL}`);

  // 1. Asegurar que existe el directorio de salida
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    // 2. Obtener el sitemap
    console.log(`Obteniendo sitemap desde ${SITEMAP_URL}...`);
    const sitemapRes = await fetch(SITEMAP_URL);
    if (!sitemapRes.ok) {
      throw new Error(`Error al obtener sitemap: ${sitemapRes.status}`);
    }
    const sitemapXml = await sitemapRes.text();

    // 3. Extraer URLs del sitemap
    const $ = cheerio.load(sitemapXml, { xmlMode: true });
    const urls: string[] = [];
    $('loc').each((_, el) => {
      urls.push($(el).text());
    });

    console.log(`✅ Encontradas ${urls.length} URLs en el sitemap.`);

    // 4. Procesar cada URL
    for (const url of urls) {
      try {
        console.log(`Scrapeando: ${url}`);
        const pageRes = await fetch(url);
        if (!pageRes.ok) continue;

        const html = await pageRes.text();
        const $page = cheerio.load(html);

        // Limpiar el HTML: quitamos menús, footers, scripts, estilos, etc.
        $page('nav, header, footer, script, style, noscript, svg, iframe').remove();

        // Extraer el contenido principal
        // Por defecto intentamos coger el <main>. Si no hay, cogemos el <body>
        let mainContentHtml = $page('main').html();
        if (!mainContentHtml) {
          mainContentHtml = $page('body').html();
        }

        if (!mainContentHtml) {
          console.log(`⚠️ No se encontró contenido en ${url}`);
          continue;
        }

        // Convertir HTML a Markdown
        let markdown = turndownService.turndown(mainContentHtml);
        
        // Limpiar un poco el Markdown (quitar múltiples saltos de línea)
        markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

        // Generar un nombre de archivo basado en la URL
        const urlObj = new URL(url);
        let filename = urlObj.pathname.replace(/^\/|\/$/g, '').replace(/\//g, '-');
        if (!filename) filename = 'inicio';
        filename += '.md';

        // Guardar el archivo
        const filePath = path.join(OUTPUT_DIR, filename);
        fs.writeFileSync(filePath, markdown, 'utf-8');
        
        console.log(`💾 Guardado como ${filename}`);
      } catch (err) {
        console.error(`❌ Error procesando ${url}:`, err);
      }
      
      // Pequeña pausa para no saturar el servidor local
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\n🎉 Rastreo web finalizado. Archivos guardados en ${OUTPUT_DIR}`);
  } catch (error) {
    console.error('❌ Error fatal en el rastreo:', error);
  }
}

scrapeWebsite();
