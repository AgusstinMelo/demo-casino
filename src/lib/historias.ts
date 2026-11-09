import { useEffect, useState } from 'react'
import { historias as historiasDemo, type GrupoHistorias, type Historia } from '../content'

/**
 * Historias en vivo desde Instagram.
 *
 * ETAPA 1 (hoy): HISTORIAS_FUENTE = null → se muestran las historias de la demo (content.ts).
 * ETAPA 2: una función de Vercel (/api/historias) consulta la API de Instagram cada
 *          10–15 min y devuelve el JSON de abajo. Ahí se cambia esto a '/api/historias'.
 *
 * Para probar el comportamiento sin la API: '/historias-ejemplo.json'.
 *
 * Formato que tiene que devolver la fuente (una entrada por cuenta, sin @):
 * {
 *   "actualizado": "2026-11-09T18:00:00Z",
 *   "cuentas": {
 *     "casinofutbolok": [{ "id": "179...", "tipo": "imagen", "src": "https://..." }],
 *     "casinobasquet": []          ← sin historias activas: el círculo queda gris
 *   }
 * }
 * Una cuenta que no aparece en "cuentas" se trata igual que una lista vacía.
 */
export const HISTORIAS_FUENTE: string | null = null

type HistoriaRemota = { id: string; tipo: 'imagen' | 'video'; src: string; poster?: string }
type Respuesta = { actualizado?: string; cuentas: Record<string, HistoriaRemota[]> }

// Un solo pedido compartido por toda la página (hero, páginas de deportes, etc.)
let pedido: Promise<Respuesta | null> | null = null
function cargar(): Promise<Respuesta | null> {
  if (!HISTORIAS_FUENTE) return Promise.resolve(null)
  pedido ??= fetch(HISTORIAS_FUENTE, { headers: { Accept: 'application/json' } })
    .then((r) => (r.ok && r.headers.get('content-type')?.includes('json') ? (r.json() as Promise<Respuesta>) : null))
    .then((d) => (d && typeof d.cuentas === 'object' ? d : null))
    .catch(() => null)
  return pedido
}

/** Combina la respuesta de Instagram con los grupos de la demo. */
function combinar(remoto: Respuesta): GrupoHistorias[] {
  return historiasDemo.map((g) => {
    // Grupos sin cuenta (ej. "Desde 1944") son contenido propio del sitio: no cambian
    if (!g.cuenta) return g
    const lista = remoto.cuentas[g.cuenta] ?? []
    const historias: Historia[] = lista
      .filter((h) => h && h.src && (h.tipo === 'imagen' || h.tipo === 'video'))
      .map((h) => ({ id: h.id, tipo: h.tipo, src: h.src, poster: h.poster, alt: `Historia de @${g.cuenta}`, texto: '', enVivo: true }))
    return { ...g, historias }
  })
}

/**
 * Grupos de historias para mostrar. Arranca con las de la demo (así el HTML
 * prerenderizado coincide) y, si hay fuente en vivo y responde bien, las reemplaza.
 * Si la fuente falla, se quedan las de la demo: nunca queda la fila vacía por un error.
 */
export function useHistorias(): GrupoHistorias[] {
  const [grupos, setGrupos] = useState(historiasDemo)
  useEffect(() => {
    let vivo = true
    cargar().then((r) => {
      if (vivo && r) setGrupos(combinar(r))
    })
    return () => {
      vivo = false
    }
  }, [])
  return grupos
}

/** Clave de "visto": cambia cuando la cuenta sube una historia nueva, y el aro vuelve a encenderse. */
export const claveVisto = (g: GrupoHistorias) => `${g.id}:${g.historias.at(-1)?.id ?? ''}`
