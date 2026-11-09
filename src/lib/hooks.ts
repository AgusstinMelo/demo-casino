import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

/** Media query reactiva. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')

/** true cuando el elemento entró en pantalla (una sola vez). */
export function useInViewOnce<T extends Element>(rootMargin = '0px', threshold = 0) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin, threshold, inView])
  return [ref, inView] as const
}

type NetInfo = { saveData?: boolean; effectiveType?: string }
/** Ahorro de datos o conexión lenta: no cargar videos. */
export function prefersLightData(): boolean {
  const c = (navigator as Navigator & { connection?: NetInfo }).connection
  if (!c) return false
  return !!c.saveData || /(^|-)2g$/.test(c.effectiveType ?? '')
}

/** Bloquea el scroll del fondo mientras hay un modal abierto. */
export function useLockBody(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    window.dispatchEvent(new CustomEvent('casino:lenis', { detail: 'stop' }))
    return () => {
      document.documentElement.style.overflow = prev
      window.dispatchEvent(new CustomEvent('casino:lenis', { detail: 'start' }))
    }
  }, [locked])
}

/** Atrapa el foco dentro de un contenedor (modales, visor de historias) y cierra con Escape. */
export function useFocusTrap<T extends HTMLElement>(active: boolean, onEscape?: () => void) {
  const ref = useRef<T>(null)
  const escRef = useRef(onEscape)
  useEffect(() => {
    escRef.current = onEscape
  })
  useEffect(() => {
    if (!active) return
    const el = ref.current
    if (!el) return
    const previo = document.activeElement as HTMLElement | null
    const selector = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
    const first = el.querySelector<HTMLElement>('[data-autofocus]') ?? el.querySelector<HTMLElement>(selector)
    first?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        escRef.current?.()
        return
      }
      if (e.key !== 'Tab') return
      const nodes = Array.from(el.querySelectorAll<HTMLElement>(selector)).filter((n) => n.getClientRects().length > 0)
      if (!nodes.length) return
      const a = nodes[0]
      const b = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault()
        b.focus()
      } else if (!e.shiftKey && document.activeElement === b) {
        e.preventDefault()
        a.focus()
      }
    }
    el.addEventListener('keydown', onKey)
    return () => {
      el.removeEventListener('keydown', onKey)
      previo?.focus?.()
    }
  }, [active])
  return ref
}
