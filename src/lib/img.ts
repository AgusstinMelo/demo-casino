/**
 * Helpers de imágenes. Las fotos de Unsplash aceptan parámetros de tamaño y
 * `auto=format`, que sirve AVIF/WebP según el navegador.
 * Las fotos locales (/fotos/...) se usan tal cual.
 */
const isUnsplash = (src: string) => src.includes('images.unsplash.com')

export function imgUrl(src: string, w: number, h?: number, q = 70): string {
  if (!isUnsplash(src)) return src
  const p = new URLSearchParams({ auto: 'format', fit: 'crop', w: String(w), q: String(q) })
  if (h) p.set('h', String(h))
  return `${src}?${p.toString()}`
}

export function srcSet(src: string, widths: number[], ratio?: number): string | undefined {
  if (!isUnsplash(src)) return undefined
  return widths.map((w) => `${imgUrl(src, w, ratio ? Math.round(w * ratio) : undefined)} ${w}w`).join(', ')
}

/** Miniatura diminuta para el efecto blur-up */
export function tinyUrl(src: string, ratio?: number): string {
  if (!isUnsplash(src)) return src
  return imgUrl(src, 24, ratio ? Math.round(24 * ratio) : undefined, 30) + '&blur=40'
}
