import { useEffect } from 'react'
import { sitio } from '../content'

type Seo = { titulo: string; descripcion: string; imagen?: string; path?: string }

const setMeta = (attr: 'name' | 'property', key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

/**
 * Actualiza title, description, Open Graph y canonical al navegar.
 * (Para WhatsApp/Facebook, que no ejecutan JS, el build genera además un HTML
 * estático por página con estos mismos datos: ver vite.config.ts.)
 */
export function useSeo({ titulo, descripcion, imagen = sitio.seo.imagen, path = '/' }: Seo) {
  useEffect(() => {
    const url = sitio.url + path
    const img = imagen.startsWith('http') ? imagen : sitio.url + imagen
    document.title = titulo
    setMeta('name', 'description', descripcion)
    setMeta('property', 'og:title', titulo)
    setMeta('property', 'og:description', descripcion)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', img)
    setMeta('name', 'twitter:title', titulo)
    setMeta('name', 'twitter:description', descripcion)
    setMeta('name', 'twitter:image', img)
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = url
  }, [titulo, descripcion, imagen, path])
}
