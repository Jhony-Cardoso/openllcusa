const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function trimLogo(inputPath, outputPath) {
    try {
        const image = sharp(inputPath);
        const { width, height } = await image.metadata();
        console.log(`Original dimensions: ${width}x${height}`);

        // Trim transparent pixels
        const trimmed = await image.trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
        
        // Ensure it's square
        const finalImage = await sharp(trimmed)
            .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .toFile(outputPath);

        console.log(`Saved trimmed logo to ${outputPath}`);
    } catch (err) {
        console.error('Error trimming logo:', err);
    }
}

async function main() {
    const source = path.join(__dirname, '..', 'public', 'images', 'logo.png');
    
    const iconPath = path.join(__dirname, '..', 'app', 'icon.png');
    const appleIconPath = path.join(__dirname, '..', 'app', 'apple-icon.png');
    const newLogoPath = path.join(__dirname, '..', 'public', 'images', 'logo_trimmed.png');

    await trimLogo(source, newLogoPath);
    await trimLogo(source, iconPath);
    await trimLogo(source, appleIconPath);

    // Overwrite the original logo with the trimmed one
    fs.copyFileSync(newLogoPath, source);
    fs.unlinkSync(newLogoPath);
}

main();
