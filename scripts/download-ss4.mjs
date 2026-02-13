
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = 'https://www.irs.gov/pub/irs-pdf/fss4.pdf';
const DEST_PATH = path.join(__dirname, '..', 'public', 'form-ss4.pdf');

// Asegurar que exista el directorio destino (public)
if (!fs.existsSync(path.dirname(DEST_PATH))) {
    fs.mkdirSync(path.dirname(DEST_PATH), { recursive: true });
}

const file = fs.createWriteStream(DEST_PATH);

console.log(`Descargando SS-4 desde ${url}...`);

https.get(url, (response) => {
    if (response.statusCode !== 200) {
        console.error(`Error al descargar: Status Code ${response.statusCode}`);
        return;
    }

    response.pipe(file);

    file.on('finish', () => {
        file.close();
        console.log(`✅ Formulario SS-4 descargado en: ${DEST_PATH}`);
    });
}).on('error', (err) => {
    fs.unlink(DEST_PATH, () => { }); // Borrar archivo incompleto
    console.error(`Error de red: ${err.message}`);
});
