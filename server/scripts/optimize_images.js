const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '../../client/src/assets');
const publicDir = path.join(__dirname, '../../client/public');

async function optimizeImages(directory) {
    if (!fs.existsSync(directory)) {
        console.log(`Directory not found: ${directory}`);
        return;
    }

    const files = fs.readdirSync(directory);

    for (const file of files) {
        if (file.match(/\.(jpg|jpeg|png)$/i)) {
            const inputPath = path.join(directory, file);
            const outputPath = path.join(directory, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

            console.log(`Converting ${file} to WebP...`);

            try {
                await sharp(inputPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath);
                console.log(`✅ Converted: ${outputPath}`);
            } catch (err) {
                console.error(`❌ Error converting ${file}:`, err);
            }
        }
    }
}

async function run() {
    console.log('Starting image optimization...');
    await optimizeImages(assetsDir);
    await optimizeImages(publicDir);
    console.log('Optimization complete.');
}

run();
