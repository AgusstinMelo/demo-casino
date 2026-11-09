/**
 * Procesa las fotos de perfil de las redes (respaldo local).
 *
 *   node scripts/avatares-redes.mjs ruta/a/la-carpeta
 *
 * La carpeta tiene que tener un archivo por cuenta, nombrado con el `id` de
 * `redes` en src/content.ts (club, cultura, basquet, futbol, handball, tenis,
 * gimnasio, facebook), en cualquier formato de imagen (jpg, png, webp...).
 *
 * Genera public/redes/<id>.jpg recortado cuadrado a 144×144 (48 px × 3 para
 * pantallas de alta densidad) e imprime las cuentas que quedaron listas.
 */
import { mkdirSync, readdirSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const carpeta = process.argv[2]
if (!carpeta) {
  console.error('Uso: node scripts/avatares-redes.mjs ruta/a/la-carpeta')
  process.exit(1)
}
const out = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'redes')
mkdirSync(out, { recursive: true })

const listos = []
for (const archivo of readdirSync(carpeta)) {
  if (!/\.(jpe?g|png|webp|avif|gif)$/i.test(archivo)) continue
  const id = archivo.slice(0, -extname(archivo).length)
  await sharp(join(carpeta, archivo)).rotate().resize(144, 144, { fit: 'cover' }).jpeg({ quality: 85, mozjpeg: true }).toFile(join(out, `${id}.jpg`))
  listos.push(id)
}
console.log(listos.length ? `✓ public/redes/: ${listos.join(', ')}` : 'No encontré imágenes en esa carpeta.')
