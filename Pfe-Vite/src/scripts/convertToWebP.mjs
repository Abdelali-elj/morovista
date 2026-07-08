import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', '..', 'public');

// Find all image files (jpeg, jpg, png, jfif) in public folder
function findImages(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            findImages(fullPath, files);
        } else if (/\.(jpg|jpeg|png|jfif)$/i.test(entry.name)) {
            files.push(fullPath);
        }
    }
    return files;
}

async function run() {
    const images = findImages(publicDir);
    console.log(`Found ${images.length} images to convert to WebP...`);
    
    let totalSaved = 0;
    
    for (const imgPath of images) {
        const dir = path.dirname(imgPath);
        const name = path.basename(imgPath, path.extname(imgPath));
        const webpPath = path.join(dir, `${name}.webp`);
        
        try {
            const originalSize = fs.statSync(imgPath).size;
            
            await sharp(imgPath)
                .webp({ quality: 85, effort: 6 })
                .toFile(webpPath);
            
            const newSize = fs.statSync(webpPath).size;
            const saved = Math.round((1 - newSize / originalSize) * 100);
            totalSaved += (originalSize - newSize);
            
            // Delete original
            fs.unlinkSync(imgPath);
            
            console.log(`✔ ${path.basename(imgPath)} → ${name}.webp (saved ${saved}%)`);
        } catch (err) {
            console.error(`✗ Failed: ${imgPath}`, err.message);
        }
    }

    console.log(`\n==> Done! Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
    
    // Now report files that reference old extensions — need updating
    console.log('\n--- NOTE: Search src code for these old references ---');
    for (const img of images) {
        const relPath = '/' + path.relative(publicDir, img).replace(/\\/g, '/');
        const webpRelPath = relPath.replace(/\.(jpg|jpeg|png|jfif)$/i, '.webp');
        console.log(`  ${relPath}  ->  ${webpRelPath}`);
    }
}

run();
