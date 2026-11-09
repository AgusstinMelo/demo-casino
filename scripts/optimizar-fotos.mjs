/**
 * Optimiza las fotos propias del club para la web.
 *
 *   npm run fotos -- ruta/a/la-foto.png nombre
 *
 * Genera en public/fotos/:
 *   nombre.jpg (respaldo) + nombre-640/960/1280/<original>.avif y .webp
 * Después, en src/content.ts usá:
 *   { src: '/fotos/nombre.jpg', alt: '…', anchos: [640, 960, 1280, <original>] }
 * (el script imprime la línea lista para copiar)
 */
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const [archivo, nombre] = process.argv.slice(2)
if (!archivo || !nombre) {
  console.error('Uso: npm run fotos -- ruta/a/la-foto.jpg nombre-de-salida')
  process.exit(1)
}
const out = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'fotos')
mkdirSync(out, { recursive: true })

const { width } = await sharp(archivo).metadata()
const anchos = [...new Set([640, 960, 1280, Math.min(width, 2000)].filter((w) => w <= width))]
for (const w of anchos) {
  await sharp(archivo).rotate().resize({ width: w }).avif({ quality: 55 }).toFile(`${out}/${nombre}-${w}.avif`)
  await sharp(archivo).rotate().resize({ width: w }).webp({ quality: 78 }).toFile(`${out}/${nombre}-${w}.webp`)
}
await sharp(archivo).rotate().resize({ width: Math.min(width, 1200) }).jpeg({ quality: 82, mozjpeg: true }).toFile(`${out}/${nombre}.jpg`)
console.log(`✓ Listo. En content.ts:\n  { src: '/fotos/${nombre}.jpg', alt: 'Describí la foto', anchos: [${anchos.join(', ')}] }`)
