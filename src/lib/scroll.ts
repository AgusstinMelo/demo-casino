import type Lenis from 'lenis'

let lenis: Lenis | null = null
export const setLenis = (l: Lenis | null) => {
  lenis = l
}
export const getLenis = () => lenis

/** ¿El navegador soporta CSS scroll-driven animations? */
export const supportsScrollTimeline = () => typeof CSS !== 'undefined' && !!CSS.supports?.('animation-timeline: view()')

/** Aire entre el header flotante y el primer contenido de la sección. */
const AIRE = 24
/** Cuánto esperamos, como máximo, a que se monten las secciones diferidas. */
const ESPERA_MAX = 3000

let seq = 0

/** Alto del header en su estado "compacto" (el que tiene una vez que scrolleaste). */
function altoHeader() {
  const pill = document.querySelector('header')?.firstElementChild as HTMLElement | null
  // py-2 del header compacto (8px) + alto de la píldora
  return 8 + (pill?.offsetHeight ?? 64)
}

/**
 * Posición de un elemento en el documento según el layout, ignorando
 * transforms (las animaciones de entrada lo desplazan mientras no se vio).
 */
function topLayout(n: HTMLElement) {
  let y = 0
  let cur: HTMLElement | null = n
  while (cur) {
    y += cur.offsetTop
    cur = cur.offsetParent as HTMLElement | null
  }
  return y
}

/** Posición de scroll para un id: alinea el kicker de la sección a una altura fija. */
function destino(id: string) {
  const el = document.getElementById(id)
  if (!el) return null
  // El kicker (línea amarilla + título chico) queda SIEMPRE a la misma altura:
  // justo debajo del header, con el mismo aire en todas las secciones.
  const ancla = (el.querySelector('.kicker') ?? el.querySelector('h2, h3') ?? el) as HTMLElement
  const top = topLayout(ancla) - (altoHeader() + AIRE)
  const max = document.documentElement.scrollHeight - window.innerHeight
  return Math.max(0, Math.min(top, max))
}

/** Espera a que no queden secciones cargando y el layout deje de moverse. */
function esperarLayout(id: string, token: number): Promise<void> {
  return new Promise((resolve) => {
    const inicio = performance.now()
    let ultimo = NaN
    let estables = 0
    const tick = () => {
      if (token !== seq) return resolve()
      const cargando = document.querySelector('[aria-busy="true"]')
      const t = destino(id)
      estables = !cargando && t !== null && Math.abs(t - ultimo) < 1 ? estables + 1 : 0
      ultimo = t ?? NaN
      if (estables >= 4 || performance.now() - inicio > ESPERA_MAX) resolve()
      else requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

function irA(y: number, immediate: boolean, onComplete?: () => void) {
  if (lenis) lenis.scrollTo(y, { immediate, duration: 1.2, force: true, onComplete })
  else {
    window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' })
    if (onComplete) window.setTimeout(onComplete, immediate ? 0 : 900)
  }
}

/**
 * Scroll suave a un id (usa Lenis si está activo).
 * Primero monta todas las secciones diferidas y espera a que el layout se
 * asiente, para calcular el destino con los altos reales. Al terminar, corrige
 * si algo cambió de tamaño durante la animación.
 */
export async function scrollToId(id: string, opts: { immediate?: boolean } = {}) {
  const token = ++seq
  window.dispatchEvent(new Event('casino:montar-todo'))
  await esperarLayout(id, token)
  if (token !== seq) return
  const y = destino(id)
  if (y === null) return
  irA(y, !!opts.immediate, () => {
    if (token !== seq) return
    const y2 = destino(id)
    if (y2 !== null && Math.abs(y2 - window.scrollY) > 2) irA(y2, true)
  })
}
