/**
 * Genera los íconos de la PWA, el favicon y las imágenes Open Graph (1200x630)
 * de cada página a partir de public/escudo.svg y src/content.ts.
 *
 *   npm run assets
 *
 * Volvé a correrlo cuando cambies el escudo, los colores o los textos SEO.
 * (Usa sharp, que está en devDependencies. Necesita Node 22.18+ para leer TS.)
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { disciplinas, hero, sitio } from '../src/content.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pub = (p) => resolve(root, 'public', p)
mkdirSync(pub('icons'), { recursive: true })
mkdirSync(pub('og'), { recursive: true })

// Colores: tomados de src/styles/tokens.css
const tokens = readFileSync(resolve(root, 'src/styles/tokens.css'), 'utf8')
const color = (name, fallback) => tokens.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})`))?.[1] ?? fallback
const PRIMARIO = color('club-granate', '#cc0033')
const SECUNDARIO = color('club-negro', '#141010')
const MARINO = color('club-marino', '#16233f')
const ACENTO = color('club-ambar', '#f2a516')

const escudo = readFileSync(pub('escudo.svg'))

/* ---------- Íconos ---------- */
async function icono(size, file, { padding = 0.12, bg = PRIMARIO, round = true } = {}) {
  const inner = Math.round(size * (1 - padding * 2))
  const logo = await sharp(escudo, { density: 600 }).resize({ height: inner, width: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
  const r = round ? Math.round(size * 0.22) : 0
  const base = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="${bg}"/></svg>`)
  await sharp(base).composite([{ input: logo, gravity: 'center' }]).png().toFile(pub(`icons/${file}`))
}
await icono(192, 'pwa-192.png')
await icono(512, 'pwa-512.png')
await icono(512, 'pwa-maskable-512.png', { padding: 0.2, round: false })
await icono(180, 'apple-touch-icon.png', { padding: 0.1, round: false })
await icono(32, 'favicon-32.png', { padding: 0.02, bg: '#00000000' })
console.log('✓ íconos')

/* ---------- Open Graph ---------- */
const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

async function foto(src) {
  if (!src.startsWith('http')) return sharp(pub(src.replace(/^\//, ''))).resize(1200, 630, { fit: 'cover' }).toBuffer()
  const res = await fetch(`${src}?auto=format&fm=jpg&fit=crop&w=1200&h=630&q=80`)
  if (!res.ok) throw new Error(`No se pudo bajar ${src}`)
  return sharp(Buffer.from(await res.arrayBuffer())).resize(1200, 630, { fit: 'cover' }).modulate({ saturation: 0.85 }).toBuffer()
}

async function og(file, { kicker, titulo, bajada, src }) {
  let bg
  try {
    bg = await foto(src)
  } catch (e) {
    console.warn(`  (sin foto para ${file}: ${e.message})`)
    bg = await sharp({ create: { width: 1200, height: 630, channels: 3, background: PRIMARIO } }).png().toBuffer()
  }
  const lineas = titulo.toUpperCase().split('\n')
  const size = lineas.length > 1 ? 84 : 120
  const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs>
      <linearGradient id="d" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${PRIMARIO}" stop-opacity=".92"/>
        <stop offset=".55" stop-color="${PRIMARIO}" stop-opacity=".55"/>
        <stop offset="1" stop-color="${SECUNDARIO}" stop-opacity=".55"/>
      </linearGradient>
      <linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
        <stop offset=".35" stop-color="#0e0a0a" stop-opacity="0"/>
        <stop offset="1" stop-color="#0e0a0a" stop-opacity=".85"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#d)"/>
    <rect width="1200" height="630" fill="url(#b)"/>
    <rect x="0" y="606" width="1200" height="24" fill="${SECUNDARIO}"/>
    <rect x="0" y="600" width="1200" height="6" fill="${ACENTO}"/>
    <text x="64" y="${lineas.length > 1 ? 300 : 360}" font-family="Arial, sans-serif" font-weight="700" font-size="30" letter-spacing="6" fill="${ACENTO}">${escapeXml(kicker.toUpperCase())}</text>
    ${lineas.map((l, i) => `<text x="60" y="${(lineas.length > 1 ? 300 : 360) + size * (i + 1) * 0.92}" font-family="Arial Black, Arial, sans-serif" font-size="${size}" fill="#ffffff">${escapeXml(l)}</text>`).join('')}
    <text x="64" y="560" font-family="Arial, sans-serif" font-size="30" fill="#ffffff" fill-opacity=".9">${escapeXml(bajada)}</text>
  </svg>`)
  const logo = await sharp(escudo, { density: 600 }).resize({ height: 190 }).png().toBuffer()
  await sharp(bg)
    .composite([{ input: overlay }, { input: logo, top: 48, left: 1200 - 64 - 163 }])
    .png({ compressionLevel: 9, palette: true, quality: 85 })
    .toFile(pub(`og/${file}.png`))
  console.log(`✓ og/${file}.png`)
}

await og('home', { kicker: `${sitio.ciudad} · Capital Nacional del Deportista`, titulo: 'Una pasión que\n no se detiene', bajada: `${sitio.nombre} · Deporte, cultura y comunidad`, src: hero.foto.src })
for (const d of disciplinas) {
  await og(d.slug, { kicker: sitio.nombre, titulo: d.nombre, bajada: 'Vení a probar · Sumate', src: d.foto.src })
}
writeFileSync(pub('og/.generado'), new Date().toISOString())
