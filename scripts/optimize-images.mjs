// Genera las imágenes optimizadas del sitio a partir de los originales de assets-src/:
//  - WebP de producto/galería (máx. 800px de ancho) en public/
//  - Imágenes Open Graph 1200x630 en public/og/
// Uso: npm run images
import sharp from 'sharp';
import { mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname, parse } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(root, 'assets-src');
const OUT = resolve(root, 'public');

const WEBP = { quality: 78 };

async function toWebp(rel, { width = 800 } = {}) {
    const name = parse(rel).name;
    const outDir = resolve(OUT, dirname(rel));
    mkdirSync(outDir, { recursive: true });
    const out = resolve(outDir, `${name}.webp`);
    const info = await sharp(resolve(SRC, rel))
        .resize({ width, withoutEnlargement: true })
        .webp(WEBP)
        .toFile(out);
    console.log(`${rel} -> ${name}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
}

async function toOg(rel, outName) {
    mkdirSync(resolve(OUT, 'og'), { recursive: true });
    const out = resolve(OUT, 'og', outName);
    const info = await sharp(resolve(SRC, rel))
        .resize(1200, 630, { fit: 'cover', position: sharp.strategy.attention })
        .jpeg({ quality: 80 })
        .toFile(out);
    console.log(`${rel} -> og/${outName} ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
}

const productos = [
    'hamburguesa_tradicional.jpg',
    'hamburguesa_especial_v3.png',
    'hamburguesa_ranchera.jpg',
    'hamburguesa_con_todo.jpg',
    'perro_tradicional.PNG',
    'perro_especial.PNG',
    'perro_ranchero.jpg',
    'salchipapa_doble.jpg',
    'sandwich.jpg',
    'porcion_papas.png',
];

const galeria = readdirSync(resolve(SRC, 'gallery')).map(f => `gallery/${f}`);

for (const f of [...productos, ...galeria]) await toWebp(f);
await toWebp('logo-saboratto.png', { width: 400 });
await toWebp('logo_postobon.png', { width: 284 });

await toOg('hamburguesa_ranchera.jpg', 'og-default.jpg');
await toOg('hamburguesa_con_todo.jpg', 'og-hamburguesas.jpg');
await toOg('perro_ranchero.jpg', 'og-perros.jpg');
await toOg('salchipapa_doble.jpg', 'og-salchipapas.jpg');
await toOg('sandwich.jpg', 'og-sandwiches.jpg');
await toOg('gallery/gallery_1.jpg', 'og-bebidas.jpg');
